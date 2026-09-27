import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import type { RecommendationOverview, TimelineEntry, EvidenceEntry, ActionEntry } from '../types';

function errorMessage(err: unknown, fallback: string) {
  return err instanceof Error ? err.message : fallback;
}

export function useRecommendationDetail(recommendationId: string | undefined) {
  const [recommendation, setRecommendation] = useState<RecommendationOverview | null>(null);
  const [timeline, setTimeline] = useState<TimelineEntry[]>([]);
  const [evidence, setEvidence] = useState<EvidenceEntry[]>([]);
  const [actions, setActions] = useState<ActionEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!recommendationId) return;
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const [recRes, timelineRes, evidenceRes, actionsRes] = await Promise.all([
          supabase.from('recommendation_overview').select('*').eq('id', recommendationId).single(),
          supabase.rpc('get_recommendation_timeline', { p_recommendation_id: recommendationId }),
          supabase.rpc('get_recommendation_evidence', { p_recommendation_id: recommendationId }),
          supabase.rpc('get_recommendation_actions', { p_recommendation_id: recommendationId }),
        ]);

        for (const res of [recRes, timelineRes, evidenceRes, actionsRes]) {
          if (res.error) throw res.error;
        }

        if (!cancelled) {
          setRecommendation(recRes.data as RecommendationOverview);
          setTimeline((timelineRes.data ?? []) as TimelineEntry[]);
          setEvidence((evidenceRes.data ?? []) as EvidenceEntry[]);
          setActions((actionsRes.data ?? []) as ActionEntry[]);
        }
      } catch (err) {
        if (!cancelled) setError(errorMessage(err, 'Failed to load this recommendation.'));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [recommendationId]);

  return { recommendation, timeline, evidence, actions, loading, error };
}
