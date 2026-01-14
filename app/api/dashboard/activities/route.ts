import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const address = searchParams.get('address')
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '10')
        const type = searchParams.get('type') 
        const sortOrder = searchParams.get('sort') === 'asc' ? 'asc' : 'desc'

        if (!address) {
            return NextResponse.json({ success: false, error: 'Address required' }, { status: 400 })
        }

        const normalizedAddress = address.toLowerCase()
        const skip = (page - 1) * limit

        const where: any = {
            userAddress: {
                equals: normalizedAddress,
                mode: 'insensitive'
            }
        }

        if (type) {
            where.type = type
        }

        const [activities, total] = await Promise.all([
            prisma.activity.findMany({
                where,
                orderBy: { createdAt: sortOrder },
                skip,
                take: limit,
                include: {
                    project: {
                        select: {
                            id: true,
                            name: true,
                            logoUrl: true,
                            projectId: true
                        }
                    }
                }
            }),
            prisma.activity.count({ where })
        ])

        const totalPages = Math.ceil(total / limit)

        return NextResponse.json({
            success: true,
            activities,
            pagination: {
                page,
                limit,
                total,
                totalPages,
                hasNext: page < totalPages,
                hasPrev: page > 1
            }
        })

    } catch (error) {
        console.error('Activities fetch error:', error)
        return NextResponse.json({ success: false, error: 'Failed to fetch activities' }, { status: 500 })
    }
}
