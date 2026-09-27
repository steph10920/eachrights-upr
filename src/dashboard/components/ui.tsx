import type { ImplementationStatus } from '../types';
import { STATUS_META } from '../types';

// A single statistic with a left accent bar — used for the homepage's
// top-line counts. Deliberately not a rounded shadow card: the accent
// bar reads as a report figure, not a SaaS metric tile.
export function StatCard({
  label,
  value,
  accent = '#16233E',
}: {
  label: string;
  value: string | number;
  accent?: string;
}) {
  return (
    <div className="border-l-[3px] bg-white py-3 pl-4 pr-3" style={{ borderColor: accent }}>
      <div className="font-serif text-3xl leading-none text-[#16233E]">{value}</div>
      <div className="mt-1.5 text-sm text-[#5B6472]">{label}</div>
    </div>
  );
}

export function StatusPill({ status }: { status: ImplementationStatus }) {
  const meta = STATUS_META[status];
  return (
    <span
      className="inline-flex items-center rounded-sm border px-2 py-0.5 text-xs font-medium"
      style={{ color: meta.text, backgroundColor: meta.bg, borderColor: meta.border }}
    >
      {meta.label}
    </span>
  );
}

export function SectionHeading({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-4 border-b border-[#D8D4C8] pb-3">
      <h2 className="font-serif text-xl text-[#16233E]">{title}</h2>
      {description && <p className="mt-1 text-sm text-[#5B6472]">{description}</p>}
    </div>
  );
}

export function LoadingBlock({ label = 'Loading…' }: { label?: string }) {
  return <div className="py-10 text-center text-sm text-[#5B6472]">{label}</div>;
}

export function ErrorBlock({ message }: { message: string }) {
  return (
    <div className="border border-[#E2B6AC] bg-[#F3E0DC] px-4 py-3 text-sm text-[#8C2E24]">
      Something went wrong loading this data: {message}
    </div>
  );
}

export function EmptyBlock({ message }: { message: string }) {
  return <div className="py-10 text-center text-sm text-[#5B6472]">{message}</div>;
}
