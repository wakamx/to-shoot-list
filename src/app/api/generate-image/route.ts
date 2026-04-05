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

    const isGemini = finalModelName.startsWith('gemini');
    
    // Choose endpoint based on model type
    const endpoint = isGemini 
      ? `https://generativelanguage.googleapis.com/v1beta/models/${finalModelName}:generateContent?key=${apiKey}`
      : `https://generativelanguage.googleapis.com/v1beta/models/${finalModelName}:predict?key=${apiKey}`;

    // Construct body based on model type
    let requestBody;
    if (isGemini) {
      requestBody = {
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }]
          }
        ],
        generationConfig: {
          responseModalities: ["IMAGE"]
        }
      };
    } else {
      requestBody = {
        instances: [{ prompt }],
        parameters: {
          sampleCount: 1,
          aspectRatio: aspectRatio || "16:9",
        }
      };
    }

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('Image generation error response:', err);
      return NextResponse.json({ error: `Image generation failed: ${err}` }, { status: res.status });
    }

    const data = await res.json();
    
    let base64;
    let mimeType = 'image/jpeg';
    
    if (isGemini) {
      const inlineData = data.candidates?.[0]?.content?.parts?.[0]?.inlineData;
      base64 = inlineData?.data;
      if (inlineData?.mimeType) {
        mimeType = inlineData.mimeType;
      }
    } else {
      base64 = data.predictions?.[0]?.bytesBase64Encoded;
    }

    if (!base64) {
      return NextResponse.json({ error: 'No image generated' }, { status: 500 });
    }

    return NextResponse.json({ imageUrl: `data:${mimeType};base64,${base64}` });

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
