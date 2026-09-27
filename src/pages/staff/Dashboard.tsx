import { Link } from "react-router-dom";
import {
  ClipboardList,
  FileCheck2,
  FilePlus2,
  Upload,
} from "lucide-react";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-7xl">

        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-emerald-700">
            EACHRights UPR
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Staff Dashboard
          </h1>

          <p className="mt-2 text-slate-500">
            Manage UPR recommendations, implementation updates,
            evidence and submissions.
          </p>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-3">

          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <ClipboardList className="text-emerald-700" />

            <p className="mt-4 text-sm text-slate-500">
              My submissions
            </p>

            <p className="mt-1 text-3xl font-bold text-slate-900">
              0
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <FileCheck2 className="text-emerald-700" />

            <p className="mt-4 text-sm text-slate-500">
              Pending review
            </p>

            <p className="mt-1 text-3xl font-bold text-slate-900">
              0
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <FileCheck2 className="text-emerald-700" />

            <p className="mt-4 text-sm text-slate-500">
              Approved
            </p>

            <p className="mt-1 text-3xl font-bold text-slate-900">
              0
            </p>
          </div>

        </div>

        <div className="mt-10">

          <h2 className="text-xl font-bold text-slate-900">
            Quick actions
          </h2>

          <div className="mt-5 grid gap-5 md:grid-cols-3">

            <Link
              to="/staff/add-recommendation"
              className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:border-emerald-300 hover:shadow-sm"
            >
              <FilePlus2 className="text-emerald-700" />

              <h3 className="mt-4 font-semibold text-slate-900">
                Add recommendation
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Submit a UPR recommendation for review.
              </p>
            </Link>

            <Link
              to="/staff/add-update"
              className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:border-emerald-300 hover:shadow-sm"
            >
              <FileCheck2 className="text-emerald-700" />

              <h3 className="mt-4 font-semibold text-slate-900">
                Add implementation update
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Record progress on an existing recommendation.
              </p>
            </Link>

            <Link
              to="/staff/add-evidence"
              className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:border-emerald-300 hover:shadow-sm"
            >
              <Upload className="text-emerald-700" />

              <h3 className="mt-4 font-semibold text-slate-900">
                Add evidence
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Submit evidence supporting implementation monitoring.
              </p>
            </Link>

          </div>

        </div>

      </div>
    </div>
  );
}