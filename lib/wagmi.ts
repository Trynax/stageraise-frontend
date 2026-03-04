import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { fallback, http } from 'wagmi';
import {
  sepolia,
  bscTestnet,
} from 'wagmi/chains';
import { ACTIVE_DEPLOY_CHAIN } from '@/lib/contracts/network';

const activeChain = ACTIVE_DEPLOY_CHAIN === 'sepolia' ? sepolia : bscTestnet
const activeTransport =
  ACTIVE_DEPLOY_CHAIN === 'sepolia'
    ? http(process.env.NEXT_PUBLIC_SEPOLIA_RPC || 'https://ethereum-sepolia-rpc.publicnode.com')
    : fallback([
        http(process.env.NEXT_PUBLIC_BSC_TESTNET_RPC || 'https://bsc-testnet.publicnode.com'),
        http('https://bsc-testnet.publicnode.com'),
        http('https://data-seed-prebsc-1-s1.binance.org:8545'),
        http('https://data-seed-prebsc-2-s1.binance.org:8545'),
      ])

export const config = getDefaultConfig({
  appName: 'StageRaise',
  projectId:`${process.env.NEXT_PUBLIC_REOWN_PROJECTID}`,
  chains: [activeChain],
  transports: {
    [activeChain.id]: activeTransport,
  },
  ssr: true, 
});
