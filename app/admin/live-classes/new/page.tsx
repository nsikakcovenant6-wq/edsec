import Link from "next/link";

import { prisma } from "@/app/lib/prisma";
import { requireRole } from "@/app/lib/auth";
import { createLiveClass } from "../actions";

export default async function NewLiveClassPage() {
  await requireRole("ADMIN");

  const courses = await prisma.course.findMany({
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
  });

  return (
    <main className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6">
          <Link
            href="/admin/live-classes"
            className="text-sm font-medium text-slate-500 hover:text-slate-900"
          >
            ← Back to Live Classes
          </Link>

          <h1 className="mt-3 text-2xl font-bold text-slate-900 sm:text-3xl">
            Create Live Class
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Schedule an online class for enrolled students.
          </p>
        </div>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          {courses.length === 0 ? (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-800">
              No active courses are available. Create or activate a course
              before scheduling a live class.
            </div>
          ) : (
            <form
              action={createLiveClass}
              className="space-y-6"
            >
              <div className="grid gap-6 md:grid-cols-2">
                <div className="md:col-span-2">
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
                    placeholder="e.g. Full-Stack Web Development — React Basics"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-100"
                  />
                </div>

                <div className="md:col-span-2">
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
                      Select the course
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
                    Class Date
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
                    Start Time
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

                    <span className="flex items-center rounded-r-xl border border-l-0 border-slate-300 bg-slate-50 px-4 text-sm text-slate-500">
                      minutes
                    </span>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="meetingUrl"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Meeting URL
                  </label>

                  <input
                    id="meetingUrl"
                    name="meetingUrl"
                    type="url"
                    required
                    placeholder="https://meet.google.com/..."
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
                  />

                  <p className="mt-1 text-xs text-slate-500">
                    Add the Google Meet, Zoom, Microsoft Teams or other
                    meeting link.
                  </p>
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
                  rows={5}
                  placeholder="Tell students what this class will cover..."
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
                />
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    type="checkbox"
                    name="isPublished"
                    value="true"
                    className="mt-1 h-4 w-4 rounded border-slate-300"
                  />

                  <span>
                    <span className="block text-sm font-semibold text-slate-800">
                      Publish immediately
                    </span>

                    <span className="mt-1 block text-xs text-slate-500">
                      Published classes can appear in the student portal.
                    </span>
                  </span>
                </label>
              </div>

              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <Link
                  href="/admin/live-classes"
                  className="rounded-xl border border-slate-300 px-5 py-3 text-center text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </Link>

                <button
                  type="submit"
                  className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
                >
                  Create Live Class
                </button>
              </div>
            </form>
          )}
        </section>
      </div>
    </main>
  );
}