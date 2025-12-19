import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import {
  mainnet,

  sepolia,
  bsc,
  bscTestnet,
} from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'StageRaise',
  projectId:`${process.env.REOWN_PROJECTID}`,
  chains: [
    mainnet,
    bsc,
    bscTestnet,
    sepolia,
  ],
  ssr: true, 
});
