import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseUnits } from 'viem'
import { getStageRaiseAddress, TOKEN_DECIMALS } from '../addresses'
import StageRaiseABI from '../StageRaise.abi.json'
import type { CreateProjectParams } from '../types'

const stageRaiseABI = StageRaiseABI as any

interface CreateProjectFormData {
  projectName: string
  description: string
  fundraisingTarget: string
  fundingDeadline: string
  minContribution: string
  maxContribution: string
  numberOfMilestones: string
  votingPeriod: string
  projectType: 'milestone' | 'traditional'
  paymentToken: string // Token address (0x...)
}

export function useCreateProject() {
  const { 
    writeContract, 
    data: hash, 
    isPending,
    error: writeError
  } = useWriteContract()
  
  const { 
    isLoading: isConfirming, 
    isSuccess,
    data: receipt 
  } = useWaitForTransactionReceipt({ hash })

  const createProject = async (
    formData: CreateProjectFormData,
    chainId: number
  ) => {
    // Payment token is already an address from the form
    const tokenAddress = formData.paymentToken as `0x${string}`
    
    if (!tokenAddress || !tokenAddress.startsWith('0x')) {
      throw new Error('Invalid payment token address')
    }

    const targetAmount = parseUnits(formData.fundraisingTarget, 18)
    const minFunding = parseUnits(formData.minContribution, 18)
    const maxFunding = parseUnits(formData.maxContribution, 18)


    const deadline = BigInt(
      Math.floor(new Date(formData.fundingDeadline).getTime() / 1000)
    )

 
    const votingPeriodSeconds = BigInt(
      Number(formData.votingPeriod) * 24 * 60 * 60
    )

    const params: CreateProjectParams = {
      paymentToken: tokenAddress,
      targetAmount,
      minFunding,
      maxFunding,
      deadline,
      timeForMileStoneVotingProcess: votingPeriodSeconds,
      milestoneCount: Number(formData.numberOfMilestones) || 0,
      milestoneBased: formData.projectType === 'milestone',
      name: formData.projectName,
      description: formData.description,
    }

    writeContract({
      address: getStageRaiseAddress(chainId),
      abi: stageRaiseABI,
      functionName: 'createProject',
      args: [params],
    })
  }

  return {
    createProject,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    receipt,
    error: writeError,
  }
}
