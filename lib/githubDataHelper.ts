import githubCardsRaw from "./githubData.json";
import type { GitHubRepoData } from "@/components/GitHubCard";

const githubCards: Record<string, GitHubRepoData> = githubCardsRaw as Record<
  string,
  GitHubRepoData
>;

export function getGitHubRepoCard(urlOrRepo: string): GitHubRepoData | null {
  if (!urlOrRepo) return null;
  const cleaned = urlOrRepo
    .trim()
    .replace(/^https?:\/\/github\.com\//i, "")
    .replace(/^github\.com\//i, "")
    .replace(/[./]+$/, "")
    .toLowerCase();

  return githubCards[cleaned] || null;
}
