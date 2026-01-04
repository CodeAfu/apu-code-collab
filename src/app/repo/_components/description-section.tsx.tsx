"use client";

import api from "@/lib/api";
import { withAuth } from "@/lib/auth";
import { devLog, logApiError, cn } from "@/lib/utils";
import { GitHubRepository, GitHubRepositoryLocal } from "@/types/github";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Edit } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

interface RepositoryDescriptionProps {
  isOwner: boolean;
  repoLocal: GitHubRepository;
}

export default function DescriptionSection({ isOwner, repoLocal }: RepositoryDescriptionProps) {
  const queryClient = useQueryClient();
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [editMode, setEditMode] = useState(false);

  const {
    mutate: editDescriptionHandler,
    isPending,
    // isSuccess
    // isError
  } = useMutation({
    mutationFn: withAuth(async () => {
      if (!repoLocal) {
        throw new Error("Attempted to edit description before repo information was loaded");
      }
      const payload = {
        description: textAreaRef.current?.value
      }
      const response = await api.post(`/api/v1/github/repos/${repoLocal.id}/description`, payload)
      return response.data;
    }),
    onSuccess: (data: GitHubRepositoryLocal) => {
      queryClient.invalidateQueries({ queryKey: ["github", "repos"] });
      toast.success("Successfully edited description");
      devLog("Success:", data);
      setEditMode(false);
      if (textAreaRef.current) {
        textAreaRef.current.value = data.description || "";
      }
    },
    onError: (error) => {
      toast.error("Failed to edit description");
      logApiError(error);
      setEditMode(false);
      if (textAreaRef.current) {
        textAreaRef.current.value = repoLocal.description || "";
      }
    },
  })

  return (
    <section className="mb-6" >
      <div className="flex items-center gap-2">
        <h4 className="font-semibold text-md">Description</h4>
        {isOwner && (
          <button
            className="group rounded p-1 hover:cursor-pointer hover:bg-accent/20 transition duration-200"
            onClick={() => setEditMode(!editMode)}
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
        disabled={!editMode || !isOwner}
        className="w-full h-24 rounded-lg border border-border px-2 py-1.5 text-sm text-foreground bg-card mt-4 resize-none
            focus:outline-none focus:ring-1 focus:ring-ring transition duration-200 disabled:bg-muted disabled:text-foreground-subtle"
      />
      <ul className="italic text-muted-foreground text-xs">
        <li>- The project description provided here is not linked to your GitHub repository.</li>
        <li>- This description will be displayed on the project browsing page on this website.</li>
      </ul>
      <div
        className={cn("grid transition-[grid-template-rows] duration-200 ease-out",
          editMode ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}
      >
        <div className="overflow-hidden">
          <div className="flex justify-end items-center gap-2 pt-4">
            <button
              onClick={() => editDescriptionHandler()}
              disabled={isPending || !editMode || !isOwner}
              className="inline-flex items-center gap-2 text-sm px-2 py-1.5 rounded bg-primary text-primary-foreground border border-border 
                disabled:bg-muted disabled:hover:bg-muted disabled:text-muted-foreground disabled:hover:text-muted-foreground disabled:cursor-default
                hover:cursor-pointer hover:bg-primary/80 transition duration-200"
            >
              {isPending ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>
    </section >
  )
}
