import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseUnits, erc20Abi } from 'viem'
import { getStageRaiseAddress } from '../addresses'
import StageRaiseABI from '../StageRaise.abi.json'

const stageRaiseABI = StageRaiseABI as any

export function useFundProject() {
  const { 
    writeContract: approveWrite, 
    data: approveHash,
    isPending: isApproving,
    error: approveError
  } = useWriteContract()

  const {
    isLoading: isApproveConfirming,
    isSuccess: isApproveSuccess
  } = useWaitForTransactionReceipt({ hash: approveHash })
  
  const { 
    writeContract: fundWrite, 
    data: fundHash,
    isPending: isFunding,
    error: fundError
  } = useWriteContract()

  const {
    isLoading: isFundConfirming,
    isSuccess: isFundSuccess
  } = useWaitForTransactionReceipt({ hash: fundHash })

  const approveToken = async (
    tokenAddress: `0x${string}`,
    amount: string,
    decimals: number,
    chainId: number
  ) => {

    const parsedAmount = parseUnits(amount, decimals)
    
    approveWrite({
      address: tokenAddress,
      abi: erc20Abi,
      functionName: 'approve',
      args: [getStageRaiseAddress(chainId), parsedAmount],
    })
  }


  const fundProject = async (
    projectId: number,
    amount: string,
    decimals: number,
    chainId: number
  ) => {
    const parsedAmount = parseUnits(amount, decimals)
    
    fundWrite({
      address: getStageRaiseAddress(chainId),
      abi: stageRaiseABI,
      functionName: 'fundProject',
      args: [projectId, parsedAmount],
    })
  }

  return {

    approveToken,
    approveHash,
    isApproving,
    isApproveConfirming,
    isApproveSuccess,
    approveError,

    fundProject,
    fundHash,
    isFunding,
    isFundConfirming,
    isFundSuccess,
    fundError,
  }
}
