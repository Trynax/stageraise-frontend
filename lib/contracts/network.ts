import { bscTestnet, sepolia } from "viem/chains"

const deployChainEnv = process.env.NEXT_PUBLIC_DEPLOY_CHAIN?.trim().toLowerCase()

export const ACTIVE_VIEM_CHAIN = deployChainEnv === "sepolia" ? sepolia : bscTestnet
export const ACTIVE_CHAIN_ID = ACTIVE_VIEM_CHAIN.id

export const ACTIVE_RPC_URL =
  deployChainEnv === "sepolia"
    ? process.env.NEXT_PUBLIC_SEPOLIA_RPC || "https://ethereum-sepolia-rpc.publicnode.com"
    : process.env.NEXT_PUBLIC_BSC_TESTNET_RPC || "https://bsc-testnet.publicnode.com"

export const ACTIVE_DEPLOY_CHAIN = deployChainEnv === "sepolia" ? "sepolia" : "bscTestnet"

const TX_EXPLORER_BASE_BY_CHAIN: Record<number, string> = {
  [bscTestnet.id]: "https://testnet.bscscan.com/tx/",
  [sepolia.id]: "https://sepolia.etherscan.io/tx/",
}

export function getExplorerTxBaseUrl(chainId?: number): string {
  const resolvedChainId = chainId ?? ACTIVE_CHAIN_ID
  return TX_EXPLORER_BASE_BY_CHAIN[resolvedChainId] ?? TX_EXPLORER_BASE_BY_CHAIN[ACTIVE_CHAIN_ID]
}
