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

// POST /api/projects/sync - Sync a project from blockchain to database after creation
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

    const contractAddress = getStageRaiseAddress(chainId || 97)
    
    // Get project count to determine the new project ID (current count is the new project)
    const projectCount: any = await client.readContract({
      address: contractAddress,
      abi: stageRaiseABI,
      functionName: 'getProjectCount'
    })

    const projectId = Number(projectCount) // The newly created project

    // Fetch project details from the contract using getProjectBasicInfo
    const projectInfo = await client.readContract({
      address: contractAddress,
      abi: stageRaiseABI,
      functionName: 'getProjectBasicInfo',
      args: [projectId]
    }) as any

    // Create project in database
    // Note: All amounts from contract are in 18 decimals (normalized)
    const project = await prisma.project.create({
      data: {
        projectId,
        contractAddress,
        chainId: chainId || 97,
        ownerAddress: projectInfo.owner.toLowerCase(),
        name: projectInfo.name,
        description: projectInfo.description,
        category: 'Other', // Will be updated via API later
        tags: [],
        fundingTarget: Number(projectInfo.targetAmount) / 1e18,
        fundingDeadline: new Date(Number(projectInfo.deadline) * 1000),
        minContribution: Number(projectInfo.minFunding) / 1e18,
        maxContribution: Number(projectInfo.maxFunding) / 1e18,
        votingPeriodDays: 7, // Default, can be updated later
        paymentToken: projectInfo.paymentToken,
        currentMilestone: projectInfo.milestoneBased ? 1 : 0,
        failedVotingCount: 0,
        status: 'active',
        cachedRaisedAmount: Number(projectInfo.raisedAmount) / 1e18,
        cachedTotalContributors: Number(projectInfo.totalContributors),
        // Create milestones if it's milestone-based
        ...(projectInfo.milestoneBased && projectInfo.milestoneCount > 0 && {
          milestones: {
            create: Array.from({ length: Number(projectInfo.milestoneCount) }, (_, i) => ({
              stage: i + 1,
              title: `Milestone ${i + 1}`,
              description: 'Please update this milestone description',
              deliverables: []
            }))
          }
        })
      },
      include: {
        milestones: true
      }
    })

    return NextResponse.json({
      success: true,
      projectId: project.projectId,
      project
    })
  } catch (error) {
    console.error('Sync project error:', error)
    return NextResponse.json(
      { error: 'Failed to sync project', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
