import { bscTestnet } from 'wagmi/chains'

export const supportedChains = [bscTestnet] as const

const STAGERAISE_BSC_TESTNET_ADDRESS =
  (process.env.NEXT_PUBLIC_STAGERAISE_CONTRACT_BSC_TESTNET as `0x${string}` | undefined) ??
  '0x5e624d31bC13b3cE5405e6406DC77Ec0D0743e1a'

export const STAGERAISE_ADDRESSES = {
  [bscTestnet.id]: STAGERAISE_BSC_TESTNET_ADDRESS,
} as const

// Stablecoin addresses per chain
export const TOKEN_ADDRESSES = {
  [bscTestnet.id]: {
    USDC: '0x64544969ed7EBf5f083679233325356EbE738930',
    USDT: '0x337610d27c682E347C9cD60BD4b3b107C9d34dDd',
    BUSD: '0xeD24FC36d5Ee211Ea25A80239Fb8C4Cfd80f12Ee',
  }
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
  return chainTokens[token]
}
