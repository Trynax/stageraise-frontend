
import { useReadContract } from 'wagmi'
import type { Abi } from 'viem'
import { STAGERAISE_ADDRESSES } from '../addresses'
import StageRaiseABI from '../StageRaise.abi.json'
import type { ProjectInfo } from '../types'

const stageRaiseABI = StageRaiseABI as Abi
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000' as const

function getStageRaiseAddressIfSupported(chainId: number): `0x${string}` | undefined {
  const address = STAGERAISE_ADDRESSES[chainId as keyof typeof STAGERAISE_ADDRESSES]
  return address as `0x${string}` | undefined
}

export function useProjectData(projectId: number, chainId: number) {
  const stageRaiseAddress = getStageRaiseAddressIfSupported(chainId)
  const { 
    data: project, 
    isLoading, 
    error,
    refetch 
  } = useReadContract({
    address: stageRaiseAddress ?? ZERO_ADDRESS,
    abi: stageRaiseABI,
    functionName: 'getProjectBasicInfo',
    args: [projectId],
    query: {
      enabled: Boolean(stageRaiseAddress),
    },
  })

  return {
    project: project as ProjectInfo | undefined,
    isLoading,
    error,
    refetch,
  }
}


export function useProjectCount(chainId: number) {
  const stageRaiseAddress = getStageRaiseAddressIfSupported(chainId)
  const { data, isLoading, error } = useReadContract({
    address: stageRaiseAddress ?? ZERO_ADDRESS,
    abi: stageRaiseABI,
    functionName: 'getProjectCount',
    query: {
      enabled: Boolean(stageRaiseAddress),
    },
  })

  return {
    projectCount: data as number | undefined,
    isLoading,
    error,
  }
}


export function useProjectBalance(projectId: number, chainId: number, enabled = true) {
  const stageRaiseAddress = getStageRaiseAddressIfSupported(chainId)
  const { data, isLoading, error, refetch } = useReadContract({
    address: stageRaiseAddress ?? ZERO_ADDRESS,
    abi: stageRaiseABI,
    functionName: 'getProjectBalance',
    args: [projectId],
    query: {
      enabled: Boolean(stageRaiseAddress) && enabled && projectId > 0,
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
  const stageRaiseAddress = getStageRaiseAddressIfSupported(chainId)
  const { data, isLoading, error, refetch } = useReadContract({
    address: stageRaiseAddress ?? ZERO_ADDRESS,
    abi: stageRaiseABI,
    functionName: 'getAmountWithdrawableForAProject',
    args: [projectId],
    query: {
      enabled: Boolean(stageRaiseAddress) && enabled && projectId > 0,
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
  address: `0x${string}` | undefined,
  chainId: number,
  enabled = true
) {
  const stageRaiseAddress = getStageRaiseAddressIfSupported(chainId)
  const { data, isLoading, error, refetch } = useReadContract({
    address: stageRaiseAddress ?? ZERO_ADDRESS,
    abi: stageRaiseABI,
    functionName: 'getProjectContributorAmount',
    args: address ? [projectId, address] : undefined,
    query: {
      enabled: Boolean(stageRaiseAddress) && Boolean(address) && enabled && projectId > 0,
    },
  })

  return {
    contributorAmount: data as bigint | undefined,
    isLoading,
    error,
    refetch,
  }
}

export function useProjectPaymentToken(projectId: number, chainId: number) {
  const stageRaiseAddress = getStageRaiseAddressIfSupported(chainId)
  const { data, isLoading, error } = useReadContract({
    address: stageRaiseAddress ?? ZERO_ADDRESS,
    abi: stageRaiseABI,
    functionName: 'getProjectPaymentToken',
    args: [projectId],
    query: {
      enabled: Boolean(stageRaiseAddress),
    },
  })

  return {
    paymentToken: data as `0x${string}` | undefined,
    isLoading,
    error,
  }
}
