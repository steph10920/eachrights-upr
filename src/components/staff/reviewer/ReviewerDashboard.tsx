import { useMemo } from "react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  FileCheck2,
  FileText,
  ShieldCheck,
  XCircle,
} from "lucide-react";

import { useAuth } from "../../../hooks/useAuth";
import { useSubmissions } from "../../../hooks/useSubmissions";

export default function ReviewerDashboard() {
  const { profile } = useAuth();

  const {
    submissions,
    loading,
    error,
  } = useSubmissions();

  const stats = useMemo(() => {
    const pending = submissions.filter(
      (submission) =>
        submission.status === "pending_review" ||
        submission.status === "submitted" ||
        submission.status === "under_review"
    ).length;

    const changesRequested = submissions.filter(
      (submission) =>
        submission.status === "changes_requested"
    ).length;

    const approved = submissions.filter(
      (submission) =>
        submission.status === "approved"
    ).length;

    const rejected = submissions.filter(
      (submission) =>
        submission.status === "rejected"
    ).length;

    return {
      pending,
      changesRequested,
      approved,
      rejected,
    };
  }, [submissions]);

  const recentSubmissions = useMemo(() => {
    return [...submissions]
      .sort(
        (a, b) =>
          new Date(b.submitted_at).getTime() -
          new Date(a.submitted_at).getTime()
      )
      .slice(0, 6);
  }, [submissions]);

  const displayName =
    profile?.full_name ||
    profile?.email ||
    "Reviewer";

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
              Reviewer Dashboard
            </h1>
          </div>

          <div className="text-right">
            <p className="text-sm font-semibold text-slate-900">
              {displayName}
            </p>

            <p className="text-xs capitalize text-slate-500">
              {profile?.role || "reviewer"}
            </p>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* INTRO */}
        <section className="mb-8 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Welcome back
              </p>

              <h2 className="mt-1 text-3xl font-bold text-slate-900">
                {displayName}
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Review submitted UPR information, verify supporting
                evidence, request corrections, and approve information
                for publication.
              </p>
            </div>

            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-slate-100">
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
            label="Pending Review"
            value={stats.pending}
            icon={<ClipboardCheck size={22} />}
          />

          <StatCard
            label="Corrections Requested"
            value={stats.changesRequested}
            icon={<AlertCircle size={22} />}
          />

          <StatCard
            label="Approved"
            value={stats.approved}
            icon={<CheckCircle2 size={22} />}
          />

          <StatCard
            label="Rejected"
            value={stats.rejected}
            icon={<XCircle size={22} />}
          />
        </section>

        {/* REVIEW QUEUE */}
        <section className="mt-10">
          <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Review Queue
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Submissions requiring reviewer attention.
              </p>
            </div>

            <Link
              to="/staff/review/queue"
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-slate-900"
            >
              View full queue
              <ArrowRight size={16} />
            </Link>
          </div>

          {loading && (
            <div className="rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-slate-200">
              <p className="text-sm text-slate-500">
                Loading submissions...
              </p>
            </div>
          )}

          {error && !loading && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
              <div className="flex gap-3">
                <AlertCircle
                  size={20}
                  className="mt-0.5 shrink-0 text-red-600"
                />

                <div>
                  <h3 className="font-semibold text-red-900">
                    Unable to load review queue
                  </h3>

                  <p className="mt-1 text-sm text-red-700">
                    {error}
                  </p>
                </div>
              </div>
            </div>
          )}

          {!loading &&
            !error &&
            recentSubmissions.length === 0 && (
              <div className="rounded-2xl bg-white p-10 text-center shadow-sm ring-1 ring-slate-200">
                <FileCheck2
                  size={36}
                  className="mx-auto text-slate-400"
                />

                <h3 className="mt-4 font-semibold text-slate-900">
                  No submissions awaiting review
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  New submissions will appear here when contributors
                  send information for review.
                </p>
              </div>
            )}

          {!loading &&
            !error &&
            recentSubmissions.length > 0 && (
              <div className="space-y-4">
                {recentSubmissions.map((submission) => (
                  <SubmissionCard
                    key={submission.id}
                    submission={submission}
                  />
                ))}
              </div>
            )}
        </section>

        {/* REVIEWER TOOLS */}
        <section className="mt-10">
          <h2 className="text-xl font-bold text-slate-900">
            Reviewer Tools
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Access the tools you need to process UPR information.
          </p>

          <div className="mt-5 grid gap-5 md:grid-cols-3">
            <ToolCard
              to="/staff/review/queue"
              title="Review Submissions"
              description="Review submitted recommendations, updates, actions and evidence."
              icon={<FileText size={22} />}
            />

            <ToolCard
              to="/staff/review/audit-trail"
              title="Audit Trail"
              description="View the history of review and approval actions."
              icon={<ClipboardCheck size={22} />}
            />

            <ToolCard
              to="/staff/submissions"
              title="All Submissions"
              description="View the submissions available to your account."
              icon={<FileCheck2 size={22} />}
            />
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="mt-10 border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-5 text-xs text-slate-500">
          EACHRights UPR Dashboard · Reviewer Workspace
        </div>
      </footer>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* STAT CARD */
/* -------------------------------------------------------------------------- */

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: ReactNode;
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

/* -------------------------------------------------------------------------- */
/* SUBMISSION CARD */
/* -------------------------------------------------------------------------- */

function SubmissionCard({
  submission,
}: {
  submission: {
    id: string;
    summary: string;
    entity_type: string;
    submitted_by_name: string;
    submitted_by_organisation: string | null;
    submitted_at: string;
    status: string;
  };
}) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold capitalize text-slate-700">
              {submission.entity_type.replaceAll("_", " ")}
            </span>

            <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
              {submission.status.replaceAll("_", " ")}
            </span>
          </div>

          <h3 className="mt-3 text-lg font-bold text-slate-900">
            {submission.summary}
          </h3>

          <div className="mt-2 text-sm text-slate-500">
            <span>
              Submitted by {submission.submitted_by_name}
            </span>

            {submission.submitted_by_organisation && (
              <span>
                {" · "}
                {submission.submitted_by_organisation}
              </span>
            )}

            <span>
              {" · "}
              {formatDate(submission.submitted_at)}
            </span>
          </div>
        </div>

        <Link
          to={`/staff/review/queue/${submission.id}`}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          Review
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* TOOL CARD */
/* -------------------------------------------------------------------------- */

function ToolCard({
  to,
  title,
  description,
  icon,
}: {
  to: string;
  title: string;
  description: string;
  icon: ReactNode;
}) {
  return (
    <Link
      to={to}
      className="group rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
        {icon}
      </div>

      <h3 className="mt-5 font-semibold text-slate-900">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        {description}
      </p>

      <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-slate-700">
        Open
        <ArrowRight
          size={15}
          className="transition-transform group-hover:translate-x-1"
        />
      </span>
    </Link>
  );
}

/* -------------------------------------------------------------------------- */
/* HELPERS */
/* -------------------------------------------------------------------------- */

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-KE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
