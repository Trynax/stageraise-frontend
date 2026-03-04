export interface Token {
  symbol: string
  name: string
  address: string
  decimals: number
  icon: string
}

// BSC Testnet token addresses
export const SUPPORTED_TOKENS: Token[] = [
  {
    symbol: 'BUSD',
    name: 'Binance USD',
    address: '0xeD24FC36d5Ee211Ea25A80239Fb8C4Cfd80f12Ee', // BSC Testnet BUSD
    decimals: 18,
    icon: '/icons/BUSD.svg'
  },
  {
    symbol: 'USDT',
    name: 'Tether USD',
    address: '0x337610d27c682E347C9cD60BD4b3b107C9d34dDd', // BSC Testnet USDT
    decimals: 6,
    icon: '/icons/USDT.svg'
  },
  {
    symbol: 'USDC',
    name: 'USD Coin',
    address: '0x64544969ed7EBf5f083679233325356EbE738930', // BSC Testnet USDC
    decimals: 6,
    icon: '/icons/USDC.svg'
  }
]

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
