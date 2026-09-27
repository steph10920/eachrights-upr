import { supabase } from "./supabase";

export type StaffRole =
  | "contributor"
  | "reviewer"
  | "administrator";

export type AccountStatus =
  | "pending_approval"
  | "active"
  | "suspended"
  | "inactive";

export interface StaffProfile {
  id: string;
  email: string;
  full_name: string | null;
  organisation: string | null;
  role: StaffRole;
  account_status: AccountStatus;
}

/**
 * Sign in a staff member using Supabase Auth.
 */
export async function signIn(
  email: string,
  password: string
) {
  const { data, error } =
    await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

  if (error) {
    throw error;
  }

  return data;
}

/**
 * Sign out the current staff member.
 */
export async function signOut() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw error;
  }
}

/**
 * Get the currently authenticated Supabase user.
 */
export async function getCurrentUser() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    throw error;
  }

  return user;
}

/**
 * Get the EACHRights staff profile belonging to
 * the currently authenticated Supabase user.
 */
export async function getCurrentStaffProfile(): Promise<StaffProfile | null> {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  const { data, error } = await supabase
    .from("users")
    .select(
      `
        id,
        email,
        full_name,
        organisation,
        role,
        account_status
      `
    )
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data as StaffProfile | null;
}

/**
 * Check whether the current user has an active staff account.
 */
export async function isActiveStaff() {
  const profile = await getCurrentStaffProfile();

  return profile?.account_status === "active";
}

/**
 * Check whether the current user is a reviewer
 * or administrator.
 */
export async function isReviewerOrAdmin() {
  const profile = await getCurrentStaffProfile();

  return (
    profile?.role === "reviewer" ||
    profile?.role === "administrator"
  );
}

/**
 * Check whether the current user is an administrator.
 */
export async function isAdministrator() {
  const profile = await getCurrentStaffProfile();

  return profile?.role === "administrator";
}