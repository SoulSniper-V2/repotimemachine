<div align="center">

![RepoTimeMachine](https://img.shields.io/badge/RepoTimeMachine-ai-ff6b00?style=for-the-badge&logo=github&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-Deployed-000000?style=vercel&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**Paste a GitHub repo. Watch its history unfold.**

Not commits. Not code. The *documentary*.

[Live Demo](https://repotimemachine.ai) · [Report Bug](https://github.com/SoulSniper-V2/repotimemachine/issues) · [Request Feature](https://github.com/SoulSniper-V2/repotimemachine/issues)

</div>

---

## What is this?

RepoTimeMachine.ai generates cinematic documentaries about GitHub repositories. Paste any `owner/repo` URL and get a structured narrative covering:

- **⏳ The Genesis** — What problem existed, who sparked it, the initial backlash
- **📈 Scale Today** — Stars, forks, real-world impact
- **🔄 Turning Points** — Key moments that changed the project's trajectory, with date pills
- **👥 Characters** — Core contributors, commit counts, first appearances
- **🗺️ Eras** — Distinct phases of the project's lifetime
- **🦋 Butterfly Effect** — One decision that cascaded into everything

All generated from real GitHub data — commits, contributors, releases, PRs, issues — synthesized into punchy narrative beats by an LLM.

## How it works

```
GitHub API (10 data sources)
        ↓
  Parallel fetch (metadata, commits, contributors,
  releases, file tree, README, languages, code
  frequency, top PRs, top issues)
        ↓
  Structured data → LLM (OpenRouter)
        ↓
  Documentary JSON → Rendered with
  neo-brutalist UI components
```

Results are cached for 24 hours. Same repo = instant load.

## Tech Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 16 (App Router) |
| UI | React 19, Tailwind CSS 4 |
| Fonts | Geist Sans + Geist Mono |
| LLM | OpenRouter |
| Data | GitHub REST API (authenticated) |
| Cache | Local filesystem (24h TTL) |
| Deploy | Vercel (serverless) |

## Project Structure

```
app/
├── page.tsx                     # Landing page + input form
├── layout.tsx                   # Root layout (fonts, cream bg)
├── [owner]/[repo]/page.tsx      # Dynamic route → repotimemachine.ai/facebook/react
├── api/documentary/route.ts     # GitHub fetch → LLM → documentary
└── components/
    ├── home-documentary.tsx     # Input, example buttons, generation flow
    └── documentary-output.tsx   # Timeline, date pills, stat badges, era cards
lib/
├── github-client.ts             # 10 parallel GitHub API calls
├── documentary-prompt.ts        # LLM system prompt + user message template
└── parse-github-repo.ts         # URL parser (owner/repo, full URL, etc.)
```

## Features

- **Neo-brutalist UI** — Thick borders, offset shadows, cream backgrounds, warm orange accents
- **Documentary renderer** — Custom parser that turns LLM output into structured visual components
- **URL routing** — `repotimemachine.ai/facebook/react` works as a direct link
- **9 example repos** — Linux, React, Next.js, VS Code, Go, Rust, TypeScript, Django, Vue
- **24h local cache** — No redundant API calls for the same repo
- **Streaming-ready** — Client handles both streaming and non-streaming responses

## License

MIT
