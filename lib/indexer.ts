import { createPublicClient, http, parseAbiItem } from 'viem'
import { bscTestnet } from 'viem/chains'
import { prisma } from '@/lib/prisma'
import { getStageRaiseAddress } from '@/lib/contracts/addresses'
import StageRaiseABI from '@/lib/contracts/StageRaise.abi.json'

const stageRaiseABI = StageRaiseABI as any

const client = createPublicClient({
  chain: bscTestnet,
  transport: http()
})

const CHAIN_ID = 97
const CONTRACT_ADDRESS = getStageRaiseAddress(CHAIN_ID)
const SYNC_INTERVAL = 30000 // 30 seconds
const BLOCKS_PER_BATCH = BigInt(1000)

// Track last synced block
let lastSyncedBlock: bigint | null = null

async function getLastSyncedBlock(): Promise<bigint> {
  if (lastSyncedBlock) return lastSyncedBlock

  // Get from database
  const project = await prisma.project.findFirst({
    orderBy: { lastSyncedBlock: 'desc' },
    select: { lastSyncedBlock: true }
  })

  if (project?.lastSyncedBlock) {
    lastSyncedBlock = BigInt(project.lastSyncedBlock.toString())
    return lastSyncedBlock
  }

  // Start from current block - 1000 if no history
  const currentBlock = await client.getBlockNumber()
  lastSyncedBlock = currentBlock - BigInt(1000)
  return lastSyncedBlock
}

async function updateLastSyncedBlock(blockNumber: bigint) {
  lastSyncedBlock = blockNumber
}

// Index ProjectCreated events
async function indexProjectCreated(fromBlock: bigint, toBlock: bigint) {
  try {
    const logs = await client.getContractEvents({
      address: CONTRACT_ADDRESS,
      abi: stageRaiseABI,
      eventName: 'ProjectCreated',
      fromBlock,
      toBlock
    })

    for (const log of logs) {
      const logWithArgs = log as any
      if (!logWithArgs.args) continue
      const { projectId } = logWithArgs.args
      
      console.log(`Indexed ProjectCreated: projectId=${projectId}, block=${log.blockNumber}`)
      
      // Update project sync info
      await prisma.project.updateMany({
        where: { projectId: Number(projectId) },
        data: {
          lastSyncedBlock: log.blockNumber,
          lastActivityAt: new Date()
        }
      })
    }

    return logs.length
  } catch (error) {
    console.error('Error indexing ProjectCreated:', error)
    return 0
  }
}

// Index ProjectFunded events
async function indexProjectFunded(fromBlock: bigint, toBlock: bigint) {
  try {
    const logs = await client.getContractEvents({
      address: CONTRACT_ADDRESS,
      abi: stageRaiseABI,
      eventName: 'ProjectFunded',
      fromBlock,
      toBlock
    })

    for (const log of logs) {
      const logWithArgs = log as any
      if (!logWithArgs.args) continue
      const { projectId, funder, amount } = logWithArgs.args
      
      console.log(`Indexed ProjectFunded: projectId=${projectId}, funder=${funder}, amount=${amount}`)
      
      // Create contribution record
      await prisma.contribution.upsert({
        where: { transactionHash: log.transactionHash },
        create: {
          projectId: String(projectId), // Will need to link to actual project
          contributor: funder as string,
          amount: Number(amount) / 1e18, // Convert from 18 decimals
          transactionHash: log.transactionHash,
          blockNumber: log.blockNumber,
          chainId: CHAIN_ID,
          timestamp: new Date()
        },
        update: {}
      })

      // Update project cache
      const project = await prisma.project.findUnique({
        where: { projectId: Number(projectId) },
        include: { contributions: true }
      })

      if (project) {
        const contributorsCount = new Set(
          project.contributions.map(c => c.contributor)
        ).size

        await prisma.project.update({
          where: { id: project.id },
          data: {
            cachedTotalContributors: contributorsCount,
            lastSyncedBlock: log.blockNumber,
            lastActivityAt: new Date()
          }
        })
      }
    }

    return logs.length
  } catch (error) {
    console.error('Error indexing ProjectFunded:', error)
    return 0
  }
}

// Index VoteCast events
async function indexVoteCast(fromBlock: bigint, toBlock: bigint) {
  try {
    const logs = await client.getContractEvents({
      address: CONTRACT_ADDRESS,
      abi: stageRaiseABI,
      eventName: 'VoteCast',
      fromBlock,
      toBlock
    })

    for (const log of logs) {
      const logWithArgs = log as any
      if (!logWithArgs.args) continue
      const { projectId, voter, voteYes, milestoneStage } = logWithArgs.args
      
      console.log(`Indexed VoteCast: projectId=${projectId}, voter=${voter}, voteYes=${voteYes}`)
      
      // Create vote record
      const project = await prisma.project.findUnique({
        where: { projectId: Number(projectId) }
      })

      if (project) {
        await prisma.vote.upsert({
          where: {
            transactionHash: log.transactionHash
          },
          create: {
            projectId: project.id,
            voter: voter as string,
            milestoneStage: Number(milestoneStage),
            voteYes: Boolean(voteYes),
            transactionHash: log.transactionHash,
            blockNumber: log.blockNumber,
            timestamp: new Date()
          },
          update: {}
        })

        await prisma.project.update({
          where: { id: project.id },
          data: {
            lastSyncedBlock: log.blockNumber,
            lastActivityAt: new Date()
          }
        })
      }
    }

    return logs.length
  } catch (error) {
    console.error('Error indexing VoteCast:', error)
    return 0
  }
}

// Main sync loop
async function syncEvents() {
  try {
    const currentBlock = await client.getBlockNumber()
    const fromBlock = await getLastSyncedBlock()
    
    // Don't sync if we're up to date
    if (fromBlock >= currentBlock) {
      console.log('Already up to date')
      return
    }

    // Sync in batches to avoid RPC limits
    let toBlock = fromBlock + BLOCKS_PER_BATCH
    if (toBlock > currentBlock) {
      toBlock = currentBlock
    }

    console.log(`Syncing blocks ${fromBlock} to ${toBlock}...`)

    // Index all event types
    const [createdCount, fundedCount, voteCount] = await Promise.all([
      indexProjectCreated(fromBlock, toBlock),
      indexProjectFunded(fromBlock, toBlock),
      indexVoteCast(fromBlock, toBlock)
    ])

    console.log(`Indexed: ${createdCount} created, ${fundedCount} funded, ${voteCount} votes`)

    // Update last synced block
    await updateLastSyncedBlock(toBlock)
    
  } catch (error) {
    console.error('Sync error:', error)
  }
}

// Start indexer
export async function startIndexer() {
  console.log('Starting blockchain event indexer...')
  console.log(`Contract: ${CONTRACT_ADDRESS}`)
  console.log(`Chain: BSC Testnet (${CHAIN_ID})`)
  
  // Initial sync
  await syncEvents()
  
  // Continue syncing every 30 seconds
  setInterval(syncEvents, SYNC_INTERVAL)
}

// Manual trigger for API endpoint
export async function triggerSync() {
  await syncEvents()
  return {
    success: true,
    lastSyncedBlock: lastSyncedBlock?.toString()
  }
}
