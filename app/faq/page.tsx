/* eslint-disable @typescript-eslint/no-unused-vars */
// app/faq/page.tsx

import Link from "next/link";
import {
  ArrowUpRight,
  BookOpen,
  CheckCircle2,
  Clock3,
  HelpCircle,
  Laptop,
  MessageCircleQuestion,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { prisma } from "@/app/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Frequently Asked Questions | EDSEC ICT INSTITUTE",
  description:
    "Find answers to common questions about EDSEC courses, applications, learning, assessments, projects, and certification.",
};

export default async function FAQPage() {
  const courses = await prisma.course.findMany({
    where: {
      status: "ACTIVE",
    },
    orderBy: [
      {
        featured: "desc",
      },
      {
        displayOrder: "asc",
      },
      {
        title: "asc",
      },
    ],
    select: {
      id: true,
      title: true,
      duration: true,
      learningFormat: true,
    },
  });

  const faqs = [
    {
      category: "Getting started",
      items: [
        {
          question: "Who can learn at EDSEC?",
          answer:
            "EDSEC programs are designed for learners at different stages, from beginners developing foundational computer skills to learners pursuing more advanced technology skills. Each course has its own requirements and learning expectations.",
        },
        {
          question: "Do I need previous programming experience?",
          answer:
            "Not necessarily. Several programs are suitable for beginners. Where a course benefits from prior knowledge, the course information and application process can help you understand the expected starting level.",
        },
        {
          question: "How do I apply?",
          answer:
            "Choose a course, review the program information, then complete the EDSEC application form. Your application provides the information needed to process your interest in the selected program.",
        },
      ],
    },
    {
      category: "Courses & learning",
      items: [
        {
          question: "What courses does EDSEC offer?",
          answer:
            courses.length > 0
              ? `EDSEC currently has ${courses.length} active course${courses.length === 1 ? "" : "s"} in the learning system. Available programs can change as new programs are introduced or updated.`
              : "Course availability is managed through the EDSEC learning system. Visit the Courses page to see currently available programs.",
        },
        {
          question: "How long do courses take?",
          answer:
            courses.some((course) => course.duration)
              ? "Course duration varies by program. Each course page provides its current duration and learning information."
              : "Course duration varies by program. Check the individual course page for the current duration.",
        },
        {
          question: "Can I learn remotely?",
          answer:
            "Learning format depends on the program and the arrangements available for the relevant cohort. Check the course information or contact EDSEC before applying if the learning format is important to you.",
        },
        {
          question: "Is practical work part of the training?",
          answer:
            "Yes. EDSEC's learning approach emphasizes applying concepts through exercises, practical work, assessments, and projects where appropriate to the program.",
        },
      ],
    },
    {
      category: "Student experience",
      items: [
        {
          question: "Do students get access to a student portal?",
          answer:
            "Yes. Registered students can use the EDSEC student portal for learning-related activities supported by their enrollment, including courses, progress, assessments, projects, announcements, payments, attendance, and other available student services.",
        },
        {
          question: "Will I build projects?",
          answer:
            "Project work depends on the course, but EDSEC is designed around practical learning. Technology-focused programs can include projects that help students demonstrate their skills.",
        },
        {
          question: "Are assessments included?",
          answer:
            "The student platform supports course assessments and tests where they are configured for a program. Your specific course determines which assessments are required.",
        },
        {
          question: "Can I see my learning progress?",
          answer:
            "Enrolled students can use the student portal to view supported learning progress and course activity.",
        },
      ],
    },
    {
      category: "Certification",
      items: [
        {
          question: "Does EDSEC provide certificates?",
          answer:
            "EDSEC supports certificate-based completion recognition for qualifying programs. Certificate requirements depend on the specific program and completion criteria.",
        },
        {
          question: "Is a certificate enough to get a job?",
          answer:
            "A certificate can support your CV, but it should not be treated as a substitute for demonstrable skills. Your projects, practical experience, technical knowledge, portfolio, communication skills, and interview performance all matter.",
        },
      ],
    },
    {
      category: "Support & applications",
      items: [
        {
          question: "What happens after I submit my application?",
          answer:
            "Your application is submitted to the EDSEC admissions system for review. Keep your contact details accurate so the institute can communicate with you regarding the application.",
        },
        {
          question: "Can I ask questions before applying?",
          answer:
            "Yes. If you need clarification about a course, learning format, requirements, or the application process, you can contact EDSEC before submitting an application.",
        },
      ],
    },
  ];

  return (
    <main className="min-h-screen bg-white">
      <section className="relative overflow-hidden bg-slate-950">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />
          <div className="absolute -bottom-40 left-1/4 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-300">
              <HelpCircle className="h-4 w-4" />
              Help centre
            </div>

            <h1 className="mt-7 text-5xl font-bold tracking-tighter text-white sm:text-6xl lg:text-7xl">
              Questions?
              <span className="block text-blue-400">Start here.</span>
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-400 sm:text-xl">
              Find answers about EDSEC programs, applications, learning,
              projects, student services, and certification.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto grid max-w-7xl gap-4 px-5 py-8 sm:grid-cols-3 lg:px-8">
          <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5">
            <BookOpen className="h-6 w-6 text-blue-600" />
            <div>
              <p className="font-semibold text-slate-950">
                {courses.length} active programs
              </p>
              <p className="text-sm text-slate-500">Current course catalogue</p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5">
            <Laptop className="h-6 w-6 text-blue-600" />
            <div>
              <p className="font-semibold text-slate-950">
                Practical learning
              </p>
              <p className="text-sm text-slate-500">Learn by applying skills</p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5">
            <ShieldCheck className="h-6 w-6 text-blue-600" />
            <div>
              <p className="font-semibold text-slate-950">
                Student platform
              </p>
              <p className="text-sm text-slate-500">
                Connected learning experience
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-5 lg:px-8">
          <div className="space-y-14">
            {faqs.map((section) => (
              <div key={section.category}>
                <div className="mb-6 flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-blue-600" />

                  <h2 className="text-2xl font-bold tracking-tight text-slate-950">
                    {section.category}
                  </h2>
                </div>

                <div className="space-y-3">
                  {section.items.map((faq) => (
                    <details
                      key={faq.question}
                      className="group rounded-2xl border border-slate-200 bg-white transition open:border-blue-200 open:shadow-lg open:shadow-slate-200/40"
                    >
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-6 px-5 py-5 font-semibold text-slate-950 sm:px-6">
                        <span>{faq.question}</span>

                        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-slate-100 text-slate-500 transition group-open:rotate-45 group-open:bg-blue-50 group-open:text-blue-600">
                          <span className="text-xl font-normal leading-none">
                            +
                          </span>
                        </span>
                      </summary>

                      <div className="border-t border-slate-100 px-5 pb-6 pt-4 sm:px-6">
                        <p className="leading-7 text-slate-600">
                          {faq.answer}
                        </p>
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-950 py-20">
        <div className="mx-auto max-w-4xl px-5 text-center lg:px-8">
          <MessageCircleQuestion className="mx-auto h-10 w-10 text-blue-400" />

          <h2 className="mt-6 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Still have a question?
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-400">
            Contact EDSEC for clarification about a course, application,
            learning format, or student experience.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-7 py-3.5 font-semibold text-white transition hover:bg-blue-500"
            >
              Contact EDSEC
              <ArrowUpRight className="h-4 w-4" />
            </Link>

            <Link
              href="/courses"
              className="inline-flex items-center justify-center rounded-xl border border-slate-700 px-7 py-3.5 font-semibold text-white transition hover:bg-white/5"
            >
              Browse courses
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}