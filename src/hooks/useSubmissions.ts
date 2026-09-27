import { useCallback, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export interface Submission {
  id: string;
  summary: string;
  entity_type: string;
  submitted_by_name: string;
  submitted_by_organisation: string | null;
  submitted_at: string;
  status: string;
}

interface UseSubmissionsReturn {
  submissions: Submission[];
  loading: boolean;
  error: string | null;
  approve: (id: string, notes?: string) => Promise<void>;
  reject: (id: string, notes: string) => Promise<void>;
  requestChanges: (id: string, notes: string) => Promise<void>;
  refresh: () => Promise<void>;
}

export function useSubmissions(): UseSubmissionsReturn {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSubmissions = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      /*
       * We use the submissions table as the source for the
       * reviewer queue.
       *
       * If your Supabase schema uses a different table/view,
       * change "submissions" here.
       */
      const { data, error: queryError } = await supabase
        .from("submissions")
        .select(
          `
            id,
            summary,
            entity_type,
            submitted_by_name,
            submitted_by_organisation,
            submitted_at,
            status
          `
        )
        .in("status", ["submitted", "pending_review", "under_review"])
        .order("submitted_at", { ascending: true });

      if (queryError) {
        throw queryError;
      }

      setSubmissions((data ?? []) as Submission[]);
    } catch (err) {
      console.error("Failed to load submissions:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to load submissions."
      );

      setSubmissions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadSubmissions();
  }, [loadSubmissions]);

  const updateSubmission = useCallback(
    async (
      id: string,
      status: string,
      notes?: string
    ): Promise<void> => {
      setError(null);

      try {
        const updateData: {
          status: string;
          review_notes?: string;
          reviewed_at?: string;
        } = {
          status,
        };

        if (notes !== undefined) {
          updateData.review_notes = notes;
        }

        updateData.reviewed_at = new Date().toISOString();

        const { error: updateError } = await supabase
          .from("submissions")
          .update(updateData)
          .eq("id", id);

        if (updateError) {
          throw updateError;
        }

        await loadSubmissions();
      } catch (err) {
        console.error("Failed to update submission:", err);

        const message =
          err instanceof Error
            ? err.message
            : "Failed to update submission.";

        setError(message);
        throw err;
      }
    },
    [loadSubmissions]
  );

  const approve = useCallback(
    async (id: string, notes?: string) => {
      await updateSubmission(id, "approved", notes);
    },
    [updateSubmission]
  );

  const reject = useCallback(
    async (id: string, notes: string) => {
      await updateSubmission(id, "rejected", notes);
    },
    [updateSubmission]
  );

  const requestChanges = useCallback(
    async (id: string, notes: string) => {
      await updateSubmission(id, "changes_requested", notes);
    },
    [updateSubmission]
  );

  return {
    submissions,
    loading,
    error,
    approve,
    reject,
    requestChanges,
    refresh: loadSubmissions,
  };
}
