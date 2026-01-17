export enum UserRole {
  STUDENT = "student",
  TEACHER = "teacher",
  ADMIN = "admin",
}

export interface User {
  id: string;
  apu_id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  role: UserRole;
  is_active: boolean;

  github_access_token: string | null;
  github_username: string | null;
}

export interface AdminUpdateUserPayload {
  first_name?: string;
  last_name?: string;
  email?: string;
  role?: UserRole;
  is_active?: boolean;
}
