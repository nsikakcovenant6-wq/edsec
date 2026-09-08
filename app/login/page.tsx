"use client";

/* eslint-disable @next/next/no-img-element */

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";

type Slide = {
  image: string;
  location: string;
  eyebrow: string;
  title: string;
  description: string;
};

const slides: Slide[] = [
  {
    image:
      "https://images.unsplash.com/photo-1526253038957-bce54e05968e?auto=format&fit=crop&w=2200&q=90",
    location: "PORT HARCOURT, NIGERIA",
    eyebrow: "TECH MENTORSHIP",
    title: "Learn from people building Africa's digital future.",
    description:
      "Practical ICT education designed to help you build real skills for the digital economy.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=2200&q=90",
    location: "PORT HARCOURT, NIGERIA",
    eyebrow: "COLLABORATIVE LEARNING",
    title: "Learn together. Build together.",
    description:
      "Turn ideas into practical projects through collaboration, technology and hands-on learning.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1528901166007-3784c7dd3653?auto=format&fit=crop&w=2200&q=90",
    location: "PORT HARCOURT, NIGERIA",
    eyebrow: "AFRICAN DEVELOPERS",
    title: "Technology is being built right here in Africa.",
    description:
      "Develop the skills and confidence to become part of Africa's growing technology ecosystem.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1532522953890-ccc87dfeb0b7?auto=format&fit=crop&w=2200&q=90",
    location: "PORT HARCOURT, NIGERIA",
    eyebrow: "CYBER & SOFTWARE",
    title: "Code. Secure. Create.",
    description:
      "Explore software development, cybersecurity and the technologies shaping tomorrow.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1529429612779-c8e40ef2f36d?auto=format&fit=crop&w=2200&q=90",
    location: "PORT HARCOURT, NIGERIA",
    eyebrow: "DIGITAL SKILLS",
    title: "Your next skill could change your future.",
    description:
      "Build practical ICT skills that move you closer to the career and opportunities you want.",
  },
];

const courses = [
  "Web Development",
  "Cybersecurity",
  "UI/UX Design",
  "Data Analysis",
];

export default function LoginPage() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length);
    }, 5500);

    return () => window.clearInterval(interval);
  }, []);

  const currentSlide = slides[activeSlide];

  const previewTransform = useMemo(() => {
    const rotateX = mouse.y * -4;
    const rotateY = mouse.x * 5;

    return `perspective(1500px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  }, [mouse]);

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();

    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;

    setMouse({
      x: (x - 0.5) * 2,
      y: (y - 0.5) * 2,
    });
  }

  function resetMouse() {
    setMouse({ x: 0, y: 0 });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    if (!email.trim()) {
      setMessage("Please enter your email address.");
      return;
    }

    if (!password) {
      setMessage("Please enter your password.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Invalid email or password.");
        return;
      }

      window.location.href =
        data.redirectTo ||
        (data.role === "ADMIN"
          ? "/admin"
          : "/student/dashboard");
    } catch (error) {
      console.error("Login request error:", error);

      setMessage(
        "Unable to connect to EDSEC right now. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      className="relative min-h-screen overflow-hidden bg-slate-950"
      onMouseMove={handleMouseMove}
      onMouseLeave={resetMouse}
    >
      {/* =========================================================
          BACKGROUND SLIDESHOW
      ========================================================== */}
      <div className="absolute inset-0">
        {slides.map((slide, index) => (
          <div
            key={slide.image}
            className={`absolute inset-0 transition-all duration-1800 ease-in-out ${
              index === activeSlide
                ? "scale-100 opacity-100"
                : "scale-110 opacity-0"
            }`}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="h-full w-full object-cover"
              loading={index === 0 ? "eager" : "lazy"}
              decoding="async"
            />

            <div className="absolute inset-0 bg-slate-950/45" />
          </div>
        ))}
      </div>

      {/* Cinematic overlays */}
      <div className="absolute inset-0 bg-linear-to-r from-slate-950/90 via-slate-950/45 to-slate-950/70" />

      <div className="absolute inset-0 bg-linear-to-t from-slate-950/90 via-transparent to-slate-950/30" />

      {/* Ambient lights */}
      <div className="pointer-events-none absolute -left-40 top-20 h-125 w-125 rounded-full bg-blue-500/20 blur-[120px] animate-pulse" />

      <div className="pointer-events-none absolute -right-40 bottom-0 h-125 w-125 rounded-full bg-cyan-400/10 blur-[120px]" />

      <div className="relative z-10 min-h-screen">
        {/* =========================================================
            HEADER
        ========================================================== */}
        <header className="flex items-center justify-between px-6 py-6 sm:px-10 lg:px-14">
          <Link
            href="/"
            className="group flex items-center gap-3"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-2xl transition-transform duration-300 group-hover:scale-105">
              <Image
                src="/edsec-logo.png"
                alt="EDSEC ICT Institute"
                width={42}
                height={42}
                className="h-9 w-auto object-contain"
                priority
              />
            </div>

            <div>
              <p className="text-lg font-bold tracking-tight text-white">
                EDSEC
              </p>

              <p className="text-xs text-white/60">
                ICT Institute
              </p>
            </div>
          </Link>

          <div className="hidden items-center gap-3 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-medium text-white/80 backdrop-blur-xl sm:flex">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
            EDSEC ICT INSTITUTE
          </div>
        </header>

        <div className="grid min-h-[calc(100vh-96px)] lg:grid-cols-[1fr_440px]">
          {/* =======================================================
              LEFT SIDE
          ======================================================== */}
          <section className="relative hidden min-h-[calc(100vh-96px)] items-center px-8 pb-12 pt-4 lg:flex xl:px-16">
            <div className="max-w-4xl">
              {/* Location */}
              <div className="mb-6 flex items-center gap-3">
                <span className="h-px w-10 bg-blue-400" />

                <span className="text-xs font-bold tracking-[0.25em] text-blue-300">
                  {currentSlide.location}
                </span>
              </div>

              {/* Hero copy */}
              <div className="max-w-2xl">
                <p
                  key={`eyebrow-${activeSlide}`}
                  className="text-sm font-bold tracking-[0.2em] text-white/60"
                >
                  {currentSlide.eyebrow}
                </p>

                <h1
                  key={`title-${activeSlide}`}
                  className="mt-5 text-5xl font-black leading-[1.05] tracking-tight text-white xl:text-6xl"
                >
                  {currentSlide.title}
                </h1>

                <p
                  key={`description-${activeSlide}`}
                  className="mt-6 max-w-xl text-lg leading-8 text-white/70"
                >
                  {currentSlide.description}
                </p>
              </div>

              {/* ===================================================
                  3D PLATFORM PREVIEW
              ==================================================== */}
              <div
                className="relative mt-10 h-67.5 w-full max-w-175"
                style={{
                  perspective: "1500px",
                }}
              >
                {/* Learning path floating card */}
                <div
                  className="absolute -right-2 -top-8 z-30 rounded-2xl border border-white/20 bg-white/10 p-4 shadow-2xl backdrop-blur-xl"
                  style={{
                    animation:
                      "floatOne 5s ease-in-out infinite",
                  }}
                >
                  <p className="text-[9px] font-bold tracking-[0.2em] text-white/50">
                    LEARNING PATH
                  </p>

                  <div className="mt-2 flex items-center gap-2">
                    <span className="grid h-8 w-8 place-items-center rounded-lg bg-blue-500/30 text-sm text-blue-200">
                      {"</>"}
                    </span>

                    <span className="text-xs font-semibold text-white">
                      Web Development
                    </span>
                  </div>
                </div>

                {/* Main dashboard */}
                <div
                  className="absolute left-0 top-0 h-62.5 w-[min(100%,620px)] overflow-hidden rounded-3xl border border-white/20 bg-slate-950/75 shadow-[0_40px_100px_rgba(0,0,0,0.55)] backdrop-blur-xl transition-transform duration-300"
                  style={{
                    transform: previewTransform,
                    transformStyle: "preserve-3d",
                  }}
                >
                  {/* Browser bar */}
                  <div className="flex h-11 items-center border-b border-white/10 bg-white/5 px-4">
                    <div className="flex gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
                      <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/80" />
                      <span className="h-2.5 w-2.5 rounded-full bg-green-400/80" />
                    </div>

                    <div className="mx-auto rounded-md bg-white/5 px-12 py-1 text-[9px] text-white/30">
                      edsecict.com/student
                    </div>
                  </div>

                  <div className="grid grid-cols-[150px_1fr]">
                    {/* Sidebar */}
                    <div className="border-r border-white/10 p-4">
                      <div className="flex items-center gap-2">
                        <div className="grid h-7 w-7 place-items-center rounded-lg bg-blue-500 text-[9px] font-bold text-white">
                          E
                        </div>

                        <span className="text-[10px] font-bold text-white">
                          EDSEC
                        </span>
                      </div>

                      <div className="mt-7 space-y-3">
                        {[
                          "Dashboard",
                          "My Courses",
                          "Lessons",
                          "Projects",
                        ].map((item, index) => (
                          <div
                            key={item}
                            className={`rounded-lg px-2 py-2 text-[9px] ${
                              index === 0
                                ? "bg-blue-500/20 text-blue-300"
                                : "text-white/40"
                            }`}
                          >
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Dashboard content */}
                    <div className="p-5">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[9px] text-white/40">
                            GOOD MORNING
                          </p>

                          <p className="mt-1 text-sm font-bold text-white">
                            Keep building your skills.
                          </p>
                        </div>

                        <div className="h-7 w-7 rounded-full bg-linear-to-br from-blue-400 to-cyan-300" />
                      </div>

                      {/* Stats */}
                      <div className="mt-5 grid grid-cols-3 gap-3">
                        <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                          <p className="text-[8px] text-white/40">
                            COURSES
                          </p>

                          <p className="mt-1 text-lg font-bold text-white">
                            04
                          </p>
                        </div>

                        <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                          <p className="text-[8px] text-white/40">
                            PROGRESS
                          </p>

                          <p className="mt-1 text-lg font-bold text-emerald-400">
                            82%
                          </p>
                        </div>

                        <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                          <p className="text-[8px] text-white/40">
                            PROJECTS
                          </p>

                          <p className="mt-1 text-lg font-bold text-blue-300">
                            06
                          </p>
                        </div>
                      </div>

                      {/* Progress */}
                      <div className="mt-4">
                        <div className="flex justify-between">
                          <p className="text-[9px] font-semibold text-white/60">
                            Web Development
                          </p>

                          <p className="text-[9px] text-blue-300">
                            82%
                          </p>
                        </div>

                        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
                          <div className="h-full w-[82%] rounded-full bg-linear-to-r from-blue-500 to-cyan-300" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Courses floating card */}
                <div
                  className="absolute -bottom-5 right-5 z-30 rounded-2xl border border-white/15 bg-slate-950/80 p-4 shadow-2xl backdrop-blur-xl"
                  style={{
                    animation:
                      "floatTwo 6s ease-in-out infinite",
                  }}
                >
                  <p className="text-[9px] font-bold tracking-[0.15em] text-white/40">
                    AVAILABLE COURSES
                  </p>

                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {courses.slice(0, 3).map((course) => (
                      <span
                        key={course}
                        className="rounded-full bg-white/10 px-2 py-1 text-[8px] text-white/70"
                      >
                        {course}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Slideshow controls */}
              <div className="mt-12 flex items-center gap-2">
                {slides.map((slide, index) => (
                  <button
                    key={slide.image}
                    type="button"
                    aria-label={`Show slide ${index + 1}`}
                    onClick={() => setActiveSlide(index)}
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                      activeSlide === index
                        ? "w-10 bg-white"
                        : "w-2 bg-white/30 hover:bg-white/60"
                    }`}
                  />
                ))}

                <span className="ml-3 text-xs text-white/40">
                  {String(activeSlide + 1).padStart(2, "0")} /{" "}
                  {String(slides.length).padStart(2, "0")}
                </span>
              </div>
            </div>
          </section>

          {/* =======================================================
              LOGIN FORM
          ======================================================== */}
          <section className="flex min-h-[calc(100vh-96px)] items-center justify-center px-5 py-10 sm:px-8 lg:bg-slate-950/20 lg:backdrop-blur-[2px] lg:pr-12">
            <div className="w-full max-w-md">
              {/* Mobile heading */}
              <div className="mb-7 lg:hidden">
                <div className="mb-4 flex items-center gap-2 text-xs font-bold tracking-[0.2em] text-blue-300">
                  <span className="h-px w-8 bg-blue-400" />
                  EDSEC ICT INSTITUTE
                </div>

                <h1 className="text-3xl font-black text-white">
                  Welcome back.
                </h1>

                <p className="mt-2 text-sm leading-6 text-white/60">
                  Continue your journey into technology.
                </p>
              </div>

              {/* Glass card */}
              <div className="rounded-[30px] border border-white/20 bg-white/12 p-7 shadow-[0_30px_100px_rgba(0,0,0,0.45)] backdrop-blur-2xl sm:p-9">
                <div>
                  <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-blue-200">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    STUDENT PORTAL
                  </div>

                  <h2 className="text-3xl font-bold tracking-tight text-white">
                    Sign in
                  </h2>

                  <p className="mt-3 text-sm leading-6 text-white/60">
                    Access your courses, lessons and projects.
                  </p>
                </div>

                <form
                  onSubmit={handleSubmit}
                  className="mt-7 space-y-5"
                >
                  {/* Email */}
                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block text-sm font-semibold text-white/80"
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
                        setEmail(event.target.value)
                      }
                      placeholder="you@example.com"
                      className="w-full rounded-xl border border-white/15 bg-black/20 px-4 py-3.5 text-white outline-none transition placeholder:text-white/30 focus:border-blue-400 focus:bg-black/30 focus:ring-4 focus:ring-blue-500/10"
                    />
                  </div>

                  {/* Password */}
                  <div>
                    <label
                      htmlFor="password"
                      className="mb-2 block text-sm font-semibold text-white/80"
                    >
                      Password
                    </label>

                    <div className="relative">
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        required
                        autoComplete="current-password"
                        value={password}
                        onChange={(event) =>
                          setPassword(event.target.value)
                        }
                        placeholder="Enter your password"
                        className="w-full rounded-xl border border-white/15 bg-black/20 px-4 py-3.5 pr-20 text-white outline-none transition placeholder:text-white/30 focus:border-blue-400 focus:bg-black/30 focus:ring-4 focus:ring-blue-500/10"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword(
                            (current) => !current
                          )
                        }
                        aria-label={
                          showPassword
                            ? "Hide password"
                            : "Show password"
                        }
                        aria-pressed={showPassword}
                        className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-semibold text-white/50 transition hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-400/50"
                      >
                        {showPassword ? (
                          <>
                            {/* Eye slash icon */}
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.8"
                              className="h-4 w-4"
                              aria-hidden="true"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M3 3l18 18"
                              />

                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M10.58 10.58a2 2 0 102.83 2.83"
                              />

                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M9.88 4.24A9.94 9.94 0 0112 4c5.05 0 8.27 4.1 9.5 6.02a3.6 3.6 0 010 3.96 15.9 15.9 0 01-4.12 4.29M6.61 6.61C4.64 7.83 3.29 9.55 2.5 10.98a3.6 3.6 0 000 3.96C3.73 16.86 6.95 21 12 21c1.61 0 3.07-.38 4.37-1"
                              />
                            </svg>

                            <span>Hide</span>
                          </>
                        ) : (
                          <>
                            {/* Eye icon */}
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.8"
                              className="h-4 w-4"
                              aria-hidden="true"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M2.5 12s3.2-6 9.5-6 9.5 6 9.5 6-3.2 6-9.5 6-9.5-6-9.5-6z"
                              />

                              <circle
                                cx="12"
                                cy="12"
                                r="2.5"
                              />
                            </svg>

                            <span>Show</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Error */}
                  {message && (
                    <div
                      role="alert"
                      className="rounded-xl border border-red-300/20 bg-red-500/10 px-4 py-3 text-sm leading-6 text-red-200"
                    >
                      {message}
                    </div>
                  )}

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="group relative w-full overflow-hidden rounded-xl bg-blue-600 px-5 py-3.5 font-semibold text-white shadow-xl shadow-blue-900/30 transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <span className="relative z-10">
                      {loading
                        ? "Signing in..."
                        : "Sign in to EDSEC"}
                    </span>

                    <span className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                  </button>
                </form>

                {/* Register */}
                <div className="mt-7 border-t border-white/10 pt-6 text-center">
                  <p className="text-sm text-white/50">
                    Don&apos;t have an account?

                    <Link
                      href="/register"
                      className="ml-1 font-semibold text-blue-300 hover:text-blue-200"
                    >
                      Create one
                    </Link>
                  </p>
                </div>

                {/* Back */}
                <div className="mt-5 text-center">
                  <Link
                    href="/"
                    className="text-sm font-medium text-white/40 transition hover:text-white"
                  >
                    ← Back to EDSEC
                  </Link>
                </div>
              </div>

              <p className="mt-5 text-center text-xs text-white/30">
                EDSEC ICT Institute · Port Harcourt, Nigeria
              </p>
            </div>
          </section>
        </div>
      </div>

      <style jsx>{`
        @keyframes floatOne {
          0%,
          100% {
            transform: translate3d(0, 0, 70px) rotate(3deg);
          }

          50% {
            transform: translate3d(0, -12px, 70px) rotate(1deg);
          }
        }

        @keyframes floatTwo {
          0%,
          100% {
            transform: translate3d(0, 0, 60px) rotate(-2deg);
          }

          50% {
            transform: translate3d(0, 10px, 60px) rotate(-1deg);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.001ms !important;
            animation-iteration-count: 1 !important;
            scroll-behavior: auto !important;
            transition-duration: 0.001ms !important;
          }
        }
      `}</style>
    </main>
  );
}