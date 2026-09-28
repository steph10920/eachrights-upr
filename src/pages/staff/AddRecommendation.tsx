import { type FormEvent, useState } from "react";
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

export default function AddRecommendation() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();

  const [recommendation, setRecommendation] =
    useState("");

  const [country, setCountry] = useState("");

  const [cycle, setCycle] = useState("");

  const [theme, setTheme] = useState("");

  const [institution, setInstitution] =
    useState("");

  const [response, setResponse] = useState<
    "accepted" | "noted" | "pending" | ""
  >("");

  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(false);

  const [success, setSuccess] = useState(false);

  const [error, setError] = useState("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setSuccess(false);

    if (!user) {
      setError(
        "You must be signed in to submit a recommendation."
      );
      return;
    }

    if (!recommendation.trim()) {
      setError(
        "Please enter the UPR recommendation."
      );
      return;
    }

    if (!country.trim()) {
      setError("Please enter the country.");
      return;
    }

    try {
      setLoading(true);

      /*
       * Make sure a staff profile exists before creating
       * a submission.
       */
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

      /*
       * Store the recommendation in the submissions table.
       *
       * The actual recommendation becomes part of payload
       * and is reviewed before publication.
       */
      const payload = {
        title: recommendation.trim(),
        recommendation: recommendation.trim(),

        country: country.trim(),

        cycle: cycle.trim() || null,

        theme: theme.trim() || null,

        institution: institution.trim() || null,

        response: response || null,

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

      const { error: submissionError } =
        await supabase
          .from("submissions")
          .insert({
            submitted_by: user.id,
            entity_type: "recommendation",
            entity_id: null,
            payload,
            status: "pending_review",
          });

      if (submissionError) {
        throw submissionError;
      }

      setSuccess(true);

      /*
       * Clear the form after successful submission.
       */
      setRecommendation("");
      setCountry("");
      setCycle("");
      setTheme("");
      setInstitution("");
      setResponse("");
      setNotes("");

      /*
       * Give the user a short moment to see the success
       * message before returning to submissions.
       */
      window.setTimeout(() => {
        navigate("/staff/submissions");
      }, 1200);
    } catch (err) {
      console.error(
        "Failed to submit recommendation:",
        err
      );

      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(
          "Something went wrong while submitting the recommendation."
        );
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">

        {/* Back */}
        <Link
          to="/staff"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-emerald-700"
        >
          <ArrowLeft size={17} />
          Back to Dashboard
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
            <FileText size={23} />
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Add UPR Recommendation
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
            Submit a Universal Periodic Review recommendation
            for verification and review. The information will
            remain pending until a reviewer approves it.
          </p>
        </div>

        {/* Success */}
        {success && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
            <CheckCircle2
              size={20}
              className="mt-0.5 shrink-0"
            />

            <div>
              <p className="font-semibold">
                Recommendation submitted successfully.
              </p>

              <p className="mt-1">
                Your submission has been sent for review.
              </p>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <p className="font-semibold">
              Unable to submit recommendation
            </p>

            <p className="mt-1">
              {error}
            </p>
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          {/* Recommendation */}
          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-5">
              <h2 className="text-lg font-bold text-gray-900">
                Recommendation Details
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Enter the recommendation exactly or as
                accurately as possible from the official UPR
                documentation.
              </p>
            </div>

            <div>
              <label
                htmlFor="recommendation"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                UPR Recommendation
                <span className="ml-1 text-red-500">
                  *
                </span>
              </label>

              <textarea
                id="recommendation"
                value={recommendation}
                onChange={(event) =>
                  setRecommendation(event.target.value)
                }
                rows={6}
                required
                placeholder="Enter the full UPR recommendation..."
                className="w-full resize-y rounded-xl border border-gray-200 px-4 py-3 text-sm leading-6 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />
            </div>
          </section>

          {/* Classification */}
          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-5">
              <h2 className="text-lg font-bold text-gray-900">
                Classification
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Add information that will help organise and
                analyse the recommendation.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">

              {/* Country */}
              <div>
                <label
                  htmlFor="country"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Country
                  <span className="ml-1 text-red-500">
                    *
                  </span>
                </label>

                <input
                  id="country"
                  type="text"
                  value={country}
                  onChange={(event) =>
                    setCountry(event.target.value)
                  }
                  required
                  placeholder="e.g. Kenya"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              {/* UPR Cycle */}
              <div>
                <label
                  htmlFor="cycle"
                  className="mb-2 block text-sm font-semibold text-gray-700"
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
                  placeholder="e.g. 4th Cycle"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              {/* Theme */}
              <div>
                <label
                  htmlFor="theme"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Theme
                </label>

                <input
                  id="theme"
                  type="text"
                  value={theme}
                  onChange={(event) =>
                    setTheme(event.target.value)
                  }
                  placeholder="e.g. Education Justice"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              {/* Institution */}
              <div>
                <label
                  htmlFor="institution"
                  className="mb-2 block text-sm font-semibold text-gray-700"
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
                  placeholder="e.g. Ministry of Education"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              </div>
            </div>
          </section>

          {/* Government response */}
          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-5">
              <h2 className="text-lg font-bold text-gray-900">
                Response Information
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Record the State's response where this
                information is available.
              </p>
            </div>

            <div>
              <label
                htmlFor="response"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Response
              </label>

              <select
                id="response"
                value={response}
                onChange={(event) =>
                  setResponse(
                    event.target.value as
                      | "accepted"
                      | "noted"
                      | "pending"
                      | ""
                  )
                }
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              >
                <option value="">
                  Select response
                </option>

                <option value="accepted">
                  Accepted
                </option>

                <option value="noted">
                  Noted
                </option>

                <option value="pending">
                  Pending / Unknown
                </option>
              </select>
            </div>
          </section>

          {/* Notes */}
          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-5">
              <h2 className="text-lg font-bold text-gray-900">
                Additional Notes
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Add sources, context, references, or other
                information that may assist the reviewer.
              </p>
            </div>

            <textarea
              value={notes}
              onChange={(event) =>
                setNotes(event.target.value)
              }
              rows={5}
              placeholder="Add supporting notes or references..."
              className="w-full resize-y rounded-xl border border-gray-200 px-4 py-3 text-sm leading-6 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
          </section>

          {/* Submitter */}
          <section className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
            <h2 className="text-sm font-bold text-gray-900">
              Submission Information
            </h2>

            <div className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
              <div>
                <p className="text-xs text-gray-400">
                  Submitted by
                </p>

                <p className="mt-1 font-medium text-gray-700">
                  {profile?.full_name ||
                    user?.email ||
                    "Current user"}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400">
                  Organisation
                </p>

                <p className="mt-1 font-medium text-gray-700">
                  {profile?.organisation ||
                    "EACHRights"}
                </p>
              </div>
            </div>
          </section>

          {/* Actions */}
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Link
              to="/staff/submissions"
              className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
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
