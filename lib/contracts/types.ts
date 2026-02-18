export interface ProjectBasics {
  owner: `0x${string}`
  paymentToken: `0x${string}`
  targetAmount: bigint
  raisedAmount: bigint
  minFunding: bigint
  maxFunding: bigint
  fundingStart: bigint
  fundingEnd: bigint
  projectId: number
  totalContributors: number
  isActive: boolean
}

export interface ProjectMilestone {
  timeForMilestoneVotingProcess: bigint
  timeForTheVotingProcessToElapsed: bigint
  milestoneCount: number
  milestoneStage: number
  failedMilestoneStage: number
  votingRound: number
  milestoneBased: boolean
  openForMilestoneVotingStage: boolean
  votesForYes: bigint
  votesForNo: bigint
}

export interface ProjectInfo {
  owner: `0x${string}`
  paymentToken: `0x${string}`
  targetAmount: bigint
  raisedAmount: bigint
  minFunding: bigint
  maxFunding: bigint
  fundingStart: bigint
  fundingEnd: bigint
  projectId: number
  totalContributors: number
  milestoneCount: number
  isActive: boolean
  milestoneBased: boolean
  name: string
  description: string
}

export interface CreateProjectParams {
  paymentToken: `0x${string}`
  targetAmount: bigint
  minFunding: bigint
  maxFunding: bigint
  fundingStart: bigint
  fundingEnd: bigint
  timeForMileStoneVotingProcess: bigint
  milestoneCount: number
  milestoneBased: boolean
  name: string
  description: string
}

export type PaymentToken = 'USDC' | 'USDT' | 'BUSD'
