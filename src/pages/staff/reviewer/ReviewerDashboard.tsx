import { useMemo } from "react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  FileCheck2,
  FileText,
  History,
  XCircle,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";

import { useAuth } from "../../../hooks/useAuth";
import { useSubmissions } from "../../../hooks/useSubmissions";

function formatDate(value: string | null | undefined) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-KE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function getStatusLabel(status: string) {
  switch (status) {
    case "pending_review":
      return "Pending Review";

    case "changes_requested":
      return "Changes Requested";

    case "approved":
      return "Approved";

    case "rejected":
      return "Rejected";

    default:
      return status.replace(/_/g, " ");
  }
}

function getStatusClasses(status: string) {
  switch (status) {
    case "pending_review":
      return "bg-amber-50 text-amber-700 ring-1 ring-amber-200";

    case "changes_requested":
      return "bg-orange-50 text-orange-700 ring-1 ring-orange-200";

    case "approved":
      return "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200";

    case "rejected":
      return "bg-red-50 text-red-700 ring-1 ring-red-200";

    default:
      return "bg-gray-50 text-gray-600 ring-1 ring-gray-200";
  }
}

interface StatCardProps {
  title: string;
  value: number;
  description: string;
  icon: ReactNode;
  href?: string;
}

function StatCard({
  title,
  value,
  description,
  icon,
  href,
}: StatCardProps) {
  const content = (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>

          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
            {value}
          </p>

          <p className="mt-1 text-xs text-gray-500">{description}</p>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
          {icon}
        </div>
      </div>
    </div>
  );

  return href ? <Link to={href}>{content}</Link> : content;
}

interface ToolCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  href: string;
}

function ToolCard({
  title,
  description,
  icon,
  href,
}: ToolCardProps) {
  return (
    <Link
      to={href}
      className="group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md"
    >
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gray-50 text-gray-700 transition group-hover:bg-emerald-50 group-hover:text-emerald-700">
          {icon}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-gray-900">{title}</h3>

          <p className="mt-1 text-sm leading-6 text-gray-500">
            {description}
          </p>

          <div className="mt-3 flex items-center gap-1 text-sm font-medium text-emerald-700">
            Open
            <ArrowRight
              size={15}
              className="transition-transform group-hover:translate-x-1"
            />
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function ReviewerDashboard() {
  const { user, profile } = useAuth();

  const {
    submissions = [],
    loading,
    error,
    refresh,
  } = useSubmissions();

  const statistics = useMemo(() => {
    return {
      pending: submissions.filter(
        (submission) => submission.status === "pending_review"
      ).length,

      changesRequested: submissions.filter(
        (submission) => submission.status === "changes_requested"
      ).length,

      approved: submissions.filter(
        (submission) => submission.status === "approved"
      ).length,

      rejected: submissions.filter(
        (submission) => submission.status === "rejected"
      ).length,
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

  const reviewerName =
    profile?.full_name?.trim() ||
    profile?.email ||
    user?.email ||
    "Reviewer";

  const reviewerRole = profile?.role || "reviewer";

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <ShieldCheck
                  size={20}
                  className="text-emerald-700"
                />

                <span className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
                  Reviewer Workspace
                </span>
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                Reviewer Dashboard
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
                Welcome, {reviewerName}. Review submissions, verify evidence,
                request corrections, and approve information for publication.
              </p>
            </div>

            <Link
              to="/staff/review/queue"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800"
            >
              <ClipboardCheck size={18} />
              Open Review Queue
            </Link>
          </div>
        </div>

        {/* Reviewer information */}
        <div className="mb-6 rounded-2xl border border-emerald-100 bg-emerald-50/60 p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                Reviewer Account
              </p>

              <p className="mt-1 font-semibold text-gray-900">
                {reviewerName}
              </p>

              <p className="mt-1 text-sm text-gray-600">
                {profile?.organisation || "EACHRights"}
              </p>
            </div>

            <div className="rounded-lg bg-white px-4 py-2 text-sm shadow-sm ring-1 ring-emerald-100">
              <span className="text-gray-500">Role: </span>
              <span className="font-semibold capitalize text-gray-900">
                {reviewerRole}
              </span>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <AlertCircle
              size={18}
              className="mt-0.5 shrink-0"
            />

            <div>
              <p className="font-semibold">
                Unable to load submissions
              </p>

              <p className="mt-1">
                {error}
              </p>

              <button
                type="button"
                onClick={refresh}
                className="mt-3 font-semibold underline underline-offset-2"
              >
                Try again
              </button>
            </div>
          </div>
        )}

        {/* Statistics */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Pending Review"
            value={statistics.pending}
            description="Submissions requiring review"
            icon={<Clock3 size={21} />}
            href="/staff/review/queue"
          />

          <StatCard
            title="Changes Requested"
            value={statistics.changesRequested}
            description="Submissions sent back for corrections"
            icon={<FileText size={21} />}
          />

          <StatCard
            title="Approved"
            value={statistics.approved}
            description="Submissions approved by reviewers"
            icon={<CheckCircle2 size={21} />}
          />

          <StatCard
            title="Rejected"
            value={statistics.rejected}
            description="Submissions that were rejected"
            icon={<XCircle size={21} />}
          />
        </section>

        {/* Review tools */}
        <section className="mt-8">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              Reviewer Tools
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Manage submissions and review activity from one place.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <ToolCard
              title="Review Submissions"
              description="Open pending submissions and assess the information provided."
              icon={<ClipboardCheck size={21} />}
              href="/staff/review/queue"
            />

            <ToolCard
              title="Audit Trail"
              description="View a record of review actions and submission activity."
              icon={<History size={21} />}
              href="/staff/review/audit-trail"
            />

            <ToolCard
              title="All Submissions"
              description="Review the broader submission history and current statuses."
              icon={<FileCheck2 size={21} />}
              href="/staff/submissions"
            />
          </div>
        </section>

        {/* Recent submissions */}
        <section className="mt-8">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Recent Submissions
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                The latest information submitted to the UPR platform.
              </p>
            </div>

            <Link
              to="/staff/review/queue"
              className="hidden items-center gap-1 text-sm font-semibold text-emerald-700 hover:text-emerald-800 sm:flex"
            >
              View queue
              <ArrowRight size={15} />
            </Link>
          </div>

          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            {loading ? (
              <div className="space-y-4 p-6">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="animate-pulse rounded-xl bg-gray-100 p-5"
                  >
                    <div className="h-4 w-1/3 rounded bg-gray-200" />
                    <div className="mt-3 h-3 w-2/3 rounded bg-gray-200" />
                    <div className="mt-3 h-3 w-1/4 rounded bg-gray-200" />
                  </div>
                ))}
              </div>
            ) : recentSubmissions.length === 0 ? (
              <div className="p-10 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-500">
                  <FileText size={21} />
                </div>

                <h3 className="mt-4 font-semibold text-gray-900">
                  No submissions yet
                </h3>

                <p className="mx-auto mt-1 max-w-md text-sm leading-6 text-gray-500">
                  Submitted information will appear here once staff members
                  begin sending records for review.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {recentSubmissions.map((submission) => (
                  <div
                    key={submission.id}
                    className="p-5 transition hover:bg-gray-50"
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-semibold text-gray-900">
                            {submission.summary || "Untitled Submission"}
                          </h3>

                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${getStatusClasses(
                              submission.status
                            )}`}
                          >
                            {getStatusLabel(submission.status)}
                          </span>
                        </div>

                        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
                          <span>
                            Type:{" "}
                            <span className="font-medium capitalize text-gray-700">
                              {submission.entity_type?.replace(/_/g, " ") ||
                                "—"}
                            </span>
                          </span>

                          <span>
                            Submitted by:{" "}
                            <span className="font-medium text-gray-700">
                              {submission.submitted_by_name ||
                                "Unknown user"}
                            </span>
                          </span>

                          {submission.submitted_by_organisation && (
                            <span>
                              Organisation:{" "}
                              <span className="font-medium text-gray-700">
                                {submission.submitted_by_organisation}
                              </span>
                            </span>
                          )}

                          <span>
                            {formatDate(submission.submitted_at)}
                          </span>
                        </div>
                      </div>

                      {submission.status === "pending_review" && (
                        <Link
                          to={`/staff/review/queue/${submission.id}`}
                          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
                        >
                          Review
                          <ArrowRight size={15} />
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Reviewer responsibilities */}
        <section className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
              <ShieldCheck size={21} />
            </div>

            <div>
              <h2 className="font-bold text-gray-900">
                Reviewer Responsibilities
              </h2>

              <ul className="mt-3 grid gap-2 text-sm leading-6 text-gray-600 md:grid-cols-2">
                <li>• Check submitted information for completeness.</li>
                <li>• Verify supporting evidence and references.</li>
                <li>• Request corrections where information needs revision.</li>
                <li>• Approve or reject submissions based on the review.</li>
                <li>• Record appropriate review notes.</li>
                <li>• Approve validated information for publication.</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
