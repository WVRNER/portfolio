"use client";

import { GitFork, Star, ExternalLink } from "lucide-react";

export interface GitHubRepoData {
  fullName: string;
  name: string;
  owner: string;
  description: string;
  stars: number;
  language: string | null;
  languageColor?: string;
  url: string;
  forks?: number;
  failed?: boolean;
}

interface GitHubCardProps {
  repo: GitHubRepoData;
  className?: string;
}

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}m`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}k`;
  }
  return num.toLocaleString();
}

export function GitHubCard({ repo, className = "" }: GitHubCardProps) {
  return (
    <a
      href={repo.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`group my-8 block rounded-xl border border-neutral-200/90 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-900/40 p-5 sm:p-6 transition-all duration-200 hover:border-neutral-400 dark:hover:border-neutral-600 hover:shadow-sm no-underline ${className}`}
    >
      <div className="flex items-start justify-between gap-4">
        {/* Repo header */}
        <div className="flex items-center gap-2.5 min-w-0">
          {/* GitHub Octocat Mark SVG */}
          <svg
            className="w-5 h-5 flex-shrink-0 text-neutral-800 dark:text-neutral-200"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
            />
          </svg>

          <span className="font-sans font-semibold text-[15px] sm:text-[16px] text-neutral-900 dark:text-neutral-100 truncate group-hover:underline">
            {repo.fullName}
          </span>
        </div>

        <ExternalLink className="w-4 h-4 text-neutral-400 group-hover:text-neutral-700 dark:group-hover:text-neutral-200 transition-colors flex-shrink-0 mt-0.5" />
      </div>

      {/* Description */}
      {repo.description && (
        <p className="mt-2.5 font-sans text-[13.5px] sm:text-[14px] text-neutral-600 dark:text-neutral-400 line-clamp-2 leading-relaxed">
          {repo.description}
        </p>
      )}

      {/* Meta tags: Language & Stars */}
      <div className="mt-4 flex items-center gap-5 font-sans text-[12px] text-neutral-600 dark:text-neutral-400">
        {repo.language && (
          <div className="flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: repo.languageColor || "#888888" }}
              aria-hidden="true"
            />
            <span className="font-medium">{repo.language}</span>
          </div>
        )}

        <div className="flex items-center gap-1">
          <Star className="w-3.5 h-3.5 text-neutral-500 fill-neutral-500/20" />
          <span>{formatNumber(repo.stars)}</span>
        </div>

        {repo.forks !== undefined && repo.forks > 0 && (
          <div className="flex items-center gap-1">
            <GitFork className="w-3.5 h-3.5 text-neutral-500" />
            <span>{formatNumber(repo.forks)}</span>
          </div>
        )}
      </div>
    </a>
  );
}
