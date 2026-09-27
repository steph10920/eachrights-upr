import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import type {
  DashboardTotals,
  StatusBreakdownRow,
  RecentUpdate,
  KeyAreaRow,
  ThemeBreakdownRow,
  InstitutionBreakdownRow,
  TrendRow,
} from '../types';

interface AsyncState<T> {
  data: T;
  loading: boolean;
  error: string | null;
}

function errorMessage(err: unknown, fallback: string) {
  return err instanceof Error ? err.message : fallback;
}

// Homepage overview: totals, current status split, recent activity and
// the recommendations most in need of attention (Section 8).
export function useDashboardOverview() {
  const [state, setState] = useState<
    AsyncState<{
      totals: DashboardTotals | null;
      statusBreakdown: StatusBreakdownRow[];
      recentUpdates: RecentUpdate[];
      keyAreas: KeyAreaRow[];
    }>
  >({
    data: { totals: null, statusBreakdown: [], recentUpdates: [], keyAreas: [] },
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setState((s) => ({ ...s, loading: true, error: null }));
      try {
        const [totalsRes, statusRes, updatesRes, keyAreasRes] = await Promise.all([
          supabase.from('dashboard_totals').select('*').single(),
          supabase.from('status_breakdown').select('*'),
          supabase.rpc('get_recent_updates', { p_limit: 6 }),
          supabase.from('key_areas_attention').select('*').limit(6),
        ]);

        for (const res of [totalsRes, statusRes, updatesRes, keyAreasRes]) {
          if (res.error) throw res.error;
        }

        if (!cancelled) {
          setState({
            data: {
              totals: totalsRes.data as DashboardTotals,
              statusBreakdown: (statusRes.data ?? []) as StatusBreakdownRow[],
              recentUpdates: (updatesRes.data ?? []) as RecentUpdate[],
              keyAreas: (keyAreasRes.data ?? []) as KeyAreaRow[],
            },
            loading: false,
            error: null,
          });
        }
      } catch (err) {
        if (!cancelled) {
          setState((s) => ({ ...s, loading: false, error: errorMessage(err, 'Failed to load dashboard overview.') }));
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return { ...state.data, loading: state.loading, error: state.error };
}

// Thematic and institutional analysis (Sections 8 & 12).
export function useThematicAnalysis() {
  const [state, setState] = useState<
    AsyncState<{ byTheme: ThemeBreakdownRow[]; byInstitution: InstitutionBreakdownRow[] }>
  >({ data: { byTheme: [], byInstitution: [] }, loading: true, error: null });

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setState((s) => ({ ...s, loading: true, error: null }));
      try {
        const [themeRes, institutionRes] = await Promise.all([
          supabase.from('recommendations_by_theme').select('*'),
          supabase.from('recommendations_by_institution').select('*'),
        ]);
        if (themeRes.error) throw themeRes.error;
        if (institutionRes.error) throw institutionRes.error;

        if (!cancelled) {
          setState({
            data: {
              byTheme: (themeRes.data ?? []) as ThemeBreakdownRow[],
              byInstitution: (institutionRes.data ?? []) as InstitutionBreakdownRow[],
            },
            loading: false,
            error: null,
          });
        }
      } catch (err) {
        if (!cancelled) {
          setState((s) => ({ ...s, loading: false, error: errorMessage(err, 'Failed to load thematic analysis.') }));
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return { ...state.data, loading: state.loading, error: state.error };
}

// Year-over-year implementation status trends.
export function useImplementationTrends() {
  const [state, setState] = useState<AsyncState<TrendRow[]>>({ data: [], loading: true, error: null });

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setState((s) => ({ ...s, loading: true, error: null }));
      const { data, error } = await supabase.from('implementation_trends').select('*');
      if (cancelled) return;
      if (error) {
        setState({ data: [], loading: false, error: errorMessage(error, 'Failed to load implementation trends.') });
      } else {
        setState({ data: (data ?? []) as TrendRow[], loading: false, error: null });
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
