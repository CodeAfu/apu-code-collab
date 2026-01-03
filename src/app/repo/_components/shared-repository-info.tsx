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
  Check,
  Edit,
  Plus
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { withAuth } from "@/lib/auth";
import { useUser } from "@/hooks/use-user";
import { useRef, useState } from "react";
import { toast } from "sonner";
import React from "react";
import SkillsModal from "./skills-modal";
import { SkillItem } from "../types";

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-UK", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export default function SharedRepositoryInfo() {
  const { decodedUserToken, userDetails } = useUser();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const repositoryName = searchParams.get("repositoryName");
  const githubUsername = searchParams.get("githubUsername");

  const [skills, setSkills] = useState<SkillItem[]>([{ id: "init-1", value: "" }]);
  const [isSkillsModalOpen, setIsSkillsModalOpen] = useState(false);

  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [editDescriptionMode, setEditDescriptionMode] = useState(false);

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

  const {
    mutate: linkRepoHandler,
    isPending: isRepoLinkPending,
    isSuccess: isRepoLinkSuccess,
    isError: isRepoLinkError
  } = useMutation({
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

  const {
    mutate: editDescriptionHandler,
    isPending: isEditDescriptionPending,
    // isSuccess: isEditDescriptionSuccess,
    // isError: isEditDescriptionError
  } = useMutation({
    mutationFn: withAuth(async () => {
      if (!decodedUserToken) {
        throw new Error("Missing user token or repo");
      }
      if (!repoLocal) {
        throw new Error("Attempted to edit description before repo information was loaded");
      }
      const payload = {
        description: textAreaRef.current?.value
      }
      const response = await api.put(`/api/v1/github/repos/${repoLocal.id}`, payload)
      return response.data;
    }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["github", "repos"] });
      toast.success("Successfully edited description");
      devLog("Success:", data);
      setEditDescriptionMode(false);
    },
    onError: (error) => {
      toast.error("Failed to edit description");
      logApiError(error);
      setEditDescriptionMode(false);
    },
  })

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
    <React.Fragment>

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
                isRepoLinkPending && "pointer-events-none opacity-50",
                isRepoLinkSuccess && "pointer-events-none bg-accent text-accent-foreground",
                isRepoLinkError && "bg-destructive text-destructive-foreground"
              )}
            >
              {isRepoLinkPending ? "Linking..." : "Share Your Project"}
              {isRepoLinkSuccess && <Check className="w-4 h-4" />}
              {isRepoLinkError && <AlertCircle className="w-4 h-4" />}
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

        <div className="p-4 border rounded-lg transition-all duration-200">

          {isOwner && (
            <div className="mb-6">
              <h2 className="font-semibold text-lg">Looking for Contributors?</h2>
              <p className="text-sm text-muted-foreground">
                Share information about your project and find your best-fit collaborators!
              </p>
            </div>
          )}

          <section className="mb-6">
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-md">Description</h4>
              {isOwner && (
                <button
                  className="group rounded p-1 hover:cursor-pointer hover:bg-accent/20 transition duration-200"
                  onClick={() => setEditDescriptionMode(!editDescriptionMode)}
                >
                  <Edit className="w-4 h-4" />
                </button>
              )}
            </div>
            <p className="text-sm text-muted-foreground">Provide information to broadcast with potential collaborators about your project.</p>
            <textarea
              ref={textAreaRef}
              placeholder="Add a description..."
              defaultValue={repoLocal.description || ""}
              disabled={!editDescriptionMode}
              className="w-full h-24 rounded-lg border border-border px-2 py-1.5 text-sm text-foreground bg-card mt-4 resize-none
            focus:outline-none focus:ring-1 focus:ring-ring transition duration-200 disabled:bg-muted"
            />
            <ul className="italic text-muted-foreground text-xs">
              <li>- The project description provided here is not linked to your GitHub repository.</li>
              <li>- This description will be displayed on the project browsing page on this website.</li>
            </ul>
            <div
              className={cn("grid transition-[grid-template-rows] duration-200 ease-out",
                editDescriptionMode ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}
            >
              <div className="overflow-hidden">
                <div className="flex justify-end items-center gap-2 pt-4">
                  <button
                    onClick={() => editDescriptionHandler()}
                    disabled={isEditDescriptionPending || !editDescriptionMode || !isOwner}
                    className="inline-flex items-center gap-2 text-sm px-2 py-1.5 rounded bg-primary text-primary-foreground border border-border
            hover:cursor-pointer hover:bg-primary/80 transition duration-200"
                  >
                    {isEditDescriptionPending ? "Saving..." : "Save"}
                  </button>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h4 className="font-semibold text-md">Skills</h4>
            <p className="text-sm text-muted-foreground mb-2">
              Recommended skills for collaborators.
            </p>
            <div className="flex flex-wrap gap-2">
              {repoLocal.skills.map((skill: string, index: number) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="inline-flex items-center justify-center whitespace-nowrap text-sm border border-primary bg-primary/20 rounded-full shadow text-primary">{skill}</span>
                </div>
              ))}
              {isOwner && (
                <button
                  onClick={() => setIsSkillsModalOpen(true)}
                  className="size-6 inline-flex items-center justify-center border border-foreground text-foreground rounded shadow
                    hover:cursor-pointer hover:border-primary hover:text-primary hover:bg-primary/20 hover:scale-105 transition duration-200"
                >
                  <Plus className="w-4 h-4" />
                </button>
              )}
            </div>
          </section>
        </div >
      </div>

      <SkillsModal skills={skills} setSkills={setSkills} isSkillsModalOpen={isSkillsModalOpen} setIsSkillsModalOpen={setIsSkillsModalOpen} />
    </React.Fragment >
  );
}
