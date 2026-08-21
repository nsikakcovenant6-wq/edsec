import Link from "next/link";

import { prisma } from "@/app/lib/prisma";
import { requireRole } from "@/app/lib/auth";

export default async function AdminAssessmentsPage() {
  await requireRole("ADMIN");

  const assessments = await prisma.assessment.findMany({
    include: {
      course: {
        select: {
          id: true,
          title: true,
        },
      },
      _count: {
        select: {
          grades: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const total = assessments.length;

  const published = assessments.filter(
    (item) => item.status === "PUBLISHED",
  ).length;

  const drafts = assessments.filter(
    (item) => item.status === "DRAFT",
  ).length;

  const closed = assessments.filter(
    (item) => item.status === "CLOSED",
  ).length;

  const statusClass: Record<string, string> = {
    DRAFT: "bg-amber-100 text-amber-700",
    PUBLISHED: "bg-emerald-100 text-emerald-700",
    CLOSED: "bg-slate-100 text-slate-700",
  };

  const typeClass: Record<string, string> = {
    TEST: "bg-blue-100 text-blue-700",
    PROJECT: "bg-purple-100 text-purple-700",
    ASSIGNMENT: "bg-orange-100 text-orange-700",
    EXAM: "bg-red-100 text-red-700",
    PRACTICAL: "bg-cyan-100 text-cyan-700",
  };

  return (
    <main className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              href="/admin"
              className="text-sm font-medium text-slate-500 hover:text-slate-900"
            >
              ← Admin Dashboard
            </Link>

            <h1 className="mt-3 text-2xl font-bold text-slate-900 sm:text-3xl">
              Assessments & Grades
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Create assessments, manage grades and monitor student
              performance.
            </p>
          </div>

          <Link
            href="/admin/assessments/new"
            className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
          >
            + New Assessment
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Total
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-900">
              {total}
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">
              Published
            </p>

            <p className="mt-2 text-3xl font-bold text-emerald-700">
              {published}
            </p>
          </div>

          <div className="rounded-2xl border border-amber-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-amber-600">
              Drafts
            </p>

            <p className="mt-2 text-3xl font-bold text-amber-700">
              {drafts}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Closed
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-700">
              {closed}
            </p>
          </div>
        </div>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 p-6">
            <h2 className="text-lg font-bold text-slate-900">
              All Assessments
            </h2>
          </div>

          {assessments.length === 0 ? (
            <div className="p-10 text-center">
              <p className="font-semibold text-slate-900">
                No assessments yet.
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Create your first assessment to start grading students.
              </p>

              <Link
                href="/admin/assessments/new"
                className="mt-5 inline-flex rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white"
              >
                Create Assessment
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {assessments.map((assessment) => (
                <Link
                  key={assessment.id}
                  href={`/admin/assessments/${assessment.id}`}
                  className="block p-5 transition hover:bg-slate-50"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-bold text-slate-900">
                          {assessment.title}
                        </h3>

                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                            statusClass[assessment.status]
                          }`}
                        >
                          {assessment.status}
                        </span>

                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                            typeClass[assessment.type]
                          }`}
                        >
                          {assessment.type}
                        </span>
                      </div>

                      <p className="mt-1 text-sm text-slate-500">
                        {assessment.course.title}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-5 text-sm">
                      <div>
                        <p className="text-xs text-slate-400">
                          Maximum
                        </p>
                        <p className="font-semibold text-slate-800">
                          {assessment.maxScore}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-slate-400">
                          Graded
                        </p>
                        <p className="font-semibold text-slate-800">
                          {assessment._count.grades}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-slate-400">
                          Due
                        </p>
                        <p className="font-semibold text-slate-800">
                          {assessment.dueDate
                            ? new Intl.DateTimeFormat("en-NG", {
                                dateStyle: "medium",
                              }).format(assessment.dueDate)
                            : "No due date"}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}