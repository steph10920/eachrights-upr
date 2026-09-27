import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { hasMinRole } from '../../lib/permissions';
import type { UserRole } from '../../types/auth';

interface RoleGuardProps {
  minRole: UserRole;
}

// Sits inside a <ProtectedRoute> subtree — assumes session/profile/active
// have already been checked, and only adds the role check on top. Kept
// separate from ProtectedRoute so a route can require "reviewer" or
// "administrator" without duplicating the auth/active logic.
export function RoleGuard({ minRole }: RoleGuardProps) {
  const { profile } = useAuth();

  if (!hasMinRole(profile, minRole)) {
    return <Navigate to="/staff/dashboard" replace />;
  }

  return <Outlet />;
}
