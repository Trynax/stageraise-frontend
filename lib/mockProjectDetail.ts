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
    paymentToken: "0xeD24FC36d5Ee211Ea25A80239Fb8C4Cfd80f12Ee", // BUSD
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
        stage: 1,
        title: "Apilax - monatic",
        description: "StageRaise is a decentralized crowdfunding platform that enables creators to raise funds transparently through milestone-based releases and community voting.\n\nThis project focuses on building the first production-ready web application that allows creators to launch projects, funders to vote on milestones, and funds to be released or refunded based on on-chain governance.",
        deliverables: ["Smart contract deployment", "Web application", "Documentation"],
        proofDocuments: [
          { cid: "QmTest1", url: "https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?w=400&q=80", filename: "preview1.jpg" },
          { cid: "QmTest2", url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&q=80", filename: "preview2.jpg" },
          { cid: "QmTest3", url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&q=80", filename: "preview3.jpg" },
          { cid: "QmTest4", url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&q=80", filename: "preview4.jpg" },
          { cid: "QmTest5", url: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=400&q=80", filename: "preview5.jpg" },
          { cid: "QmTest6", url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&q=80", filename: "preview6.jpg" }
        ]
      },
      {
        id: 2,
        stage: 2,
        title: "Apilax - monatic",
        description: "StageRaise is a decentralized crowdfunding platform that enables creators to raise funds transparently through milestone-based releases and community voting.\n\nThis project focuses on building the first production-ready web application that allows creators to launch projects, funders to vote on milestones, and funds to be released or refunded based on on-chain governance.",
        deliverables: ["Backend API", "Database setup", "User authentication"],
        proofDocuments: [
          { cid: "QmTest7", url: "https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?w=400&q=80", filename: "preview1.jpg" },
          { cid: "QmTest8", url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&q=80", filename: "preview2.jpg" },
          { cid: "QmTest9", url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&q=80", filename: "preview3.jpg" },
          { cid: "QmTest10", url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&q=80", filename: "preview4.jpg" }
        ]
      },
      {
        id: 3,
        stage: 3,
        title: "Apilax - monatic",
        description: "StageRaise is a decentralized crowdfunding platform that enables creators to raise funds transparently through milestone-based releases and community voting.\n\nThis project focuses on building the first production-ready web application that allows creators to launch projects, funders to vote on milestones, and funds to be released or refunded based on on-chain governance.",
        deliverables: ["Testing and QA", "Security audit", "Performance optimization"],
        proofDocuments: [
          { cid: "QmTest11", url: "https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?w=400&q=80", filename: "preview1.jpg" },
          { cid: "QmTest12", url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&q=80", filename: "preview2.jpg" },
          { cid: "QmTest13", url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&q=80", filename: "preview3.jpg" }
        ]
      },
      {
        id: 4,
        stage: 4,
        title: "Apilax - monatic",
        description: "StageRaise is a decentralized crowdfunding platform that enables creators to raise funds transparently through milestone-based releases and community voting.\n\nThis project focuses on building the first production-ready web application that allows creators to launch projects, funders to vote on milestones, and funds to be released or refunded based on on-chain governance.",
        deliverables: ["Production deployment", "User onboarding", "Marketing launch"],
        proofDocuments: [
          { cid: "QmTest14", url: "https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?w=400&q=80", filename: "preview1.jpg" },
          { cid: "QmTest15", url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&q=80", filename: "preview2.jpg" },
          { cid: "QmTest16", url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&q=80", filename: "preview3.jpg" },
          { cid: "QmTest17", url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&q=80", filename: "preview4.jpg" },
          { cid: "QmTest18", url: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=400&q=80", filename: "preview5.jpg" }
        ]
      }
    ],
    recentContributions: [
      {
        contributor: "0x9876543210987654321098765432109876543210",
        amount: 500,
        transactionHash: "0xabc123def456789abc123def456789abc123def456789abc123def456789abc12",
        timestamp: new Date(Date.now() - 50 * 60 * 1000).toISOString() // 50 min ago
      },
      {
        contributor: "0x1111222233334444555566667777888899990000",
        amount: 50,
        transactionHash: "0x123abc456def789123abc456def789123abc456def789123abc456def789123a",
        timestamp: new Date(Date.now() - 50 * 60 * 1000).toISOString() // 50 min ago
      },
      {
        contributor: "0xaaabbbcccdddeeefffaaabbbcccdddeeefffaa",
        amount: 150,
        transactionHash: "0xdef789ghi012345def789ghi012345def789ghi012345def789ghi012345def7",
        timestamp: new Date(Date.now() - 50 * 60 * 1000).toISOString() // 50 min ago
      },
      {
        contributor: "0x5555666677778888999900001111222233334444",
        amount: 75,
        transactionHash: "0x456def789abc123456def789abc123456def789abc123456def789abc123456d",
        timestamp: new Date(Date.now() - 50 * 60 * 1000).toISOString() // 50 min ago
      },
      {
        contributor: "0xffffeeeeddddccccbbbbaaaa9999888877776666",
        amount: 200,
        transactionHash: "0x789abc123def456789abc123def456789abc123def456789abc123def456789a",
        timestamp: new Date(Date.now() - 50 * 60 * 1000).toISOString() // 50 min ago
      },
      {
        contributor: "0x2222333344445555666677778888999900001111",
        amount: 100,
        transactionHash: "0x321fed654cba987321fed654cba987321fed654cba987321fed654cba9873",
        timestamp: new Date(Date.now() - 50 * 60 * 1000).toISOString() // 50 min ago
      },
      {
        contributor: "0xbbbcccdddeeefff000111222333444555666777",
        amount: 250,
        transactionHash: "0xaaa111bbb222ccc333ddd444eee555fff666aaa111bbb222ccc333ddd444ee",
        timestamp: new Date(Date.now() - 50 * 60 * 1000).toISOString() // 50 min ago
      },
      {
        contributor: "0x7777888899990000111122223333444455556666",
        amount: 300,
        transactionHash: "0x999888777666555444333222111000999888777666555444333222111000999",
        timestamp: new Date(Date.now() - 50 * 60 * 1000).toISOString() // 50 min ago
      },
      {
        contributor: "0x3333444455556666777788889999000011112222",
        amount: 125,
        transactionHash: "0x111222333444555666777888999000111222333444555666777888999000111",
        timestamp: new Date(Date.now() - 50 * 60 * 1000).toISOString() // 50 min ago
      },
      {
        contributor: "0x8888999900001111222233334444555566667777",
        amount: 450,
        transactionHash: "0x555666777888999000111222333444555666777888999000111222333444555",
        timestamp: new Date(Date.now() - 50 * 60 * 1000).toISOString() // 50 min ago
      }
    ]
  },

  // Project 2: Completed Funding, No Active Voting
  completed: {
    id: 2,
    projectId: 2,
    tagline: "DeFi Lending Protocol v2.0",
    logoUrl: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=200&h=200&fit=crop&q=80",
    currentMilestone: 1,
    userContribution: 30000,
    userContributionPercent: 10,
    tags: ["DeFi", "Lending", "Finance", "Protocol"],    description: `A next-generation decentralized lending platform that revolutionizes how users borrow and lend crypto assets.

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
        stage: 1,
        title: "Smart Contract Development",
        description: "Develop and audit core lending protocol smart contracts with multiple security audits.",
        deliverables: "Audited smart contracts, security reports, testnet deployment",
        proofDocuments: []
      },
      {
        id: 6,
        stage: 2,
        title: "Frontend & Backend Integration",
        description: "Build user interface and backend infrastructure for seamless user experience.",
        deliverables: "Web application, mobile app, API documentation",
        proofDocuments: []
      },
      {
        id: 7,
        stage: 3,
        title: "Mainnet Launch & Marketing",
        description: "Deploy to mainnet and execute marketing campaign to onboard users.",
        deliverables: "Mainnet deployment, marketing materials, user onboarding",
        proofDocuments: []
      }
    ],
    recentContributions: [
      {
        contributor: "0x1234567890123456789012345678901234567890",
        amount: 1000,
        transactionHash: "0xabc123def456789abc123def456789abc123def456789abc123def456789abc12",
        timestamp: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        contributor: "0x2345678901234567890123456789012345678901",
        amount: 500,
        transactionHash: "0x123abc456def789123abc456def789123abc456def789123abc456def789123a",
        timestamp: new Date(Date.now() - 29 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        contributor: "0x3456789012345678901234567890123456789012",
        amount: 2000,
        transactionHash: "0xdef789ghi012345def789ghi012345def789ghi012345def789ghi012345def7",
        timestamp: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        contributor: "0x4567890123456789012345678901234567890123",
        amount: 750,
        transactionHash: "0x456def789abc123456def789abc123456def789abc123456def789abc123456d",
        timestamp: new Date(Date.now() - 27 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        contributor: "0x5678901234567890123456789012345678901234",
        amount: 1500,
        transactionHash: "0x789abc123def456789abc123def456789abc123def456789abc123def456789a",
        timestamp: new Date(Date.now() - 26 * 24 * 60 * 60 * 1000).toISOString()
      }
    ]
  },

  // Project 3: Has Past Voting History
  withVotingHistory: {
    id: 3,
    projectId: 3,
    tagline: "NFT Marketplace - Zero Gas Fees",
    logoUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&h=200&fit=crop&q=80",
    currentMilestone: 2,
    userContribution: 48000,
    userContributionPercent: 8,
    activeVoting: {
      stage: 3,
      title: "Cross-Chain Integration",
      yesVotes: 450,
      noVotes: 120,
      votingEndTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 24 * 60 * 60 * 1000 + 30 * 60 * 1000 + 23 * 1000).toISOString(), // 3d 24h 30m 23s from now
      userVote: null
    },
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
        stage: 1,
        title: "Smart Contract Development",
        description: "Core marketplace contracts with gas optimization and security audits.",
        deliverables: "Audited contracts, gas optimization reports, testnet deployment",
        proofDocuments: ["https://example.com/audit1.pdf", "https://example.com/report1.pdf"]
      },
      {
        id: 9,
        stage: 2,
        title: "Beta Platform Launch",
        description: "Launch beta version with limited features for community testing.",
        deliverables: "Beta platform, user testing reports, bug fixes",
        proofDocuments: ["https://example.com/beta-demo.mp4", "https://example.com/testing-results.pdf"]
      },
      {
        id: 10,
        stage: 3,
        title: "Cross-Chain Integration",
        description: "Enable cross-chain NFT transfers and trading across multiple networks.",
        deliverables: "Cross-chain bridge, multi-network support, integration tests",
        proofDocuments: []
      },
      {
        id: 11,
        stage: 4,
        title: "Full Launch & Marketing",
        description: "Official mainnet launch with comprehensive marketing campaign.",
        deliverables: "Mainnet deployment, marketing campaign, partnership announcements",
        proofDocuments: []
      }
    ],
    recentContributions: [
      {
        contributor: "0x9876543210987654321098765432109876543210",
        amount: 5000,
        transactionHash: "0xabc123def456789abc123def456789abc123def456789abc123def456789abc12",
        timestamp: new Date(Date.now() - 55 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        contributor: "0x8765432109876543210987654321098765432109",
        amount: 2500,
        transactionHash: "0x123abc456def789123abc456def789123abc456def789123abc456def789123a",
        timestamp: new Date(Date.now() - 54 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        contributor: "0x7654321098765432109876543210987654321098",
        amount: 10000,
        transactionHash: "0xdef789ghi012345def789ghi012345def789ghi012345def789ghi012345def7",
        timestamp: new Date(Date.now() - 53 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        contributor: "0x6543210987654321098765432109876543210987",
        amount: 1000,
        transactionHash: "0x456def789abc123456def789abc123456def789abc123456def789abc123456d",
        timestamp: new Date(Date.now() - 52 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        contributor: "0x5432109876543210987654321098765432109876",
        amount: 7500,
        transactionHash: "0x789abc123def456789abc123def456789abc123def456789abc123def456789a",
        timestamp: new Date(Date.now() - 51 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        contributor: "0x4321098765432109876543210987654321098765",
        amount: 3000,
        transactionHash: "0x321fed654cba987321fed654cba987321fed654cba987321fed654cba9873",
        timestamp: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        contributor: "0x3210987654321098765432109876543210987654",
        amount: 15000,
        transactionHash: "0xaaa111bbb222ccc333ddd444eee555fff666aaa111bbb222ccc333ddd444ee",
        timestamp: new Date(Date.now() - 49 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        contributor: "0x2109876543210987654321098765432109876543",
        amount: 8000,
        transactionHash: "0x999888777666555444333222111000999888777666555444333222111000999",
        timestamp: new Date(Date.now() - 48 * 24 * 60 * 60 * 1000).toISOString()
      }
    ],
    votingHistory: [
      {
        stage: 1,
        result: "passed",
        yesVotes: 850,
        noVotes: 40,
        totalVoters: 890,
        votingEnded: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        stage: 2,
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
    currentMilestone: 4,
    userContribution: 24000,
    userContributionPercent: 3,
    tags: ["Gaming", "Metaverse", "VR", "Blockchain"],
    description: `Building the next generation metaverse gaming platform powered by blockchain technology.

🎮 Project Overview:
We're creating an immersive metaverse gaming ecosystem where players can truly own their in-game assets, create custom experiences, and participate in a player-driven economy. Our platform combines cutting-edge VR technology with blockchain infrastructure to deliver unprecedented gaming experiences.

🎯 Key Features:
• Fully immersive VR environments with realistic physics
• True digital asset ownership via NFTs
• Cross-platform compatibility (VR, Desktop, Mobile)
• Player-created content marketplace
• Decentralized governance for platform decisions
• Play-to-earn mechanics with sustainable tokenomics

💡 What Makes Us Different:
Unlike traditional gaming platforms, we're building a truly decentralized ecosystem where players have real ownership and control. Our advanced game engine supports unlimited scalability, and our economic model ensures long-term sustainability for creators and players alike.

👥 Team:
Our team consists of veteran game developers from AAA studios, blockchain engineers, and VR specialists with decades of combined experience in gaming and emerging technologies.`,
    category: "Gaming",
    contractAddress: "0xe416F78434D3B068E18bEd48D4a61EeA3526AF68",
    chainId: 97,
    ownerAddress: "0x4567890123456789012345678901234567890123",
    paymentToken: "0xeD24FC36d5Ee211Ea25A80239Fb8C4Cfd80f12Ee", // BUSD
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
        stage: 1,
        title: "Platform Architecture",
        description: "Design and implement core metaverse architecture and infrastructure.",
        deliverables: "Architecture documentation, core infrastructure, scalability tests",
        proofDocuments: ["https://example.com/incomplete-docs.pdf"]
      },
      {
        id: 13,
        stage: 2,
        title: "Game Engine Integration",
        description: "Integrate leading game engine and create development tools.",
        deliverables: "Game engine integration, developer SDK, sample games",
        proofDocuments: ["https://example.com/partial-integration.pdf"]
      },
      {
        id: 14,
        stage: 3,
        title: "Beta Testing",
        description: "Launch beta version for community testing and feedback.",
        deliverables: "Beta platform, testing results, performance metrics",
        proofDocuments: []
      },
      {
        id: 15,
        stage: 4,
        title: "Marketplace Launch",
        description: "Launch the NFT marketplace and player trading system.",
        deliverables: "Live marketplace, trading interface, smart contracts",
        proofDocuments: []
      },
      {
        id: 16,
        stage: 5,
        title: "Full Platform Release",
        description: "Complete platform launch with all features and marketing push.",
        deliverables: "Production platform, marketing campaign, community events",
        proofDocuments: []
      }
    ],
    recentContributions: [
      {
        contributor: "0xaabbccddeeaabbccddeeaabbccddeeaabbccddee",
        amount: 2500,
        transactionHash: "0xabc123def456789abc123def456789abc123def456789abc123def456789abc12",
        timestamp: new Date(Date.now() - 100 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        contributor: "0xbbccddeeaabbccddeeaabbccddeeaabbccddeeaa",
        amount: 5000,
        transactionHash: "0x123abc456def789123abc456def789123abc456def789123abc456def789123a",
        timestamp: new Date(Date.now() - 99 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        contributor: "0xccddeeaabbccddeeaabbccddeeaabbccddeeaabb",
        amount: 10000,
        transactionHash: "0xdef789ghi012345def789ghi012345def789ghi012345def789ghi012345def7",
        timestamp: new Date(Date.now() - 98 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        contributor: "0xddeeaabbccddeeaabbccddeeaabbccddeeaabbcc",
        amount: 1500,
        transactionHash: "0x456def789abc123456def789abc123456def789abc123456def789abc123456d",
        timestamp: new Date(Date.now() - 97 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        contributor: "0xeeaabbccddeeaabbccddeeaabbccddeeaabbccdd",
        amount: 7500,
        transactionHash: "0x789abc123def456789abc123def456789abc123def456789abc123def456789a",
        timestamp: new Date(Date.now() - 96 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        contributor: "0xaabbccddeeffaabbccddeeffaabbccddeeffaabb",
        amount: 3000,
        transactionHash: "0x321fed654cba987321fed654cba987321fed654cba987321fed654cba9873",
        timestamp: new Date(Date.now() - 95 * 24 * 60 * 60 * 1000).toISOString()
      }
    ],
    votingHistory: [
      {
        stage: 1,
        result: "passed",
        yesVotes: 892,
        noVotes: 358,
        totalVoters: 1250,
        votingEnded: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        stage: 2,
        result: "failed",
        yesVotes: 438,
        noVotes: 812,
        totalVoters: 1250,
        votingEnded: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        stage: 3,
        result: "failed",
        yesVotes: 350,
        noVotes: 900,
        totalVoters: 1250,
        votingEnded: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        stage: 4,
        result: "failed",
        yesVotes: 275,
        noVotes: 975,
        totalVoters: 1250,
        votingEnded: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
      }
    ]
  }
}

// Helper to get mock project by scenario
export function getMockProject(scenario: 'funding' | 'completed' | 'withVotingHistory' | 'failedRefund') {
  return mockProjectDetail[scenario]
}
