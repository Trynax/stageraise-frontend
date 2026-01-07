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

// POST /api/sync/votes - Sync individual vote from blockchain
export async function POST(request: NextRequest) {
  try {
    const { transactionHash, chainId } = await request.json()

    if (!transactionHash) {
      return NextResponse.json(
        { error: 'Transaction hash is required' },
        { status: 400 }
      )
    }

    // Get transaction details
    const tx = await client.getTransaction({
      hash: transactionHash as `0x${string}`
    })

    const voterAddress = tx.from

    // Decode the function call
    // Parse transaction input to get projectId and vote
    // takeAVoteForMilestoneStageIncrease(uint32 _projectId, bool _vote)
    // Function selector: first 4 bytes
    // _projectId: bytes 4-36 (uint32 padded to 32 bytes)
    // _vote: bytes 36-68 (bool padded to 32 bytes)
    const projectId = parseInt('0x' + tx.input.slice(10, 74), 16)
    const voteYes = parseInt('0x' + tx.input.slice(74, 138), 16) === 1

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

    // Find active voting round for this project
    const votingRounds = await prisma.votingRound.findMany({
      where: {
        projectId: project.id,
        isActive: true
      },
      orderBy: { votingStarted: 'desc' },
      take: 1
    })

    if (votingRounds.length === 0) {
      return NextResponse.json(
        { error: 'No active voting round found' },
        { status: 404 }
      )
    }

    const votingRound = votingRounds[0]

    // Get voting power from contract
    const contractAddress = getStageRaiseAddress(chainId || 97)
    const votingPower = await client.readContract({
      address: contractAddress,
      abi: stageRaiseABI,
      functionName: 'calculateFunderVotingPower',
      args: [voterAddress, BigInt(projectId)]
    }) as bigint

    // Create vote record
    const vote = await prisma.vote.create({
      data: {
        projectId: project.id,
        votingRoundId: votingRound.id,
        voter: voterAddress.toLowerCase(),
        milestoneStage: votingRound.milestoneStage,
        voteYes: voteYes,
        transactionHash,
        blockNumber: BigInt(tx.blockNumber || 0),
        timestamp: new Date()
      }
    })

    // Update voting round totals
    const [yesVotes, noVotes] = await Promise.all([
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

    await prisma.votingRound.update({
      where: { id: votingRound.id },
      data: {
        yesVotes: Number(yesVotes),
        noVotes: Number(noVotes),
        totalVoters: { increment: 1 }
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
