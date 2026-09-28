'use client';

import React, { useState } from 'react';
import { ProjectSpec } from '@/lib/types';

export interface GeneratorFormProps {
  onProjectGenerated?: (project: ProjectSpec) => void;
  isLoading?: boolean;
}

export function GeneratorForm({ onProjectGenerated, isLoading = false }: GeneratorFormProps) {
  const [prompt, setPrompt] = useState(
    'Create a sleek SaaS landing page for a startup that helps teams automate customer support.',
  );
  const [loading, setLoading] = useState(isLoading);
  const [error, setError] = useState('');
  const [estimatedTime, setEstimatedTime] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setEstimatedTime('Generating with Claude (this may take 30-60 seconds)...');

    try {
      const startTime = Date.now();
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Generation failed');
      }

      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
      setEstimatedTime(`Generated in ${elapsed} seconds`);

      // Store in session/local storage
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('lovable-project', JSON.stringify(data.project));
        window.dispatchEvent(new Event('project-generated'));
      }

      onProjectGenerated?.(data.project);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong';
      setError(message);
      console.error('Generation error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="generator-form">
      <label htmlFor="prompt" className="sr-only">
        Describe your app
      </label>
      <textarea
        id="prompt"
        value={prompt}
        onChange={(event) => setPrompt(event.target.value)}
        rows={5}
        placeholder="Describe the app you want to build..."
        disabled={loading}
      />

      <div className="action-row">
        <button type="submit" disabled={loading} className="primary-button">
          {loading ? 'Generating with Claude...' : 'Generate App'}
        </button>
        <span className="helper-text">
          {estimatedTime || 'Powered by Claude 3.5 Sonnet'}
        </span>
      </div>

      {error && <p className="error-box">{error}</p>}
    </form>
  );
}
