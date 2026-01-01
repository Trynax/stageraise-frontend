import { NextRequest, NextResponse } from 'next/server'
import { triggerSync } from '@/lib/indexer'


export async function POST(request: NextRequest) {
  try {
    const result = await triggerSync()
    
    return NextResponse.json({
      message: 'Sync completed',
      ...result
    })
  } catch (error) {
    console.error('Sync trigger error:', error)
    return NextResponse.json(
      { error: 'Failed to sync blockchain events' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  // TODO: Return indexer status
  return NextResponse.json({
    success: true,
    status: 'running',
    message: 'Indexer is operational'
  })
}
