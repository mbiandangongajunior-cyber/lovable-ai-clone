import React from 'react';
import './globals.css';
import { GeneratorForm } from './components/GeneratorForm';
import { ProjectSummary } from './components/ProjectSummary';
import { PreviewPanel } from './components/PreviewPanel';

export default function Home() {
  return (
    <main className="page-shell">
      <section className="hero-card">
        <div className="badge-row">
          <span className="badge badge-primary">AI Builder</span>
          <span className="badge">Claude 3.5 Sonnet</span>
          <span className="badge">Open Source</span>
        </div>
        <h1>Build Production Apps from Text Prompts.</h1>
        <p className="subtitle">
          Describe your web app, and Claude AI generates a complete project structure, landing page, and component code in seconds.
        </p>

        <GeneratorForm />
      </section>

      <section className="results-grid">
        <ProjectSummary />
        <PreviewPanel />
      </section>
    </main>
  );
}
