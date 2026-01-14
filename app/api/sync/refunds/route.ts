import { NextRequest, NextResponse } from 'next/server'
import { createPublicClient, http } from 'viem'
import { bscTestnet } from 'viem/chains'
import { prisma } from '@/lib/prisma'
import { getStageRaiseAddress } from '@/lib/contracts/addresses'
import StageRaiseABI from '@/lib/contracts/StageRaise.abi.json'
import { getTokenByAddress } from '@/lib/constants/tokens'

const stageRaiseABI = StageRaiseABI as any

const client = createPublicClient({
  chain: bscTestnet,
  transport: http()
})

// POST /api/sync/refunds - Sync refund request from blockchain
export async function POST(request: NextRequest) {
  try {
    const { transactionHash, chainId, projectId: contractProjectId } = await request.json()

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

    const refunderAddress = tx.from

    // Find project
    const project = await prisma.project.findFirst({
      where: { projectId: contractProjectId }
    })

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    // Get the user's contribution to calculate refund amount
    const contribution = await prisma.contribution.aggregate({
      where: {
        projectId: project.id,
        contributor: {
          equals: refunderAddress.toLowerCase(),
          mode: 'insensitive'
        }
      },
      _sum: {
        amount: true
      }
    })

    const refundAmount = contribution._sum.amount || 0

    const token = getTokenByAddress(project.paymentToken)

    // Create activity record for the refund requester
    await prisma.activity.create({
      data: {
        userAddress: refunderAddress.toLowerCase(),
        projectId: project.id,
        type: 'refund_requested',
        title: `Refund requested for "${project.name}"`,
        amount: refundAmount,
        tokenSymbol: token?.symbol || 'BUSD',
        txHash: transactionHash
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Refund activity recorded'
    })
  } catch (error) {
    console.error('Sync refund error:', error)
    return NextResponse.json(
      { error: 'Failed to sync refund', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
