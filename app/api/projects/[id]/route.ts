import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

function serializeProject(project: any) {
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

function enrichProjectWithVoting(project: any) {
  const votingRounds = Array.isArray(project.votingRounds) ? project.votingRounds : []
  const milestones = Array.isArray(project.milestones) ? project.milestones : []

  const sortedRounds = [...votingRounds].sort(
    (a, b) => new Date(b.votingStarted).getTime() - new Date(a.votingStarted).getTime()
  )

  const activeRound = sortedRounds.find((round) => round.isActive) || null
  const activeMilestone = activeRound
    ? milestones.find((m) => m.stage === activeRound.milestoneStage)
    : null

  const votingHistory = sortedRounds.map((round) => {
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

    return {
      stage: round.milestoneStage,
      result: round.result,
      yesVotes: round.yesVotes,
      noVotes: round.noVotes,
      totalVoters: round.totalVoters || round.yesVotes + round.noVotes,
      votingStarted: round.votingStarted,
      votingEnded: round.votingEnded,
      isActive: round.isActive,
      proofSummary: typeof roundProof?.summary === 'string'
        ? roundProof.summary
        : null,
      proofDocuments: proofFiles,
    }
  })

  const activeVoting = activeRound
    ? {
        stage: activeRound.milestoneStage,
        title: activeMilestone?.title || `Milestone ${activeRound.milestoneStage}`,
        yesVotes: activeRound.yesVotes,
        noVotes: activeRound.noVotes,
        votingEndTime: activeRound.votingEnded,
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
          votes: {
            orderBy: { createdAt: 'desc' },
            take: 10 
          },
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
          votes: {
            orderBy: { createdAt: 'desc' },
            take: 10 
          },
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

    return NextResponse.json({
      success: true,
      project: serializeProject(enrichProjectWithVoting(project))
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

    const milestoneUpserts = Array.isArray(body.milestones)
      ? body.milestones
          .map((m: any) => {
            const stage = Number.parseInt(String(m?.stage), 10)
            if (!Number.isFinite(stage) || stage <= 0) return null
            return {
              stage,
              title: typeof m?.title === 'string' ? m.title : undefined,
              description: typeof m?.description === 'string' ? m.description : undefined,
              deliverables: m?.deliverables,
            }
          })
          .filter(Boolean)
      : []

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
            upsert: milestoneUpserts.map((m: any) => ({
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
