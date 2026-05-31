# RepoTimeMachine.ai

Paste a GitHub repo URL and get a cinematic documentary about its history — not a code dump, not a README summary. A dramatic narrative covering the origin story, key turning points, core characters, distinct eras, and butterfly effect moments.

## What it does

- Paste any `owner/repo` or full GitHub URL
- Fetches 10 data sources from the GitHub API (metadata, commits, contributors, releases, file tree, README, languages, code frequency, top PRs, top issues)
- Synthesizes everything into a structured documentary via LLM
- Renders with a neo-brutalist UI: date pill timelines, stat badges, character cards, era sections
- Results cached locally for 24h (no repeat generation for same repo)

## Stack

- **Frontend:** Next.js 16, React 19, Tailwind CSS 4
- **LLM:** OpenRouter (default: `openrouter/owl-alpha`)
- **Data:** GitHub REST API (authenticated, 5000 req/hr)
- **Cache:** Local filesystem (`.cache/` directory)
- **Deploy:** Vercel (zero-config Next.js)

## Quick Start

```bash
git clone https://github.com/SoulSniper-V2/repotimemachine.git
cd repotimemachine
npm install
```

Create `.env.local`:

```env
OPENROUTER_API_KEY=sk-or-v1-your-key-here
OPENROUTER_MODEL=openrouter/owl-alpha
GITHUB_TOKEN=ghp_your-github-token-here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

```bash
npm run dev      # local development
npm run build    # production build
npm run start    # production server
```

## Deploy to Vercel

```bash
npm i -g vercel
vercel --prod
```

Set env vars in Vercel dashboard:
- `OPENROUTER_API_KEY`
- `GITHUB_TOKEN`
- `OPENROUTER_MODEL` = `openrouter/owl-alpha`
- `NEXT_PUBLIC_APP_URL` = your production URL

## Project Structure

```
app/
  page.tsx                    # Home page with input + documentary output
  layout.tsx                  # Root layout (Geist fonts, cream background)
  [owner]/[repo]/page.tsx     # Dynamic route: repotimemachine.ai/facebook/react
  api/documentary/route.ts    # GitHub data → LLM → documentary JSON
  components/
    home-documentary.tsx      # Input form + example buttons
    documentary-output.tsx    # Parsed documentary renderer (timeline, badges)
lib/
  github-client.ts            # GitHub API client (10 parallel data sources)
  documentary-prompt.ts       # LLM system prompt + user message builder
  parse-github-repo.ts        # URL parser
```

## License

MIT
