"use client";

import Skeleton from "@/components/skeleton";
import { useUser } from "@/hooks/use-user";
import { devLog } from "@/lib/utils";
import { GraduationCap, Mail, Hash, Calendar, Shield } from "lucide-react";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { useEffect, useRef, useState } from "react";
import { API_BASE_URL } from "@/lib/consts";
import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import Dropdown from "@/components/dropdown/dropdown";
import { createPortal } from "react-dom";

// Helpers
const formatEnumString = (str: string | null) => {
  if (!str) return "Not set";
  return str.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

const formatDate = (date: Date | string) => {
  return new Date(date).toLocaleDateString("en-US", {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export default function MyUserDetails() {
  const { userDetails } = useUser();

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const courseNameRef = useRef<HTMLInputElement>(null);
  const courseYearRef = useRef<HTMLInputElement>(null);

  const [detailsCompleted, setDetailsCompleted] = useState(true);
  const [editMode, setEditMode] = useState(false);

  devLog("User Details (Account Page):", userDetails);

  useEffect(() => {
    if (!userDetails) return;
    if (!userDetails.first_name || !userDetails.last_name || !userDetails.email || !userDetails.university_course || !userDetails.course_year) {
      setDetailsCompleted(false);
    }
  }, [userDetails])

  const { data: universityCourses } = useQuery({
    queryKey: ["university-courses"],
    queryFn: async () => {
      const response = await api.get<UniversityCourse[]>("/university-courses");
      devLog("University Courses:", response.data);
      return response.data;
    },
    staleTime: 1000 * 60 * 60,  // 1 hour
    gcTime: 1000 * 60 * 60 * 2, // 2 hours
  });

  // Loading State
  if (!userDetails) {
    return (
      <div className="w-full space-y-8 animate-pulse">
        {/* Header Skeleton */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <Skeleton className="h-24 w-24 rounded-full" />
          <div className="space-y-3 text-center sm:text-left w-full">
            <Skeleton className="h-8 w-48 mx-auto sm:mx-0" />
            <Skeleton className="h-4 w-32 mx-auto sm:mx-0" />
            <Skeleton className="h-4 w-64 mx-auto sm:mx-0" />
          </div>
        </div>
        {/* Grid Skeleton */}
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-40 w-full rounded-xl" />
          <Skeleton className="h-40 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  const fullName = [userDetails.first_name, userDetails.last_name].filter(Boolean).join(" ") || "Unknown";

  return (
    <div className="w-full flex flex-col gap-8 animate-in fade-in duration-500">

      {/* Header Section */}
      <div className="border-b pb-2">

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="h-24 w-24 rounded-full bg-emerald-500 dark:bg-emerald-800 flex items-center justify-center text-5xl font-bold text-accent overflow-hidden ring-2 ring-background shadow-sm pointer-events-none select-none">
              <span>{userDetails.first_name?.[0] || userDetails.apu_id?.[0] || "?"}</span>
            </div>
            {/* Status Indicator */}
            <span
              className={`absolute bottom-1 right-1 h-5 w-5 rounded-full border-[3px] border-background ${userDetails.is_active ? 'bg-green-500' : 'bg-red-500'
                }`}
              title={userDetails.is_active ? "Account Active" : "Account Inactive"}
            />
          </div>

          {/* User Info */}
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left flex-1 min-w-0">
            <div className="flex items-center gap-3 w-full">
              {editMode ? (
                <div className="text-2xl w-full max-w-72">
                  <input
                    type="text"
                    className="w-full bg-input px-2 rounded border border-border transition duration-200 focus:outline-none"
                    placeholder="Enter your name"
                  />
                </div>
              ) : (
                <h2 className="text-2xl font-bold tracking-tight truncate max-w-lg">
                  {fullName}
                </h2>
              )}
              {!detailsCompleted && (
                !editMode ? (
                  <button
                    onClick={() => setEditMode(true)}
                    className="inline-flex flex-nowrap whitespace-nowrap text-md px-2 py-1 bg-warning text-warning-foreground border rounded shadow
                  hover:bg-warning/80 focus:bg-warning/80 hover:cursor-pointer focus:outline-none focus:ring-1 focus:ring-ring focus:ring-offset-1 focus:ring-offset-background
                  transition duration-200"
                  >
                    Add Profile Information
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => { }}
                      className="inline-flex flex-nowrap whitespace-nowrap text-md px-2 py-1 bg-secondary text-secondary-foreground border rounded shadow
                  hover:bg-secondary/80 focus:bg-secondary/80 hover:cursor-pointer focus:outline-none focus:ring-1 focus:ring-ring focus:ring-offset-1 focus:ring-offset-background
                  transition duration-200"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditMode(false)}
                      className="inline-flex flex-nowrap whitespace-nowrap text-md px-2 py-1 bg-destructive text-destructive-foreground border rounded shadow
                  hover:bg-destructive/80 focus:bg-destructive/80 hover:cursor-pointer focus:outline-none focus:ring-1 focus:ring-ring focus:ring-offset-1 focus:ring-offset-background
                  transition duration-200"
                    >
                      Cancel
                    </button>
                  </div>
                )
              )}
            </div>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-2">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary/10 text-secondary">
                <Shield className="w-3 h-3" />
                <span className="capitalize">{userDetails.role}</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground font-mono">
                <Hash className="w-3 h-3" />
                {userDetails.apu_id}
              </div>
            </div>

            <div className="flex items-center gap-2 mt-3 text-sm text-muted-foreground">
              <Mail className="w-3.5 h-3.5" />
              <span>{userDetails.email || "No email linked"}</span>
            </div>

          </div>

        </div>

        {!detailsCompleted && (
          <div className="flex items-center sm:text-start text-center gap-2 mt-6 text-sm text-warning">
            <p>
              <span className="font-bold underline">
                Warning:
              </span>
              {" "} You have not provided all your profile information. You may miss out on some features.
            </p>
          </div>
        )}
      </div>

      {/* Content Grid */}
      <div className="grid gap-6 md:grid-cols-2">

        {/* Academic Card */}
        <div className="group relative overflow-hidden rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-lg">
              <GraduationCap className="w-5 h-5" />
            </div>
            <h3 className="font-semibold">Academic Profile</h3>
          </div>

          <dl className="grid gap-4 sm:grid-cols-[auto_auto]">
            <div>
              <dt className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Course</dt>
              {editMode ? (
                <Dropdown
                  parentClassName="w-full"
                  triggerNode={
                    <button className="w-full inline-flex flex-nowrap whitespace-nowrap truncate items-center justify-start border">
                      Select Course
                    </button>
                  }>
                </Dropdown>
              ) : (
                <dd className="mt-1 text-sm font-medium leading-tight">
                  {userDetails.university_course || "Not enrolled"}
                </dd>
              )}
            </div>
            <div>
              <dt className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Year</dt>
              <dd className="mt-1 text-sm font-medium">
                {formatEnumString(userDetails.course_year)}
              </dd>
            </div>
          </dl>
        </div>

        {/* GitHub Card */}
        <div className="group relative overflow-hidden rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-zinc-100 dark:bg-zinc-800 text-foreground rounded-lg">
                <GitHubLogoIcon className="w-5 h-5" />
              </div>
              <h3 className="font-semibold">GitHub</h3>
            </div>
            {userDetails.is_github_linked && (
              <span className="flex h-2 w-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
            )}
          </div>

          {userDetails.is_github_linked ? (
            <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/50 border border-transparent hover:border-border transition-colors">
              {userDetails.github_avatar_url ? (
                <img src={userDetails.github_avatar_url} alt="GH" className="h-10 w-10 rounded-full bg-background" />
              ) : (
                <GitHubLogoIcon className="h-10 w-10 p-2 rounded-full bg-background text-muted-foreground" />
              )}
              <div className="flex flex-col min-w-0">
                <span className="text-xs text-muted-foreground">Connected as</span>
                <a
                  href={`https://github.com/${userDetails.github_username}`}
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium truncate hover:underline hover:text-primary transition-colors"
                >
                  @{userDetails.github_username}
                </a>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-2 text-center">
              <p className="text-sm text-muted-foreground mb-3">No account connected</p>
              {/* Placeholder for future button */}
              <div className="px-3 py-1.5 rounded-md border border-dashed text-xs text-muted-foreground bg-muted/30">
                Link account in Settings
              </div>
            </div>
          )}
        </div>
      </div >

      <div className="flex flex-col sm:flex-row justify-between items-center gap-2 pt-2 text-xs text-muted-foreground/60 font-mono">
        <div className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          <span>Joined {formatDate(userDetails.created_at)}</span>
        </div>
      </div>

    </div >
  );
}
