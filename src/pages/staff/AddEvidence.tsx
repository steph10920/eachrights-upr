import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  FileText,
  Loader2,
  Save,
} from "lucide-react";

import { supabase } from "../../lib/supabase";
import { getCurrentStaffProfile } from "../../lib/auth";

export default function AddEvidence() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    country: "",
    recommendation: "",
    action: "",
    evidenceType: "document",
    sourceName: "",
    sourceUrl: "",
    publicationDate: "",
    notes: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const updateField = (field: keyof typeof form, value: string) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError(null);
    setSuccess(false);

    if (!form.title.trim()) {
      setError("Please enter an evidence title.");
      return;
    }

    if (!form.description.trim()) {
      setError("Please provide a description of the evidence.");
      return;
    }

    if (!form.sourceName.trim()) {
      setError("Please enter the source name.");
      return;
    }

    try {
      setSubmitting(true);

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) throw userError;

      if (!user) {
        throw new Error("You must be signed in to submit evidence.");
      }

      const profile = await getCurrentStaffProfile();

      if (!profile) {
        throw new Error(
          "Your staff profile could not be found. Please contact an administrator."
        );
      }

      if (profile.account_status !== "active") {
        throw new Error(
          "Your account is not active. You cannot submit evidence at this time."
        );
      }

      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        country: form.country.trim(),
        recommendation: form.recommendation.trim(),
        action: form.action.trim(),
        evidence_type: form.evidenceType,
        source_name: form.sourceName.trim(),
        source_url: form.sourceUrl.trim(),
        publication_date: form.publicationDate || null,
        notes: form.notes.trim(),
        submitted_by_name: profile.full_name || "",
        submitted_by_organisation: profile.organisation || "",
      };

      const { error: insertError } = await supabase
        .from("submissions")
        .insert({
          submitted_by: user.id,
          entity_type: "evidence",
          entity_id: null,
          payload,
          status: "pending_review",
        });

      if (insertError) throw insertError;

      setSuccess(true);

      setTimeout(() => {
        navigate("/staff/submissions");
      }, 1000);
    } catch (err) {
      console.error("Failed to submit evidence:", err);

      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to submit evidence. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/staff"
            className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-emerald-700"
          >
            <ArrowLeft size={17} />
            Back to Dashboard
          </Link>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                  <FileText size={22} />
                </div>

                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                    Add Evidence
                  </h1>
                  <p className="text-sm text-slate-500">
                    Submit supporting evidence for review.
                  </p>
                </div>
              </div>
            </div>

            <Link
              to="/staff/submissions"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              <FileText size={17} />
              My Submissions
            </Link>
          </div>
        </div>

        {/* Success */}
        {success && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800">
            <CheckCircle2 className="mt-0.5 shrink-0" size={20} />

            <div>
              <p className="font-semibold">Evidence submitted successfully.</p>
              <p className="text-sm">
                Your submission has been sent for review.
              </p>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <p className="font-semibold">Submission failed</p>
            <p className="mt-1">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6">
              <h2 className="text-lg font-bold text-slate-900">
                Evidence Information
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Provide the basic information about the evidence.
              </p>
            </div>

            <div className="grid gap-5">
              <div>
                <label
                  htmlFor="title"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Evidence Title <span className="text-red-500">*</span>
                </label>

                <input
                  id="title"
                  type="text"
                  value={form.title}
                  onChange={(event) =>
                    updateField("title", event.target.value)
                  }
                  placeholder="e.g. National Education Sector Strategic Plan"
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Description <span className="text-red-500">*</span>
                </label>

                <textarea
                  id="description"
                  rows={5}
                  value={form.description}
                  onChange={(event) =>
                    updateField("description", event.target.value)
                  }
                  placeholder="Explain what this evidence demonstrates and how it relates to UPR implementation."
                  className="w-full resize-y rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  required
                />
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="country"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Country
                  </label>

                  <input
                    id="country"
                    type="text"
                    value={form.country}
                    onChange={(event) =>
                      updateField("country", event.target.value)
                    }
                    placeholder="e.g. Kenya"
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="evidenceType"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Evidence Type
                  </label>

                  <select
                    id="evidenceType"
                    value={form.evidenceType}
                    onChange={(event) =>
                      updateField("evidenceType", event.target.value)
                    }
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  >
                    <option value="document">Document</option>
                    <option value="report">Report</option>
                    <option value="policy">Policy</option>
                    <option value="legislation">Legislation</option>
                    <option value="government_data">Government Data</option>
                    <option value="research">Research</option>
                    <option value="media">Media</option>
                    <option value="website">Website</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </div>
          </section>

          {/* Related Information */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6">
              <h2 className="text-lg font-bold text-slate-900">
                Related UPR Information
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Link this evidence to the relevant recommendation or action.
              </p>
            </div>

            <div className="grid gap-5">
              <div>
                <label
                  htmlFor="recommendation"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Related Recommendation
                </label>

                <textarea
                  id="recommendation"
                  rows={4}
                  value={form.recommendation}
                  onChange={(event) =>
                    updateField("recommendation", event.target.value)
                  }
                  placeholder="Enter or paste the relevant UPR recommendation."
                  className="w-full resize-y rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div>
                <label
                  htmlFor="action"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Related Action
                </label>

                <textarea
                  id="action"
                  rows={3}
                  value={form.action}
                  onChange={(event) =>
                    updateField("action", event.target.value)
                  }
                  placeholder="Describe the related implementation action, if applicable."
                  className="w-full resize-y rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              </div>
            </div>
          </section>

          {/* Source */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6">
              <h2 className="text-lg font-bold text-slate-900">
                Source Information
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Provide enough information for a reviewer to verify the
                evidence.
              </p>
            </div>

            <div className="grid gap-5">
              <div>
                <label
                  htmlFor="sourceName"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Source Name <span className="text-red-500">*</span>
                </label>

                <input
                  id="sourceName"
                  type="text"
                  value={form.sourceName}
                  onChange={(event) =>
                    updateField("sourceName", event.target.value)
                  }
                  placeholder="e.g. Ministry of Education"
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="sourceUrl"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Source URL
                </label>

                <input
                  id="sourceUrl"
                  type="url"
                  value={form.sourceUrl}
                  onChange={(event) =>
                    updateField("sourceUrl", event.target.value)
                  }
                  placeholder="https://example.org/document"
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div>
                <label
                  htmlFor="publicationDate"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Publication Date
                </label>

                <input
                  id="publicationDate"
                  type="date"
                  value={form.publicationDate}
                  onChange={(event) =>
                    updateField("publicationDate", event.target.value)
                  }
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div>
                <label
                  htmlFor="notes"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Additional Notes
                </label>

                <textarea
                  id="notes"
                  rows={4}
                  value={form.notes}
                  onChange={(event) =>
                    updateField("notes", event.target.value)
                  }
                  placeholder="Add any additional context that may help the reviewer."
                  className="w-full resize-y rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              </div>
            </div>
          </section>

          {/* Submission Notice */}
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            <p className="font-semibold">Review required</p>
            <p className="mt-1">
              Submitted evidence will remain pending until it has been
              reviewed and verified by an authorised reviewer.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Link
              to="/staff"
              className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Submit Evidence
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
