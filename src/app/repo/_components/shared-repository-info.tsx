"use client";
import api from "@/lib/api";
import { cn, devLog, logApiError } from "@/lib/utils";
import { GitHubRepository } from "@/types/github";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import {
  Code2,
  Star,
  GitFork,
  Eye,
  GitBranch,
  FileCode,
  Calendar,
  ExternalLink,
  AlertCircle,
  Waypoints,
  Check
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { withAuth } from "@/lib/auth";
import { useUser } from "@/hooks/use-user";

export default function SharedRepositoryInfo() {
  const { decodedUserToken, userDetails } = useUser();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const repositoryName = searchParams.get("repositoryName");
  const githubUsername = searchParams.get("githubUsername");

  const { data: repo } = useSuspenseQuery<GitHubRepository>({
    queryKey: ["github", "repos", githubUsername, repositoryName],
    queryFn: withAuth(async () => {
      if (!repositoryName || !githubUsername) {
        throw new Error("Missing repository name or github username");
      }
      const response = await api.get(`/api/v1/github/repos/${githubUsername}/${repositoryName}`);
      return response.data;
    }),
  });

  const { data: repoLocal } = useSuspenseQuery({
    queryKey: ["github", "repos", "local", githubUsername, repositoryName],
    queryFn: withAuth(async () => {
      if (!repositoryName || !githubUsername) {
        throw new Error("Missing repository name or github username");
      }
      const response = await api.get(`/api/v1/github/repos/local/${githubUsername}/${repositoryName}`);
      return response.data;
    }),
  });

  const { mutate: linkRepoHandler, isPending, isSuccess, isError } = useMutation({
    mutationFn: withAuth(async () => {
      if (!decodedUserToken || !repo) {
        throw new Error("Missing user token or repo");
      }
      if (repo.owner.login !== userDetails?.github_username) {
        throw new Error("GitHub username mismatch detected in linkRepo mutation");
      }

      const params = new URLSearchParams();
      params.append("user_id", decodedUserToken.id);
      params.append("repo_name", repo.name);
      params.append("url", repo.html_url);
      devLog("Params:", params);
      const response = await api.post(`/api/v1/github/repos?${params.toString()}`)
      queryClient.invalidateQueries({ queryKey: ["github", "repos"] });
      return response.data;
    }),
    onSuccess: (data) => {
      devLog("Success:", data);
    },
    onError: (error) => {
      logApiError(error);
    },
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-UK", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (!repositoryName || !githubUsername) {
    return (
      <div className="text-destructive flex items-center gap-2">
        <AlertCircle className="w-5 h-5" />
        Error: Missing repository name or github username
      </div>
    );
  }

  const isOwner = repo?.owner?.login === userDetails?.github_username;

  devLog("Repository:", repo);
  devLog("Local Repository:", repoLocal);

  return (
    <div className="flex flex-col max-w-5xl mx-auto w-full border border-border rounded shadow bg-card sm:p-8 p-4 gap-4 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Code2 className="md:size-10 sm:size-8 size-6 text-muted-foreground flex-shrink-0 mt-1" />
        <div className="flex-1 min-w-0">
          <h1 className="md:text-4xl sm:text-2xl text-xl font-bold break-words">{repo.name}</h1>
          <p className="text-muted-foreground mt-1 sm:text-base text-sm">
            {repo.owner.login}/{repo.name}
          </p>
        </div>
        <Link
          href={repo.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 sm:px-4 px-2 py-2 border rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          <span className="hidden sm:block">
            View on GitHub
          </span>
          <ExternalLink className="w-4 h-4" />
        </Link>
      </div>

      {/* Description */}
      {repo.description && (
        <p className="text-lg text-muted-foreground">{repo.description}</p>
      )}

      {/* Share Button (renders only if repo isn't public yet) */}
      {isOwner && !repoLocal && (
        <div className="flex gap-2 items-center">
          <span className="text-muted-foreground text-sm">
            Looking for Contributors?
          </span>
          <button
            onClick={() => linkRepoHandler()}
            className={cn("inline-flex gap-2 items-center text-sm bg-card px-2 py-1.5 rounded border border-border",
              "hover:cursor-pointer hover:bg-accent hover:text-accent-foreground transition duration-200",
              isPending && "pointer-events-none opacity-50",
              isSuccess && "pointer-events-none bg-accent text-accent-foreground",
              isError && "bg-destructive text-destructive-foreground"
            )}
          >
            {isPending ? "Linking..." : "Share Your Project"}
            {isSuccess && <Check className="w-4 h-4" />}
            {isError && <AlertCircle className="w-4 h-4" />}
          </button>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="flex items-center gap-3 p-4 border rounded-lg hover:scale-105 transition-transform duration-200">
          <Star className="w-5 h-5 text-yellow-500" />
          <div>
            <p className="text-2xl font-bold">{repo.stargazers_count}</p>
            <p className="text-sm text-muted-foreground">Stars</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-4 border rounded-lg hover:scale-105 transition-transform duration-200">
          <GitFork className="w-5 h-5 text-blue-500" />
          <div>
            <p className="text-2xl font-bold">{repo.forks_count}</p>
            <p className="text-sm text-muted-foreground">Forks</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-4 border rounded-lg hover:scale-105 transition-transform duration-200">
          <Eye className="w-5 h-5 text-green-500" />
          <div>
            <p className="text-2xl font-bold">{repo.watchers_count}</p>
            <p className="text-sm text-muted-foreground">Watchers</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-4 border rounded-lg hover:scale-105 transition-transform duration-200">
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
              <Waypoints className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Share Status:</span>
              <span className={cn("font-medium capitalize px-1.5 rounded",
                repoLocal
                  ? "bg-secondary text-secondary-foreground"
                  : "bg-destructive text-destructive-foreground")}
              >
                {repoLocal ? "Public" : "Private"}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-3 p-4 border rounded-lg h-fit">
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
