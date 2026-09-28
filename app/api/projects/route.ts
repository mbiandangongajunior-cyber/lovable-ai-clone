import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const CreateProjectSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string(),
  prompt: z.string(),
  theme: z.string(),
  stack: z.string(),
  pages: z.array(z.string()),
  features: z.array(z.string()),
  htmlSnippet: z.string(),
  appCode: z.string().optional(),
});

// Mock storage - replace with database in production
const projects: Map<string, unknown> = new Map();

export async function POST(request: NextRequest): Promise<NextResponse<{ id: string; project: unknown } | { error: string }>> {
  try {
    const body = await request.json();
    const parsed = CreateProjectSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid project data' },
        { status: 400 },
      );
    }

    const id = `proj-${Date.now()}`;
    const project = {
      id,
      ...parsed.data,
      createdAt: new Date().toISOString(),
    };

    projects.set(id, project);

    return NextResponse.json(
      { id, project },
      { status: 201 },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create project';
    return NextResponse.json(
      { error: message },
      { status: 500 },
    );
  }
}

export async function GET(): Promise<NextResponse<{ projects: unknown[] }>> {
  return NextResponse.json(
    { projects: Array.from(projects.values()) },
    { status: 200 },
  );
}
