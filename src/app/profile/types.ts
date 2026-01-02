import z from "zod";

export const YEARS = ["YEAR 1", "YEAR 2", "YEAR 3", "YEAR 4"] as const;
export type YearDisplayType = typeof YEARS[number];

const YEARS_DB = ["year_1", "year_2", "year_3", "year_4"] as const;

export const universityCoursesSchema = z.object({
  id: z.string(),
  name: z.string(),
  code: z.string(),
});

export const profileEditRequestSchema = z.object({
  first_name: z.string().trim().optional(),
  last_name: z.string().trim().optional(),
  email: z.email("Email is invalid").trim().optional(),
  university_course: universityCoursesSchema.optional(),
  course_year: z.enum(YEARS_DB, "Course year is invalid").optional(),
});

export type ProfileEditRequest = z.infer<typeof profileEditRequestSchema>;

