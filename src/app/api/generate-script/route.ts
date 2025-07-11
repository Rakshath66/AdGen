import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { Product } from '@/types/product';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { product } = await request.json();

    if (!product) {
      return NextResponse.json(
        { error: 'Product data is required' },
        { status: 400 }
      );
    }

    // Validate product data
    if (!product.title || !product.description) {
      return NextResponse.json(
        { error: 'Product must have a title and description' },
        { status: 400 }
      );
    }

    // Create a prompt for the ad script
    const prompt = `Create a compelling 30-second video ad script for the following product:

Product: ${product.title}
Price: ${product.price || 'Not specified'}
Description: ${product.description}
Key Features:
${product.features.map((feature: string) => `- ${feature}`).join('\n')}

Format the script with clear VISUAL and VO (Voice Over) sections for each scene.
Each scene should be 5-10 seconds.
Use this format:

VISUAL: [Describe what appears on screen]
VO: [Voice over script]

[Next scene...]

Make it engaging, professional, and highlight the product's key benefits.`;

    // Generate script using GPT-4
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a professional advertising copywriter specializing in video ad scripts."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const script = completion.choices[0].message.content;

    if (!script) {
      throw new Error('Failed to generate script');
    }

    return NextResponse.json({ script });
  } catch (error) {
    console.error('Script generation error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate script' },
      { status: 500 }
    );
  }
} 