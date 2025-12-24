import AuthGuard from "@/components/auth/auth-guard";
import MyRepositories from "./_components/my-repositories";
import Skeleton from "@/components/skeleton";

export default function ProfilePage() {
  return (
    <AuthGuard fallback={<AuthGuardFallback />}>
      <main className="w-full max-w-7xl mx-auto px-2">
        <div className="flex flex-col h-fit md:p-16 sm:p-8 p-4 bg-card border border-border my-8">
          <h1 className="text-2xl font-bold">Profile</h1>

          <h1 className="text-2xl font-bold mt-8 mb-4">GitHub Repositories</h1>
          <MyRepositories />
        </div>
      </main>
    </AuthGuard>
  )
}

function AuthGuardFallback() {
  return (
    <div className="flex flex-col mx-auto gap-2 w-full max-w-7xl h-full my-8">
      <Skeleton className="w-4xl h-8 rounded-xl" />
      <Skeleton className="w-full h-64 rounded-xl " />

      <Skeleton className="w-4xl h-8 rounded-xl" />
      <Skeleton className="w-full h-64 rounded-xl" />
    </div>
  )

}
