import { useEffect, useMemo, useState } from "react";
import { Building2, Search, MapPin, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "../../lib/supabase";

interface Institution {
  id: string;
  name: string;
  institution_type: string | null;
  country: string | null;
  description: string | null;
  website: string | null;
}

function formatInstitutionType(type: string | null) {
  if (!type) return "Institution";

  return type
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default function Institutions() {
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadInstitutions() {
      try {
        setLoading(true);
        setError(null);

        const { data, error: supabaseError } = await supabase
          .from("institutions")
          .select(`
            id,
            name,
            institution_type,
            country,
            description,
            website
          `)
          .order("name", { ascending: true });

        if (supabaseError) {
          throw supabaseError;
        }

        setInstitutions((data || []) as Institution[]);
      } catch (err) {
        console.error("Failed to load institutions:", err);

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load institutions."
        );
      } finally {
        setLoading(false);
      }
    }

    loadInstitutions();
  }, []);

  const filteredInstitutions = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return institutions;

    return institutions.filter((institution) => {
      return (
        institution.name.toLowerCase().includes(query) ||
        institution.country?.toLowerCase().includes(query) ||
        institution.institution_type?.toLowerCase().includes(query) ||
        institution.description?.toLowerCase().includes(query)
      );
    });
  }, [institutions, search]);

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
              UPR Stakeholders
            </p>

            <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
              Institutions
            </h1>

            <p className="mt-6 text-lg leading-8 text-slate-600">
              Explore institutions and organisations connected to the
              monitoring, implementation and documentation of Universal
              Periodic Review recommendations.
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        {/* Search and count */}
        <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-950">
              Institution directory
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {filteredInstitutions.length}{" "}
              {filteredInstitutions.length === 1
                ? "institution"
                : "institutions"}
            </p>
          </div>

          <div className="relative w-full md:max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search institutions..."
              className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            />
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
            <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-700" />

            <p className="mt-4 text-sm text-slate-500">
              Loading institutions...
            </p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
            <h3 className="font-semibold text-red-900">
              Unable to load institutions
            </h3>

            <p className="mt-2 text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && filteredInstitutions.length === 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
            <Building2 className="mx-auto h-10 w-10 text-slate-300" />

            <h3 className="mt-4 text-lg font-semibold text-slate-900">
              No institutions found
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              {search
                ? "Try a different search term."
                : "There are currently no institutions available."}
            </p>
          </div>
        )}

        {/* Institution cards */}
        {!loading && !error && filteredInstitutions.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredInstitutions.map((institution) => (
              <article
                key={institution.id}
                className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                    <Building2 className="h-6 w-6" />
                  </div>

                  {institution.institution_type && (
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                      {formatInstitutionType(
                        institution.institution_type
                      )}
                    </span>
                  )}
                </div>

                <h3 className="mt-5 text-lg font-semibold leading-7 text-slate-950">
                  {institution.name}
                </h3>

                {institution.country && (
                  <div className="mt-3 flex items-center gap-2 text-sm text-slate-500">
                    <MapPin className="h-4 w-4 shrink-0" />

                    <span>{institution.country}</span>
                  </div>
                )}

                {institution.description && (
                  <p className="mt-4 line-clamp-4 text-sm leading-6 text-slate-600">
                    {institution.description}
                  </p>
                )}

                <div className="mt-auto pt-6">
                  {institution.website ? (
                    <a
                      href={institution.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 transition hover:text-emerald-800"
                    >
                      Visit website
                      <ArrowRight className="h-4 w-4" />
                    </a>
                  ) : (
                    <span className="text-sm text-slate-400">
                      Website not available
                    </span>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Information section */}
        <div className="mt-16 rounded-2xl bg-slate-900 p-8 text-white sm:p-10">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-300">
              Universal Periodic Review
            </p>

            <h2 className="mt-2 text-2xl font-semibold">
              Institutions in the UPR process
            </h2>

            <p className="mt-3 text-sm leading-7 text-slate-300">
              Institutions play different roles in the UPR process, including
              developing policies, implementing recommendations, monitoring
              progress, producing evidence and supporting accountability.
              This directory provides a structured reference for institutions
              associated with the UPR monitoring ecosystem.
            </p>

            <Link
              to="/recommendations"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
            >
              Explore recommendations
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
