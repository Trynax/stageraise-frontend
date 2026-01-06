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
  console.log('🌱 Starting database seed...')

  // Clear existing data
  await prisma.vote.deleteMany()
  await prisma.votingRound.deleteMany()
  await prisma.contribution.deleteMany()
  await prisma.milestone.deleteMany()
  await prisma.projectUpdate.deleteMany()
  await prisma.project.deleteMany()
  console.log('✅ Cleared existing data')

  // Create sample projects
  const project1 = await prisma.project.create({
    data: {
      projectId: 100,
      contractAddress: '0x1234567890123456789012345678901234567890',
      chainId: 97, // BSC Testnet
      ownerAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1',
      
      name: 'Next-Gen VR Gaming Platform',
      category: 'Gaming',
      tags: ['gaming', 'metaverse', 'vr'],
      description: 'Building an immersive VR gaming platform with blockchain-based asset ownership. Players can truly own their in-game items as NFTs and trade them freely.',
      
      coverImageUrl: 'https://images.unsplash.com/photo-1592478411213-6153e4ebc07d?w=800&q=80',
      logoUrl: 'https://images.unsplash.com/photo-1592478411213-6153e4ebc07d?w=200&q=80',
      galleryImageUrls: [
        'https://images.unsplash.com/photo-1535223289827-42f1e9919769?w=800&q=80',
        'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80'
      ],
      
      websiteUrl: 'https://example.com',
      twitterUrl: 'https://twitter.com/example',
      discordUrl: 'https://discord.gg/example',
      
      fundingTarget: 50000,
      fundingDeadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
      minContribution: 10,
      maxContribution: 10000,
      votingPeriodDays: 7,
      paymentToken: '0x0000000000000000000000000000000000000000', // ETH
      
      cachedRaisedAmount: 32500,
      cachedTotalContributors: 127,
      
      currentMilestone: 2,
      failedVotingCount: 0,
      status: 'active',
      
      milestones: {
        create: [
          {
            stage: 1,
            title: 'Platform Architecture & Design',
            description: 'Complete technical architecture design and UI/UX mockups for the VR platform',
            deliverables: [
              'System architecture document',
              'Database schema design',
              'UI/UX wireframes and mockups',
              'Technical feasibility report'
            ]
          },
          {
            stage: 2,
            title: 'Core VR Engine Development',
            description: 'Build the foundational VR engine with basic locomotion and interaction systems',
            deliverables: [
              'VR locomotion system',
              'Hand tracking implementation',
              'Basic interaction mechanics',
              'Performance optimization'
            ]
          },
          {
            stage: 3,
            title: 'Blockchain Integration',
            description: 'Integrate blockchain for NFT minting and wallet connectivity',
            deliverables: [
              'Smart contract deployment',
              'Wallet integration',
              'NFT minting functionality',
              'Marketplace backend'
            ]
          }
        ]
      }
    },
    include: {
      milestones: true
    }
  })

  const project2 = await prisma.project.create({
    data: {
      projectId: 101,
      contractAddress: '0x2345678901234567890123456789012345678901',
      chainId: 97,
      ownerAddress: '0x853d955aCEf822Db058eb8505911ED77F175b99e',
      
      name: 'Decentralized Social Media Platform',
      category: 'Social',
      tags: ['social', 'web3', 'dao'],
      description: 'A censorship-resistant social media platform where users own their content and data. Built on IPFS with token-based governance.',
      
      coverImageUrl: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80',
      logoUrl: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=200&q=80',
      
      websiteUrl: 'https://example2.com',
      twitterUrl: 'https://twitter.com/example2',
      
      fundingTarget: 35000,
      fundingDeadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
      minContribution: 5,
      maxContribution: 5000,
      votingPeriodDays: 7,
      paymentToken: '0x0000000000000000000000000000000000000000',
      
      cachedRaisedAmount: 28000,
      cachedTotalContributors: 85,
      
      currentMilestone: 1,
      failedVotingCount: 0,
      status: 'active',
      
      milestones: {
        create: [
          {
            stage: 1,
            title: 'MVP Development',
            description: 'Build minimum viable product with core posting and feed functionality',
            deliverables: [
              'User authentication',
              'Post creation and editing',
              'Feed algorithm',
              'Basic user profiles'
            ]
          },
          {
            stage: 2,
            title: 'IPFS Integration',
            description: 'Integrate IPFS for decentralized content storage',
            deliverables: [
              'IPFS node setup',
              'Content pinning service',
              'Media upload optimization',
              'CDN integration'
            ]
          }
        ]
      }
    }
  })

  const project3 = await prisma.project.create({
    data: {
      projectId: 102,
      contractAddress: '0x3456789012345678901234567890123456789012',
      chainId: 97,
      ownerAddress: '0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE',
      
      name: 'AI-Powered NFT Marketplace',
      category: 'NFT',
      tags: ['nft', 'ai', 'marketplace'],
      description: 'An NFT marketplace with AI-driven recommendation engine and automated pricing suggestions for creators.',
      
      coverImageUrl: 'https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?w=800&q=80',
      logoUrl: 'https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?w=200&q=80',
      
      fundingTarget: 25000,
      fundingDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      minContribution: 20,
      maxContribution: 10000,
      votingPeriodDays: 7,
      paymentToken: '0x0000000000000000000000000000000000000000',
      
      cachedRaisedAmount: 18500,
      cachedTotalContributors: 52,
      
      currentMilestone: 1,
      failedVotingCount: 0,
      status: 'active',
      
      milestones: {
        create: [
          {
            stage: 1,
            title: 'Marketplace Core',
            description: 'Build core marketplace functionality with listing and purchasing',
            deliverables: [
              'NFT listing interface',
              'Purchase flow',
              'Royalty management',
              'Escrow system'
            ]
          },
          {
            stage: 2,
            title: 'AI Recommendation Engine',
            description: 'Develop AI model for personalized NFT recommendations',
            deliverables: [
              'Machine learning model',
              'User preference tracking',
              'Recommendation API',
              'A/B testing framework'
            ]
          },
          {
            stage: 3,
            title: 'Price Oracle System',
            description: 'Create AI-powered pricing suggestions for NFT creators',
            deliverables: [
              'Historical price analysis',
              'Market trend prediction',
              'Dynamic pricing model',
              'Creator dashboard'
            ]
          }
        ]
      }
    }
  })

  console.log('✅ Created 3 sample projects')

  // Add some contributions
  await prisma.contribution.create({
    data: {
      projectId: project1.id, // Use database ID, not projectId
      contributor: '0x123abc...',
      amount: 500,
      transactionHash: '0xabcdef...',
      blockNumber: BigInt(12345678),
      chainId: 97
    }
  })

  await prisma.contribution.create({
    data: {
      projectId: project1.id,
      contributor: '0x456def...',
      amount: 1000,
      transactionHash: '0x123456...',
      blockNumber: BigInt(12345680),
      chainId: 97
    }
  })

  console.log('✅ Added sample contributions')

  // Add a voting round for project1
  const votingRound1 = await prisma.votingRound.create({
    data: {
      projectId: project1.id, // Use database ID
      milestoneStage: 1,
      proofDocuments: JSON.parse(JSON.stringify([
        { cid: 'Qm...', url: 'https://ipfs.io/ipfs/Qm...', filename: 'milestone-1-proof.pdf', uploadedAt: new Date() },
        { cid: 'Qm...', url: 'https://ipfs.io/ipfs/Qm...', filename: 'milestone-1-screenshot.png', uploadedAt: new Date() }
      ])),
      result: 'passed',
      yesVotes: 2,
      noVotes: 1,
      totalVoters: 3,
      votingStarted: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
      votingEnded: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      isActive: false
    }
  })

  // Add votes for the voting round
  await prisma.vote.createMany({
    data: [
      {
        projectId: project1.id,
        milestoneStage: 1,
        votingRoundId: votingRound1.id,
        voter: '0x123abc...',
        voteYes: true,
        transactionHash: '0xvote1...',
        blockNumber: BigInt(12345690),
        timestamp: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000)
      },
      {
        projectId: project1.id,
        milestoneStage: 1,
        votingRoundId: votingRound1.id,
        voter: '0x456def...',
        voteYes: true,
        transactionHash: '0xvote2...',
        blockNumber: BigInt(12345691),
        timestamp: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000)
      },
      {
        projectId: project1.id,
        milestoneStage: 1,
        votingRoundId: votingRound1.id,
        voter: '0x789ghi...',
        voteYes: false,
        transactionHash: '0xvote3...',
        blockNumber: BigInt(12345692),
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      }
    ]
  })

  console.log('✅ Added voting round and votes')

  console.log('🎉 Database seed completed successfully!')
  console.log(`
  Summary:
  - Projects: 3
  - Contributions: 2
  - Voting Rounds: 1
  - Votes: 3
  `)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Error seeding database:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
