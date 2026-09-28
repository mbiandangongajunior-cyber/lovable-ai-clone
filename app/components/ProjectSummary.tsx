'use client';

import React, { useState, useEffect } from 'react';
import { ProjectSpec } from '@/lib/types';

export function ProjectSummary() {
  const [project, setProject] = useState<ProjectSpec | null>(null);
  const [regenerating, setRegenerating] = useState<string | null>(null);

  useEffect(() => {
    const sync = () => {
      const saved = sessionStorage.getItem('lovable-project');
      setProject(saved ? (JSON.parse(saved) as ProjectSpec) : null);
    };

    sync();
    window.addEventListener('project-generated', sync);
    return () => window.removeEventListener('project-generated', sync);
  }, []);

  const handleRegenerate = async (section: 'features' | 'html' | 'app-code') => {
    if (!project) return;

    setRegenerating(section);
    try {
      const response = await fetch('/api/regenerate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section, project }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      // Update project with regenerated content
      if (section === 'features') {
        const features = JSON.parse(data.content);
        const updated = { ...project, features };
        setProject(updated);
        sessionStorage.setItem('lovable-project', JSON.stringify(updated));
      } else if (section === 'html') {
        const updated = { ...project, htmlSnippet: data.content };
        setProject(updated);
        sessionStorage.setItem('lovable-project', JSON.stringify(updated));
        window.dispatchEvent(new Event('project-generated'));
      } else if (section === 'app-code') {
        const updated = { ...project, appCode: data.content };
        setProject(updated);
        sessionStorage.setItem('lovable-project', JSON.stringify(updated));
      }
    } catch (err) {
      console.error('Regenerate error:', err);
    } finally {
      setRegenerating(null);
    }
  };

  if (!project) {
    return (
      <div className="panel">
        <h2>Project Summary</h2>
        <p className="muted">Generate an app to see the project specifications here.</p>
      </div>
    );
  }

  return (
    <div className="panel">
      <div className="panel-header">
        <h2>{project.name}</h2>
        <span className="pill">{project.theme}</span>
      </div>
      <p>{project.description}</p>

      <div className="meta-grid">
        <div>
          <small>Stack</small>
          <strong>{project.stack.split(',')[0]}</strong>
        </div>
        <div>
          <small>Pages</small>
          <strong>{project.pages.length}</strong>
        </div>
        <div>
          <small>Features</small>
          <strong>{project.features.length}</strong>
        </div>
      </div>

      <div className="list-block">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3>Core Features</h3>
          <button
            onClick={() => handleRegenerate('features')}
            disabled={regenerating === 'features'}
            className="regen-button"
          >
            {regenerating === 'features' ? 'Regenerating...' : '↻ Regenerate'}
          </button>
        </div>
        <ul>
          {project.features.map((feature) => (
            <li key={feature}>{feature}</li>
          ))}
        </ul>
      </div>

      <div className="list-block">
        <h3>Pages</h3>
        <ul>
          {project.pages.map((page) => (
            <li key={page}>{page}</li>
          ))}
        </ul>
      </div>

      {project.appCode && (
        <div className="list-block">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3>App Code</h3>
            <button
              onClick={() => handleRegenerate('app-code')}
              disabled={regenerating === 'app-code'}
              className="regen-button"
            >
              {regenerating === 'app-code' ? 'Regenerating...' : '↻ Regenerate'}
            </button>
          </div>
          <pre className="code-block">{project.appCode.substring(0, 500)}...</pre>
        </div>
      )}
    </div>
  );
}
