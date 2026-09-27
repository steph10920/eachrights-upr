import { useState } from 'react';
import type { RecommendationFilters } from '../types';
import { useRecommendationSearch } from '../hooks/useRecommendationSearch';
import { RecommendationFiltersPanel } from '../components/RecommendationFilters';
import { RecommendationCard } from '../components/RecommendationCard';
import { LoadingBlock, ErrorBlock, EmptyBlock } from '../components/ui';

export function RecommendationsExplorer() {
  const [filters, setFilters] = useState<RecommendationFilters>({});
  const [page, setPage] = useState(0);

  const { results, total, pageCount, loading, error } = useRecommendationSearch(filters, page);

  function updateFilters(next: RecommendationFilters) {
    setFilters(next);
    setPage(0);
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <header className="mb-6">
        <h1 className="font-serif text-2xl text-[#16233E]">Recommendations</h1>
        <p className="mt-1 text-sm text-[#5B6472]">
          Search and filter UPR recommendations by cycle, theme, institution, status and more.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-[280px_1fr]">
        <RecommendationFiltersPanel filters={filters} onChange={updateFilters} />

        <div>
          <p className="mb-3 text-sm text-[#5B6472]">
            {loading ? 'Searching…' : `${total} recommendation${total === 1 ? '' : 's'} found`}
          </p>

          {error && <ErrorBlock message={error} />}
          {loading && <LoadingBlock />}

          {!loading && results.length === 0 && !error && (
            <EmptyBlock message="No recommendations match these filters." />
          )}

          {!loading && results.length > 0 && (
            <div className="space-y-3">
              {results.map((r) => (
                <RecommendationCard key={r.id} recommendation={r} />
              ))}
            </div>
          )}

          {pageCount > 1 && (
            <div className="mt-6 flex items-center justify-between text-sm">
              <button
                type="button"
                disabled={page === 0}
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                className="border border-[#D8D4C8] px-3 py-1.5 disabled:opacity-40"
              >
                Previous
              </button>
              <span className="text-[#5B6472]">
                Page {page + 1} of {pageCount}
              </span>
              <button
                type="button"
                disabled={page >= pageCount - 1}
                onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
                className="border border-[#D8D4C8] px-3 py-1.5 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
