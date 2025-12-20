import Card from "@/components/card";
import ConnectGitHubButton from "./connect-github-button";

export default function ConnectGithub() {
  return (
    <Card className="w-full max-w-xs sm:max-w-xl md:max-w-2xl py-12">
      <h1 className="text-2xl sm:text-4xl font-bold mb-3 sm:mb-4">
        Connect to GitHub
      </h1>
      <p className="text-muted-foreground text-xs sm:text-base mb-2">
        Connect your GitHub account to start collaborating with other student
        developers. By linking your account, you&apos;ll be able to:
      </p>
      <ul className="text-muted-foreground ml-4 list-disc list-inside mb-6 sm:mb-8 text-xs sm:text-base">
        <li>Share repositories</li>
        <li>Contribute to group projects</li>
        <li>Showcase your work</li>
      </ul>
      <ConnectGitHubButton />
    </Card>
  );
}
