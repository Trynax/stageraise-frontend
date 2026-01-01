import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    

    
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const status = searchParams.get('status')
    const milestoneBased = searchParams.get('milestoneBased')
    const chainId = searchParams.get('chainId')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    const projects = await prisma.project.findMany({
      where: {
        ...(category && { category: { has: category } }),
        ...(status && { cachedIsActive: status === 'active' }),
        ...(milestoneBased && { 
          milestones: { some: {} } 
        }),
        ...(chainId && { chainId: parseInt(chainId) }),
        ...(search && {
          OR: [
            { tagline: { contains: search, mode: 'insensitive' } },
            { detailedDescription: { contains: search, mode: 'insensitive' } }
          ]
        })
      },
      include: {
        milestones: {
          orderBy: { stage: 'asc' }
        },
        _count: {
          select: {
            contributions: true,
            votes: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset
    })


    const total = await prisma.project.count({
      where: {
        ...(category && { category: { has: category } }),
        ...(status && { cachedIsActive: status === 'active' }),
        ...(chainId && { chainId: parseInt(chainId) })
      }
    })

    return NextResponse.json({
      success: true,
      projects,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    })
  } catch (error) {
    console.error('Get projects error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    )
  }
}


export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.projectId || !body.contractAddress || !body.chainId || !body.ownerAddress) {
      return NextResponse.json(
        { error: 'Missing required fields: projectId, contractAddress, chainId, ownerAddress' },
        { status: 400 }
      )
    }


    const existing = await prisma.project.findUnique({
      where: { projectId: body.projectId }
    })

    if (existing) {
      return NextResponse.json(
        { error: 'Project already exists' },
        { status: 409 }
      )
    }


    const project = await prisma.project.create({
      data: {
        projectId: body.projectId,
        contractAddress: body.contractAddress,
        chainId: body.chainId,
        ownerAddress: body.ownerAddress,

        tagline: body.tagline || '',
        category: body.category || [],
        detailedDescription: body.detailedDescription || '',

        coverImageCID: body.coverImageCID,
        coverImageUrl: body.coverImageUrl,
        logoUrl: body.logoUrl,
        additionalImages: body.additionalImages || [],
        

        website: body.website,
        twitter: body.twitter,
        discord: body.discord,
        telegram: body.telegram,
        
  
        cachedRaisedAmount: '0',
        cachedTotalContributors: 0,
        cachedIsActive: true,

        ...(body.milestones && body.milestones.length > 0 && {
          milestones: {
            create: body.milestones.map((m: any, idx: number) => ({
              stage: idx + 1,
              title: m.title,
              description: m.description,
              deliverables: m.deliverables || []
            }))
          }
        })
      },
      include: {
        milestones: true
      }
    })

    return NextResponse.json({
      success: true,
      project
    })
  } catch (error) {
    console.error('Create project error:', error)
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    )
  }
}
