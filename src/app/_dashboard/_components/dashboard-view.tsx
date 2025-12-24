"use client";

import Card from "@/components/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Github, Book, GitFork, Terminal, Layout, Star } from "lucide-react";
import Link from "next/link";

export default function DashboardView({ user }: { user: any }) {
  const isLinked = user?.is_github_linked;

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Welcome back, {user?.first_name}</h2>
          <p className="text-muted-foreground">Here is what's happening with your projects today.</p>
        </div>
        {!isLinked && (
          <Link href="/connect-github">
            <Button variant="default" className="shadow-md">
              <Github className="mr-2 h-4 w-4" /> Link GitHub Account
            </Button>
          </Link>
        )}
      </div>

      {/* Metrics Grid - Cleaner, simpler cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Repos"
          value={isLinked ? "12" : "-"}
          icon={<Book className="h-4 w-4 text-muted-foreground" />}
          description="Projects imported"
        />
        <StatsCard
          title="Contributions"
          value={isLinked ? "342" : "-"}
          icon={<GitFork className="h-4 w-4 text-muted-foreground" />}
          description="Commits this year"
        />
        <StatsCard
          title="Top Language"
          value={isLinked ? "TypeScript" : "-"}
          icon={<Terminal className="h-4 w-4 text-muted-foreground" />}
          description="Most used stack"
        />
        <StatsCard
          title="Profile Views"
          value="24"
          icon={<Layout className="h-4 w-4 text-muted-foreground" />}
          description="+12% from last week"
        />
      </div>

      {/* Main Content Area */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">

        {/* Repository List (Takes up 4 columns) */}
        <Card className="col-span-4 border-none shadow-md bg-card/50">
          <CardHeader>
            <CardTitle>Recent Repositories</CardTitle>
            <CardDescription>
              Your active GitHub projects.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!isLinked ? (
              <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground border-2 border-dashed rounded-lg">
                <Github className="h-10 w-10 mb-3 opacity-20" />
                <p>Link GitHub to see your repos here.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Mock Data for now - we will hook this up to your API next */}
                <RepoItem name="apu-code-collab-api" lang="Python" stars={3} updated="2 hours ago" />
                <RepoItem name="rent-ez-frontend" lang="TypeScript" stars={12} updated="5 hours ago" />
                <RepoItem name="data-structures-assignment" lang="Java" stars={0} updated="2 days ago" />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Sidebar / Suggestions (Takes up 3 columns) */}
        <Card className="col-span-3 border-none shadow-md">
          <CardHeader>
            <CardTitle>Recommended Peers</CardTitle>
            <CardDescription>Students working on similar tech.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <PeerItem name="Sarah Chen" major="Software Engineering" stack={["React", "Go"]} />
            <PeerItem name="Jason Lee" major="Data Analytics" stack={["Python", "R"]} />
            <PeerItem name="Amirul" major="Cyber Security" stack={["C++", "Rust"]} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// --- MICRO COMPONENTS (Styling these specifically to look good) ---
function StatsCard({ title, value, icon, description }: any) {
  return (
    <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}

function RepoItem({ name, lang, stars, updated }: any) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors cursor-pointer">
      <div className="space-y-1">
        <div className="font-semibold flex items-center gap-2">
          {name}
          <Badge variant="secondary" className="text-[10px] h-5 px-1.5 font-normal">{lang}</Badge>
        </div>
        <div className="text-xs text-muted-foreground">Updated {updated}</div>
      </div>
      <div className="flex items-center text-muted-foreground text-xs gap-1">
        <Star className="h-3 w-3" /> {stars}
      </div>
    </div>
  )
}

function PeerItem({ name, major, stack }: any) {
  return (
    <div className="flex items-start justify-between">
      <div className="space-y-1">
        <p className="text-sm font-medium leading-none">{name}</p>
        <p className="text-xs text-muted-foreground">{major}</p>
      </div>
      <div className="flex gap-1">
        {stack.map((s: string) => (
          <Badge key={s} variant="outline" className="text-[10px] px-1 py-0 h-5">{s}</Badge>
        ))}
      </div>
    </div>
  )
}
