import React from "react";
import ConnectGitHubButton from "./connect-github.button";

export default function ConnectGithub() {
  return (
    <div className="w-full max-w-xs sm:max-w-xl md:max-w-2xl bg-card text-card-foreground px-8 sm:px-16 py-12 shadow-lg rounded-lg">
      <h1 className="text-2xl sm:text-4xl font-bold mb-3 sm:mb-4">
        Connect to GitHub
      </h1>
      <p className="text-muted-foreground text-xs sm:text-base font-light mb-2">
        Dear Student! Connect your GitHub account to start collaborating with other student
        developers. By linking your account, you&apos;ll be able to:
      </p>
      <ul className="text-muted-foreground ml-4 list-disc list-inside mb-6 sm:mb-8 text-xs sm:text-base font-light">
        <li>Share repositories</li>
        <li>Contribute to group projects</li>
        <li>Showcase your work</li>
      </ul>
      <ConnectGitHubButton />
    </div>
  );
}
