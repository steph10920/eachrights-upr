import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useUserProfile } from "../../hooks/useUserProfile";

export default function ProtectedRoute() {
  const location = useLocation();

  const { user, loading: authLoading } = useAuth();
  const {
    profile,
    loading: profileLoading,
    error,
  } = useUserProfile();

  /*
   * 1. Wait for Supabase authentication
   */
  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-slate-800" />

          <p className="text-sm text-slate-600">
            Checking your account...
          </p>
        </div>
      </div>
    );
  }

  /*
   * 2. No Supabase session
   */
  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  /*
   * 3. Authenticated but no public.users profile
   */
  if (error || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-6">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-sm border border-slate-200">
          <h1 className="text-xl font-semibold text-slate-900">
            Profile not found
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-600">
            Your account has been authenticated, but your EACHRights staff
            profile could not be found.
          </p>

          <button
            type="button"
            onClick={() => window.location.href = "/login"}
            className="mt-6 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
          >
            Return to sign in
          </button>
        </div>
      </div>
    );
  }

  /*
   * 4. Account exists but has not been approved
   */
  if (profile.account_status === "pending_approval") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-6">
        <div className="w-full max-w-lg rounded-2xl bg-white p-8 text-center shadow-sm border border-slate-200">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-amber-700">
            !
          </div>

          <h1 className="mt-5 text-2xl font-semibold text-slate-900">
            Account awaiting approval
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-600">
            Your EACHRights staff account has been created successfully,
            but an Administrator still needs to activate your account.
          </p>

          <div className="mt-6 rounded-xl bg-slate-50 p-4 text-left">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Account
            </p>

            <p className="mt-1 text-sm text-slate-800">
              {profile.full_name || user.email}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              {profile.organisation || "EACHRights"}
            </p>

            <p className="mt-1 text-sm text-slate-500 capitalize">
              {profile.role}
            </p>
          </div>

          <button
            type="button"
            onClick={() => window.location.href = "/login"}
            className="mt-6 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
          >
            Return to sign in
          </button>
        </div>
      </div>
    );
  }

  /*
   * 5. Suspended account
   */
  if (profile.account_status === "suspended") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-6">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-sm border border-slate-200">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-700">
            !
          </div>

          <h1 className="mt-5 text-2xl font-semibold text-slate-900">
            Account suspended
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-600">
            Your EACHRights staff account is currently suspended.
            Please contact an Administrator if you believe this is an error.
          </p>

          <button
            type="button"
            onClick={() => window.location.href = "/login"}
            className="mt-6 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
          >
            Return to sign in
          </button>
        </div>
      </div>
    );
  }

  /*
   * 6. Active account
   *
   * Contributor, Reviewer and Administrator can enter
   * the Staff Portal. RoleGuard will handle restrictions
   * for specific pages.
   */
  if (profile.account_status === "active") {
    return <Outlet />;
  }

  /*
   * Safety fallback
   */
  return <Navigate to="/login" replace />;
}