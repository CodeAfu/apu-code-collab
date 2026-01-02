
export const USER_ROLES = ["student", "teacher", "admin"] as const;
export type UserRole = typeof USER_ROLES[number];

export interface UniversityCourse {
  id: string;
  name: string;
  code: string;
}

export interface UserDetails {
  id: string;
  apu_id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  is_active: boolean;
  role: UserRole;
  github_id: number | null;
  github_username: string | null;
  github_avatar_url: string | null;
  is_github_linked: boolean;
  university_course: UniversityCourse,
  course_year: string | null;
  created_at: Date;
  updated_at: Date;
}


// export const UserRoleEnum = z.enum(["student", "teacher", "admin"]);
// export type UserRole = z.infer<typeof UserRoleEnum>;
//
// export const userDetailsSchema = z.object({
//   id: z.string(),
//   apu_id: z.string(),
//
//   first_name: z.string().nullable(),
//   last_name: z.string().nullable(),
//   email: z.email().nullable(),
//
//   is_active: z.boolean(),
//   role: UserRoleEnum,
//
//   // GitHub Fields
//   github_id: z.number().nullable(),
//   github_username: z.string().nullable(),
//   github_avatar_url: z.url().nullable(),
//
//   created_at: z.coerce.date(),
//   updated_at: z.coerce.date(),
// });
//
// export type UserDetails = z.infer<typeof userDetailsSchema>;

