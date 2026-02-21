import { NextRequest, NextResponse } from 'next/server'
import { createPublicClient, http } from 'viem'
import type { Abi } from 'viem'
import { bscTestnet } from 'viem/chains'
import { prisma } from '@/lib/prisma'
import { getStageRaiseAddress } from '@/lib/contracts/addresses'
import StageRaiseABI from '@/lib/contracts/StageRaise.abi.json'
import { Prisma } from '@prisma/client'

const stageRaiseABI = StageRaiseABI as Abi

const client = createPublicClient({
  chain: bscTestnet,
  transport: http()
})

interface ProjectByIdMilestoneShape {
  timeForMilestoneVotingProcess?: unknown
}

interface ProjectByIdContractResult {
  milestone?: unknown
}

function toNumber(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'bigint') {
    const converted = Number(value)
    return Number.isFinite(converted) ? converted : null
  }
  return null
}

function extractVotingPeriodSeconds(projectByIdData: ProjectByIdContractResult | readonly unknown[]): number | null {
  const fromNamedMilestone = (() => {
    if (!projectByIdData || typeof projectByIdData !== 'object' || Array.isArray(projectByIdData)) return null
    const milestone = (projectByIdData as ProjectByIdContractResult).milestone
    if (!milestone) return null

    if (Array.isArray(milestone)) {
      return toNumber(milestone[0])
    }

    if (typeof milestone === 'object') {
      return toNumber((milestone as ProjectByIdMilestoneShape).timeForMilestoneVotingProcess)
    }

    return null
  })()

  if (fromNamedMilestone && fromNamedMilestone > 0) return fromNamedMilestone

  if (Array.isArray(projectByIdData)) {
    const milestoneTuple = projectByIdData[1]
    if (Array.isArray(milestoneTuple)) {
      const fromTuple = toNumber(milestoneTuple[0])
      if (fromTuple && fromTuple > 0) return fromTuple
    }
    if (milestoneTuple && typeof milestoneTuple === 'object') {
      const fromTupleNamed = toNumber(
        (milestoneTuple as ProjectByIdMilestoneShape).timeForMilestoneVotingProcess
      )
      if (fromTupleNamed && fromTupleNamed > 0) return fromTupleNamed
    }
  }

  return null
}

interface MilestoneMetadataInput {
  stage?: unknown
  title?: unknown
  description?: unknown
  deliverables?: unknown
}

interface SyncProjectMetadata {
  tags?: unknown
  milestones?: unknown
  votingPeriodDays?: unknown
  category?: unknown
  coverImageUrl?: unknown
  logoUrl?: unknown
  galleryImageUrls?: unknown
  websiteUrl?: unknown
  twitterUrl?: unknown
  discordUrl?: unknown
  telegramUrl?: unknown
}

interface SyncProjectBody {
  transactionHash?: string
  chainId?: number
  metadata?: SyncProjectMetadata
}

// POST /api/projects/sync - Sync a project from blockchain to database after creation
export async function POST(request: NextRequest) {
  try {
    const { transactionHash, chainId, metadata } = (await request.json()) as SyncProjectBody

    if (!transactionHash) {
      return NextResponse.json(
        { error: 'Transaction hash is required' },
        { status: 400 }
      )
    }

    const tags = Array.isArray(metadata?.tags) ? metadata.tags.filter((t): t is string => typeof t === 'string') : []
    const milestonesMetadata = Array.isArray(metadata?.milestones)
      ? (metadata.milestones as MilestoneMetadataInput[])
      : []

    // Get transaction receipt
    await client.waitForTransactionReceipt({
      hash: transactionHash as `0x${string}`
    })

    const contractAddress = getStageRaiseAddress(chainId || 97)
    
    // Get project count to determine the new project ID (current count is the new project)
    const projectCount = await client.readContract({
      address: contractAddress,
      abi: stageRaiseABI,
      functionName: 'getProjectCount'
    }) as number | bigint

    const projectId = Number(projectCount) // The newly created project

    // Fetch project details from the contract and configured milestone voting period
    const [projectInfo, projectByIdData] = await Promise.all([
      client.readContract({
        address: contractAddress,
        abi: stageRaiseABI,
        functionName: 'getProjectBasicInfo',
        args: [projectId]
      }) as Promise<{
        owner: string
        name: string
        description: string
        paymentToken: string
        targetAmount: bigint | number
        raisedAmount: bigint | number
        minFunding: bigint | number
        maxFunding: bigint | number
        fundingStart: bigint | number
        fundingEnd: bigint | number
        totalContributors: bigint | number
        milestoneBased: boolean
        milestoneCount: bigint | number
      }>,
      client.readContract({
        address: contractAddress,
        abi: stageRaiseABI,
        functionName: 'projectById',
        args: [projectId]
      }) as Promise<ProjectByIdContractResult | readonly unknown[]>
    ])

    const votingPeriodSeconds = extractVotingPeriodSeconds(projectByIdData)
    const votingPeriodFromChainDays = Number.isFinite(votingPeriodSeconds) && votingPeriodSeconds > 0
      ? Math.max(1, Math.ceil(votingPeriodSeconds / (24 * 60 * 60)))
      : null
    const metadataVotingPeriodDays = Number(metadata?.votingPeriodDays)
    const votingPeriodDays = votingPeriodFromChainDays
      ?? (Number.isFinite(metadataVotingPeriodDays) && metadataVotingPeriodDays > 0 ? metadataVotingPeriodDays : 7)

    // Create project in database
    // Note: All amounts from contract are in 18 decimals (normalized)
    const projectCreateData = {
      projectId,
      contractAddress,
      chainId: chainId || 97,
      ownerAddress: projectInfo.owner.toLowerCase(),
      name: projectInfo.name,
      description: projectInfo.description,
      category: typeof metadata?.category === 'string' ? metadata.category : 'Other',
      tags,
      fundingTarget: Number(projectInfo.targetAmount) / 1e18,
      fundingStart: new Date(Number(projectInfo.fundingStart) * 1000),
      fundingDeadline: new Date(Number(projectInfo.fundingEnd) * 1000),
      minContribution: Number(projectInfo.minFunding) / 1e18,
      maxContribution: Number(projectInfo.maxFunding) / 1e18,
      votingPeriodDays,
      paymentToken: projectInfo.paymentToken,
      currentMilestone: projectInfo.milestoneBased ? 1 : 0,
      failedVotingCount: 0,
      status: 'active',
        cachedRaisedAmount: Number(projectInfo.raisedAmount) / 1e18,
        cachedTotalContributors: Number(projectInfo.totalContributors),
        ...(typeof metadata?.coverImageUrl === 'string' && { coverImageUrl: metadata.coverImageUrl }),
        ...(typeof metadata?.logoUrl === 'string' && { logoUrl: metadata.logoUrl }),
        ...(Array.isArray(metadata?.galleryImageUrls) && {
          galleryImageUrls: metadata.galleryImageUrls.filter((url): url is string => typeof url === 'string'),
        }),
        ...(typeof metadata?.websiteUrl === 'string' && { websiteUrl: metadata.websiteUrl }),
        ...(typeof metadata?.twitterUrl === 'string' && { twitterUrl: metadata.twitterUrl }),
        ...(typeof metadata?.discordUrl === 'string' && { discordUrl: metadata.discordUrl }),
      ...(typeof metadata?.telegramUrl === 'string' && { telegramUrl: metadata.telegramUrl }),
      ...(projectInfo.milestoneBased && projectInfo.milestoneCount > 0 && {
        milestones: {
          create: Array.from({ length: Number(projectInfo.milestoneCount) }, (_, i) => {
            const stage = i + 1
            const provided = milestonesMetadata.find((m) => Number(m?.stage) === stage)
            return {
              stage,
              title: typeof provided?.title === 'string' && provided.title.trim().length > 0 ? provided.title : `Milestone ${stage}`,
              description: typeof provided?.description === 'string' ? provided.description : '',
              deliverables: provided?.deliverables ?? []
            }
          })
        }
      })
    }

    const project = await prisma.project.create({
      data: projectCreateData,
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
    if (
      error instanceof Prisma.PrismaClientValidationError &&
      error.message.includes('Unknown argument `fundingStart`')
    ) {
      return NextResponse.json(
        {
          error: 'Prisma client is stale after schema update. Stop dev server, run `npx prisma generate`, then start dev again.'
        },
        { status: 500 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to sync project', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
