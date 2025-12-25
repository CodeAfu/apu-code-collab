"use client";

import Card from "@/components/card";
import SearchRepository from "./search-repository";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { BackendError } from "@/lib/types";
import { devLog } from "@/lib/utils";
import Skeleton from "@/components/skeleton";

export default function BrowseContents() {
  const { data: repositories, error, isError, isFetching } = useQuery({
    queryKey: ["github", "shared-repos"],
    queryFn: async () => {
      const response = await api.get("/api/v1/github/shared-repos");
      return response.data;
    },
  });

  if (isError) {
    const backendError = error as BackendError;
    const errorMessage = backendError.response?.data?.detail || error.message;
    console.error("Error:", errorMessage);
    return <div className="text-destructive">Error: {errorMessage}</div>;
  }

  if (repositories) {
    devLog("Shared repos:", repositories);
  }

  return (
    <div className="flex flex-col gap-4">
      <SearchRepository />
      {isFetching ? (
        <Card className="flex flex-col gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="w-full h-24 rounded-xl" />
          ))}
        </Card>
      ) : repositories && repositories.length > 0 ? (
        <Card></Card>
      ) : (
        <Card>
          <div className="text-center py-12 text-muted-foreground">
            No repositories found
          </div>
        </Card>
      )}
    </div>
  )
}
