import { NextRequest, NextResponse } from 'next/server';

export const maxDuration = 300;

const VIDEO_MODEL = 'alibaba/wan-2.7';
const OPENROUTER_BASE = 'https://openrouter.ai/api/v1';

function openRouterHeaders() {
  return {
    Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
    'Content-Type': 'application/json',
    'HTTP-Referer': 'https://bloomy.ai',
    'X-Title': 'Bloomy AI Video Generator',
  };
}

async function pollVideoJob(
  pollingUrl: string,
  maxAttempts = 60,
  intervalMs = 5000
): Promise<string> {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const res = await fetch(pollingUrl, { headers: openRouterHeaders() });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Poll failed (${res.status}): ${text}`);
    }

    const data = await res.json();
    const status = data.status as string;

    if (status === 'completed') {
      const urls = data.unsigned_urls ?? data.urls ?? data.output?.urls;
      if (Array.isArray(urls) && urls.length > 0) return urls[0];
      if (typeof data.url === 'string') return data.url;
      if (typeof data.video_url === 'string') return data.video_url;
      throw new Error('Video completed but no URL was returned');
    }

    if (status === 'failed' || status === 'error') {
      const errMsg =
        data.error?.message ??
        data.error ??
        data.message ??
        'Video generation failed';
      throw new Error(typeof errMsg === 'string' ? errMsg : JSON.stringify(errMsg));
    }

    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }

  throw new Error('Video generation timed out. Please try again.');
}

export async function POST(request: NextRequest) {
  try {
    const { prompt, duration = 5 } = await request.json();

    if (!prompt?.trim()) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    if (!process.env.OPENROUTER_API_KEY) {
      return NextResponse.json(
        { error: 'OPENROUTER_API_KEY is not configured' },
        { status: 500 }
      );
    }

    const submitRes = await fetch(`${OPENROUTER_BASE}/videos`, {
      method: 'POST',
      headers: openRouterHeaders(),
      body: JSON.stringify({
        model: VIDEO_MODEL,
        prompt: prompt.trim(),
        duration: Math.min(Math.max(Number(duration) || 5, 2), 15),
        resolution: '720p',
      }),
    });

    if (!submitRes.ok) {
      const errText = await submitRes.text();
      console.error('OpenRouter video submit error:', errText);
      return NextResponse.json(
        { error: `Video API error: ${errText}` },
        { status: submitRes.status }
      );
    }

    const job = await submitRes.json();
    const pollingUrl =
      job.polling_url ??
      (job.id ? `${OPENROUTER_BASE}/videos/${job.id}` : null);

    if (!pollingUrl) {
      return NextResponse.json(
        { error: 'No polling URL returned from video API' },
        { status: 502 }
      );
    }

    const videoUrl = await pollVideoJob(pollingUrl);

    return NextResponse.json({
      success: true,
      video: videoUrl,
      description: prompt.trim(),
      model: VIDEO_MODEL,
    });
  } catch (error: unknown) {
    console.error('Video generation error:', error);
    const message = error instanceof Error ? error.message : 'Failed to generate video';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
