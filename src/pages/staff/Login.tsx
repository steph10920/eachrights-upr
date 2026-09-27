import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import { signIn } from "../../lib/auth";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);

    try {
      await signIn(email, password);

      // Successful login → Staff Dashboard
      navigate("/staff", { replace: true });
    } catch (error) {
      console.error("Login error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Unable to sign in. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex min-h-screen">

        {/* Left panel */}
        <div className="hidden bg-slate-900 lg:flex lg:w-1/2">
          <div className="flex w-full flex-col justify-between p-12 text-white">

            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-400">
                EACHRights
              </p>

              <h1 className="mt-6 max-w-lg text-5xl font-bold leading-tight">
                UPR Monitoring Dashboard
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
                Staff workspace for managing recommendations,
                implementation updates, evidence and review workflows.
              </p>
            </div>

            <div className="border-t border-slate-700 pt-6">
              <p className="text-sm text-slate-400">
                East African Centre for Human Rights
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Staff Portal
              </p>
            </div>

          </div>
        </div>

        {/* Login panel */}
        <div className="flex w-full items-center justify-center px-6 py-12 lg:w-1/2">

          <div className="w-full max-w-md">

            {/* Mobile branding */}
            <div className="mb-10 lg:hidden">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
                EACHRights
              </p>

              <h1 className="mt-3 text-3xl font-bold text-slate-900">
                UPR Staff Portal
              </h1>
            </div>

            <div className="mb-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100">
                <LockKeyhole className="h-6 w-6 text-emerald-700" />
              </div>

              <h2 className="mt-6 text-3xl font-bold text-slate-900">
                Welcome back
              </h2>

              <p className="mt-2 text-slate-500">
                Sign in to access the EACHRights UPR staff portal.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >

              {/* Error */}
              {error && (
                <div
                  role="alert"
                  className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                >
                  {error}
                </div>
              )}

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Email address
                </label>

                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(event) =>
                      setEmail(event.target.value)
                    }
                    placeholder="you@example.org"
                    autoComplete="email"
                    disabled={loading}
                    className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-4 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 disabled:bg-slate-100"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Password
                </label>

                <div className="relative">
                  <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) =>
                      setPassword(event.target.value)
                    }
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    disabled={loading}
                    className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-12 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 disabled:bg-slate-100"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((current) => !current)
                    }
                    disabled={loading}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center rounded-xl bg-emerald-700 px-4 py-3 font-semibold text-white transition hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>

            </form>

            <p className="mt-8 text-center text-xs leading-5 text-slate-400">
              This area is restricted to authorised EACHRights staff.
            </p>

          </div>

        </div>
      </div>
    </div>
  );
}