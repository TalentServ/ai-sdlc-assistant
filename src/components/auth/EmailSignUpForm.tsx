"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSignUp } from "@clerk/nextjs";
import { isClerkAPIResponseError } from "@clerk/nextjs/errors";
import { CLERK_PHONE_SETTINGS_URL } from "@/lib/clerk-auth-status";
import { ClerkCaptcha } from "@/components/auth/ClerkCaptcha";

const inputClassName =
  "w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500";

type Step = "details" | "verify";

type EmailSignUpFormProps = {
  phoneRequiredInClerk: boolean;
};

function isPhoneRequirementError(error: unknown): boolean {
  if (!isClerkAPIResponseError(error)) return false;

  return error.errors.some((entry) => {
    const params = entry.meta?.param_names;
    if (Array.isArray(params) && params.includes("phone_number")) {
      return true;
    }

    const message = `${entry.message ?? ""} ${entry.longMessage ?? ""}`.toLowerCase();
    return message.includes("phone");
  });
}

export function EmailSignUpForm({ phoneRequiredInClerk }: EmailSignUpFormProps) {
  const router = useRouter();
  const { isLoaded, signUp, setActive } = useSignUp();

  const [step, setStep] = useState<Step>("details");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [phoneConfigError, setPhoneConfigError] = useState(false);
  const [loading, setLoading] = useState(false);

  async function completeSignUp() {
    if (!signUp || signUp.status !== "complete" || !signUp.createdSessionId) {
      return;
    }

    await setActive({ session: signUp.createdSessionId });
    router.push("/dashboard");
  }

  async function handleGoogleSignUp() {
    if (!isLoaded || !signUp) return;

    setError(null);
    setLoading(true);

    try {
      await signUp.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/sign-up/sso-callback",
        redirectUrlComplete: "/dashboard",
      });
    } catch (caught) {
      setError(
        isClerkAPIResponseError(caught)
          ? caught.errors[0]?.longMessage ?? caught.errors[0]?.message ?? "Google sign-up failed."
          : "Google sign-up failed."
      );
      setLoading(false);
    }
  }

  async function handleDetailsSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isLoaded || !signUp) return;

    setError(null);
    setPhoneConfigError(false);
    setLoading(true);

    try {
      await signUp.create({
        firstName: firstName.trim() || undefined,
        lastName: lastName.trim() || undefined,
        emailAddress: emailAddress.trim(),
        password,
      });

      if (signUp.status === "complete") {
        await completeSignUp();
        return;
      }

      const needsPhone =
        signUp.requiredFields?.includes("phone_number") ||
        signUp.missingFields?.includes("phone_number");

      if (needsPhone) {
        setPhoneConfigError(true);
        return;
      }

      if (
        signUp.unverifiedFields?.includes("email_address") ||
        signUp.status === "missing_requirements"
      ) {
        await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
        setStep("verify");
        return;
      }

      setError("Sign-up could not be completed. Check your details and try again.");
    } catch (caught) {
      if (isPhoneRequirementError(caught)) {
        setPhoneConfigError(true);
        return;
      }

      setError(
        isClerkAPIResponseError(caught)
          ? caught.errors[0]?.longMessage ?? caught.errors[0]?.message ?? "Sign-up failed."
          : "Sign-up failed."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifySubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isLoaded || !signUp) return;

    setError(null);
    setLoading(true);

    try {
      await signUp.attemptEmailAddressVerification({ code: code.trim() });

      if (signUp.status === "complete") {
        await completeSignUp();
        return;
      }

      if (
        signUp.requiredFields?.includes("phone_number") ||
        signUp.missingFields?.includes("phone_number")
      ) {
        setPhoneConfigError(true);
        setStep("details");
        return;
      }

      setError("Verification failed. Check the code and try again.");
    } catch (caught) {
      if (isPhoneRequirementError(caught)) {
        setPhoneConfigError(true);
        setStep("details");
        return;
      }

      setError(
        isClerkAPIResponseError(caught)
          ? caught.errors[0]?.longMessage ?? caught.errors[0]?.message ?? "Verification failed."
          : "Verification failed."
      );
    } finally {
      setLoading(false);
    }
  }

  if (!isLoaded) {
    return (
      <div className="w-full max-w-md rounded-xl border border-slate-800 bg-slate-900/80 p-8 text-center text-sm text-slate-400">
        Loading sign-up…
      </div>
    );
  }

  return (
    <div className="w-full max-w-md rounded-xl border border-slate-800 bg-slate-900/80 p-8 shadow-xl">
      <h1 className="text-2xl font-semibold text-white">
        {step === "verify" ? "Verify your email" : "Create your account"}
      </h1>
      <p className="mt-2 text-sm text-slate-400">
        {step === "verify"
          ? `Enter the verification code sent to ${emailAddress}.`
          : "Sign up with email only — no phone number required."}
      </p>

      {phoneConfigError ? (
        <div className="mt-4 rounded-lg border border-rose-500/40 bg-rose-500/10 px-3 py-3 text-sm text-rose-100">
          <p className="font-medium">Clerk still requires a phone number for this app.</p>
          <p className="mt-1 text-rose-100/90">
            Open your Clerk dashboard, go to User &amp; authentication → Phone, and turn off all
            phone sign-up options. Then refresh and try again.
          </p>
          <a
            href={CLERK_PHONE_SETTINGS_URL}
            className="mt-3 inline-flex rounded-md bg-rose-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-400"
            target="_blank"
            rel="noreferrer"
          >
            Open Clerk phone settings
          </a>
        </div>
      ) : null}

      {error ? (
        <p className="mt-4 rounded-md border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-100">
          {error}
        </p>
      ) : null}

      {step === "details" ? (
        <>
          <button
            type="button"
            onClick={handleGoogleSignUp}
            disabled={loading}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm font-medium text-slate-100 hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Continue with Google
          </button>

          <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-wide text-slate-500">
            <span className="h-px flex-1 bg-slate-800" />
            or
            <span className="h-px flex-1 bg-slate-800" />
          </div>

          <form className="space-y-4" onSubmit={handleDetailsSubmit}>
            <div className="grid grid-cols-2 gap-3">
              <label className="block text-sm text-slate-300">
                First name
                <input
                  className={`${inputClassName} mt-1`}
                  value={firstName}
                  onChange={(event) => setFirstName(event.target.value)}
                  autoComplete="given-name"
                />
              </label>
              <label className="block text-sm text-slate-300">
                Last name
                <input
                  className={`${inputClassName} mt-1`}
                  value={lastName}
                  onChange={(event) => setLastName(event.target.value)}
                  autoComplete="family-name"
                />
              </label>
            </div>

            <label className="block text-sm text-slate-300">
              Email address
              <input
                className={`${inputClassName} mt-1`}
                type="email"
                required
                value={emailAddress}
                onChange={(event) => setEmailAddress(event.target.value)}
                autoComplete="email"
                placeholder="Enter your email address"
              />
            </label>

            <label className="block text-sm text-slate-300">
              Password
              <input
                className={`${inputClassName} mt-1`}
                type="password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="new-password"
                placeholder="Enter your password"
              />
            </label>

            <ClerkCaptcha />

            <button
              type="submit"
              disabled={loading || phoneRequiredInClerk}
              className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Creating account…"
                : phoneRequiredInClerk
                  ? "Fix Clerk phone settings first"
                  : "Continue"}
            </button>
          </form>
        </>
      ) : (
        <form className="mt-6 space-y-4" onSubmit={handleVerifySubmit}>
          <label className="block text-sm text-slate-300">
            Verification code
            <input
              className={`${inputClassName} mt-1`}
              inputMode="numeric"
              autoComplete="one-time-code"
              required
              value={code}
              onChange={(event) => setCode(event.target.value)}
              placeholder="Enter 6-digit code"
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Verifying…" : "Verify email"}
          </button>

          <button
            type="button"
            className="w-full text-sm text-slate-400 hover:text-slate-200"
            onClick={() => {
              setStep("details");
              setCode("");
              setError(null);
            }}
          >
            Back to sign-up details
          </button>
        </form>
      )}

      <p className="mt-6 text-center text-sm text-slate-400">
        Already have an account?{" "}
        <Link href="/sign-in" className="font-medium text-indigo-400 hover:text-indigo-300">
          Sign in
        </Link>
      </p>
    </div>
  );
}
