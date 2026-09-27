import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from 'recharts';
import type { StatusBreakdownRow, ThemeBreakdownRow, InstitutionBreakdownRow, TrendRow } from '../types';
import { STATUS_META, STATUS_ORDER } from '../types';

// Horizontal bars for the current status split — easier to label than a pie
// at this category count, and keeps every status legible at a glance.
export function StatusBreakdownChart({ rows }: { rows: StatusBreakdownRow[] }) {
  const byStatus = new Map(rows.map((r) => [r.status, r.total]));
  const data = STATUS_ORDER.map((status) => ({
    status,
    label: STATUS_META[status].label,
    total: byStatus.get(status) ?? 0,
  }));

  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} layout="vertical" margin={{ left: 24, right: 24, top: 8, bottom: 8 }}>
        <CartesianGrid horizontal={false} stroke="#E4E1D8" />
        <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12, fill: '#5B6472' }} />
        <YAxis
          type="category"
          dataKey="label"
          width={150}
          tick={{ fontSize: 12, fill: '#16233E' }}
        />
        <Tooltip
          cursor={{ fill: '#F6F5F1' }}
          contentStyle={{ borderRadius: 2, borderColor: '#D8D4C8', fontSize: 12 }}
        />
        <Bar dataKey="total" radius={[0, 2, 2, 0]} barSize={18}>
          {data.map((entry) => (
            <Cell key={entry.status} fill={STATUS_META[entry.status].text} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

// Grouped comparison across themes or institutions — same shape, so one
// component serves both Section 8's "by theme" and "by institution" views.
export function GroupComparisonChart({
  rows,
  nameKey,
}: {
  rows: (ThemeBreakdownRow | InstitutionBreakdownRow)[];
  nameKey: 'theme_name' | 'institution_name';
}) {
  const data = rows
    .filter((r) => r.total_recommendations > 0)
    .slice(0, 10)
    .map((r) => ({
      name: (r as any)[nameKey] as string,
      Implemented: r.implemented_count,
      'Partially implemented': r.partially_implemented_count,
      'Not implemented': r.not_implemented_count,
      Pending: r.pending_count,
      'Insufficient information': r.insufficient_information_count,
    }));

  return (
    <ResponsiveContainer width="100%" height={Math.max(240, data.length * 34)}>
      <BarChart data={data} layout="vertical" margin={{ left: 8, right: 16, top: 8, bottom: 8 }} stackOffset="none">
        <CartesianGrid horizontal={false} stroke="#E4E1D8" />
        <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12, fill: '#5B6472' }} />
        <YAxis type="category" dataKey="name" width={160} tick={{ fontSize: 12, fill: '#16233E' }} />
        <Tooltip contentStyle={{ borderRadius: 2, borderColor: '#D8D4C8', fontSize: 12 }} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Bar dataKey="Implemented" stackId="a" fill={STATUS_META.implemented.text} />
        <Bar dataKey="Partially implemented" stackId="a" fill={STATUS_META.partially_implemented.text} />
        <Bar dataKey="Not implemented" stackId="a" fill={STATUS_META.not_implemented.text} />
        <Bar dataKey="Pending" stackId="a" fill={STATUS_META.pending.text} />
        <Bar dataKey="Insufficient information" stackId="a" fill={STATUS_META.insufficient_information.text} />
      </BarChart>
    </ResponsiveContainer>
  );
}

// Year-over-year status counts — one line per status.
export function TrendChart({ rows }: { rows: TrendRow[] }) {
  const years = Array.from(new Set(rows.map((r) => r.year))).sort();
  const data = years.map((year) => {
    const point: Record<string, number | string> = { year };
    for (const status of STATUS_ORDER) {
      const match = rows.find((r) => r.year === year && r.status === status);
      point[STATUS_META[status].label] = match?.total ?? 0;
    }
    return point;
  });

  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data} margin={{ left: 8, right: 16, top: 8, bottom: 8 }}>
        <CartesianGrid stroke="#E4E1D8" />
        <XAxis dataKey="year" tick={{ fontSize: 12, fill: '#5B6472' }} />
        <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#5B6472' }} />
        <Tooltip contentStyle={{ borderRadius: 2, borderColor: '#D8D4C8', fontSize: 12 }} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        {STATUS_ORDER.map((status) => (
          <Line
            key={status}
            type="monotone"
            dataKey={STATUS_META[status].label}
            stroke={STATUS_META[status].text}
            strokeWidth={2}
            dot={{ r: 3 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
