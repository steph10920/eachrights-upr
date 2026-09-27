import { Link } from 'react-router-dom';
import type { KeyAreaRow } from '../types';
import { StatusPill, EmptyBlock } from './ui';

export function KeyAreasList({ rows }: { rows: KeyAreaRow[] }) {
  if (rows.length === 0) {
    return <EmptyBlock message="No recommendations are currently flagged for attention." />;
  }

  return (
    <ul className="space-y-3">
      {rows.map((row) => (
        <li key={row.recommendation_id} className="border border-[#D8D4C8] bg-white p-3">
          <Link to={`/dashboard/recommendations/${row.recommendation_id}`} className="group block">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm text-[#16233E] group-hover:underline">{row.recommendation_number}</p>
                <p className="mt-0.5 line-clamp-2 text-sm text-[#5B6472]">{row.recommendation_text}</p>
                <p className="mt-1 text-xs text-[#8B8F97]">
                  {row.responsible_institution_name ?? 'Institution not assigned'}
                  {row.theme_name ? ` · ${row.theme_name}` : ''}
                </p>
              </div>
              <StatusPill status={row.current_status} />
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
