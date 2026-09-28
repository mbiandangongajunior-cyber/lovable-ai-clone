import type { NextRequest } from 'next/server';
import { z } from 'zod';
import { generateProjectSpec } from '@/lib/claude';

const PromptSchema = z.object({
  prompt: z.string().min(10).max(2000),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = PromptSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json({ error: 'Please provide a valid app description.' }, { status: 400 });
    }

    const project = await generateProjectSpec(parsed.data.prompt);

    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem('lovable-project', JSON.stringify(project));
      window.dispatchEvent(new Event('project-generated'));
    }

    return Response.json({ project });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to generate app';
    return Response.json({ error: message }, { status: 500 });
  }
}
