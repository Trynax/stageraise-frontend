import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const address = searchParams.get('address')

        if (!address) {
            return NextResponse.json({ success: false, error: 'Address required' }, { status: 400 })
        }

        const normalizedAddress = address.toLowerCase()

        // Get projects created by this user
        const projectsCreated = await prisma.project.count({
            where: {
                ownerAddress: {
                    equals: normalizedAddress,
                    mode: 'insensitive'
                }
            }
        })

        // Get total funding received for user's projects
        const userProjects = await prisma.project.findMany({
            where: {
                ownerAddress: {
                    equals: normalizedAddress,
                    mode: 'insensitive'
                }
            },
            select: {
                cachedRaisedAmount: true
            }
        })
        const fundingReceived = userProjects.reduce((sum, p) => sum + (p.cachedRaisedAmount || 0), 0)

        // Get user's contributions
        const contributions = await prisma.contribution.findMany({
            where: {
                contributor: {
                    equals: normalizedAddress,
                    mode: 'insensitive'
                }
            },
            select: {
                amount: true,
                projectId: true
            }
        })
        
        const amountFunded = contributions.reduce((sum, c) => sum + (c.amount || 0), 0)
        
        // Count unique projects funded
        const uniqueProjectsFunded = new Set(contributions.map(c => c.projectId)).size

        return NextResponse.json({
            success: true,
            stats: {
                fundingReceived,
                amountFunded,
                projectsFunded: uniqueProjectsFunded,
                projectsCreated
            }
        })

    } catch (error) {
        console.error('Dashboard stats error:', error)
        return NextResponse.json({ success: false, error: 'Failed to fetch stats' }, { status: 500 })
    }
}
