import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { generateProjectSpec } from '@/lib/claude-advanced';
import { GenerationResponse, APIError } from '@/lib/types';

const PromptSchema = z.object({
  prompt: z.string().min(10).max(2000),
});

export async function POST(request: NextRequest): Promise<NextResponse<GenerationResponse | APIError>> {
  try {
    const body = await request.json();
    const parsed = PromptSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Please provide a valid app description (10-2000 characters).' },
        { status: 400 },
      );
    }

    const project = await generateProjectSpec(parsed.data.prompt);

    return NextResponse.json(
      {
        project,
        message: 'Project generated successfully with Claude.',
      },
      { status: 200 },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to generate app';
    console.error('Generation API error:', message);

    return NextResponse.json(
      {
        error: message,
        code: 'GENERATION_ERROR',
      },
      { status: 500 },
    );
  }
}
