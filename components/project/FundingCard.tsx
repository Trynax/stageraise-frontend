"use client"

import { useState } from "react"
import Image from "next/image"
import { Token } from "@/lib/constants/tokens"

interface FundingCardProps {
  token: Token | undefined
  fundingTarget: number
  cachedRaisedAmount: number
  amountRaisedPercent: number
  minContribution?: number
  maxContribution?: number
}

export function FundingCard({ 
  token, 
  fundingTarget, 
  cachedRaisedAmount, 
  amountRaisedPercent,
  minContribution = 1,
  maxContribution
}: FundingCardProps) {
  const [fundAmount, setFundAmount] = useState('')

  const handleAmountChange = (value: string) => {
    const numValue = parseFloat(value)
    if (maxContribution && numValue > maxContribution) {
      setFundAmount(maxContribution.toString())
    } else {
      setFundAmount(value)
    }
  }

  const handlePresetClick = (amount: number) => {
    setFundAmount(amount.toString())
  }

  const presetAmounts = [10, 50, 100, 1000, 5000, 10000]
  const validPresets = presetAmounts.filter(amount => 
    amount >= minContribution && (!maxContribution || amount <= maxContribution)
  )

  const numValue = parseFloat(fundAmount)
  const isValidAmount = fundAmount !== '' && !isNaN(numValue) && numValue >= minContribution && (!maxContribution || numValue <= maxContribution)

  return (
    <div className="bg-white border border-dark rounded-2xl p-6">
      <h3 className="text-xl font-bold mb-4">Enter Fund amount</h3>
      <div className="relative mb-4">
        {token?.icon && (
          <>
            <span className="absolute left-4 top-1/2 -translate-y-1/2">
              <Image src={token.icon} alt={token.symbol} width={24} height={24} />
            </span>
            <div className="absolute left-[52px] top-1/2 -translate-y-1/2 h-15 w-[1px] bg-dark"></div>
          </>
        )}
        <input
          type="number"
          value={fundAmount}
          onChange={(e) => handleAmountChange(e.target.value)}
          placeholder={`Min ${minContribution}`}
          className="w-full pl-14 pr-4 py-4 border-2 border-dark rounded-xl focus:border-secondary focus:outline-none text-lg"
        />
      </div>

      <div className="flex gap-2 mb-4 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {validPresets.map(amount => (
          <button 
            key={amount}
            onClick={() => handlePresetClick(amount)}
            className={`px-3 py-2 rounded-xl font-semibold whitespace-nowrap transition-all text-sm flex-shrink-0 ${
              fundAmount === amount.toString()
                ? 'bg-secondary border border-dark'
                : 'bg-white border border-dark hover:bg-gray-50'
            }`}
          >
            {amount} {token?.symbol || 'BUSD'}
          </button>
        ))}
      </div>

      <div className="flex gap-2 mb-6">
        <button className="flex-1 py-3 border border-dark rounded-xl font-semibold hover:bg-gray-50 transition-all">
          Share
        </button>
        <button 
          disabled={!isValidAmount}
          className={`flex-[2] py-3 rounded-xl font-semibold transition-all ${
            isValidAmount
              ? 'bg-deepGreen text-secondary hover:bg-deepGreen/80'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Fund Project
        </button>
      </div>

      <div className="mb-2">
        <div className="flex justify-between text-sm font-semibold mb-2">
          <span>${cachedRaisedAmount?.toLocaleString() || 0} raised</span>
          <span>${fundingTarget?.toLocaleString() || 0}</span>
        </div>
        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-green-400 to-secondary transition-all"
            style={{ width: `${amountRaisedPercent}%` }}
          />
        </div>
      </div>
    </div>
  )
}
