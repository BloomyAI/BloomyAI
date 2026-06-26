import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY || 'dummy_key_for_build',
  baseURL: 'https://openrouter.ai/api/v1',
  defaultHeaders: {
    'HTTP-Referer': 'https://bloomy.ai',
    'X-Title': 'Bloomy AI',
  },
});

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const giphyResponse = await fetch(`https://api.giphy.com/v1/gifs/search?api_key=dc6zaTOxFJmzC&q=${encodeURIComponent(prompt)}&limit=1`);
    const giphyData = await giphyResponse.json();
    
    let videoUrl = null;
    if (giphyData.data && giphyData.data.length > 0) {
      videoUrl = giphyData.data[0].images.original.mp4;
    }

    if (!videoUrl) {
      // Fallback
      videoUrl = "https://www.w3schools.com/html/mov_bbb.mp4";
    }

    return NextResponse.json({ 
      success: true, 
      video: videoUrl,
      description: prompt,
    });

  } catch (error: any) {
    console.error('Video generation error:', error);
    return NextResponse.json({ 
      error: error.message || 'Failed to generate video' 
    }, { status: 500 });
  }
}
