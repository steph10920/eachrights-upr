import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  Search,
  XCircle,
} from "lucide-react";
import { supabase } from "../../lib/supabase";

interface ImplementationRecord {
  id: string;
  title: string | null;
  description: string | null;
  status: string | null;
  progress: number | null;
  country: string | null;
  institution: string | null;
  next_steps: string | null;
  challenges: string | null;
  updated_at: string | null;
  created_at: string;
}

function formatStatus(status: string | null) {
  if (!status) return "Not specified";

  return status
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatDate(date: string | null) {
  if (!date) return "Date not available";

  return new Date(date).toLocaleDateString("en-KE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function getStatusIcon(status: string | null) {
  const normalized = status?.toLowerCase();

  if (
    normalized === "completed" ||
    normalized === "implemented" ||
    normalized === "fully_implemented"
  ) {
    return <CheckCircle2 className="h-4 w-4" />;
  }

  if (
    normalized === "not_implemented" ||
    normalized === "rejected" ||
    normalized === "stalled"
  ) {
    return <XCircle className="h-4 w-4" />;
  }

  return <Clock3 className="h-4 w-4" />;
}

function getStatusClasses(status: string | null) {
  const normalized = status?.toLowerCase();

  if (
    normalized === "completed" ||
    normalized === "implemented" ||
    normalized === "fully_implemented"
  ) {
    return "bg-emerald-50 text-emerald-700";
  }

  if (
    normalized === "not_implemented" ||
    normalized === "rejected" ||
    normalized === "stalled"
  ) {
    return "bg-red-50 text-red-700";
  }

  return "bg-amber-50 text-amber-700";
}

export default function Implementation() {
  const [records, setRecords] = useState<ImplementationRecord[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadImplementation() {
      try {
        setLoading(true);
        setError(null);

        const { data, error: supabaseError } = await supabase
          .from("implementation_updates")
          .select(`
            id,
            title,
            description,
            status,
            progress,
            country,
            institution,
            next_steps,
            challenges,
            updated_at,
            created_at
          `)
          .order("updated_at", {
            ascending: false,
            nullsFirst: false,
          });

        if (supabaseError) {
          throw supabaseError;
        }

        setRecords((data || []) as ImplementationRecord[]);
      } catch (err) {
        console.error("Failed to load implementation updates:", err);

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load implementation updates."
        );
      } finally {
        setLoading(false);
      }
    }

    loadImplementation();
  }, []);

  const statuses = useMemo(() => {
    return Array.from(
      new Set(
        records
          .map((record) => record.status)
          .filter((status): status is string => Boolean(status))
      )
    );
  }, [records]);

  const filteredRecords = useMemo(() => {
    const query = search.trim().toLowerCase();

    return records.filter((record) => {
      const matchesSearch =
        !query ||
        record.title?.toLowerCase().includes(query) ||
        record.description?.toLowerCase().includes(query) ||
        record.country?.toLowerCase().includes(query) ||
        record.institution?.toLowerCase().includes(query) ||
        record.challenges?.toLowerCase().includes(query) ||
        record.next_steps?.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "all" ||
        record.status?.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [records, search, statusFilter]);

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
              UPR Monitoring
            </p>

            <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
              Implementation
            </h1>

            <p className="mt-6 text-lg leading-8 text-slate-600">
              Track progress, actions and developments relating to the
              implementation of Universal Periodic Review recommendations.
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        {/* Search and filters */}
        <div className="mb-10 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search implementation updates..."
                className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            >
              <option value="all">All statuses</option>

              {statuses.map((status) => (
                <option key={status} value={status}>
                  {formatStatus(status)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results count */}
        {!loading && !error && (
          <div className="mb-6">
            <p className="text-sm text-slate-500">
              Showing{" "}
              <span className="font-semibold text-slate-700">
                {filteredRecords.length}
              </span>{" "}
              {filteredRecords.length === 1
                ? "implementation update"
                : "implementation updates"}
            </p>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
            <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-700" />

            <p className="mt-4 text-sm text-slate-500">
              Loading implementation updates...
            </p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
            <h3 className="font-semibold text-red-900">
              Unable to load implementation data
            </h3>

            <p className="mt-2 text-sm leading-6 text-red-700">
              {error}
            </p>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && filteredRecords.length === 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
            <FileText className="mx-auto h-10 w-10 text-slate-300" />

            <h3 className="mt-4 text-lg font-semibold text-slate-900">
              No implementation updates found
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              {search || statusFilter !== "all"
                ? "Try changing your search or filter."
                : "There are currently no public implementation updates."}
            </p>
          </div>
        )}

        {/* Implementation records */}
        {!loading && !error && filteredRecords.length > 0 && (
          <div className="space-y-6">
            {filteredRecords.map((record) => (
              <article
                key={record.id}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md sm:p-8"
              >
                <div className="flex flex-col gap-6 lg:flex-row lg:justify-between">
                  <div className="max-w-3xl">
                    <div className="flex flex-wrap items-center gap-3">
                      <span
                        className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${getStatusClasses(
                          record.status
                        )}`}
                      >
                        {getStatusIcon(record.status)}
                        {formatStatus(record.status)}
                      </span>

                      {record.country && (
                        <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600">
                          {record.country}
                        </span>
                      )}
                    </div>

                    <h2 className="mt-4 text-2xl font-semibold tracking-tight text-slate-950">
                      {record.title || "Implementation update"}
                    </h2>

                    {record.description && (
                      <p className="mt-3 text-sm leading-7 text-slate-600">
                        {record.description}
                      </p>
                    )}
                  </div>

                  <div className="shrink-0 lg:text-right">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Last updated
                    </p>

                    <div className="mt-2 flex items-center gap-2 text-sm text-slate-600 lg:justify-end">
                      <CalendarDays className="h-4 w-4" />
                      {formatDate(record.updated_at || record.created_at)}
                    </div>
                  </div>
                </div>

                {/* Progress */}
                {typeof record.progress === "number" && (
                  <div className="mt-7">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-700">
                        Implementation progress
                      </span>

                      <span className="text-sm font-semibold text-emerald-700">
                        {record.progress}%
                      </span>
                    </div>

                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-emerald-600 transition-all"
                        style={{
                          width: `${Math.min(
                            Math.max(record.progress, 0),
                            100
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                )}

                <div className="mt-7 grid gap-6 md:grid-cols-2">
                  {record.institution && (
                    <div className="rounded-xl bg-slate-50 p-5">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Institution
                      </p>

                      <p className="mt-2 text-sm font-medium leading-6 text-slate-800">
                        {record.institution}
                      </p>
                    </div>
                  )}

                  {record.next_steps && (
                    <div className="rounded-xl bg-slate-50 p-5">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Next steps
                      </p>

                      <p className="mt-2 text-sm leading-6 text-slate-700">
                        {record.next_steps}
                      </p>
                    </div>
                  )}
                </div>

                {record.challenges && (
                  <div className="mt-6 rounded-xl border border-amber-100 bg-amber-50 p-5">
                    <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">
                      Challenges
                    </p>

                    <p className="mt-2 text-sm leading-6 text-amber-900">
                      {record.challenges}
                    </p>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
