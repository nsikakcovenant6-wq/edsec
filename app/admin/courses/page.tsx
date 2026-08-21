/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  BookOpen,
  CheckCircle2,
  Clock3,
  Edit3,
  Eye,
  GraduationCap,
  Plus,
  Star,
  Users,
  XCircle,
} from "lucide-react";

import { prisma } from "@/app/lib/prisma";
import { requireRole } from "@/app/lib/auth";
import {
  deleteCourse,
  toggleCourseFeatured,
  toggleCourseStatus,
} from "./actions";

export default async function AdminCoursesPage() {
  const admin = await requireRole("ADMIN");

  if (!admin) {
    redirect("/login");
  }

  const courses = await prisma.course.findMany({
    orderBy: [
      {
        featured: "desc",
      },
      {
        displayOrder: "asc",
      },
      {
        createdAt: "desc",
      },
    ],
    include: {
      _count: {
        select: {
          enrollments: true,
          modules: true,
          tests: true,
          cohorts: true,
          liveClasses: true,
          assessments: true,
        },
      },
    },
  });

  const totalCourses = courses.length;

  const activeCourses = courses.filter(
    (course) => course.status === "ACTIVE"
  ).length;

  const draftCourses = courses.filter(
    (course) => course.status === "DRAFT"
  ).length;

  const inactiveCourses = courses.filter(
    (course) => course.status === "INACTIVE"
  ).length;

  const totalEnrollments = courses.reduce(
    (total, course) => total + course._count.enrollments,
    0
  );

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-5 py-6 lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
              EDSEC Administration
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
              Courses
            </h1>

            <p className="mt-1 text-slate-600">
              Manage EDSEC training programs, enrollment, and learning
              content.
            </p>
          </div>

          <Link
            href="/admin/courses/new"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            <Plus size={18} />
            Create Course
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={<BookOpen size={20} />}
            label="Total Courses"
            value={totalCourses}
          />

          <StatCard
            icon={<CheckCircle2 size={20} />}
            label="Active"
            value={activeCourses}
          />

          <StatCard
            icon={<Clock3 size={20} />}
            label="Draft"
            value={draftCourses}
          />

          <StatCard
            icon={<Users size={20} />}
            label="Enrollments"
            value={totalEnrollments}
          />
        </div>

        <div className="mt-8 rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 p-6">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-xl font-bold text-slate-950">
                  Training Programs
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Create and manage the courses available through EDSEC.
                </p>
              </div>

              <div className="flex flex-wrap gap-2 text-xs font-semibold">
                <span className="rounded-full bg-green-50 px-3 py-1.5 text-green-700">
                  {activeCourses} Active
                </span>

                <span className="rounded-full bg-amber-50 px-3 py-1.5 text-amber-700">
                  {draftCourses} Draft
                </span>

                <span className="rounded-full bg-slate-100 px-3 py-1.5 text-slate-600">
                  {inactiveCourses} Inactive
                </span>
              </div>
            </div>
          </div>

          {courses.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="divide-y divide-slate-100">
              {courses.map((course) => (
                <CourseRow key={course.id} course={course} />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

function CourseRow({
  course,
}: {
  course: {
    id: string;
    title: string;
    slug: string;
    shortDescription: string;
    imageUrl: string | null;
    duration: string | null;
    learningFormat: string | null;
    status: "ACTIVE" | "INACTIVE" | "DRAFT";
    featured: boolean;
    _count: {
      enrollments: number;
      modules: number;
      tests: number;
      cohorts: number;
      liveClasses: number;
      assessments: number;
    };
  };
}) {
  return (
    <div className="p-6 transition hover:bg-slate-50/70">
      <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex min-w-0 gap-4">
          <div className="hidden h-20 w-28 shrink-0 overflow-hidden rounded-xl bg-slate-100 sm:block">
            {course.imageUrl ? (
              <img
                src={course.imageUrl}
                alt={course.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="grid h-full w-full place-items-center text-slate-400">
                <GraduationCap size={28} />
              </div>
            )}
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-bold text-slate-950">
                {course.title}
              </h3>

              {course.featured && (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                  <Star size={12} fill="currentColor" />
                  Featured
                </span>
              )}

              <StatusBadge status={course.status} />
            </div>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              {course.shortDescription}
            </p>

            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs font-medium text-slate-500">
              <span>
                {course._count.enrollments}{" "}
                {course._count.enrollments === 1 ? "student" : "students"}
              </span>

              <span>
                {course._count.modules}{" "}
                {course._count.modules === 1 ? "module" : "modules"}
              </span>

              <span>
                {course._count.tests}{" "}
                {course._count.tests === 1 ? "test" : "tests"}
              </span>

              <span>
                {course._count.assessments}{" "}
                {course._count.assessments === 1
                  ? "assessment"
                  : "assessments"}
              </span>

              {course.duration && <span>{course.duration}</span>}

              {course.learningFormat && (
                <span>{course.learningFormat}</span>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href={`/courses/${course.slug}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            <Eye size={16} />
            View
          </Link>

          <Link
            href={`/admin/courses/${course.id}`}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            <Edit3 size={16} />
            Manage
          </Link>

          <form action={toggleCourseStatusAction}>
            <input type="hidden" name="courseId" value={course.id} />

            <button
              type="submit"
              className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition ${
                course.status === "ACTIVE"
                  ? "border border-red-200 text-red-600 hover:bg-red-50"
                  : "border border-green-200 text-green-700 hover:bg-green-50"
              }`}
            >
              {course.status === "ACTIVE" ? (
                <>
                  <XCircle size={16} />
                  Deactivate
                </>
              ) : (
                <>
                  <CheckCircle2 size={16} />
                  Activate
                </>
              )}
            </button>
          </form>

          <form action={toggleCourseFeaturedAction}>
            <input type="hidden" name="courseId" value={course.id} />

            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-lg border border-amber-200 px-3 py-2 text-sm font-semibold text-amber-700 transition hover:bg-amber-50"
            >
              <Star
                size={16}
                fill={course.featured ? "currentColor" : "none"}
              />

              {course.featured ? "Unfeature" : "Feature"}
            </button>
          </form>

          <form action={deleteCourseAction}>
            <input type="hidden" name="courseId" value={course.id} />

            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
            >
              Delete
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

/**
 * These wrappers adapt the existing actions to the
 * Next.js form action signature: (formData: FormData) => Promise<void>.
 */
async function toggleCourseStatusAction(formData: FormData): Promise<void> {
  "use server";

  const courseId = String(formData.get("courseId") ?? "").trim();

  if (!courseId) {
    return;
  }

  await toggleCourseStatus(courseId);
}

async function toggleCourseFeaturedAction(
  formData: FormData
): Promise<void> {
  "use server";

  const courseId = String(formData.get("courseId") ?? "").trim();

  if (!courseId) {
    return;
  }

  await toggleCourseFeatured(courseId);
}

async function deleteCourseAction(formData: FormData): Promise<void> {
  "use server";

  const courseId = String(formData.get("courseId") ?? "").trim();

  if (!courseId) {
    return;
  }

  await deleteCourse(courseId);
}

function StatusBadge({
  status,
}: {
  status: "ACTIVE" | "INACTIVE" | "DRAFT";
}) {
  if (status === "ACTIVE") {
    return (
      <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
        Active
      </span>
    );
  }

  if (status === "INACTIVE") {
    return (
      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
        Inactive
      </span>
    );
  }

  return (
    <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
      Draft
    </span>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-blue-600">
          {icon}
        </div>
      </div>

      <p className="mt-5 text-3xl font-bold tracking-tight text-slate-950">
        {value}
      </p>

      <p className="mt-1 text-sm font-semibold text-slate-900">
        {label}
      </p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="px-6 py-20 text-center">
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-blue-50 text-blue-600">
        <BookOpen size={30} />
      </div>

      <h3 className="mt-5 text-lg font-bold text-slate-950">
        No courses yet
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        Create your first EDSEC training program to start building the
        learning platform.
      </p>

      <Link
        href="/admin/courses/new"
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
      >
        <Plus size={18} />
        Create Your First Course
      </Link>
    </div>
  );
}