import Skeleton from "@/components/skeleton";
import Tabs from "./components/tabs";
import AuthGuard from "@/components/auth/auth-guard";

function Fallback() {
  return (
    <div className="grid min-h-screen grid-cols-[14rem_1fr]">
      <aside className="bg-card shadow pt-8 px-4 border-r border-border">
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full rounded-md opacity-70" />
          ))}
        </div>
      </aside>

      <main className="p-2 space-y-8 w-full max-w-7xl mx-auto py-8">
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>

        <div className="space-y-4 pt-4">
          <Skeleton className="h-12 w-full mb-4" />
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </main>
    </div>
  );
}

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <AuthGuard allowedRoles={["admin"]} fallback={<Fallback />}>
      <div className="grid grid-cols-[14rem_1fr]">
        <aside className="bg-card shadow pt-8">
          <Tabs />
        </aside>
        <main>
          {children}
        </main>
      </div>
    </AuthGuard>
  );
}


