import { NextRequest, NextResponse } from 'next/server'
import { createPublicClient, http } from 'viem'
import type { Abi } from 'viem'
import { decodeFunctionData, formatUnits } from 'viem'
import { bscTestnet } from 'viem/chains'
import { prisma } from '@/lib/prisma'
import StageRaiseABI from '@/lib/contracts/StageRaise.abi.json'
import { getTokenByAddress } from '@/lib/constants/tokens'

const stageRaiseABI = StageRaiseABI as Abi

const client = createPublicClient({
  chain: bscTestnet,
  transport: http()
})

// POST /api/sync/withdrawals - Sync withdrawal from blockchain
export async function POST(request: NextRequest) {
  try {
    const { transactionHash, projectId: contractProjectId } = await request.json()

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

    // Decode tx input using ABI instead of hardcoded offsets.
    const decoded = decodeFunctionData({
      abi: stageRaiseABI,
      data: tx.input,
    })

    if (decoded.functionName !== 'withdrawFunds') {
      return NextResponse.json(
        { error: 'Transaction is not a withdrawFunds call' },
        { status: 400 }
      )
    }

    const decodedAmount = decoded.args?.[0] as bigint | undefined
    const decodedProjectId = decoded.args?.[1] as number | bigint | undefined
    const resolvedContractProjectId = Number(decodedProjectId ?? contractProjectId)

    if (!Number.isFinite(resolvedContractProjectId)) {
      return NextResponse.json(
        { error: 'Unable to decode projectId from transaction' },
        { status: 400 }
      )
    }

    if (decodedAmount === undefined) {
      return NextResponse.json(
        { error: 'Unable to decode withdrawal amount from transaction' },
        { status: 400 }
      )
    }

    // Find project
    const project = await prisma.project.findFirst({
      where: { projectId: resolvedContractProjectId }
    })

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    const token = getTokenByAddress(project.paymentToken)
    const tokenDecimals = token?.decimals ?? 18
    const normalizedAmount = Number.parseFloat(formatUnits(decodedAmount, tokenDecimals))

    // Prevent duplicate activity for the same tx hash.
    const existingActivity = await prisma.activity.findFirst({
      where: {
        userAddress: withdrawerAddress.toLowerCase(),
        type: 'withdrew',
        txHash: transactionHash
      }
    })

    if (existingActivity) {
      await prisma.activity.update({
        where: { id: existingActivity.id },
        data: {
          projectId: project.id,
          title: `You withdrew milestone funds (${project.name})`,
          amount: normalizedAmount,
          tokenSymbol: token?.symbol || 'BUSD',
          txHash: transactionHash
        }
      })

      return NextResponse.json({
        success: true,
        message: 'Withdrawal activity updated'
      })
    }

    // Create activity record for the project creator
    await prisma.activity.create({
      data: {
        userAddress: withdrawerAddress.toLowerCase(),
        projectId: project.id,
        type: 'withdrew',
        title: `You withdrew milestone funds (${project.name})`,
        amount: normalizedAmount,
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
