import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

// ============================================================
// PUBLIC PAGES
// ============================================================

import Overview from "./pages/public/Overview";
import Recommendations from "./pages/public/Recommendations";
import RecommendationDetail from "./pages/public/RecommendationDetail";
import Implementation from "./pages/public/Implementation";
import Themes from "./pages/public/Themes";
import Institutions from "./pages/public/Institutions";
import Evidence from "./pages/public/Evidence";

// ============================================================
// STAFF PAGES
// ============================================================

import Login from "./pages/staff/Login";
import Dashboard from "./pages/staff/Dashboard";
import ReviewQueue from "./pages/staff/reviewer/ReviewQueue";

// Not built yet — sidebar already links to these, so they're routed to a
// placeholder rather than left to 404. Swap each import in as it's built.
import PagePlaceholder from "./components/ui/PagePlaceholder";

// ============================================================
// STAFF AUTHENTICATION
// ============================================================

import ProtectedRoute from "./components/staff/ProtectedRoute";
import RoleGuard from "./components/staff/RoleGuard";
import StaffLayout from "./components/staff/StaffLayout";
import { AuthProvider } from "./hooks/useAuth";

function PendingApproval() {
  return (
    <div className="min-h-screen flex items-center justify-center text-center p-6">
      <div>
        <h1 className="text-lg font-semibold mb-2">Account awaiting approval</h1>
        <p className="text-gray-500">
          Your EACHRights staff account has been created, but an Administrator
          still needs to activate it before you can continue.
        </p>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>

          {/* ======================================================
              PUBLIC DASHBOARD
          ====================================================== */}

          <Route path="/" element={<Overview />} />
          <Route path="/recommendations" element={<Recommendations />} />
          <Route path="/recommendations/:id" element={<RecommendationDetail />} />
          <Route path="/implementation" element={<Implementation />} />
          <Route path="/themes" element={<Themes />} />
          <Route path="/institutions" element={<Institutions />} />
          <Route path="/evidence" element={<Evidence />} />

          {/* ======================================================
              STAFF LOGIN
          ====================================================== */}

          <Route path="/login" element={<Login />} />
          <Route path="/pending-approval" element={<PendingApproval />} />

          {/* ======================================================
              PROTECTED STAFF PORTAL
          ====================================================== */}

          <Route element={<ProtectedRoute />}>
            <Route path="/staff" element={<StaffLayout />}>

              <Route index element={<Dashboard />} />

              <Route path="submissions" element={<PagePlaceholder title="My Submissions" />} />
              <Route path="add-recommendation" element={<PagePlaceholder title="Add Recommendation" />} />
              <Route path="add-implementation-update" element={<PagePlaceholder title="Add Implementation Update" />} />
              <Route path="add-action" element={<PagePlaceholder title="Add Action" />} />
              <Route path="add-evidence" element={<PagePlaceholder title="Add Evidence" />} />

              <Route element={<RoleGuard minRole="reviewer" />}>
                <Route path="review/queue" element={<ReviewQueue />} />
                <Route path="review/queue/:submissionId" element={<PagePlaceholder title="Review Submission" />} />
                <Route path="review/audit-trail" element={<PagePlaceholder title="Audit Trail" />} />
              </Route>

              <Route element={<RoleGuard minRole="administrator" />}>
                <Route path="admin/users" element={<PagePlaceholder title="Users" />} />
                <Route path="admin/institutions" element={<PagePlaceholder title="Institutions" />} />
                <Route path="admin/themes" element={<PagePlaceholder title="Themes" />} />
                <Route path="admin/upr-cycles" element={<PagePlaceholder title="UPR Cycles" />} />
              </Route>

            </Route>
          </Route>

          {/* ======================================================
              FALLBACK
          ====================================================== */}

          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
