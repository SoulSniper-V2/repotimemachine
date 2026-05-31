const GITHUB_API = "https://api.github.com";

function ghHeaders(): HeadersInit {
  const h: HeadersInit = { Accept: "application/vnd.github.v3+json", "User-Agent": "repotimachine/0.1.0" };
  const t = process.env.GITHUB_TOKEN;
  if (t) (h as Record<string, string>)["Authorization"] = `Bearer ${t}`;
  return h;
}

export interface RepoMeta {
  full_name: string; description: string | null; stargazers_count: number; forks_count: number;
  language: string | null; topics: string[]; default_branch: string;
  created_at: string; updated_at: string; open_issues_count: number; homepage: string | null;
}

export async function getRepoMeta(owner: string, repo: string): Promise<RepoMeta> {
  const r = await fetch(`${GITHUB_API}/repos/${owner}/${repo}`, { headers: ghHeaders() });
  if (r.status === 404) throw new Error(`Repo ${owner}/${repo} not found.`);
  if (!r.ok) throw new Error(`GitHub error: ${r.status}`);
  const d = await r.json();
  return { full_name: d.full_name, description: d.description, stargazers_count: d.stargazers_count, forks_count: d.forks_count, language: d.language, topics: d.topics ?? [], default_branch: d.default_branch, created_at: d.created_at, updated_at: d.updated_at, open_issues_count: d.open_issues_count, homepage: d.homepage };
}

export async function getFileTree(owner: string, repo: string, branch: string) {
  const br = await fetch(`${GITHUB_API}/repos/${owner}/${repo}/branches/${branch}`, { headers: ghHeaders() });
  if (!br.ok) {
    const fb = branch === "main" ? "master" : "main";
    const r2 = await fetch(`${GITHUB_API}/repos/${owner}/${repo}/branches/${fb}`, { headers: ghHeaders() });
    if (!r2.ok) throw new Error("Branch not found");
    const d = await r2.json();
    return fetchTree(owner, repo, d.commit.commit.tree.sha);
  }
  const d = await br.json();
  return fetchTree(owner, repo, d.commit.commit.tree.sha);
}
async function fetchTree(owner: string, repo: string, sha: string) {
  const r = await fetch(`${GITHUB_API}/repos/${owner}/${repo}/git/trees/${sha}?recursive=1`, { headers: ghHeaders() });
  if (!r.ok) throw new Error("Tree fetch failed");
  const d = await r.json();
  return { tree: d.tree.map((t: any) => ({ path: t.path, type: t.type, size: t.size })), truncated: d.truncated ?? false };
}

export async function getReadme(owner: string, repo: string, branch: string): Promise<string> {
  const r = await fetch(`${GITHUB_API}/repos/${owner}/${repo}/readme?ref=${encodeURIComponent(branch)}`, { headers: ghHeaders() });
  if (!r.ok) return "";
  const d = await r.json();
  return Buffer.from(d.content, "base64").toString("utf-8");
}

export const getCommits = async (owner: string, repo: string, branch: string, perPage = 100) => {
  const r = await fetch(`${GITHUB_API}/repos/${owner}/${repo}/commits?sha=${branch}&per_page=${perPage}`, { headers: ghHeaders() });
  if (!r.ok) throw new Error(`Commits: ${r.status}`);
  return ((await r.json()) as any[]).map((c) => ({ sha: c.sha, message: c.commit.message, author: c.commit.author.name, author_login: c.author?.login ?? null, date: c.commit.author.date }));
};

export const getContributors = async (owner: string, repo: string) => {
  const r = await fetch(`${GITHUB_API}/repos/${owner}/${repo}/contributors?per_page=30`, { headers: ghHeaders() });
  if (!r.ok) return [];
  return ((await r.json()) as any[]).map((c) => ({ login: c.login, contributions: c.contributions }));
};

export const getReleases = async (owner: string, repo: string) => {
  const r = await fetch(`${GITHUB_API}/repos/${owner}/${repo}/releases?per_page=30`, { headers: ghHeaders() });
  if (!r.ok) return [];
  return ((await r.json()) as any[]).map((rel) => ({ tag_name: rel.tag_name, name: rel.name, published_at: rel.published_at }));
};

export const getLanguages = async (owner: string, repo: string) => {
  const r = await fetch(`${GITHUB_API}/repos/${owner}/${repo}/languages`, { headers: ghHeaders() });
  return r.ok ? await r.json() : {};
};

export const getCodeFrequency = async (owner: string, repo: string) => {
  const r = await fetch(`${GITHUB_API}/repos/${owner}/${repo}/stats/code_frequency`, { headers: ghHeaders() });
  if (!r.ok) return null;
  const d = await r.json();
  return Array.isArray(d) ? (d as number[][]).map((w) => ({ week: w[0], additions: w[1], deletions: w[2] })) : null;
};

export const getTopPullRequests = async (owner: string, repo: string, limit = 20) => {
  const r = await fetch(`${GITHUB_API}/repos/${owner}/${repo}/pulls?state=all&sort=comments&direction=desc&per_page=${limit}`, { headers: ghHeaders() });
  if (!r.ok) return [];
  return ((await r.json()) as any[]).map((pr) => ({ title: pr.title, number: pr.number, user: pr.user.login, created_at: pr.created_at, merged: !!pr.merged_at }));
};

export const getTopIssues = async (owner: string, repo: string, limit = 15) => {
  const r = await fetch(`${GITHUB_API}/repos/${owner}/${repo}/issues?state=all&sort=comments&direction=desc&per_page=${limit}`, { headers: ghHeaders() });
  if (!r.ok) return [];
  return ((await r.json()) as any[]).filter((i) => !("pull_request" in i)).map((i) => ({ title: i.title, number: i.number, user: i.user.login, state: i.state, comments: i.comments, created_at: i.created_at }));
};
