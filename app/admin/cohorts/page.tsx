import Link from "next/link";
import { prisma } from "@/app/lib/prisma";
import { requireRole } from "@/app/lib/auth";
import {
  createCohort,
  deleteCohort,
} from "./actions";

type PageProps = {
  searchParams: Promise<{
    search?: string;
    status?: string;
  }>;
};

const statusClass: Record<string, string> = {
  UPCOMING: "bg-blue-100 text-blue-700",
  ACTIVE: "bg-emerald-100 text-emerald-700",
  COMPLETED: "bg-slate-100 text-slate-700",
  CANCELLED: "bg-red-100 text-red-700",
};

export default async function CohortsPage({
  searchParams,
}: PageProps) {
  await requireRole("ADMIN");

  const params = await searchParams;

  const search = params.search?.trim() ?? "";
  const status = params.status?.trim() ?? "";

  const courses = await prisma.course.findMany({
    select: {
      id: true,
      title: true,
    },
    orderBy: {
      title: "asc",
    },
  });

  const cohorts = await prisma.cohort.findMany({
    where: {
      ...(status &&
      ["UPCOMING", "ACTIVE", "COMPLETED", "CANCELLED"].includes(status)
        ? {
            status: status as
              | "UPCOMING"
              | "ACTIVE"
              | "COMPLETED"
              | "CANCELLED",
          }
        : {}),
      ...(search
        ? {
            OR: [
              {
                name: {
                  contains: search,
                  mode: "insensitive",
                },
              },
              {
                course: {
                  title: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
              },
            ],
          }
        : {}),
    },
    include: {
      course: {
        select: {
          id: true,
          title: true,
        },
      },
      _count: {
        select: {
          enrollments: true,
        },
      },
    },
    orderBy: [
      {
        startDate: "asc",
      },
      {
        createdAt: "desc",
      },
    ],
  });

  const formatDate = (date: Date | null) => {
    if (!date) return "—";

    return new Intl.DateTimeFormat("en-NG", {
      dateStyle: "medium",
    }).format(date);
  };

  return (
    <main className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              href="/admin"
              className="mb-2 inline-flex text-sm font-medium text-slate-500 hover:text-slate-900"
            >
              ← Dashboard
            </Link>

            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              Cohorts
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Create and manage course batches and student groups.
            </p>
          </div>

          <span className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
            {cohorts.length} Cohort{cohorts.length === 1 ? "" : "s"}
          </span>
        </div>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">
            Create Cohort
          </h2>

          <form
            action={createCohort}
            className="mt-5 grid gap-4 md:grid-cols-2"
          >
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Course
              </label>

              <select
                name="courseId"
                required
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-900"
              >
                <option value="">Select course</option>

                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Cohort Name
              </label>

              <input
                name="name"
                required
                placeholder="e.g. Web Development Batch 1"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Description
              </label>

              <textarea
                name="description"
                rows={3}
                placeholder="Optional cohort description"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Start Date
              </label>

              <input
                type="date"
                name="startDate"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                End Date
              </label>

              <input
                type="date"
                name="endDate"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Status
              </label>

              <select
                name="status"
                defaultValue="UPCOMING"
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-900"
              >
                <option value="UPCOMING">Upcoming</option>
                <option value="ACTIVE">Active</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className="w-full rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
              >
                Create Cohort
              </button>
            </div>
          </form>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <form className="grid gap-3 md:grid-cols-[1fr_220px_auto]">
            <input
              name="search"
              defaultValue={search}
              placeholder="Search cohort or course..."
              className="rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
            />

            <select
              name="status"
              defaultValue={status}
              className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-900"
            >
              <option value="">All statuses</option>
              <option value="UPCOMING">Upcoming</option>
              <option value="ACTIVE">Active</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>

            <button
              type="submit"
              className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white"
            >
              Search
            </button>
          </form>
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 p-6">
            <h2 className="text-lg font-bold text-slate-900">
              All Cohorts
            </h2>
          </div>

          {cohorts.length === 0 ? (
            <div className="p-10 text-center text-sm text-slate-500">
              No cohorts found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-225 text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-6 py-3">Cohort</th>
                    <th className="px-6 py-3">Course</th>
                    <th className="px-6 py-3">Students</th>
                    <th className="px-6 py-3">Start</th>
                    <th className="px-6 py-3">End</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {cohorts.map((cohort) => (
                    <tr key={cohort.id}>
                      <td className="px-6 py-4">
                        <Link
                          href={`/admin/cohorts/${cohort.id}`}
                          className="font-semibold text-slate-900 hover:underline"
                        >
                          {cohort.name}
                        </Link>
                      </td>

                      <td className="px-6 py-4 text-slate-600">
                        {cohort.course.title}
                      </td>

                      <td className="px-6 py-4">
                        {cohort._count.enrollments}
                      </td>

                      <td className="px-6 py-4">
                        {formatDate(cohort.startDate)}
                      </td>

                      <td className="px-6 py-4">
                        {formatDate(cohort.endDate)}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            statusClass[cohort.status] ??
                            "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {cohort.status}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Link
                            href={`/admin/cohorts/${cohort.id}`}
                            className="font-semibold text-slate-700 hover:underline"
                          >
                            Manage
                          </Link>

                          <form action={deleteCohort}>
                            <input
                              type="hidden"
                              name="id"
                              value={cohort.id}
                            />

                            <button
                              type="submit"
                              className="font-semibold text-red-600 hover:underline"
                            >
                              Delete
                            </button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}