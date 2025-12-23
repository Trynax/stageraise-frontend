import type { Project } from './types';

export const mockProjects: Project[] = [
  {
    id: '1',
    title: 'Apilax - monatic',
    description: 'Apilax-monatic is a crypto real-estate project who look into Building house for it\'s believers',
    image: 'https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?w=800&q=80',
    type: 'Milestone Based',
    raised: 30000,
    goal: 500000,
    milestones: 4,
    funders: 150,
    communityVote: true,
    refundable: true,
    startDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // Started 15 days ago
    endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 24 * 60 * 60 * 1000).toISOString(), // 3 days 24 hours from now
    status: 'ongoing',
  },
  {
    id: '2',
    title: 'DeFi Lending Protocol',
    description: 'A decentralized lending platform that allows users to borrow and lend crypto assets with competitive rates',
    image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&q=80',
    type: 'Milestone Based',
    raised: 125000,
    goal: 300000,
    milestones: 5,
    funders: 320,
    communityVote: true,
    refundable: true,
    startDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // Started 10 days ago
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
    status: 'ongoing',
  },
  {
    id: '3',
    title: 'NFT Marketplace',
    description: 'Next-generation NFT marketplace with zero gas fees and cross-chain compatibility',
    image: 'https://images.unsplash.com/photo-1634193295627-1cdddf751ebf?w=800&q=80',
    type: '',
    raised: 450000,
    goal: 600000,
    milestones: 6,
    funders: 890,
    communityVote: true,
    refundable: false,
    startDate: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(), // Started 25 days ago
    endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days from now
    status: 'ongoing',
  },
  {
    id: '4',
    title: 'Green Energy Initiative',
    description: 'Building solar-powered cryptocurrency mining farms using renewable energy sources',
    image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&q=80',
    type: 'Milestone Based',
    raised: 87000,
    goal: 250000,
    milestones: 4,
    funders: 245,
    communityVote: true,
    refundable: true,
    startDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(), // Started 8 days ago
    endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
    status: 'ongoing',
  },
  {
    id: '5',
    title: 'Web3 Gaming Platform',
    description: 'Play-to-earn gaming ecosystem with integrated NFT marketplace and DeFi features',
    image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&q=80',
    type: '',
    raised: 280000,
    goal: 400000,
    milestones: 7,
    funders: 567,
    communityVote: true,
    refundable: true,
    startDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // Started 5 days ago
    endDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days from now
    status: 'ongoing',
  },
  {
    id: '6',
    title: 'Decentralized Social Network',
    description: 'Privacy-focused social platform where users own their data and earn from their content',
    image: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=800&q=80',
    type: 'Milestone Based',
    raised: 180000,
    goal: 350000,
    milestones: 5,
    funders: 412,
    communityVote: true,
    refundable: true,
    startDate: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(), // Started 18 days ago
    endDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString(), // 12 days from now
    status: 'ongoing',
  },
  {
    id: '7',
    title: 'Smart Agriculture DAO',
    description: 'Tokenized farming project that brings transparency to agricultural supply chains',
    image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&q=80',
    type: '',
    raised: 500000,
    goal: 500000,
    milestones: 8,
    funders: 1250,
    communityVote: true,
    refundable: false,
    startDate: new Date(Date.now() - 32 * 24 * 60 * 60 * 1000).toISOString(), // Started 32 days ago
    endDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // Ended 2 days ago
    status: 'ended',
  },
  {
    id: '8',
    title: 'Metaverse Real Estate',
    description: 'Virtual land development and trading platform in the emerging metaverse ecosystem',
    image: 'https://images.unsplash.com/photo-1633174524827-db00a6b7bc74?w=800&q=80',
    type: 'Milestone Based',
    raised: 750000,
    goal: 800000,
    milestones: 6,
    funders: 1890,
    communityVote: true,
    refundable: true,
    startDate: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(), // Started 35 days ago
    endDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // Ended 5 days ago
    status: 'ended',
  },
  {
    id: '9',
    title: 'Blockchain Education Platform',
    description: 'Learn-to-earn platform teaching blockchain development and Web3 technologies',
    image: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800&q=80',
    type: '',
    raised: 200000,
    goal: 200000,
    milestones: 4,
    funders: 678,
    communityVote: true,
    refundable: false,
    startDate: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(), // Started 40 days ago
    endDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // Ended 10 days ago
    status: 'ended',
  },
];
