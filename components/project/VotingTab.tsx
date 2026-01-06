"use client"

import Image from "next/image"
import VoteCard from "../projects/votecard"

interface VotingHistory {
  stage: number
  result: 'passed' | 'failed'
  yesVotes: number
  noVotes: number
  totalVoters: number
  votingEnded: string
}

interface VotingTabProps {
  votingHistory?: VotingHistory[]
  projectTitle?: string
  projectImage?: string
  projectDescription?: string
  totalMilestones?: number
  totalFunders?: number
  failedVotingCount?: number
  status?: string
  projectId?: number
}

export function VotingTab({ 
  votingHistory, 
  projectTitle = "Project",
  projectImage,
  projectDescription = "",
  totalMilestones = 4,
  totalFunders = 0,
  failedVotingCount = 0,
  status,
  projectId
}: VotingTabProps) {
  if (!votingHistory || votingHistory.length === 0) {
    return (
      <div className="bg-primary p-12 text-center">
        <div className="flex justify-center mb-6">
          <Image src="/images/novotes.svg" alt="Voting Icon" width={180} height={180} />
        </div>
        <p className="text-xl font-semibold text-gray-600">No voting yet</p>
      </div>
    )
  }

  const votes = [...votingHistory].reverse().map((vote, index) => ({
    id: vote.stage.toString(),
    projectId,
    title: projectTitle,
    description: projectDescription,
    image: projectImage || 'https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?w=800&q=80',
    milestone: vote.stage,
    yesVotes: vote.yesVotes,
    noVotes: vote.noVotes,
    totalVotes: vote.totalVoters,
    milestones: totalMilestones,
    funders: totalFunders,
    communityVote: true,
    refundable: failedVotingCount >= 3 && status === 'refundable' && index === 0,
    startDate: vote.votingEnded,
    endDate: vote.votingEnded,
    status: 'ended' as const,
    result: vote.result,
  }))

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {votes.map((vote) => (
        <VoteCard key={vote.id} vote={vote} fromPage="project" />
      ))}
    </div>
  )
}
