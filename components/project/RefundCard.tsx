"use client"

import { Token } from "@/lib/constants/tokens"

interface RefundCardProps {
  failedAtMilestone: number
  refundableAmount: number
  token: Token | undefined
  onRequestRefund?: () => void
}

export function RefundCard({ 
  failedAtMilestone,
  refundableAmount,
  token,
  onRequestRefund
}: RefundCardProps) {
  return (
    <div className="bg-white border-2 border-dark rounded-2xl p-6">
      <h3 className="text-xl font-bold text-center mb-6">
        Project failed at millstone {failedAtMilestone}
      </h3>

      <div className="bg-[#E5FBDD] border border-dark rounded-2xl p-6 mb-6 text-center">
        <p className="text-sm text-dark mb-2">Refundable Funds</p>
        <p className="text-2xl font-bold text-[#3A9E1B]">
          {refundableAmount} {token?.symbol || 'BUSD'}
        </p>
      </div>

      <button
        onClick={onRequestRefund}
        className="w-full py-4 bg-deepGreen text-secondary rounded-xl font-semibold hover:bg-deepGreen/90 transition-all"
      >
        Request for Refund
      </button>
    </div>
  )
}
