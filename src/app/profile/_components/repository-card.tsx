import { GitHubRepository } from "@/types/github";
import { Code2, ExternalLink, Star, GitFork, Users, Calendar } from "lucide-react";
import { motion } from "motion/react";

interface RepositoryCardProps {
  repository: GitHubRepository;
}

export default function RepositoryCard({ repository }: RepositoryCardProps) {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="border border-border rounded-lg p-5 hover:border-blue-400 hover:shadow-md transition-all duration-200 bg-popover animate-in fade-in duration-500">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <Code2 className="w-5 h-5 text-muted-foreground flex-shrink-0" />
          <a
            href={`/repo?repositoryName=${repository.name}&githubUsername=${repository.owner.login}`}
            className="text-lg inline-flex items-center gap-2 font-semibold popover-foreground group group-hover:text-accent hover:text-accent hover:underline truncate transition duration-200"
          >
            {repository.name}
          </a>
          <motion.a
            whileHover={{ scale: 1.2 }}
            transition={{
              duration: 0.2,
              type: "spring",
            }}
            href={repository.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="group group-hover:text-accent transition duration-200"
          >
            <ExternalLink className="w-4 h-4 text-muted-foreground flex-shrink-0 group-hover:text-accent transition duration-200" />
          </motion.a>
        </div>
        {repository.private && (
          <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full flex-shrink-0 ml-2">
            Private
          </span>
        )}
      </div>

      {
        repository.description && (
          <p className="text-foreground-subtle text-sm mb-4 line-clamp-2">
            {repository.description}
          </p>
        )
      }

      <div className="flex flex-wrap items-center gap-4 text-sm text-foreground-subtle mb-4">
        {repository.language && (
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-blue-500"></span>
            <span>{repository.language}</span>
          </div>
        )}

        <div className="flex items-center gap-1">
          <Star className="w-4 h-4" />
          <span>{repository.stargazers_count}</span>
        </div>

        <div className="flex items-center gap-1">
          <GitFork className="w-4 h-4" />
          <span>{repository.forks_count}</span>
        </div>

        {repository.open_issues_count > 0 && (
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{repository.open_issues_count} issues</span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between text-xs text-foreground-subtle pt-3 border-t border-muted-foreground/20">
        <div className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          <span>Updated {formatDate(repository.updated_at)}</span>
        </div>
        {repository.topics && repository.topics.length > 0 && (
          <div className="flex gap-1 flex-wrap justify-end">
            {repository.topics.slice(0, 3).map((topic) => (
              <span
                key={topic}
                className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs"
              >
                {topic}
              </span>
            ))}
          </div>
        )}
      </div>
    </div >
  );
}
