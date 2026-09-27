import { Link } from 'react-router-dom';
import type { RecentUpdate } from '../types';
import { StatusPill, EmptyBlock } from './ui';

export function RecentUpdatesFeed({ updates }: { updates: RecentUpdate[] }) {
  if (updates.length === 0) return <EmptyBlock message="No implementation updates recorded yet." />;

  return (
    <ul className="divide-y divide-[#E4E1D8]">
      {updates.map((update) => (
        <li key={update.update_id} className="py-3">
          <Link to={`/dashboard/recommendations/${update.recommendation_id}`} className="group block">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm text-[#16233E] group-hover:underline">
                  {update.recommendation_number} — {update.theme_name ?? 'Uncategorised'}
                </p>
                <p className="mt-0.5 line-clamp-2 text-sm text-[#5B6472]">{update.recommendation_text}</p>
                {update.notes && <p className="mt-1 text-xs italic text-[#5B6472]">{update.notes}</p>}
              </div>
              <div className="flex shrink-0 flex-col items-end gap-1.5">
                <StatusPill status={update.status} />
                <span className="text-xs text-[#8B8F97]">
                  {new Date(update.update_date).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
              </div>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
