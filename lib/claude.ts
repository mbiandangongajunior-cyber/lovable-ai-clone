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

const safeText = (text: string) => text.replace(/[`]/g, '').trim();

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 40) || 'project';
}

function buildHtmlForProject(name: string, prompt: string, features: string[]) {
  const accent = '#7c3aed';
  const secondary = '#22c55e';
  const featureMarkup = features
    .slice(0, 4)
    .map((feature) => `<li>${feature}</li>`)
    .join('');

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${name}</title>
        <style>
          body {
            margin: 0;
            font-family: Arial, sans-serif;
            background: linear-gradient(135deg, #09111f 0%, #111827 100%);
            color: #edf2ff;
          }
          .wrapper {
            max-width: 1200px;
            margin: 0 auto;
            padding: 40px 20px 60px;
          }
          .hero {
            display: grid;
            grid-template-columns: 1.2fr 0.8fr;
            gap: 24px;
            align-items: center;
          }
          .eyebrow {
            display: inline-block;
            background: rgba(124, 58, 237, 0.18);
            border: 1px solid rgba(167, 139, 250, 0.5);
            color: #ddd6fe;
            border-radius: 999px;
            padding: 8px 12px;
            font-size: 12px;
            letter-spacing: 0.08em;
            text-transform: uppercase;
          }
          h1 {
            font-size: clamp(2.4rem, 4vw, 4rem);
            margin: 16px 0;
          }
          p {
            color: #c7d2fe;
            line-height: 1.7;
          }
          .cta-box {
            margin-top: 22px;
            display: flex;
            gap: 12px;
            flex-wrap: wrap;
          }
          .button {
            background: linear-gradient(135deg, ${accent}, #a78bfa);
            color: white;
            border: 0;
            border-radius: 12px;
            padding: 12px 18px;
            font-weight: 700;
            cursor: pointer;
          }
          .button.secondary {
            background: rgba(148, 163, 184, 0.12);
            border: 1px solid rgba(148, 163, 184, 0.25);
          }
          .panel {
            background: rgba(17, 24, 39, 0.9);
            border: 1px solid rgba(148, 163, 184, 0.2);
            border-radius: 24px;
            padding: 24px;
            box-shadow: 0 30px 60px rgba(15, 23, 42, 0.25);
          }
          .metrics {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 12px;
            margin-top: 18px;
          }
          .metric {
            background: rgba(15, 23, 42, 0.8);
            border: 1px solid rgba(148, 163, 184, 0.12);
            border-radius: 16px;
            padding: 14px;
          }
          .metric strong {
            display: block;
            font-size: 1.6rem;
            margin-top: 8px;
          }
          .section {
            margin-top: 32px;
          }
          .feature-list {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 12px;
            padding: 0;
            margin: 20px 0 0;
            list-style: none;
          }
          .feature-list li {
            background: rgba(30, 41, 59, 0.9);
            border: 1px solid rgba(148, 163, 184, 0.12);
            border-radius: 14px;
            padding: 14px 16px;
          }
          @media (max-width: 800px) {
            .hero, .metrics, .feature-list {
              grid-template-columns: 1fr;
            }
          }
        </style>
      </head>
      <body>
        <div class="wrapper">
          <section class="hero">
            <div>
              <span class="eyebrow">AI Generated</span>
              <h1>${name}</h1>
              <p>${prompt}</p>
              <div class="cta-box">
                <button class="button">Get Started</button>
                <button class="button secondary">View Demo</button>
              </div>
            </div>
            <div class="panel">
              <div class="metric">
                <span>Users onboarded</span>
                <strong>24k</strong>
              </div>
              <div class="metrics">
                <div class="metric">
                  <span>Growth</span>
                  <strong>+38%</strong>
                </div>
                <div class="metric">
                  <span>Response</span>
                  <strong>2.4s</strong>
                </div>
                <div class="metric">
                  <span>CSAT</span>
                  <strong>96%</strong>
                </div>
              </div>
            </div>
          </section>

          <section class="section">
            <h2>Why teams choose ${name}</h2>
            <ul class="feature-list">
              ${featureMarkup}
            </ul>
          </section>
        </div>
      </body>
    </html>
  `;
}

export async function generateProjectSpec(prompt: string): Promise<ProjectSpec> {
  const baseName = prompt
    .split(' ')
    .slice(0, 4)
    .join(' ')
    .replace(/[^a-zA-Z0-9 ]/g, '')
    .trim();

  const name = `${baseName || 'Nova'} Studio`;
  const theme = /saas|startup|dashboard|platform|product|crm|analytics/i.test(prompt) ? 'SaaS' : 'Modern';
  const stack = 'Next.js + TypeScript + Tailwind + Claude';
  const pages = ['Landing Page', 'Dashboard', 'Pricing', 'Auth'];
  const features = [
    'Prompt-driven project generation',
    'Responsive product UI',
    'Analytics overview',
    'Conversion-focused landing flow',
  ];

  const description = `A ${theme.toLowerCase()} product pages and dashboard experience designed around: ${prompt}`;

  return {
    id: `project-${slugify(name)}-${Date.now()}`,
    name,
    description: safeText(description),
    stack,
    theme,
    pages,
    features,
    htmlSnippet: buildHtmlForProject(name, prompt, features),
    createdAt: new Date().toISOString(),
  };
}
