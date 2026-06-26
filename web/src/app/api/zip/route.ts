import { NextRequest, NextResponse } from 'next/server';
import { zipSync, strToU8 } from 'fflate';

export async function POST(request: NextRequest) {
  try {
    const { files } = await request.json();

    if (!files || !Array.isArray(files)) {
      return NextResponse.json({ error: 'Files array is required' }, { status: 400 });
    }

    // Build the fflate input map: { 'filename': Uint8Array }
    const zipInput: Record<string, Uint8Array> = {};
    for (const file of files as { name: string; content: string }[]) {
      if (file.name && file.content !== undefined) {
        zipInput[file.name] = strToU8(file.content);
      }
    }

    const zipped = zipSync(zipInput, { level: 6 });

    return new NextResponse(zipped, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': 'attachment; filename="bloomy-files.zip"',
      },
    });

  } catch (error: any) {
    console.error('Zip generation error:', error);
    return NextResponse.json({ error: 'Failed to generate zip' }, { status: 500 });
  }
}
