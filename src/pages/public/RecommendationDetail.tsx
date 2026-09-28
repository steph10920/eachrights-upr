
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { supabase } from "../../lib/supabase";

interface Recommendation {
  id: string;
  recommendation: string;
  country: string | null;
  cycle: string | null;
  theme: string | null;
  institution: string | null;
  response: string | null;
  created_at: string;
}

function formatValue(value: string | null) {
  if (!value) return "Not specified";

  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-KE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function responseClasses(response: string | null) {
  switch (response?.toLowerCase()) {
    case "accepted":
      return "bg-emerald-50 text-emerald-700";

    case "noted":
      return "bg-amber-50 text-amber-700";

    case "rejected":
      return "bg-red-50 text-red-700";

    default:
      return "bg-slate-100 text-slate-600";
  }
}

export default function Recommendations() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [recommendations, setRecommendations] = useState<Recommendation[]>(
    []
  );

  const [search, setSearch] = useState(
    searchParams.get("search") || ""
  );

  const [countryFilter, setCountryFilter] = useState(
    searchParams.get("country") || "all"
  );

  const [themeFilter, setThemeFilter] = useState(
    searchParams.get("theme") || "all"
  );

  const [responseFilter, setResponseFilter] = useState(
    searchParams.get("response") || "all"
  );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadRecommendations() {
      try {
        setLoading(true);
        setError(null);

        const { data, error: supabaseError } = await supabase
          .from("recommendations")
          .select(`
            id,
            recommendation,
            country,
            cycle,
            theme,
            institution,
            response,
            created_at
          `)
          .order("created_at", { ascending: false });

        if (supabaseError) {
          throw supabaseError;
        }

        setRecommendations((data || []) as Recommendation[]);
      } catch (err) {
        console.error("Failed to load recommendations:", err);

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load recommendations."
        );
      } finally {
        setLoading(false);
      }
    }

    loadRecommendations();
  }, []);

  const countries = useMemo(() => {
    return Array.from(
      new Set(
        recommendations
          .map((item) => item.country)
          .filter((value): value is string => Boolean(value))
      )
    ).sort();
  }, [recommendations]);

  const themes = useMemo(() => {
    return Array.from(
      new Set(
        recommendations
          .map((item) => item.theme)
          .filter((value): value is string => Boolean(value))
      )
    ).sort();
  }, [recommendations]);

  const responses = useMemo(() => {
    return Array.from(
      new Set(
        recommendations
          .map((item) => item.response)
          .filter((value): value is string => Boolean(value))
      )
    ).sort();
  }, [recommendations]);

  const filteredRecommendations = useMemo(() => {
    const query = search.trim().toLowerCase();

    return recommendations.filter((item) => {
      const matchesSearch =
        !query ||
        item.recommendation.toLowerCase().includes(query) ||
        item.country?.toLowerCase().includes(query) ||
        item.theme?.toLowerCase().includes(query) ||
        item.institution?.toLowerCase().includes(query) ||
        item.cycle?.toLowerCase().includes(query);

      const matchesCountry =
        countryFilter === "all" ||
        item.country?.toLowerCase() === countryFilter.toLowerCase();

      const matchesTheme =
        themeFilter === "all" ||
        item.theme?.toLowerCase() === themeFilter.toLowerCase();

      const matchesResponse =
        responseFilter === "all" ||
        item.response?.toLowerCase() === responseFilter.toLowerCase();

      return (
        matchesSearch &&
        matchesCountry &&
        matchesTheme &&
        matchesResponse
      );
    });
  }, [
    recommendations,
    search,
    countryFilter,
    themeFilter,
    responseFilter,
  ]);

  function updateFilters(
    nextSearch: string,
    nextCountry: string,
    nextTheme: string,
    nextResponse: string
  ) {
    const params = new URLSearchParams();

    if (nextSearch.trim()) {
      params.set("search", nextSearch.trim());
    }

    if (nextCountry !== "all") {
      params.set("country", nextCountry);
    }

    if (nextTheme !== "all") {
      params.set("theme", nextTheme);
    }

    if (nextResponse !== "all") {
      params.set("response", nextResponse);
    }

    setSearchParams(params);
  }

  function handleSearch(value: string) {
    setSearch(value);

    updateFilters(
      value,
      countryFilter,
      themeFilter,
      responseFilter
    );
  }

  function handleCountry(value: string) {
    setCountryFilter(value);

    updateFilters(
      search,
      value,
      themeFilter,
      responseFilter
    );
  }

  function handleTheme(value: string) {
    setThemeFilter(value);

    updateFilters(
      search,
      countryFilter,
      value,
      responseFilter
    );
  }

  function handleResponse(value: string) {
    setResponseFilter(value);

    updateFilters(
      search,
      countryFilter,
      themeFilter,
      value
    );
  }

  function clearFilters() {
    setSearch("");
    setCountryFilter("all");
    setThemeFilter("all");
    setResponseFilter("all");
    setSearchParams({});
  }

  const hasFilters =
    search.trim() ||
    countryFilter !== "all" ||
    themeFilter !== "all" ||
    responseFilter !== "all";

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="max-w-4xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
              Universal Periodic Review
            </p>

            <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
              Recommendations
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">
              Explore Universal Periodic Review recommendations and examine
              them by country, thematic area, institution and response.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        {/* Filters */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center gap-2">
            <SlidersHorizontal className="h-5 w-5 text-emerald-700" />

            <h2 className="text-sm font-semibold text-slate-900">
              Search and filter recommendations
            </h2>
          </div>

          <div className="grid gap-4 lg:grid-cols-4">
            {/* Search */}
            <div className="relative lg:col-span-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                type="search"
                value={search}
                onChange={(event) =>
                  handleSearch(event.target.value)
                }
                placeholder="Search recommendations..."
                className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
              />
            </div>

            {/* Country */}
            <select
              value={countryFilter}
              onChange={(event) =>
                handleCountry(event.target.value)
              }
              className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            >
              <option value="all">All countries</option>

              {countries.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>

            {/* Theme */}
            <select
              value={themeFilter}
              onChange={(event) =>
                handleTheme(event.target.value)
              }
              className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            >
              <option value="all">All themes</option>

              {themes.map((theme) => (
                <option key={theme} value={theme}>
                  {formatValue(theme)}
                </option>
              ))}
            </select>

            {/* Response */}
            <select
              value={responseFilter}
              onChange={(event) =>
                handleResponse(event.target.value)
              }
              className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            >
              <option value="all">All responses</option>

              {responses.map((response) => (
                <option key={response} value={response}>
                  {formatValue(response)}
                </option>
              ))}
            </select>
          </div>

          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="mt-4 text-sm font-medium text-emerald-700 hover:text-emerald-800"
            >
              Clear all filters
            </button>
          )}
        </div>

        {/* Results */}
        <div className="mt-8">
          {!loading && !error && (
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm text-slate-500">
                Showing{" "}
                <span className="font-semibold text-slate-700">
                  {filteredRecommendations.length}
                </span>{" "}
                {filteredRecommendations.length === 1
                  ? "recommendation"
                  : "recommendations"}
              </p>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
              <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-700" />

              <p className="mt-4 text-sm text-slate-500">
                Loading recommendations...
              </p>
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
              <h3 className="font-semibold text-red-900">
                Unable to load recommendations
              </h3>

              <p className="mt-2 text-sm leading-6 text-red-700">
                {error}
              </p>
            </div>
          )}

          {/* Empty */}
          {!loading &&
            !error &&
            filteredRecommendations.length === 0 && (
              <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
                <Search className="mx-auto h-10 w-10 text-slate-300" />

                <h3 className="mt-4 text-lg font-semibold text-slate-900">
                  No recommendations found
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  Try changing your search terms or filters.
                </p>
              </div>
            )}

          {/* Recommendation cards */}
          {!loading &&
            !error &&
            filteredRecommendations.length > 0 && (
              <div className="space-y-5">
                {filteredRecommendations.map((item) => (
                  <article
                    key={item.id}
                    className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md sm:p-7"
                  >
                    <div className="flex flex-col gap-5">
                      <div className="flex flex-wrap items-center gap-2">
                        {item.country && (
                          <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                            {item.country}
                          </span>
                        )}

                        {item.cycle && (
                          <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600">
                            {formatValue(item.cycle)}
                          </span>
                        )}

                        {item.theme && (
                          <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600">
                            {formatValue(item.theme)}
                          </span>
                        )}

                        {item.response && (
                          <span
                            className={`rounded-full px-3 py-1.5 text-xs font-semibold ${responseClasses(
                              item.response
                            )}`}
                          >
                            {formatValue(item.response)}
                          </span>
                        )}
                      </div>

                      <div>
                        <h2 className="text-lg font-semibold leading-7 text-slate-950 sm:text-xl">
                          {item.recommendation}
                        </h2>

                        {item.institution && (
                          <p className="mt-3 text-sm text-slate-600">
                            <span className="font-medium text-slate-800">
                              Institution:
                            </span>{" "}
                            {item.institution}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-col gap-4 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                          <CalendarDays className="h-4 w-4" />

                          <span>
                            Added {formatDate(item.created_at)}
                          </span>
                        </div>

                        <Link
                          to={`/recommendations/${item.id}`}
                          className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 transition hover:text-emerald-800"
                        >
                          View recommendation
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
        </div>
      </section>
    </main>
  );
}
