

import { useState } from "react";
import { Link } from "react-router-dom";
import { useSubmissions } from "../../../hooks/useSubmissions";

function ReviewQueue() {
  const {
    submissions,
    loading,
    error,
    approve,
    reject,
    requestChanges,
  } = useSubmissions();

  const [busyId, setBusyId] = useState<string | null>(null);
  const [noteDraft, setNoteDraft] = useState<Record<string, string>>({});

  const updateNote = (id: string, value: string) => {
    setNoteDraft((previous) => ({
      ...previous,
      [id]: value,
    }));
  };

  const handleApprove = async (id: string) => {
    try {
      setBusyId(id);
      await approve(id, noteDraft[id]?.trim() || undefined);
    } catch (err) {
      console.error("Failed to approve submission:", err);
    } finally {
      setBusyId(null);
    }
  };

  const handleReject = async (id: string) => {
    const notes = noteDraft[id]?.trim();

    if (!notes) {
      alert("Review notes are required to reject a submission.");
      return;
    }

    try {
      setBusyId(id);
      await reject(id, notes);
    } catch (err) {
      console.error("Failed to reject submission:", err);
    } finally {
      setBusyId(null);
    }
  };

  const handleRequestChanges = async (id: string) => {
    const notes = noteDraft[id]?.trim();

    if (!notes) {
      alert("Review notes are required when requesting changes.");
      return;
    }

    try {
      setBusyId(id);
      await requestChanges(id, notes);
    } catch (err) {
      console.error("Failed to request changes:", err);
    } finally {
      setBusyId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <p className="text-sm text-gray-500">
          Loading review queue...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6">
        <h2 className="font-semibold text-red-800">
          Unable to load review queue
        </h2>

        <p className="mt-2 text-sm text-red-700">
          {error}
        </p>
      </div>
    );
  }

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Review Queue
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Review and process submissions awaiting review.
        </p>
      </div>

      {submissions.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-10 text-center shadow-sm">
          <h2 className="text-lg font-medium text-gray-900">
            Review queue is empty
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            There are currently no submissions waiting for review.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {submissions.map((submission) => {
            const isBusy = busyId === submission.id;

            return (
              <article
                key={submission.id}
                className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="min-w-0">
                    <h2 className="text-base font-semibold text-gray-900">
                      {submission.summary}
                    </h2>

                    <div className="mt-2 space-y-1 text-sm text-gray-500">
                      <p className="capitalize">
                        {submission.entity_type.replace(/_/g, " ")}
                      </p>

                      <p>
                        Submitted by{" "}
                        <span className="font-medium text-gray-700">
                          {submission.submitted_by_name}
                        </span>

                        {submission.submitted_by_organisation && (
                          <>
                            {" "}
                            ({submission.submitted_by_organisation})
                          </>
                        )}
                      </p>

                      <p>
                        Submitted on{" "}
                        {new Date(
                          submission.submitted_at
                        ).toLocaleDateString()}
                      </p>
                    </div>

                    <span className="mt-3 inline-flex rounded-full bg-gray-100 px-3 py-1 text-xs font-medium capitalize text-gray-600">
                      {submission.status.replace(/_/g, " ")}
                    </span>
                  </div>

                  <Link
                    to={`/staff/review/queue/${submission.id}`}
                    className="shrink-0 text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline"
                  >
                    View details →
                  </Link>
                </div>

                <div className="mt-5">
                  <label
                    htmlFor={`review-notes-${submission.id}`}
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Review notes
                  </label>

                  <textarea
                    id={`review-notes-${submission.id}`}
                    rows={3}
                    value={noteDraft[submission.id] ?? ""}
                    onChange={(event) =>
                      updateNote(
                        submission.id,
                        event.target.value
                      )
                    }
                    placeholder="Add review notes. Required for rejection or requesting changes."
                    disabled={isBusy}
                    className="w-full resize-y rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
                  />
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    disabled={isBusy}
                    onClick={() =>
                      handleApprove(submission.id)
                    }
                    className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isBusy ? "Processing..." : "Approve"}
                  </button>

                  <button
                    type="button"
                    disabled={isBusy}
                    onClick={() =>
                      handleRequestChanges(submission.id)
                    }
                    className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Request changes
                  </button>

                  <button
                    type="button"
                    disabled={isBusy}
                    onClick={() =>
                      handleReject(submission.id)
                    }
                    className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Reject
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default ReviewQueue;
