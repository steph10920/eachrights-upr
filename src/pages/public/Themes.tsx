import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Layers3, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "../../lib/supabase";

interface Theme {
  id: string;
  name: string;
  description: string | null;
}

export default function Themes() {
  const [themes, setThemes] = useState<Theme[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadThemes() {
      try {
        setLoading(true);
        setError(null);

        const { data, error: supabaseError } = await supabase
          .from("themes")
          .select(`
            id,
            name,
            description
          `)
          .order("name", { ascending: true });

        if (supabaseError) {
          throw supabaseError;
        }

        setThemes((data || []) as Theme[]);
      } catch (err) {
        console.error("Failed to load themes:", err);

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load themes."
        );
      } finally {
        setLoading(false);
      }
    }

    loadThemes();
  }, []);

  const filteredThemes = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return themes;
    }

    return themes.filter((theme) => {
      return (
        theme.name.toLowerCase().includes(query) ||
        theme.description?.toLowerCase().includes(query)
      );
    });
  }, [themes, search]);

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
              UPR Monitoring Framework
            </p>

            <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
              Themes
            </h1>

            <p className="mt-6 text-lg leading-8 text-slate-600">
              Explore the thematic areas used to organise, monitor and analyse
              Universal Periodic Review recommendations and their
              implementation.
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        {/* Header and search */}
        <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-950">
              Thematic areas
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {filteredThemes.length}{" "}
              {filteredThemes.length === 1 ? "theme" : "themes"}
            </p>
          </div>

          <div className="relative w-full md:max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search themes..."
              className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            />
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
            <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-700" />

            <p className="mt-4 text-sm text-slate-500">
              Loading themes...
            </p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
            <h3 className="font-semibold text-red-900">
              Unable to load themes
            </h3>

            <p className="mt-2 text-sm text-red-700">
              {error}
            </p>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && filteredThemes.length === 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
            <Layers3 className="mx-auto h-10 w-10 text-slate-300" />

            <h3 className="mt-4 text-lg font-semibold text-slate-900">
              No themes found
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              {search
                ? "Try a different search term."
                : "There are currently no themes available."}
            </p>
          </div>
        )}

        {/* Theme cards */}
        {!loading && !error && filteredThemes.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredThemes.map((theme, index) => (
              <article
                key={theme.id}
                className="group flex min-h-[240px] flex-col rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                    <Layers3 className="h-6 w-6" />
                  </div>

                  <span className="text-sm font-semibold text-slate-300">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                <h3 className="mt-6 text-xl font-semibold text-slate-950">
                  {theme.name}
                </h3>

                {theme.description && (
                  <p className="mt-3 line-clamp-4 text-sm leading-6 text-slate-600">
                    {theme.description}
                  </p>
                )}

                <div className="mt-auto pt-6">
                  <Link
                    to={`/recommendations?theme=${encodeURIComponent(
                      theme.id
                    )}`}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 transition group-hover:text-emerald-800"
                  >
                    View recommendations
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Information section */}
        <div className="mt-16 rounded-2xl bg-slate-900 p-8 text-white sm:p-10">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-300">
              Evidence-based monitoring
            </p>

            <h2 className="mt-2 text-2xl font-semibold">
              Organising UPR information by theme
            </h2>

            <p className="mt-3 text-sm leading-7 text-slate-300">
              Thematic classification helps users explore recommendations,
              implementation updates, actions and supporting evidence across
              specific human rights areas.
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
