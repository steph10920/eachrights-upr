import { useState } from "react";
import type { FormEvent } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  FileCheck2,
  Loader2,
  Send,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../hooks/useAuth";

export default function AddAction() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();

  const [actionTitle, setActionTitle] = useState("");
  const [description, setDescription] = useState("");
  const [country, setCountry] = useState("");
  const [cycle, setCycle] = useState("");
  const [institution, setInstitution] = useState("");
  const [theme, setTheme] = useState("");
  const [actionType, setActionType] = useState("");
  const [status, setStatus] = useState("");
  const [startDate, setStartDate] = useState("");
  const [completionDate, setCompletionDate] = useState("");
  const [responsibleBody, setResponsibleBody] = useState("");
  const [outcomes, setOutcomes] = useState("");
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
      setError("You must be signed in to submit an action.");
      return;
    }

    if (!actionTitle.trim()) {
      setError("Please enter an action title.");
      return;
    }

    if (!description.trim()) {
      setError("Please provide a description of the action.");
      return;
    }

    if (!country.trim()) {
      setError("Please enter the country.");
      return;
    }

    if (!actionType) {
      setError("Please select the action type.");
      return;
    }

    if (!status) {
      setError("Please select the action status.");
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
        title: actionTitle.trim(),

        action_title: actionTitle.trim(),

        description: description.trim(),

        country: country.trim(),

        cycle: cycle.trim() || null,

        institution: institution.trim() || null,

        theme: theme.trim() || null,

        action_type: actionType,

        status,

        start_date: startDate || null,

        completion_date: completionDate || null,

        responsible_body: responsibleBody.trim() || null,

        outcomes: outcomes.trim() || null,

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
          entity_type: "action",
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

      setActionTitle("");
      setDescription("");
      setCountry("");
      setCycle("");
      setInstitution("");
      setTheme("");
      setActionType("");
      setStatus("");
      setStartDate("");
      setCompletionDate("");
      setResponsibleBody("");
      setOutcomes("");
      setEvidence("");
      setNotes("");

      window.setTimeout(() => {
        navigate("/staff/submissions");
      }, 1200);
    } catch (err) {
      console.error("Failed to submit action:", err);

      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(
          "Something went wrong while submitting the action."
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
                <FileCheck2
                  size={22}
                  className="text-emerald-700"
                />
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Add Action
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Record an action, intervention, programme activity,
                policy measure or other development related to UPR
                implementation.
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 px-4 py-3 sm:min-w-[190px]">
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
            SUCCESS
        ====================================================== */}

        {success && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
            <CheckCircle2
              size={20}
              className="mt-0.5 shrink-0 text-emerald-600"
            />

            <div>
              <p className="font-semibold text-emerald-800">
                Action submitted successfully.
              </p>

              <p className="mt-1 text-sm text-emerald-700">
                Your action has been sent for review. Redirecting
                to your submissions...
              </p>
            </div>
          </div>
        )}

        {/* ======================================================
            ERROR
        ====================================================== */}

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* ======================================================
            FORM
        ====================================================== */}

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* ====================================================
              ACTION DETAILS
          ==================================================== */}

          <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-slate-900">
                Action Details
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Provide the basic information about the action.
              </p>
            </div>

            <div className="space-y-5">

              {/* Title */}

              <div>
                <label
                  htmlFor="actionTitle"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Action Title{" "}
                  <span className="text-red-500">*</span>
                </label>

                <input
                  id="actionTitle"
                  type="text"
                  value={actionTitle}
                  onChange={(event) =>
                    setActionTitle(event.target.value)
                  }
                  placeholder="e.g. National Human Rights Action Plan implementation"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  required
                />
              </div>

              {/* Description */}

              <div>
                <label
                  htmlFor="description"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Description{" "}
                  <span className="text-red-500">*</span>
                </label>

                <textarea
                  id="description"
                  value={description}
                  onChange={(event) =>
                    setDescription(event.target.value)
                  }
                  rows={6}
                  placeholder="Describe what was done, what the action involved and how it relates to the UPR recommendation..."
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
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

              {/* Institution / Theme */}

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="institution"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Institution
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

                <div>
                  <label
                    htmlFor="theme"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Human Rights Theme
                  </label>

                  <input
                    id="theme"
                    type="text"
                    value={theme}
                    onChange={(event) =>
                      setTheme(event.target.value)
                    }
                    placeholder="e.g. Education, Health, Gender"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* ====================================================
              CLASSIFICATION
          ==================================================== */}

          <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-slate-900">
                Classification & Status
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Categorise the action and indicate its current status.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">

              {/* Action Type */}

              <div>
                <label
                  htmlFor="actionType"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Action Type{" "}
                  <span className="text-red-500">*</span>
                </label>

                <select
                  id="actionType"
                  value={actionType}
                  onChange={(event) =>
                    setActionType(event.target.value)
                  }
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  required
                >
                  <option value="">
                    Select action type
                  </option>

                  <option value="legislation">
                    Legislation / Policy
                  </option>

                  <option value="programme">
                    Programme / Intervention
                  </option>

                  <option value="institutional">
                    Institutional Measure
                  </option>

                  <option value="capacity_building">
                    Capacity Building
                  </option>

                  <option value="awareness">
                    Awareness / Public Education
                  </option>

                  <option value="service_delivery">
                    Service Delivery
                  </option>

                  <option value="budget">
                    Budget / Resource Allocation
                  </option>

                  <option value="monitoring">
                    Monitoring / Evaluation
                  </option>

                  <option value="other">
                    Other
                  </option>
                </select>
              </div>

              {/* Status */}

              <div>
                <label
                  htmlFor="status"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Status{" "}
                  <span className="text-red-500">*</span>
                </label>

                <select
                  id="status"
                  value={status}
                  onChange={(event) =>
                    setStatus(event.target.value)
                  }
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  required
                >
                  <option value="">
                    Select status
                  </option>

                  <option value="planned">
                    Planned
                  </option>

                  <option value="ongoing">
                    Ongoing
                  </option>

                  <option value="completed">
                    Completed
                  </option>

                  <option value="suspended">
                    Suspended
                  </option>

                  <option value="cancelled">
                    Cancelled
                  </option>
                </select>
              </div>
            </div>
          </section>

          {/* ====================================================
              TIMELINE & RESPONSIBILITY
          ==================================================== */}

          <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-slate-900">
                Timeline & Responsibility
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Add dates and identify the organisation responsible
                for the action.
              </p>
            </div>

            <div className="space-y-5">

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="startDate"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Start Date
                  </label>

                  <input
                    id="startDate"
                    type="date"
                    value={startDate}
                    onChange={(event) =>
                      setStartDate(event.target.value)
                    }
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="completionDate"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Completion Date
                  </label>

                  <input
                    id="completionDate"
                    type="date"
                    value={completionDate}
                    onChange={(event) =>
                      setCompletionDate(event.target.value)
                    }
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="responsibleBody"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Responsible Body
                </label>

                <input
                  id="responsibleBody"
                  type="text"
                  value={responsibleBody}
                  onChange={(event) =>
                    setResponsibleBody(event.target.value)
                  }
                  placeholder="e.g. Ministry, County Government, Commission or other institution"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div>
                <label
                  htmlFor="outcomes"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Outcomes / Results
                </label>

                <textarea
                  id="outcomes"
                  value={outcomes}
                  onChange={(event) =>
                    setOutcomes(event.target.value)
                  }
                  rows={5}
                  placeholder="Describe measurable outcomes, results, beneficiaries reached or changes resulting from the action..."
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
                Supporting Information
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Provide sources or additional information that can
                help reviewers verify the action.
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
                  placeholder="Enter links, reports, policy documents, statistics or other supporting sources..."
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
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
                  placeholder="Add any additional information for the reviewer..."
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
