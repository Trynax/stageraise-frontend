import { NextRequest, NextResponse } from 'next/server'
import { createPublicClient, formatUnits, http } from 'viem'
import type { Abi } from 'viem'
import { bscTestnet } from 'viem/chains'
import type { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { getStageRaiseAddress } from '@/lib/contracts/addresses'
import StageRaiseABI from '@/lib/contracts/StageRaise.abi.json'

const stageRaiseABI = StageRaiseABI as Abi

function normalizeVotePower(value: bigint): number {
  const parsed = Number.parseFloat(formatUnits(value, 18))
  if (!Number.isFinite(parsed)) return 0
  return parsed
}

function normalizeStoredVoteValue(value: number): number {
  if (!Number.isFinite(value)) return 0
  // Backward compatibility for previously stored raw uint256 values.
  if (Math.abs(value) >= 1_000_000_000_000) {
    return value / 1e18
  }
  return value
}

async function fetchLiveVotingSnapshot(chainId: number, projectId: number) {
  try {
    const contractAddress = getStageRaiseAddress(chainId)
    const client = createPublicClient({
      chain: bscTestnet,
      transport: http(),
    })

    const [isVotingOpen, milestoneStageRaw, votingEndTimeRaw, yesVotesRaw, noVotesRaw] = await Promise.all([
      client.readContract({
        address: contractAddress,
        abi: stageRaiseABI,
        functionName: 'getProjectMileStoneVotingStatus',
        args: [projectId],
      }) as Promise<boolean>,
      client.readContract({
        address: contractAddress,
        abi: stageRaiseABI,
        functionName: 'getProjectMilestoneStage',
        args: [projectId],
      }) as Promise<number>,
      client.readContract({
        address: contractAddress,
        abi: stageRaiseABI,
        functionName: 'getProjectVotingEndTime',
        args: [projectId],
      }) as Promise<bigint>,
      client.readContract({
        address: contractAddress,
        abi: stageRaiseABI,
        functionName: 'getProjectYesVotes',
        args: [projectId],
      }) as Promise<bigint>,
      client.readContract({
        address: contractAddress,
        abi: stageRaiseABI,
        functionName: 'getProjectNoVotes',
        args: [projectId],
      }) as Promise<bigint>,
    ])

    return {
      isVotingOpen,
      milestoneStage: Number(milestoneStageRaw),
      votingEnded: new Date(Number(votingEndTimeRaw) * 1000),
      yesVotes: normalizeVotePower(yesVotesRaw),
      noVotes: normalizeVotePower(noVotesRaw),
    }
  } catch {
    return null
  }
}

function serializeProject<T>(project: T): T {
  return JSON.parse(JSON.stringify(project, (key, value) =>
    typeof value === 'bigint' ? Number(value) : value
  ))
}

interface RoundProofFile {
  url?: unknown
  filename?: unknown
  mediaType?: unknown
}

interface RoundProofPayload {
  summary?: unknown
  files?: unknown
}

interface ProjectVotingRoundShape {
  id: string
  milestoneStage: number
  result: string
  yesVotes: number
  noVotes: number
  totalVoters: number
  votingStarted: Date | string
  votingEnded?: Date | string | null
  isActive: boolean
  proofDocuments?: unknown
}

interface ProjectMilestoneShape {
  stage: number
  title?: string | null
}

interface ProjectVoteShape {
  voter: string
  voteYes: boolean
  milestoneStage: number
  votingRoundId?: string | null
}

interface ProjectWithVotingRelations {
  votingRounds?: ProjectVotingRoundShape[] | null
  milestones?: ProjectMilestoneShape[] | null
  votes?: ProjectVoteShape[] | null
  [key: string]: unknown
}

function enrichProjectWithVoting<T extends ProjectWithVotingRelations>(
  project: T,
  voterAddress?: string | null
) {
  const votingRounds = Array.isArray(project.votingRounds) ? project.votingRounds : []
  const milestones = Array.isArray(project.milestones) ? project.milestones : []
  const votes = Array.isArray(project.votes) ? project.votes : []
  const normalizedVoter = typeof voterAddress === 'string' ? voterAddress.toLowerCase() : null
  const userVotes = normalizedVoter
    ? votes.filter((vote) => vote.voter.toLowerCase() === normalizedVoter)
    : []
  const userVoteByRoundId = new Map<string, boolean>()
  const userVoteByStage = new Map<number, boolean>()
  for (const vote of userVotes) {
    if (typeof vote.votingRoundId === 'string' && !userVoteByRoundId.has(vote.votingRoundId)) {
      userVoteByRoundId.set(vote.votingRoundId, vote.voteYes)
    }
    if (!userVoteByStage.has(vote.milestoneStage)) {
      userVoteByStage.set(vote.milestoneStage, vote.voteYes)
    }
  }

  const sortedRounds = [...votingRounds].sort(
    (a, b) => new Date(b.votingStarted).getTime() - new Date(a.votingStarted).getTime()
  )

  const activeRound = sortedRounds.find((round) => round.isActive) || null
  const activeMilestone = activeRound
    ? milestones.find((m) => m.stage === activeRound.milestoneStage)
    : null

  const votingHistory = sortedRounds.map((round) => {
    const normalizedYesVotes = normalizeStoredVoteValue(round.yesVotes)
    const normalizedNoVotes = normalizeStoredVoteValue(round.noVotes)
    const normalizedTotalVotes = normalizedYesVotes + normalizedNoVotes
    const roundProof =
      round?.proofDocuments && typeof round.proofDocuments === 'object'
        ? round.proofDocuments as RoundProofPayload
        : null
    const proofFiles = Array.isArray(roundProof?.files)
      ? (roundProof.files as RoundProofFile[])
          .filter((file) => typeof file?.url === 'string' && file.url.length > 0)
          .map((file) => ({
            url: file.url as string,
            filename: typeof file?.filename === 'string' ? file.filename : 'proof',
            mediaType: file?.mediaType === 'video' ? 'video' : 'image',
          }))
      : []

    const roundUserVote = userVoteByRoundId.get(round.id)
    const stageUserVote = userVoteByStage.get(round.milestoneStage)
    const resolvedUserVote = roundUserVote ?? stageUserVote

    return {
      stage: round.milestoneStage,
      result: round.result,
      yesVotes: normalizedYesVotes,
      noVotes: normalizedNoVotes,
      totalVoters: normalizedTotalVotes,
      votingStarted: round.votingStarted,
      votingEnded: round.votingEnded,
      isActive: round.isActive,
      proofSummary: typeof roundProof?.summary === 'string'
        ? roundProof.summary
        : null,
      proofDocuments: proofFiles,
      userHasVoted: typeof resolvedUserVote === 'boolean',
      userVote: resolvedUserVote === true ? 'yes' : resolvedUserVote === false ? 'no' : null,
    }
  })

  const activeVoting = activeRound
    ? {
        stage: activeRound.milestoneStage,
        title: activeMilestone?.title || `Milestone ${activeRound.milestoneStage}`,
        yesVotes: normalizeStoredVoteValue(activeRound.yesVotes),
        noVotes: normalizeStoredVoteValue(activeRound.noVotes),
        votingEndTime: activeRound.votingEnded,
        userHasVoted: typeof (userVoteByRoundId.get(activeRound.id) ?? userVoteByStage.get(activeRound.milestoneStage)) === 'boolean',
        userVote: (() => {
          const resolved = userVoteByRoundId.get(activeRound.id) ?? userVoteByStage.get(activeRound.milestoneStage)
          return resolved === true ? 'yes' : resolved === false ? 'no' : null
        })(),
      }
    : null

  return {
    ...project,
    votingHistory,
    activeVoting,
  }
}


export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const voterQuery = request.nextUrl.searchParams.get('voter')
    const normalizedVoter = voterQuery ? voterQuery.toLowerCase() : null
    const votesInclude = normalizedVoter
      ? {
          where: { voter: normalizedVoter },
          orderBy: { createdAt: 'desc' as const },
          take: 50,
        }
      : {
          orderBy: { createdAt: 'desc' as const },
          take: 10,
        }
    
    // Try to find by database UUID first, then by numeric projectId
    let project
    const numericId = parseInt(id)
    
    if (isNaN(numericId)) {
      // It's a UUID, query by database id
      project = await prisma.project.findUnique({
        where: { id },
        include: {
          milestones: {
            orderBy: { stage: 'asc' }
          },
          contributions: {
            orderBy: { createdAt: 'desc' },
            take: 10 
          },
          votes: votesInclude,
          votingRounds: {
            orderBy: { votingStarted: 'desc' }
          },
          updates: {
            orderBy: { createdAt: 'desc' }
          },
          _count: {
            select: {
              contributions: true,
              votes: true,
              updates: true
            }
          }
        }
      })
    } else {
      // It's numeric, query by projectId
      project = await prisma.project.findUnique({
        where: { projectId: numericId },
        include: {
          milestones: {
            orderBy: { stage: 'asc' }
          },
          contributions: {
            orderBy: { createdAt: 'desc' },
            take: 10 
          },
          votes: votesInclude,
          votingRounds: {
            orderBy: { votingStarted: 'desc' }
          },
          updates: {
            orderBy: { createdAt: 'desc' }
          },
          _count: {
            select: {
              contributions: true,
              votes: true,
              updates: true
            }
          }
        }
      })
    }

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    const liveSnapshot = await fetchLiveVotingSnapshot(project.chainId, project.projectId)
    if (liveSnapshot && liveSnapshot.isVotingOpen) {
      const activeRound = project.votingRounds.find((round) => round.isActive)

      if (activeRound && activeRound.milestoneStage === liveSnapshot.milestoneStage) {
        activeRound.yesVotes = liveSnapshot.yesVotes
        activeRound.noVotes = liveSnapshot.noVotes
        activeRound.totalVoters = liveSnapshot.yesVotes + liveSnapshot.noVotes
        activeRound.votingEnded = liveSnapshot.votingEnded

        await prisma.votingRound.update({
          where: { id: activeRound.id },
          data: {
            yesVotes: liveSnapshot.yesVotes,
            noVotes: liveSnapshot.noVotes,
            totalVoters: liveSnapshot.yesVotes + liveSnapshot.noVotes,
            votingEnded: liveSnapshot.votingEnded,
            isActive: true,
          },
        })
      } else if (!activeRound) {
        const createdRound = await prisma.votingRound.create({
          data: {
            projectId: project.id,
            milestoneStage: liveSnapshot.milestoneStage,
            votingStarted: new Date(
              liveSnapshot.votingEnded.getTime() - Math.max(1, project.votingPeriodDays || 7) * 24 * 60 * 60 * 1000
            ),
            votingEnded: liveSnapshot.votingEnded,
            result: 'ongoing',
            isActive: true,
            yesVotes: liveSnapshot.yesVotes,
            noVotes: liveSnapshot.noVotes,
            totalVoters: liveSnapshot.yesVotes + liveSnapshot.noVotes,
          },
        })

        project.votingRounds = [createdRound, ...project.votingRounds]
      }
    }

    return NextResponse.json({
      success: true,
      project: serializeProject(enrichProjectWithVoting(project, normalizedVoter))
    })
  } catch (error) {
    console.error('Get project error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch project' },
      { status: 500 }
    )
  }
}


export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    
    // Check if existing project exists (by UUID or numeric ID)
    let existing
    const numericId = parseInt(id)
    
    if (isNaN(numericId)) {
      existing = await prisma.project.findUnique({
        where: { id }
      })
    } else {
      existing = await prisma.project.findUnique({
        where: { projectId: numericId }
      })
    }

    if (!existing) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    // TODO: Add owner verification (check wallet signature)
    // For now, anyone can update (fix this with auth)

    interface MilestoneInput {
      stage?: unknown
      title?: unknown
      description?: unknown
      deliverables?: unknown
    }

    interface MilestoneUpsertData {
      stage: number
      title?: string
      description?: string
      deliverables?: Prisma.InputJsonValue
    }

    const milestoneInputs = Array.isArray(body.milestones)
      ? (body.milestones as MilestoneInput[])
      : []

    const milestoneUpserts: MilestoneUpsertData[] = milestoneInputs
      .map((m: MilestoneInput): MilestoneUpsertData | null => {
        const stage = Number.parseInt(String(m?.stage), 10)
        if (!Number.isFinite(stage) || stage <= 0) return null
        return {
          stage,
          title: typeof m?.title === 'string' ? m.title : undefined,
          description: typeof m?.description === 'string' ? m.description : undefined,
          deliverables: m?.deliverables as Prisma.InputJsonValue | undefined,
        }
      })
      .filter((m): m is MilestoneUpsertData => m !== null)

    // Update only allowed fields - use the database UUID for update
    const project = await prisma.project.update({
      where: { id: existing.id },
      data: {
        ...(body.name && { name: body.name }),
        ...(body.category && { category: body.category }),
        ...(body.tags && { tags: body.tags }),
        ...(body.description && { description: body.description }),
        ...(body.logoUrl && { logoUrl: body.logoUrl }),
        ...(body.galleryImageUrls && { galleryImageUrls: body.galleryImageUrls }),
        ...(body.websiteUrl && { websiteUrl: body.websiteUrl }),
        ...(body.twitterUrl && { twitterUrl: body.twitterUrl }),
        ...(body.discordUrl && { discordUrl: body.discordUrl }),
        ...(body.telegramUrl && { telegramUrl: body.telegramUrl }),
        ...(milestoneUpserts.length > 0 && {
          milestones: {
            upsert: milestoneUpserts.map((m) => ({
              where: {
                projectId_stage: { projectId: existing.id, stage: m.stage },
              },
              update: {
                ...(m.title !== undefined && { title: m.title }),
                ...(m.description !== undefined && { description: m.description }),
                ...(m.deliverables !== undefined && { deliverables: m.deliverables }),
              },
              create: {
                stage: m.stage,
                title: m.title ?? `Milestone ${m.stage}`,
                description: m.description ?? '',
                deliverables: m.deliverables ?? [],
              },
            })),
          },
        }),
        updatedAt: new Date()
      },
      include: {
        milestones: true
      }
    })

    return NextResponse.json({
      success: true,
      project
    })
  } catch (error) {
    console.error('Update project error:', error)
    return NextResponse.json(
      { error: 'Failed to update project' },
      { status: 500 }
    )
  }
}
