"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import Link from "next/link";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend
} from "recharts";
import {
  GitFork, Star, AlertCircle, Book,
  Users, Globe, FileCode
} from "lucide-react";
import { GitHubLogoIcon as Github } from "@radix-ui/react-icons";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Skeleton from "@/components/skeleton";
import { useUser } from "@/hooks/use-user";

interface KPIStats {
  platform_stars?: number;
  platform_forks?: number;
  platform_repos?: number;
  platform_issues?: number;
  total_stars?: number;
  total_forks?: number;
  total_issues?: number;
  total_repos?: number;
  total_subscribers?: number;
}

interface ChartData {
  languages: { name: string; value: number }[];
  top_repos: { name: string; stars: number; forks: number; issues: number }[];
}

interface GlobalStatsResponse {
  kpi: KPIStats;
  top_languages: { name: string; count: number }[];
}

interface UserStatsResponse {
  kpi: KPIStats;
  charts: ChartData;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export default function DashboardPage() {
  const { userDetails } = useUser();
  const isLinked = userDetails?.is_github_linked;

  const { data: userStats, isLoading: isUserLoading } = useQuery<UserStatsResponse>({
    queryKey: ["dashboard", "user-stats"],
    queryFn: async () => (await api.get("/api/v1/github/dashboard-stats")).data,
    enabled: !!isLinked,
  });

  const { data: globalStats, isLoading: isGlobalLoading } = useQuery<GlobalStatsResponse>({
    queryKey: ["dashboard", "global-stats"],
    queryFn: async () => (await api.get("/api/v1/github/global-dashboard-stats")).data,
  });

  if (!userDetails) return <DashboardSkeleton />;

  return (
    <section className="container mx-auto py-8 px-2 sm:pb-16 space-y-8 max-w-7xl animate-in fade-in duration-500">

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Overview of your development activity and community impact.
          </p>
        </div>
        {!isLinked && (
          <Link href="/settings">
            <Button variant="default" className="shadow-md">
              <Github className="mr-2 h-4 w-4" /> Link GitHub Account
            </Button>
          </Link>
        )}
      </div>

      {/* --- SECTION 1: PERSONAL STATS --- */}
      {isLinked ? (
        isUserLoading ? <DashboardSkeleton /> : (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" /> Your Impact
            </h3>

            {/* KPI Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <StatsCard
                title="Total Stars"
                value={userStats?.kpi.total_stars || 0}
                icon={<Star className="h-4 w-4 text-yellow-500" />}
                description="Across all linked repos"
              />
              <StatsCard
                title="Total Forks"
                value={userStats?.kpi.total_forks || 0}
                icon={<GitFork className="h-4 w-4 text-blue-500" />}
                description="Project adaptations"
              />
              <StatsCard
                title="Issues Open"
                value={userStats?.kpi.total_issues || 0}
                icon={<AlertCircle className="h-4 w-4 text-red-500" />}
                description="Maintenance load"
              />
              <StatsCard
                title="Total Repos"
                value={userStats?.kpi.total_repos || 0}
                icon={<Book className="h-4 w-4 text-green-500" />}
                description="Linked projects"
              />
            </div>

            {/* Charts Row */}
            <div className="grid gap-6 md:grid-cols-7 h-full">

              {/* Language Distribution (Donut) - Spans 3 columns */}
              <Card className="md:col-span-3 flex flex-col shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base">Tech Stack</CardTitle>
                  <CardDescription>Language distribution by repo count</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 min-h-[300px] flex flex-col items-center justify-center">
                  {userStats?.charts.languages?.length ? (
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie
                          data={userStats.charts.languages}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {userStats.charts.languages.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                          ))}
                        </Pie>
                        <RechartsTooltip
                          contentStyle={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', borderRadius: '8px' }}
                          itemStyle={{ color: 'var(--foreground)' }}
                        />
                        <Legend verticalAlign="bottom" height={36} iconType="circle" />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="text-sm text-muted-foreground italic">No language data available</div>
                  )}
                </CardContent>
              </Card>

              {/* Top Repositories (Bar) - Spans 4 columns */}
              <Card className="md:col-span-4 flex flex-col shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base">Top Repositories</CardTitle>
                  <CardDescription>Most starred projects</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 min-h-[300px]">
                  {userStats?.charts.top_repos?.length ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={userStats.charts.top_repos}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border)" opacity={0.3} />
                        <XAxis type="number" hide />
                        <YAxis
                          type="category"
                          dataKey="name"
                          width={100}
                          tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }}
                        />
                        <RechartsTooltip
                          cursor={{ fill: 'var(--accent)', opacity: 0.2 }}
                          contentStyle={{ backgroundColor: 'var(--popover)', borderColor: 'var(--border)', borderRadius: '8px' }}
                        />
                        <Bar dataKey="stars" fill="#EAB308" radius={[0, 4, 4, 0]} barSize={20} name="Stars" />
                        <Bar dataKey="forks" fill="#3B82F6" radius={[0, 4, 4, 0]} barSize={20} name="Forks" />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-muted-foreground italic">
                      No repository data found
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed rounded-xl bg-card/50">
          <div className="p-4 rounded-full bg-secondary/50 mb-4">
            <Github className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold">Connect GitHub to see your stats</h3>
          <p className="text-muted-foreground max-w-sm mt-2 mb-6">
            Link your account to visualize your repository data, track contributions, and share your profile with peers.
          </p>
          <Link href="/settings">
            <Button>Link Account Now</Button>
          </Link>
        </div>
      )}

      {/* --- SECTION 2: GLOBAL COMMUNITY PULSE --- */}
      <div className="pt-8">
        <h3 className="text-xl font-semibold flex items-center gap-2 mb-6">
          <Globe className="w-5 h-5 text-primary" /> Community Pulse
        </h3>

        {isGlobalLoading ? (
          <div className="grid gap-4 md:grid-cols-4">
            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 w-full rounded-xl" />)}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {/* Global KPIs */}
            <Card className="col-span-2 bg-card h-fit border-none shadow-sm">
              <CardContent className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground font-medium">Total Repos</p>
                    <p className="text-3xl font-bold tracking-tight">{globalStats?.kpi.platform_repos || 0}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground font-medium">Total Stars</p>
                    <p className="text-3xl font-bold tracking-tight text-yellow-600 dark:text-yellow-500">
                      {globalStats?.kpi.platform_stars || 0}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground font-medium">Total Forks</p>
                    <p className="text-3xl font-bold tracking-tight text-blue-600 dark:text-blue-500">
                      {globalStats?.kpi.platform_forks || 0}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground font-medium">Contributions</p>
                    <p className="text-3xl font-bold tracking-tight text-green-600 dark:text-green-500">
                      {globalStats?.kpi.platform_issues || 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Trending Languages */}
            <Card className="col-span-1 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <FileCode className="w-4 h-4" /> Trending Languages
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {globalStats?.top_languages.map((lang, idx) => (
                  <div key={lang.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground font-mono w-4">{idx + 1}.</span>
                      <span className="font-medium">{lang.name}</span>
                    </div>
                    <Badge variant="secondary" className="font-normal text-xs">
                      {lang.count} repos
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </section>
  );
}

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  description?: string;
}

function StatsCard({ title, value, icon, description }: StatsCardProps) {
  return (
    <Card className="shadow-sm hover:shadow-md transition-all duration-200 border-border/60">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className="p-2 bg-background rounded-full ring-1 ring-border/50">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
      </CardContent>
    </Card>
  );
}

function DashboardSkeleton() {
  return (
    <div className="container mx-auto py-8 space-y-8 max-w-7xl">
      <div className="flex justify-between items-center pb-6 border-b">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <Skeleton className="h-10 w-40" />
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 rounded-xl" />)}
      </div>
      <div className="grid gap-6 md:grid-cols-7 h-[350px]">
        <Skeleton className="md:col-span-3 rounded-xl" />
        <Skeleton className="md:col-span-4 rounded-xl" />
      </div>
    </div>
  )
}

