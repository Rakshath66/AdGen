import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import os from 'os';

// Ensure the videos directory exists
const videosDir = path.join(process.cwd(), 'public/videos');
if (!fs.existsSync(videosDir)) {
  fs.mkdirSync(videosDir, { recursive: true });
}

export async function POST(request: Request) {
  try {
    const { script } = await request.json();

    if (!script) {
      return NextResponse.json(
        { error: 'Script is required' },
        { status: 400 }
      );
    }

    // Generate a unique filename
    const outputFilename = `ad-${Date.now()}.mp4`;
    const outputPath = path.join(videosDir, outputFilename);

    // Instead of rendering on the server, we'll return a temporary URL
    // that the client can use to render and save the video
    const videoUrl = `/videos/${outputFilename}`;
    
    return NextResponse.json({ 
      videoUrl,
      script,
      renderConfig: {
        fps: 30,
        durationInFrames: 450, // 15 seconds
        width: 1920,
        height: 1080,
      }
    });
  } catch (error) {
    console.error('Video generation error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate video' },
      { status: 500 }
    );
  }
} 