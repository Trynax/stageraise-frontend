import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import type { Abi } from 'viem'
import { parseUnits } from 'viem'
import { getStageRaiseAddress } from '../addresses'
import StageRaiseABI from '../StageRaise.abi.json'
import type { CreateProjectParams } from '../types'

const stageRaiseABI = StageRaiseABI as Abi

interface CreateProjectFormData {
  projectName: string
  description: string
  fundraisingTarget: string
  fundingStart: string
  fundingEnd: string
  fundingDeadline?: string
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


    const fundingStartDate = formData.fundingStart
      ? new Date(formData.fundingStart)
      : new Date()
    const fundingEndDate = formData.fundingEnd
      ? new Date(formData.fundingEnd)
      : formData.fundingDeadline
        ? new Date(formData.fundingDeadline)
        : null

    if (!fundingEndDate || Number.isNaN(fundingStartDate.getTime()) || Number.isNaN(fundingEndDate.getTime())) {
      throw new Error('Invalid funding start or end date')
    }

    if (fundingEndDate.getTime() <= fundingStartDate.getTime()) {
      throw new Error('Funding end time must be after funding start time')
    }

    const fundingStart = BigInt(Math.floor(fundingStartDate.getTime() / 1000))
    const fundingEnd = BigInt(Math.floor(fundingEndDate.getTime() / 1000))

 
    const votingPeriodSeconds = BigInt(
      Number(formData.votingPeriod) * 24 * 60 * 60
    )

    const params: CreateProjectParams = {
      paymentToken: tokenAddress,
      targetAmount,
      minFunding,
      maxFunding,
      fundingStart,
      fundingEnd,
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
