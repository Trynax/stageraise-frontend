import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/dashboard/contributions - Fetch projects the user has contributed to
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
        const normalizedAddress = address.toLowerCase()

        // Get all contributions by the user with aggregated amounts per project
        const contributionsByProject = await prisma.contribution.groupBy({
            by: ['projectId'],
            where: { contributor: normalizedAddress },
            _sum: { amount: true },
            _count: true
        })

    const projectIds = contributionsByProject.map((c) => c.projectId) as string[]

        // Create a map of project contributions
        const contributionMap = new Map(
            contributionsByProject.map(c => [c.projectId, c._sum.amount || 0])
        )

        // Get projects with their details
        const [projects, total] = await Promise.all([
            prisma.project.findMany({
                where: {
                    id: { in: projectIds }
                },
                include: {
                    milestones: {
                        orderBy: { stage: 'asc' }
                    },
                    votingRounds: {
                        where: { isActive: true },
                        orderBy: { createdAt: 'desc' },
                        take: 1
                    }
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit
            }),
            prisma.project.count({
                where: {
                    id: { in: projectIds }
                }
            })
        ])

        // Transform projects with contribution info
        const transformedContributions = projects.map(project => {
            const userContribution = contributionMap.get(project.id) || 0
            const totalMilestones = project.milestones.length
            const currentMilestone = project.currentMilestone
            const activeVoting = project.votingRounds[0]

            // Determine project state and user's refund eligibility
            let displayStatus = 'funding' // funding phase
            let milestoneStatus = null
            let isRefundEligible = false
            let statusMessage = null

            const now = new Date()
            const fundingEnded = new Date(project.fundingDeadline) < now

            if (project.status === 'completed') {
                displayStatus = 'completed'
                milestoneStatus = `${totalMilestones}/${totalMilestones} Milestone Completed`
                statusMessage = 'Project completed successfully'
            } else if (project.status === 'refundable') {
                displayStatus = 'failed'
                milestoneStatus = `${currentMilestone}/${totalMilestones} Project Failed`
                isRefundEligible = true
                statusMessage = 'The project is marked as failed, and funders may manually claim their proportional refunds.'
            } else if (activeVoting) {
                displayStatus = 'voting'
                milestoneStatus = `${currentMilestone}/${totalMilestones} Milestone Voting`
                statusMessage = 'Vote on this milestone to help decide if funds should be released for next milestone'
            } else if (!fundingEnded) {
                displayStatus = 'funding'
                milestoneStatus = null
            } else if (currentMilestone > 0 && currentMilestone <= totalMilestones) {
                displayStatus = 'in_progress'
                milestoneStatus = `${currentMilestone}/${totalMilestones} Milestone In Progress`
                statusMessage = 'The project creator is working on this milestone. Once completed, they will submit proof for community voting.'
            } else if (fundingEnded && currentMilestone === 0) {
                displayStatus = 'awaiting_milestone'
                milestoneStatus = `0/${totalMilestones} Milestone Completed`
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
                userContribution,
                isRefundEligible,
                statusMessage,
                communityVote: true,
                refundable: true
            }
        })

        return NextResponse.json({
            success: true,
            contributions: transformedContributions,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        })
    } catch (error) {
        console.error('Dashboard contributions error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch contributions' },
            { status: 500 }
        )
    }
}
