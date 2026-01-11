"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Token } from "@/lib/constants/tokens"
import { useFundProjectWithSync } from "@/lib/contracts/hooks"
import { useAccount, useChainId, useReadContract } from "wagmi"
import { erc20Abi, formatUnits } from "viem"
import TransactionModal, { TransactionStatus, TransactionType } from "@/components/ui/TransactionModal"

interface FundingCardProps {
  projectId: number
  token: Token | undefined
  fundingTarget: number
  cachedRaisedAmount: number
  amountRaisedPercent: number
  minContribution?: number
  maxContribution?: number
}

export function FundingCard({ 
  projectId,
  token, 
  fundingTarget, 
  cachedRaisedAmount, 
  amountRaisedPercent,
  minContribution = 1,
  maxContribution
}: FundingCardProps) {
  const [fundAmount, setFundAmount] = useState('')
  const { address } = useAccount()
  const chainId = useChainId()
  
  // Get user's token balance
  const { data: tokenBalance } = useReadContract({
    address: token?.address as `0x${string}`,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!token?.address
    }
  })

  const formattedBalance = tokenBalance 
    ? parseFloat(formatUnits(tokenBalance, token?.decimals || 18)).toLocaleString(undefined, { 
        minimumFractionDigits: 0,
        maximumFractionDigits: 2 
      })
    : '0'
  
  // Transaction modal state
  const [showTxModal, setShowTxModal] = useState(false)
  const [txStatus, setTxStatus] = useState<TransactionStatus>('pending')
  const [txType, setTxType] = useState<TransactionType>('funding')
  const [currentHash, setCurrentHash] = useState<string | undefined>()
  const [txError, setTxError] = useState<string | undefined>()
  
  const {
    approveToken,
    fundProject,
    isApproving,
    isApproveConfirming,
    isApproveSuccess,
    isFunding,
    isFundConfirming,
    isFundSuccess,
    approveHash,
    fundHash,
    approveError,
    fundError,
    syncContribution
  } = useFundProjectWithSync()

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

  const handleFundProject = async () => {
    if (!address || !token || !fundAmount) return
    
    try {
      // Step 1: Approve token
      setShowTxModal(true)
      setTxType('approve')
      setTxStatus('pending')
      setTxError(undefined)
      
      await approveToken(token.address as `0x${string}`, fundAmount, token.decimals, chainId)
    } catch (error: any) {
      console.error('Approve error:', error)
      setTxStatus('error')
      setTxError(error?.message || error?.shortMessage || 'Failed to approve token')
    }
  }

  // Handle approve success - proceed to fund
  useEffect(() => {
    if (isApproveSuccess && approveHash && token) {
      setCurrentHash(approveHash)
      setTxStatus('success')
      
      // After short delay, proceed to funding
      setTimeout(async () => {
        try {
          setTxType('funding')
          setTxStatus('pending')
          await fundProject(projectId, fundAmount, token.decimals, chainId)
        } catch (error: any) {
          console.error('Fund error:', error)
          setTxStatus('error')
          setTxError(error?.message || error?.shortMessage || 'Failed to fund project')
        }
      }, 1500)
    }
  }, [isApproveSuccess, approveHash])

  // Update modal status based on approve state
  useEffect(() => {
    if (txType === 'approve') {
      if (isApproving) {
        setTxStatus('pending')
      } else if (isApproveConfirming && approveHash) {
        setTxStatus('confirming')
        setCurrentHash(approveHash)
      }
    }
  }, [isApproving, isApproveConfirming, approveHash, txType])

  // Update modal status based on fund state
  useEffect(() => {
    if (txType === 'funding') {
      if (isFunding) {
        setTxStatus('pending')
      } else if (isFundConfirming && fundHash) {
        setTxStatus('confirming')
        setCurrentHash(fundHash)
      }
    }
  }, [isFunding, isFundConfirming, fundHash, txType])

  // Handle fund success
  useEffect(() => {
    if (isFundSuccess && fundHash) {
      setCurrentHash(fundHash)
      setTxStatus('success')
      
      // Sync to database
      syncContribution(fundHash, chainId)
      
      // Reset form after delay
      setTimeout(() => {
        setShowTxModal(false)
        setFundAmount('')
      }, 3000)
    }
  }, [isFundSuccess, fundHash])

  // Handle errors
  useEffect(() => {
    if (approveError) {
      setTxStatus('error')
      setTxError((approveError as any)?.shortMessage || approveError.message)
    }
    if (fundError) {
      setTxStatus('error')
      setTxError((fundError as any)?.shortMessage || fundError.message)
    }
  }, [approveError, fundError])

  const presetAmounts = [10, 50, 100, 1000, 5000, 10000]
  const validPresets = presetAmounts.filter(amount => 
    amount >= minContribution && (!maxContribution || amount <= maxContribution)
  )

  const numValue = parseFloat(fundAmount)
  const isValidAmount = fundAmount !== '' && !isNaN(numValue) && numValue >= minContribution && (!maxContribution || numValue <= maxContribution)
  const isProcessing = isApproving || isApproveConfirming || isFunding || isFundConfirming

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

      <p className="text-sm text-gray-600 mb-4">
        Available {token?.symbol || 'BUSD'}: {formattedBalance}
      </p>

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
          onClick={handleFundProject}
          disabled={!isValidAmount || isProcessing || !address}
          className={`flex-[2] py-3 rounded-xl font-semibold transition-all ${
            isValidAmount && !isProcessing && address
              ? 'bg-deepGreen text-secondary hover:bg-deepGreen/80'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {!address ? 'Connect Wallet' : isProcessing ? 'Processing...' : 'Fund Project'}
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

      {/* Transaction Modal */}
      <TransactionModal
        isOpen={showTxModal}
        type={txType}
        status={txStatus}
        hash={currentHash}
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
