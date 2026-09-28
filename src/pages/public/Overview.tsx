import {
  ArrowRight,
  BarChart3,
  FileText,
  Search,
  ShieldCheck,
} from "lucide-react";
import { Link } from "react-router-dom";

const stats = [
  {
    label: "Recommendations",
    value: "—",
    icon: FileText,
  },
  {
    label: "Supported",
    value: "—",
    icon: ShieldCheck,
  },
  {
    label: "Noted",
    value: "—",
    icon: BarChart3,
  },
];

export default function Overview() {
  return (
    <div className="px-5 py-8 sm:px-8 lg:px-10 lg:py-12">
      <section className="relative overflow-hidden rounded-3xl bg-slate-950 px-6 py-14 text-white sm:px-10 lg:px-14 lg:py-20">
        <div className="relative z-10 max-w-3xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-white/80">
            Universal Periodic Review
          </div>

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Implementation &
            <span className="block text-emerald-300">
              accountability
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
            Explore UPR recommendations, implementation progress,
            responsible institutions, evidence and thematic trends.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/recommendations"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
            >
              Explore recommendations
              <ArrowRight size={17} />
            </Link>

            <Link
              to="/recommendations"
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              <Search size={17} />
              Search UPR data
            </Link>
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="rounded-2xl border border-slate-200 bg-white p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    {stat.label}
                  </p>

                  <p className="mt-2 text-3xl font-bold text-slate-900">
                    {stat.value}
                  </p>
                </div>

                <div className="rounded-xl bg-emerald-50 p-3 text-emerald-700">
                  <Icon size={21} />
                </div>
              </div>
            </div>
          );
        })}
      </section>

      <section className="mt-10 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-7">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Implementation status
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Current status across recommendations.
              </p>
            </div>

            <BarChart3 className="text-slate-400" size={21} />
          </div>

          <div className="mt-8 space-y-5">
            {[
              "Implemented",
              "Partially implemented",
              "Not implemented",
              "Pending",
            ].map((status) => (
              <div key={status}>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="text-slate-600">
                    {status}
                  </span>

                  <span className="font-semibold text-slate-900">
                    —
                  </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full w-0 rounded-full bg-emerald-600" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-7">
          <h2 className="text-lg font-bold text-slate-900">
            Recent updates
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Latest implementation activity.
          </p>

          <div className="mt-6 rounded-xl border border-dashed border-slate-200 p-8 text-center">
            <p className="text-sm text-slate-500">
              No implementation updates loaded yet.
            </p>

            <p className="mt-1 text-xs text-slate-400">
              This section will connect to Supabase.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
