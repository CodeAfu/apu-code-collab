"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { BackendError } from "@/lib/types";
import { devLog, jsonLog } from "@/lib/utils";
import Skeleton from "@/components/skeleton";
import { Star, GitFork, Filter } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import Card from "@/components/card";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "motion/react";

// Components
import SearchRepository from "./search-repository";
import RepoFilters from "./filters";

// --- Types ---
interface GitHubItemType {
  db_repo_id: string;
  db_repo_description: string | null;
  db_repo_skills: string[];
  db_owner_id: string;
  db_owner_first_name: string | null;
  db_owner_last_name: string | null;
  db_owner_apu_id: string;
  name: string;
  description: string;
  stargazer_count: number;
  fork_count: number;
  url: string;
  owner: { login: string; avatar_url: string; };
  collaborators: { login: string; avatar_url: string; }[];
}

interface PaginationResponse {
  items: GitHubItemType[];
  next_cursor: string | null;
}

function LoadingSkeleton() {
  return (
    <Card className="p-6">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <Skeleton className="w-10 h-10 rounded-full" />
          <div className="flex flex-col gap-2">
            <Skeleton className="w-32 h-4 rounded" />
            <Skeleton className="w-24 h-3 rounded" />
          </div>
        </div>
        <Skeleton className="w-full h-12 rounded" />
      </div>
    </Card>
  )
}

export default function BrowseContents() {
  const searchParams = useSearchParams();
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Extract params for Query Key to ensure refetch on change
  const search = searchParams.get("search");
  const apuId = searchParams.get("apu_id");
  const githubUsername = searchParams.get("github_username");
  const skills = searchParams.getAll("skills");

  const {
    data,
    error,
    isError,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage
  } = useInfiniteQuery<PaginationResponse>({
    queryKey: ["github", "repos", { search, apuId, githubUsername, skills }],
    queryFn: async ({ pageParam }) => {
      const params = new URLSearchParams();
      params.set("size", "10"); // Increased page size

      if (pageParam) params.set("cursor", pageParam as string);
      if (search) params.set("search", search);
      if (apuId) params.set("apu_id", apuId);
      if (githubUsername) params.set("github_username", githubUsername);
      skills.forEach(s => params.append("skills", s));

      const response = await api.get(`/api/v1/github/repos?${params.toString()}`);
      return response.data;
    },
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.next_cursor ?? undefined,
  });

  if (isError) {
    const backendError = error as BackendError;
    const errorData = backendError.response?.data?.detail;

    let errorMessage = error.message;

    if (errorData) {
      if (typeof errorData === "string") {
        errorMessage = errorData;
      } else if (typeof errorData === "object" && "message" in errorData) {
        errorMessage = (errorData as any).message;
      } else {
        errorMessage = JSON.stringify(errorData);
      }
    }

    return (
      <div className="p-4 border border-destructive/50 bg-destructive/10 rounded-lg text-destructive">
        <p className="font-semibold">Error loading repositories</p>
        <p className="text-sm opacity-90">{errorMessage}</p>
      </div>
    );
  }

  const isEmpty = !data?.pages[0]?.items.length;
  const activeFiltersCount = (skills.length > 0 ? 1 : 0) + (apuId ? 1 : 0) + (githubUsername ? 1 : 0);

  return (
    <div className="grid lg:grid-cols-[clamp(250px,20vw,300px)_1fr] gap-x-6 items-start">

      {/* --- LEFT SIDEBAR (Desktop Only) --- */}
      <div className="hidden lg:block border border-border bg-card rounded-lg p-4 h-fit sticky top-4">
        <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
          <Filter className="w-4 h-4" /> Filters
        </h2>
        <RepoFilters />
      </div>

      {/* --- RIGHT COLUMN (Main Content) --- */}
      <div className="flex flex-col gap-6">

        {/* Search Bar Area */}
        <div className="flex flex-col gap-2">
          <SearchRepository
            mobileTrigger={
              // This button only shows on LG screens or smaller due to css logic, 
              // but we control visibility via 'lg:hidden' class here
              <Button
                variant={showMobileFilters || activeFiltersCount > 0 ? "secondary" : "outline"}
                size="icon"
                onClick={() => setShowMobileFilters(!showMobileFilters)}
                className="lg:hidden shrink-0 h-10 w-10 md:h-12 md:w-12"
              >
                <Filter className="w-4 h-4" />
                {activeFiltersCount > 0 && (
                  <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-primary rounded-full border-2 border-background" />
                )}
              </Button>
            }
          />

          {/* Mobile Filter Dropdown (Collapsible) */}
          <AnimatePresence>
            {showMobileFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="lg:hidden overflow-hidden"
              >
                <div className="border border-border bg-card rounded-lg p-4 mt-2">
                  <RepoFilters />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Results List */}
        <div className="flex flex-col gap-4">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => <LoadingSkeleton key={i} />)
          ) : isEmpty ? (
            <Card className="p-12 border border-border text-center text-muted-foreground animate-in fade-in duration-500">
              No repositories found matching your criteria.
            </Card>
          ) : (
            <>
              {data?.pages.map((page, pageIndex) => (
                <React.Fragment key={pageIndex}>
                  {page.items.map((repo) => (
                    <RepoItem key={repo.db_repo_id} repo={repo} />
                  ))}
                </React.Fragment>
              ))}

              <div className="flex justify-center pt-4 pb-8">
                {isFetchingNextPage ? (
                  <div className="flex flex-col items-center gap-2 text-muted-foreground text-sm">
                    <Skeleton className="w-8 h-8 rounded-full" />
                    <span>Loading more...</span>
                  </div>
                ) : hasNextPage ? (
                  <Button variant="ghost" onClick={() => fetchNextPage()}>
                    Load more repositories
                  </Button>
                ) : (
                  <p className="text-xs text-muted-foreground opacity-50">You have reached the end.</p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function RepoItem({ repo }: { repo: GitHubItemType }) {
  return (
    <Link
      href={`/repo?githubUsername=${repo.owner.login}&repositoryName=${repo.name}`}
      className="block group"
    >
      <Card className="p-0 border border-border shadow transition-colors animate-in fade-in duration-500">
        <div className="p-6 rounded-lg group-hover:ring-1 group-hover:ring-foreground/30 group-hover:bg-popover/50 transition duration-200">
          <div className="flex flex-col gap-3">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={repo.owner.avatar_url}
                  alt={repo.owner.login}
                  className="w-10 h-10 text-xs rounded-full border border-border"
                />
                <div className="min-w-0">
                  <h3 className="font-semibold text-lg transition truncate pr-2">
                    {repo.name}
                  </h3>
                  <div className="text-xs text-muted-foreground flex items-center gap-2 flex-wrap">
                    <span>by {repo.db_owner_first_name || repo.db_owner_last_name ? `${repo.db_owner_first_name} ${repo.db_owner_last_name}` : repo.owner.login}</span>
                    <span className="hidden sm:inline">|</span>
                    <span className="font-mono px-1 rounded">{repo.db_owner_apu_id}</span>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-3 text-sm text-muted-foreground shrink-0 px-2 py-1 rounded-md">
                <span className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500" /> {repo.stargazer_count}
                </span>
                <span className="flex items-center gap-1">
                  <GitFork className="w-4 h-4 text-blue-500" /> {repo.fork_count}
                </span>
              </div>
            </div>

            {/* Description */}
            <p className="text-muted-foreground line-clamp-2 text-sm">
              {repo.description || "No description provided."}
            </p>

            {/* Skills */}
            {repo.db_repo_skills.length > 0 && (
              <div className="mt-2 pt-3 border-t border-border/50 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                {repo.db_repo_skills.slice(0, 8).map((skill, index) => (
                  <div key={index} className="border border-border bg-background px-2 py-0.5 rounded-full text-xs">
                    {skill}
                  </div>
                ))}
                {repo.db_repo_skills.length > 8 && <span>+{repo.db_repo_skills.length - 8} more</span>}
              </div>
            )}
          </div>
        </div>
      </Card>
    </Link>
  )
}
