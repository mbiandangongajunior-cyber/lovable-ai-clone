import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { regenerateSection } from '@/lib/claude-advanced';
import { ProjectSpec, APIError } from '@/lib/types';

const RegenerateSchema = z.object({
  section: z.enum(['html', 'app-code', 'features']),
  project: z.object({
    name: z.string(),
    description: z.string(),
    prompt: z.string(),
    features: z.array(z.string()),
    theme: z.string(),
    stack: z.string(),
  }),
});

export async function POST(request: NextRequest): Promise<NextResponse<{ content: string } | APIError>> {
  try {
    const body = await request.json();
    const parsed = RegenerateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request format' },
        { status: 400 },
      );
    }

    const content = await regenerateSection(parsed.data.section, parsed.data.project as ProjectSpec);

    return NextResponse.json(
      { content },
      { status: 200 },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to regenerate section';
    console.error('Regenerate API error:', message);

    return NextResponse.json(
      { error: message },
      { status: 500 },
    );
  }
}
