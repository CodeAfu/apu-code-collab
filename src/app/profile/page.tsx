import AuthGuard from "@/components/auth/auth-guard";
import MyRepositories from "./_components/my-repositories";
import Skeleton from "@/components/skeleton";
import MyUserDetails from "./_components/my-user-details";

export default function ProfilePage() {
  return (
    <AuthGuard fallback={<AuthGuardFallback />}>
      <main className="w-full max-w-7xl mx-auto px-2">
        <div className="flex flex-col h-fit md:p-16 sm:p-8 p-4 bg-card border border-border my-8">
          <MyUserDetails />
          <MyRepositories />
        </div>
      </main>
    </AuthGuard>
  )
}

function AuthGuardFallback() {
  return (
    <div className="flex flex-col mx-auto gap-2 w-full bg-card shadow max-w-7xl h-fit md:p-16 sm:p-8 p-4 my-8">
      <Skeleton className="w-full max-w-sm h-12 rounded-xl" />
      <Skeleton className="w-full max-w-2xl h-8 rounded-xl" />
      <Skeleton className="w-full max-w-xl h-8 rounded-xl" />
      <Skeleton className="w-full max-w-4xl h-8 rounded-xl mb-4" />

      <Skeleton className="w-full max-w-md h-12 rounded-xl" />
      <Skeleton className="w-full h-8 rounded-xl" />
      <Skeleton className="w-full h-36 rounded-xl" />
      <Skeleton className="w-full h-36 rounded-xl" />
      <Skeleton className="w-full h-36 rounded-xl" />
    </div>
  )

}
