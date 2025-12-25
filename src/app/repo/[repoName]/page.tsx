
interface RepoPageProps {
  params: {
    params: Promise<{ repoName: string }>;
  }
}

export default async function RepoPage({ params }: RepoPageProps) {
  const { repoName } = await params.params;
  return (
    <div className="flex flex-col items-center justify-center">
      <h1>Repo Page</h1>
      <p>{repoName}</p>
    </div>
  )
}
