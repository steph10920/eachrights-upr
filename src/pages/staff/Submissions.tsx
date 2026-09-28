import { useMemo, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  FileCheck2,
  FileText,
  RefreshCw,
  Search,
  XCircle,
} from "lucide-react";
import { Link } from "react-router-dom";

import { useSubmissions } from "../../hooks/useSubmissions";

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
    hour: "2-digit",
    minute: "2-digit",
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

function getStatusIcon(status: string) {
  switch (status) {
    case "pending_review":
      return <Clock3 size={15} />;

    case "changes_requested":
      return <AlertCircle size={15} />;

    case "approved":
      return <CheckCircle2 size={15} />;

    case "rejected":
      return <XCircle size={15} />;

    default:
      return <FileText size={15} />;
  }
}

function getEntityLabel(entityType: string) {
  switch (entityType) {
    case "recommendation":
      return "Recommendation";

    case "implementation_update":
      return "Implementation Update";

    case "action":
      return "Action";

    case "evidence":
      return "Evidence";

    default:
      return entityType.replace(/_/g, " ");
  }
}

export default function Submissions() {
  const {
    submissions,
    loading,
    error,
    refresh,
  } = useSubmissions();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const filteredSubmissions = useMemo(() => {
    const query = search.trim().toLowerCase();

    return submissions.filter((submission) => {
      const matchesSearch =
        !query ||
        submission.summary.toLowerCase().includes(query) ||
        submission.submitted_by_name
          .toLowerCase()
          .includes(query) ||
        (submission.submitted_by_organisation || "")
          .toLowerCase()
          .includes(query) ||
        submission.entity_type
          .toLowerCase()
          .includes(query);

      const matchesStatus =
        statusFilter === "all" ||
        submission.status === statusFilter;

      const matchesType =
        typeFilter === "all" ||
        submission.entity_type === typeFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesType
      );
    });
  }, [
    submissions,
    search,
    statusFilter,
    typeFilter,
  ]);

  const statistics = useMemo(() => {
    return {
      total: submissions.length,

      pending: submissions.filter(
        (submission) =>
          submission.status === "pending_review"
      ).length,

      approved: submissions.filter(
        (submission) =>
          submission.status === "approved"
      ).length,

      changesRequested: submissions.filter(
        (submission) =>
          submission.status === "changes_requested"
      ).length,

      rejected: submissions.filter(
        (submission) =>
          submission.status === "rejected"
      ).length,
    };
  }, [submissions]);

  const entityTypes = useMemo(() => {
    return Array.from(
      new Set(
        submissions.map(
          (submission) => submission.entity_type
        )
      )
    );
  }, [submissions]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <FileCheck2
                size={20}
                className="text-emerald-700"
              />

              <span className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
                Submission Management
              </span>
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Submissions
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
              View information submitted to the UPR platform,
              monitor review status, and access records requiring
              further action.
            </p>
          </div>

          <button
            type="button"
            onClick={refresh}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw
              size={17}
              className={loading ? "animate-spin" : ""}
            />

            Refresh
          </button>
        </div>

        {/* Statistics */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">
              Total
            </p>

            <p className="mt-2 text-3xl font-bold text-gray-900">
              {statistics.total}
            </p>
          </div>

          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 shadow-sm">
            <p className="text-sm text-amber-700">
              Pending Review
            </p>

            <p className="mt-2 text-3xl font-bold text-amber-800">
              {statistics.pending}
            </p>
          </div>

          <div className="rounded-2xl border border-orange-200 bg-orange-50 p-5 shadow-sm">
            <p className="text-sm text-orange-700">
              Changes Requested
            </p>

            <p className="mt-2 text-3xl font-bold text-orange-800">
              {statistics.changesRequested}
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 shadow-sm">
            <p className="text-sm text-emerald-700">
              Approved
            </p>

            <p className="mt-2 text-3xl font-bold text-emerald-800">
              {statistics.approved}
            </p>
          </div>

          <div className="rounded-2xl border border-red-200 bg-red-50 p-5 shadow-sm">
            <p className="text-sm text-red-700">
              Rejected
            </p>

            <p className="mt-2 text-3xl font-bold text-red-800">
              {statistics.rejected}
            </p>
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
                className="mt-2 font-semibold underline underline-offset-2"
              >
                Try again
              </button>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="grid gap-4 lg:grid-cols-[1fr_200px_220px]">

            {/* Search */}
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search submissions, users or organisations..."
                className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />
            </div>

            {/* Status */}
            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value)
              }
              className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            >
              <option value="all">
                All statuses
              </option>

              <option value="pending_review">
                Pending Review
              </option>

              <option value="changes_requested">
                Changes Requested
              </option>

              <option value="approved">
                Approved
              </option>

              <option value="rejected">
                Rejected
              </option>
            </select>

            {/* Entity type */}
            <select
              value={typeFilter}
              onChange={(event) =>
                setTypeFilter(event.target.value)
              }
              className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            >
              <option value="all">
                All submission types
              </option>

              {entityTypes.map((type) => (
                <option key={type} value={type}>
                  {getEntityLabel(type)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results */}
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

          {/* Desktop table */}
          <div className="hidden overflow-x-auto lg:block">
            <table className="w-full text-left">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Submission
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Submitter
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Type
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Status
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Submitted
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-12 text-center"
                    >
                      <RefreshCw
                        size={22}
                        className="mx-auto animate-spin text-emerald-700"
                      />

                      <p className="mt-3 text-sm text-gray-500">
                        Loading submissions...
                      </p>
                    </td>
                  </tr>
                ) : filteredSubmissions.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-12 text-center"
                    >
                      <FileText
                        size={28}
                        className="mx-auto text-gray-300"
                      />

                      <p className="mt-3 font-semibold text-gray-900">
                        No submissions found
                      </p>

                      <p className="mt-1 text-sm text-gray-500">
                        Try changing your search or filters.
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredSubmissions.map(
                    (submission) => (
                      <tr
                        key={submission.id}
                        className="transition hover:bg-gray-50"
                      >
                        <td className="px-6 py-5">
                          <div className="max-w-sm">
                            <p className="font-semibold text-gray-900">
                              {submission.summary}
                            </p>

                            <p className="mt-1 truncate text-xs text-gray-400">
                              ID: {submission.id}
                            </p>
                          </div>
                        </td>

                        <td className="px-6 py-5">
                          <p className="text-sm font-medium text-gray-900">
                            {submission.submitted_by_name}
                          </p>

                          <p className="mt-1 text-xs text-gray-500">
                            {submission.submitted_by_organisation ||
                              submission.submitted_by_email ||
                              "—"}
                          </p>
                        </td>

                        <td className="px-6 py-5">
                          <span className="text-sm text-gray-700">
                            {getEntityLabel(
                              submission.entity_type
                            )}
                          </span>
                        </td>

                        <td className="px-6 py-5">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${getStatusClasses(
                              submission.status
                            )}`}
                          >
                            {getStatusIcon(
                              submission.status
                            )}

                            {getStatusLabel(
                              submission.status
                            )}
                          </span>
                        </td>

                        <td className="whitespace-nowrap px-6 py-5 text-sm text-gray-500">
                          {formatDate(
                            submission.submitted_at
                          )}
                        </td>

                        <td className="px-6 py-5 text-right">
                          {submission.status ===
                          "pending_review" ? (
                            <Link
                              to={`/staff/review/queue/${submission.id}`}
                              className="font-semibold text-emerald-700 hover:text-emerald-800"
                            >
                              Review
                            </Link>
                          ) : (
                            <span className="text-sm text-gray-400">
                              —
                            </span>
                          )}
                        </td>
                      </tr>
                    )
                  )
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile / tablet cards */}
          <div className="divide-y divide-gray-100 lg:hidden">
            {loading ? (
              <div className="p-10 text-center">
                <RefreshCw
                  size={22}
                  className="mx-auto animate-spin text-emerald-700"
                />

                <p className="mt-3 text-sm text-gray-500">
                  Loading submissions...
                </p>
              </div>
            ) : filteredSubmissions.length === 0 ? (
              <div className="p-10 text-center">
                <FileText
                  size={28}
                  className="mx-auto text-gray-300"
                />

                <p className="mt-3 font-semibold text-gray-900">
                  No submissions found
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  Try changing your search or filters.
                </p>
              </div>
            ) : (
              filteredSubmissions.map(
                (submission) => (
                  <div
                    key={submission.id}
                    className="p-5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <h3 className="font-semibold text-gray-900">
                          {submission.summary}
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                          {submission.submitted_by_name}
                        </p>
                      </div>

                      <span
                        className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusClasses(
                          submission.status
                        )}`}
                      >
                        {getStatusIcon(
                          submission.status
                        )}

                        {getStatusLabel(
                          submission.status
                        )}
                      </span>
                    </div>

                    <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                      <div>
                        <p className="text-xs text-gray-400">
                          Type
                        </p>

                        <p className="mt-1 font-medium text-gray-700">
                          {getEntityLabel(
                            submission.entity_type
                          )}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-400">
                          Submitted
                        </p>

                        <p className="mt-1 font-medium text-gray-700">
                          {formatDate(
                            submission.submitted_at
                          )}
                        </p>
                      </div>
                    </div>

                    {submission.status ===
                      "pending_review" && (
                      <Link
                        to={`/staff/review/queue/${submission.id}`}
                        className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800"
                      >
                        Review Submission
                      </Link>
                    )}
                  </div>
                )
              )
            )}
          </div>
        </div>

        {/* Result count */}
        {!loading &&
          filteredSubmissions.length > 0 && (
            <p className="mt-4 text-sm text-gray-500">
              Showing{" "}
              <span className="font-semibold text-gray-700">
                {filteredSubmissions.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-gray-700">
                {submissions.length}
              </span>{" "}
              submissions.
            </p>
          )}
      </div>
    </div>
  );
}
