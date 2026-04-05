import { NextRequest, NextResponse } from 'next/server';
import { buildSystemPrompt, buildUserPrompt } from '@/lib/ai-client';
import type { InputFormData, AIModel, AIProvider } from '@/lib/types';
import { getProviderForModel } from '@/lib/constants';

interface GenerateBody {
  form: InputFormData;
  model: AIModel;
  apiKey: string;
  customModelName?: string;
  customProvider?: AIProvider;
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateBody = await request.json();
    const { form, model, apiKey, customModelName, customProvider } = body;

    if (!apiKey) {
      return NextResponse.json({ error: 'API key missing' }, { status: 400 });
    }

    const systemPrompt = buildSystemPrompt();
    const userPrompt = buildUserPrompt(form);
    
    // Determine provider and model
    const provider = getProviderForModel(model, customProvider);
    const finalModelName = model === 'custom' ? customModelName || '' : model;

    if (!finalModelName) {
        return NextResponse.json({ error: 'Model name missing for custom model' }, { status: 400 });
    }

    let resultText: string;

    if (provider === 'openai') {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: finalModelName,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          temperature: 0.8,
          max_tokens: 2000,
        }),
      });
      if (!res.ok) {
        const err = await res.text();
        return NextResponse.json({ error: `OpenAI error: ${err}` }, { status: res.status });
      }
      const data = await res.json();
      resultText = data.choices[0].message.content;
    } else if (provider === 'google') {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${finalModelName}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  { text: `${systemPrompt}\n\n---\n\n${userPrompt}` },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.8,
              maxOutputTokens: 2000,
            },
          }),
        }
      );
      if (!res.ok) {
        const err = await res.text();
        return NextResponse.json({ error: `Gemini error: ${err}` }, { status: res.status });
      }
      const data = await res.json();
      resultText = data.candidates[0].content.parts[0].text;
    } else {
      // Anthropic
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: finalModelName,
          max_tokens: 2000,
          system: systemPrompt,
          messages: [{ role: 'user', content: userPrompt }],
        }),
      });
      if (!res.ok) {
        const err = await res.text();
        return NextResponse.json(
          { error: `Anthropic error: ${err}` },
          { status: res.status }
        );
      }
      const data = await res.json();
      resultText = data.content[0].text;
    }

    // Clean and parse JSON
    let cleaned = resultText.trim();
    // Remove markdown code blocks if present
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '');
    cleaned = cleaned.trim();

    const shots = JSON.parse(cleaned);

    if (!Array.isArray(shots)) {
      return NextResponse.json({ error: 'Response is not an array' }, { status: 500 });
    }

    return NextResponse.json({ shots });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
