// app/terms/page.tsx

import Link from "next/link";
import {
  ArrowLeft,
  BookOpenCheck,
  FileText,
  Gavel,
  GraduationCap,
  ShieldCheck,
  UserCheck,
} from "lucide-react";

export const metadata = {
  title: "Terms & Conditions | EDSEC ICT INSTITUTE",
  description:
    "Terms and conditions governing use of EDSEC ICT INSTITUTE website, applications, student services, and learning platform.",
};

const sections = [
  {
    icon: UserCheck,
    title: "Use of the website",
    text: "You agree to use the EDSEC website and related services for lawful purposes and in a manner that does not interfere with the operation, security, or availability of the platform.",
  },
  {
    icon: GraduationCap,
    title: "Applications and admissions",
    text: "Submitting an application expresses interest in a program and does not by itself guarantee admission, enrollment, a place in a cohort, or completion of registration. EDSEC may review applications and request additional information where necessary.",
  },
  {
    icon: BookOpenCheck,
    title: "Student learning services",
    text: "Access to student services is based on the student's account, enrollment, course availability, and applicable institute policies. Course content, schedules, assessments, and learning arrangements may be updated when necessary.",
  },
  {
    icon: FileText,
    title: "Student work and projects",
    text: "Students are expected to submit work that they have the right to use and submit. Where EDSEC publishes a student project as part of its public showcase, the institute should handle that publication in accordance with its applicable student and privacy practices.",
  },
  {
    icon: ShieldCheck,
    title: "Accounts and security",
    text: "Students are responsible for protecting their account credentials and for activity carried out through their accounts. Users should notify EDSEC if they suspect unauthorized access or another security issue.",
  },
  {
    icon: Gavel,
    title: "Changes and availability",
    text: "EDSEC may update courses, services, schedules, platform features, policies, and website content as the institute develops. Reasonable efforts may be made to keep information accurate, but uninterrupted availability cannot be guaranteed.",
  },
];

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="bg-slate-950">
        <div className="mx-auto max-w-5xl px-5 py-20 lg:px-8 lg:py-24">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-blue-400 transition hover:text-blue-300"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>

          <p className="mt-10 text-sm font-semibold uppercase tracking-[0.18em] text-blue-400">
            Legal
          </p>

          <h1 className="mt-4 text-5xl font-bold tracking-tight text-white sm:text-6xl">
            Terms &amp; Conditions
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-400">
            These terms describe the general conditions for using EDSEC ICT
            INSTITUTE&apos;s website, application process, student services, and
            learning platform.
          </p>

          <p className="mt-6 text-sm text-slate-500">
            Last updated: September 9, 2026
          </p>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-5 lg:px-8">
          <div className="rounded-3xl border border-amber-100 bg-amber-50 p-6 sm:p-8">
            <p className="font-semibold text-slate-950">
              General information
            </p>

            <p className="mt-2 leading-7 text-slate-600">
              These terms are intended as a general operational policy for the
              EDSEC platform. They should be reviewed and adapted by qualified
              legal counsel where legally binding or jurisdiction-specific
              provisions are required.
            </p>
          </div>

          <div className="mt-12 space-y-6">
            {sections.map((section, index) => {
              const Icon = section.icon;

              return (
                <section
                  key={section.title}
                  className="rounded-3xl border border-slate-200 bg-white p-7 transition hover:border-blue-200 hover:shadow-lg hover:shadow-slate-200/40 sm:p-8"
                >
                  <div className="flex gap-5">
                    <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-blue-50 text-blue-600">
                      <Icon className="h-6 w-6" />
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="text-xs font-bold uppercase tracking-widest text-blue-600">
                          0{index + 1}
                        </span>

                        <h2 className="text-2xl font-bold tracking-tight text-slate-950">
                          {section.title}
                        </h2>
                      </div>

                      <p className="mt-4 leading-8 text-slate-600">
                        {section.text}
                      </p>
                    </div>
                  </div>
                </section>
              );
            })}
          </div>

          <section className="mt-12 border-t border-slate-200 pt-10">
            <h2 className="text-2xl font-bold tracking-tight text-slate-950">
              Contact
            </h2>

            <p className="mt-3 max-w-2xl leading-7 text-slate-600">
              If you have questions about these terms, an EDSEC program, or
              your use of the platform, contact the institute.
            </p>

            <Link
              href="/contact"
              className="mt-6 inline-flex rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              Contact EDSEC
            </Link>
          </section>
        </div>
      </section>
    </main>
  );
}