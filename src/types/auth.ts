export type UserRole =
  | "contributor"
  | "reviewer"
  | "administrator";

export type AccountStatus =
  | "pending_approval"
  | "active"
  | "suspended"
  | "inactive";

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  organisation: string | null;
  role: UserRole;
  account_status: AccountStatus;
}