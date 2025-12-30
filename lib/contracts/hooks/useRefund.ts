import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { getStageRaiseAddress } from '../addresses'
import StageRaiseABI from '../StageRaise.abi.json'

const stageRaiseABI = StageRaiseABI as any

export function useRefund() {
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

  const requestRefund = (projectId: number, chainId: number) => {
    writeContract({
      address: getStageRaiseAddress(chainId),
      abi: stageRaiseABI,
      functionName: 'requestRefund',
      args: [projectId],
    })
  }

  return {
    requestRefund,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  }
}
