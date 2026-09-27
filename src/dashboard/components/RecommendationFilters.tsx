import type { RecommendationFilters, ImplementationStatus } from '../types';
import { STATUS_META, STATUS_ORDER } from '../types';
import { useFilterOptions } from '../hooks/useRecommendationSearch';

const fieldClass =
  'w-full border border-[#D8D4C8] bg-white px-2.5 py-1.5 text-sm text-[#16233E] focus:border-[#A9762F] focus:outline-none focus:ring-1 focus:ring-[#A9762F]';
const labelClass = 'mb-1 block text-xs font-medium text-[#5B6472]';

export function RecommendationFiltersPanel({
  filters,
  onChange,
}: {
  filters: RecommendationFilters;
  onChange: (next: RecommendationFilters) => void;
}) {
  const { countries, themes, institutions, cycles } = useFilterOptions();

  const visibleCycles = filters.countryId
    ? cycles.filter((c) => c.countryId === filters.countryId)
    : cycles;

  function set<K extends keyof RecommendationFilters>(key: K, value: RecommendationFilters[K]) {
    onChange({ ...filters, [key]: value || undefined });
  }

  const hasActiveFilters = Object.values(filters).some((v) => v !== undefined && v !== '');

  return (
    <div className="border border-[#D8D4C8] bg-white p-4">
      <div className="mb-3">
        <label className={labelClass}>Search</label>
        <input
          type="text"
          className={fieldClass}
          placeholder="Recommendation number or text…"
          value={filters.search ?? ''}
          onChange={(e) => set('search', e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>Country</label>
          <select className={fieldClass} value={filters.countryId ?? ''} onChange={(e) => set('countryId', e.target.value)}>
            <option value="">All countries</option>
            {countries.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass}>UPR cycle</label>
          <select
            className={fieldClass}
            value={filters.uprCycleId ?? ''}
            onChange={(e) => set('uprCycleId', e.target.value)}
          >
            <option value="">All cycles</option>
            {visibleCycles.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass}>Theme</label>
          <select className={fieldClass} value={filters.themeId ?? ''} onChange={(e) => set('themeId', e.target.value)}>
            <option value="">All themes</option>
            {themes.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass}>Responsible institution</label>
          <select
            className={fieldClass}
            value={filters.institutionId ?? ''}
            onChange={(e) => set('institutionId', e.target.value)}
          >
            <option value="">All institutions</option>
            {institutions.map((i) => (
              <option key={i.id} value={i.id}>
                {i.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass}>Implementation status</label>
          <select
            className={fieldClass}
            value={filters.status ?? ''}
            onChange={(e) => set('status', (e.target.value || undefined) as ImplementationStatus | undefined)}
          >
            <option value="">All statuses</option>
            {STATUS_ORDER.map((status) => (
              <option key={status} value={status}>
                {STATUS_META[status].label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass}>Recommending state</label>
          <input
            type="text"
            className={fieldClass}
            placeholder="e.g. Germany"
            value={filters.recommendingState ?? ''}
            onChange={(e) => set('recommendingState', e.target.value)}
          />
        </div>
      </div>

      {hasActiveFilters && (
        <button
          type="button"
          onClick={() => onChange({})}
          className="mt-3 text-xs text-[#A9762F] underline underline-offset-2"
        >
          Clear all filters
        </button>
      )}
    </div>
  );
}
