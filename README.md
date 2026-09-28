# Lovable AI Clone

A production-ready Lovable-style web app generator powered by Claude 3.5 Sonnet.

## Features

✨ **AI-Powered Generation**
- Prompt-to-app generation using Claude 3.5 Sonnet
- Generates complete project specifications
- Creates production-quality HTML landing pages
- Generates React component code

🎨 **Smart Design**
- Automatically detects project theme and stack
- Generates 5+ feature descriptions
- Creates responsive, modern UI
- Dark theme with gradients

🔄 **Regeneration**
- Regenerate HTML landing pages
- Regenerate React component code
- Regenerate feature lists
- All without losing project context

📦 **Tech Stack**
- **Frontend**: Next.js 14, React 18, TypeScript
- **AI**: Anthropic Claude 3.5 Sonnet
- **Database**: PostgreSQL + Prisma (optional for production)
- **Styling**: CSS-in-JS with modern gradients and animations

## Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Anthropic API key (get one at https://console.anthropic.com)

### Installation

```bash
git clone https://github.com/mbiandangongajunior-cyber/lovable-ai-clone
cd lovable-ai-clone
npm install
```

### Setup Environment

Create a `.env.local` file:

```bash
cp .env.example .env.local
```

Add your Anthropic API key:

```env
ANTHROPIC_API_KEY=sk-ant-...
```

### Run Development Server

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## Usage

1. **Enter a Prompt**: Describe the app you want to build
2. **Generate**: Click "Generate App" and wait 30-60 seconds
3. **Review**: See the project summary and live preview
4. **Regenerate**: Click the ↻ icon to regenerate any section
5. **Export**: Download the generated HTML/JSX code

## API Endpoints

### POST /api/generate

Generate a new project from a prompt.

```json
{
  "prompt": "Create a SaaS landing page for team collaboration..."
}
```

Response:

```json
{
  "project": {
    "id": "project-1234567890",
    "name": "Collaboration Studio",
    "description": "...",
    "prompt": "...",
    "stack": "Next.js + TypeScript + Tailwind CSS",
    "theme": "Modern SaaS",
    "pages": [...],
    "features": [...],
    "htmlSnippet": "...",
    "appCode": "...",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

### POST /api/regenerate

Regenerate a specific section of the project.

```json
{
  "section": "html" | "app-code" | "features",
  "project": { /* project object */ }
}
```

Response:

```json
{
  "content": "..."
}
```

## Project Structure

```
.
├── app/
│   ├── api/
│   │   ├── generate/route.ts      # Main generation endpoint
│   │   ├── regenerate/route.ts    # Regeneration endpoint
│   │   └── projects/route.ts      # Project CRUD
│   ├── components/
│   │   ├── GeneratorForm.tsx      # Main form component
│   │   ├── ProjectSummary.tsx     # Project details panel
│   │   └── PreviewPanel.tsx       # Live preview iframe
│   ├── page.tsx                   # Main page
│   ├── layout.tsx                 # Root layout
│   └── globals.css                # Global styles
├── lib/
│   ├── claude-advanced.ts         # Claude integration
│   └── types.ts                   # TypeScript types
├── prisma/
│   └── schema.prisma              # Database schema
└── package.json
```

## Production Deployment

### Vercel (Recommended)

```bash
vercel deploy
```

Add environment variables in Vercel dashboard:
- `ANTHROPIC_API_KEY`
- `DATABASE_URL` (if using Postgres)
- `NEXTAUTH_SECRET` (for auth)

### Docker

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

CMD ["npm", "start"]
```

```bash
docker build -t lovable-ai-clone .
docker run -p 3000:3000 -e ANTHROPIC_API_KEY=sk-ant-... lovable-ai-clone
```

## Advanced Features

### Add Database Support

```bash
npm install @prisma/client
prisma migrate dev --name init
```

### Add Authentication

The Prisma schema includes User, Account, and Session models for NextAuth.js.

### Add Project Versioning

Project versions are tracked in the database for history and rollback.

## Customization

### Change the Model

In `lib/claude-advanced.ts`, update the `MODEL` constant:

```typescript
const MODEL = 'claude-3-opus-20240229'; // or any other Claude model
```

### Customize Generation Prompts

Edit the prompt builders in `lib/claude-advanced.ts`:
- `buildProjectStructurePrompt()`
- `buildHTMLGeneratorPrompt()`
- `buildAppCodePrompt()`

### Modify Styling

Edit `app/globals.css` to change colors, fonts, and layouts.

## Troubleshooting

### "401 Unauthorized" from Claude
- Check that `ANTHROPIC_API_KEY` is set correctly
- Verify your API key has credit available

### Generation takes too long
- Claude model calls can take 30-60 seconds
- Consider using `claude-3-haiku` for faster, lighter generation

### Preview doesn't update
- Clear browser cache or open in incognito mode
- Check browser console for errors

## Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

- 📧 Email: support@example.com
- 🐛 Issues: https://github.com/mbiandangongajunior-cyber/lovable-ai-clone/issues
- 💬 Discussions: https://github.com/mbiandangongajunior-cyber/lovable-ai-clone/discussions

## Roadmap

- [ ] User authentication (NextAuth.js)
- [ ] Project persistence (PostgreSQL)
- [ ] Advanced code editing
- [ ] One-click deployment to Vercel
- [ ] Component library generation
- [ ] API generation (Node.js, Python)
- [ ] Mobile app generation (React Native)
- [ ] Team collaboration
- [ ] Version control and branching
- [ ] Export to GitHub

## Acknowledgments

Inspired by [Lovable](https://lovable.dev) - built with Claude 3.5 Sonnet.
