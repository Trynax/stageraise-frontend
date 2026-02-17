import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { fallback, http } from 'wagmi';
import {
  mainnet,
  sepolia,
  bsc,
  bscTestnet,
} from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'StageRaise',
  projectId:`${process.env.NEXT_PUBLIC_REOWN_PROJECTID}`,
  chains: [
    bsc,
    bscTestnet,
  ],
  transports: {
    [bscTestnet.id]: fallback([
      http(process.env.NEXT_PUBLIC_BSC_TESTNET_RPC || 'https://bsc-testnet.publicnode.com'),
      http('https://bsc-testnet.publicnode.com'),
      http('https://data-seed-prebsc-1-s1.binance.org:8545'),
      http('https://data-seed-prebsc-2-s1.binance.org:8545'),
    ]),
    [bsc.id]: http('https://bsc-dataseed.binance.org'),
  },
  ssr: true, 
});
