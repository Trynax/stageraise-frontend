import { NextRequest, NextResponse } from 'next/server'
import { createPublicClient, decodeFunctionData, formatUnits, http } from 'viem'
import type { Abi } from 'viem'
import { bscTestnet } from 'viem/chains'
import { prisma } from '@/lib/prisma'
import { getStageRaiseAddress } from '@/lib/contracts/addresses'
import StageRaiseABI from '@/lib/contracts/StageRaise.abi.json'

const stageRaiseABI = StageRaiseABI as Abi

const client = createPublicClient({
  chain: bscTestnet,
  transport: http()
})

function normalizeVotePower(value: bigint): number {
  const parsed = Number.parseFloat(formatUnits(value, 18))
  if (!Number.isFinite(parsed)) return 0
  return parsed
}

// POST /api/sync/votes - Sync individual vote from blockchain
export async function POST(request: NextRequest) {
  try {
    const { transactionHash, chainId } = (await request.json()) as {
      transactionHash?: string
      chainId?: number
    }

    if (!transactionHash) {
      return NextResponse.json(
        { error: 'Transaction hash is required' },
        { status: 400 }
      )
    }

    const normalizedTxHash = transactionHash.toLowerCase()

    // Idempotency: if this tx is already synced, return success
    const existingVote = await prisma.vote.findUnique({
      where: { transactionHash: normalizedTxHash },
    })
    if (existingVote) {
      return NextResponse.json({
        success: true,
        vote: existingVote,
        alreadySynced: true,
      })
    }

    // Get transaction details
    const tx = await client.getTransaction({
      hash: transactionHash as `0x${string}`
    })

    const voterAddress = tx.from

    // Decode vote input data: takeAVoteForMilestoneStageIncrease(uint32,bool)
    const decoded = decodeFunctionData({
      abi: stageRaiseABI,
      data: tx.input,
    })

    if (decoded.functionName !== 'takeAVoteForMilestoneStageIncrease') {
      return NextResponse.json(
        { error: 'Transaction is not a vote transaction' },
        { status: 400 }
      )
    }

    if (!decoded.args || decoded.args.length < 2) {
      return NextResponse.json(
        { error: 'Unable to decode vote arguments' },
        { status: 400 }
      )
    }

    const decodedProjectId = decoded.args[0] as bigint | number
    const projectId = Number(decodedProjectId)
    const voteYes = Boolean(decoded.args[1] as boolean)

    // Find project
    const project = await prisma.project.findFirst({
      where: { projectId: projectId }
    })

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    const contractAddress = getStageRaiseAddress(chainId || project.chainId || 97)
    const [isVotingOpen, milestoneStageRaw, votingEndTime, yesVotesRaw, noVotesRaw] = await Promise.all([
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

    const milestoneStage = Number(milestoneStageRaw)
    const yesVotesDisplay = normalizeVotePower(yesVotesRaw)
    const noVotesDisplay = normalizeVotePower(noVotesRaw)
    const totalVotesDisplay = yesVotesDisplay + noVotesDisplay

    // Find active voting round for this stage. If missing (sync gap), create it.
    let votingRound = await prisma.votingRound.findFirst({
      where: {
        projectId: project.id,
        milestoneStage,
        isActive: true,
      },
      orderBy: { votingStarted: 'desc' },
    })

    if (!votingRound && isVotingOpen) {
      const endMs = Number(votingEndTime) * 1000
      const startMs = endMs - Math.max(1, project.votingPeriodDays || 7) * 24 * 60 * 60 * 1000
      votingRound = await prisma.votingRound.create({
        data: {
          projectId: project.id,
          milestoneStage,
          votingStarted: new Date(startMs),
          votingEnded: new Date(endMs),
          result: 'ongoing',
          isActive: true,
          yesVotes: yesVotesDisplay,
          noVotes: noVotesDisplay,
          totalVoters: totalVotesDisplay,
        },
      })
    }

    if (!votingRound) {
      return NextResponse.json(
        { error: 'No active voting round found' },
        { status: 404 }
      )
    }

    const txBlockNumber = tx.blockNumber ? BigInt(tx.blockNumber) : BigInt(0)
    let txTimestamp = new Date()
    if (tx.blockNumber) {
      try {
        const block = await client.getBlock({ blockNumber: tx.blockNumber })
        txTimestamp = new Date(Number(block.timestamp) * 1000)
      } catch {
        // Fall back to now if block lookup fails.
      }
    }

    // Create vote record
    const vote = await prisma.vote.create({
      data: {
        projectId: project.id,
        votingRoundId: votingRound.id,
        voter: voterAddress.toLowerCase(),
        milestoneStage,
        voteYes,
        transactionHash: normalizedTxHash,
        blockNumber: txBlockNumber,
        timestamp: txTimestamp,
      }
    })

    const existingActivity = await prisma.activity.findFirst({
      where: {
        txHash: normalizedTxHash,
        type: 'voted',
      },
    })

    if (!existingActivity) {
      await prisma.activity.create({
        data: {
          userAddress: voterAddress.toLowerCase(),
          projectId: project.id,
          type: 'voted',
          title: `You voted ${voteYes ? 'YES' : 'NO'} on Milestone ${milestoneStage} (${project.name})`,
          txHash: normalizedTxHash,
          metadata: {
            milestoneStage,
            voteYes,
          }
        }
      })
    }

    await prisma.votingRound.update({
      where: { id: votingRound.id },
      data: {
        yesVotes: yesVotesDisplay,
        noVotes: noVotesDisplay,
        totalVoters: totalVotesDisplay,
        votingEnded: new Date(Number(votingEndTime) * 1000),
        isActive: isVotingOpen,
      }
    })

    return NextResponse.json({
      success: true,
      vote
    })
  } catch (error) {
    console.error('Sync vote error:', error)
    return NextResponse.json(
      { error: 'Failed to sync vote', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
