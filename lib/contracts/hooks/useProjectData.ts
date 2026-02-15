
import { useReadContract } from 'wagmi'
import type { Abi } from 'viem'
import { getStageRaiseAddress } from '../addresses'
import StageRaiseABI from '../StageRaise.abi.json'
import type { ProjectInfo } from '../types'

const stageRaiseABI = StageRaiseABI as Abi

export function useProjectData(projectId: number, chainId: number) {
  const { 
    data: project, 
    isLoading, 
    error,
    refetch 
  } = useReadContract({
    address: getStageRaiseAddress(chainId),
    abi: stageRaiseABI,
    functionName: 'getProjectBasicInfo',
    args: [projectId],
  })

  return {
    project: project as ProjectInfo | undefined,
    isLoading,
    error,
    refetch,
  }
}


export function useProjectCount(chainId: number) {
  const { data, isLoading, error } = useReadContract({
    address: getStageRaiseAddress(chainId),
    abi: stageRaiseABI,
    functionName: 'getProjectCount',
  })

  return {
    projectCount: data as number | undefined,
    isLoading,
    error,
  }
}


export function useProjectBalance(projectId: number, chainId: number, enabled = true) {
  const { data, isLoading, error, refetch } = useReadContract({
    address: getStageRaiseAddress(chainId),
    abi: stageRaiseABI,
    functionName: 'getProjectBalance',
    args: [projectId],
    query: {
      enabled: enabled && projectId > 0,
    },
  })

  return {
    balance: data as bigint | undefined,
    isLoading,
    error,
    refetch,
  }
}


export function useWithdrawableAmount(projectId: number, chainId: number, enabled = true) {
  const { data, isLoading, error, refetch } = useReadContract({
    address: getStageRaiseAddress(chainId),
    abi: stageRaiseABI,
    functionName: 'getAmountWithdrawableForAProject',
    args: [projectId],
    query: {
      enabled: enabled && projectId > 0,
    },
  })

  return {
    withdrawableAmount: data as bigint | undefined,
    isLoading,
    error,
    refetch,
  }
}


export function useContributorAmount(
  projectId: number,
  address: `0x${string}`,
  chainId: number
) {
  const { data, isLoading, error, refetch } = useReadContract({
    address: getStageRaiseAddress(chainId),
    abi: stageRaiseABI,
    functionName: 'getProjectContributorAmount',
    args: [projectId, address],
  })

  return {
    contributorAmount: data as bigint | undefined,
    isLoading,
    error,
    refetch,
  }
}

export function useProjectPaymentToken(projectId: number, chainId: number) {
  const { data, isLoading, error } = useReadContract({
    address: getStageRaiseAddress(chainId),
    abi: stageRaiseABI,
    functionName: 'getProjectPaymentToken',
    args: [projectId],
  })

  return {
    paymentToken: data as `0x${string}` | undefined,
    isLoading,
    error,
  }
}
