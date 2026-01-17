"use client";

import api from "@/lib/api";
import { devLog, logApiError } from "@/lib/utils";
import { GitHubRepositoriesResponse } from "@/types/github";
import { useQuery } from "@tanstack/react-query";
import RepositoryCard from "./repository-card";
import Skeleton from "@/components/skeleton";
import { BackendError } from "@/lib/types";

export default function MyRepositories() {
  const { data: repositories, error, isError, isFetching } = useQuery<GitHubRepositoriesResponse>({
    queryKey: ["users", "me", "github", "repos"],
    queryFn: async () => {
      const response = await api.get("/api/v1/users/me/github/repos");
      return response.data;
    },
    staleTime: 1000 * 60 * 60,
  })

  if (isError) {
    logApiError(error);
    const backendError = error as BackendError;
    const errorMessage = backendError.response?.data?.detail || error.message;
    <div className="text-destructive">Error: {errorMessage}</div>
  }

  if (repositories) {
    devLog("User repos:", repositories.items);
  }

  return (
    <div className="w-full animate-in fade-in duration-500">
      <h1 className="text-2xl font-bold mt-8">GitHub Repositories</h1>
      <p className="text-muted-foreground mb-4">Your repositories are only made public to the website if you are looking for collaborators on that project.</p>
      {isFetching ? (
        <div className="flex flex-col gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="w-full h-36 rounded-xl" />
          ))}
        </div>
      ) : repositories && repositories.items.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {repositories.items.map((repo) => (
            <RepositoryCard key={repo.id} repository={repo} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          No repositories found
        </div>
      )}
    </div>
  );
}

