import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { 
      prompt, 
      apiKey, 
      model, 
      customModelName, 
      aspectRatio,
      imageProvider,
      falApiKey,
      falModel 
    } = await request.json();

    const provider = imageProvider || 'google';

    if (provider === 'fal') {
      if (!falApiKey) {
        return NextResponse.json({ error: 'Fal.ai API key missing' }, { status: 400 });
      }

      // Map aspect ratio
      const imageSize = aspectRatio === '9:16' ? 'portrait_9_16' : 'landscape_16_9';

      const res = await fetch(`https://fal.run/${falModel || 'fal-ai/flux/dev'}`, {
        method: 'POST',
        headers: {
          'Authorization': `Key ${falApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          image_size: imageSize,
        }),
      });

      if (!res.ok) {
        const err = await res.text();
        return NextResponse.json({ error: `Fal.ai API Error: ${err}` }, { status: res.status });
      }

      const data = await res.json();
      const imageUrl = data.images?.[0]?.url;

      if (!imageUrl) {
        return NextResponse.json({ error: 'No image URL returned from Fal.ai' }, { status: 500 });
      }

      // Fetch the image and convert to Base64
      const imageRes = await fetch(imageUrl);
      const buffer = await imageRes.arrayBuffer();
      const base64 = Buffer.from(buffer).toString('base64');
      const contentType = imageRes.headers.get('content-type') || 'image/jpeg';

      return NextResponse.json({ imageUrl: `data:${contentType};base64,${base64}` });
    }

    // --- Google Logic ---
    if (!apiKey) {
      return NextResponse.json({ error: 'API key missing' }, { status: 400 });
    }

    const finalModelName = model === 'custom' ? customModelName : (model || 'imagen-3.0-generate-002');
    if (!finalModelName) {
        return NextResponse.json({ error: 'Model name missing' }, { status: 400 });
    }

    const isGemini = finalModelName.startsWith('gemini');
    const endpoint = isGemini 
      ? `https://generativelanguage.googleapis.com/v1beta/models/${finalModelName}:generateContent?key=${apiKey}`
      : `https://generativelanguage.googleapis.com/v1beta/models/${finalModelName}:predict?key=${apiKey}`;

    let requestBody;
    if (isGemini) {
      requestBody = {
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { responseModalities: ["IMAGE"] }
      };
    } else {
      requestBody = {
        instances: [{ prompt }],
        parameters: { sampleCount: 1, aspectRatio: aspectRatio || "16:9" }
      };
    }

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });

    if (!res.ok) {
      const err = await res.text();
      return NextResponse.json({ error: `Image generation failed: ${err}` }, { status: res.status });
    }

    const data = await res.json();
    let base64;
    let mimeType = 'image/jpeg';
    
    if (isGemini) {
      const inlineData = data.candidates?.[0]?.content?.parts?.[0]?.inlineData;
      base64 = inlineData?.data;
      if (inlineData?.mimeType) mimeType = inlineData.mimeType;
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
