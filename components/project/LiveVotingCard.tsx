"use client"

import { useState, useEffect } from "react"

interface LiveVotingCardProps {
  milestoneStage: number
  milestoneTitle: string
  yesVotes: number
  noVotes: number
  totalVotes: number
  votingEndTime: Date
  userVote?: 'yes' | 'no' | null
  onVote?: (vote: 'yes' | 'no') => void
}

export function LiveVotingCard({ 
  milestoneStage,
  milestoneTitle,
  yesVotes,
  noVotes,
  totalVotes,
  votingEndTime,
  userVote,
  onVote
}: LiveVotingCardProps) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime()
      const endTime = new Date(votingEndTime).getTime()
      const difference = endTime - now

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        })
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [votingEndTime])

  const yesPercentage = totalVotes > 0 ? Math.round((yesVotes / totalVotes) * 100) : 0
  const noPercentage = totalVotes > 0 ? Math.round((noVotes / totalVotes) * 100) : 0

  return (
    <div className="bg-white border-2 border-dark rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-red-500 font-semibold">Live voting</span>
        <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
      </div>

      {/* Voting bar */}
      <div className="mb-2">
        <div className="flex h-6 rounded-full overflow-hidden border-2 border-dark mb-2">
          <div 
            className="bg-green-500 transition-all"
            style={{ width: `${yesPercentage}%` }}
          />
          <div 
            className="bg-red-500 transition-all"
            style={{ width: `${noPercentage}%` }}
          />
        </div>
        <div className="flex justify-between text-sm font-semibold">
          <span>YES {yesPercentage}%</span>
          <span>NO {noPercentage}%</span>
        </div>
      </div>

      <p className="text-sm mb-6">
        Do you agree with the completion of {milestoneTitle} for Millstone {milestoneStage} of the project
      </p>

      {/* Voting buttons */}
      <div className="space-y-3 mb-6">
        <button
          onClick={() => onVote?.('no')}
          disabled={!!userVote}
          className={`w-full py-4 rounded-xl font-semibold transition-all border-2 ${
            userVote === 'no'
              ? 'bg-red-100 border-red-500 text-red-700'
              : userVote
              ? 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed'
              : 'bg-red-50 border-red-300 text-red-600 hover:bg-red-100'
          }`}
        >
          No
        </button>
        <button
          onClick={() => onVote?.('yes')}
          disabled={!!userVote}
          className={`w-full py-4 rounded-xl font-semibold transition-all border-2 ${
            userVote === 'yes'
              ? 'bg-green-100 border-green-500 text-green-700'
              : userVote
              ? 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed'
              : 'bg-green-50 border-green-300 text-green-600 hover:bg-green-100'
          }`}
        >
          Yes
        </button>
      </div>

      {/* Countdown timer */}
      <div className="text-center">
        <p className="text-sm text-gray-600 mb-2">Vote Ends In</p>
        <p className="text-xl font-bold">
          {timeLeft.days}d : {timeLeft.hours}h : {timeLeft.minutes}m : {timeLeft.seconds}sec
        </p>
      </div>
    </div>
  )
}
