import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Overview from "./pages/public/Overview";
import Recommendations from "./pages/public/Recommendations";
import RecommendationDetail from "./pages/public/RecommendationDetail";
import Implementation from "./pages/public/Implementation";
import Themes from "./pages/public/Themes";
import Institutions from "./pages/public/Institutions";
import Evidence from "./pages/public/Evidence";

import Login from "./pages/staff/Login";
import Dashboard from "./pages/staff/Dashboard";
import Submissions from "./pages/staff/Submissions";
import AddRecommendation from "./pages/staff/AddRecommendation";
import AddImplementationUpdate from "./pages/staff/AddImplementation";
import AddAction from "./pages/staff/AddAction";
import AddEvidence from "./pages/staff/AddEvidence";

import ReviewerDashboard from "./pages/staff/reviewer/ReviewerDashboard";
import ReviewQueue from "./pages/staff/reviewer/ReviewQueue";

import PublicLayout from "./components/layout/PublicLayout";
import PagePlaceholder from "./components/ui/PagePlaceholder";
import ProtectedRoute from "./components/staff/ProtectedRoute";
import { RoleGuard } from "./components/staff/RoleGuard";
import { StaffLayout } from "./components/staff/StaffLayout";

import { AuthProvider } from "./hooks/useAuth";

function PendingApproval() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">
          Account Pending Approval
        </h1>

        <p className="mt-3 text-sm leading-6 text-slate-600">
          Your account has been created, but it is waiting for administrator
          approval. You will be able to access the staff dashboard once your
          account has been activated.
        </p>

        <a
          href="/login"
          className="mt-6 inline-flex items-center justify-center rounded-lg bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
        >
          Return to Login
        </a>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Overview />} />
            <Route
              path="/recommendations"
              element={<Recommendations />}
            />
            <Route
              path="/recommendations/:id"
              element={<RecommendationDetail />}
            />
            <Route
              path="/implementation"
              element={<Implementation />}
            />
            <Route path="/themes" element={<Themes />} />
            <Route
              path="/institutions"
              element={<Institutions />}
            />
            <Route path="/evidence" element={<Evidence />} />
          </Route>

          <Route path="/login" element={<Login />} />

          <Route
            path="/pending-approval"
            element={<PendingApproval />}
          />

          <Route element={<ProtectedRoute />}>
            <Route path="/staff" element={<StaffLayout />}>
              <Route index element={<Dashboard />} />

              <Route
                path="submissions"
                element={<Submissions />}
              />

              <Route
                path="add-recommendation"
                element={<AddRecommendation />}
              />

              <Route
                path="add-implementation-update"
                element={<AddImplementationUpdate />}
              />

              <Route
                path="add-action"
                element={<AddAction />}
              />

              <Route
                path="add-evidence"
                element={<AddEvidence />}
              />

              <Route element={<RoleGuard minRole="reviewer" />}>
                <Route
                  path="reviewer"
                  element={<ReviewerDashboard />}
                />

                <Route
                  path="review/queue"
                  element={<ReviewQueue />}
                />

                <Route
                  path="review/queue/:submissionId"
                  element={
                    <PagePlaceholder title="Review Submission" />
                  }
                />

                <Route
                  path="review/audit-trail"
                  element={
                    <PagePlaceholder title="Audit Trail" />
                  }
                />
              </Route>

              <Route element={<RoleGuard minRole="administrator" />}>
                <Route
                  path="admin/users"
                  element={
                    <PagePlaceholder title="User Management" />
                  }
                />

                <Route
                  path="admin/institutions"
                  element={
                    <PagePlaceholder title="Institution Management" />
                  }
                />

                <Route
                  path="admin/themes"
                  element={
                    <PagePlaceholder title="Theme Management" />
                  }
                />

                <Route
                  path="admin/upr-cycles"
                  element={
                    <PagePlaceholder title="UPR Cycle Management" />
                  }
                />
              </Route>
            </Route>
          </Route>

          <Route
            path="*"
            element={<Navigate to="/" replace />}
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
