import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { config } from 'dotenv'

// Load environment variables
config()

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set')
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
})

async function main() {
  console.log('🧹 Cleaning database...')

  // Clear all existing data
  await prisma.vote.deleteMany()
  await prisma.votingRound.deleteMany()
  await prisma.contribution.deleteMany()
  await prisma.milestone.deleteMany()
  await prisma.projectUpdate.deleteMany()
  await prisma.project.deleteMany()
  
  console.log('✅ Database cleared successfully!')
  console.log('')
  console.log('📋 Next steps:')
  console.log('1. Deploy StageRaise contract to BSC Testnet')
  console.log('2. Update CONTRACT_ADDRESS in .env.local')
  console.log('3. Connect wallet and create projects through the UI')
  console.log('4. Projects will be synced from blockchain to database')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
