import Link from "next/link";

import { prisma } from "@/app/lib/prisma";
import { requireRole } from "@/app/lib/auth";

import { createTest } from "./actions";

export default async function AdminTestsPage() {
  await requireRole("ADMIN");

  const [tests, courses] = await Promise.all([
    prisma.test.findMany({
      include: {
        course: {
          select: {
            id: true,
            title: true,
          },
        },
        _count: {
          select: {
            questions: true,
            attempts: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    }),

    prisma.course.findMany({
      where: {
        status: "ACTIVE",
      },
      select: {
        id: true,
        title: true,
      },
      orderBy: {
        title: "asc",
      },
    }),
  ]);

  const statusClass: Record<string, string> = {
    DRAFT: "bg-slate-100 text-slate-700",
    PUBLISHED: "bg-emerald-100 text-emerald-700",
    CLOSED: "bg-red-100 text-red-700",
  };

  return (
    <main className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* HEADER */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              href="/admin"
              className="mb-2 inline-flex text-sm font-medium text-slate-500 transition hover:text-slate-900"
            >
              ← Admin Dashboard
            </Link>

            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              Tests & Questions
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Create tests, manage questions and prepare assessments for
              students.
            </p>
          </div>

          <div className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white">
            {tests.length} {tests.length === 1 ? "Test" : "Tests"}
          </div>
        </div>

        {/* CREATE TEST */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Create New Test
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Create a test and add questions from the test details page.
            </p>
          </div>

          {courses.length === 0 ? (
            <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
              You need at least one active course before creating a test.
            </div>
          ) : (
            <form
              action={createTest}
              className="mt-6 space-y-5"
            >
              <div className="grid gap-5 md:grid-cols-2">
                {/* TEST TITLE */}
                <div>
                  <label
                    htmlFor="title"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Test Title
                  </label>

                  <input
                    id="title"
                    name="title"
                    type="text"
                    required
                    placeholder="e.g. HTML & CSS Fundamentals Test"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-100"
                  />
                </div>

                {/* COURSE */}
                <div>
                  <label
                    htmlFor="courseId"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Course
                  </label>

                  <select
                    id="courseId"
                    name="courseId"
                    required
                    defaultValue=""
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-900"
                  >
                    <option value="" disabled>
                      Select course
                    </option>

                    {courses.map((course) => (
                      <option key={course.id} value={course.id}>
                        {course.title}
                      </option>
                    ))}
                  </select>
                </div>

                {/* DURATION */}
                <div>
                  <label
                    htmlFor="duration"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Duration
                  </label>

                  <div className="flex">
                    <input
                      id="duration"
                      name="duration"
                      type="number"
                      min="1"
                      placeholder="60"
                      className="w-full rounded-l-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
                    />

                    <span className="inline-flex items-center rounded-r-xl border border-l-0 border-slate-300 bg-slate-50 px-4 text-sm text-slate-500">
                      minutes
                    </span>
                  </div>
                </div>
              </div>

              {/* DESCRIPTION */}
              <div>
                <label
                  htmlFor="description"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Description
                </label>

                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  placeholder="Briefly describe what this test covers..."
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
                />
              </div>

              {/* SUBMIT */}
              <button
                type="submit"
                className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Create Test
              </button>
            </form>
          )}
        </section>

        {/* TESTS */}
        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 p-6">
            <h2 className="text-lg font-bold text-slate-900">
              All Tests
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Manage your existing tests.
            </p>
          </div>

          {tests.length === 0 ? (
            <div className="p-8 text-center">
              <p className="font-semibold text-slate-900">
                No tests created yet.
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Create your first test using the form above.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {tests.map((test) => (
                <div
                  key={test.id}
                  className="flex flex-col gap-5 p-6 lg:flex-row lg:items-center lg:justify-between"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-bold text-slate-900">
                        {test.title}
                      </h3>

                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          statusClass[test.status] ??
                          "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {test.status}
                      </span>
                    </div>

                    <p className="mt-2 text-sm text-slate-500">
                      {test.course.title}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-500">
                      <span>
                        {test._count.questions}{" "}
                        {test._count.questions === 1
                          ? "question"
                          : "questions"}
                      </span>

                      <span>
                        {test._count.attempts}{" "}
                        {test._count.attempts === 1
                          ? "attempt"
                          : "attempts"}
                      </span>

                      <span>
                        {test.duration
                          ? `${test.duration} minutes`
                          : "No time limit"}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Link
                      href={`/admin/tests/${test.id}`}
                      className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
                    >
                      Manage Test
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}