import { NextRequest, NextResponse } from 'next/server';
import JSZip from 'jszip';

export async function POST(request: NextRequest) {
  try {
    const { files } = await request.json();

    if (!files || !Array.isArray(files)) {
      return NextResponse.json({ error: 'Files array is required' }, { status: 400 });
    }

    const zip = new JSZip();

    files.forEach((file: { name: string; content: string }) => {
      if (file.name && file.content) {
        zip.file(file.name, file.content);
      }
    });

    const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });

    return new NextResponse(zipBuffer as any, {
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
