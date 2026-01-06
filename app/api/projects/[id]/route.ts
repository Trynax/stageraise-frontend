import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'


export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const projectId = parseInt(params.id)
    
    if (isNaN(projectId)) {
      return NextResponse.json(
        { error: 'Invalid project ID' },
        { status: 400 }
      )
    }

    const project = await prisma.project.findUnique({
      where: { projectId },
      include: {
        milestones: {
          orderBy: { stage: 'asc' }
        },
        contributions: {
          orderBy: { createdAt: 'desc' },
          take: 10 
        },
        votes: {
          orderBy: { createdAt: 'desc' },
          take: 10 
        },
        updates: {
          orderBy: { createdAt: 'desc' }
        },
        _count: {
          select: {
            contributions: true,
            votes: true,
            updates: true
          }
        }
      }
    })

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      project
    })
  } catch (error) {
    console.error('Get project error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch project' },
      { status: 500 }
    )
  }
}


export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const projectId = parseInt(params.id)
    const body = await request.json()
    
    if (isNaN(projectId)) {
      return NextResponse.json(
        { error: 'Invalid project ID' },
        { status: 400 }
      )
    }

    const existing = await prisma.project.findUnique({
      where: { projectId }
    })

    if (!existing) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    // TODO: Add owner verification (check wallet signature)
    // For now, anyone can update (fix this with auth)

    // Update only allowed fields
    const project = await prisma.project.update({
      where: { projectId },
      data: {
        ...(body.name && { name: body.name }),
        ...(body.category && { category: body.category }),
        ...(body.tags && { tags: body.tags }),
        ...(body.description && { description: body.description }),
        ...(body.logoUrl && { logoUrl: body.logoUrl }),
        ...(body.galleryImageUrls && { galleryImageUrls: body.galleryImageUrls }),
        ...(body.websiteUrl && { websiteUrl: body.websiteUrl }),
        ...(body.twitterUrl && { twitterUrl: body.twitterUrl }),
        ...(body.discordUrl && { discordUrl: body.discordUrl }),
        ...(body.telegramUrl && { telegramUrl: body.telegramUrl }),
        updatedAt: new Date()
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
    console.error('Update project error:', error)
    return NextResponse.json(
      { error: 'Failed to update project' },
      { status: 500 }
    )
  }
}
