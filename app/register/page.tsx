/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

export default function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setMessage("");

    // ------------------------------------------------------------
    // CLIENT-SIDE VALIDATION
    // ------------------------------------------------------------

    if (!fullName.trim()) {
      setMessage("Please enter your full name.");
      return;
    }

    if (!email.trim()) {
      setMessage("Please enter your email address.");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setMessage(
        "Password must be at least 8 characters.",
      );
      return;
    }

    setLoading(true);

    try {
      // ----------------------------------------------------------
      // CREATE ACCOUNT
      // ----------------------------------------------------------

      const response = await fetch(
        "/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            fullName: fullName.trim(),
            email: email.trim().toLowerCase(),
            phone: phone.trim(),
            password,
          }),
        },
      );

      const data = await response.json();

      // ----------------------------------------------------------
      // HANDLE REGISTRATION ERROR
      // ----------------------------------------------------------

      if (!response.ok) {
        setMessage(
          data?.message ||
            "Unable to create your account.",
        );
        return;
      }

      // ----------------------------------------------------------
      // REGISTRATION SUCCESSFUL
      // ----------------------------------------------------------

      window.location.href =
        data?.redirectTo ||
        "/student/dashboard";
    } catch (error) {
      console.error(
        "Registration request error:",
        error,
      );

      setMessage(
        "Unable to connect to EDSEC right now. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#050816]">
      <div className="grid min-h-screen lg:grid-cols-[0.95fr_1.05fr]">
        {/* ========================================================
            LEFT — REGISTER FORM
        ========================================================= */}

        <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f8fafc] px-5 py-10 sm:px-8 lg:order-1">
          {/* Soft background glow */}

          <div className="absolute -left-40 -top-32 h-96 w-96 rounded-full bg-blue-200/40 blur-3xl" />

          <div className="absolute -bottom-40 right-0 h-96 w-96 rounded-full bg-cyan-200/30 blur-3xl" />

          <div className="relative z-10 w-full max-w-lg">
            {/* Mobile logo */}

            <div className="mb-8 flex justify-center lg:hidden">
              <Link
                href="/"
                className="inline-flex items-center gap-3"
              >
                <div className="grid h-12 w-12 place-items-center rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <img
                    src="/edsec-logo.png"
                    alt="EDSEC Computer Training"
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

            {/* ====================================================
                REGISTER CARD
            ==================================================== */}

            <div className="relative overflow-hidden rounded-4xl border border-slate-200/80 bg-white/95 p-7 shadow-[0_30px_90px_rgba(15,23,42,0.12)] backdrop-blur-xl sm:p-9">
              {/* Decorative glow */}

              <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-blue-100/60 blur-3xl" />

              <div className="relative">
                {/* Heading */}

                <div>
                  <span className="inline-flex rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.15em] text-blue-600">
                    Start Learning
                  </span>

                  <h1 className="mt-5 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                    Start your journey.
                  </h1>

                  <p className="mt-3 max-w-md text-sm leading-6 text-slate-500">
                    Create your EDSEC account and gain
                    access to practical technology
                    training, projects and learning
                    resources.
                  </p>
                </div>

                {/* Progress indicators */}

                <div className="mt-7 grid grid-cols-3 gap-2">
                  <div className="rounded-xl bg-blue-600 px-3 py-2.5 text-center">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-white/70">
                      Step
                    </p>

                    <p className="mt-0.5 text-sm font-bold text-white">
                      01
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-100 px-3 py-2.5 text-center">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Learn
                    </p>

                    <p className="mt-0.5 text-sm font-bold text-slate-700">
                      02
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-100 px-3 py-2.5 text-center">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Build
                    </p>

                    <p className="mt-0.5 text-sm font-bold text-slate-700">
                      03
                    </p>
                  </div>
                </div>

                {/* Error */}

                {message && (
                  <div
                    role="alert"
                    className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3.5 text-sm leading-6 text-red-700"
                  >
                    {message}
                  </div>
                )}

                {/* =================================================
                    FORM
                ================================================= */}

                <form
                  onSubmit={handleSubmit}
                  className="mt-7 space-y-4"
                >
                  {/* Full name */}

                  <div>
                    <label
                      htmlFor="fullName"
                      className="mb-2 block text-sm font-semibold text-slate-700"
                    >
                      Full name
                    </label>

                    <input
                      id="fullName"
                      type="text"
                      required
                      autoComplete="name"
                      value={fullName}
                      onChange={(event) =>
                        setFullName(
                          event.target.value,
                        )
                      }
                      placeholder="Your full name"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                    />
                  </div>

                  {/* Email */}

                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block text-sm font-semibold text-slate-700"
                    >
                      Email address
                    </label>

                    <input
                      id="email"
                      type="email"
                      required
                      autoComplete="email"
                      value={email}
                      onChange={(event) =>
                        setEmail(
                          event.target.value,
                        )
                      }
                      placeholder="you@example.com"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                    />
                  </div>

                  {/* Phone */}

                  <div>
                    <label
                      htmlFor="phone"
                      className="mb-2 block text-sm font-semibold text-slate-700"
                    >
                      Phone number
                      <span className="ml-1 font-normal text-slate-400">
                        (optional)
                      </span>
                    </label>

                    <input
                      id="phone"
                      type="tel"
                      autoComplete="tel"
                      value={phone}
                      onChange={(event) =>
                        setPhone(
                          event.target.value,
                        )
                      }
                      placeholder="+234 800 000 0000"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                    />
                  </div>

                  {/* Password */}

                  <div>
                    <label
                      htmlFor="password"
                      className="mb-2 block text-sm font-semibold text-slate-700"
                    >
                      Password
                    </label>

                    <div className="relative">
                      <input
                        id="password"
                        type={
                          showPassword
                            ? "text"
                            : "password"
                        }
                        required
                        minLength={8}
                        autoComplete="new-password"
                        value={password}
                        onChange={(event) =>
                          setPassword(
                            event.target.value,
                          )
                        }
                        placeholder="At least 8 characters"
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 pr-20 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword(
                            (current) =>
                              !current,
                          )
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-500 transition hover:bg-slate-200 hover:text-slate-900"
                      >
                        {showPassword
                          ? "Hide"
                          : "Show"}
                      </button>
                    </div>
                  </div>

                  {/* Confirm password */}

                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="mb-2 block text-sm font-semibold text-slate-700"
                    >
                      Confirm password
                    </label>

                    <div className="relative">
                      <input
                        id="confirmPassword"
                        type={
                          showConfirmPassword
                            ? "text"
                            : "password"
                        }
                        required
                        minLength={8}
                        autoComplete="new-password"
                        value={confirmPassword}
                        onChange={(event) =>
                          setConfirmPassword(
                            event.target.value,
                          )
                        }
                        placeholder="Repeat your password"
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 pr-20 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(
                            (current) =>
                              !current,
                          )
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-500 transition hover:bg-slate-200 hover:text-slate-900"
                      >
                        {showConfirmPassword
                          ? "Hide"
                          : "Show"}
                      </button>
                    </div>
                  </div>

                  {/* Information */}

                  <div className="flex gap-3 rounded-2xl border border-blue-100 bg-blue-50/70 p-4">
                    <div className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-blue-100 text-xs font-bold text-blue-600">
                      ✓
                    </div>

                    <p className="text-xs leading-5 text-blue-700">
                      Your account gives you access
                      to the EDSEC student portal,
                      courses, assessments and
                      learning progress.
                    </p>
                  </div>

                  {/* Submit */}

                  <button
                    type="submit"
                    disabled={loading}
                    className="group relative w-full overflow-hidden rounded-2xl bg-slate-950 px-5 py-4 font-semibold text-white shadow-xl shadow-slate-950/15 transition duration-300 hover:-translate-y-0.5 hover:bg-blue-600 hover:shadow-blue-600/20 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <span className="relative z-10">
                      {loading
                        ? "Creating account..."
                        : "Create my EDSEC account →"}
                    </span>

                    <span className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                  </button>
                </form>

                {/* Login */}

                <div className="mt-8 border-t border-slate-100 pt-7 text-center">
                  <p className="text-sm text-slate-500">
                    Already have an EDSEC account?
                  </p>

                  <Link
                    href="/login"
                    className="mt-2 inline-flex font-semibold text-blue-600 transition hover:text-blue-700"
                  >
                    Sign in instead →
                  </Link>
                </div>
              </div>
            </div>

            {/* Terms */}

            <p className="mt-5 text-center text-xs leading-5 text-slate-400">
              By creating an account, you agree to use
              the EDSEC platform responsibly.
            </p>

            <div className="mt-4 text-center">
              <Link
                href="/"
                className="text-xs font-medium text-slate-400 transition hover:text-slate-700"
              >
                ← Back to EDSEC
              </Link>
            </div>
          </div>
        </section>

        {/* ========================================================
            RIGHT — 3D VISUAL EXPERIENCE
        ========================================================= */}

        <section className="relative hidden overflow-hidden bg-[#050816] lg:order-2 lg:flex">
          {/* Background image */}

          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=2200&q=85"
              alt="Students collaborating with technology"
              className="h-full w-full object-cover"
            />

            <div className="absolute inset-0 bg-[#050816]/75" />

            <div className="absolute inset-0 bg-linear-to-br from-blue-950/90 via-[#050816]/30 to-cyan-950/80" />
          </div>

          {/* Atmospheric lighting */}

          <div className="absolute -left-40 top-20 h-120 w-120 rounded-full bg-blue-500/20 blur-[130px]" />

          <div className="absolute -bottom-40 right-0 h-128 w-lg rounded-full bg-cyan-400/10 blur-[140px]" />

          {/* Navigation */}

          <div className="relative z-20 flex w-full items-center justify-between px-10 py-8 xl:px-14">
            <Link
              href="/"
              className="group inline-flex items-center gap-3"
            >
              <div className="grid h-12 w-12 place-items-center rounded-2xl border border-white/20 bg-white/95 shadow-2xl shadow-black/30 transition group-hover:-translate-y-0.5">
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

            <div className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-semibold text-white/70 backdrop-blur-xl">
              STUDENT PORTAL
            </div>
          </div>

          {/* =====================================================
              3D COMPOSITION
          ===================================================== */}

          <div className="relative z-10 flex min-h-[calc(100vh-112px)] w-full items-center justify-center px-10 pb-16 pt-4 xl:px-14">
            <div className="relative w-full max-w-3xl">
              {/* Back perspective layer */}

              <div className="absolute -inset-8 rotate-[-5deg] rounded-[3rem] border border-white/10 bg-white/2.5 shadow-2xl shadow-black/40 backdrop-blur-sm" />

              {/* Middle perspective layer */}

              <div className="absolute -inset-4 rotate-2 rounded-[2.8rem] border border-blue-400/10 bg-blue-500/[0.035]" />

              {/* Main image */}

              <div className="group relative aspect-[1.12/1] overflow-hidden rounded-[2.3rem] border border-white/15 bg-slate-950/60 shadow-[0_50px_140px_rgba(0,0,0,0.55)] backdrop-blur-xl">
                <img
                  src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=2000&q=85"
                  alt="Students learning computer technology"
                  className="h-full w-full object-cover opacity-85 transition duration-1000 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-linear-to-t from-[#050816] via-[#050816]/10 to-transparent" />

                <div className="absolute inset-0 bg-blue-950/10 mix-blend-multiply" />

                {/* Top label */}

                <div className="absolute left-6 top-6 rounded-full border border-white/15 bg-black/25 px-4 py-2 text-[10px] font-bold tracking-[0.16em] text-white backdrop-blur-xl">
                  THE EDSEC EXPERIENCE
                </div>

                {/* Main copy */}

                <div className="absolute bottom-8 left-8 right-8">
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">
                    Learn • Build • Grow
                  </p>

                  <h2 className="mt-3 max-w-xl text-4xl font-bold leading-tight tracking-tight text-white xl:text-5xl">
                    Your next skill starts here.
                  </h2>

                  <p className="mt-4 max-w-lg text-sm leading-6 text-white/60">
                    Practical technology education
                    designed to help you learn,
                    create and prepare for the digital
                    world.
                  </p>
                </div>
              </div>

              {/* =================================================
                  FLOATING CARD — COURSES
              ================================================= */}

              <div className="absolute -left-8 top-16 z-20 hidden w-52 -rotate-3 rounded-2xl border border-white/15 bg-slate-950/70 p-4 shadow-[0_25px_60px_rgba(0,0,0,0.45)] backdrop-blur-2xl xl:block">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-white/40">
                      COURSES
                    </p>

                    <p className="mt-1 text-sm font-bold text-white">
                      Explore skills
                    </p>
                  </div>

                  <div className="grid h-9 w-9 place-items-center rounded-xl bg-blue-500/15 text-blue-300">
                    ✦
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  {[
                    "Web Development",
                    "Cybersecurity",
                    "IT Support",
                  ].map((course) => (
                    <div
                      key={course}
                      className="flex items-center gap-2 text-[11px] text-white/60"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />

                      {course}
                    </div>
                  ))}
                </div>
              </div>

              {/* =================================================
                  FLOATING CARD — LEARNING
              ================================================= */}

              <div className="absolute -bottom-8 -right-8 z-20 w-64 rotate-2 rounded-2xl border border-white/15 bg-white/10 p-4 shadow-[0_30px_70px_rgba(0,0,0,0.5)] backdrop-blur-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-white/40">
                      YOUR JOURNEY
                    </p>

                    <p className="mt-1 text-sm font-bold text-white">
                      Ready to begin?
                    </p>
                  </div>

                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-cyan-400/15 text-cyan-300">
                    →
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2">
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full w-1/3 rounded-full bg-cyan-400" />
                  </div>

                  <span className="text-[10px] font-semibold text-white/50">
                    01/03
                  </span>
                </div>
              </div>

              {/* =================================================
                  SMALL FLOATING BADGE
              ================================================= */}

              <div className="absolute -right-5 top-1/3 z-20 hidden rounded-2xl border border-white/10 bg-blue-600/80 px-4 py-3 shadow-2xl shadow-blue-950/40 backdrop-blur-xl 2xl:block">
                <p className="text-[10px] font-bold uppercase tracking-wider text-blue-100">
                  EDSEC
                </p>

                <p className="mt-1 text-xs font-semibold text-white">
                  Innovate.
                </p>

                <p className="text-xs font-semibold text-white">
                  Educate.
                </p>

                <p className="text-xs font-semibold text-cyan-200">
                  Elevate.
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}

          <div className="absolute bottom-7 left-10 z-20 xl:left-14">
            <p className="text-xs text-white/35">
              Practical technology education.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}