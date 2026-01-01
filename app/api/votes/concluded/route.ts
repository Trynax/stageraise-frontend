import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/votes/concluded - Get all concluded voting sessions
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')
    const projectId = searchParams.get('projectId')

    // Get all votes grouped by project and stage
    const votes = await prisma.vote.findMany({
      where: projectId ? {
        project: { projectId: parseInt(projectId) }
      } : {},
      include: {
        project: {
          select: {
            projectId: true,
            tagline: true,
            coverImageUrl: true,
            ownerAddress: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    // Group by project and milestone stage
    const votesByProjectAndStage = votes.reduce((acc: any, vote) => {
      const key = `${vote.project.projectId}-${vote.milestoneStage}`
      if (!acc[key]) {
        acc[key] = {
          projectId: vote.project.projectId,
          projectName: vote.project.tagline,
          coverImageUrl: vote.project.coverImageUrl,
          ownerAddress: vote.project.ownerAddress,
          milestoneStage: vote.milestoneStage,
          votes: [],
          yesCount: 0,
          noCount: 0,
          firstVoteAt: vote.timestamp,
          lastVoteAt: vote.timestamp
        }
      }
      acc[key].votes.push(vote)
      if (vote.voteYes) acc[key].yesCount++
      else acc[key].noCount++
      if (vote.timestamp < acc[key].firstVoteAt) acc[key].firstVoteAt = vote.timestamp
      if (vote.timestamp > acc[key].lastVoteAt) acc[key].lastVoteAt = vote.timestamp
      return acc
    }, {})

    // Format concluded votes
    const concludedVotes = Object.values(votesByProjectAndStage).map((vote: any) => {
      const total = vote.yesCount + vote.noCount
      const yesPercent = total > 0 ? Math.round((vote.yesCount / total) * 100) : 0
      const noPercent = total > 0 ? Math.round((vote.noCount / total) * 100) : 0
      const result = vote.yesCount > vote.noCount ? 'passed' : 'failed'

      return {
        projectId: vote.projectId,
        projectName: vote.projectName,
        coverImageUrl: vote.coverImageUrl,
        ownerAddress: vote.ownerAddress,
        milestoneStage: vote.milestoneStage,
        result,
        yesVotes: vote.yesCount,
        noVotes: vote.noCount,
        yesPercent,
        noPercent,
        totalVoters: total,
        votingStarted: vote.firstVoteAt,
        votingEnded: vote.lastVoteAt
      }
    })

    // Sort by most recent
    concludedVotes.sort((a, b) => 
      new Date(b.votingEnded).getTime() - new Date(a.votingEnded).getTime()
    )

    // Paginate
    const paginated = concludedVotes.slice(offset, offset + limit)
    const total = concludedVotes.length

    return NextResponse.json({
      success: true,
      concludedVotes: paginated,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    })
  } catch (error) {
    console.error('Get concluded votes error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch concluded votes' },
      { status: 500 }
    )
  }
}
