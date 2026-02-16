"use client"

import { useState, useEffect } from "react"
import { useVoteWithSync, useContributorAmount, useHasVoted } from "@/lib/contracts/hooks"
import { useAccount, useChainId } from "wagmi"
import TransactionModal, { TransactionStatus } from "@/components/ui/TransactionModal"

interface LiveVotingCardProps {
  projectId: number
  milestoneStage: number
  milestoneTitle: string
  yesVotes: number
  noVotes: number
  totalVotes: number
  votingEndTime: Date
  userVote?: 'yes' | 'no' | null
}

export function LiveVotingCard({ 
  projectId,
  milestoneStage,
  milestoneTitle,
  yesVotes,
  noVotes,
  totalVotes,
  votingEndTime,
  userVote
}: LiveVotingCardProps) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const { address } = useAccount()
  const connectedAddress = address as `0x${string}` | undefined
  const chainId = useChainId()
  const { contributorAmount } = useContributorAmount(
    projectId,
    connectedAddress,
    chainId
  )
  const { hasVoted } = useHasVoted(projectId, connectedAddress, chainId)
  
  // Transaction modal state
  const [showTxModal, setShowTxModal] = useState(false)
  const [txStatus, setTxStatus] = useState<TransactionStatus>('pending')
  const [txError, setTxError] = useState<string | undefined>()
  
  const {
    vote,
    isPending,
    isConfirming,
    isSuccess,
    hash,
    error,
    syncVote
  } = useVoteWithSync()

  const hasContributorAmount = typeof contributorAmount === 'bigint'
  const isNonFunder = Boolean(address) && hasContributorAmount && contributorAmount <= BigInt(0)
  const hasVotedOnChain = Boolean(hasVoted)
  const voteDisabledReason = !address
    ? 'Connect wallet to vote.'
    : isNonFunder
      ? 'You are not a funder of this project and cannot vote.'
      : hasVotedOnChain
        ? 'You already voted in this round.'
      : undefined
  const isVoteInteractionDisabled = isPending || isConfirming || !!userVote || hasVotedOnChain || Boolean(voteDisabledReason)

  const handleVote = async (voteYes: boolean) => {
    if (!address || isNonFunder || hasVotedOnChain) return
    
    try {
      setShowTxModal(true)
      setTxStatus('pending')
      setTxError(undefined)
      await vote(projectId, voteYes, chainId)
    } catch (error: unknown) {
      console.error('Vote error:', error)
      const message =
        error && typeof error === 'object' && ('shortMessage' in error || 'message' in error)
          ? String((error as { shortMessage?: string; message?: string }).shortMessage || (error as { shortMessage?: string; message?: string }).message)
          : 'Failed to submit vote'
      setTxStatus('error')
      setTxError(message)
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
      syncVote(hash, chainId)
      
      setTimeout(() => {
        setShowTxModal(false)
      }, 3000)
    }
  }, [isSuccess, hash, chainId, syncVote])

  // Handle errors
  useEffect(() => {
    if (error) {
      setTxStatus('error')
      const message =
        error && typeof error === 'object' && ('shortMessage' in error || 'message' in error)
          ? String((error as { shortMessage?: string; message?: string }).shortMessage || (error as { shortMessage?: string; message?: string }).message)
          : 'Failed to submit vote'
      setTxError(message)
    }
  }, [error])

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
    <div className="bg-white border-1 border-dark rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-red-500 font-semibold">Live voting</span>
        <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
      </div>


      <div className="mb-2">
        <div className="flex h-6 rounded-full overflow-hidden border-2 border-dark mb-2">
          <div 
            className="bg-[#4BBF28] transition-all"
            style={{ width: `${yesPercentage}%` }}
          />
          <div 
            className="bg-[#F04438] transition-all"
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
      <div className="space-y-3 mb-6">
        <div title={voteDisabledReason}>
          <button
            onClick={() => handleVote(false)}
            disabled={isVoteInteractionDisabled}
            className={`w-full py-4 rounded-xl font-semibold transition-all border ${
              userVote === 'no' 
                ? 'bg-[#F04438] border-[#F04438] text-white' 
                : 'bg-[#FEE4E2] border-[#F04438] text-red-600 hover:bg-[#FEE4E2]/10'
            } ${isVoteInteractionDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {userVote === 'no' ? '✓ Voted No' : 'No'}
          </button>
        </div>
        <div title={voteDisabledReason}>
          <button
            onClick={() => handleVote(true)}
            disabled={isVoteInteractionDisabled}
            className={`w-full py-4 rounded-xl font-semibold transition-all border ${
              userVote === 'yes'
                ? 'bg-[#3A9E1B] border-[#3A9E1B] text-white'
                : 'bg-[#E5FBDD] border-[#3A9E1B] text-green-600 hover:bg-[#E5FBDD]/10'
            } ${isVoteInteractionDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {userVote === 'yes' ? '✓ Voted Yes' : 'Yes'}
          </button>
        </div>
      </div>

      <div className="text-center">
        <p className="text-sm text-gray-600 mb-2">Vote Ends In</p>
        <p className="text-xl font-bold">
          {timeLeft.days}d : {timeLeft.hours}h : {timeLeft.minutes}m : {timeLeft.seconds}sec
        </p>
      </div>

      {/* Transaction Modal */}
      <TransactionModal
        isOpen={showTxModal}
        type="voting"
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
