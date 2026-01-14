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

// POST /api/sync/withdrawals - Sync withdrawal from blockchain
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

    const withdrawerAddress = tx.from

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

    // Parse withdrawal amount from transaction input
    // withdrawMilestoneFunds(uint32 _projectId, uint96 _amount)
    const amountHex = '0x' + tx.input.slice(74, 138)
    const withdrawalAmount = BigInt(amountHex)

    const token = getTokenByAddress(project.paymentToken)

    // Create activity record for the project creator
    await prisma.activity.create({
      data: {
        userAddress: withdrawerAddress.toLowerCase(),
        projectId: project.id,
        type: 'withdrew',
        title: `You withdrew milestone funds (${project.name})`,
        amount: Number(withdrawalAmount) / 1e18,
        tokenSymbol: token?.symbol || 'BUSD',
        txHash: transactionHash
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Withdrawal activity recorded'
    })
  } catch (error) {
    console.error('Sync withdrawal error:', error)
    return NextResponse.json(
      { error: 'Failed to sync withdrawal', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
