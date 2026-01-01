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

// GET /api/projects/[id]/voting - Get current voting state + history
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const projectId = parseInt(params.id)
    
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

    // Read current voting status from contract (real-time)
    const votingStatus: any = await client.readContract({
      address: CONTRACT_ADDRESS,
      abi: stageRaiseABI,
      functionName: 'getVotingStatus',
      args: [BigInt(projectId)]
    })

    const isOpen = votingStatus.isVotingOpen
    const currentStage = Number(votingStatus.milestoneStage)
    const votingEndTime = votingStatus.timeForTheVotingProcessToElapsed
    const yesVotes = votingStatus.votesForYes
    const noVotes = votingStatus.votesForNo

    // Get voting history from DB
    const voteHistory = await prisma.vote.findMany({
      where: { projectId: project.id },
      orderBy: [
        { milestoneStage: 'desc' },
        { createdAt: 'desc' }
      ]
    })

    // Group by milestone stage for history
    const historyByStage = voteHistory.reduce((acc: any, vote) => {
      const stage = vote.milestoneStage
      if (!acc[stage]) {
        acc[stage] = {
          stage,
          votes: [],
          yesCount: 0,
          noCount: 0
        }
      }
      acc[stage].votes.push(vote)
      if (vote.voteYes) acc[stage].yesCount++
      else acc[stage].noCount++
      return acc
    }, {})

    const history = Object.values(historyByStage)

    // Calculate vote percentages
    const total = yesVotes + noVotes
    const yesPercent = total > BigInt(0) ? Number((yesVotes * BigInt(100)) / total) : 0
    const noPercent = total > BigInt(0) ? Number((noVotes * BigInt(100)) / total) : 0

    // Time remaining calculation
    const now = Math.floor(Date.now() / 1000)
    const endTime = Number(votingEndTime)
    const secondsRemaining = endTime - now
    const timeRemaining = secondsRemaining > 0 ? {
      days: Math.floor(secondsRemaining / 86400),
      hours: Math.floor((secondsRemaining % 86400) / 3600),
      minutes: Math.floor((secondsRemaining % 3600) / 60),
      seconds: secondsRemaining % 60
    } : null

    return NextResponse.json({
      success: true,
      voting: {
        isOpen,
        currentStage,
        votingEndTime: new Date(endTime * 1000).toISOString(),
        timeRemaining,
        votesForYes: yesVotes.toString(),
        votesForNo: noVotes.toString(),
        yesPercent,
        noPercent,
        totalVoters: voteHistory.filter(v => v.milestoneStage === currentStage).length
      },
      history,
      milestones: project.milestones
    })
  } catch (error) {
    console.error('Get voting error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch voting data' },
      { status: 500 }
    )
  }
}
