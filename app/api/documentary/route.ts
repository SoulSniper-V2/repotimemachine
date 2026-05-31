import { NextRequest, NextResponse } from "next/server";
import { DOCUMENTARY_SYSTEM_PROMPT, buildDocumentaryUserMessage, RepoDataForDocumentary } from "@/lib/documentary-prompt";
import { getRepoMeta, getCommits, getContributors, getReleases, getFileTree, getReadme, getLanguages, getCodeFrequency, getTopPullRequests, getTopIssues } from "@/lib/github-client";
import { kv } from "@vercel/kv";

export const runtime = "nodejs";
export const maxDuration = 120;

const OPENAI_URL = "https://api.openai.com/v1/chat/completions";
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const XAI_URL = "https://api.x.ai/v1/chat/completions";

interface LlmTarget { url: string; apiKey: string; model: string; }

function resolveLlm(): LlmTarget | { error: string } {
  const xai = process.env.XAI_API_KEY?.trim();
  const or = process.env.OPENROUTER_API_KEY?.trim();
  const oa = process.env.OPENAI_API_KEY?.trim();
  if (xai) return { url: XAI_URL, apiKey: xai, model: process.env.XAI_MODEL?.trim() || "grok-3" };
  if (or) return { url: OPENROUTER_URL, apiKey: or, model: process.env.OPENROUTER_MODEL?.trim() || "openrouter/owl-alpha" };
  if (oa) return { url: OPENAI_URL, apiKey: oa, model: process.env.OPENAI_MODEL?.trim() || "gpt-4.1" };
  return { error: "No LLM API key. Set OPENROUTER_API_KEY, OPENAI_API_KEY, or XAI_API_KEY." };
}

function cacheKey(owner: string, repo: string): string {
  return `doc:${owner}/${repo}`;
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });

  const { owner, repo } = body;
  if (!owner || !repo) return NextResponse.json({ error: "Owner and repo required." }, { status: 400 });

  const llm = resolveLlm();
  if ("error" in llm) return NextResponse.json({ error: llm.error }, { status: 500 });

  // Check KV cache
  const cached = await kv.get(cacheKey(owner, repo)) as string | null;
  if (cached) return NextResponse.json({ documentary: cached, fromCache: true });

  try {
    const [meta, commits, contributors, releases, tree, readme, languages, codeFreq, topPRs, topIssues] = await Promise.all([
      getRepoMeta(owner, repo),
      getCommits(owner, repo, "main").catch(() => getCommits(owner, repo, "master")),
      getContributors(owner, repo),
      getReleases(owner, repo),
      getFileTree(owner, repo, "main").catch(() => getFileTree(owner, repo, "master")),
      getReadme(owner, repo, "main").catch(() => getReadme(owner, repo, "master").catch(() => null)),
      getLanguages(owner, repo),
      getCodeFrequency(owner, repo).catch(() => null),
      getTopPullRequests(owner, repo).catch(() => []),
      getTopIssues(owner, repo).catch(() => []),
    ]);

    const data: RepoDataForDocumentary = {
      meta: {
        full_name: meta.full_name, description: meta.description, stars: meta.stargazers_count,
        forks: meta.forks_count, language: meta.language, topics: meta.topics,
        default_branch: meta.default_branch, created_at: meta.created_at, updated_at: meta.updated_at,
        open_issues: meta.open_issues_count, homepage: meta.homepage,
      },
      commits: commits.map((c) => ({ message: c.message, author: c.author, date: c.date })),
      contributors, releases, languages,
      fileTree: tree.tree,
      readme, codeFrequency: codeFreq,
      topPullRequests: topPRs, topIssues,
    };

    const res = await fetch(llm.url, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${llm.apiKey}` },
      body: JSON.stringify({
        model: llm.model,
        messages: [
          { role: "system", content: DOCUMENTARY_SYSTEM_PROMPT },
          { role: "user", content: buildDocumentaryUserMessage(data) },
        ],
        max_tokens: 3000,
        temperature: 0.5,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`LLM error ${res.status}: ${errText.slice(0, 200)}`);
    }

    const json = await res.json();
    const documentary = json.choices?.[0]?.message?.content ?? "Failed to generate.";

    // Cache for 24h
    await kv.set(cacheKey(owner, repo), documentary, { ex: 86400 });

    return NextResponse.json({ documentary, fromCache: false });
  } catch (err: any) {
    console.error("[documentary] Error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
