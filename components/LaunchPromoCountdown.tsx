"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Award, CheckCircle2, Clock3, ExternalLink, Flame, QrCode, ShieldCheck } from "lucide-react";

const PROMO_END_DATE = process.env.NEXT_PUBLIC_EDSEC_PROMO_END_DATE || "2026-09-30T23:59:59+01:00";

type Remaining = { days: number; hours: number; minutes: number; seconds: number };

function getRemaining(): Remaining {
  const difference = Math.max(0, new Date(PROMO_END_DATE).getTime() - Date.now());
  return {
    days: Math.floor(difference / 86_400_000),
    hours: Math.floor((difference / 3_600_000) % 24),
    minutes: Math.floor((difference / 60_000) % 60),
    seconds: Math.floor((difference / 1_000) % 60),
  };
}

export default function LaunchPromoCountdown() {
  const [remaining, setRemaining] = useState<Remaining>(getRemaining);
  useEffect(() => {
    const timer = window.setInterval(() => setRemaining(getRemaining()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const units = useMemo(() => [
    { label: "Days", value: remaining.days },
    { label: "Hours", value: remaining.hours },
    { label: "Minutes", value: remaining.minutes },
    { label: "Seconds", value: remaining.seconds },
  ], [remaining]);

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-blue-200 bg-white p-5 shadow-xl shadow-blue-950/5 sm:p-7">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-blue-700"><Flame className="h-3.5 w-3.5" />Launch offer is live</div>
            <h3 className="mt-3 text-xl font-bold text-slate-950 sm:text-2xl">Secure your place before the promo ends.</h3>
            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">Promo pricing is available for a limited launch window. Contact EDSEC if you need help choosing a program.</p>
          </div>
          <div className="flex items-center gap-2 text-slate-400"><Clock3 className="h-5 w-5 text-blue-600" /><span className="text-xs font-semibold uppercase tracking-wider">Time left</span></div>
        </div>
        <div className="mt-6 grid grid-cols-4 gap-2 sm:gap-3">
          {units.map((unit) => <div key={unit.label} className="rounded-2xl bg-slate-950 px-2 py-4 text-center text-white sm:px-4"><div className="text-2xl font-black tabular-nums sm:text-3xl">{String(unit.value).padStart(2, "0")}</div><div className="mt-1 text-[9px] font-bold uppercase tracking-wider text-slate-400 sm:text-[10px]">{unit.label}</div></div>)}
        </div>
      </div>

      <section aria-labelledby="certificate-showcase-title" className="relative overflow-hidden rounded-[2rem] bg-slate-950 px-5 py-8 text-white shadow-2xl shadow-blue-950/20 sm:px-8 sm:py-10 lg:px-12">
        <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-blue-600/20 blur-3xl" />
        <div className="absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="relative grid items-center gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-blue-200"><Award className="h-4 w-4" />Learn. Build. Get Certified.</div>
            <h2 id="certificate-showcase-title" className="mt-5 text-3xl font-black tracking-tight sm:text-4xl">Finish your training with an EDSEC Certificate.</h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-slate-300 sm:text-base">Build practical digital skills, complete your training requirements, and receive an EDSEC Certificate of Completion as recognition of your learning journey.</p>
            <div className="mt-6 space-y-3 text-sm text-slate-200">
              <div className="flex items-start gap-3"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-blue-400" /><span>Professional Certificate of Completion</span></div>
              <div className="flex items-start gap-3"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-blue-400" /><span>Issued after meeting your programme requirements</span></div>
              <div className="flex items-start gap-3"><ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-blue-400" /><span>Unique certificate ID with public verification</span></div>
              <div className="flex items-start gap-3"><QrCode className="mt-0.5 h-5 w-5 shrink-0 text-blue-400" /><span>QR code can take employers and institutions directly to EDSEC verification</span></div>
            </div>
            <Link href="/verify" className="mt-7 inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-white/15">Try certificate verification <ExternalLink className="h-4 w-4" /></Link>
          </div>

          <div className="relative order-1 flex min-h-[280px] items-center justify-center [perspective:1400px] sm:min-h-[360px] lg:order-2">
            <div className="absolute bottom-5 h-8 w-[75%] rounded-[50%] bg-blue-950/80 blur-xl" />
            <div className="relative w-full max-w-[620px] animate-[edsecCertificateFloat_5s_ease-in-out_infinite] [transform:rotateX(7deg)_rotateY(-7deg)_rotateZ(-1deg)] transition-transform duration-700 hover:[transform:rotateX(2deg)_rotateY(2deg)_rotateZ(0deg)] motion-reduce:animate-none">
              <div className="absolute -inset-3 rounded-xl bg-blue-400/10 blur-lg" />
              <div className="relative overflow-hidden rounded-xl border-[6px] border-blue-200 bg-white p-2 shadow-[0_35px_90px_rgba(0,0,0,0.45)] sm:border-8 sm:p-3">
                <div className="relative overflow-hidden border-2 border-blue-700/70 bg-gradient-to-br from-white via-blue-50 to-white px-5 py-7 text-center text-slate-900 sm:px-10 sm:py-10">
                  <div className="pointer-events-none absolute inset-3 border border-blue-300/70" /><div className="pointer-events-none absolute inset-5 border border-blue-100" />
                  <div className="relative mx-auto flex h-12 w-12 items-center justify-center rounded-full border-2 border-blue-700 bg-white text-blue-700 shadow-sm sm:h-14 sm:w-14"><Award className="h-7 w-7 sm:h-8 sm:w-8" /></div>
                  <p className="relative mt-3 text-[8px] font-black uppercase tracking-[0.28em] text-blue-700 sm:text-[10px]">EDSEC ICT INSTITUTE</p>
                  <p className="relative mt-5 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500 sm:text-xs">Certificate of Completion</p>
                  <p className="relative mt-3 font-serif text-xl font-bold text-slate-950 sm:text-3xl">This certifies that</p>
                  <p className="relative mx-auto mt-2 max-w-md border-b border-slate-400 pb-2 font-serif text-lg font-bold text-blue-900 sm:text-2xl">Your Name Here</p>
                  <p className="relative mt-3 text-[9px] leading-5 text-slate-600 sm:text-xs">has successfully completed the requirements of the</p>
                  <p className="relative mt-1 text-sm font-black text-slate-950 sm:text-lg">PROFESSIONAL DIGITAL SKILLS PROGRAMME</p>
                  <div className="relative mt-6 flex items-end justify-between gap-4 text-left sm:mt-8"><div><div className="h-px w-24 bg-slate-400 sm:w-32" /><p className="mt-1 text-[7px] uppercase tracking-wider text-slate-500 sm:text-[9px]">Authorized Signature</p></div><div className="text-right"><div className="h-px w-20 bg-slate-400 sm:w-28" /><p className="mt-1 text-[7px] uppercase tracking-wider text-slate-500 sm:text-[9px]">Certificate ID</p></div></div>
                  <div className="absolute right-3 top-3 rounded-full bg-blue-700 px-2 py-1 text-[6px] font-black uppercase tracking-widest text-white shadow sm:right-5 sm:top-5 sm:px-3 sm:py-1.5 sm:text-[7px]">EDSEC</div>
                </div>
              </div>
              <div className="pointer-events-none absolute left-[8%] top-[12%] h-1/2 w-[38%] -rotate-12 rounded-full bg-white/25 blur-2xl" />
            </div>
          </div>
        </div>

        <div className="relative mt-8 grid gap-3 border-t border-white/10 pt-6 sm:grid-cols-3">
          <div className="rounded-2xl bg-white/5 p-4"><p className="text-xs font-black uppercase tracking-wider text-blue-300">1. Certificate</p><p className="mt-1 text-sm text-slate-300">Complete your programme requirements.</p></div>
          <div className="rounded-2xl bg-white/5 p-4"><p className="text-xs font-black uppercase tracking-wider text-blue-300">2. Verification</p><p className="mt-1 text-sm text-slate-300">Every issued certificate gets a unique ID and QR verification route.</p></div>
          <div className="rounded-2xl bg-white/5 p-4"><p className="text-xs font-black uppercase tracking-wider text-blue-300">3. Apply</p><p className="mt-1 text-sm text-slate-300">Start your training and work toward a verifiable credential.</p></div>
        </div>
        <p className="relative mt-6 text-center text-xs text-slate-400">Certificate artwork shown as a promotional preview. Final certificate design, issuance and verification records are controlled by EDSEC ICT INSTITUTE.</p>
      </section>

      <style jsx>{`@keyframes edsecCertificateFloat { 0%, 100% { transform: rotateX(7deg) rotateY(-7deg) rotateZ(-1deg) translateY(0); } 50% { transform: rotateX(4deg) rotateY(-2deg) rotateZ(0deg) translateY(-8px); } }`}</style>
    </div>
  );
}
