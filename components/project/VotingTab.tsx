"use client"

interface VotingTabProps {

  hasActiveVoting?: boolean
  votingHistory?: any[]
}

import Image from "next/image"

export function VotingTab({ hasActiveVoting, votingHistory }: VotingTabProps) {
  return (
    <div className="bg-primary p-12 text-center">
      <div className="flex justify-center mb-6">
        <Image src="/images/novotes.svg" alt="Voting Icon" width={180} height={180} />
      </div>
      <p className="text-xl font-semibold text-gray-600">No voting yet</p>
    </div>
  )
}
