"use client";

import { Button } from "@/components/ui/button";
import { useGithubLogin } from "@/hooks/use-github-auth";
import { Link as LinkIcon } from "lucide-react";

export default function ConnectGitHubButton() {
  const { mutate: githubLogin } = useGithubLogin();
  return (
    <Button
      onClick={() => githubLogin()}
      variant="default"
      size="lg"
      className="w-full sm:h-12 sm:text-lg text-base rounded flex items-center justify-center gap-2"
    >
      <LinkIcon className="h-4 w-4 sm:h-5 sm:w-5" />
      Connect to GitHub
    </Button>
  );
}
