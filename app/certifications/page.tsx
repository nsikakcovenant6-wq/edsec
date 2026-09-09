// app/certification/page.tsx

import Link from "next/link";
import {
  Award,
  BadgeCheck,
  BookOpenCheck,
  CheckCircle2,
  FileCheck2,
  GraduationCap,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { prisma } from "@/app/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Certification | EDSEC ICT INSTITUTE",
  description:
    "Learn how EDSEC certification fits into your practical technology learning journey.",
};

const benefits = [
  {
    icon: BookOpenCheck,
    title: "Structured learning",
    text: "Follow a defined program with lessons, practical activities, assessments, and project work.",
  },
  {
    icon: FileCheck2,
    title: "Evidence of completion",
    text: "A completion certificate can provide formal recognition of a successfully completed EDSEC program.",
  },
  {
    icon: Award,
    title: "Portfolio alongside certification",
    text: "Your strongest evidence is not only the certificate but also the practical work you build during your training.",
  },
  {
    icon: ShieldCheck,
    title: "Professional presentation",
    text: "EDSEC certification is designed to complement your portfolio, CV, applications, and continued learning.",
  },
];

const requirements = [
  "Complete the required learning activities for your program.",
  "Participate in the practical work and project requirements attached to your course.",
  "Complete required assessments or tests where applicable.",
  "Meet the completion requirements for your enrolled program.",
];

export default async function CertificationPage() {
  const [activeCourses, completedEnrollments] = await Promise.all([
    prisma.course.count({
      where: {
        status: "ACTIVE",
      },
    }),
    prisma.enrollment.count({
      where: {
        status: "COMPLETED",
      },
    }),
  ]);

  return (
    <main className="min-h-screen bg-white">
      <section className="relative overflow-hidden bg-slate-950">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />
          <div className="absolute -bottom-40 left-1/3 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
        </div>

        <div className="relative mx-auto grid max-w-7xl gap-14 px-5 py-20 lg:grid-cols-[1.1fr_.9fr] lg:items-center lg:px-8 lg:py-28">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-300">
              <BadgeCheck className="h-4 w-4" />
              EDSEC Certification
            </div>

            <h1 className="mt-7 text-5xl font-bold tracking-tighter text-white sm:text-6xl lg:text-7xl">
              Learn the skill.
              <span className="block text-blue-400">
                Build the proof.
              </span>
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-400 sm:text-xl">
              Certification is one part of the EDSEC learning experience.
              The goal is to combine structured education with practical work
              that demonstrates what you can actually do.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/courses"
                className="rounded-xl bg-blue-600 px-6 py-3.5 text-center font-semibold text-white transition hover:bg-blue-500"
              >
                Explore courses
              </Link>

              <Link
                href="/apply"
                className="rounded-xl border border-slate-700 px-6 py-3.5 text-center font-semibold text-white transition hover:bg-white/5"
              >
                Apply now
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-5 rounded-[3rem] bg-blue-600/10 blur-3xl" />

            <div className="relative rounded-[2rem] border border-white/10 bg-white/[0.04] p-4 shadow-2xl">
              <div className="rounded-[1.5rem] border border-slate-200/10 bg-white p-6 sm:p-8">
                <div className="flex items-start justify-between gap-6">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.22em] text-blue-600">
                      EDSEC
                    </p>

                    <h2 className="mt-4 text-2xl font-bold text-slate-950">
                      Certificate of Completion
                    </h2>
                  </div>

                  <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-blue-600 text-white">
                    <Award className="h-7 w-7" />
                  </div>
                </div>

                <div className="mt-10 border-t border-slate-200 pt-8">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                    Presented to
                  </p>

                  <div className="mt-3 h-4 w-48 rounded bg-slate-100" />

                  <div className="mt-7 h-2 w-full rounded bg-slate-100" />
                  <div className="mt-3 h-2 w-4/5 rounded bg-slate-100" />
                </div>

                <div className="mt-10 flex items-end justify-between gap-6">
                  <div>
                    <div className="h-px w-28 bg-slate-300" />
                    <p className="mt-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                      EDSEC ICT INSTITUTE
                    </p>
                  </div>

                  <div className="grid h-16 w-16 place-items-center rounded-full border-4 border-blue-100 bg-blue-50">
                    <CheckCircle2 className="h-7 w-7 text-blue-600" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto grid max-w-7xl gap-px px-5 sm:grid-cols-2 lg:grid-cols-3 lg:px-8">
          <div className="py-8 sm:px-6">
            <p className="text-3xl font-bold text-slate-950">
              {activeCourses}
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Active learning programs
            </p>
          </div>

          <div className="py-8 sm:px-6">
            <p className="text-3xl font-bold text-slate-950">
              {completedEnrollments}
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Completed enrollments recorded
            </p>
          </div>

          <div className="py-8 sm:px-6">
            <p className="text-3xl font-bold text-slate-950">01</p>
            <p className="mt-1 text-sm text-slate-500">
              Certificate supports your practical portfolio
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
              More than a certificate
            </p>

            <h2 className="mt-3 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
              Recognition backed by practical learning.
            </h2>

            <p className="mt-5 text-lg leading-8 text-slate-600">
              EDSEC is designed around the idea that learners should leave
              training with both knowledge and evidence of what they can do.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {benefits.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="rounded-3xl border border-slate-200 bg-white p-7 transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-slate-200/50"
                >
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-50 text-blue-600">
                    <Icon className="h-6 w-6" />
                  </div>

                  <h3 className="mt-6 text-xl font-semibold text-slate-950">
                    {item.title}
                  </h3>

                  <p className="mt-3 leading-7 text-slate-600">
                    {item.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-slate-50 py-20 sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 lg:grid-cols-2 lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
              Completion journey
            </p>

            <h2 className="mt-3 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
              Work toward completion one stage at a time.
            </h2>

            <p className="mt-5 text-lg leading-8 text-slate-600">
              Your certificate is most valuable when it represents a genuine
              learning journey rather than simply attendance.
            </p>
          </div>

          <div className="space-y-4">
            {requirements.map((requirement, index) => (
              <div
                key={requirement}
                className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-5"
              >
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-blue-600 text-sm font-bold text-white">
                  {index + 1}
                </div>

                <p className="leading-7 text-slate-700">{requirement}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-4xl px-5 text-center lg:px-8">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-blue-50 text-blue-600">
            <GraduationCap className="h-7 w-7" />
          </div>

          <h2 className="mt-6 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
            Start a program and work toward your next milestone.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            Choose a course that matches the skill you want to develop and
            begin your EDSEC learning journey.
          </p>

          <Link
            href="/courses"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-7 py-3.5 font-semibold text-white transition hover:bg-blue-700"
          >
            Explore programs
            <Sparkles className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}