import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'


function serializeData(data: any) {
  return JSON.parse(JSON.stringify(data, (key, value) =>
    typeof value === 'bigint' ? Number(value) : value
  ))
}

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
        ...(category && { category: category }),
        ...(status && { status: status }),
        ...(milestoneBased && { 
          milestones: { some: {} } 
        }),
        ...(chainId && { chainId: parseInt(chainId) }),
        ...(search && {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } }
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
        ...(category && { category: category }),
        ...(status && { status: status }),
        ...(chainId && { chainId: parseInt(chainId) })
      }
    })

    return NextResponse.json({
      success: true,
      projects: serializeData(projects),
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

        name: body.name || '',
        category: body.category || '',
        tags: body.tags || [],
        description: body.description || '',

        coverImageUrl: body.coverImageUrl,
        logoUrl: body.logoUrl,
        galleryImageUrls: body.galleryImageUrls || [],
        
        websiteUrl: body.websiteUrl,
        twitterUrl: body.twitterUrl,
        discordUrl: body.discordUrl,
        telegramUrl: body.telegramUrl,
        
        fundingTarget: body.fundingTarget || 0,
        fundingDeadline: body.fundingDeadline ? new Date(body.fundingDeadline) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        minContribution: body.minContribution || 0,
        maxContribution: body.maxContribution || 0,
        votingPeriodDays: body.votingPeriodDays || 7,
        paymentToken: body.paymentToken || '0x0000000000000000000000000000000000000000',
  
        cachedRaisedAmount: 0,
        cachedTotalContributors: 0,
        status: 'active',

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


    await prisma.activity.create({
      data: {
        userAddress: body.ownerAddress.toLowerCase(),
        projectId: project.id,
        type: 'project_created',
        title: `You created "${project.name || 'Untitled Project'}"`,
        amount: body.fundingTarget || null,
        tokenSymbol: 'USDT',
        metadata: {
          projectId: project.projectId,
          category: project.category
        }
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
