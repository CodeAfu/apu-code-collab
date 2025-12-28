import RepositoryActivity from "./repository-activity";
import SharedRepositoryInfo from "./shared-repository-info";

export default function RepositoryLayout() {
  return (
    <div className="flex flex-col gap-4">
      <SharedRepositoryInfo />
      <RepositoryActivity />
    </div>
  )
}
