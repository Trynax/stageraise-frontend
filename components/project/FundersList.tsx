"use client"

import Image from "next/image"
import { Token } from "@/lib/constants/tokens"

interface Contribution {
  contributor: string
  amount?: number
  transactionHash: string
  timestamp: string
}

interface FundersListProps {
  recentContributions: Contribution[]
  token: Token | undefined
}

export function FundersList({ recentContributions, token }: FundersListProps) {
  return (
    <div className="bg-white border-2 border-dark rounded-2xl p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold">Funders ({recentContributions?.length || 0})</h3>
        <button className="px-3 py-1 border-1 border-gray-600 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-all flex items-center gap-1">
          New to Old
         <Image src="/icons/sort.svg" alt="Sort Icon" width={16} height={16} />
        </button>
      </div>

      <div className="space-y-3 max-h-[500px] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {recentContributions && recentContributions.length > 0 ? (
          recentContributions.map((contribution, index) => {
            const timeAgo = Math.floor((Date.now() - new Date(contribution.timestamp).getTime()) / (1000 * 60))
            return (
              <div key={index} className="flex items-start justify-between py-3 border-t border-gray-300">
                <div className="flex items-start gap-3">
                  <div className = "flex flex-col items-start">
                    <p className="text-sm text-gray-500 mb-1">Amount</p>
                    <div className="flex gap-2 items-center">
                   
                    {token?.icon ? (
                      <Image src={token.icon} alt={token.symbol} width={24} height={24} />
                    ) : (
                      <span className="text-lg">💰</span>
                    )}
              
                  <p className="font-bold text-base">{contribution.amount || 50} {token?.symbol || 'BUSD'}</p>

                    </div>
                    
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500 mb-1">{timeAgo} min ago</p>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-700 font-medium">
                      {contribution.contributor.slice(0, 4)}....{contribution.contributor.slice(-4)}
                    </span>
                    <a 
                      href={`https://testnet.bscscan.com/tx/${contribution.transactionHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center hover:border-gray-400 hover:bg-gray-50 transition-all"
                    >
                     <Image src="/icons/link.svg" alt="View Transaction" width={16} height={16} />
                    </a>
                  </div>
                </div>
              </div>
            )
          })
        ) : (
          <p className="text-center text-gray-500 py-8">No contributions yet</p>
        )}
      </div>
    </div>
  )
}
