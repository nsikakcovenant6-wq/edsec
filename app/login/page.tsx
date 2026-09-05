/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        "/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            email,
            password,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data?.message ||
            "Unable to sign in. Please check your details.",
        );
        return;
      }

      if (data?.user?.role === "ADMIN") {
        router.replace("/admin");
      } else {
        router.replace("/student/dashboard");
      }

      router.refresh();
    } catch (error) {
      console.error("Login error:", error);

      setError(
        "Something went wrong while signing in. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#050816]">
      <section className="grid min-h-screen lg:grid-cols-[1.15fr_0.85fr]">
        {/* =========================================================
            VISUAL / 3D SIDE
        ========================================================= */}
        <div className="relative hidden overflow-hidden lg:block">
          {/* Background */}
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=2200&q=85"
              alt="Students learning technology in a modern classroom"
              className="h-full w-full object-cover"
            />

            <div className="absolute inset-0 bg-[#050816]/70" />
            <div className="absolute inset-0 bg-linear-to-br from-blue-950/80 via-transparent to-cyan-950/70" />
          </div>

          {/* Atmospheric glow */}
          <div className="absolute -left-40 top-10 h-96 w-96 rounded-full bg-blue-500/20 blur-[120px]" />
          <div className="absolute -bottom-40 right-10 h-120 w-120 rounded-full bg-cyan-400/10 blur-[130px]" />

          {/* Navigation */}
          <div className="relative z-20 flex items-center justify-between px-10 py-8 xl:px-14">
            <Link
              href="/"
              className="group inline-flex items-center gap-3"
            >
              <div className="grid h-12 w-12 place-items-center rounded-2xl border border-white/20 bg-white/95 shadow-2xl shadow-black/20 transition group-hover:-translate-y-0.5">
                <img
                  src="/edsec-logo.png"
                  alt="EDSEC"
                  className="h-9 w-auto object-contain"
                />
              </div>

              <div>
                <p className="font-bold tracking-wide text-white">
                  EDSEC
                </p>

                <p className="text-xs text-white/50">
                  Computer Training
                </p>
              </div>
            </Link>

            <Link
              href="/register"
              className="rounded-full border border-white/15 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-xl transition hover:bg-white/15"
            >
              Create account
            </Link>
          </div>

          {/* 3D composition */}
          <div className="relative z-10 flex min-h-[calc(100vh-112px)] items-center px-10 pb-16 pt-6 xl:px-14">
            <div className="relative w-full max-w-3xl">
              {/* Decorative perspective frame */}
              <div className="absolute -inset-6 -rotate-3 rounded-[3rem] border border-white/10 bg-white/2.5 shadow-2xl shadow-black/30 backdrop-blur-sm" />

              <div className="absolute -inset-2 rotate-1 rounded-[2.5rem] border border-blue-400/10 bg-blue-500/3" />

              {/* Main image card */}
              <div className="group relative aspect-[1.18/1] overflow-hidden rounded-4xl border border-white/15 bg-slate-900/50 shadow-[0_40px_120px_rgba(0,0,0,0.45)] backdrop-blur-md transition duration-700 hover:rotate-[0.5deg]">
                <img
                  src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1800&q=85"
                  alt="Technology workspace"
                  className="h-full w-full object-cover opacity-90 transition duration-700 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-linear-to-t from-[#050816] via-transparent to-blue-950/10" />

                {/* Image label */}
                <div className="absolute left-6 top-6 rounded-full border border-white/15 bg-black/25 px-4 py-2 text-xs font-semibold tracking-wide text-white backdrop-blur-xl">
                  EDSEC LEARNING ENVIRONMENT
                </div>

                {/* Bottom message */}
                <div className="absolute bottom-7 left-7 right-7">
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">
                    Innovate. Educate. Elevate.
                  </p>

                  <h1 className="mt-3 max-w-xl text-4xl font-bold leading-tight tracking-tight text-white xl:text-5xl">
                    Build skills that move you forward.
                  </h1>
                </div>
              </div>

              {/* Floating progress card */}
              <div className="absolute -bottom-7 -right-7 z-20 w-64 rounded-2xl border border-white/15 bg-white/10 p-4 shadow-2xl shadow-black/40 backdrop-blur-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-white/50">
                      LEARNING
                    </p>

                    <p className="mt-1 text-sm font-bold text-white">
                      Your journey
                    </p>
                  </div>

                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-cyan-400/15 text-sm font-bold text-cyan-300">
                    01
                  </div>
                </div>

                <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full w-[72%] rounded-full bg-cyan-400" />
                </div>

                <p className="mt-2 text-xs text-white/40">
                  Learn. Practice. Build.
                </p>
              </div>

              {/* Floating course card */}
              <div className="absolute -left-7 top-20 z-20 hidden w-48 rounded-2xl border border-white/15 bg-slate-950/65 p-4 shadow-2xl shadow-black/40 backdrop-blur-2xl xl:block">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-500/20 text-blue-300">
                    ✦
                  </div>

                  <div>
                    <p className="text-xs text-white/40">
                      SKILLS
                    </p>

                    <p className="text-sm font-semibold text-white">
                      Technology
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {[
                    "Web",
                    "IT",
                    "Cyber",
                    "Design",
                  ].map((item) => (
                    <span
                      key={item}
                      className="rounded-full bg-white/5 px-2.5 py-1 text-[10px] font-medium text-white/60"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================
            LOGIN SIDE
        ========================================================= */}
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f8fafc] px-5 py-10 sm:px-8">
          {/* Mobile atmospheric background */}
          <div className="absolute -right-32 -top-32 h-80 w-80 rounded-full bg-blue-200/40 blur-3xl lg:hidden" />
          <div className="absolute -bottom-40 -left-32 h-96 w-96 rounded-full bg-cyan-200/30 blur-3xl lg:hidden" />

          <div className="relative z-10 w-full max-w-md">
            {/* Mobile logo */}
            <div className="mb-8 flex justify-center lg:hidden">
              <Link
                href="/"
                className="inline-flex items-center gap-3"
              >
                <div className="grid h-12 w-12 place-items-center rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <img
                    src="/edsec-logo.png"
                    alt="EDSEC"
                    className="h-9 w-auto object-contain"
                  />
                </div>

                <div>
                  <p className="font-bold text-slate-950">
                    EDSEC
                  </p>

                  <p className="text-xs text-slate-500">
                    Computer Training
                  </p>
                </div>
              </Link>
            </div>

            {/* Login card */}
            <div className="relative overflow-hidden rounded-4xl border border-slate-200/80 bg-white/90 p-7 shadow-[0_30px_80px_rgba(15,23,42,0.10)] backdrop-blur-xl sm:p-9">
              {/* Decorative corner */}
              <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-blue-100/60 blur-2xl" />

              <div className="relative">
                <div className="mb-8">
                  <span className="inline-flex rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.15em] text-blue-600">
                    Student Portal
                  </span>

                  <h2 className="mt-5 text-3xl font-bold tracking-tight text-slate-950">
                    Welcome back.
                  </h2>

                  <p className="mt-3 text-sm leading-6 text-slate-500">
                    Sign in to continue learning,
                    track your progress and build
                    practical technology skills.
                  </p>
                </div>

                {error && (
                  <div
                    role="alert"
                    className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3.5 text-sm leading-6 text-red-700"
                  >
                    {error}
                  </div>
                )}

                <form
                  onSubmit={handleSubmit}
                  className="space-y-5"
                >
                  {/* Email */}
                  <div>
                    <label
                      htmlFor="email"
                      className="text-sm font-semibold text-slate-700"
                    >
                      Email address
                    </label>

                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(event) =>
                        setEmail(event.target.value)
                      }
                      placeholder="you@example.com"
                      className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                    />
                  </div>

                  {/* Password */}
                  <div>
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor="password"
                        className="text-sm font-semibold text-slate-700"
                      >
                        Password
                      </label>

                      <Link
                        href="/forgot-password"
                        className="text-sm font-semibold text-blue-600 transition hover:text-blue-700"
                      >
                        Forgot password?
                      </Link>
                    </div>

                    <input
                      id="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(event) =>
                        setPassword(event.target.value)
                      }
                      placeholder="Enter your password"
                      className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                    />
                  </div>

                  {/* Session notice */}
                  <div className="flex gap-3 rounded-2xl border border-blue-100 bg-blue-50/70 p-4">
                    <div className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-blue-100 text-xs font-bold text-blue-600">
                      ✓
                    </div>

                    <p className="text-xs leading-5 text-blue-700">
                      You will remain signed in on this
                      device until you log out.
                    </p>
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="group relative w-full overflow-hidden rounded-2xl bg-slate-950 px-6 py-4 font-semibold text-white shadow-xl shadow-slate-950/15 transition duration-300 hover:-translate-y-0.5 hover:bg-blue-600 hover:shadow-blue-600/20 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <span className="relative z-10">
                      {loading
                        ? "Signing in..."
                        : "Sign in to EDSEC →"}
                    </span>

                    <span className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                  </button>
                </form>

                {/* Register */}
                <div className="mt-8 border-t border-slate-100 pt-7 text-center">
                  <p className="text-sm text-slate-500">
                    Don&apos;t have an EDSEC account?
                  </p>

                  <Link
                    href="/register"
                    className="mt-2 inline-flex font-semibold text-blue-600 transition hover:text-blue-700"
                  >
                    Create an account →
                  </Link>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-6 flex items-center justify-center gap-4 text-xs text-slate-400">
              <Link
                href="/"
                className="transition hover:text-slate-700"
              >
                EDSEC
              </Link>

              <span>•</span>

              <span>
                Innovate. Educate. Elevate.
              </span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}