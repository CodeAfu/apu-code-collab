"use client";

import Skeleton from "@/components/skeleton";
import { useUser } from "@/hooks/use-user";
import { devLog, logApiError, sleep } from "@/lib/utils";
import { GraduationCap, Mail, Hash, Calendar, Shield } from "lucide-react";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { useEffect, useRef, useState } from "react";
import api from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Dropdown from "@/components/dropdown/dropdown";
import { ProfileEditRequest, profileEditRequestSchema, YearDisplayType, YEARS } from "../types";
import { formatEnumString, formatDate, formatYearToEnum } from "../utils";
import React from "react";
import Modal from "@/components/modal";
import { toast } from "sonner";
import { withAuth } from "@/lib/auth";
import { AnimatePresence, motion } from "motion/react";
import LoadingSpinner from "@/components/loading-spinner";

export default function MyUserDetails() {
  const queryClient = useQueryClient();
  const { userDetails } = useUser();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [editMode, setEditMode] = useState(false);
  const [detailsCompleted, setDetailsCompleted] = useState(true);

  const [selectedCourse, setSelectedCourse] = useState<UniversityCourse | undefined>();
  const [selectedYear, setSelectedYear] = useState<YearDisplayType | undefined>();
  const firstNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  devLog("User Details (Account Page):", userDetails);

  const { data: universityCourses } = useQuery({
    queryKey: ["university-courses"],
    queryFn: async () => {
      const response = await api.get<UniversityCourse[]>("/api/v1/university_courses");
      devLog("University Courses:", response.data);
      return response.data;
    },
    staleTime: 1000 * 60 * 60,  // 1 hour
    gcTime: 1000 * 60 * 60 * 2, // 2 hours
  });

  const { mutate: editAccountDetails, isPending, isSuccess, isError } = useMutation({
    mutationFn: withAuth(async () => {
      const payload: ProfileEditRequest = {
        first_name: firstNameRef.current?.value,
        last_name: lastNameRef.current?.value,
        email: emailRef.current?.value,
        university_course: selectedCourse,
        course_year: selectedYear ? formatYearToEnum(selectedYear) : undefined
      };

      const validatedPayload = profileEditRequestSchema.safeParse(payload);
      if (validatedPayload.error) {
        console.error("Error:", validatedPayload.error);
        toast.error(`Invalid payload: `);
        throw new Error("Invalid payload");
      }

      devLog("Payload:", validatedPayload.data);

      // await sleep(2000)
      const response = await api.put("/api/v1/users/me", validatedPayload.data);
      return response.data;
    }),
    onSuccess: (data) => {
      setEditMode(false);
      queryClient.invalidateQueries({ queryKey: ["users", "me"] });
      toast.success("Successfully edited account details");
      devLog("Success:", data);
    },
    onError: (error) => {
      toast.error("Failed to edit account details");
      logApiError(error);
    },
  })

  useEffect(() => {
    if (!userDetails) return;
    if (!userDetails.first_name || !userDetails.last_name || !userDetails.email || !userDetails.university_course || !userDetails.course_year) {
      setDetailsCompleted(false);
    } else {
      setDetailsCompleted(true);
    }
  }, [userDetails])

  useEffect(() => {
    if (isSuccess || isError) {
      setIsModalOpen(false);
    }
  }, [isSuccess, isError])

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

  const handleOpenModal = () => {
    const errorList = []
    if (!userDetails.first_name && !firstNameRef.current?.value) {
      errorList.push("First Name");
    }
    if (!userDetails.last_name && !lastNameRef.current?.value) {
      errorList.push("Last Name");
    }
    if (!userDetails.email && !emailRef.current?.value) {
      errorList.push("Email");
    }
    if (!userDetails.university_course && !selectedCourse) {
      errorList.push("Course Name");
    }
    if (!userDetails.course_year && !selectedYear) {
      errorList.push("Year of Study");
    }

    if (errorList.length > 0) {
      const errorString = errorList.join(", ");
      toast.error(`Please provide the following information:\n${errorString}`);
      console.error("Error:", errorList);
      return;
    }

    setIsModalOpen(true);
  }

  const fullName = [userDetails.first_name, userDetails.last_name].filter(Boolean).join(" ") || "Unknown";

  return (
    <React.Fragment>
      <div className="w-full flex flex-col gap-8 animate-in fade-in duration-500">

        {/* Header Section */}
        <div className="border-b pb-2">

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="h-24 w-24 rounded-full bg-emerald-600 dark:bg-emerald-800 flex items-center justify-center text-5xl font-bold text-gray-100 overflow-hidden ring-2 ring-background shadow-sm pointer-events-none select-none">
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
              <div className="flex sm:flex-row flex-col md:items-start items-center gap-3 w-full">
                {editMode && (!userDetails.first_name || !userDetails.last_name) ? (
                  <div className="text-2xl flex items-center gap-2 w-full max-w-md">
                    <input
                      ref={firstNameRef}
                      type="text"
                      className="w-full bg-input px-2 rounded border border-border transition duration-200 focus:outline-none"
                      onBlur={(e) => { e.target.value = e.target.value.trim() }}
                      placeholder="First Name"
                    />
                    <input
                      ref={lastNameRef}
                      type="text"
                      className="w-full bg-input px-2 rounded border border-border transition duration-200 focus:outline-none"
                      onBlur={(e) => { e.target.value = e.target.value.trim() }}
                      placeholder="Last Name"
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
                        onClick={() => handleOpenModal()}
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

              {editMode && !userDetails.email ? (
                <div className="mt-3 w-full max-w-72">
                  <input
                    ref={emailRef}
                    type="text"
                    className="w-full bg-input px-2 rounded border border-border transition duration-200 focus:outline-none"
                    onBlur={(e) => { e.target.value = e.target.value.trim() }}
                    placeholder="Email Address"
                  />
                </div>
              ) : (
                <div className="flex items-center gap-2 mt-3 text-sm text-muted-foreground">
                  <Mail className="w-3.5 h-3.5" />
                  <span>{userDetails.email || "No email linked"}</span>
                </div>
              )}

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

            <dl className="grid gap-3">
              <div className="min-w-0">
                <dt className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Course</dt>
                {editMode && !userDetails.university_course ? (
                  universityCourses && universityCourses.length > 0 ? (
                    <Dropdown
                      triggerNode={
                        <button className="w-full bg-input px-2 py-1 rounded shadow inline-flex flex-nowrap whitespace-nowrap truncate items-center justify-start border
                        hover:bg-accent/50 hover:text-accent-foreground hover:cursor-pointer transition"
                        >
                          {selectedCourse ? selectedCourse.name : "Select Course"}
                        </button>
                      }
                    >
                      <div className="flex flex-col max-h-64 overflow-y-scroll bg-popover">
                        {universityCourses.map((course, index) => (
                          <button
                            key={index}
                            onClick={() => setSelectedCourse(course)}
                            className="shrink-0 text-sm w-full bg-popover px-2 py-1 rounded shadow 
                            inline-flex flex-nowrap whitespace-nowrap truncate items-center justify-start border
                            hover:bg-accent/50 hover:text-accent-foreground hover:cursor-pointer transition"
                          >
                            {course.name} ({course.code})
                          </button>
                        ))}
                      </div>
                    </Dropdown>
                  ) : (
                    // Fallback if no courses found
                    <div>No courses available</div>
                  )
                ) : (
                  <dd className="mt-1 text-sm font-medium leading-tight truncate">
                    {userDetails.university_course.name + " (" + userDetails.university_course.code + ")" || "Not enrolled"}
                  </dd>
                )}
              </div>
              <div>
                <dt className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Year</dt>
                <dd className="mt-1 text-sm font-medium">
                  {editMode && !userDetails.course_year ? (
                    <Dropdown
                      className="w-fit"
                      triggerNode={
                        <button className="w-fit bg-input px-2 py-1 rounded shadow inline-flex flex-nowrap whitespace-nowrap truncate items-center justify-start border
                        hover:bg-accent/50 hover:text-accent-foreground hover:cursor-pointer transition"
                        >
                          {selectedYear ? selectedYear : "Select Year"}
                        </button>
                      }
                    >
                      <div className="flex flex-col max-h-64 overflow-y-scroll bg-popover">
                        {YEARS.map((year, index) => (
                          <button
                            key={index}
                            onClick={() => setSelectedYear(year)}
                            className="shrink-0 text-sm w-full bg-popover px-2 py-1 rounded shadow 
                            inline-flex flex-nowrap whitespace-nowrap truncate items-center justify-start border
                            hover:bg-accent/50 hover:text-accent-foreground hover:cursor-pointer transition"
                          >
                            {year}
                          </button>
                        ))}
                      </div>
                    </Dropdown>
                  ) : (
                    formatEnumString(userDetails.course_year)
                  )}
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

        <div className="flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-muted-foreground/60 font-mono">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>Joined {formatDate(userDetails.created_at)}</span>
          </div>
        </div>

      </div>

      <Modal
        className="relative border border-border shadow-lg rounded-xl p-6 sm:p-8"
        size="2xl"
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <div className="flex flex-col gap-4">
          {/* Header Section */}
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              Confirm Details
            </h2>
            <p className="text-sm text-muted-foreground">
              Please review your credentials below.{" "}
              <span className="font-semibold text-destructive/80">
                All changes made will be permanent.
              </span>
            </p>
          </div>

          {/* Data Display Section */}
          <div className="rounded-lg border bg-muted/30 p-4">
            <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">

              <dt className="font-medium text-muted-foreground">First Name:</dt>
              <dd className="font-semibold text-foreground truncate">
                {userDetails.first_name
                  ? `${userDetails.first_name}*`
                  : firstNameRef.current?.value || "-"}
              </dd>

              <dt className="font-medium text-muted-foreground">Last Name:</dt>
              <dd className="font-semibold text-foreground truncate">
                {userDetails.last_name
                  ? `${userDetails.last_name}*`
                  : lastNameRef.current?.value || "-"}
              </dd>

              <dt className="font-medium text-muted-foreground">Email:</dt>
              <dd className="font-semibold text-foreground truncate">
                {userDetails.email
                  ? `${userDetails.email}*`
                  : emailRef.current?.value || "-"}
              </dd>

              <dt className="font-medium text-muted-foreground">Course:</dt>
              {/* Handle nested object safely if university_course is an object */}
              <dd className="font-semibold text-foreground truncate">
                {userDetails.university_course
                  ? `${userDetails.university_course.name} (${userDetails.university_course.code})*` // Or .name if it's an object
                  : selectedCourse?.name || "-"}
              </dd>

              <dt className="font-medium text-muted-foreground">Year:</dt>
              <dd className="font-semibold text-foreground truncate">
                {userDetails.course_year
                  ? `${userDetails.course_year}*`
                  : selectedYear || "-"}
              </dd>

            </dl>
          </div>
          <p className="text-xs text-muted-foreground">
            If you have any questions, please contact your APU administrator.
          </p>

          <div className="flex justify-end items-center gap-3 mt-2">
            <button
              onClick={() => setIsModalOpen(false)}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-2 hover:cursor-pointer"
            >
              Go Back
            </button>
            <button
              onClick={() => { editAccountDetails() }}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium px-4 py-2 bg-primary text-primary-foreground shadow 
                hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring hover:cursor-pointer 
                transition-colors disabled:opacity-50 disabled:pointer-events-none"
              disabled={isPending}
            >
              Confirm & Save
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isPending && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute top-0 right-0 inset-0 bg-black/50 backdrop-blur-sm flex flex-col justify-center items-center gap-2 text-sm text-muted-foreground">
              <LoadingSpinner />
              <span>Saving...</span>
            </motion.div>
          )}
        </AnimatePresence>
      </Modal>
    </React.Fragment >
  );
}
