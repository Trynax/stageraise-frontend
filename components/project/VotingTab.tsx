"use client"

interface VotingTabProps {
  // Add relevant voting props as needed
  hasActiveVoting?: boolean
  votingHistory?: any[]
}

export function VotingTab({ hasActiveVoting, votingHistory }: VotingTabProps) {
  // For now, showing empty state
  // This will be expanded based on project status
  return (
    <div className="bg-white border-2 border-dark rounded-2xl p-12 text-center">
      <div className="flex justify-center mb-6">
        <div className="text-6xl">📊</div>
      </div>
      <p className="text-xl font-semibold text-gray-600">No voting yet</p>
    </div>
  )
}
