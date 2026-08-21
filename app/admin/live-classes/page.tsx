import Link from "next/link";

import { prisma } from "@/app/lib/prisma";
import { requireRole } from "@/app/lib/auth";
import { createLiveClass } from "./actions";

export default async function AdminLiveClassesPage() {
  await requireRole("ADMIN");

  const [liveClasses, courses] = await Promise.all([
    prisma.liveClass.findMany({
      include: {
        course: {
          select: {
            id: true,
            title: true,
          },
        },
        _count: {
          select: {
            attendance: true,
            students: true,
          },
        },
      },
      orderBy: {
        scheduledAt: "asc",
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
    SCHEDULED: "bg-blue-100 text-blue-700",
    LIVE: "bg-emerald-100 text-emerald-700",
    COMPLETED: "bg-slate-100 text-slate-700",
    CANCELLED: "bg-red-100 text-red-700",
  };

  const publishedCount = liveClasses.filter(
    (item) => item.isPublished,
  ).length;

  const upcomingCount = liveClasses.filter(
    (item) =>
      item.status === "SCHEDULED" &&
      item.scheduledAt >= new Date(),
  ).length;

  const liveCount = liveClasses.filter(
    (item) => item.status === "LIVE",
  ).length;

  return (
    <main className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              href="/admin"
              className="mb-2 inline-flex text-sm font-medium text-slate-500 hover:text-slate-900"
            >
              ← Admin Dashboard
            </Link>

            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              Live Classes
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Schedule, publish and manage online classes for students.
            </p>
          </div>

          <Link
            href="/admin/live-classes/new"
            className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            + New Live Class
          </Link>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Total Classes
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-900">
              {liveClasses.length}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Upcoming
            </p>

            <p className="mt-2 text-3xl font-bold text-blue-600">
              {upcomingCount}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Currently Live
            </p>

            <p className="mt-2 text-3xl font-bold text-emerald-600">
              {liveCount}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Published
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-900">
              {publishedCount}
            </p>
          </div>
        </div>

        {/* Quick Create */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">
            Quick Create Live Class
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Create a scheduled class directly from the admin dashboard.
          </p>

          {courses.length === 0 ? (
            <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
              You need at least one active course before creating a live
              class.
            </div>
          ) : (
            <form
              action={createLiveClass}
              className="mt-6 space-y-5"
            >
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="title"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Class Title
                  </label>

                  <input
                    id="title"
                    name="title"
                    required
                    placeholder="e.g. Introduction to Python"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-100"
                  />
                </div>

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
                      <option
                        key={course.id}
                        value={course.id}
                      >
                        {course.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="date"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Date
                  </label>

                  <input
                    id="date"
                    name="date"
                    type="date"
                    required
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
                  />
                </div>

                <div>
                  <label
                    htmlFor="time"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Time
                  </label>

                  <input
                    id="time"
                    name="time"
                    type="time"
                    required
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
                  />
                </div>

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
                      min
                    </span>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="meetingUrl"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Meeting Link
                  </label>

                  <input
                    id="meetingUrl"
                    name="meetingUrl"
                    type="url"
                    required
                    placeholder="https://meet.google.com/..."
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
                  />
                </div>
              </div>

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
                  placeholder="Describe what students will learn in this class..."
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
                />
              </div>

              <input
                type="hidden"
                name="isPublished"
                value="false"
              />

              <button
                type="submit"
                className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Create Live Class
              </button>
            </form>
          )}
        </section>

        {/* Classes */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 p-6">
            <h2 className="text-lg font-bold text-slate-900">
              All Live Classes
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Manage scheduled and previous online classes.
            </p>
          </div>

          {liveClasses.length === 0 ? (
            <div className="p-10 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-2xl">
                🎥
              </div>

              <p className="mt-4 font-semibold text-slate-900">
                No live classes yet.
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Create your first online class above.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {liveClasses.map((liveClass) => (
                <div
                  key={liveClass.id}
                  className="flex flex-col gap-5 p-6 lg:flex-row lg:items-center lg:justify-between"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-bold text-slate-900">
                        {liveClass.title}
                      </h3>

                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          statusClass[liveClass.status] ??
                          "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {liveClass.status}
                      </span>

                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          liveClass.isPublished
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {liveClass.isPublished
                          ? "Published"
                          : "Unpublished"}
                      </span>
                    </div>

                    <p className="mt-2 text-sm text-slate-500">
                      {liveClass.course.title}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-500">
                      <span>
                        {new Intl.DateTimeFormat("en-NG", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        }).format(liveClass.scheduledAt)}
                      </span>

                      <span>
                        {liveClass.duration
                          ? `${liveClass.duration} minutes`
                          : "No duration"}
                      </span>

                      <span>
                        {liveClass._count.students}{" "}
                        {liveClass._count.students === 1
                          ? "student"
                          : "students"}
                      </span>

                      <span>
                        {liveClass._count.attendance} attendance records
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Link
                      href={`/admin/live-classes/${liveClass.id}`}
                      className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
                    >
                      Manage
                    </Link>

                    <a
                      href={liveClass.meetingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      Join
                    </a>
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