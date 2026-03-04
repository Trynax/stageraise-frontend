import { bscTestnet, sepolia } from 'wagmi/chains'
import { ACTIVE_CHAIN_ID, ACTIVE_DEPLOY_CHAIN } from '@/lib/contracts/network'

export const supportedChains = ACTIVE_DEPLOY_CHAIN === 'sepolia' ? [sepolia] : [bscTestnet]

const STAGERAISE_BSC_TESTNET_ADDRESS =
  (process.env.NEXT_PUBLIC_STAGERAISE_CONTRACT_BSC_TESTNET as `0x${string}` | undefined) ??
  '0x5e624d31bC13b3cE5405e6406DC77Ec0D0743e1a'
const STAGERAISE_SEPOLIA_ADDRESS =
  (process.env.NEXT_PUBLIC_STAGERAISE_CONTRACT_SEPOLIA as `0x${string}` | undefined) ??
  (process.env.NEXT_PUBLIC_STAGERAISE_CONTRACT as `0x${string}` | undefined)

export const STAGERAISE_ADDRESSES = {
  [bscTestnet.id]: STAGERAISE_BSC_TESTNET_ADDRESS,
  ...(STAGERAISE_SEPOLIA_ADDRESS ? { [sepolia.id]: STAGERAISE_SEPOLIA_ADDRESS } : {})
} as const

// Stablecoin addresses per chain
export const TOKEN_ADDRESSES = {
  [bscTestnet.id]: {
    USDC: '0x64544969ed7EBf5f083679233325356EbE738930',
    USDT: '0x337610d27c682E347C9cD60BD4b3b107C9d34dDd',
    BUSD: '0xeD24FC36d5Ee211Ea25A80239Fb8C4Cfd80f12Ee',
  },
  [sepolia.id]: {
    USDC: (process.env.NEXT_PUBLIC_USDC_ADDRESS_SEPOLIA as `0x${string}` | undefined) ?? '',
    USDT: (process.env.NEXT_PUBLIC_USDT_ADDRESS_SEPOLIA as `0x${string}` | undefined) ?? '',
    BUSD: (process.env.NEXT_PUBLIC_BUSD_ADDRESS_SEPOLIA as `0x${string}` | undefined) ?? '',
  },
} as const


export const TOKEN_DECIMALS = {
  USDC: 6,
  USDT: 6,
  BUSD: 18,
} as const


export const TOKEN_NAMES = {
  USDC: 'USD Coin',
  USDT: 'Tether USD',
  BUSD: 'Binance USD',
} as const


export function getStageRaiseAddress(chainId: number): `0x${string}` {
  const address = STAGERAISE_ADDRESSES[chainId as keyof typeof STAGERAISE_ADDRESSES]
  if (!address) {
    throw new Error(`StageRaise not deployed on chain ${chainId}`)
  }
  return address
}


export function getTokenAddress(chainId: number, token: 'USDC' | 'USDT' | 'BUSD'): `0x${string}` {
  const chainTokens = TOKEN_ADDRESSES[chainId as keyof typeof TOKEN_ADDRESSES]
  if (!chainTokens) {
    throw new Error(`No token addresses for chain ${chainId}`)
  }
  const tokenAddress = chainTokens[token]
  if (!tokenAddress) {
    throw new Error(`Token ${token} not configured for chain ${chainId}`)
  }
  return tokenAddress as `0x${string}`
}
