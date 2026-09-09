// app/privacy/page.tsx

import Link from "next/link";
import {
  ArrowLeft,
  Database,
  Eye,
  Lock,
  Mail,
  ShieldCheck,
  UserRound,
} from "lucide-react";

export const metadata = {
  title: "Privacy Policy | EDSEC ICT INSTITUTE",
  description:
    "EDSEC ICT INSTITUTE privacy policy covering information collected through the website, applications, and student platform.",
};

const sections = [
  {
    icon: Database,
    title: "Information we collect",
    paragraphs: [
      "EDSEC may collect information you voluntarily provide when you apply for a course, contact the institute, create or use a student account, or interact with services provided through the website.",
      "This may include your name, email address, phone number, educational information, application information, and information necessary to provide student services.",
    ],
  },
  {
    icon: Eye,
    title: "How information is used",
    paragraphs: [
      "Information may be used to process applications, manage student accounts and enrollments, provide learning services, communicate with students, administer assessments and student activities, and improve the EDSEC experience.",
      "EDSEC aims to collect and use information only for legitimate educational, administrative, operational, security, and communication purposes.",
    ],
  },
  {
    icon: Lock,
    title: "Security",
    paragraphs: [
      "EDSEC takes reasonable technical and organizational measures to protect information against unauthorized access, alteration, disclosure, or destruction.",
      "No internet-based system can be guaranteed to be completely secure. Users should avoid submitting sensitive information that is not necessary for the service being requested.",
    ],
  },
  {
    icon: UserRound,
    title: "Student accounts",
    paragraphs: [
      "Where an account is provided, account information is used to authenticate the student and provide access to the services associated with that account.",
      "Students are responsible for keeping their login credentials confidential and should contact EDSEC if they believe their account has been accessed improperly.",
    ],
  },
  {
    icon: Mail,
    title: "Communication",
    paragraphs: [
      "EDSEC may use the contact information provided by an applicant or student to communicate about applications, courses, schedules, student services, administrative matters, and other relevant institute communications.",
      "You can contact EDSEC if you have questions about a communication or how your information is being used.",
    ],
  },
  {
    icon: ShieldCheck,
    title: "Third-party services",
    paragraphs: [
      "The website and student platform may rely on third-party infrastructure and service providers for hosting, databases, authentication, communications, analytics, payments, or other technical functions.",
      "Where third-party services process information on behalf of EDSEC, their handling of information may also be governed by their own applicable privacy terms.",
    ],
  },
];

export default function PrivacyPage() {
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
            Privacy
          </p>

          <h1 className="mt-4 text-5xl font-bold tracking-tight text-white sm:text-6xl">
            Privacy Policy
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-400">
            This policy explains how EDSEC ICT INSTITUTE may collect, use,
            protect, and manage information provided through its website,
            application process, and student services.
          </p>

          <p className="mt-6 text-sm text-slate-500">
            Last updated: September 9, 2026
          </p>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-5 lg:px-8">
          <div className="rounded-3xl border border-blue-100 bg-blue-50 p-6 sm:p-8">
            <p className="font-semibold text-slate-950">
              Important notice
            </p>

            <p className="mt-2 leading-7 text-slate-600">
              This page describes EDSEC&apos;s general privacy practices. It is
              not a substitute for legal advice and may be updated as EDSEC&apos;s
              services, technology, or legal obligations change.
            </p>
          </div>

          <div className="mt-12 space-y-12">
            {sections.map((section) => {
              const Icon = section.icon;

              return (
                <section
                  key={section.title}
                  className="grid gap-6 border-b border-slate-200 pb-12 last:border-0"
                >
                  <div className="flex items-center gap-4">
                    <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-600">
                      <Icon className="h-5 w-5" />
                    </div>

                    <h2 className="text-2xl font-bold tracking-tight text-slate-950">
                      {section.title}
                    </h2>
                  </div>

                  <div className="space-y-4 pl-0 sm:pl-[3.75rem]">
                    {section.paragraphs.map((paragraph) => (
                      <p
                        key={paragraph}
                        className="leading-8 text-slate-600"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>

          <section className="mt-4 rounded-3xl border border-slate-200 bg-slate-50 p-7 sm:p-9">
            <h2 className="text-2xl font-bold tracking-tight text-slate-950">
              Questions about privacy?
            </h2>

            <p className="mt-3 max-w-2xl leading-7 text-slate-600">
              If you have a question about information submitted to EDSEC or
              how the website handles your information, contact the institute
              directly.
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