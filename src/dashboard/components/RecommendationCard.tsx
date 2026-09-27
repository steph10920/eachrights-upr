import { Link } from 'react-router-dom';
import type { RecommendationOverview } from '../types';
import { StatusPill } from './ui';

export function RecommendationCard({ recommendation }: { recommendation: RecommendationOverview }) {
  const currentStatus = recommendation.eachrights_assessment ?? recommendation.official_status;

  return (
    <Link
      to={`/dashboard/recommendations/${recommendation.id}`}
      className="group block border border-[#D8D4C8] bg-white p-4 hover:border-[#A9762F]"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs text-[#8B8F97]">
            {recommendation.country_name} · Cycle {recommendation.cycle_number} ({recommendation.cycle_year}) ·{' '}
            {recommendation.recommendation_number}
          </p>
          <p className="mt-1 font-serif text-base text-[#16233E] group-hover:underline">
            {recommendation.recommendation_text}
          </p>
          <p className="mt-1.5 text-sm text-[#5B6472]">
            Recommended by {recommendation.recommending_state}
            {recommendation.theme_name ? ` · ${recommendation.theme_name}` : ''}
            {recommendation.responsible_institution_name ? ` · ${recommendation.responsible_institution_name}` : ''}
          </p>
        </div>
        {currentStatus && <StatusPill status={currentStatus} />}
      </div>
    </Link>
  );
}
