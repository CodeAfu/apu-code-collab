"use client";

import api from "@/lib/api";
import { devLog, jsonLog, logApiError } from "@/lib/utils";
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
    jsonLog(repositories.items[0]);
  }

  return (
    <div className="w-full">
      {isFetching ? (
        <Skeleton className="w-xl h-8 rounded-xl" />
      ) : repositories && repositories.items.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {repositories.items.map((repo) => (
            <RepositoryCard key={repo.id} repository={repo} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          No repositories found
        </div>
      )}
    </div>
  );
}
