# StageRaise Frontend

StageRaise is a funding protocol focused on milestone accountability.  
Project creators raise funds under defined rules, and milestone-based projects require proof submission and contributor voting before additional funds are released.

## What StageRaise Solves

- Lack of capital protection when funds are released before delivery is verified.
- Limited contributor control after funds are committed.
- No clear recovery path when execution repeatedly fails.

## Core Flow

1. Creator launches a project with funding terms.
2. Contributors fund the project using supported tokens.
3. Creator submits milestone proof.
4. Contributors vote to approve or reject milestone completion.
5. Funds unlock by stage when milestones pass.
6. Refund eligibility opens after 3 failed milestone voting rounds.

## Current Capabilities

- Traditional and milestone-based project creation flows.
- Funding start and end scheduling.
- Stablecoin funding support (BUSD, USDT, USDC).
- Milestone vote setup and voting interfaces.
- Creator withdrawal UI with on-chain status handling.
- Refund state and voting history visibility.
- Dashboard tabs for activity, projects, voting, and contributions.
- Off-chain metadata and activity indexing with Prisma/PostgreSQL.

## Repositories

- Frontend: `https://github.com/Trynax/stageraise-frontend`
- Contract: `https://github.com/Trynax/Stage-raise`

## Network Support

- Current frontend chain support: BSC Testnet (`chainId 97`)
- StageRaise contract address is resolved from `NEXT_PUBLIC_STAGERAISE_CONTRACT_BSC_TESTNET`
- Fallback contract address in code: `0x5e624d31bC13b3cE5405e6406DC77Ec0D0743e1a`

## Tech Stack

- Next.js 16 (App Router), React 19, TypeScript
- Wagmi + Viem for wallet and contract interactions
- Prisma + PostgreSQL for metadata/indexing
- Cloudinary for media upload handling

## Project Structure

- `app/`: pages and API routes
- `components/`: UI and feature components
- `lib/contracts/`: ABI, addresses, hooks, contract utilities
- `lib/constants/`: shared constants (tokens, etc.)
- `prisma/`: schema and seed scripts
- `submission/`: challenge submission assets (deck/script/summary)

## Environment Variables

Create `.env.local` with the following values:

```env
DATABASE_URL=

NEXT_PUBLIC_REOWN_PROJECTID=
NEXT_PUBLIC_BSC_TESTNET_RPC=
NEXT_PUBLIC_STAGERAISE_CONTRACT_BSC_TESTNET=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

Notes:
- `NEXT_PUBLIC_BSC_TESTNET_RPC` is optional and defaults to a public BSC testnet RPC if not set.
- `NEXT_PUBLIC_STAGERAISE_CONTRACT_BSC_TESTNET` is optional; if not set, fallback address is used.

## Local Development

Prerequisites:
- Node.js 20+
- npm
- PostgreSQL

Install and run:

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Build and Run

```bash
npm run build
npm run start
```

Current build script runs:
- `prisma generate`
- `prisma db push`
- `next build`

## Database Utilities

```bash
npm run db:push
npm run db:seed
```
