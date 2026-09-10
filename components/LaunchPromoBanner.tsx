"use client";

import Link from "next/link";
import { ArrowRight, Flame, Sparkles } from "lucide-react";
import { usePathname } from "next/navigation";

export default function LaunchPromoBanner() {
  const pathname = usePathname();

  if (pathname !== "/") return null;

  return (
    <section
      aria-label="EDSEC Launch Promo"
      className="relative z-30 overflow-hidden border-b border-blue-200 bg-linear-to-r from-blue-700 via-blue-600 to-cyan-600 text-white"
    >
      <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_15%_20%,white_0,transparent_28%),radial-gradient(circle_at_85%_80%,white_0,transparent_24%)]" />

      <div className="relative mx-auto flex max-w-7xl flex-col gap-4 px-5 py-4 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-12">
        <div className="flex min-w-0 items-start gap-3">
          <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15 shadow-lg backdrop-blur-sm">
            <Flame className="h-5 w-5 text-yellow-200" />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-black uppercase tracking-[0.16em] text-blue-100">
                EDSEC Launch Promo
              </span>
              <Sparkles className="h-3.5 w-3.5 text-yellow-200" />
              <span className="rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                Live Now
              </span>
            </div>

            <p className="mt-1 text-base font-bold sm:text-lg">
              Learn a professional digital skill from ₦20,000
            </p>

            <p className="mt-1 hidden text-xs text-blue-50 sm:block">
              Web Development · Cybersecurity · Design · Data Analysis · Cloud Computing
            </p>
          </div>
        </div>

        <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
          <Link
            href="/launch-promo"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-blue-700 shadow-lg transition hover:-translate-y-0.5 hover:bg-blue-50"
          >
            View Launch Promo
            <ArrowRight className="h-4 w-4" />
          </Link>

          <Link
            href="/apply"
            className="inline-flex items-center justify-center rounded-xl border border-white/30 bg-white/10 px-5 py-3 text-sm font-bold text-white backdrop-blur-sm transition hover:-translate-y-0.5 hover:bg-white/15"
          >
            Apply Now
          </Link>
        </div>
      </div>
    </section>
  );
}
