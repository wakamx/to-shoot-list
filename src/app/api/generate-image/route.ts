import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { prompt, apiKey, model, customModelName, aspectRatio } = await request.json();

    if (!apiKey) {
      return NextResponse.json({ error: 'API key missing' }, { status: 400 });
    }

    const finalModelName = model === 'custom' ? customModelName : (model || 'imagen-3.0-generate-002');
    if (!finalModelName) {
        return NextResponse.json({ error: 'Model name missing' }, { status: 400 });
    }

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${finalModelName}:predict?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          instances: [
            { prompt }
          ],
          parameters: {
            sampleCount: 1,
            aspectRatio: aspectRatio || "16:9",
          }
        }),
      }
    );

    if (!res.ok) {
      const err = await res.text();
      console.error('Image generation error response:', err);
      return NextResponse.json({ error: `Image generation failed: ${err}` }, { status: res.status });
    }

    const data = await res.json();
    const base64 = data.predictions?.[0]?.bytesBase64Encoded;

    if (!base64) {
      return NextResponse.json({ error: 'No image generated' }, { status: 500 });
    }

    return NextResponse.json({ imageUrl: `data:image/jpeg;base64,${base64}` });

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
