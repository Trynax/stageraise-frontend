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

// GET /api/projects/[id]/voting/active - Get currently active voting session
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const projectId = parseInt(id)
    
    if (isNaN(projectId)) {
      return NextResponse.json(
        { error: 'Invalid project ID' },
        { status: 400 }
      )
    }

    // Get project from DB
    const project = await prisma.project.findUnique({
      where: { projectId },
      include: {
        milestones: {
          orderBy: { stage: 'asc' }
        }
      }
    })

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    // Read voting status from contract
    const votingStatus: any = await client.readContract({
      address: CONTRACT_ADDRESS,
      abi: stageRaiseABI,
      functionName: 'getVotingStatus',
      args: [BigInt(projectId)]
    })

    const isOpen = votingStatus.isVotingOpen

    if (!isOpen) {
      return NextResponse.json({
        success: true,
        isOpen: false,
        message: 'No active voting session'
      })
    }

    const currentStage = Number(votingStatus.milestoneStage)
    const votingEndTime = votingStatus.timeForTheVotingProcessToElapsed
    const yesVotes = votingStatus.votesForYes
    const noVotes = votingStatus.votesForNo

    // Get voters from DB
    const voters = await prisma.vote.findMany({
      where: {
        projectId: project.id,
        milestoneStage: currentStage
      },
      orderBy: { createdAt: 'desc' }
    })

    // Calculate percentages
    const total = yesVotes + noVotes
    const yesPercent = total > BigInt(0) ? Number((yesVotes * BigInt(100)) / total) : 0
    const noPercent = total > BigInt(0) ? Number((noVotes * BigInt(100)) / total) : 0

    // Time remaining
    const now = Math.floor(Date.now() / 1000)
    const endTime = Number(votingEndTime)
    const secondsRemaining = Math.max(0, endTime - now)
    
    const timeRemaining = {
      days: Math.floor(secondsRemaining / 86400),
      hours: Math.floor((secondsRemaining % 86400) / 3600),
      minutes: Math.floor((secondsRemaining % 3600) / 60),
      seconds: secondsRemaining % 60,
      total: secondsRemaining
    }

    // Get milestone details
    const milestone = project.milestones.find(m => m.stage === currentStage)

    return NextResponse.json({
      success: true,
      isOpen: true,
      voting: {
        projectId,
        projectName: project.name,
        milestoneStage: currentStage,
        milestoneTitle: milestone?.title || `Milestone ${currentStage}`,
        milestoneDescription: milestone?.description,
        votingEndTime: new Date(endTime * 1000).toISOString(),
        timeRemaining,
        votesForYes: yesVotes.toString(),
        votesForNo: noVotes.toString(),
        yesPercent,
        noPercent,
        totalVoters: voters.length,
        voters: voters.map(v => ({
          address: v.voter,
          voteYes: v.voteYes,
          timestamp: v.timestamp
        }))
      }
    })
  } catch (error) {
    console.error('Get active voting error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch active voting data' },
      { status: 500 }
    )
  }
}
