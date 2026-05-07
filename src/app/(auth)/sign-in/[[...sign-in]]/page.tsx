"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Logo from "@/components/brand/Logo";
import LanguageSwitcher from "@/components/i18n/LanguageSwitcher";
import { toUserRole } from "@/lib/access-list";
import { getDashboardPath } from "@/lib/auth/roles";
import { seedUserData } from "@/lib/seed-user-data";

// ---------------------------------------------------------------------------
// CodeInput — 6-box numeric code field with auto-advance, backspace, paste
// ---------------------------------------------------------------------------
type CodeInputProps = {
  value: string;
  onChange: (value: string) => void;
  onComplete?: (value: string) => void;
  disabled?: boolean;
  error?: boolean;
};

function CodeInput({ value, onChange, onComplete, disabled, error }: CodeInputProps) {
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  // Keep inputs in sync with `value` (controlled by parent).
  const digits = Array.from({ length: 6 }, (_, i) => value[i] ?? "");

  const setDigitAt = useCallback(
    (index: number, digit: string) => {
      const next = digits.slice();
      next[index] = digit;
      const joined = next.join("").slice(0, 6);
      onChange(joined);
      if (joined.length === 6 && !joined.includes("") && onComplete) {
        onComplete(joined);
      }
    },
    [digits, onChange, onComplete]
  );

  function focusInput(index: number) {
    const el = inputsRef.current[index];
    if (el) {
      el.focus();
      // place caret at end
      try {
        el.setSelectionRange(el.value.length, el.value.length);
      } catch {
        /* some inputs (numeric) don't support setSelectionRange in all browsers */
      }
    }
  }

  function handleChange(index: number, raw: string) {
    // Strip non-digits.
    const cleaned = raw.replace(/\D/g, "");
    if (!cleaned) {
      // user deleted the digit
      setDigitAt(index, "");
      return;
    }

    if (cleaned.length === 1) {
      setDigitAt(index, cleaned);
      if (index < 5) {
        focusInput(index + 1);
      }
      return;
    }

    // More than one digit (e.g., autofill or manual paste into a single box).
    const merged = digits.slice();
    for (let i = 0; i < cleaned.length && index + i < 6; i += 1) {
      merged[index + i] = cleaned[i];
    }
    const joined = merged.join("").slice(0, 6);
    onChange(joined);
    const nextFocus = Math.min(index + cleaned.length, 5);
    focusInput(nextFocus);
    if (joined.length === 6 && !joined.includes("") && onComplete) {
      onComplete(joined);
    }
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace") {
      if (digits[index]) {
        // clear current
        setDigitAt(index, "");
        return;
      }
      // empty box — go back
      if (index > 0) {
        e.preventDefault();
        setDigitAt(index - 1, "");
        focusInput(index - 1);
      }
      return;
    }

    if (e.key === "ArrowLeft" && index > 0) {
      e.preventDefault();
      focusInput(index - 1);
      return;
    }

    if (e.key === "ArrowRight" && index < 5) {
      e.preventDefault();
      focusInput(index + 1);
      return;
    }
  }

  function handlePaste(index: number, e: React.ClipboardEvent<HTMLInputElement>) {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    e.preventDefault();
    const merged = digits.slice();
    for (let i = 0; i < pasted.length && index + i < 6; i += 1) {
      merged[index + i] = pasted[i];
    }
    const joined = merged.join("").slice(0, 6);
    onChange(joined);
    const nextFocus = Math.min(index + pasted.length, 5);
    focusInput(nextFocus);
    if (joined.length === 6 && !joined.includes("") && onComplete) {
      onComplete(joined);
    }
  }

  return (
    <div
      className="flex justify-between gap-2"
      role="group"
      aria-label="6-digit verification code"
    >
      {digits.map((digit, i) => (
        <input
          key={i}
          ref={(el) => {
            inputsRef.current[i] = el;
          }}
          type="text"
          inputMode="numeric"
          autoComplete={i === 0 ? "one-time-code" : "off"}
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={(e) => handlePaste(i, e)}
          onFocus={(e) => e.currentTarget.select()}
          disabled={disabled}
          aria-label={`Digit ${i + 1}`}
          className={`h-14 w-full min-w-0 flex-1 rounded-lg border bg-white text-center text-2xl font-semibold tabular-nums text-zinc-900 shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00a9e0] focus-visible:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed ${
            error
              ? "border-red-400 focus-visible:ring-red-400"
              : "border-zinc-300"
          }`}
        />
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Beta Sign-In Portal — two-step magic-code flow
// ---------------------------------------------------------------------------
type Step = "email" | "code";

function BetaPortal() {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [showResend, setShowResend] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Show OAuth errors from redirect
  useEffect(() => {
    const urlError = searchParams.get("error");
    if (urlError === "not_on_list") {
      setError(
        "Your Google account is not on the beta access list. Contact info@thesherpapros.com to request access."
      );
    } else if (urlError === "google_auth_failed") {
      const detail = searchParams.get("detail") ?? "";
      setError("Google sign-in failed: " + (detail || "Please try again."));
    }
  }, [searchParams]);

  function completeSignIn(
    normalizedEmail: string,
    name: string | null,
    defaultRole: string | null
  ) {
    localStorage.setItem("sherpa-test-auth", "true");
    localStorage.setItem("sherpa-test-email", normalizedEmail);
    localStorage.setItem("sherpa-test-name", name ?? normalizedEmail.split("@")[0]);

    const existingRole = localStorage.getItem(`sherpa:${normalizedEmail}:role`);
    const mappedRole = toUserRole(existingRole) ?? toUserRole(defaultRole);

    if (mappedRole) {
      localStorage.setItem("sherpa-test-role", mappedRole);
      localStorage.setItem(`sherpa:${normalizedEmail}:role`, mappedRole);
      const secure = window.location.protocol === "https:" ? "; secure" : "";
      document.cookie = `sherpa-role=${mappedRole}; path=/; max-age=${60 * 60 * 24 * 30}; samesite=lax${secure}`;
      seedUserData(normalizedEmail, mappedRole);
      router.push(getDashboardPath(mappedRole));
    } else {
      router.push("/select-role");
    }
  }

  async function handleRequestCode(e?: React.FormEvent) {
    if (e) e.preventDefault();
    setError("");

    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) return;

    setLoading(true);

    let res: Response;
    try {
      res = await fetch("/api/auth/email/request-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: normalizedEmail }),
      });
    } catch {
      setError(
        "Sign-in is temporarily unavailable. Please try Google sign-in or try again in a moment."
      );
      setLoading(false);
      return;
    }

    if (res.status === 503) {
      setError("Sign-in is temporarily unavailable.");
      setLoading(false);
      return;
    }

    if (res.status === 429) {
      setError("Too many code requests. Try again in an hour.");
      setLoading(false);
      return;
    }

    const data = (await res.json().catch(() => null)) as
      | { ok: true }
      | { ok: false; error?: string }
      | null;

    if (res.status === 400) {
      setError("Please enter a valid email.");
      setLoading(false);
      return;
    }

    if (!data || !data.ok) {
      setError("Sign-in is temporarily unavailable.");
      setLoading(false);
      return;
    }

    // Move to code step. Reset code-step state.
    setEmail(normalizedEmail);
    setCode("");
    setShowResend(false);
    setStep("code");
    setLoading(false);
  }

  async function handleVerifyCode(e?: React.FormEvent, submittedCode?: string) {
    if (e) e.preventDefault();
    setError("");

    const normalizedEmail = email.trim().toLowerCase();
    const codeToSubmit = (submittedCode ?? code).replace(/\D/g, "");

    if (codeToSubmit.length !== 6) {
      setError("Please enter the full 6-digit code.");
      return;
    }

    setLoading(true);

    let res: Response;
    try {
      res = await fetch("/api/auth/email/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: normalizedEmail, code: codeToSubmit }),
      });
    } catch {
      setError("Sign-in is temporarily unavailable. Please try again in a moment.");
      setLoading(false);
      return;
    }

    if (res.status === 503) {
      setError("Sign-in is temporarily unavailable.");
      setLoading(false);
      return;
    }

    const data = (await res.json().catch(() => null)) as
      | {
          ok: true;
          name?: string | null;
          defaultRole?: string | null;
        }
      | {
          ok: false;
          error?: string;
          attemptsLeft?: number;
        }
      | null;

    if (!data) {
      setError("Sign-in is temporarily unavailable.");
      setLoading(false);
      return;
    }

    if (!data.ok) {
      switch (data.error) {
        case "invalid_code": {
          const left = typeof data.attemptsLeft === "number" ? data.attemptsLeft : null;
          setError(
            left !== null
              ? `Invalid code. ${left} attempt${left === 1 ? "" : "s"} remaining.`
              : "Invalid code."
          );
          setShowResend(false);
          break;
        }
        case "code_expired":
          setError("Code expired. Request a new one.");
          setShowResend(true);
          break;
        case "code_locked":
          setError("Too many attempts. Request a new code.");
          setShowResend(true);
          break;
        case "code_consumed":
          setError("Code already used. Request a new one.");
          setShowResend(true);
          break;
        default:
          setError("We couldn't verify that code. Please try again.");
          setShowResend(false);
      }
      setLoading(false);
      return;
    }

    // Success — run the same post-sign-in flow as before.
    completeSignIn(
      normalizedEmail,
      data.name ?? null,
      data.defaultRole ?? null
    );
    // Don't unset loading; we're navigating away.
  }

  function handleBackToEmail() {
    setStep("email");
    setCode("");
    setError("");
    setShowResend(false);
  }

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center">
            <Logo size="xl" />
          </div>
          <h2 className="mt-6 text-2xl font-bold text-zinc-900">
            {step === "email" ? "Welcome to the beta" : "Check your email"}
          </h2>
          <p className="mt-2 text-sm text-zinc-500">
            {step === "email"
              ? "Sign in with the email from your invite to explore the platform."
              : `We emailed a code to ${email}. Enter it below.`}
          </p>
        </div>

        {/* Sign-in card */}
        <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm p-8">
          {step === "email" && (
            <>
              {/* Google OAuth */}
              <div className="mb-6">
                <a
                  href="/api/auth/google"
                  className="flex w-full items-center justify-center gap-3 rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm font-medium text-zinc-700 shadow-sm transition-all hover:bg-zinc-50 hover:shadow-md"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  Continue with Google
                </a>
              </div>

              {/* Divider */}
              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-zinc-200" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-white px-4 text-xs text-zinc-400">
                    or sign in with your invite email
                  </span>
                </div>
              </div>

              {/* Email form */}
              <form onSubmit={handleRequestCode} className="space-y-4">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-zinc-700 mb-1.5"
                  >
                    Email address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError("");
                    }}
                    placeholder="you@company.com"
                    required
                    className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00a9e0] focus-visible:ring-offset-1 transition-shadow"
                    autoComplete="email"
                    autoFocus
                  />
                </div>

                {error && (
                  <p className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-3">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading || !email.trim()}
                  className="w-full rounded-lg bg-[#00a9e0] px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#0090c0] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00a9e0] focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="inline-flex items-center gap-2">
                      <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Sending code...
                    </span>
                  ) : (
                    "Send me a code"
                  )}
                </button>
              </form>
            </>
          )}

          {step === "code" && (
            <form
              onSubmit={(e) => handleVerifyCode(e)}
              className="space-y-5"
            >
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">
                  6-digit code
                </label>
                <CodeInput
                  value={code}
                  onChange={(v) => {
                    setCode(v);
                    if (error) setError("");
                  }}
                  onComplete={(full) => {
                    // auto-submit when all 6 boxes are filled
                    if (!loading) {
                      void handleVerifyCode(undefined, full);
                    }
                  }}
                  disabled={loading}
                  error={Boolean(error)}
                />
              </div>

              {error && (
                <p className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-3">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading || code.length !== 6}
                className="w-full rounded-lg bg-[#00a9e0] px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#0090c0] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00a9e0] focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="inline-flex items-center gap-2">
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Verifying...
                  </span>
                ) : (
                  "Verify"
                )}
              </button>

              {showResend && (
                <button
                  type="button"
                  onClick={() => handleRequestCode()}
                  disabled={loading}
                  className="w-full rounded-lg border border-[#00a9e0] bg-white px-4 py-3 text-sm font-semibold text-[#00a9e0] shadow-sm transition-all hover:bg-[#00a9e0]/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00a9e0] focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Resend code
                </button>
              )}

              <div className="text-center">
                <button
                  type="button"
                  onClick={handleBackToEmail}
                  disabled={loading}
                  className="text-sm font-medium text-zinc-500 hover:text-zinc-700 underline-offset-4 hover:underline disabled:opacity-50"
                >
                  Use a different email
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 flex flex-col items-center gap-3">
          <p className="text-center text-xs text-zinc-400">
            Don&apos;t have an invite? Visit{" "}
            <a href="/" className="text-[#00a9e0] hover:underline">
              thesherpapros.com
            </a>{" "}
            to join the waitlist.
          </p>
          <LanguageSwitcher variant="full" />
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page export
// ---------------------------------------------------------------------------
export default function SignInPage() {
  return <BetaPortal />;
}
