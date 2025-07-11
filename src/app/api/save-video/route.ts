import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const video = formData.get('video') as File;
    
    if (!video) {
      return NextResponse.json(
        { error: 'No video file provided' },
        { status: 400 }
      );
    }

    // Convert the file to buffer
    const bytes = await video.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create the file path
    const downloadsDir = path.join(process.cwd(), 'downloads');
    const filePath = path.join(downloadsDir, video.name);

    // Write the file
    await writeFile(filePath, buffer);

    return NextResponse.json({ 
      success: true,
      message: 'Video saved successfully',
      path: filePath
    });
  } catch (error) {
    console.error('Error saving video:', error);
    return NextResponse.json(
      { error: 'Failed to save video' },
      { status: 500 }
    );
  }
}