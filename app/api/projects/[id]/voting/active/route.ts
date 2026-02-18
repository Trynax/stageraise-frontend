import { NextRequest, NextResponse } from 'next/server'
import { createPublicClient, formatUnits, http } from 'viem'
import type { Abi } from 'viem'
import { bscTestnet } from 'viem/chains'
import { prisma } from '@/lib/prisma'
import { getStageRaiseAddress } from '@/lib/contracts/addresses'
import StageRaiseABI from '@/lib/contracts/StageRaise.abi.json'

const stageRaiseABI = StageRaiseABI as Abi

interface VotingStatusResult {
  isVotingOpen: boolean
}

const client = createPublicClient({
  chain: bscTestnet,
  transport: http()
})

function normalizeVotePower(value: bigint): number {
  const parsed = Number.parseFloat(formatUnits(value, 18))
  if (!Number.isFinite(parsed)) return 0
  return parsed
}

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
        },
        votingRounds: {
          where: { isActive: true },
          orderBy: { votingStarted: 'desc' },
          take: 1
        },
      }
    })

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    // Read voting status from contract
    const contractAddress = getStageRaiseAddress(project.chainId || 97)
    const [isVotingOpen, currentStageRaw, votingEndTime, yesVotes, noVotes] = await Promise.all([
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

    const votingStatus: VotingStatusResult = { isVotingOpen }
    const endTime = Number(votingEndTime)
    const now = Math.floor(Date.now() / 1000)
    const votingWindowOpen = endTime > now
    const isOpen = votingStatus.isVotingOpen && votingWindowOpen

    if (!isOpen) {
      if (project.votingRounds[0]) {
        const endedRound = project.votingRounds[0]
        await prisma.votingRound.update({
          where: { id: endedRound.id },
          data: {
            isActive: false,
            result: endedRound.result === 'ongoing'
              ? (endedRound.yesVotes > endedRound.noVotes ? 'passed' : 'failed')
              : endedRound.result,
            votingEnded: endedRound.votingEnded || new Date(endTime * 1000),
          },
        })
      }
      return NextResponse.json({
        success: true,
        isOpen: false,
        message: 'No active voting session'
      })
    }

    const currentStage = Number(currentStageRaw)

    // Get voters from DB
    const voters = await prisma.vote.findMany({
      where: {
        projectId: project.id,
        milestoneStage: currentStage
      },
      orderBy: { createdAt: 'desc' }
    })

    // Calculate percentages
    const totalRaw = yesVotes + noVotes
    const yesPercent = totalRaw > BigInt(0) ? Number((yesVotes * BigInt(100)) / totalRaw) : 0
    const noPercent = totalRaw > BigInt(0) ? Number((noVotes * BigInt(100)) / totalRaw) : 0
    const yesVotesDisplay = normalizeVotePower(yesVotes)
    const noVotesDisplay = normalizeVotePower(noVotes)
    const totalVotesDisplay = yesVotesDisplay + noVotesDisplay

    // Time remaining
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
    const activeRound = project.votingRounds[0]
    const roundProof =
      activeRound?.proofDocuments && typeof activeRound.proofDocuments === 'object'
        ? activeRound.proofDocuments as { summary?: string; files?: Array<{ url?: string; filename?: string; mediaType?: string }> }
        : null
    const proofFiles = Array.isArray(roundProof?.files)
      ? roundProof.files
          .filter((file) => typeof file?.url === 'string' && (file.url || '').length > 0)
          .map((file) => ({
            url: file.url as string,
            filename: typeof file?.filename === 'string' ? file.filename : 'proof',
            mediaType: file?.mediaType === 'video' ? 'video' : 'image'
          }))
      : []

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
        votesForYes: yesVotesDisplay.toString(),
        votesForNo: noVotesDisplay.toString(),
        yesPercent,
        noPercent,
        totalVoters: totalVotesDisplay,
        proofSummary: typeof roundProof?.summary === 'string' ? roundProof.summary : null,
        proofDocuments: proofFiles,
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
