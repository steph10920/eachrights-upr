import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export default function ProtectedRoute() {
  const { session, profile, loading } = useAuth();

  if (loading) return <div className="p-8 text-center text-gray-500">Loading…</div>;

  if (!session) return <Navigate to="/login" replace />;

  if (!profile || profile.account_status !== 'active') {
    // Covers both pending_approval (Phase 2's default for new signups) and
    // suspended accounts — same holding page either way.
    return <Navigate to="/pending-approval" replace />;
  }

  return <Outlet />;
}
