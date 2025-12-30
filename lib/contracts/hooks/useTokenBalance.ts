
import { useReadContract } from 'wagmi'
import { erc20Abi } from 'viem'
import { getStageRaiseAddress } from '../addresses'


export function useTokenBalance(
  tokenAddress: `0x${string}`,
  userAddress: `0x${string}` | undefined
) {
  const { data, isLoading, error, refetch } = useReadContract({
    address: tokenAddress,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: userAddress ? [userAddress] : undefined,
    query: {
      enabled: !!userAddress,
    },
  })

  return {
    balance: data as bigint | undefined,
    isLoading,
    error,
    refetch,
  }
}


export function useTokenAllowance(
  tokenAddress: `0x${string}`,
  ownerAddress: `0x${string}` | undefined,
  chainId: number
) {
  const { data, isLoading, error, refetch } = useReadContract({
    address: tokenAddress,
    abi: erc20Abi,
    functionName: 'allowance',
    args: ownerAddress ? [ownerAddress, getStageRaiseAddress(chainId)] : undefined,
    query: {
      enabled: !!ownerAddress,
    },
  })

  return {
    allowance: data as bigint | undefined,
    isLoading,
    error,
    refetch,
  }
}

export function useTokenDecimals(tokenAddress: `0x${string}`) {
  const { data, isLoading, error } = useReadContract({
    address: tokenAddress,
    abi: erc20Abi,
    functionName: 'decimals',
  })

  return {
    decimals: data as number | undefined,
    isLoading,
    error,
  }
}


export function useTokenSymbol(tokenAddress: `0x${string}`) {
  const { data, isLoading, error } = useReadContract({
    address: tokenAddress,
    abi: erc20Abi,
    functionName: 'symbol',
  })

  return {
    symbol: data as string | undefined,
    isLoading,
    error,
  }
}
