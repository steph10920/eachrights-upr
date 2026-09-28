
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FileText,
  PlusCircle,
  ClipboardCheck,
  Database,
  LogOut,
  User,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";

import { useAuth } from "../../hooks/useAuth";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);

  const displayName =
    profile?.full_name?.trim() ||
    user?.email ||
    "Staff Member";

  const role = profile?.role || "staff";

  const organisation =
    profile?.organisation?.trim() || "EACHRights";

  async function handleLogout() {
    try {
      setLoggingOut(true);

      await signOut();

      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
      setLoggingOut(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* HEADER */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <p className="text-sm font-medium text-slate-500">
              EACHRights UPR Dashboard
            </p>

            <h1 className="mt-1 text-2xl font-bold text-slate-900">
              Staff Dashboard
            </h1>
          </div>

          {/* USER + LOGOUT */}
          <div className="flex items-center gap-4">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-slate-900">
                {displayName}
              </p>

              <p className="text-xs capitalize text-slate-500">
                {role}
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">
              <User size={20} className="text-slate-600" />
            </div>

            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loggingOut ? (
                <RefreshCw size={16} className="animate-spin" />
              ) : (
                <LogOut size={16} />
              )}

              {loggingOut ? "Signing out..." : "Logout"}
            </button>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* WELCOME */}
        <section className="mb-8 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
            <div>
              <p className="mb-2 text-sm font-medium text-slate-500">
                Welcome back
              </p>

              <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                {displayName}
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                {organisation}
                {" · "}
                <span className="capitalize">{role}</span>
              </p>
            </div>

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
              <ShieldCheck
                size={28}
                className="text-slate-700"
              />
            </div>
          </div>
        </section>

        {/* STATS */}
        <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="My Submissions"
            value="0"
            icon={<FileText size={22} />}
          />

          <StatCard
            label="Pending Review"
            value="0"
            icon={<ClipboardCheck size={22} />}
          />

          <StatCard
            label="Approved"
            value="0"
            icon={<ShieldCheck size={22} />}
          />

          <StatCard
            label="Evidence Records"
            value="0"
            icon={<Database size={22} />}
          />
        </section>

        {/* QUICK ACTIONS */}
        <section className="mt-8">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-slate-900">
              Quick Actions
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Add and manage UPR information from your workspace.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            <ActionCard
              to="/staff/add-recommendation"
              title="Add Recommendation"
              description="Record a UPR recommendation."
              icon={<PlusCircle size={22} />}
            />

            <ActionCard
              to="/staff/add-implementation-update"
              title="Add Implementation Update"
              description="Record progress made on a recommendation."
              icon={<ClipboardCheck size={22} />}
            />

            <ActionCard
              to="/staff/add-evidence"
              title="Add Evidence"
              description="Upload or record supporting evidence."
              icon={<Database size={22} />}
            />
          </div>
        </section>

        {/* STAFF TOOLS */}
        <section className="mt-10">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-slate-900">
              Staff Tools
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Access your submissions and review workspace.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            <ActionCard
              to="/staff/submissions"
              title="My Submissions"
              description="View submissions you have created."
              icon={<FileText size={22} />}
            />

            {(role === "reviewer" ||
              role === "administrator") && (
              <ActionCard
                to="/staff/review/queue"
                title="Review Queue"
                description="Review and process submitted records."
                icon={<ClipboardCheck size={22} />}
              />
            )}

            {role === "administrator" && (
              <ActionCard
                to="/staff/admin/users"
                title="Manage Users"
                description="Manage staff accounts and permissions."
                icon={<ShieldCheck size={22} />}
              />
            )}
          </div>
        </section>

        {/* ACCOUNT INFORMATION */}
        <section className="mt-10 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <h2 className="text-lg font-bold text-slate-900">
            Account Information
          </h2>

          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <InfoItem
              label="Full Name"
              value={profile?.full_name || "Not provided"}
            />

            <InfoItem
              label="Email"
              value={profile?.email || user?.email || "Not available"}
            />

            <InfoItem
              label="Organisation"
              value={profile?.organisation || "Not provided"}
            />

            <InfoItem
              label="Role"
              value={role}
              capitalize
            />

            <InfoItem
              label="Account Status"
              value={profile?.account_status || "Unknown"}
              capitalize
            />
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 text-xs text-slate-500">
          <p>
            EACHRights UPR Dashboard
          </p>

          <p>
            Secure staff workspace
          </p>
        </div>
      </footer>
    </div>
  );
}

/* -------------------------------------------------- */
/* STAT CARD */
/* -------------------------------------------------- */

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
      <div className="flex items-center justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
          {icon}
        </div>

        <span className="text-2xl font-bold text-slate-900">
          {value}
        </span>
      </div>

      <p className="mt-4 text-sm font-medium text-slate-500">
        {label}
      </p>
    </div>
  );
}

/* -------------------------------------------------- */
/* ACTION CARD */
/* -------------------------------------------------- */

function ActionCard({
  to,
  title,
  description,
  icon,
}: {
  to: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <Link
      to={to}
      className="group rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-700 transition group-hover:bg-slate-200">
        {icon}
      </div>

      <h3 className="mt-5 font-semibold text-slate-900">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        {description}
      </p>

      <span className="mt-4 inline-block text-sm font-semibold text-slate-700">
        Open →
      </span>
    </Link>
  );
}

/* -------------------------------------------------- */
/* ACCOUNT INFO */
/* -------------------------------------------------- */

function InfoItem({
  label,
  value,
  capitalize = false,
}: {
  label: string;
  value: string;
  capitalize?: boolean;
}) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p
        className={`mt-1 text-sm font-semibold text-slate-800 ${
          capitalize ? "capitalize" : ""
        }`}
      >
        {value}
      </p>
    </div>
  );
}
