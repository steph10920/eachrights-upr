import type { Profile, UserRole } from '../types/auth';

const ROLE_RANK: Record<UserRole, number> = {
  contributor: 1,
  reviewer: 2,
  administrator: 3,
};

export function hasMinRole(profile: Profile | null, minRole: UserRole): boolean {
  if (!profile || profile.account_status !== 'active') return false;
  return ROLE_RANK[profile.role] >= ROLE_RANK[minRole];
}

export const isContributorOrAbove = (profile: Profile | null) => hasMinRole(profile, 'contributor');
export const isReviewerOrAdmin = (profile: Profile | null) => hasMinRole(profile, 'reviewer');
export const isAdmin = (profile: Profile | null) => hasMinRole(profile, 'administrator');

export const ROLE_LABEL: Record<UserRole, string> = {
  contributor: 'Contributor',
  reviewer: 'Reviewer',
  administrator: 'Administrator',
};