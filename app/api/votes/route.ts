import { NextRequest, NextResponse } from 'next/server'
import { createPublicClient, http } from 'viem'
import { ACTIVE_CHAIN_ID, ACTIVE_RPC_URL, ACTIVE_VIEM_CHAIN } from '@/lib/contracts/network'
import { prisma } from '@/lib/prisma'
import { getStageRaiseAddress } from '@/lib/contracts/addresses'
import StageRaiseABI from '@/lib/contracts/StageRaise.abi.json'

const stageRaiseABI = StageRaiseABI as any

const client = createPublicClient({
  chain: ACTIVE_VIEM_CHAIN,
  transport: http(ACTIVE_RPC_URL)
})

const CONTRACT_ADDRESS = getStageRaiseAddress(ACTIVE_CHAIN_ID)

// GET /api/votes - Query all votes with filters

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || 'all' // active, concluded, or all
    const voter = searchParams.get('voter') // User's address
    const projectId = searchParams.get('projectId')
    const stage = searchParams.get('stage')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Get votes from database
    const votes = await prisma.vote.findMany({
      where: {
        ...(voter && { voter: voter.toLowerCase() }),
        ...(projectId && { project: { projectId: parseInt(projectId) } }),
        ...(stage && { milestoneStage: parseInt(stage) })
      },
      include: {
        project: {
          select: {
            projectId: true,
            name: true,
            coverImageUrl: true,
            ownerAddress: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    // Group votes by project and stage to determine status
    const votesByProjectStage = votes.reduce((acc: any, vote) => {
      const key = `${vote.project.projectId}-${vote.milestoneStage}`
      if (!acc[key]) {
        acc[key] = {
          projectId: vote.project.projectId,
          projectName: vote.project.name,
          coverImageUrl: vote.project.coverImageUrl,
          ownerAddress: vote.project.ownerAddress,
          milestoneStage: vote.milestoneStage,
          votes: [],
          yesCount: 0,
          noCount: 0,
          isActive: false // Will be determined
        }
      }
      acc[key].votes.push(vote)
      if (vote.voteYes) acc[key].yesCount++
      else acc[key].noCount++
      return acc
    }, {})

    // Check which sessions are active
    if (status === 'active' || status === 'all') {
      const uniqueProjects = [...new Set(votes.map(v => v.project.projectId))]
      
      await Promise.all(
        uniqueProjects.map(async (projId) => {
          try {
            const votingStatus: any = await client.readContract({
              address: CONTRACT_ADDRESS,
              abi: stageRaiseABI,
              functionName: 'getVotingStatus',
              args: [BigInt(projId)]
            })

            if (votingStatus.isVotingOpen) {
              const currentStage = Number(votingStatus.milestoneStage)
              const key = `${projId}-${currentStage}`
              if (votesByProjectStage[key]) {
                votesByProjectStage[key].isActive = true
                votesByProjectStage[key].votingEndTime = new Date(
                  Number(votingStatus.timeForTheVotingProcessToElapsed) * 1000
                ).toISOString()
                votesByProjectStage[key].yesVotes = votingStatus.votesForYes.toString()
                votesByProjectStage[key].noVotes = votingStatus.votesForNo.toString()
              }
            }
          } catch (error) {
            console.error(`Error checking project ${projId}:`, error)
          }
        })
      )
    }

    // Filter by status and format
    let filteredSessions = Object.values(votesByProjectStage)
      .filter((session: any) => {
        if (status === 'active') return session.isActive
        if (status === 'concluded') return !session.isActive
        return true // 'all'
      })
      .map((session: any) => {
        const total = session.yesCount + session.noCount
        const yesPercent = total > 0 ? Math.round((session.yesCount / total) * 100) : 0
        const noPercent = total > 0 ? Math.round((session.noCount / total) * 100) : 0
        
        return {
          projectId: session.projectId,
          projectName: session.projectName,
          coverImageUrl: session.coverImageUrl,
          ownerAddress: session.ownerAddress,
          milestoneStage: session.milestoneStage,
          status: session.isActive ? 'active' : 'concluded',
          yesVotes: session.yesVotes || session.yesCount.toString(),
          noVotes: session.noVotes || session.noCount.toString(),
          yesPercent,
          noPercent,
          totalVoters: total,
          ...(session.isActive && { votingEndTime: session.votingEndTime }),
          votes: session.votes.map((v: any) => ({
            voter: v.voter,
            voteYes: v.voteYes,
            timestamp: v.timestamp,
            transactionHash: v.transactionHash
          }))
        }
      })

    // Sort: active votes first, then by most recent
    filteredSessions.sort((a: any, b: any) => {
      if (a.status === 'active' && b.status !== 'active') return -1
      if (a.status !== 'active' && b.status === 'active') return 1
      return new Date(b.votes[0]?.timestamp || 0).getTime() - 
             new Date(a.votes[0]?.timestamp || 0).getTime()
    })

    // Paginate
    const paginated = filteredSessions.slice(offset, offset + limit)
    const total = filteredSessions.length

    return NextResponse.json({
      success: true,
      votingSessions: paginated,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    })
  } catch (error) {
    console.error('Get votes error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch votes' },
      { status: 500 }
    )
  }
}
