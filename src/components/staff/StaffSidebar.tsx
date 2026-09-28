import { NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { isAdmin, isReviewerOrAdmin } from "../../lib/permissions";

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `block px-3 py-2 rounded text-sm ${
    isActive
      ? "bg-blue-600 text-white"
      : "text-gray-700 hover:bg-gray-100"
  }`;

export function StaffSidebar() {
  const { profile } = useAuth();

  return (
    <nav className="w-56 shrink-0 border-r border-gray-200 p-3 space-y-1">
      {/* Staff Dashboard */}
      <NavLink to="/staff" className={linkClass}>
        Dashboard
      </NavLink>

      {/* My Submissions */}
      <NavLink to="/staff/submissions" className={linkClass}>
        My Submissions
      </NavLink>

      {/* Add Data */}
      <p className="pt-4 pb-1 px-3 text-xs font-semibold uppercase text-gray-400">
        Add data
      </p>

      <NavLink
        to="/staff/add-recommendation"
        className={linkClass}
      >
        Recommendation
      </NavLink>

      <NavLink
        to="/staff/add-implementation-update"
        className={linkClass}
      >
        Implementation update
      </NavLink>

      <NavLink
        to="/staff/add-action"
        className={linkClass}
      >
        Action
      </NavLink>

      <NavLink
        to="/staff/add-evidence"
        className={linkClass}
      >
        Evidence
      </NavLink>

      {/* Reviewer */}
      {isReviewerOrAdmin(profile) && (
        <>
          <p className="pt-4 pb-1 px-3 text-xs font-semibold uppercase text-gray-400">
            Review
          </p>

          <NavLink
            to="/staff/review/queue"
            className={linkClass}
          >
            Review Queue
          </NavLink>

          <NavLink
            to="/staff/review/audit-trail"
            className={linkClass}
          >
            Audit Trail
          </NavLink>
        </>
      )}

      {/* Administrator */}
      {isAdmin(profile) && (
        <>
          <p className="pt-4 pb-1 px-3 text-xs font-semibold uppercase text-gray-400">
            Admin
          </p>

          <NavLink
            to="/staff/admin/users"
            className={linkClass}
          >
            Users
          </NavLink>

          <NavLink
            to="/staff/admin/institutions"
            className={linkClass}
          >
            Institutions
          </NavLink>

          <NavLink
            to="/staff/admin/themes"
            className={linkClass}
          >
            Themes
          </NavLink>

          <NavLink
            to="/staff/admin/upr-cycles"
            className={linkClass}
          >
            UPR Cycles
          </NavLink>
        </>
      )}
    </nav>
  );
}
