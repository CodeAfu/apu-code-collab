"use client";

import Card from "@/components/card";
import SearchRepository from "./search-repository";
import { useInfiniteQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { BackendError } from "@/lib/types";
import { devLog } from "@/lib/utils";
import Skeleton from "@/components/skeleton";
import { GitHubRepository } from "@/types/github";
import { Link, Star, GitFork, User } from "lucide-react";
import React from "react";
// import { useSearchParams } from "next/navigation";

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

interface PaginationResponse {
  items: GitHubRepository[];
  next_cursor: string | null;
}

export default function BrowseContents() {
  // const searchParams = useSearchParams();

  const { data, error, isError, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage, } = useInfiniteQuery<PaginationResponse>({
    queryKey: ["github", "repos"],
    queryFn: async ({ pageParam }) => {
      const searchParams = new URLSearchParams();
      searchParams.set("size", "5");
      if (pageParam) searchParams.set("cursor", pageParam as string);
      const response = await api.get(`/api/v1/github/repos?${searchParams.toString()}`);
      return response.data;
    },
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.next_cursor ?? undefined,
  });

  if (isError) {
    const backendError = error as BackendError;
    const errorMessage = backendError.response?.data?.detail || error.message;
    console.error("Error:", errorMessage);
    return <div className="text-destructive">Error: {errorMessage}</div>;
  }

  if (data) {
    devLog("Shared repos:", data);
  }

  const isEmpty = !data?.pages[0]?.items.length;

  return (
    <div className="flex flex-col gap-6">
      <SearchRepository />

      <div className="flex flex-col gap-4">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <LoadingSkeleton key={i} />
          ))
        ) : isEmpty ? (
          <Card className="p-12 text-center text-muted-foreground">
            No repositories found. Why not share one?
          </Card>
        ) : (
          <>
            {data?.pages.map((page, pageIndex) => (
              <React.Fragment key={pageIndex}>
                {page.items.map((repo) => (
                  <Link
                    key={repo.id}
                    // Link to the details page we made earlier
                    href={`/repo?githubUsername=${repo.owner.login}&repositoryName=${repo.name}`}
                    className="block group"
                  >
                    <Card className="p-6 transition-colors hover:border-primary/50">
                      <div className="flex flex-col gap-3">
                        {/* Header: Owner & Name */}
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            {/* Github Avatar */}
                            <img
                              src={repo.owner.avatar_url}
                              alt={repo.owner.login}
                              className="w-8 h-8 rounded-full border border-border"
                            />
                            <div>
                              <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                                {repo.name}
                              </h3>
                              <p className="text-xs text-muted-foreground">
                                by {repo.owner.login}
                              </p>
                            </div>
                          </div>

                          {/* Badges / Stats */}
                          <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Star className="w-4 h-4" /> {repo.stargazers_count}
                            </span>
                            <span className="flex items-center gap-1">
                              <GitFork className="w-4 h-4" /> {repo.forks_count}
                            </span>
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-muted-foreground line-clamp-2 text-sm">
                          {repo.description || "No description provided."}
                        </p>

                        {/* Footer: Who shared it */}
                        <div className="mt-2 pt-3 border-t border-border/50 flex items-center gap-2 text-xs text-muted-foreground">
                          <User className="w-3 h-3" />
                          <span>Shared by {repo.owner.login}</span>
                        </div>
                      </div>
                    </Card>
                  </Link>
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
                <button
                  onClick={() => fetchNextPage()}
                  className="text-sm text-primary hover:underline disabled:opacity-50"
                  disabled={isFetchingNextPage}
                >
                  Load more repositories
                </button>
              ) : (
                <p className="text-xs text-muted-foreground">You have reached the end.</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
