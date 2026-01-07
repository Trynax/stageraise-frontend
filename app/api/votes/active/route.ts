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

const CONTRACT_ADDRESS = getStageRaiseAddress(97)

// GET /api/votes/active - Get all currently active voting sessions across platform
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '20')

    // Get all milestone-based projects
    const projects = await prisma.project.findMany({
      where: {
        milestones: {
          some: {}
        }
      },
      include: {
        milestones: {
          orderBy: { stage: 'asc' }
        }
      },
      take: limit
    })
    const activeVotes = await Promise.all(
      projects.map(async (project) => {
        try {
          const projectId = project.projectId

          // Call individual getter functions from the contract
          const [isVotingOpen, votingEndTime, yesVotes, noVotes, currentStage] = await Promise.all([
            client.readContract({
              address: CONTRACT_ADDRESS,
              abi: stageRaiseABI,
              functionName: 'getProjectMileStoneVotingStatus',
              args: [projectId]
            }) as Promise<boolean>,
            client.readContract({
              address: CONTRACT_ADDRESS,
              abi: stageRaiseABI,
              functionName: 'getProjectVotingEndTime',
              args: [projectId]
            }) as Promise<bigint>,
            client.readContract({
              address: CONTRACT_ADDRESS,
              abi: stageRaiseABI,
              functionName: 'getProjectYesVotes',
              args: [projectId]
            }) as Promise<bigint>,
            client.readContract({
              address: CONTRACT_ADDRESS,
              abi: stageRaiseABI,
              functionName: 'getProjectNoVotes',
              args: [projectId]
            }) as Promise<bigint>,
            client.readContract({
              address: CONTRACT_ADDRESS,
              abi: stageRaiseABI,
              functionName: 'getProjectMilestoneStage',
              args: [projectId]
            }) as Promise<number>
          ])

          if (!isVotingOpen) return null

          const endTime = Number(votingEndTime)
          const total = yesVotes + noVotes
          const yesPercent = total > BigInt(0) ? Number((yesVotes * BigInt(100)) / total) : 0
          const noPercent = total > BigInt(0) ? Number((noVotes * BigInt(100)) / total) : 0

          const now = Math.floor(Date.now() / 1000)
          const secondsRemaining = Math.max(0, endTime - now)

          const milestone = project.milestones.find(m => m.stage === currentStage)

          return {
            projectId: project.projectId,
            projectName: project.name,
            coverImageUrl: project.coverImageUrl,
            ownerAddress: project.ownerAddress,
            milestoneStage: currentStage,
            milestoneTitle: milestone?.title || `Milestone ${currentStage}`,
            votingEndTime: new Date(endTime * 1000).toISOString(),
            timeRemaining: {
              days: Math.floor(secondsRemaining / 86400),
              hours: Math.floor((secondsRemaining % 86400) / 3600),
              minutes: Math.floor((secondsRemaining % 3600) / 60),
              total: secondsRemaining
            },
            yesPercent,
            noPercent,
            totalVoters: 0 // Will be populated from DB if needed
          }
        } catch (error) {
          console.error(`Error checking project ${project.projectId}:`, error)
          return null
        }
      })
    )

    // Filter out nulls and projects without active voting
    const filtered = activeVotes.filter(v => v !== null)

    return NextResponse.json({
      success: true,
      activeVotes: filtered,
      total: filtered.length
    })
  } catch (error) {
    console.error('Get active votes error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch active votes' },
      { status: 500 }
    )
  }
}
