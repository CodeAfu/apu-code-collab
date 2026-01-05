"use client";

import LoadingSpinner from "@/components/loading-spinner"
import Modal from "@/components/modal"
import { AnimatePresence, motion } from "motion/react"
import { useEffect } from "react";
import { ProfileEditRequest, profileEditRequestSchema, YearDisplayType } from "../types";
import api from "@/lib/api";
import { withAuth } from "@/lib/auth";
import { devLog, logApiError } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { formatYearToEnum } from "../utils";
import { UserDetails } from "@/types/user";

interface SaveChangesModalProps {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  userDetails: UserDetails;
  selectedCourse: UniversityCourse | undefined;
  selectedYear: YearDisplayType | undefined;
  setEditMode: React.Dispatch<React.SetStateAction<boolean>>;
  firstNameRef: React.RefObject<HTMLInputElement | null>;
  lastNameRef: React.RefObject<HTMLInputElement | null>;
  emailRef: React.RefObject<HTMLInputElement | null>;
}

export default function SaveChangesModal({
  isModalOpen,
  setIsModalOpen,
  userDetails,
  selectedCourse,
  selectedYear,
  setEditMode,
  firstNameRef,
  lastNameRef,
  emailRef
}: SaveChangesModalProps) {
  const queryClient = useQueryClient();

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
      toast.loading("Saving...");
      const response = await api.put("/api/v1/users/me", validatedPayload.data);
      toast.dismiss();
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
    if (isSuccess || isError) {
      setIsModalOpen(false);
    }
  }, [isSuccess, isError])

  return (
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
                ? `${userDetails.university_course.name} (${userDetails.university_course.code})*`
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
  )
}
