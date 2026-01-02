// Mock data for project detail page testing

export const mockProjectDetail = {
  // Project 1: Currently Funding with Milestones
  funding: {
    id: 1,
    projectId: 1,
    tagline: "Apilax - monatic",
    logoUrl: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200&h=200&fit=crop&q=80",
    currentMilestone: 0,
    tags: ["Real Estate", "Crypto", "DeFi", "Property"],
    description: `Apilax-monatic is a revolutionary crypto real-estate project that aims to build sustainable housing for blockchain believers and crypto enthusiasts.

Our mission is to bridge the gap between traditional real estate and decentralized finance by creating a transparent, community-driven housing development platform.

This project focuses on building the first production-ready smart contract infrastructure that allows for milestone-based funding with community voting on each development stage. Funds are released only when the community approves progress, ensuring accountability and trust.

The goal of this phase is to deliver a secure, user-friendly platform connected to existing blockchain infrastructure, with full support for milestone voting, fund tracking, and automated refund eligibility.`,
    category: "Real Estate",
    contractAddress: "0xe416F78434D3B068E18bEd48D4a61EeA3526AF68",
    chainId: 97,
    ownerAddress: "0x1234567890123456789012345678901234567890",
    paymentToken: "0xaB1a4d4f1D656d2450692D237fdD6C7f9146e814", // BUSD
    fundingTarget: 500000,
    fundingDeadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(), // 25 days from now
    minContribution: 50,
    maxContribution: 10000,
    votingPeriodDays: 7,
    coverImageUrl: "https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?w=1200&q=80",
    galleryImageUrls: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80"
    ],
    websiteUrl: "https://apilax-monatic.com",
    twitterUrl: "https://twitter.com/apilaxmonatic",
    telegramUrl: "https://t.me/apilaxmonatic",
    discordUrl: "https://discord.gg/apilaxmonatic",
    cachedRaisedAmount: 30000,
    cachedTotalContributors: 150,
    lastSyncedBlock: BigInt(12345678),
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days ago
    updatedAt: new Date().toISOString(),
    milestones: [
      {
        id: 1,
        stage: 0,
        title: "Land Acquisition & Legal Setup",
        description: "Secure land rights, complete legal documentation, and establish the project entity. This includes surveying, environmental assessments, and zoning approvals.",
        deliverables: "Land deed, environmental clearance certificate, zoning approval documents, project registration certificate",
        proofDocuments: []
      },
      {
        id: 2,
        stage: 1,
        title: "Infrastructure Development",
        description: "Build core infrastructure including roads, utilities (water, electricity, sewage), and site preparation for construction.",
        deliverables: "Completed road network, utility connections, grading and leveling, construction site access",
        proofDocuments: []
      },
      {
        id: 3,
        stage: 2,
        title: "Building Construction Phase 1",
        description: "Construct the first set of residential units (Foundation to Roof). Includes structural work, electrical, and plumbing installations.",
        deliverables: "10 completed housing units, structural inspection reports, utility installation certificates",
        proofDocuments: []
      },
      {
        id: 4,
        stage: 3,
        title: "Finishing & Handover",
        description: "Complete interior finishing, landscaping, and final inspections. Prepare units for occupancy and handover to buyers.",
        deliverables: "Fully finished units, occupancy certificates, landscaping completion, buyer handover documentation",
        proofDocuments: []
      }
    ],
    recentContributions: [
      {
        contributor: "0x9876543210987654321098765432109876543210",
        transactionHash: "0xabc123def456...",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() // 2 hours ago
      },
      {
        contributor: "0x1111222233334444555566667777888899990000",
        transactionHash: "0x123abc456def...",
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString() // 5 hours ago
      },
      {
        contributor: "0xaaabbbcccdddeeefffaaabbbcccdddeeefffaa",
        transactionHash: "0xdef789ghi012...",
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString() // 8 hours ago
      },
      {
        contributor: "0x5555666677778888999900001111222233334444",
        transactionHash: "0x456def789abc...",
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString() // 12 hours ago
      },
      {
        contributor: "0xffffeeeeddddccccbbbbaaaa9999888877776666",
        transactionHash: "0x789abc123def...",
        timestamp: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString() // 18 hours ago
      }
    ]
  },

  // Project 2: Completed Funding, No Active Voting
  completed: {
    id: 2,
    projectId: 2,
    tagline: "DeFi Lending Protocol v2.0",
    logoUrl: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=200&h=200&fit=crop&q=80",
    currentMilestone: 1,    tags: ["DeFi", "Lending", "Finance", "Protocol"],    description: `A next-generation decentralized lending platform that revolutionizes how users borrow and lend crypto assets.

Successfully funded with 100% community support! We've reached our funding goal and are now in the development phase.

Our protocol features:
- Zero-knowledge proof verification for privacy
- Cross-chain lending capabilities
- Dynamic interest rates based on market conditions
- Insurance pool for lender protection

All milestones will be voted on by our community of contributors. Development is currently underway with regular updates.`,
    category: "DeFi",
    contractAddress: "0xe416F78434D3B068E18bEd48D4a61EeA3526AF68",
    chainId: 97,
    ownerAddress: "0x2345678901234567890123456789012345678901",
    paymentToken: "0x337610d27c682E347C9cD60BD4b3b107C9d34dDd", // USDT
    fundingTarget: 300000,
    fundingDeadline: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // Ended 5 days ago
    minContribution: 100,
    maxContribution: 50000,
    votingPeriodDays: 10,
    coverImageUrl: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1200&q=80",
    galleryImageUrls: [],
    websiteUrl: "https://defilending.io",
    twitterUrl: "https://twitter.com/defilending",
    telegramUrl: "https://t.me/defilending",
    discordUrl: null,
    cachedRaisedAmount: 300000,
    cachedTotalContributors: 320,
    lastSyncedBlock: BigInt(12345678),
    createdAt: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    milestones: [
      {
        id: 5,
        stage: 0,
        title: "Smart Contract Development",
        description: "Develop and audit core lending protocol smart contracts with multiple security audits.",
        deliverables: "Audited smart contracts, security reports, testnet deployment",
        proofDocuments: []
      },
      {
        id: 6,
        stage: 1,
        title: "Frontend & Backend Integration",
        description: "Build user interface and backend infrastructure for seamless user experience.",
        deliverables: "Web application, mobile app, API documentation",
        proofDocuments: []
      },
      {
        id: 7,
        stage: 2,
        title: "Mainnet Launch & Marketing",
        description: "Deploy to mainnet and execute marketing campaign to onboard users.",
        deliverables: "Mainnet deployment, marketing materials, user onboarding",
        proofDocuments: []
      }
    ],
    recentContributions: []
  },

  // Project 3: Has Past Voting History
  withVotingHistory: {
    id: 3,
    projectId: 3,
    tagline: "NFT Marketplace - Zero Gas Fees",
    logoUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&h=200&fit=crop&q=80",
    currentMilestone: 2,
    tags: ["NFT", "Marketplace", "Web3", "Digital Art"],
    description: `The next-generation NFT marketplace with zero gas fees and cross-chain compatibility.

We've successfully completed our first two milestones with overwhelming community support! Currently in milestone 3 development phase.

Previous milestones:
✓ Milestone 1: Smart contract development - Passed (95% YES votes)
✓ Milestone 2: Beta platform launch - Passed (88% YES votes)

Our platform offers:
- Zero gas fees for minting and trading
- Cross-chain NFT transfers
- Creator royalty automation
- Built-in rarity analytics

Join our growing community of 890 supporters as we build the future of NFT trading!`,
    category: "NFT",
    contractAddress: "0xe416F78434D3B068E18bEd48D4a61EeA3526AF68",
    chainId: 97,
    ownerAddress: "0x3456789012345678901234567890123456789012",
    paymentToken: "0x64544969ed7EBf5f083679233325356EbE738930", // USDC
    fundingTarget: 600000,
    fundingDeadline: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    minContribution: 25,
    maxContribution: 25000,
    votingPeriodDays: 7,
    coverImageUrl: "https://images.unsplash.com/photo-1634193295627-1cdddf751ebf?w=1200&q=80",
    galleryImageUrls: [
      "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=800&q=80",
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80"
    ],
    websiteUrl: "https://nftmarketplace.io",
    twitterUrl: "https://twitter.com/nftmarketplace",
    telegramUrl: null,
    discordUrl: "https://discord.gg/nftmarketplace",
    cachedRaisedAmount: 600000,
    cachedTotalContributors: 890,
    lastSyncedBlock: BigInt(12345678),
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    milestones: [
      {
        id: 8,
        stage: 0,
        title: "Smart Contract Development",
        description: "Core marketplace contracts with gas optimization and security audits.",
        deliverables: "Audited contracts, gas optimization reports, testnet deployment",
        proofDocuments: ["https://example.com/audit1.pdf", "https://example.com/report1.pdf"]
      },
      {
        id: 9,
        stage: 1,
        title: "Beta Platform Launch",
        description: "Launch beta version with limited features for community testing.",
        deliverables: "Beta platform, user testing reports, bug fixes",
        proofDocuments: ["https://example.com/beta-demo.mp4", "https://example.com/testing-results.pdf"]
      },
      {
        id: 10,
        stage: 2,
        title: "Cross-Chain Integration",
        description: "Enable cross-chain NFT transfers and trading across multiple networks.",
        deliverables: "Cross-chain bridge, multi-network support, integration tests",
        proofDocuments: []
      },
      {
        id: 11,
        stage: 3,
        title: "Full Launch & Marketing",
        description: "Official mainnet launch with comprehensive marketing campaign.",
        deliverables: "Mainnet deployment, marketing campaign, partnership announcements",
        proofDocuments: []
      }
    ],
    recentContributions: [],
    votingHistory: [
      {
        stage: 0,
        result: "passed",
        yesVotes: 850,
        noVotes: 40,
        totalVoters: 890,
        votingEnded: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        stage: 1,
        result: "passed",
        yesVotes: 783,
        noVotes: 107,
        totalVoters: 890,
        votingEnded: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString()
      }
    ]
  },

  // Project 4: Failed 3 Times - Refund Available
  failedRefund: {
    id: 4,
    projectId: 4,
    tagline: "Metaverse Gaming Platform",
    logoUrl: "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=200&h=200&fit=crop&q=80",
    currentMilestone: 2,
    tags: ["Gaming", "Metaverse", "VR", "Blockchain"],
    description: `An ambitious metaverse gaming platform that was unable to meet community expectations.

⚠️ REFUNDS NOW AVAILABLE ⚠️

After three consecutive milestone voting failures, this project has been automatically flagged for refunds according to our smart contract governance rules.

Voting History:
✗ Milestone 1: Platform Architecture - Failed (35% YES, 65% NO)
✗ Milestone 2: Game Engine Integration - Failed (28% YES, 72% NO)
✗ Milestone 3: Beta Testing - Failed (22% YES, 78% NO)

The community has determined that the project did not meet the expected deliverables. All contributors can now claim their full refund directly from the smart contract.

To claim your refund:
1. Connect your wallet
2. Click "Claim Refund" button
3. Confirm the transaction
4. Funds will be returned to your wallet

We appreciate all contributors who supported this project. Thank you for your participation in our decentralized governance process.`,
    category: "Gaming",
    contractAddress: "0xe416F78434D3B068E18bEd48D4a61EeA3526AF68",
    chainId: 97,
    ownerAddress: "0x4567890123456789012345678901234567890123",
    paymentToken: "0xaB1a4d4f1D656d2450692D237fdD6C7f9146e814", // BUSD
    fundingTarget: 800000,
    fundingDeadline: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    minContribution: 50,
    maxContribution: 20000,
    votingPeriodDays: 7,
    coverImageUrl: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=1200&q=80",
    galleryImageUrls: [],
    websiteUrl: null,
    twitterUrl: null,
    telegramUrl: null,
    discordUrl: null,
    cachedRaisedAmount: 800000,
    cachedTotalContributors: 1250,
    lastSyncedBlock: BigInt(12345678),
    createdAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    status: "refundable",
    failedVotingCount: 3,
    milestones: [
      {
        id: 12,
        stage: 0,
        title: "Platform Architecture",
        description: "Design and implement core metaverse architecture and infrastructure.",
        deliverables: "Architecture documentation, core infrastructure, scalability tests",
        proofDocuments: ["https://example.com/incomplete-docs.pdf"]
      },
      {
        id: 13,
        stage: 1,
        title: "Game Engine Integration",
        description: "Integrate leading game engine and create development tools.",
        deliverables: "Game engine integration, developer SDK, sample games",
        proofDocuments: ["https://example.com/partial-integration.pdf"]
      },
      {
        id: 14,
        stage: 2,
        title: "Beta Testing",
        description: "Launch beta version for community testing and feedback.",
        deliverables: "Beta platform, testing results, performance metrics",
        proofDocuments: []
      }
    ],
    recentContributions: [],
    votingHistory: [
      {
        stage: 0,
        result: "failed",
        yesVotes: 438,
        noVotes: 812,
        totalVoters: 1250,
        votingEnded: new Date(Date.now() - 80 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        stage: 1,
        result: "failed",
        yesVotes: 350,
        noVotes: 900,
        totalVoters: 1250,
        votingEnded: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        stage: 2,
        result: "failed",
        yesVotes: 275,
        noVotes: 975,
        totalVoters: 1250,
        votingEnded: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString()
      }
    ]
  }
}

// Helper to get mock project by scenario
export function getMockProject(scenario: 'funding' | 'completed' | 'withVotingHistory' | 'failedRefund') {
  return mockProjectDetail[scenario]
}
