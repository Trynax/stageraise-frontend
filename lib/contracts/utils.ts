import { formatUnits, parseUnits } from 'viem'
import { TOKEN_DECIMALS } from './addresses'
import type { PaymentToken } from './types'


export function formatTokenAmount(
  amount: bigint | undefined,
  decimals: number,
  displayDecimals: number = 2
): string {
  if (!amount) return '0'
  
  const formatted = formatUnits(amount, decimals)
  const num = parseFloat(formatted)
  
  return num.toLocaleString('en-US', {
    minimumFractionDigits: displayDecimals,
    maximumFractionDigits: displayDecimals,
  })
}


export function formatDeadline(timestamp: bigint | undefined): string {
  if (!timestamp) return 'N/A'
  
  const date = new Date(Number(timestamp) * 1000)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}


export function calculateProgress(
  raised: bigint | undefined,
  target: bigint | undefined
): number {
  if (!raised || !target || target === BigInt(0)) return 0
  
  return Number((raised * BigInt(100)) / target)
}


export function isDeadlinePassed(deadline: bigint | undefined): boolean {
  if (!deadline) return false
  
  const now = Math.floor(Date.now() / 1000)
  return Number(deadline) < now
}


export function formatVotingPower(votingPower: bigint | undefined): string {
  if (!votingPower) return '0%'

  const percentage = Number(votingPower) / 1e18 * 100
  
  return `${percentage.toFixed(2)}%`
}


export function getTimeRemaining(deadline: bigint | undefined): string {
  if (!deadline) return 'N/A'
  
  const now = Math.floor(Date.now() / 1000)
  const end = Number(deadline)
  const diff = end - now
  
  if (diff <= 0) return 'Ended'
  
  const days = Math.floor(diff / 86400)
  const hours = Math.floor((diff % 86400) / 3600)
  
  if (days > 0) return `${days} day${days > 1 ? 's' : ''}`
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''}`
  
  return 'Less than 1 hour'
}


export function getTokenDecimals(paymentToken: PaymentToken): number {
  return TOKEN_DECIMALS[paymentToken as keyof typeof TOKEN_DECIMALS]
}


export function validateFundingAmount(
  amount: string,
  minFunding: bigint,
  maxFunding: bigint,
  currentContribution: bigint,
  decimals: number
): { valid: boolean; error?: string } {
  try {
    const amountBigInt = parseUnits(amount, decimals)
    
    const normalizedAmount = decimals < 18 
      ? amountBigInt * BigInt(10 ** (18 - decimals))
      : amountBigInt
    
    if (normalizedAmount < minFunding) {
      return {
        valid: false,
        error: `Minimum funding is ${formatTokenAmount(minFunding, 18, 2)}`,
      }
    }
    
    const totalContribution = normalizedAmount + currentContribution
    if (totalContribution > maxFunding) {
      return {
        valid: false,
        error: `Maximum funding is ${formatTokenAmount(maxFunding, 18, 2)}`,
      }
    }
    
    return { valid: true }
  } catch (error) {
    return { valid: false, error: 'Invalid amount' }
  }
}


export function calculateVotePercentages(
  yesVotes: bigint | undefined,
  noVotes: bigint | undefined
): { yesPercent: number; noPercent: number } {
  if (!yesVotes || !noVotes) {
    return { yesPercent: 0, noPercent: 0 }
  }
  
  const total = yesVotes + noVotes
  if (total === BigInt(0)) {
    return { yesPercent: 0, noPercent: 0 }
  }
  
  const yesPercent = Number((yesVotes * BigInt(100)) / total)
  const noPercent = Number((noVotes * BigInt(100)) / total)
  
  return { yesPercent, noPercent }
}


export function formatAddress(address: string | undefined): string {
  if (!address) return ''
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}


export function needsApproval(
  allowance: bigint | undefined,
  amount: string,
  decimals: number
): boolean {
  if (!allowance) return true
  
  try {
    const amountBigInt = parseUnits(amount, decimals)
    return allowance < amountBigInt
  } catch {
    return true
  }
}
