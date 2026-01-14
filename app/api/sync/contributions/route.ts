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

// POST /api/sync/contributions - Sync contribution from blockchain after funding
export async function POST(request: NextRequest) {
  try {
    const { transactionHash, chainId } = await request.json()

    if (!transactionHash) {
      return NextResponse.json(
        { error: 'Transaction hash is required' },
        { status: 400 }
      )
    }

    // Get transaction receipt
    const receipt = await client.waitForTransactionReceipt({
      hash: transactionHash as `0x${string}`
    })

    // Get transaction to find the funder address
    const tx = await client.getTransaction({
      hash: transactionHash as `0x${string}`
    })

    const funderAddress = tx.from
    const contractAddress = getStageRaiseAddress(chainId || 97)

    // Parse the input data to get projectId
    // fundProject(uint32 _projectId, uint96 _amount)
    const projectIdHex = '0x' + tx.input.slice(10, 74) // Skip 0x + 4 bytes function selector + pad to 32 bytes
    const projectId = parseInt(projectIdHex, 16)

    // Find the project in database
    const project = await prisma.project.findUnique({
      where: { projectId }
    })

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found in database' },
        { status: 404 }
      )
    }

    const amountHex = '0x' + tx.input.slice(74, 138) // Skip selector (8) + projectId (64 chars) = 72, read next 64 chars
    const contributionAmount = BigInt(amountHex)

    // Create contribution record
    const contribution = await prisma.contribution.create({
      data: {
        projectId: project.id,
        contributor: funderAddress.toLowerCase(),
        amount: Number(contributionAmount) / 1e18,
        transactionHash,
        blockNumber: BigInt(tx.blockNumber || 0),
        chainId: chainId || 97
      }
    })

   
    await prisma.activity.create({
      data: {
        userAddress: funderAddress.toLowerCase(),
        projectId: project.id,
        type: 'funded',
        title: `You funded "${project.name}"`,
        amount: Number(contributionAmount) / 1e18,
        tokenSymbol: project.paymentToken === '0x...' ? 'BUSD' : 'BUSD', // TODO: Map token address to symbol
        txHash: transactionHash
      }
    })

  
    const projectInfo = await client.readContract({
      address: contractAddress,
      abi: stageRaiseABI,
      functionName: 'getProjectBasicInfo',
      args: [projectId]
    }) as any

    const uniqueContributors = await prisma.contribution.groupBy({
      by: ['contributor'],
      where: { projectId: project.id }
    })

    await prisma.project.update({
      where: { id: project.id },
      data: {
        cachedRaisedAmount: Number(projectInfo.raisedAmount) / 1e18,
        cachedTotalContributors: uniqueContributors.length
      }
    })

    return NextResponse.json({
      success: true,
      contribution
    })
  } catch (error) {
    console.error('Sync contribution error:', error)
    return NextResponse.json(
      { error: 'Failed to sync contribution', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
