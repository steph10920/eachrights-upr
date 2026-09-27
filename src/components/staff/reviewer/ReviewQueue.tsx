import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSubmissions } from '../../../hooks/useSubmissions';

export default function ReviewQueue() {
  const { submissions, loading, error, approve, reject, requestChanges } = useSubmissions();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [noteDraft, setNoteDraft] = useState<Record<string, string>>({});

  async function handleApprove(id: string) {
    setBusyId(id);
    await approve(id, noteDraft[id]);
    setBusyId(null);
  }

  async function handleReject(id: string) {
    const notes = noteDraft[id];
    if (!notes) {
      alert('Review notes are required to reject a submission.');
      return;
    }
    setBusyId(id);
    await reject(id, notes);
    setBusyId(null);
  }

  async function handleRequestChanges(id: string) {
    const notes = noteDraft[id];
    if (!notes) {
      alert('Review notes are required when requesting changes.');
      return;
    }
    setBusyId(id);
    await requestChanges(id, notes);
    setBusyId(null);
  }

  if (loading) return <div className="text-gray-500">Loading queue…</div>;
  if (error) return <div className="text-red-600">Failed to load queue: {error}</div>;

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Review Queue</h1>

      {submissions.length === 0 && (
        <p className="text-gray-500">Nothing waiting on review right now.</p>
      )}

      {submissions.map((s) => (
        <div key={s.id} className="rounded border border-gray-200 p-4 space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-medium">{s.summary}</p>
              <p className="text-sm text-gray-500">
                {s.entity_type.replace('_', ' ')} · submitted by {s.submitted_by_name}
                {s.submitted_by_organisation ? ` (${s.submitted_by_organisation})` : ''} ·{' '}
                {new Date(s.submitted_at).toLocaleDateString()}
              </p>
              <span className="inline-block mt-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                {s.status.replace('_', ' ')}
              </span>
            </div>
            <Link
              to={`/staff/review/queue/${s.id}`}
              className="text-sm text-blue-600 hover:underline"
            >
              View details
            </Link>
          </div>

          <textarea
            placeholder="Review notes (required for reject / request changes)"
            value={noteDraft[s.id] ?? ''}
            onChange={(e) => setNoteDraft((prev) => ({ ...prev, [s.id]: e.target.value }))}
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
            rows={2}
          />

          <div className="flex gap-2">
            <button
              disabled={busyId === s.id}
              onClick={() => handleApprove(s.id)}
              className="rounded bg-green-600 text-white px-3 py-1.5 text-sm disabled:opacity-50"
            >
              Approve
            </button>
            <button
              disabled={busyId === s.id}
              onClick={() => handleRequestChanges(s.id)}
              className="rounded bg-amber-500 text-white px-3 py-1.5 text-sm disabled:opacity-50"
            >
              Request changes
            </button>
            <button
              disabled={busyId === s.id}
              onClick={() => handleReject(s.id)}
              className="rounded bg-red-600 text-white px-3 py-1.5 text-sm disabled:opacity-50"
            >
              Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
