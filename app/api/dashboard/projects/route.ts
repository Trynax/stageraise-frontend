import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/dashboard/projects - Fetch projects created by the user
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const address = searchParams.get('address')
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '9')

        if (!address) {
            return NextResponse.json(
                { error: 'Address is required' },
                { status: 400 }
            )
        }

        const skip = (page - 1) * limit

        const [projects, total] = await Promise.all([
            prisma.project.findMany({
                where: {
                    ownerAddress: address.toLowerCase()
                },
                include: {
                    milestones: {
                        orderBy: { stage: 'asc' }
                    },
                    votingRounds: {
                        where: { isActive: true },
                        orderBy: { createdAt: 'desc' },
                        take: 1
                    },
                    _count: {
                        select: {
                            contributions: true,
                            votes: true
                        }
                    }
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit
            }),
            prisma.project.count({
                where: {
                    ownerAddress: address.toLowerCase()
                }
            })
        ])

        // Transform projects to include status information
        const transformedProjects = projects.map(project => {
            const totalMilestones = project.milestones.length
            const currentMilestone = project.currentMilestone
            const activeVoting = project.votingRounds[0]

            // Determine project state
            let displayStatus = 'funding' // default
            let milestoneStatus = null

            if (project.status === 'completed') {
                displayStatus = 'completed'
                milestoneStatus = `${totalMilestones}/${totalMilestones} Milestone Completed`
            } else if (project.status === 'refundable') {
                displayStatus = 'failed'
                milestoneStatus = `${currentMilestone}/${totalMilestones} Project Failed`
            } else if (activeVoting) {
                displayStatus = 'voting'
                milestoneStatus = `${currentMilestone}/${totalMilestones} Milestone Voting`
            } else if (currentMilestone > 0) {
                displayStatus = 'in_progress'
                milestoneStatus = `${currentMilestone}/${totalMilestones} Milestone In Progress`
            }

            return {
                id: project.id,
                projectId: project.projectId,
                name: project.name,
                description: project.description,
                coverImageUrl: project.coverImageUrl,
                logoUrl: project.logoUrl,
                fundingTarget: project.fundingTarget,
                fundingDeadline: project.fundingDeadline,
                cachedRaisedAmount: project.cachedRaisedAmount || 0,
                cachedTotalContributors: project.cachedTotalContributors || 0,
                milestones: project.milestones,
                currentMilestone,
                totalMilestones,
                displayStatus,
                milestoneStatus,
                hasActiveVoting: !!activeVoting,
                communityVote: true, // All projects have community vote
                refundable: true // All milestone-based projects are refundable
            }
        })

        return NextResponse.json({
            success: true,
            projects: transformedProjects,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        })
    } catch (error) {
        console.error('Dashboard projects error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch projects' },
            { status: 500 }
        )
    }
}
