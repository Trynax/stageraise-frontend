import { NextRequest, NextResponse } from 'next/server'
import { createPublicClient, formatUnits, http } from 'viem'
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

// POST /api/sync/voting/open - Sync voting session opening
export async function POST(request: NextRequest) {
  try {
    const { projectId, chainId, action, proofSummary, proofDocuments } = await request.json()

    if (!projectId) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      )
    }

    const contractAddress = getStageRaiseAddress(chainId || 97)

    // Get current project data from contract
    const [votingStatus, milestoneStage, votingEndTime, yesVotes, noVotes] = await Promise.all([
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

    // Find project in database
    const project = await prisma.project.findUnique({
      where: { projectId }
    })

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    if (action === 'open' && votingStatus) {
      const normalizedProofSummary =
        typeof proofSummary === 'string' && proofSummary.trim().length > 0
          ? proofSummary.trim()
          : undefined

      const normalizedProofDocuments = Array.isArray(proofDocuments)
        ? proofDocuments
            .filter((doc: unknown) => {
              if (!doc || typeof doc !== 'object') return false
              const maybeDoc = doc as { url?: unknown; filename?: unknown; mediaType?: unknown }
              return (
                typeof maybeDoc.url === 'string' &&
                maybeDoc.url.length > 0 &&
                typeof maybeDoc.filename === 'string' &&
                maybeDoc.filename.length > 0 &&
                (maybeDoc.mediaType === 'image' || maybeDoc.mediaType === 'video')
              )
            })
            .map((doc) => ({
              url: (doc as { url: string }).url,
              filename: (doc as { filename: string }).filename,
              mediaType: (doc as { mediaType: 'image' | 'video' }).mediaType
            }))
        : []

      const proofPayload =
        normalizedProofSummary || normalizedProofDocuments.length > 0
          ? {
              summary: normalizedProofSummary ?? null,
              files: normalizedProofDocuments,
            }
          : undefined

      const stage = Number(milestoneStage)
      const activeRound = await prisma.votingRound.findFirst({
        where: {
          projectId: project.id,
          milestoneStage: stage,
          isActive: true,
        },
        orderBy: { createdAt: 'desc' },
      })

      const votingRound = activeRound
        ? await prisma.votingRound.update({
            where: { id: activeRound.id },
            data: {
              votingEnded: new Date(Number(votingEndTime) * 1000),
              ...(proofPayload && { proofDocuments: proofPayload }),
            },
          })
        : await prisma.votingRound.create({
            data: {
              projectId: project.id,
              milestoneStage: stage,
              votingStarted: new Date(),
              votingEnded: new Date(Number(votingEndTime) * 1000),
              result: 'ongoing',
              isActive: true,
              ...(proofPayload && { proofDocuments: proofPayload }),
            },
          })

      return NextResponse.json({
        success: true,
        votingRound
      })
    }

    if (action === 'finalize') {
      // Find and update voting round with results
      const votingRounds = await prisma.votingRound.findMany({
        where: {
          projectId: project.id,
          milestoneStage: Number(milestoneStage),
          isActive: true
        },
        orderBy: { votingStarted: 'desc' },
        take: 1
      })

      if (votingRounds.length > 0) {
        const votingRound = votingRounds[0]
        const passed = yesVotes > noVotes

        await prisma.votingRound.update({
          where: { id: votingRound.id },
          data: {
            result: passed ? 'passed' : 'failed',
            yesVotes: normalizeVotePower(yesVotes),
            noVotes: normalizeVotePower(noVotes),
            totalVoters: normalizeVotePower(yesVotes) + normalizeVotePower(noVotes),
            votingEnded: new Date(),
            isActive: false
          }
        })

        // Update project milestone and failed voting counters from chain
        const [newMilestoneStage, failedMilestoneStage] = await Promise.all([
          client.readContract({
            address: contractAddress,
            abi: stageRaiseABI,
            functionName: 'getProjectMilestoneStage',
            args: [projectId]
          }) as Promise<number>,
          client.readContract({
            address: contractAddress,
            abi: stageRaiseABI,
            functionName: 'getProjectFailedMilestoneStage',
            args: [projectId]
          }) as Promise<number>
        ])

        await prisma.project.update({
          where: { id: project.id },
          data: {
            currentMilestone: Number(newMilestoneStage),
            failedVotingCount: Number(failedMilestoneStage),
            ...(Number(failedMilestoneStage) >= 3 && { status: 'refundable' })
          }
        })

        return NextResponse.json({
          success: true,
          passed,
          newMilestoneStage: Number(newMilestoneStage),
          failedMilestoneStage: Number(failedMilestoneStage)
        })
      }
    }

    return NextResponse.json({
      success: true,
      votingStatus
    })
  } catch (error) {
    console.error('Sync voting error:', error)
    return NextResponse.json(
      { error: 'Failed to sync voting', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
