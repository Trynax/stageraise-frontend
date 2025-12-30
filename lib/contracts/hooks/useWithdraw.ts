import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseUnits } from 'viem'
import { getStageRaiseAddress } from '../addresses'
import StageRaiseABI from '../StageRaise.abi.json'

const stageRaiseABI = StageRaiseABI as any

export function useWithdraw() {
  const {
    writeContract,
    data: hash,
    isPending,
    error
  } = useWriteContract()

  const {
    isLoading: isConfirming,
    isSuccess
  } = useWaitForTransactionReceipt({ hash })

  const withdrawFunds = (
    amount: string,
    projectId: number,
    toAddress: `0x${string}`,
    decimals: number,
    chainId: number
  ) => {
    const parsedAmount = parseUnits(amount, decimals)

    writeContract({
      address: getStageRaiseAddress(chainId),
      abi: stageRaiseABI,
      functionName: 'withdrawFunds',
      args: [parsedAmount, projectId, toAddress],
    })
  }

  return {
    withdrawFunds,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  }
}
