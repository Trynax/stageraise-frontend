import { NextRequest, NextResponse } from 'next/server'
import { createPublicClient, http } from 'viem'
import { bscTestnet } from 'viem/chains'
import { prisma } from '@/lib/prisma'
import { getStageRaiseAddress } from '@/lib/contracts/addresses'
import StageRaiseABI from '@/lib/contracts/StageRaise.abi.json'

const stageRaiseABI = StageRaiseABI as any

const client = createPublicClient({
  chain: bscTestnet,
  transport: http()
})

// POST /api/sync/voting/open - Sync voting session opening
export async function POST(request: NextRequest) {
  try {
    const { projectId, chainId, action } = await request.json()

    if (!projectId) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      )
    }

    const contractAddress = getStageRaiseAddress(chainId || 97)

    // Get current project data from contract
    const [votingStatus, milestoneStage, votingEndTime, yesVotes, noVotes] = await Promise.all([
      client.readContract({
        address: contractAddress,
        abi: stageRaiseABI,
        functionName: 'getProjectMileStoneVotingStatus',
        args: [projectId]
      }) as Promise<boolean>,
      client.readContract({
        address: contractAddress,
        abi: stageRaiseABI,
        functionName: 'getProjectMilestoneStage',
        args: [projectId]
      }) as Promise<number>,
      client.readContract({
        address: contractAddress,
        abi: stageRaiseABI,
        functionName: 'getProjectVotingEndTime',
        args: [projectId]
      }) as Promise<bigint>,
      client.readContract({
        address: contractAddress,
        abi: stageRaiseABI,
        functionName: 'getProjectYesVotes',
        args: [projectId]
      }) as Promise<bigint>,
      client.readContract({
        address: contractAddress,
        abi: stageRaiseABI,
        functionName: 'getProjectNoVotes',
        args: [projectId]
      }) as Promise<bigint>
    ])

    // Find project in database
    const project = await prisma.project.findUnique({
      where: { projectId }
    })

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    if (action === 'open' && votingStatus) {
      // Create or update voting round
      const votingRound = await prisma.votingRound.upsert({
        where: {
          projectId_milestoneStage_votingStarted: {
            projectId: project.id,
            milestoneStage: Number(milestoneStage),
            votingStarted: new Date()
          }
        },
        update: {
          votingEnded: new Date(Number(votingEndTime) * 1000)
        },
        create: {
          projectId: project.id,
          milestoneStage: Number(milestoneStage),
          votingStarted: new Date(),
          votingEnded: new Date(Number(votingEndTime) * 1000),
          result: 'ongoing',
          isActive: true
        }
      })

      return NextResponse.json({
        success: true,
        votingRound
      })
    }

    if (action === 'finalize') {
      // Find and update voting round with results
      const votingRounds = await prisma.votingRound.findMany({
        where: {
          projectId: project.id,
          milestoneStage: Number(milestoneStage),
          isActive: true
        },
        orderBy: { votingStarted: 'desc' },
        take: 1
      })

      if (votingRounds.length > 0) {
        const votingRound = votingRounds[0]
        const passed = yesVotes > noVotes

        await prisma.votingRound.update({
          where: { id: votingRound.id },
          data: {
            result: passed ? 'passed' : 'failed',
            yesVotes: Number(yesVotes),
            noVotes: Number(noVotes),
            votingEnded: new Date(),
            isActive: false
          }
        })

        // Update project milestone stage
        const newMilestoneStage = await client.readContract({
          address: contractAddress,
          abi: stageRaiseABI,
          functionName: 'getProjectMilestoneStage',
          args: [projectId]
        }) as Promise<number>

        await prisma.project.update({
          where: { id: project.id },
          data: {
            currentMilestone: Number(newMilestoneStage)
          }
        })

        return NextResponse.json({
          success: true,
          passed,
          newMilestoneStage: Number(newMilestoneStage)
        })
      }
    }

    return NextResponse.json({
      success: true,
      votingStatus
    })
  } catch (error) {
    console.error('Sync voting error:', error)
    return NextResponse.json(
      { error: 'Failed to sync voting', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
