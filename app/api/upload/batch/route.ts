import { NextRequest, NextResponse } from 'next/server'
import { cloudinary } from '@/lib/cloudinary'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const files = formData.getAll('files') as File[]
    
    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No files provided' },
        { status: 400 }
      )
    }


    if (files.length > 10) {
      return NextResponse.json(
        { error: 'Maximum 10 files allowed' },
        { status: 400 }
      )
    }

    const uploads = await Promise.all(
      files.map(async (file) => {

        const validTypes = [
          'image/jpeg',
          'image/jpg',
          'image/png',
          'image/gif',
          'image/webp',
          'video/mp4',
          'video/webm',
          'video/quicktime'
        ]
        if (!validTypes.includes(file.type)) {
          throw new Error(`Invalid file type: ${file.name}`)
        }

        const isVideo = file.type.startsWith('video/')
        const maxSize = isVideo ? 50 * 1024 * 1024 : 10 * 1024 * 1024
        if (file.size > maxSize) {
          throw new Error(`File too large: ${file.name}`)
        }


        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)


        const result = await new Promise<any>((resolve, reject) => {
          cloudinary.uploader.upload_stream(
            {
              folder: 'stageraise/projects',
              resource_type: 'auto',
              transformation: [
                { quality: 'auto', fetch_format: 'auto' }
              ]
            },
            (error, result) => {
              if (error) reject(error)
              else resolve(result)
            }
          ).end(buffer)
        })
        
        return {
          publicId: result.public_id,
          url: result.secure_url,
          name: file.name,
          width: result.width,
          height: result.height,
          format: result.format,
          size: result.bytes,
          type: file.type,
          resourceType: result.resource_type
        }
      })
    )

    return NextResponse.json({
      success: true,
      uploads
    })
  } catch (error) {
    console.error('Batch upload error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to upload files' },
      { status: 500 }
    )
  }
}
