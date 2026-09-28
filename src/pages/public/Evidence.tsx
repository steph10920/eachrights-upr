import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CalendarDays,
  ExternalLink,
  FileText,
  Search,
} from "lucide-react";
import { supabase } from "../../lib/supabase";

interface EvidenceRecord {
  id: string;
  title: string;
  description: string | null;
  evidence_type: string;
  source_name: string | null;
  source_url: string | null;
  publication_date: string | null;
  created_at: string;
}

function formatDate(date: string | null) {
  if (!date) return "Date not available";

  return new Date(date).toLocaleDateString("en-KE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatEvidenceType(type: string) {
  return type
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default function Evidence() {
  const [evidence, setEvidence] = useState<EvidenceRecord[]>([]);
  const [filteredEvidence, setFilteredEvidence] = useState<EvidenceRecord[]>(
    []
  );
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadEvidence() {
      try {
        setLoading(true);
        setError(null);

        const { data, error: supabaseError } = await supabase
          .from("evidence")
          .select(
            `
              id,
              title,
              description,
              evidence_type,
              source_name,
              source_url,
              publication_date,
              created_at
            `
          )
          .order("publication_date", {
            ascending: false,
            nullsFirst: false,
          });

        if (supabaseError) {
          throw supabaseError;
        }

        const records = (data || []) as EvidenceRecord[];

        setEvidence(records);
        setFilteredEvidence(records);
      } catch (err) {
        console.error("Failed to load evidence:", err);

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load evidence records."
        );
      } finally {
        setLoading(false);
      }
    }

    loadEvidence();
  }, []);

  useEffect(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      setFilteredEvidence(evidence);
      return;
    }

    const filtered = evidence.filter((item) => {
      return (
        item.title.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query) ||
        item.evidence_type.toLowerCase().includes(query) ||
        item.source_name?.toLowerCase().includes(query)
      );
    });

    setFilteredEvidence(filtered);
  }, [search, evidence]);

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
              Evidence & Documentation
            </p>

            <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
              Evidence
            </h1>

            <p className="mt-6 text-lg leading-8 text-slate-600">
              Explore documented evidence supporting the monitoring and
              implementation of human rights recommendations across the
              Universal Periodic Review process.
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        {/* Search */}
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-950">
              Evidence records
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {filteredEvidence.length}{" "}
              {filteredEvidence.length === 1 ? "record" : "records"} available
            </p>
          </div>

          <div className="relative w-full sm:max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search evidence..."
              className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            />
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-700" />

            <p className="mt-4 text-sm text-slate-500">
              Loading evidence...
            </p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
            <h3 className="font-semibold text-red-900">
              Unable to load evidence
            </h3>

            <p className="mt-2 text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && filteredEvidence.length === 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
            <FileText className="mx-auto h-10 w-10 text-slate-300" />

            <h3 className="mt-4 text-lg font-semibold text-slate-900">
              No evidence found
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              {search
                ? "Try a different search term."
                : "There are currently no public evidence records available."}
            </p>
          </div>
        )}

        {/* Evidence cards */}
        {!loading && !error && filteredEvidence.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredEvidence.map((item) => (
              <article
                key={item.id}
                className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                    <FileText className="h-5 w-5" />
                  </div>

                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                    {formatEvidenceType(item.evidence_type)}
                  </span>
                </div>

                <h3 className="mt-5 text-lg font-semibold leading-7 text-slate-950">
                  {item.title}
                </h3>

                {item.description && (
                  <p className="mt-3 line-clamp-4 text-sm leading-6 text-slate-600">
                    {item.description}
                  </p>
                )}

                <div className="mt-5 space-y-2">
                  {item.source_name && (
                    <p className="text-sm text-slate-500">
                      <span className="font-medium text-slate-700">
                        Source:
                      </span>{" "}
                      {item.source_name}
                    </p>
                  )}

                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <CalendarDays className="h-4 w-4" />

                    <span>{formatDate(item.publication_date)}</span>
                  </div>
                </div>

                <div className="mt-auto pt-6">
                  {item.source_url ? (
                    <a
                      href={item.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 transition hover:text-emerald-800"
                    >
                      View source
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  ) : (
                    <span className="inline-flex items-center gap-2 text-sm font-medium text-slate-400">
                      Source unavailable
                    </span>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Staff contribution CTA */}
        <div className="mt-16 rounded-2xl bg-slate-900 p-8 text-white sm:p-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-300">
                EACHRights Staff
              </p>

              <h2 className="mt-2 text-2xl font-semibold">
                Have evidence to contribute?
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-300">
                Staff members can submit evidence through the secure dashboard
                for review before it is made available publicly.
              </p>
            </div>

            <Link
              to="/login"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
            >
              Staff sign in
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
