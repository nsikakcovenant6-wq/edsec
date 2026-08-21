import Link from "next/link";

import { prisma } from "@/app/lib/prisma";
import { requireRole } from "@/app/lib/auth";

import {
  deleteLiveClass,
  syncLiveClassStudents,
  toggleLiveClassPublished,
  updateAttendance,
  updateLiveClass,
  updateLiveClassStatus,
} from "../actions";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-NG", {
    dateStyle: "full",
    timeStyle: "short",
  }).format(date);
}

function formatDateInput(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatTimeInput(date: Date) {
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${hours}:${minutes}`;
}

const statusClass: Record<string, string> = {
  SCHEDULED: "bg-blue-100 text-blue-700",
  LIVE: "bg-emerald-100 text-emerald-700",
  COMPLETED: "bg-slate-100 text-slate-700",
  CANCELLED: "bg-red-100 text-red-700",
};

const attendanceClass: Record<string, string> = {
  PRESENT: "bg-emerald-100 text-emerald-700",
  ABSENT: "bg-red-100 text-red-700",
  LATE: "bg-amber-100 text-amber-700",
  EXCUSED: "bg-blue-100 text-blue-700",
};

export default async function AdminLiveClassDetailsPage({
  params,
}: PageProps) {
  await requireRole("ADMIN");

  const { id } = await params;

  const [liveClass, courses] = await Promise.all([
    prisma.liveClass.findUnique({
      where: {
        id,
      },
      include: {
        course: {
          select: {
            id: true,
            title: true,
          },
        },

        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },

        students: {
          include: {
            enrollment: {
              include: {
                student: {
                  select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                    studentProfile: {
                      select: {
                        studentNumber: true,
                      },
                    },
                  },
                },
              },
            },
          },
          orderBy: {
            createdAt: "asc",
          },
        },

        attendance: {
          include: {
            student: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                studentProfile: {
                  select: {
                    studentNumber: true,
                  },
                },
              },
            },
          },
          orderBy: [
            {
              student: {
                firstName: "asc",
              },
            },
            {
              student: {
                lastName: "asc",
              },
            },
          ],
        },
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

  if (!liveClass) {
    return (
      <main className="min-h-screen bg-slate-50 p-6">
        <div className="mx-auto max-w-3xl rounded-2xl border border-red-200 bg-white p-8 text-center">
          <h1 className="text-xl font-bold text-slate-900">
            Live class not found
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            The live class you are looking for does not exist.
          </p>

          <Link
            href="/admin/live-classes"
            className="mt-5 inline-flex rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white"
          >
            Back to Live Classes
          </Link>
        </div>
      </main>
    );
  }

  const presentCount = liveClass.attendance.filter(
    (item) => item.status === "PRESENT",
  ).length;

  const lateCount = liveClass.attendance.filter(
    (item) => item.status === "LATE",
  ).length;

  const absentCount = liveClass.attendance.filter(
    (item) => item.status === "ABSENT",
  ).length;

  const excusedCount = liveClass.attendance.filter(
    (item) => item.status === "EXCUSED",
  ).length;

  return (
    <main className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div>
          <Link
            href="/admin/live-classes"
            className="text-sm font-medium text-slate-500 hover:text-slate-900"
          >
            ← Back to Live Classes
          </Link>

          <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                  {liveClass.title}
                </h1>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    statusClass[liveClass.status] ??
                    "bg-slate-100 text-slate-700"
                  }`}
                >
                  {liveClass.status}
                </span>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
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
            </div>

            <div className="flex flex-wrap gap-2">
              <a
                href={liveClass.meetingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
              >
                Join Meeting
              </a>

              <form action={toggleLiveClassPublished}>
                <input
                  type="hidden"
                  name="id"
                  value={liveClass.id}
                />

                <button
                  type="submit"
                  className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  {liveClass.isPublished
                    ? "Unpublish"
                    : "Publish"}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Overview */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Scheduled
            </p>

            <p className="mt-2 text-sm font-bold text-slate-900">
              {formatDate(liveClass.scheduledAt)}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Duration
            </p>

            <p className="mt-2 text-xl font-bold text-slate-900">
              {liveClass.duration
                ? `${liveClass.duration} min`
                : "Not set"}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Students
            </p>

            <p className="mt-2 text-xl font-bold text-slate-900">
              {liveClass.students.length}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Present / Late
            </p>

            <p className="mt-2 text-xl font-bold text-emerald-600">
              {presentCount} / {lateCount}
            </p>
          </div>
        </div>

        {/* Edit */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="border-b border-slate-200 pb-5">
            <h2 className="text-lg font-bold text-slate-900">
              Edit Live Class
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Update the class details, schedule or meeting link.
            </p>
          </div>

          <form
            action={updateLiveClass}
            className="mt-6 space-y-6"
          >
            <input
              type="hidden"
              name="id"
              value={liveClass.id}
            />

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
                  defaultValue={liveClass.title}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
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
                  defaultValue={liveClass.courseId}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-900"
                >
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
                  defaultValue={formatDateInput(
                    liveClass.scheduledAt,
                  )}
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
                  defaultValue={formatTimeInput(
                    liveClass.scheduledAt,
                  )}
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

                <input
                  id="duration"
                  name="duration"
                  type="number"
                  min="1"
                  defaultValue={liveClass.duration ?? ""}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
                />
              </div>

              <div>
                <label
                  htmlFor="status"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Status
                </label>

                <select
                  id="status"
                  name="status"
                  defaultValue={liveClass.status}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-900"
                >
                  <option value="SCHEDULED">
                    Scheduled
                  </option>

                  <option value="LIVE">
                    Live
                  </option>

                  <option value="COMPLETED">
                    Completed
                  </option>

                  <option value="CANCELLED">
                    Cancelled
                  </option>
                </select>
              </div>

              <div className="md:col-span-2">
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
                  defaultValue={liveClass.meetingUrl}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
                />
              </div>

              <div className="md:col-span-2">
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
                  defaultValue={liveClass.description ?? ""}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
                />
              </div>
            </div>

            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <input
                type="checkbox"
                name="isPublished"
                value="true"
                defaultChecked={liveClass.isPublished}
                className="h-4 w-4 rounded border-slate-300"
              />

              <span>
                <span className="block text-sm font-semibold text-slate-800">
                  Published
                </span>

                <span className="block text-xs text-slate-500">
                  Students can see published classes in their portal.
                </span>
              </span>
            </label>

            <button
              type="submit"
              className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Save Changes
            </button>
          </form>
        </section>

        {/* Status controls */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">
            Quick Status
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Quickly change the current class status.
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            {[
              ["SCHEDULED", "Scheduled"],
              ["LIVE", "Go Live"],
              ["COMPLETED", "Mark Completed"],
              ["CANCELLED", "Cancel Class"],
            ].map(([value, label]) => (
              <form
                key={value}
                action={updateLiveClassStatus}
              >
                <input
                  type="hidden"
                  name="id"
                  value={liveClass.id}
                />

                <input
                  type="hidden"
                  name="status"
                  value={value}
                />

                <button
                  type="submit"
                  className={`rounded-xl px-4 py-2.5 text-sm font-semibold ${
                    value === "LIVE"
                      ? "bg-emerald-600 text-white hover:bg-emerald-700"
                      : value === "CANCELLED"
                        ? "bg-red-600 text-white hover:bg-red-700"
                        : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {label}
                </button>
              </form>
            ))}
          </div>
        </section>

        {/* Students */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-slate-200 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Class Students
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Students currently enrolled in this live class.
              </p>
            </div>

            <form action={syncLiveClassStudents}>
              <input
                type="hidden"
                name="liveClassId"
                value={liveClass.id}
              />

              <button
                type="submit"
                className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Sync Enrolled Students
              </button>
            </form>
          </div>

          {liveClass.students.length === 0 ? (
            <div className="p-8 text-center">
              <p className="font-semibold text-slate-900">
                No students attached yet.
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Click “Sync Enrolled Students” to attach active
                course enrollments.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {liveClass.students.map((student) => (
                <div
                  key={student.id}
                  className="flex flex-col gap-2 p-5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-semibold text-slate-900">
                      {student.enrollment.student.firstName}{" "}
                      {student.enrollment.student.lastName}
                    </p>

                    <p className="text-sm text-slate-500">
                      {student.enrollment.student.email}
                    </p>
                  </div>

                  <span className="text-xs font-medium text-slate-500">
                    {student.enrollment.student.studentProfile
                      ?.studentNumber ?? "No student number"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Attendance */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 p-6">
            <h2 className="text-lg font-bold text-slate-900">
              Attendance
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Record attendance for this live class.
            </p>

            <div className="mt-4 flex flex-wrap gap-3 text-xs">
              <span className="rounded-full bg-emerald-100 px-3 py-1.5 font-semibold text-emerald-700">
                Present: {presentCount}
              </span>

              <span className="rounded-full bg-amber-100 px-3 py-1.5 font-semibold text-amber-700">
                Late: {lateCount}
              </span>

              <span className="rounded-full bg-red-100 px-3 py-1.5 font-semibold text-red-700">
                Absent: {absentCount}
              </span>

              <span className="rounded-full bg-blue-100 px-3 py-1.5 font-semibold text-blue-700">
                Excused: {excusedCount}
              </span>
            </div>
          </div>

          {liveClass.attendance.length === 0 ? (
            <div className="p-8 text-center">
              <p className="font-semibold text-slate-900">
                No attendance records yet.
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Sync the enrolled students to create attendance records.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {liveClass.attendance.map((record) => (
                <div
                  key={record.id}
                  className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between"
                >
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-900">
                      {record.student.firstName}{" "}
                      {record.student.lastName}
                    </p>

                    <p className="text-sm text-slate-500">
                      {record.student.email}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      {record.student.studentProfile?.studentNumber ??
                        "No student number"}
                    </p>
                  </div>

                  <form
                    action={updateAttendance}
                    className="flex flex-col gap-2 sm:flex-row"
                  >
                    <input
                      type="hidden"
                      name="attendanceId"
                      value={record.id}
                    />

                    <select
                      name="status"
                      defaultValue={record.status}
                      className="rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-slate-900"
                    >
                      <option value="PRESENT">
                        Present
                      </option>

                      <option value="ABSENT">
                        Absent
                      </option>

                      <option value="LATE">
                        Late
                      </option>

                      <option value="EXCUSED">
                        Excused
                      </option>
                    </select>

                    <input
                      name="notes"
                      defaultValue={record.notes ?? ""}
                      placeholder="Notes"
                      className="rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-900"
                    />

                    <button
                      type="submit"
                      className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
                    >
                      Save
                    </button>
                  </form>

                  <span
                    className={`hidden rounded-full px-3 py-1.5 text-xs font-semibold lg:inline-flex ${
                      attendanceClass[record.status] ??
                      "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {record.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Meeting */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">
            Meeting
          </h2>

          <p className="mt-1 break-all text-sm text-slate-500">
            {liveClass.meetingUrl}
          </p>

          <a
            href={liveClass.meetingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            Open Meeting
          </a>
        </section>

        {/* Danger Zone */}
        <section className="rounded-2xl border border-red-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-red-700">
            Danger Zone
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Deleting this live class also removes its attendance and
            student-assignment records.
          </p>

          <form
            action={deleteLiveClass}
            className="mt-5"
          >
            <input
              type="hidden"
              name="id"
              value={liveClass.id}
            />

            <button
              type="submit"
              className="rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white hover:bg-red-700"
            >
              Delete Live Class
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}