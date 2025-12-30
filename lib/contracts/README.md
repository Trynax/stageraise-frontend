# StageRaise Contract Integration

Complete set of React hooks and utilities for interacting with the StageRaise smart contract.

## Contract Details

- **Network**: BSC Testnet (Chain ID: 97)
- **Contract Address**: `0xe416F78434D3B068E18bEd48D4a61EeA3526AF68`
- **Owner**: `0x861A61C539749Caccd18D13F25a79Ea66Ff8Bb82`

### Supported Tokens
- **USDC**: `0x64544969ed7EBf5f083679233325356EbE738930` (6 decimals)
- **USDT**: `0x337610d27c682E347C9cD60BD4b3b107C9d34dDd` (6 decimals)
- **BUSD**: `0xeD24FC36d5Ee211Ea25A80239Fb8C4Cfd80f12Ee` (18 decimals)

## Installation

Make sure you have wagmi and viem installed:

```bash
npm install wagmi viem @tanstack/react-query
```

## Usage Examples

### 1. Create a Project

```typescript
import { useCreateProject } from '@/lib/contracts'
import { useChainId } from 'wagmi'

function CreateProjectForm() {
  const { createProject, isPending, isConfirming, isSuccess } = useCreateProject()
  const chainId = useChainId()

  const handleSubmit = async (formData) => {
    await createProject(formData, chainId)
  }

  return (
    <button onClick={handleSubmit} disabled={isPending || isConfirming}>
      {isPending ? 'Confirming...' : isConfirming ? 'Processing...' : 'Create Project'}
    </button>
  )
}
```

### 2. Fund a Project

```typescript
import { useFundProject, useTokenAllowance } from '@/lib/contracts'
import { useAccount, useChainId } from 'wagmi'

function FundProjectButton({ projectId, tokenAddress, amount, decimals }) {
  const { address } = useAccount()
  const chainId = useChainId()
  
  const { allowance } = useTokenAllowance(tokenAddress, address, chainId)
  const {
    approveToken,
    isApproving,
    isApproveSuccess,
    fundProject,
    isFunding,
  } = useFundProject()

  const needsApproval = allowance < parseUnits(amount, decimals)

  const handleApprove = () => {
    approveToken(tokenAddress, amount, decimals, chainId)
  }

  const handleFund = () => {
    fundProject(projectId, amount, decimals, chainId)
  }

  if (needsApproval) {
    return (
      <button onClick={handleApprove} disabled={isApproving}>
        {isApproving ? 'Approving...' : 'Approve Token'}
      </button>
    )
  }

  return (
    <button onClick={handleFund} disabled={isFunding}>
      {isFunding ? 'Funding...' : 'Fund Project'}
    </button>
  )
}
```

### 3. Display Project Data

```typescript
import { useProjectData, formatTokenAmount, calculateProgress } from '@/lib/contracts'
import { useChainId } from 'wagmi'

function ProjectCard({ projectId }) {
  const chainId = useChainId()
  const { project, isLoading } = useProjectData(projectId, chainId)

  if (isLoading) return <div>Loading...</div>

  const progress = calculateProgress(project.raisedAmount, project.targetAmount)

  return (
    <div>
      <h3>{project.name}</h3>
      <p>{project.description}</p>
      <p>Raised: {formatTokenAmount(project.raisedAmount, 18, 2)}</p>
      <p>Target: {formatTokenAmount(project.targetAmount, 18, 2)}</p>
      <p>Progress: {progress}%</p>
      <p>Contributors: {project.totalContributors}</p>
      <p>Active: {project.isActive ? 'Yes' : 'No'}</p>
    </div>
  )
}
```

### 4. Milestone Voting

```typescript
import { useVote, useVotingStatus, useHasVoted } from '@/lib/contracts'
import { useAccount, useChainId } from 'wagmi'

function VotingPanel({ projectId }) {
  const { address } = useAccount()
  const chainId = useChainId()
  
  const { vote, isPending } = useVote()
  const { isVotingOpen, yesVotes, noVotes, votingEndTime } = useVotingStatus(projectId, chainId)
  const { hasVoted } = useHasVoted(projectId, address, chainId)

  const handleVote = (voteYes: boolean) => {
    vote(projectId, voteYes, chainId)
  }

  if (!isVotingOpen) return <div>Voting not open</div>
  if (hasVoted) return <div>You already voted</div>

  return (
    <div>
      <p>Yes Votes: {yesVotes?.toString()}</p>
      <p>No Votes: {noVotes?.toString()}</p>
      <button onClick={() => handleVote(true)} disabled={isPending}>
        Vote Yes
      </button>
      <button onClick={() => handleVote(false)} disabled={isPending}>
        Vote No
      </button>
    </div>
  )
}
```

### 5. Withdraw Funds (Owner Only)

```typescript
import { useWithdraw, useWithdrawableAmount } from '@/lib/contracts'
import { useAccount, useChainId } from 'wagmi'

function WithdrawButton({ projectId, decimals }) {
  const { address } = useAccount()
  const chainId = useChainId()
  
  const { withdrawFunds, isPending } = useWithdraw()
  const { withdrawableAmount } = useWithdrawableAmount(projectId, chainId)

  const handleWithdraw = () => {
    if (withdrawableAmount && address) {
      const amount = formatUnits(withdrawableAmount, decimals)
      withdrawFunds(amount, projectId, address, decimals, chainId)
    }
  }

  return (
    <button onClick={handleWithdraw} disabled={isPending || !withdrawableAmount}>
      Withdraw {formatUnits(withdrawableAmount || 0n, decimals)}
    </button>
  )
}
```

### 6. Request Refund (After 3 Failed Milestones)

```typescript
import { useRefund } from '@/lib/contracts'
import { useChainId } from 'wagmi'

function RefundButton({ projectId, failedMilestones }) {
  const chainId = useChainId()
  const { requestRefund, isPending } = useRefund()

  const canRefund = failedMilestones >= 3

  const handleRefund = () => {
    requestRefund(projectId, chainId)
  }

  if (!canRefund) return null

  return (
    <button onClick={handleRefund} disabled={isPending}>
      {isPending ? 'Processing...' : 'Request Refund'}
    </button>
  )
}
```

## Available Hooks

### Project Management
- `useCreateProject()` - Create new projects
- `useProjectData(projectId, chainId)` - Get project information
- `useProjectCount(chainId)` - Get total project count
- `useProjectBalance(projectId, chainId)` - Get project balance
- `useWithdrawableAmount(projectId, chainId)` - Get withdrawable amount
- `useContributorAmount(projectId, address, chainId)` - Get contributor's contribution

### Funding
- `useFundProject()` - Fund a project (approve + fund)
- `useTokenBalance(tokenAddress, userAddress)` - Check token balance
- `useTokenAllowance(tokenAddress, ownerAddress, chainId)` - Check allowance

### Voting
- `useOpenVoting()` - Open project for milestone voting
- `useVote()` - Cast a vote
- `useFinalizeVoting()` - Finalize voting after period ends
- `useVotingStatus(projectId, chainId)` - Get voting status and results
- `useHasVoted(projectId, userAddress, chainId)` - Check if user voted
- `useVotingPower(projectId, userAddress, chainId)` - Get user's voting power

### Withdrawals & Refunds
- `useWithdraw()` - Withdraw funds (owner only)
- `useRefund()` - Request refund (after 3 failed milestones)

## Utility Functions

```typescript
import {
  formatTokenAmount,
  formatDeadline,
  calculateProgress,
  isDeadlinePassed,
  formatVotingPower,
  getTimeRemaining,
  validateFundingAmount,
  calculateVotePercentages,
  formatAddress,
  needsApproval,
} from '@/lib/contracts'
```

## Important Notes

1. **Amounts are normalized**: The contract uses 18 decimals internally, but tokens have different decimals (USDC/USDT = 6, BUSD = 18). The hooks handle this conversion automatically.

2. **Two-step funding**: Users must first approve the contract to spend their tokens, then fund the project.

3. **Voting power**: Based on contribution percentage (1e18 = 100%)

4. **Milestone withdrawals**: Owners can only withdraw proportional to completed milestones

5. **Refunds**: Only available after 3 failed milestone votes

## Testing on BSC Testnet

Get testnet tokens from:
- [BSC Testnet Faucet](https://testnet.binance.org/faucet-smart)
- Request test USDC/USDT/BUSD from the contract owner

## Next Steps

1. ✅ Hooks are ready
2. ⏳ Integrate hooks into UI components
3. ⏳ Set up backend for metadata storage (IPFS + database)
4. ⏳ Add event listeners for real-time updates
5. ⏳ Build project listing page
6. ⏳ Complete funding flow UI
7. ⏳ Add voting interface
