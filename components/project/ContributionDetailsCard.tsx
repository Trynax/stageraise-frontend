"use client"

import { Token } from "@/lib/constants/tokens"

interface ContributionDetailsCardProps {
  token: Token | undefined
  userContribution: number
  contributionPercentage: number
  currentMilestone: number
  totalMilestones: number
  cachedRaisedAmount: number
  fundingTarget: number
  amountRaisedPercent: number
}

export function ContributionDetailsCard({ 
  token,
  userContribution,
  contributionPercentage,
  currentMilestone,
  totalMilestones,
  cachedRaisedAmount,
  fundingTarget,
  amountRaisedPercent
}: ContributionDetailsCardProps) {
  return (
    <div className="bg-white border-2 border-dark rounded-2xl p-6">
      <h3 className="text-xl font-bold mb-2">
        You contributed {contributionPercentage}% ({userContribution}{token?.symbol || 'BUSD'}) to the project
      </h3>
      <p className="text-sm text-gray-600 mb-6">
        Project is currently at Millston {currentMilestone} out of {totalMilestones}
      </p>


      <div className="flex justify-center items-center mb-6 relative h-40">
        <svg className="w-full h-full" viewBox="0 0 200 120">
          <path
            d="M 30 100 A 70 70 0 0 1 170 100"
            fill="none"
            stroke="#E5FBDD"
            strokeWidth="12"
            strokeLinecap="round"
          />
      
          <path
            d="M 30 100 A 70 70 0 0 1 170 100"
            fill="none"
            stroke="#3A9E1B"
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={`${(contributionPercentage / 100) * 220} 220`}
          />
        </svg>

        <div className="absolute top-1/2 gitleft-1/2 -translate-x-1/2 -translate-y-1/2 mt-4 bg-[#3A9E1B] text-white px-4 py-2 rounded-xl border border-dark font-bold text-xl">
          {contributionPercentage}%
        </div>
      </div>

      <div className="mb-2">
        <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden mb-2 border-2 border-dark">
          <div 
            className="h-full bg-[#4BBF28] transition-all"
            style={{ width: `${amountRaisedPercent}%` }}
          />
        </div>
        <div className="flex justify-between text-sm font-semibold">
          <span>${cachedRaisedAmount?.toLocaleString() || 0} raised</span>
          <span>${fundingTarget?.toLocaleString() || 0}</span>
        </div>
      </div>
    </div>
  )
}
