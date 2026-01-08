"use client"

import { useState, useEffect } from "react"
import { Token } from "@/lib/constants/tokens"
import { useRefund } from "@/lib/contracts/hooks"
import { useAccount, useChainId } from "wagmi"
import TransactionModal, { TransactionStatus } from "@/components/ui/TransactionModal"

interface RefundCardProps {
  projectId: number
  failedAtMilestone: number
  refundableAmount: number
  token: Token | undefined
}

export function RefundCard({ 
  projectId,
  failedAtMilestone,
  refundableAmount,
  token
}: RefundCardProps) {
  const { address } = useAccount()
  const chainId = useChainId()
  
  // Transaction modal state
  const [showTxModal, setShowTxModal] = useState(false)
  const [txStatus, setTxStatus] = useState<TransactionStatus>('pending')
  const [txError, setTxError] = useState<string | undefined>()
  
  const {
    requestRefund,
    isPending,
    isConfirming,
    isSuccess,
    hash,
    error
  } = useRefund()

  const handleRefund = async () => {
    if (!address) return
    
    try {
      setShowTxModal(true)
      setTxStatus('pending')
      setTxError(undefined)
      await requestRefund(projectId, chainId)
    } catch (error: any) {
      console.error('Refund error:', error)
      setTxStatus('error')
      setTxError(error?.message || error?.shortMessage || 'Failed to request refund')
    }
  }

  // Update modal status based on transaction state
  useEffect(() => {
    if (isPending) {
      setTxStatus('pending')
    } else if (isConfirming && hash) {
      setTxStatus('confirming')
    }
  }, [isPending, isConfirming, hash])

  // Handle success
  useEffect(() => {
    if (isSuccess && hash) {
      setTxStatus('success')
      
      setTimeout(() => {
        setShowTxModal(false)
      }, 3000)
    }
  }, [isSuccess, hash])

  // Handle errors
  useEffect(() => {
    if (error) {
      setTxStatus('error')
      setTxError((error as any)?.shortMessage || error.message)
    }
  }, [error])

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
        onClick={handleRefund}
        disabled={isPending || isConfirming || !address}
        className={`w-full py-4 bg-deepGreen text-secondary rounded-xl font-semibold transition-all ${
          isPending || isConfirming || !address
            ? 'opacity-50 cursor-not-allowed'
            : 'hover:bg-deepGreen/90'
        }`}
      >
        {!address ? 'Connect Wallet' : isPending || isConfirming ? 'Processing...' : 'Request for Refund'}
      </button>

      {/* Transaction Modal */}
      <TransactionModal
        isOpen={showTxModal}
        type="refund"
        status={txStatus}
        hash={hash}
        error={txError}
        onClose={() => {
          setShowTxModal(false)
          setTxStatus('pending')
          setTxError(undefined)
        }}
        chainId={chainId}
      />
    </div>
  )
}
