"use client";
import api from "@/lib/api";
import { devLog } from "@/lib/utils";
import { GitHubRepository } from "@/types/github";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  Code2,
  Star,
  GitFork,
  Eye,
  GitBranch,
  FileCode,
  Calendar,
  ExternalLink,
  AlertCircle
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function SharedRepositoryInfo() {
  const searchParams = useSearchParams();
  const repositoryName = searchParams.get("repositoryName");
  const githubUsername = searchParams.get("githubUsername");

  const { data: repo } = useSuspenseQuery<GitHubRepository>({
    queryKey: ["github", "repos", githubUsername, repositoryName],
    queryFn: async () => {
      if (!repositoryName || !githubUsername) {
        throw new Error("Missing repository name or github username");
      }
      const response = await api.get(`/api/v1/github/repos/${githubUsername}/${repositoryName}`);
      return response.data;
    },
  });

  devLog("Repository:", repo);

  if (!repositoryName || !githubUsername) {
    return (
      <div className="text-destructive flex items-center gap-2">
        <AlertCircle className="w-5 h-5" />
        Error: Missing repository name or github username
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-UK", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="flex flex-col max-w-5xl mx-auto w-full border border-border rounded shadow bg-card sm:p-8 p-4 gap-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Code2 className="w-10 h-10 text-muted-foreground flex-shrink-0 mt-1" />
        <div className="flex-1 min-w-0">
          <h1 className="text-4xl font-bold break-words">{repo.name}</h1>
          <p className="text-muted-foreground mt-1">
            {repo.owner.login}/{repo.name}
          </p>
        </div>
        <Link
          href={repo.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-accent transition-colors"
        >
          View on GitHub
          <ExternalLink className="w-4 h-4" />
        </Link>
      </div>

      {/* Description */}
      {repo.description && (
        <p className="text-lg text-muted-foreground">{repo.description}</p>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="flex items-center gap-3 p-4 border rounded-lg">
          <Star className="w-5 h-5 text-yellow-500" />
          <div>
            <p className="text-2xl font-bold">{repo.stargazers_count}</p>
            <p className="text-sm text-muted-foreground">Stars</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-4 border rounded-lg">
          <GitFork className="w-5 h-5 text-blue-500" />
          <div>
            <p className="text-2xl font-bold">{repo.forks_count}</p>
            <p className="text-sm text-muted-foreground">Forks</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-4 border rounded-lg">
          <Eye className="w-5 h-5 text-green-500" />
          <div>
            <p className="text-2xl font-bold">{repo.watchers_count}</p>
            <p className="text-sm text-muted-foreground">Watchers</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-4 border rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <div>
            <p className="text-2xl font-bold">{repo.open_issues_count}</p>
            <p className="text-sm text-muted-foreground">Issues</p>
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="grid sm:grid-cols-[1fr_280px] gap-4">
        <div className="space-y-3 p-4 border rounded-lg">
          <h2 className="font-semibold text-lg">Repository Details</h2>
          <div className="space-y-2 text-sm">
            {repo.language && (
              <div className="flex items-center gap-2">
                <FileCode className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Language:</span>
                <span className="font-medium">{repo.language}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <GitBranch className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Default Branch:</span>
              <span className="font-medium">{repo.default_branch}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Visibility:</span>
              <span className="font-medium capitalize">{repo.visibility}</span>
            </div>
          </div>
        </div>

        <div className="space-y-3 p-4 border rounded-lg">
          <h2 className="font-semibold text-lg">Timeline</h2>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Created:</span>
              <span className="font-medium">{formatDate(repo.created_at)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Updated:</span>
              <span className="font-medium">{formatDate(repo.updated_at)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Pushed:</span>
              <span className="font-medium">{formatDate(repo.pushed_at)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Links */}
      {repo.homepage && (
        <div className="p-4 border rounded-lg">
          <h2 className="font-semibold text-lg mb-2">Homepage</h2>
          <Link
            href={repo.homepage}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline flex items-center gap-2"
          >
            {repo.homepage}
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  );
}
