import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { http } from 'wagmi';
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
    [bscTestnet.id]: http(process.env.NEXT_PUBLIC_BSC_TESTNET_RPC || 'https://bsc-testnet.publicnode.com'),
    [bsc.id]: http('https://bsc-dataseed.binance.org'),
  },
  ssr: true, 
});
