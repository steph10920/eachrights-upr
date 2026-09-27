import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import type { RecommendationFilters, RecommendationOverview, LookupOption } from '../types';

const PAGE_SIZE = 20;

function errorMessage(err: unknown, fallback: string) {
  return err instanceof Error ? err.message : fallback;
}

// Options for the filter dropdowns — countries, cycles, themes, institutions.
// These are small reference tables (Phase 1), safe to load in full.
export function useFilterOptions() {
  const [countries, setCountries] = useState<LookupOption[]>([]);
  const [themes, setThemes] = useState<LookupOption[]>([]);
  const [institutions, setInstitutions] = useState<LookupOption[]>([]);
  const [cycles, setCycles] = useState<(LookupOption & { year: number; countryId: string })[]>([]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const [countriesRes, themesRes, institutionsRes, cyclesRes] = await Promise.all([
        supabase.from('countries').select('id, name').order('name'),
        supabase.from('themes').select('id, name').order('name'),
        supabase.from('institutions').select('id, name').order('name'),
        supabase.from('upr_cycles').select('id, cycle_number, year, country_id').order('year', { ascending: false }),
      ]);
      if (cancelled) return;

      setCountries((countriesRes.data ?? []) as LookupOption[]);
      setThemes((themesRes.data ?? []) as LookupOption[]);
      setInstitutions((institutionsRes.data ?? []) as LookupOption[]);
      setCycles(
        (cyclesRes.data ?? []).map((c: any) => ({
          id: c.id,
          name: `Cycle ${c.cycle_number} (${c.year})`,
          year: c.year,
          countryId: c.country_id,
        }))
      );
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return { countries, themes, institutions, cycles };
}

export function useRecommendationSearch(filters: RecommendationFilters, page: number) {
  const [results, setResults] = useState<RecommendationOverview[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      const rpcArgs = {
        p_country_id: filters.countryId ?? null,
        p_upr_cycle_id: filters.uprCycleId ?? null,
        p_theme_id: filters.themeId ?? null,
        p_institution_id: filters.institutionId ?? null,
        p_recommending_state: filters.recommendingState ?? null,
        p_human_right: filters.humanRight ?? null,
        p_status: filters.status ?? null,
        p_year: filters.year ?? null,
        p_search: filters.search ?? null,
      };

      try {
        const [searchRes, countRes] = await Promise.all([
          supabase.rpc('search_recommendations', {
            ...rpcArgs,
            p_limit: PAGE_SIZE,
            p_offset: page * PAGE_SIZE,
          }),
          supabase.rpc('count_recommendations', rpcArgs),
        ]);

        if (searchRes.error) throw searchRes.error;
        if (countRes.error) throw countRes.error;

        if (!cancelled) {
          setResults((searchRes.data ?? []) as RecommendationOverview[]);
          setTotal((countRes.data ?? 0) as number);
        }
      } catch (err) {
        if (!cancelled) setError(errorMessage(err, 'Failed to search recommendations.'));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
    // filters is a plain object rebuilt by the caller on each change, so
    // stringify it for a stable dependency rather than comparing by reference.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(filters), page]);

  return { results, total, pageCount: Math.max(1, Math.ceil(total / PAGE_SIZE)), loading, error, pageSize: PAGE_SIZE };
}
