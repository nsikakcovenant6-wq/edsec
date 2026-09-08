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
    title: "Start building the skills of tomorrow.",
    description:
      "Join a practical ICT learning environment designed for students, creators and future technology professionals.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=2200&q=90",
    location: "PORT HARCOURT, NIGERIA",
    eyebrow: "COLLABORATIVE LEARNING",
    title: "Learn together. Build together.",
    description:
      "Work on practical projects and grow alongside other ambitious technology learners.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1528901166007-3784c7dd3653?auto=format&fit=crop&w=2200&q=90",
    location: "PORT HARCOURT, NIGERIA",
    eyebrow: "AFRICAN DEVELOPERS",
    title: "Your technology journey starts here.",
    description:
      "Develop the knowledge, confidence and practical experience needed to thrive in the digital economy.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1532522953890-ccc87dfeb0b7?auto=format&fit=crop&w=2200&q=90",
    location: "PORT HARCOURT, NIGERIA",
    eyebrow: "CYBER & SOFTWARE",
    title: "Code. Secure. Create.",
    description:
      "Learn modern technology skills across software development, cybersecurity and digital innovation.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1529429612779-c8e40ef2f36d?auto=format&fit=crop&w=2200&q=90",
    location: "PORT HARCOURT, NIGERIA",
    eyebrow: "DIGITAL SKILLS",
    title: "Turn curiosity into capability.",
    description:
      "Build practical skills that can open doors to careers, entrepreneurship and new opportunities.",
  },
];

const skills = [
  "Web Development",
  "Cybersecurity",
  "UI/UX Design",
  "Data Analysis",
];

export default function RegisterPage() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
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

    if (!fullName.trim()) {
      setMessage("Please enter your full name.");
      return;
    }

    if (!email.trim()) {
      setMessage("Please enter your email address.");
      return;
    }

    if (!phone.trim()) {
      setMessage("Please enter your phone number.");
      return;
    }

    if (password.length < 6) {
      setMessage(
        "Password must be at least 6 characters."
      );
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
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
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.message ||
            "Unable to create your account."
        );
        return;
      }

      window.location.href =
        data.redirectTo || "/student/dashboard";
    } catch (error) {
      console.error(
        "Registration request error:",
        error
      );

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

      {/* Overlays */}
      <div className="absolute inset-0 bg-linear-to-r from-slate-950/90 via-slate-950/45 to-slate-950/70" />

      <div className="absolute inset-0 bg-linear-to-t from-slate-950/90 via-transparent to-slate-950/30" />

      {/* Ambient glow */}
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

        <div className="grid min-h-[calc(100vh-96px)] lg:grid-cols-[1fr_470px]">
          {/* =======================================================
              LEFT SIDE
          ======================================================== */}
          <section className="relative hidden min-h-[calc(100vh-96px)] items-center px-8 pb-12 pt-4 lg:flex xl:px-16">
            <div className="max-w-4xl">
              <div className="mb-6 flex items-center gap-3">
                <span className="h-px w-10 bg-blue-400" />

                <span className="text-xs font-bold tracking-[0.25em] text-blue-300">
                  {currentSlide.location}
                </span>
              </div>

              <div className="max-w-2xl">
                <p className="text-sm font-bold tracking-[0.2em] text-white/60">
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
                  3D DASHBOARD
              ==================================================== */}
              <div
                className="relative mt-10 h-67.5 w-full max-w-175"
                style={{
                  perspective: "1500px",
                }}
              >
                {/* Skill card */}
                <div
                  className="absolute -right-2 -top-8 z-30 rounded-2xl border border-white/20 bg-white/10 p-4 shadow-2xl backdrop-blur-xl"
                  style={{
                    animation:
                      "floatOne 5s ease-in-out infinite",
                  }}
                >
                  <p className="text-[9px] font-bold tracking-[0.2em] text-white/50">
                    START LEARNING
                  </p>

                  <div className="mt-2 flex items-center gap-2">
                    <span className="grid h-8 w-8 place-items-center rounded-lg bg-blue-500/30 text-sm text-blue-200">
                      ✦
                    </span>

                    <span className="text-xs font-semibold text-white">
                      Build Real Skills
                    </span>
                  </div>
                </div>

                {/* Main platform */}
                <div
                  className="absolute left-0 top-0 h-62.5 w-[min(100%,620px)] overflow-hidden rounded-3xl border border-white/20 bg-slate-950/75 shadow-[0_40px_100px_rgba(0,0,0,0.55)] backdrop-blur-xl transition-transform duration-300"
                  style={{
                    transform: previewTransform,
                    transformStyle: "preserve-3d",
                  }}
                >
                  {/* Browser */}
                  <div className="flex h-11 items-center border-b border-white/10 bg-white/5 px-4">
                    <div className="flex gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
                      <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/80" />
                      <span className="h-2.5 w-2.5 rounded-full bg-green-400/80" />
                    </div>

                    <div className="mx-auto rounded-md bg-white/5 px-12 py-1 text-[9px] text-white/30">
                      edsecict.com/learning
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

                    {/* Content */}
                    <div className="p-5">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[9px] text-white/40">
                            WELCOME TO EDSEC
                          </p>

                          <p className="mt-1 text-sm font-bold text-white">
                            Start your learning journey.
                          </p>
                        </div>

                        <div className="h-7 w-7 rounded-full bg-linear-to-br from-blue-400 to-cyan-300" />
                      </div>

                      {/* Courses */}
                      <div className="mt-5 grid grid-cols-2 gap-3">
                        {skills.map((skill, index) => (
                          <div
                            key={skill}
                            className="rounded-xl border border-white/10 bg-white/5 p-3"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-[8px] font-semibold text-white/70">
                                {skill}
                              </span>

                              <span className="text-[8px] text-blue-300">
                                0{index + 1}
                              </span>
                            </div>

                            <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/10">
                              <div
                                className="h-full rounded-full bg-linear-to-r from-blue-500 to-cyan-300"
                                style={{
                                  width: `${45 + index * 10}%`,
                                }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Progress card */}
                <div
                  className="absolute -bottom-5 right-5 z-30 rounded-2xl border border-white/15 bg-slate-950/80 p-4 shadow-2xl backdrop-blur-xl"
                  style={{
                    animation:
                      "floatTwo 6s ease-in-out infinite",
                  }}
                >
                  <p className="text-[9px] font-bold tracking-[0.15em] text-white/40">
                    YOUR FUTURE STARTS HERE
                  </p>

                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-lg">🚀</span>

                    <span className="text-[9px] font-semibold text-white/80">
                      Learn · Build · Grow
                    </span>
                  </div>
                </div>
              </div>

              {/* Slideshow */}
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
              REGISTER FORM
          ======================================================== */}
          <section className="flex min-h-[calc(100vh-96px)] items-center justify-center px-5 py-8 sm:px-8 lg:bg-slate-950/20 lg:backdrop-blur-[2px] lg:pr-12">
            <div className="w-full max-w-md">
              {/* Mobile */}
              <div className="mb-6 lg:hidden">
                <div className="mb-4 flex items-center gap-2 text-xs font-bold tracking-[0.2em] text-blue-300">
                  <span className="h-px w-8 bg-blue-400" />
                  EDSEC ICT INSTITUTE
                </div>

                <h1 className="text-3xl font-black text-white">
                  Start learning.
                </h1>

                <p className="mt-2 text-sm leading-6 text-white/60">
                  Create your EDSEC student account.
                </p>
              </div>

              {/* Glass card */}
              <div className="rounded-[30px] border border-white/20 bg-white/12 p-7 shadow-[0_30px_100px_rgba(0,0,0,0.45)] backdrop-blur-2xl sm:p-8">
                <div>
                  <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-blue-200">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    JOIN EDSEC
                  </div>

                  <h2 className="text-3xl font-bold tracking-tight text-white">
                    Create account
                  </h2>

                  <p className="mt-3 text-sm leading-6 text-white/60">
                    Join EDSEC ICT Institute and start building your digital skills.
                  </p>
                </div>

                <form
                  onSubmit={handleSubmit}
                  className="mt-6 space-y-4"
                >
                  {/* Full name */}
                  <div>
                    <label
                      htmlFor="fullName"
                      className="mb-2 block text-sm font-semibold text-white/80"
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
                        setFullName(event.target.value)
                      }
                      placeholder="Your full name"
                      className="w-full rounded-xl border border-white/15 bg-black/20 px-4 py-3.5 text-white outline-none transition placeholder:text-white/30 focus:border-blue-400 focus:bg-black/30 focus:ring-4 focus:ring-blue-500/10"
                    />
                  </div>

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

                  {/* Phone */}
                  <div>
                    <label
                      htmlFor="phone"
                      className="mb-2 block text-sm font-semibold text-white/80"
                    >
                      Phone number
                    </label>

                    <input
                      id="phone"
                      type="tel"
                      required
                      autoComplete="tel"
                      value={phone}
                      onChange={(event) =>
                        setPhone(event.target.value)
                      }
                      placeholder="08012345678"
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
                        type={
                          showPassword
                            ? "text"
                            : "password"
                        }
                        required
                        autoComplete="new-password"
                        value={password}
                        onChange={(event) =>
                          setPassword(event.target.value)
                        }
                        placeholder="At least 6 characters"
                        className="w-full rounded-xl border border-white/15 bg-black/20 px-4 py-3.5 pr-20 text-white outline-none transition placeholder:text-white/30 focus:border-blue-400 focus:bg-black/30 focus:ring-4 focus:ring-blue-500/10"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword(
                            (current) => !current
                          )
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-xs font-semibold text-white/50 transition hover:bg-white/10 hover:text-white"
                      >
                        {showPassword ? "Hide" : "Show"}
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
                    className="group relative mt-2 w-full overflow-hidden rounded-xl bg-blue-600 px-5 py-3.5 font-semibold text-white shadow-xl shadow-blue-900/30 transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <span className="relative z-10">
                      {loading
                        ? "Creating account..."
                        : "Create EDSEC Account"}
                    </span>

                    <span className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                  </button>
                </form>

                {/* Login */}
                <div className="mt-6 border-t border-white/10 pt-5 text-center">
                  <p className="text-sm text-white/50">
                    Already have an account?

                    <Link
                      href="/login"
                      className="ml-1 font-semibold text-blue-300 hover:text-blue-200"
                    >
                      Sign in
                    </Link>
                  </p>
                </div>

                {/* Back */}
                <div className="mt-4 text-center">
                  <Link
                    href="/"
                    className="text-sm font-medium text-white/40 transition hover:text-white"
                  >
                    ← Back to EDSEC
                  </Link>
                </div>
              </div>

              <p className="mt-4 text-center text-xs text-white/30">
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