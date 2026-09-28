import Anthropic from '@anthropic-ai/sdk';
import { ProjectSpec } from './types';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const MODEL = 'claude-3-5-sonnet-20241022';

function extractJSON(text: string) {
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('No JSON found in Claude response');
  }
  return JSON.parse(jsonMatch[0]);
}

function buildProjectStructurePrompt(prompt: string): string {
  return `You are an expert web app architect. Analyze this product idea and generate a detailed project structure.

Product Idea: "${prompt}"

Respond with ONLY a valid JSON object (no markdown, no extra text) with this exact structure:
{
  "name": "Project name (2-4 words, title case)",
  "description": "1-2 sentence description of the app",
  "theme": "Primary design theme (e.g., 'Modern SaaS', 'E-Commerce', 'Creative Studio')",
  "stack": "Technology stack (e.g., 'Next.js, React, TypeScript, Tailwind CSS')",
  "pages": ["Landing Page", "Dashboard", "Settings", "Pricing"],
  "features": ["Feature 1 description", "Feature 2 description", "Feature 3 description", "Feature 4 description", "Feature 5 description"]
}

Ensure the JSON is valid and parseable.`;
}

function buildHTMLGeneratorPrompt(
  name: string,
  description: string,
  prompt: string,
  features: string[],
  theme: string,
): string {
  return `Generate a production-quality HTML landing page for this project.

Project Details:
- Name: ${name}
- Description: ${description}
- Theme: ${theme}
- User Request: ${prompt}
- Key Features: ${features.slice(0, 4).join(', ')}

Requirements:
1. Create a modern, responsive HTML page with embedded CSS
2. Include hero section with compelling copy
3. Feature showcase section
4. Social proof / metrics section
5. Call-to-action buttons
6. Mobile-responsive design
7. Dark theme with gradient backgrounds
8. Use only inline CSS (no external stylesheets)
9. Include placeholder images using SVG or data URLs
10. No JavaScript required for basic functionality

Respond with ONLY valid HTML5 code (no markdown, no explanation).
Start with <!DOCTYPE html> and end with </html>`;
}

function buildAppCodePrompt(
  name: string,
  description: string,
  features: string[],
  stack: string,
): string {
  return `Generate a React component for the dashboard/main app interface.

Project: ${name}
Description: ${description}
Features: ${features.join(', ')}
Stack: ${stack}

Create a modern React component with:
1. Navigation/header
2. Sidebar with menu items based on features
3. Main content area with dashboard layout
4. Use Tailwind CSS classes for styling
5. Include TypeScript types
6. Add mock data/state management basics
7. Responsive design
8. Dark theme

Respond with ONLY valid TypeScript/JSX code (no markdown):
'use client';

import React from 'react';
// ... rest of the code`;
}

async function generateWithClaude(prompt: string, systemPrompt: string): Promise<string> {
  try {
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      system: systemPrompt,
    });

    const content = response.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type from Claude');
    }

    return content.text;
  } catch (error) {
    if (error instanceof Anthropic.APIError) {
      throw new Error(`Claude API error: ${error.message}`);
    }
    throw error;
  }
}

export async function generateProjectSpec(userPrompt: string): Promise<ProjectSpec> {
  try {
    // Step 1: Generate project structure
    const structureResponse = await generateWithClaude(
      buildProjectStructurePrompt(userPrompt),
      'You are an expert web app architect. Generate valid JSON only.',
    );

    const structure = extractJSON(structureResponse);

    // Step 2: Generate HTML landing page
    const htmlResponse = await generateWithClaude(
      buildHTMLGeneratorPrompt(structure.name, structure.description, userPrompt, structure.features, structure.theme),
      'You are an expert HTML/CSS developer. Generate production-quality HTML only.',
    );

    // Step 3: Generate React component code
    const appCodeResponse = await generateWithClaude(
      buildAppCodePrompt(structure.name, structure.description, structure.features, structure.stack),
      'You are an expert React developer. Generate production-quality TypeScript/JSX code only.',
    );

    return {
      id: `project-${Date.now()}`,
      name: structure.name,
      description: structure.description,
      prompt: userPrompt,
      stack: structure.stack,
      theme: structure.theme,
      pages: structure.pages,
      features: structure.features,
      htmlSnippet: htmlResponse,
      appCode: appCodeResponse,
      createdAt: new Date().toISOString(),
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to generate project';
    console.error('Generation error:', message);
    throw new Error(message);
  }
}

export async function regenerateSection(
  section: 'html' | 'app-code' | 'features',
  projectSpec: ProjectSpec,
): Promise<string> {
  try {
    switch (section) {
      case 'html':
        return await generateWithClaude(
          buildHTMLGeneratorPrompt(
            projectSpec.name,
            projectSpec.description,
            projectSpec.prompt,
            projectSpec.features,
            projectSpec.theme,
          ),
          'You are an expert HTML/CSS developer. Generate production-quality HTML only.',
        );

      case 'app-code':
        return await generateWithClaude(
          buildAppCodePrompt(projectSpec.name, projectSpec.description, projectSpec.features, projectSpec.stack),
          'You are an expert React developer. Generate production-quality TypeScript/JSX code only.',
        );

      case 'features':
        const featurePrompt = `Given this project: "${projectSpec.name}" - "${projectSpec.description}"
Original request: "${projectSpec.prompt}"

Generate 5 compelling feature descriptions as a JSON array:
["Feature 1", "Feature 2", "Feature 3", "Feature 4", "Feature 5"]`;
        const response = await generateWithClaude(
          featurePrompt,
          'Generate only a valid JSON array of strings.',
        );
        return response;

      default:
        throw new Error(`Unknown section: ${section}`);
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to regenerate section';
    console.error('Regeneration error:', message);
    throw new Error(message);
  }
}
