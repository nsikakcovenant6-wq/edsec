"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function ActivateAccountPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const strength = useMemo(() => {
    if (!password) return "";
    if (password.length >= 12 && /[A-Z]/.test(password) && /\d/.test(password)) return "Strong";
    if (password.length >= 8) return "Good";
    return "Too short";
  }, [password]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    if (!token) {
      setMessage("This activation link is missing its secure token.");
      return;
    }

    if (password.length < 8) {
      setMessage("Your password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("The passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/activate-applicant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Unable to activate your account.");
        return;
      }

      setSuccess(true);
      setMessage(data.message || "Your account is ready.");
    } catch (error) {
      console.error("Activation request error:", error);
      setMessage("Unable to connect to EDSEC right now. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 px-5 py-10 text-slate-950 sm:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-80px)] max-w-5xl items-center justify-center">
        <section className="grid w-full overflow-hidden rounded-3xl bg-white shadow-2xl lg:grid-cols-[0.9fr_1.1fr]">
          <div className="hidden bg-linear-to-br from-blue-700 via-blue-800 to-slate-950 p-10 text-white lg:block">
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white">
                <Image src="/edsec-logo.png" alt="EDSEC ICT Institute" width={40} height={40} className="h-9 w-auto object-contain" />
              </div>
              <div>
                <p className="font-bold">EDSEC</p>
                <p className="text-xs text-white/60">ICT Institute</p>
              </div>
            </Link>

            <p className="mt-20 text-sm font-bold uppercase tracking-[0.2em] text-blue-200">Applicant Portal</p>
            <h1 className="mt-4 text-4xl font-black tracking-tight">Your EDSEC journey starts here.</h1>
            <p className="mt-5 max-w-md leading-7 text-white/70">
              Set your password, sign in, and keep track of your application while the EDSEC admissions team reviews it.
            </p>

            <div className="mt-10 space-y-3 text-sm text-white/80">
              <p>✓ Track application status</p>
              <p>✓ Receive admission updates</p>
              <p>✓ Access your student dashboard after approval</p>
            </div>
          </div>

          <div className="p-7 sm:p-10">
            <Link href="/" className="text-sm font-semibold text-blue-600 hover:text-blue-700">← EDSEC ICT Institute</Link>

            {!success ? (
              <>
                <p className="mt-10 text-sm font-semibold uppercase tracking-[0.16em] text-blue-600">Secure Account Setup</p>
                <h2 className="mt-2 text-3xl font-black tracking-tight">Set your password</h2>
                <p className="mt-3 text-sm leading-6 text-slate-500">Create the password you will use to sign in to your EDSEC applicant portal.</p>

                <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                  <div>
                    <label className="text-sm font-semibold text-slate-700">Password</label>
                    <div className="mt-2 flex overflow-hidden rounded-xl border border-slate-200 bg-white focus-within:border-blue-500">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        className="min-w-0 flex-1 px-4 py-3 outline-none"
                        placeholder="At least 8 characters"
                        autoComplete="new-password"
                      />
                      <button type="button" onClick={() => setShowPassword((value) => !value)} className="px-4 text-xs font-bold text-slate-500 hover:text-slate-900">
                        {showPassword ? "Hide" : "Show"}
                      </button>
                    </div>
                    {password && <p className="mt-2 text-xs text-slate-500">Password strength: <span className="font-semibold">{strength}</span></p>}
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-slate-700">Confirm password</label>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(event) => setConfirmPassword(event.target.value)}
                      className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
                      placeholder="Enter your password again"
                      autoComplete="new-password"
                    />
                  </div>

                  {message && <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-700">{message}</p>}

                  <button disabled={loading} className="w-full rounded-xl bg-blue-600 px-5 py-3.5 font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60">
                    {loading ? "Setting password..." : "Set Password & Continue"}
                  </button>
                </form>
              </>
            ) : (
              <div className="py-16 text-center">
                <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-100 text-2xl text-emerald-700">✓</div>
                <h2 className="mt-6 text-3xl font-black">Account activated</h2>
                <p className="mx-auto mt-3 max-w-md leading-7 text-slate-500">Your password is set. Sign in to your applicant portal to monitor your application.</p>
                <Link href="/login" className="mt-8 inline-flex rounded-xl bg-blue-600 px-6 py-3 font-bold text-white hover:bg-blue-700">Sign in to EDSEC →</Link>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
