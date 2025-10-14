import { Button } from "@/components/ui/button";
import { Link as LinkIcon } from "lucide-react";
import React from "react";
import Link from "next/link";

export default function ConnectGithub() {
  return (
    <div className="w-full max-w-xs sm:max-w-xl md:max-w-2xl bg-card text-card-foreground px-8 sm:px-16 py-12 shadow-lg rounded-lg">
      <h1 className="text-2xl sm:text-4xl font-bold mb-3 sm:mb-4">
        Connect to GitHub
      </h1>
      <p className="text-muted-foreground text-xs sm:text-base font-light mb-2">
        Connect your GitHub account to start collaborating with other student
        developers. By linking your account, you&apos;ll be able to:
      </p>
      <ul className="text-muted-foreground ml-4 list-disc list-inside mb-6 sm:mb-8 text-xs sm:text-base font-light">
        <li>Share repositories</li>
        <li>Contribute to group projects</li>
        <li>Showcase your work</li>
      </ul>
      <Button
        asChild
        variant="default"
        size="lg"
        className="w-full sm:h-12 sm:text-lg text-base rounded flex items-center justify-center gap-2"
      >
        <Link href="#">
          <LinkIcon className="h-4 w-4 sm:h-5 sm:w-5" />
          Connect to GitHub
        </Link>
      </Button>
    </div>
  );
}
