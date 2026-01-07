import { useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi'
import { getStageRaiseAddress } from '../addresses'
import StageRaiseABI from '../StageRaise.abi.json'

const stageRaiseABI = StageRaiseABI as any

export function useOpenVoting() {
  const {
    writeContract,
    data: hash,
    isPending,
    error
  } = useWriteContract()

  const {
    isLoading: isConfirming,
    isSuccess
  } = useWaitForTransactionReceipt({ hash })

  const openVoting = (projectId: number, chainId: number) => {
    writeContract({
      address: getStageRaiseAddress(chainId),
      abi: stageRaiseABI,
      functionName: 'openProjectForMilestoneVotes',
      args: [projectId],
    })
  }

  return {
    openVoting,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  }
}

// With auto-sync
export function useOpenVotingWithSync() {
  const openVotingHook = useOpenVoting()
  
  const syncVotingOpen = async (projectId: number, chainId: number) => {
    try {
      const response = await fetch('/api/sync/voting', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
          chainId,
          action: 'open'
        })
      })
      
      if (!response.ok) {
        throw new Error('Failed to sync voting open')
      }
      
      return await response.json()
    } catch (error) {
      console.error('Error syncing voting:', error)
      throw error
    }
  }

  return {
    ...openVotingHook,
    syncVotingOpen
  }
}


export function useVote() {
  const {
    writeContract,
    data: hash,
    isPending,
    error
  } = useWriteContract()

  const {
    isLoading: isConfirming,
    isSuccess
  } = useWaitForTransactionReceipt({ hash })

  const vote = (projectId: number, voteYes: boolean, chainId: number) => {
    writeContract({
      address: getStageRaiseAddress(chainId),
      abi: stageRaiseABI,
      functionName: 'takeAVoteForMilestoneStageIncrease',
      args: [projectId, voteYes],
    })
  }

  return {
    vote,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  }
}

// With auto-sync
export function useVoteWithSync() {
  const voteHook = useVote()
  
  const syncVote = async (txHash: string, chainId: number) => {
    try {
      const response = await fetch('/api/sync/votes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transactionHash: txHash,
          chainId
        })
      })
      
      if (!response.ok) {
        throw new Error('Failed to sync vote')
      }
      
      return await response.json()
    } catch (error) {
      console.error('Error syncing vote:', error)
      throw error
    }
  }

  return {
    ...voteHook,
    syncVote
  }
}


export function useFinalizeVoting() {
  const {
    writeContract,
    data: hash,
    isPending,
    error
  } = useWriteContract()

  const {
    isLoading: isConfirming,
    isSuccess
  } = useWaitForTransactionReceipt({ hash })

  const finalizeVoting = (projectId: number, chainId: number) => {
    writeContract({
      address: getStageRaiseAddress(chainId),
      abi: stageRaiseABI,
      functionName: 'finalizeVotingProcess',
      args: [projectId],
    })
  }

  return {
    finalizeVoting,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  }
}

// With auto-sync
export function useFinalizeVotingWithSync() {
  const finalizeHook = useFinalizeVoting()
  
  const syncFinalize = async (projectId: number, chainId: number) => {
    try {
      const response = await fetch('/api/sync/voting', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
          chainId,
          action: 'finalize'
        })
      })
      
      if (!response.ok) {
        throw new Error('Failed to sync finalize')
      }
      
      return await response.json()
    } catch (error) {
      console.error('Error syncing finalize:', error)
      throw error
    }
  }

  return {
    ...finalizeHook,
    syncFinalize
  }
}

export function useVotingStatus(projectId: number, chainId: number) {
  const { data: isOpen, refetch: refetchOpen } = useReadContract({
    address: getStageRaiseAddress(chainId),
    abi: stageRaiseABI,
    functionName: 'getProjectMileStoneVotingStatus',
    args: [projectId],
  })

  const { data: yesVotes, refetch: refetchYes } = useReadContract({
    address: getStageRaiseAddress(chainId),
    abi: stageRaiseABI,
    functionName: 'getProjectYesVotes',
    args: [projectId],
  })

  const { data: noVotes, refetch: refetchNo } = useReadContract({
    address: getStageRaiseAddress(chainId),
    abi: stageRaiseABI,
    functionName: 'getProjectNoVotes',
    args: [projectId],
  })

  const { data: endTime, refetch: refetchEndTime } = useReadContract({
    address: getStageRaiseAddress(chainId),
    abi: stageRaiseABI,
    functionName: 'getProjectVotingEndTime',
    args: [projectId],
  })

  const { data: milestoneStage, refetch: refetchStage } = useReadContract({
    address: getStageRaiseAddress(chainId),
    abi: stageRaiseABI,
    functionName: 'getProjectMilestoneStage',
    args: [projectId],
  })

  const { data: failedStage, refetch: refetchFailed } = useReadContract({
    address: getStageRaiseAddress(chainId),
    abi: stageRaiseABI,
    functionName: 'getProjectFailedMilestoneStage',
    args: [projectId],
  })

  const refetchAll = () => {
    refetchOpen()
    refetchYes()
    refetchNo()
    refetchEndTime()
    refetchStage()
    refetchFailed()
  }

  return {
    isVotingOpen: isOpen as boolean | undefined,
    yesVotes: yesVotes as bigint | undefined,
    noVotes: noVotes as bigint | undefined,
    votingEndTime: endTime as bigint | undefined,
    milestoneStage: milestoneStage as number | undefined,
    failedMilestoneStage: failedStage as number | undefined,
    refetch: refetchAll,
  }
}


export function useHasVoted(
  projectId: number,
  userAddress: `0x${string}` | undefined,
  chainId: number
) {
  const { data, refetch } = useReadContract({
    address: getStageRaiseAddress(chainId),
    abi: stageRaiseABI,
    functionName: 'hasFunderVotedInCurrentRound',
    args: userAddress ? [projectId, userAddress] : undefined,
    query: {
      enabled: !!userAddress,
    },
  })

  return {
    hasVoted: data as boolean | undefined,
    refetch,
  }
}


export function useVotingPower(
  projectId: number,
  userAddress: `0x${string}` | undefined,
  chainId: number
) {
  const { data, isLoading, error } = useReadContract({
    address: getStageRaiseAddress(chainId),
    abi: stageRaiseABI,
    functionName: 'calculateFunderVotingPower',
    args: userAddress ? [userAddress, projectId] : undefined,
    query: {
      enabled: !!userAddress,
    },
  })

  return {
    votingPower: data as bigint | undefined,
    isLoading,
    error,
  }
}
