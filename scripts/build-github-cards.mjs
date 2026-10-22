import fs from "node:fs";
import path from "node:path";

const ROOT_DIR = process.cwd();
const BLOG_DATA_PATH = path.join(ROOT_DIR, "lib", "blogData.ts");
const CACHE_FILE = path.join(ROOT_DIR, "lib", "githubData.json");

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

// Standard language colors for GitHub cards
const LANGUAGE_COLORS = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  Go: "#00ADD8",
  Rust: "#dea584",
  HCL: "#844fba",
  Shell: "#89e051",
  Dockerfile: "#384d54",
  Ruby: "#701516",
  Java: "#b07219",
  Kotlin: "#A97BFF",
  Swift: "#F05138",
  C: "#555555",
  "C++": "#f34b7d",
  HTML: "#e34c26",
  CSS: "#563d7c",
};

/**
 * Extracts all GitHub repository URLs from text.
 * Finds patterns like:
 * - https://github.com/owner/repo
 * - http://github.com/owner/repo
 * - github.com/owner/repo
 */
function extractGithubRepos(text) {
  const repos = new Set();
  const regex = /(?:https?:\/\/)?github\.com\/([a-zA-Z0-9_.-]+)\/([a-zA-Z0-9_.-]+)(?:[^\s)\]>"']*)/gi;
  let match;
  while ((match = regex.exec(text)) !== null) {
    const owner = match[1];
    let repo = match[2];
    // Strip trailing slashes, dots, or common punctuation
    repo = repo.replace(/[./]+$/, "");
    // Ignore reserved GitHub paths
    const reserved = ["features", "pricing", "marketplace", "topics", "trending", "collections", "events", "about", "contact", "security"];
    if (!reserved.includes(owner.toLowerCase())) {
      repos.add(`${owner}/${repo}`);
    }
  }
  return Array.from(repos);
}

async function fetchRepoData(fullName, token) {
  const url = `https://api.github.com/repos/${fullName}`;
  const headers = {
    "User-Agent": "WVRNER-Portfolio-Build/1.0",
    Accept: "application/vnd.github.v3+json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, { headers });
    if (!response.ok) {
      console.warn(`GitHub API returned ${response.status} for ${fullName}`);
      return null;
    }
    const data = await response.json();
    return {
      fullName: data.full_name,
      name: data.name,
      owner: data.owner?.login || fullName.split("/")[0],
      description: data.description || "",
      stars: data.stargazers_count || 0,
      language: data.language || null,
      languageColor: LANGUAGE_COLORS[data.language] || "#888888",
      url: data.html_url || `https://github.com/${fullName}`,
      forks: data.forks_count || 0,
      fetchedAt: Date.now(),
    };
  } catch (err) {
    console.warn(`Failed to fetch repo data for ${fullName}:`, err.message);
    return null;
  }
}

async function run() {
  console.log("Checking build-time GitHub repo cards cache...");

  let existingCache = {};
  if (fs.existsSync(CACHE_FILE)) {
    try {
      existingCache = JSON.parse(fs.readFileSync(CACHE_FILE, "utf-8"));
    } catch {
      existingCache = {};
    }
  }

  // Scan blogData.ts for repos
  let blogContent = "";
  if (fs.existsSync(BLOG_DATA_PATH)) {
    blogContent = fs.readFileSync(BLOG_DATA_PATH, "utf-8");
  }

  const foundRepos = extractGithubRepos(blogContent);

  // Always ensure canonical infrastructure repos can be cached
  const canonicalRepos = [
    "aws-actions/configure-aws-credentials",
    "hashicorp/terraform",
    ...foundRepos,
  ];

  const uniqueRepos = Array.from(new Set(canonicalRepos.map((r) => r.toLowerCase())));
  const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN || null;

  const updatedCache = { ...existingCache };
  const now = Date.now();

  for (const repoKey of uniqueRepos) {
    const cached = existingCache[repoKey];
    const isFresh = cached && cached.fetchedAt && now - cached.fetchedAt < ONE_DAY_MS && !cached.failed;

    if (isFresh) {
      updatedCache[repoKey] = cached;
      continue;
    }

    console.log(`Fetching GitHub metadata for: ${repoKey}`);
    const freshData = await fetchRepoData(repoKey, token);
    if (freshData) {
      updatedCache[repoKey] = freshData;
    } else if (cached) {
      // Retain existing stale data if available rather than breaking
      console.log(`Retaining stale cache for ${repoKey} after failed fetch`);
      updatedCache[repoKey] = cached;
    } else {
      updatedCache[repoKey] = {
        failed: true,
        fullName: repoKey,
        url: `https://github.com/${repoKey}`,
        fetchedAt: now,
      };
    }
  }

  fs.writeFileSync(CACHE_FILE, JSON.stringify(updatedCache, null, 2), "utf-8");
  console.log(`Saved ${Object.keys(updatedCache).length} GitHub card records to lib/githubData.json`);
}

run();
