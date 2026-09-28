import './globals.css';

export default function Home() {
  return (
    <main className="page-shell">
      <section className="hero-card">
        <div className="badge-row">
          <span className="badge badge-primary">AI Builder</span>
          <span className="badge">Claude-powered</span>
        </div>
        <h1>Build an app from a single prompt.</h1>
        <p className="subtitle">
          A Lovable-style prototype that turns product ideas into a working UI mockup and app spec.
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

function GeneratorForm() {
  const [prompt, setPrompt] = React.useState(
    'Create a sleek SaaS landing page for a startup that helps teams automate customer support.'
  );
  const [loading, setLoading] = React.useState(false);
  const [project, setProject] = React.useState<ProjectSpec | null>(null);
  const [error, setError] = React.useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Generation failed');
      }

      setProject(data.project);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
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
      />

      <div className="action-row">
        <button type="submit" disabled={loading} className="primary-button">
          {loading ? 'Generating...' : 'Generate App'}
        </button>
        <span className="helper-text">Works with Claude when ANTHROPIC_API_KEY is set.</span>
      </div>

      {error ? <p className="error-box">{error}</p> : null}
      {project ? <p className="success-box">App generated successfully.</p> : null}
    </form>
  );
}

function ProjectSummary() {
  const [project, setProject] = React.useState<ProjectSpec | null>(null);

  React.useEffect(() => {
    const sync = () => {
      const saved = sessionStorage.getItem('lovable-project');
      setProject(saved ? (JSON.parse(saved) as ProjectSpec) : null);
    };

    sync();
    window.addEventListener('project-generated', sync);
    return () => window.removeEventListener('project-generated', sync);
  }, []);

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
        <span className="pill">{project.stack}</span>
      </div>
      <p>{project.description}</p>

      <div className="meta-grid">
        <div>
          <small>Theme</small>
          <strong>{project.theme}</strong>
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
        <h3>Pages</h3>
        <ul>
          {project.pages.map((page) => (
            <li key={page}>{page}</li>
          ))}
        </ul>
      </div>

      <div className="list-block">
        <h3>Core Features</h3>
        <ul>
          {project.features.map((feature) => (
            <li key={feature}>{feature}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function PreviewPanel() {
  const [project, setProject] = React.useState<ProjectSpec | null>(null);

  React.useEffect(() => {
    const sync = () => {
      const saved = sessionStorage.getItem('lovable-project');
      setProject(saved ? (JSON.parse(saved) as ProjectSpec) : null);
    };

    sync();
    window.addEventListener('project-generated', sync);
    return () => window.removeEventListener('project-generated', sync);
  }, []);

  return (
    <div className="panel preview-panel">
      <div className="panel-header">
        <h2>Live Preview</h2>
        <span className="pill subtle">{project ? 'Ready' : 'Waiting'}</span>
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

export type ProjectSpec = {
  id: string;
  name: string;
  description: string;
  stack: string;
  theme: string;
  pages: string[];
  features: string[];
  htmlSnippet: string;
  createdAt: string;
};

if (typeof window !== 'undefined') {
  const root = document.documentElement;
  root.style.setProperty('--page-bg', '#0b1020');
}
