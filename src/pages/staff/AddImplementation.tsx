import { useState } from "react";
import type { FormEvent } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  FileText,
  Loader2,
  Send,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../hooks/useAuth";

export default function AddImplementationUpdate() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();

  const [recommendation, setRecommendation] = useState("");
  const [country, setCountry] = useState("");
  const [cycle, setCycle] = useState("");
  const [institution, setInstitution] = useState("");
  const [implementationStatus, setImplementationStatus] = useState("");
  const [progress, setProgress] = useState("");
  const [challenges, setChallenges] = useState("");
  const [nextSteps, setNextSteps] = useState("");
  const [evidence, setEvidence] = useState("");
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess(false);

    if (!user) {
      setError("You must be signed in to submit an implementation update.");
      return;
    }

    if (!recommendation.trim()) {
      setError("Please enter the recommendation being implemented.");
      return;
    }

    if (!country.trim()) {
      setError("Please enter the country.");
      return;
    }

    if (!implementationStatus) {
      setError("Please select the implementation status.");
      return;
    }

    if (!progress.trim()) {
      setError("Please describe the implementation progress.");
      return;
    }

    try {
      setLoading(true);

      // ----------------------------------------------------------
      // Confirm staff profile
      // ----------------------------------------------------------

      const { data: staffProfile, error: profileError } =
        await supabase
          .from("users")
          .select(
            "id, email, full_name, organisation, role, account_status"
          )
          .eq("id", user.id)
          .maybeSingle();

      if (profileError) {
        throw profileError;
      }

      if (!staffProfile) {
        throw new Error(
          "Your staff profile could not be found. Please contact an administrator."
        );
      }

      if (staffProfile.account_status !== "active") {
        throw new Error(
          "Your account is not active and cannot submit information."
        );
      }

      // ----------------------------------------------------------
      // Submission payload
      // ----------------------------------------------------------

      const payload = {
        title: `Implementation update: ${recommendation.trim()}`,

        recommendation: recommendation.trim(),

        country: country.trim(),

        cycle: cycle.trim() || null,

        institution: institution.trim() || null,

        implementation_status: implementationStatus,

        progress: progress.trim(),

        challenges: challenges.trim() || null,

        next_steps: nextSteps.trim() || null,

        evidence: evidence.trim() || null,

        notes: notes.trim() || null,

        submitted_by_name:
          profile?.full_name ||
          staffProfile.full_name ||
          user.email,

        submitted_by_organisation:
          profile?.organisation ||
          staffProfile.organisation ||
          null,
      };

      // ----------------------------------------------------------
      // Insert submission
      // ----------------------------------------------------------

      const { error: submissionError } = await supabase
        .from("submissions")
        .insert({
          submitted_by: user.id,
          entity_type: "implementation_update",
          entity_id: null,
          payload,
          status: "pending_review",
        });

      if (submissionError) {
        throw submissionError;
      }

      // ----------------------------------------------------------
      // Success
      // ----------------------------------------------------------

      setSuccess(true);

      setRecommendation("");
      setCountry("");
      setCycle("");
      setInstitution("");
      setImplementationStatus("");
      setProgress("");
      setChallenges("");
      setNextSteps("");
      setEvidence("");
      setNotes("");

      window.setTimeout(() => {
        navigate("/staff/submissions");
      }, 1200);
    } catch (err) {
      console.error(
        "Failed to submit implementation update:",
        err
      );

      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(
          "Something went wrong while submitting the implementation update."
        );
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">

        {/* ======================================================
            BACK
        ====================================================== */}

        <Link
          to="/staff"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-emerald-700"
        >
          <ArrowLeft size={17} />
          Back to Dashboard
        </Link>

        {/* ======================================================
            HEADER
        ====================================================== */}

        <div className="mb-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

            <div>
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50">
                <FileText
                  size={22}
                  className="text-emerald-700"
                />
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Add Implementation Update
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Record progress on the implementation of a UPR
                recommendation. Your submission will be sent to the
                review queue for verification before publication.
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 px-4 py-3 text-left sm:min-w-[190px]">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Submitted by
              </p>

              <p className="mt-1 text-sm font-semibold text-slate-800">
                {profile?.full_name ||
                  user?.email ||
                  "Staff Member"}
              </p>

              <p className="mt-1 text-xs text-slate-500">
                {profile?.organisation || "EACHRights"}
              </p>
            </div>
          </div>
        </div>

        {/* ======================================================
            SUCCESS MESSAGE
        ====================================================== */}

        {success && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
            <CheckCircle2
              size={20}
              className="mt-0.5 shrink-0 text-emerald-600"
            />

            <div>
              <p className="font-semibold text-emerald-800">
                Implementation update submitted successfully.
              </p>

              <p className="mt-1 text-sm text-emerald-700">
                Your submission has been sent for review. Redirecting
                to your submissions...
              </p>
            </div>
          </div>
        )}

        {/* ======================================================
            ERROR MESSAGE
        ====================================================== */}

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* ======================================================
            FORM
        ====================================================== */}

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          {/* ====================================================
              RECOMMENDATION INFORMATION
          ==================================================== */}

          <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">

            <div className="mb-6">
              <h2 className="text-lg font-semibold text-slate-900">
                Recommendation Information
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Identify the recommendation and the country where
                implementation is being tracked.
              </p>
            </div>

            <div className="space-y-5">

              {/* Recommendation */}

              <div>
                <label
                  htmlFor="recommendation"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  UPR Recommendation{" "}
                  <span className="text-red-500">*</span>
                </label>

                <textarea
                  id="recommendation"
                  value={recommendation}
                  onChange={(event) =>
                    setRecommendation(event.target.value)
                  }
                  rows={5}
                  placeholder="Enter the UPR recommendation being implemented..."
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  required
                />
              </div>

              {/* Country / Cycle */}

              <div className="grid gap-5 md:grid-cols-2">

                <div>
                  <label
                    htmlFor="country"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Country{" "}
                    <span className="text-red-500">*</span>
                  </label>

                  <input
                    id="country"
                    type="text"
                    value={country}
                    onChange={(event) =>
                      setCountry(event.target.value)
                    }
                    placeholder="e.g. Kenya"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="cycle"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    UPR Cycle
                  </label>

                  <input
                    id="cycle"
                    type="text"
                    value={cycle}
                    onChange={(event) =>
                      setCycle(event.target.value)
                    }
                    placeholder="e.g. 4th UPR Cycle"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>

              </div>

              {/* Institution */}

              <div>
                <label
                  htmlFor="institution"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Responsible Institution
                </label>

                <input
                  id="institution"
                  type="text"
                  value={institution}
                  onChange={(event) =>
                    setInstitution(event.target.value)
                  }
                  placeholder="e.g. Ministry of Health"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              </div>

            </div>
          </section>

          {/* ====================================================
              IMPLEMENTATION STATUS
          ==================================================== */}

          <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">

            <div className="mb-6">
              <h2 className="text-lg font-semibold text-slate-900">
                Implementation Status
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Provide the current implementation status and
                supporting details.
              </p>
            </div>

            <div className="space-y-5">

              {/* Status */}

              <div>
                <label
                  htmlFor="implementationStatus"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Status{" "}
                  <span className="text-red-500">*</span>
                </label>

                <select
                  id="implementationStatus"
                  value={implementationStatus}
                  onChange={(event) =>
                    setImplementationStatus(event.target.value)
                  }
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  required
                >
                  <option value="">
                    Select implementation status
                  </option>

                  <option value="not_started">
                    Not Started
                  </option>

                  <option value="ongoing">
                    Ongoing
                  </option>

                  <option value="substantially_implemented">
                    Substantially Implemented
                  </option>

                  <option value="fully_implemented">
                    Fully Implemented
                  </option>

                  <option value="no_progress">
                    No Progress
                  </option>

                  <option value="unknown">
                    Unknown
                  </option>
                </select>
              </div>

              {/* Progress */}

              <div>
                <label
                  htmlFor="progress"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Implementation Progress{" "}
                  <span className="text-red-500">*</span>
                </label>

                <textarea
                  id="progress"
                  value={progress}
                  onChange={(event) =>
                    setProgress(event.target.value)
                  }
                  rows={6}
                  placeholder="Describe the actions taken, progress achieved, programmes implemented, legislation adopted, services delivered, or other relevant developments..."
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  required
                />
              </div>

              {/* Challenges */}

              <div>
                <label
                  htmlFor="challenges"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Challenges / Gaps
                </label>

                <textarea
                  id="challenges"
                  value={challenges}
                  onChange={(event) =>
                    setChallenges(event.target.value)
                  }
                  rows={4}
                  placeholder="Describe any implementation challenges, barriers, gaps or limitations..."
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              {/* Next Steps */}

              <div>
                <label
                  htmlFor="nextSteps"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Next Steps
                </label>

                <textarea
                  id="nextSteps"
                  value={nextSteps}
                  onChange={(event) =>
                    setNextSteps(event.target.value)
                  }
                  rows={4}
                  placeholder="Describe planned actions, commitments or next steps..."
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              </div>

            </div>
          </section>

          {/* ====================================================
              EVIDENCE
          ==================================================== */}

          <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">

            <div className="mb-6">
              <h2 className="text-lg font-semibold text-slate-900">
                Supporting Evidence
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Add references that can help reviewers verify the
                implementation update.
              </p>
            </div>

            <div className="space-y-5">

              <div>
                <label
                  htmlFor="evidence"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Evidence / Sources
                </label>

                <textarea
                  id="evidence"
                  value={evidence}
                  onChange={(event) =>
                    setEvidence(event.target.value)
                  }
                  rows={5}
                  placeholder="Enter links, reports, government documents, policy documents, statistics or other sources supporting this update..."
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />

                <p className="mt-2 text-xs text-slate-400">
                  You can add URLs or describe the supporting
                  documents here. Dedicated evidence uploads can be
                  added through the Evidence section.
                </p>
              </div>

              <div>
                <label
                  htmlFor="notes"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Additional Notes
                </label>

                <textarea
                  id="notes"
                  value={notes}
                  onChange={(event) =>
                    setNotes(event.target.value)
                  }
                  rows={4}
                  placeholder="Add any additional information that reviewers should know..."
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              </div>

            </div>
          </section>

          {/* ====================================================
              SUBMIT
          ==================================================== */}

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

            <Link
              to="/staff"
              className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2
                    size={18}
                    className="animate-spin"
                  />
                  Submitting...
                </>
              ) : (
                <>
                  <Send size={18} />
                  Submit for Review
                </>
              )}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
}
