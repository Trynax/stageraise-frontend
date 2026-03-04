export interface Token {
  symbol: string
  name: string
  address: string
  decimals: number
  icon: string
}

import { ACTIVE_CHAIN_ID } from "@/lib/contracts/network"
import { TOKEN_ADDRESSES } from "@/lib/contracts/addresses"

const chainTokens = TOKEN_ADDRESSES[ACTIVE_CHAIN_ID]

export const SUPPORTED_TOKENS: Token[] = [
  {
    symbol: 'BUSD',
    name: 'Binance USD',
    address: chainTokens.BUSD || '',
    decimals: 18,
    icon: '/icons/BUSD.svg'
  },
  {
    symbol: 'USDT',
    name: 'Tether USD',
    address: chainTokens.USDT || '',
    decimals: 6,
    icon: '/icons/USDT.svg'
  },
  {
    symbol: 'USDC',
    name: 'USD Coin',
    address: chainTokens.USDC || '',
    decimals: 6,
    icon: '/icons/USDC.svg'
  }
].filter((token) => /^0x[a-fA-F0-9]{40}$/.test(token.address))

export const getTokenByAddress = (address: string): Token | undefined => {
  return SUPPORTED_TOKENS.find(
    token => token.address.toLowerCase() === address.toLowerCase()
  )
}

export const getTokenBySymbol = (symbol: string): Token | undefined => {
  return SUPPORTED_TOKENS.find(
    token => token.symbol.toLowerCase() === symbol.toLowerCase()
  )
}
