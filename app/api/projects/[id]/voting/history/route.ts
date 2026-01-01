import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/projects/[id]/voting/history - Get all past voting results
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const projectId = parseInt(params.id)
    
    if (isNaN(projectId)) {
      return NextResponse.json(
        { error: 'Invalid project ID' },
        { status: 400 }
      )
    }

    const project = await prisma.project.findUnique({
      where: { projectId },
      include: {
        milestones: {
          orderBy: { stage: 'asc' }
        }
      }
    })

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    // Get all votes from DB
    const allVotes = await prisma.vote.findMany({
      where: { projectId: project.id },
      orderBy: [
        { milestoneStage: 'asc' },
        { createdAt: 'asc' }
      ]
    })

    // Group by milestone stage
    const votesByStage = allVotes.reduce((acc: any, vote) => {
      const stage = vote.milestoneStage
      if (!acc[stage]) {
        acc[stage] = {
          stage,
          votes: [],
          yesCount: 0,
          noCount: 0,
          voters: []
        }
      }
      acc[stage].votes.push(vote)
      acc[stage].voters.push({
        address: vote.voter,
        voteYes: vote.voteYes,
        timestamp: vote.timestamp,
        transactionHash: vote.transactionHash
      })
      if (vote.voteYes) acc[stage].yesCount++
      else acc[stage].noCount++
      return acc
    }, {})

    // Format history with milestone details
    const history = Object.values(votesByStage).map((stageVotes: any) => {
      const milestone = project.milestones.find(m => m.stage === stageVotes.stage)
      const total = stageVotes.yesCount + stageVotes.noCount
      const yesPercent = total > 0 ? Math.round((stageVotes.yesCount / total) * 100) : 0
      const noPercent = total > 0 ? Math.round((stageVotes.noCount / total) * 100) : 0
      
      // Determine result (assumed passed if yes > no)
      const result = stageVotes.yesCount > stageVotes.noCount ? 'passed' : 'failed'
      
      return {
        stage: stageVotes.stage,
        milestoneTitle: milestone?.title || `Milestone ${stageVotes.stage}`,
        milestoneDescription: milestone?.description,
        result,
        yesVotes: stageVotes.yesCount,
        noVotes: stageVotes.noCount,
        yesPercent,
        noPercent,
        totalVoters: total,
        voters: stageVotes.voters,
        firstVoteAt: stageVotes.votes[0]?.timestamp,
        lastVoteAt: stageVotes.votes[stageVotes.votes.length - 1]?.timestamp
      }
    })

    return NextResponse.json({
      success: true,
      projectId,
      projectName: project.tagline,
      totalMilestones: project.milestones.length,
      votingHistory: history
    })
  } catch (error) {
    console.error('Get voting history error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch voting history' },
      { status: 500 }
    )
  }
}
