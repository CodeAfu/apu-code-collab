"use client";

import { Button } from "@/components/ui/button";
import { Link as LinkIcon } from "lucide-react";

export default function ConnectGitHubButton() {
  const handleConnect = () => {
    const clientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
    const redirectUri = "http://localhost:3000/auth/github/callback";
    // Scope 'repo' is required to read private repositories, 'public_repo' for public only
    const scope = "read:user repo";
    const githubUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;

    window.location.href = githubUrl;
  };
  return (
    <Button
      onClick={handleConnect}
      variant="default"
      size="lg"
      className="w-full sm:h-12 sm:text-lg text-base rounded flex items-center justify-center gap-2"
    >
      <LinkIcon className="h-4 w-4 sm:h-5 sm:w-5" />
      Connect GitHub
    </Button>
  );
}
