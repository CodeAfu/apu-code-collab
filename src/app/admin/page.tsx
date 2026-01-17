"use client";

import Link from "next/link";
import { Users, BookOpen, Code2, Layers, ArrowRight, Activity } from "lucide-react";
import { cn, devLog } from "@/lib/utils";
import { useUser } from "@/hooks/use-user";
import Skeleton from "@/components/skeleton";
import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export default function AdminPage() {
  const { userDetails } = useUser();

  const { isLoading: isHealthCheckLoading, isSuccess: isHealthCheckSuccess, isError: isHealthCheckError } = useQuery({
    queryKey: ["health"],
    queryFn: async () => (await api.get("/health")).data,
  });

  const { data: userCount, isLoading: isUserCountLoading, isError: isUserCountError } = useQuery({
    queryKey: ["users", "count"],
    queryFn: async () => (await api.get("/api/v1/users/count")).data,
    enabled: !!userDetails,
  });

  const { data: coursesCount, isLoading: isCoursesCountLoading, isError: isCoursesCountError } = useQuery({
    queryKey: ["university_courses", "count"],
    queryFn: async () => (await api.get("/api/v1/university_courses/count")).data,
    enabled: !!userDetails,
  });

  if (!userDetails) return <FallbackSkeleton />;

  devLog("User Count:", userCount);

  const displayName = `${userDetails.first_name} ${userDetails.last_name}` || userDetails.email;

  return (
    <main className="p-8 space-y-8 w-full max-w-7xl mx-auto animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {displayName}! here's a quick overview of the platform.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <StatCard
          title="Total Users"
          value={userCount}
          isLoading={isUserCountLoading}
          icon={Users}
          description="Total users in the platform"
          className={cn(isUserCountError && "text-red-500")}
        />
        <StatCard
          title="Active Courses"
          value={coursesCount}
          isLoading={isCoursesCountLoading}
          icon={BookOpen}
          description="Total courses in the platform"
          className={cn(isCoursesCountError && "text-red-500")}
        />
        <StatCard
          title="System Status"
          value={isHealthCheckSuccess ? "Healthy" : "Unhealthy"}
          isLoading={isHealthCheckLoading} icon={Activity}
          description="All systems operational"
          className={cn(
            isHealthCheckSuccess && "text-emerald-600",
            isHealthCheckError && "text-red-500"
          )}
        />
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight">Manage Platform</h2>
        <div className="grid gap-4 lg:grid-cols-4">
          <DashboardAction
            href="/admin/users"
            title="Users"
            icon={Users}
            description="Manage roles, bans, and permissions."
          />
          <DashboardAction
            href="/admin/courses"
            title="Courses"
            icon={BookOpen}
            description="Review and publish course content."
          />
          <DashboardAction
            href="/admin/programming-languages"
            title="Languages"
            icon={Code2}
            description="Update supported programming languages."
          />
          <DashboardAction
            href="/admin/frameworks"
            title="Frameworks"
            icon={Layers}
            description="Manage framework dependencies and tags."
          />
        </div>
      </div>
    </main>
  );
}

function StatCard({
  title,
  value,
  icon: Icon,
  description,
  className,
  isLoading
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  description?: string;
  className?: string;
  isLoading?: boolean;
}) {
  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 flex flex-col justify-between space-y-2">
      <div className="flex flex-row items-center justify-between space-y-0 pb-2">
        <span className="text-sm font-medium tracking-wide text-muted-foreground">
          {title}
        </span>
        <Icon className={cn("h-4 w-4 text-muted-foreground", className)} />
      </div>
      <div>
        {isLoading ? (
          <Skeleton className="h-8 w-24 mb-1" />
        ) : (
          <div className={cn("text-2xl font-bold animate-in fade-in duration-500", className)}>{value}</div>
        )}

        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </div>
    </div>
  );
}

function DashboardAction({
  href,
  title,
  icon: Icon,
  description
}: {
  href: string;
  title: string;
  icon: React.ElementType;
  description: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group relative flex flex-col justify-between overflow-hidden rounded-xl border bg-popover/90 p-6 shadow-sm",
        "transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-primary/50"
      )}
    >
      <div className="space-y-3">
        <div className="w-fit rounded-lg bg-primary/10 p-3 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <h3 className="font-semibold leading-none tracking-tight">{title}</h3>
          <p className="text-sm text-muted-foreground mt-2">{description}</p>
        </div>
      </div>

      <div className={cn(
        "absolute top-6 right-6 transition-all duration-300",
        "opacity-20 -translate-x-2",
        "group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-primary"
      )}>
        <ArrowRight className="h-5 w-5" />
      </div>
    </Link>
  );
}

function FallbackSkeleton() {
  return (
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
  )
}
