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
    transport: http(),
})

function normalizeVotePower(value: bigint): number {
    const parsed = Number.parseFloat(formatUnits(value, 18))
    if (!Number.isFinite(parsed)) return 0
    return parsed
}

function normalizeStoredVoteValue(value: number): number {
    if (!Number.isFinite(value)) return 0
    if (Math.abs(value) >= 1_000_000_000_000) {
        return value / 1e18
    }
    return value
}

// GET /api/dashboard/voting - Fetch voting rounds that concern the user
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

        // Get projects where user is a contributor (they can vote)
        const contributedProjects = await prisma.contribution.findMany({
            where: { contributor: normalizedAddress },
            select: { projectId: true },
            distinct: ['projectId']
        })

        const contributedProjectIds = contributedProjects.map(c => c.projectId)

        // Get voting rounds for projects the user has contributed to
        const [votingRounds, total] = await Promise.all([
            prisma.votingRound.findMany({
                where: {
                    projectId: { in: contributedProjectIds }
                },
                include: {
                    project: {
                        select: {
                            id: true,
                            projectId: true,
                            chainId: true,
                            name: true,
                            description: true,
                            coverImageUrl: true,
                            logoUrl: true,
                            milestones: true,
                            cachedTotalContributors: true,
                            currentMilestone: true,
                            votingPeriodDays: true,
                            status: true,
                            failedVotingCount: true
                        }
                    },
                    votes: {
                        where: { voter: normalizedAddress },
                        take: 1
                    }
                },
                orderBy: [
                    { isActive: 'desc' },
                    { createdAt: 'desc' }
                ],
                skip,
                take: limit
            }),
            prisma.votingRound.count({
                where: {
                    projectId: { in: contributedProjectIds }
                }
            })
        ])

        // Transform voting rounds for the frontend
        const transformedVotes = await Promise.all(votingRounds.map(async (round) => {
            const milestone = round.project.milestones.find(
                m => m.stage === round.milestoneStage
            )
            const userVote = round.votes[0]
            const previousFailedCount = round.project.failedVotingCount || 0
            let roundIsActive = round.isActive
            let roundResult = round.result
            let resolvedYesVotes = normalizeStoredVoteValue(round.yesVotes)
            let resolvedNoVotes = normalizeStoredVoteValue(round.noVotes)
            let resolvedVotingEnd = round.votingEnded ? new Date(round.votingEnded) : null

            if (round.isActive) {
                try {
                    const contractAddress = getStageRaiseAddress(round.project.chainId)
                    const [isVotingOpen, milestoneStageRaw, failedMilestoneStageRaw, yesVotesRaw, noVotesRaw, votingEndTimeRaw] = await Promise.all([
                        client.readContract({
                            address: contractAddress,
                            abi: stageRaiseABI,
                            functionName: 'getProjectMileStoneVotingStatus',
                            args: [round.project.projectId]
                        }) as Promise<boolean>,
                        client.readContract({
                            address: contractAddress,
                            abi: stageRaiseABI,
                            functionName: 'getProjectMilestoneStage',
                            args: [round.project.projectId]
                        }) as Promise<number>,
                        client.readContract({
                            address: contractAddress,
                            abi: stageRaiseABI,
                            functionName: 'getProjectFailedMilestoneStage',
                            args: [round.project.projectId]
                        }) as Promise<number>,
                        client.readContract({
                            address: contractAddress,
                            abi: stageRaiseABI,
                            functionName: 'getProjectYesVotes',
                            args: [round.project.projectId]
                        }) as Promise<bigint>,
                        client.readContract({
                            address: contractAddress,
                            abi: stageRaiseABI,
                            functionName: 'getProjectNoVotes',
                            args: [round.project.projectId]
                        }) as Promise<bigint>,
                        client.readContract({
                            address: contractAddress,
                            abi: stageRaiseABI,
                            functionName: 'getProjectVotingEndTime',
                            args: [round.project.projectId]
                        }) as Promise<bigint>
                    ])

                    resolvedYesVotes = normalizeVotePower(yesVotesRaw)
                    resolvedNoVotes = normalizeVotePower(noVotesRaw)
                    resolvedVotingEnd = new Date(Number(votingEndTimeRaw) * 1000)

                    const storedYesVotes = normalizeStoredVoteValue(round.yesVotes)
                    const storedNoVotes = normalizeStoredVoteValue(round.noVotes)
                    if (
                        (resolvedYesVotes + resolvedNoVotes) === 0 &&
                        (storedYesVotes + storedNoVotes) > 0
                    ) {
                        // After on-chain finalize, vote counters reset to zero.
                        // Keep historical round totals from DB for ended-round UI.
                        resolvedYesVotes = storedYesVotes
                        resolvedNoVotes = storedNoVotes
                    }

                    const liveMilestoneStage = Number(milestoneStageRaw)
                    const liveFailedStage = Number(failedMilestoneStageRaw)
                    const votingWindowOpen = resolvedVotingEnd.getTime() > Date.now()
                    roundIsActive = Boolean(isVotingOpen) && votingWindowOpen

                    const projectUpdateData: Record<string, number | string> = {}
                    if (round.project.currentMilestone !== liveMilestoneStage) {
                        round.project.currentMilestone = liveMilestoneStage
                        projectUpdateData.currentMilestone = liveMilestoneStage
                    }
                    if (previousFailedCount !== liveFailedStage) {
                        round.project.failedVotingCount = liveFailedStage
                        projectUpdateData.failedVotingCount = liveFailedStage
                    }
                    if (liveFailedStage >= 3 && round.project.status !== 'refundable') {
                        round.project.status = 'refundable'
                        projectUpdateData.status = 'refundable'
                    }
                    if (Object.keys(projectUpdateData).length > 0) {
                        await prisma.project.update({
                            where: { id: round.project.id },
                            data: projectUpdateData
                        })
                    }

                    if (!roundIsActive) {
                        roundResult =
                            liveMilestoneStage > round.milestoneStage
                                ? 'passed'
                                : liveFailedStage > previousFailedCount
                                    ? 'failed'
                                    : (resolvedYesVotes > resolvedNoVotes ? 'passed' : 'failed')

                        await prisma.votingRound.update({
                            where: { id: round.id },
                            data: {
                                isActive: false,
                                result: roundResult,
                                votingEnded: resolvedVotingEnd,
                                yesVotes: resolvedYesVotes,
                                noVotes: resolvedNoVotes,
                                totalVoters: resolvedYesVotes + resolvedNoVotes,
                            }
                        })
                    } else {
                        await prisma.votingRound.update({
                            where: { id: round.id },
                            data: {
                                isActive: true,
                                result: 'ongoing',
                                votingEnded: resolvedVotingEnd,
                                yesVotes: resolvedYesVotes,
                                noVotes: resolvedNoVotes,
                                totalVoters: resolvedYesVotes + resolvedNoVotes,
                            }
                        })
                    }
                } catch {
                    // Fall back to database values if contract read fails.
                }
            }

            if (roundIsActive && resolvedVotingEnd && resolvedVotingEnd.getTime() <= Date.now()) {
                roundIsActive = false
                roundResult = roundResult === 'ongoing'
                    ? (resolvedYesVotes > resolvedNoVotes ? 'passed' : 'failed')
                    : roundResult

                await prisma.votingRound.update({
                    where: { id: round.id },
                    data: {
                        isActive: false,
                        result: roundResult,
                        votingEnded: resolvedVotingEnd
                    }
                })
            }

            const totalVotes = resolvedYesVotes + resolvedNoVotes
            const yesPercent = totalVotes > 0 ? Math.round((resolvedYesVotes / totalVotes) * 100) : 0
            const noPercent = totalVotes > 0 ? Math.round((resolvedNoVotes / totalVotes) * 100) : 0

            // Calculate time remaining if voting is ongoing
            let timeRemaining = null
            let votingEndTime: string | null = null
            if (roundIsActive) {
                const endTime = resolvedVotingEnd
                    ? new Date(resolvedVotingEnd)
                    : (() => {
                        const fallback = new Date(round.votingStarted)
                        fallback.setDate(fallback.getDate() + (round.project.votingPeriodDays || 7))
                        return fallback
                    })()
                votingEndTime = endTime.toISOString()
                const now = new Date()
                const diff = endTime.getTime() - now.getTime()
                if (diff > 0) {
                    timeRemaining = {
                        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
                        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
                        minutes: Math.floor((diff / (1000 * 60)) % 60),
                        seconds: Math.floor((diff / 1000) % 60)
                    }
                }
            }

            // Determine outcome message for ended votes
            let outcomeMessage = null
            if (round.result === 'passed') {
                outcomeMessage = 'This milestone met the required approval threshold. Funds have been released and project progression continues.'
            } else if (round.result === 'failed') {
                if (round.project.failedVotingCount >= 3) {
                    outcomeMessage = 'The project is marked as failed, and funders may manually claim their proportional refunds.'
                } else {
                    outcomeMessage = 'The creator may resubmit the milestone for voting. After three failed attempts, the project is marked as failed and remaining funds become refundable to funders.'
                }
            }

            return {
                id: round.id,
                projectId: round.project.id,
                projectNumericId: round.project.projectId,
                projectName: round.project.name,
                projectDescription: round.project.description,
                coverImageUrl: round.project.coverImageUrl,
                logoUrl: round.project.logoUrl,
                milestoneStage: round.milestoneStage,
                milestoneTitle: milestone?.title || `Milestone ${round.milestoneStage}`,
                totalMilestones: round.project.milestones.length,
                funders: round.project.cachedTotalContributors || 0,
                result: roundResult,
                isActive: roundIsActive,
                status: roundIsActive ? 'ongoing' : 'ended',
                yesVotes: resolvedYesVotes,
                noVotes: resolvedNoVotes,
                totalVotes,
                yesPercent,
                noPercent,
                votingStarted: round.votingStarted,
                votingEnded: round.votingEnded,
                votingEndTime,
                timeRemaining,
                userHasVoted: !!userVote,
                userVotedYes: userVote?.voteYes,
                outcomeMessage,
                communityVote: true,
                refundable: true
            }
        }))

        return NextResponse.json({
            success: true,
            votes: transformedVotes,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        })
    } catch (error) {
        console.error('Dashboard voting error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch voting data' },
            { status: 500 }
        )
    }
}
