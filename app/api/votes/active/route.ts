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

const CONTRACT_ADDRESS = getStageRaiseAddress(97)

function normalizeVotePower(value: bigint): number {
  const parsed = Number.parseFloat(formatUnits(value, 18))
  if (!Number.isFinite(parsed)) return 0
  return parsed
}

// GET /api/votes/active - Get all currently active voting sessions across platform
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '20')

    // Get all milestone-based projects
    const projects = await prisma.project.findMany({
      where: {
        milestones: {
          some: {}
        }
      },
      include: {
        milestones: {
          orderBy: { stage: 'asc' }
        },
        _count: {
          select: {
            contributions: true
          }
        }
      },
      take: limit
    })
    const activeVotes = await Promise.all(
      projects.map(async (project) => {
        try {
          const projectId = project.projectId

          // Call individual getter functions from the contract
          const [isVotingOpen, votingEndTime, yesVotes, noVotes, currentStage] = await Promise.all([
            client.readContract({
              address: CONTRACT_ADDRESS,
              abi: stageRaiseABI,
              functionName: 'getProjectMileStoneVotingStatus',
              args: [projectId]
            }) as Promise<boolean>,
            client.readContract({
              address: CONTRACT_ADDRESS,
              abi: stageRaiseABI,
              functionName: 'getProjectVotingEndTime',
              args: [projectId]
            }) as Promise<bigint>,
            client.readContract({
              address: CONTRACT_ADDRESS,
              abi: stageRaiseABI,
              functionName: 'getProjectYesVotes',
              args: [projectId]
            }) as Promise<bigint>,
            client.readContract({
              address: CONTRACT_ADDRESS,
              abi: stageRaiseABI,
              functionName: 'getProjectNoVotes',
              args: [projectId]
            }) as Promise<bigint>,
            client.readContract({
              address: CONTRACT_ADDRESS,
              abi: stageRaiseABI,
              functionName: 'getProjectMilestoneStage',
              args: [projectId]
            }) as Promise<number>
          ])

          if (!isVotingOpen) return null

          const endTime = Number(votingEndTime)
          const totalRaw = yesVotes + noVotes
          const yesPercent = totalRaw > BigInt(0) ? Number((yesVotes * BigInt(100)) / totalRaw) : 0
          const noPercent = totalRaw > BigInt(0) ? Number((noVotes * BigInt(100)) / totalRaw) : 0
          const yesVotesDisplay = normalizeVotePower(yesVotes)
          const noVotesDisplay = normalizeVotePower(noVotes)
          const totalVotesDisplay = yesVotesDisplay + noVotesDisplay

          const now = Math.floor(Date.now() / 1000)
          const secondsRemaining = Math.max(0, endTime - now)

          const milestone = project.milestones.find(m => m.stage === currentStage)

          return {
            projectId: project.projectId,
            projectName: project.name,
            coverImageUrl: project.coverImageUrl,
            ownerAddress: project.ownerAddress,
            milestoneStage: currentStage,
            milestoneTitle: milestone?.title || `Milestone ${currentStage}`,
            totalMilestones: project.milestones.length,
            milestones: project.milestones.length,
            funders: project.cachedTotalContributors ?? project._count.contributions ?? 0,
            votingEndTime: new Date(endTime * 1000).toISOString(),
            endDate: new Date(endTime * 1000).toISOString(),
            status: 'ongoing',
            result: 'ongoing',
            isActive: true,
            yesVotes: yesVotesDisplay,
            noVotes: noVotesDisplay,
            totalVotes: totalVotesDisplay,
            timeRemaining: {
              days: Math.floor(secondsRemaining / 86400),
              hours: Math.floor((secondsRemaining % 86400) / 3600),
              minutes: Math.floor((secondsRemaining % 3600) / 60),
              total: secondsRemaining
            },
            yesPercent,
            noPercent,
            totalVoters: totalVotesDisplay
          }
        } catch (error) {
          console.error(`Error checking project ${project.projectId}:`, error)
          return null
        }
      })
    )

    // Filter out nulls and projects without active voting
    const filtered = activeVotes.filter(v => v !== null)

    return NextResponse.json({
      success: true,
      activeVotes: filtered,
      total: filtered.length
    })
  } catch (error) {
    console.error('Get active votes error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch active votes' },
      { status: 500 }
    )
  }
}
