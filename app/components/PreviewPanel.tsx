'use client';

import React, { useState, useEffect } from 'react';
import { ProjectSpec } from '@/lib/types';

export function PreviewPanel() {
  const [project, setProject] = useState<ProjectSpec | null>(null);
  const [regenerating, setRegenerating] = useState(false);

  useEffect(() => {
    const sync = () => {
      const saved = sessionStorage.getItem('lovable-project');
      setProject(saved ? (JSON.parse(saved) as ProjectSpec) : null);
    };

    sync();
    window.addEventListener('project-generated', sync);
    return () => window.removeEventListener('project-generated', sync);
  }, []);

  const handleRegenerate = async () => {
    if (!project) return;

    setRegenerating(true);
    try {
      const response = await fetch('/api/regenerate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section: 'html', project }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      const updated = { ...project, htmlSnippet: data.content };
      setProject(updated);
      sessionStorage.setItem('lovable-project', JSON.stringify(updated));
      window.dispatchEvent(new Event('project-generated'));
    } catch (err) {
      console.error('Regenerate error:', err);
    } finally {
      setRegenerating(false);
    }
  };

  return (
    <div className="panel preview-panel">
      <div className="panel-header">
        <h2>Live Preview</h2>
        <button
          onClick={handleRegenerate}
          disabled={regenerating || !project}
          className="regen-button"
        >
          {regenerating ? 'Regenerating...' : '↻ Regenerate'}
        </button>
      </div>
      {project ? (
        <iframe title="app-preview" srcDoc={project.htmlSnippet} className="preview-frame" />
      ) : (
        <div className="preview-placeholder">
          <p>Preview will appear here after generation.</p>
        </div>
      )}
    </div>
  );
}
