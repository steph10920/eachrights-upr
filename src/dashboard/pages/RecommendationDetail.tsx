import { useParams, Link } from 'react-router-dom';
import { useRecommendationDetail } from '../hooks/useRecommendationDetail';
import { StatusPill, SectionHeading, LoadingBlock, ErrorBlock, EmptyBlock } from '../components/ui';

const EVIDENCE_TYPE_LABELS: Record<string, string> = {
  government_report: 'Government report',
  policy: 'Policy',
  legislation: 'Legislation',
  gazette_notice: 'Gazette notice',
  parliamentary_record: 'Parliamentary record',
  budget_document: 'Budget document',
  court_decision: 'Court decision',
  un_document: 'UN document',
  research_report: 'Research report',
  civil_society_report: 'Civil society report',
  community_evidence: 'Community-level evidence',
  other: 'Other',
};

const ACTION_TYPE_LABELS: Record<string, string> = {
  legislative_reform: 'Legislative reform',
  policy_change: 'Policy change',
  institutional_reform: 'Institutional reform',
  budgetary_measure: 'Budgetary measure',
  programme: 'Programme',
  administrative_action: 'Administrative action',
  other: 'Other',
};

function formatDate(value: string | null) {
  if (!value) return '—';
  return new Date(value).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function RecommendationDetail() {
  const { id } = useParams<{ id: string }>();
  const { recommendation, timeline, evidence, actions, loading, error } = useRecommendationDetail(id);

  if (loading) return <div className="mx-auto max-w-3xl px-4 py-10"><LoadingBlock /></div>;
  if (error) return <div className="mx-auto max-w-3xl px-4 py-10"><ErrorBlock message={error} /></div>;
  if (!recommendation) return <div className="mx-auto max-w-3xl px-4 py-10"><EmptyBlock message="Recommendation not found." /></div>;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Link to="/dashboard/recommendations" className="text-sm text-[#A9762F] underline underline-offset-2">
        ← Back to recommendations
      </Link>

      <p className="mt-4 text-xs text-[#8B8F97]">
        {recommendation.country_name} · Cycle {recommendation.cycle_number} ({recommendation.cycle_year}) ·{' '}
        {recommendation.recommendation_number}
      </p>
      <h1 className="mt-1 font-serif text-2xl leading-snug text-[#16233E]">{recommendation.recommendation_text}</h1>
      <p className="mt-2 text-sm text-[#5B6472]">Recommended by {recommendation.recommending_state}</p>

      {/* Official position vs. civil-society assessment — kept visually distinct, per Section 7 */}
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <div className="border border-[#D8D4C8] bg-white p-3">
          <p className="text-xs uppercase text-[#8B8F97]">Government response</p>
          <p className="mt-1 text-sm text-[#16233E]">{recommendation.government_response ?? 'Not on record'}</p>
          {recommendation.official_status && (
            <div className="mt-2">
              <StatusPill status={recommendation.official_status} />
            </div>
          )}
        </div>
        <div className="border border-[#D8D4C8] bg-white p-3">
          <p className="text-xs uppercase text-[#8B8F97]">EACHRights assessment</p>
          {recommendation.eachrights_assessment ? (
            <div className="mt-2">
              <StatusPill status={recommendation.eachrights_assessment} />
            </div>
          ) : (
            <p className="mt-1 text-sm text-[#5B6472]">Not yet assessed</p>
          )}
        </div>
      </div>

      <dl className="mt-6 grid grid-cols-2 gap-3 text-sm">
        <div>
          <dt className="text-xs uppercase text-[#8B8F97]">Responsible institution</dt>
          <dd className="text-[#16233E]">{recommendation.responsible_institution_name ?? '—'}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase text-[#8B8F97]">Theme</dt>
          <dd className="text-[#16233E]">{recommendation.theme_name ?? '—'}</dd>
        </div>
      </dl>

      <section className="mt-10">
        <SectionHeading title="Actions taken" />
        {actions.length === 0 ? (
          <EmptyBlock message="No actions have been recorded for this recommendation yet." />
        ) : (
          <ul className="space-y-3">
            {actions.map((a) => (
              <li key={a.action_id} className="border-l-[3px] border-[#A9762F] bg-white py-1.5 pl-3">
                <p className="text-xs uppercase text-[#8B8F97]">
                  {ACTION_TYPE_LABELS[a.action_type] ?? a.action_type} · {formatDate(a.date_taken)}
                </p>
                <p className="text-sm text-[#16233E]">{a.title}</p>
                {a.description && <p className="mt-0.5 text-sm text-[#5B6472]">{a.description}</p>}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-10">
        <SectionHeading title="Evidence" />
        {evidence.length === 0 ? (
          <EmptyBlock message="No supporting evidence has been linked to this recommendation yet." />
        ) : (
          <ul className="space-y-3">
            {evidence.map((e) => (
              <li key={e.evidence_id} className="border border-[#D8D4C8] bg-white p-3">
                <p className="text-xs uppercase text-[#8B8F97]">
                  {EVIDENCE_TYPE_LABELS[e.evidence_type] ?? e.evidence_type} · {formatDate(e.publication_date)} ·{' '}
                  {e.verification_status}
                </p>
                <p className="text-sm text-[#16233E]">{e.title}</p>
                {e.url && (
                  <a href={e.url} target="_blank" rel="noreferrer" className="text-sm text-[#A9762F] underline underline-offset-2">
                    View source
                  </a>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-10">
        <SectionHeading title="Status history" description="Every recorded implementation update, oldest first." />
        {timeline.length === 0 ? (
          <EmptyBlock message="No status updates recorded yet." />
        ) : (
          <ol className="space-y-3 border-l border-[#D8D4C8] pl-4">
            {timeline.map((t) => (
              <li key={t.update_id} className="relative">
                <span className="absolute -left-[21px] top-1 h-2 w-2 rounded-full bg-[#A9762F]" />
                <p className="text-xs text-[#8B8F97]">
                  {formatDate(t.update_date)} · {t.assessment_source === 'official' ? 'Official position' : 'EACHRights assessment'}
                </p>
                <div className="mt-1">
                  <StatusPill status={t.status} />
                </div>
                {t.notes && <p className="mt-1 text-sm text-[#5B6472]">{t.notes}</p>}
              </li>
            ))}
          </ol>
        )}
      </section>
    </div>
  );
}
