import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import type { ReactNode } from "react";

import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock3,
  FileText,
  GraduationCap,
  Layers3,
  Plus,
  PlayCircle,
  Trash2,
  Users,
  Video,
  XCircle,
} from "lucide-react";

import { prisma } from "@/app/lib/prisma";
import { requireRole } from "@/app/lib/auth";

import {
  createLesson,
  createModule,
  deleteLesson,
  deleteModule,
  toggleLessonPublished,
  toggleModulePublished,
} from "./actions";

/* -------------------------------------------------------------------------- */
/* Page                                                                       */
/* -------------------------------------------------------------------------- */

export default async function AdminCourseManagementPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const admin = await requireRole("ADMIN");

  if (!admin) {
    redirect("/login");
  }

  const { id } = await params;

  const course = await prisma.course.findUnique({
    where: {
      id,
    },
    include: {
      modules: {
        orderBy: {
          displayOrder: "asc",
        },
        include: {
          lessons: {
            orderBy: {
              displayOrder: "asc",
            },
          },
        },
      },

      _count: {
        select: {
          enrollments: true,
          tests: true,
          cohorts: true,
          liveClasses: true,
          assessments: true,
          applications: true,
        },
      },
    },
  });

  if (!course) {
    notFound();
  }

  const currentCourse = course;

  const totalModules = currentCourse.modules.length;

  const totalLessons = currentCourse.modules.reduce(
    (total, module) => total + module.lessons.length,
    0,
  );

  const publishedModules = currentCourse.modules.filter(
    (module) => module.isPublished,
  ).length;

  const publishedLessons = currentCourse.modules.reduce(
    (total, module) =>
      total +
      module.lessons.filter((lesson) => lesson.isPublished).length,
    0,
  );

  const createModuleAction = createModule.bind(
    null,
    currentCourse.id,
  );

  return (
    <main className="min-h-screen bg-slate-50">
      {/* ------------------------------------------------------------------ */}
      {/* Header                                                             */}
      {/* ------------------------------------------------------------------ */}

      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-6 lg:px-8">
          <Link
            href="/admin/courses"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-blue-600"
          >
            <ArrowLeft size={17} />
            Back to Courses
          </Link>

          <div className="mt-5 flex flex-col justify-between gap-5 lg:flex-row lg:items-start">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-blue-700">
                  Course Management
                </span>

                <StatusBadge status={currentCourse.status} />
              </div>

              <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
                {currentCourse.title}
              </h1>

              <p className="mt-2 max-w-3xl text-slate-600">
                {currentCourse.shortDescription ||
                  currentCourse.description ||
                  "Manage the course curriculum, modules, lessons, and learning content."}
              </p>
            </div>

            <Link
              href={`/courses/${currentCourse.slug}`}
              target="_blank"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              <PlayCircle size={18} />
              View Public Course
            </Link>
          </div>
        </div>
      </header>

      {/* ------------------------------------------------------------------ */}
      {/* Stats                                                              */}
      {/* ------------------------------------------------------------------ */}

      <section className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={<Users size={20} />}
            label="Students"
            value={currentCourse._count.enrollments}
          />

          <StatCard
            icon={<Layers3 size={20} />}
            label="Modules"
            value={totalModules}
            secondary={`${publishedModules} published`}
          />

          <StatCard
            icon={<BookOpen size={20} />}
            label="Lessons"
            value={totalLessons}
            secondary={`${publishedLessons} published`}
          />

          <StatCard
            icon={<FileText size={20} />}
            label="Learning Items"
            value={
              currentCourse._count.tests +
              currentCourse._count.assessments +
              currentCourse._count.liveClasses
            }
            secondary={`${currentCourse._count.tests} tests • ${currentCourse._count.assessments} assessments`}
          />
        </div>

        {/* -------------------------------------------------------------- */}
        {/* Main content                                                   */}
        {/* -------------------------------------------------------------- */}

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px]">
          {/* ------------------------------------------------------------ */}
          {/* Curriculum                                                   */}
          {/* ------------------------------------------------------------ */}

          <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-col justify-between gap-4 border-b border-slate-200 p-6 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-xl font-bold text-slate-950">
                  Course Curriculum
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Build the modules and lessons students will study.
                </p>
              </div>

              <form
                action={createModuleAction}
                className="flex flex-col gap-2 sm:flex-row"
              >
                <input
                  name="title"
                  required
                  placeholder="New module title"
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  <Plus size={17} />
                  Add Module
                </button>
              </form>
            </div>

            {currentCourse.modules.length === 0 ? (
              <EmptyModules courseId={currentCourse.id} />
            ) : (
              <div className="divide-y divide-slate-100">
                {currentCourse.modules.map((module, moduleIndex) => (
                  <ModuleCard
                    key={module.id}
                    courseId={currentCourse.id}
                    module={module}
                    moduleIndex={moduleIndex}
                  />
                ))}
              </div>
            )}
          </section>

          {/* ------------------------------------------------------------ */}
          {/* Sidebar                                                      */}
          {/* ------------------------------------------------------------ */}

          <aside className="space-y-5">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="font-bold text-slate-950">
                Course Information
              </h2>

              <div className="mt-5 space-y-4">
                <InfoRow
                  icon={<Clock3 size={17} />}
                  label="Duration"
                  value={
                    currentCourse.duration || "Not specified"
                  }
                />

                <InfoRow
                  icon={<GraduationCap size={17} />}
                  label="Format"
                  value={
                    currentCourse.learningFormat ||
                    "Not specified"
                  }
                />

                <InfoRow
                  icon={<Users size={17} />}
                  label="Applications"
                  value={String(
                    currentCourse._count.applications,
                  )}
                />

                <InfoRow
                  icon={<Video size={17} />}
                  label="Live Classes"
                  value={String(
                    currentCourse._count.liveClasses,
                  )}
                />

                <InfoRow
                  icon={<FileText size={17} />}
                  label="Assessments"
                  value={String(
                    currentCourse._count.assessments,
                  )}
                />

                <InfoRow
                  icon={<FileText size={17} />}
                  label="Tests"
                  value={String(
                    currentCourse._count.tests,
                  )}
                />

                <InfoRow
                  icon={<Layers3 size={17} />}
                  label="Cohorts"
                  value={String(
                    currentCourse._count.cohorts,
                  )}
                />
              </div>
            </div>

            <div className="rounded-2xl border border-blue-100 bg-blue-50 p-6">
              <h2 className="font-bold text-blue-950">
                Curriculum Status
              </h2>

              <p className="mt-2 text-sm leading-6 text-blue-800">
                Publish modules and lessons when they are ready for
                students. Unpublished content remains available only
                inside the admin area.
              </p>

              <div className="mt-5 space-y-2 text-sm font-semibold text-blue-900">
                <div className="flex justify-between">
                  <span>Modules published</span>

                  <span>
                    {publishedModules}/{totalModules}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Lessons published</span>

                  <span>
                    {publishedLessons}/{totalLessons}
                  </span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

/* -------------------------------------------------------------------------- */
/* Module Card                                                                */
/* -------------------------------------------------------------------------- */

function ModuleCard({
  courseId,
  module,
  moduleIndex,
}: {
  courseId: string;

  module: {
    id: string;
    title: string;
    description: string | null;
    displayOrder: number;
    isPublished: boolean;

    lessons: {
      id: string;
      title: string;
      slug: string;
      description: string | null;
      content: string | null;
      videoUrl: string | null;
      duration: number | null;
      displayOrder: number;
      isPublished: boolean;
    }[];
  };

  moduleIndex: number;
}) {
  const toggleModulePublishedAction =
    toggleModulePublished.bind(
      null,
      courseId,
      module.id,
    );

  const deleteModuleAction = deleteModule.bind(
    null,
    courseId,
    module.id,
  );

  const createLessonAction = createLesson.bind(
    null,
    courseId,
    module.id,
  );

  return (
    <div className="p-6">
      <div className="flex flex-col gap-5">
        {/* Module heading */}
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
          <div className="flex gap-4">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-blue-50 text-sm font-bold text-blue-700">
              {moduleIndex + 1}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-lg font-bold text-slate-950">
                  {module.title}
                </h3>

                {module.isPublished ? (
                  <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
                    Published
                  </span>
                ) : (
                  <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                    Draft
                  </span>
                )}
              </div>

              {module.description && (
                <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
                  {module.description}
                </p>
              )}

              <p className="mt-2 text-xs font-semibold text-slate-400">
                {module.lessons.length}{" "}
                {module.lessons.length === 1
                  ? "lesson"
                  : "lessons"}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <form action={toggleModulePublishedAction}>
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-100"
              >
                {module.isPublished ? (
                  <>
                    <XCircle size={15} />
                    Unpublish
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={15} />
                    Publish
                  </>
                )}
              </button>
            </form>

            <form action={deleteModuleAction}>
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50"
              >
                <Trash2 size={15} />
                Delete
              </button>
            </form>
          </div>
        </div>

        {/* Lessons */}
        <div className="ml-0 rounded-xl border border-slate-100 bg-slate-50">
          {module.lessons.length > 0 && (
            <div className="divide-y divide-slate-200">
              {module.lessons.map((lesson, index) => (
                <LessonRow
                  key={lesson.id}
                  courseId={courseId}
                  moduleId={module.id}
                  lesson={lesson}
                  index={index}
                  totalLessons={module.lessons.length}
                />
              ))}
            </div>
          )}

          {/* Add lesson */}
          <div className="border-t border-slate-200 p-4">
            <details>
              <summary className="flex cursor-pointer list-none items-center gap-2 text-sm font-bold text-blue-600">
                <Plus size={17} />
                Add Lesson
              </summary>

              <form
                action={createLessonAction}
                className="mt-5 grid gap-4"
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field
                    name="title"
                    label="Lesson title"
                    placeholder="e.g. Introduction to HTML"
                    required
                  />

                  <Field
                    name="duration"
                    label="Duration (minutes)"
                    placeholder="45"
                    type="number"
                    min="1"
                  />
                </div>

                <Field
                  name="description"
                  label="Short description"
                  placeholder="What will students learn in this lesson?"
                />

                <Field
                  name="videoUrl"
                  label="Video URL"
                  placeholder="https://..."
                />

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Lesson content
                  </label>

                  <textarea
                    name="content"
                    rows={5}
                    placeholder="Write the lesson content..."
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                  >
                    <Plus size={17} />
                    Create Lesson
                  </button>
                </div>
              </form>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Lesson Row                                                                 */
/* -------------------------------------------------------------------------- */

function LessonRow({
  courseId,
  moduleId,
  lesson,
  index,
  totalLessons,
}: {
  courseId: string;
  moduleId: string;

  lesson: {
    id: string;
    title: string;
    slug: string;
    description: string | null;
    content: string | null;
    videoUrl: string | null;
    duration: number | null;
    displayOrder: number;
    isPublished: boolean;
  };

  index: number;
  totalLessons: number;
}) {
  const toggleLessonPublishedAction =
    toggleLessonPublished.bind(
      null,
      courseId,
      moduleId,
      lesson.id,
    );

  const deleteLessonAction = deleteLesson.bind(
    null,
    courseId,
    moduleId,
    lesson.id,
  );

  return (
    <div className="flex flex-col justify-between gap-4 p-4 sm:flex-row sm:items-center">
      <div className="flex min-w-0 gap-3">
        <div className="mt-0.5 text-slate-400">
          {index === totalLessons - 1 ? (
            <ChevronRight size={17} />
          ) : (
            <ChevronDown size={17} />
          )}
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-semibold text-slate-800">
              {lesson.title}
            </p>

            {lesson.isPublished ? (
              <span className="rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-bold text-green-700">
                Published
              </span>
            ) : (
              <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                Draft
              </span>
            )}
          </div>

          {lesson.description && (
            <p className="mt-1 max-w-xl text-xs leading-5 text-slate-500">
              {lesson.description}
            </p>
          )}

          <div className="mt-1 flex flex-wrap gap-3 text-xs text-slate-400">
            {lesson.duration !== null && (
              <span>{lesson.duration} minutes</span>
            )}

            {lesson.videoUrl && (
              <span className="inline-flex items-center gap-1">
                <Video size={12} />
                Video
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <form action={toggleLessonPublishedAction}>
          <button
            type="submit"
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-100"
          >
            {lesson.isPublished
              ? "Unpublish"
              : "Publish"}
          </button>
        </form>

        <form action={deleteLessonAction}>
          <button
            type="submit"
            className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50"
          >
            <Trash2 size={14} />
            Delete
          </button>
        </form>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Empty Modules                                                              */
/* -------------------------------------------------------------------------- */

function EmptyModules({
  courseId,
}: {
  courseId: string;
}) {
  const createModuleAction = createModule.bind(
    null,
    courseId,
  );

  return (
    <div className="px-6 py-20 text-center">
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-blue-50 text-blue-600">
        <Layers3 size={30} />
      </div>

      <h3 className="mt-5 text-lg font-bold text-slate-950">
        No modules yet
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        Start building this course by creating its first module.
      </p>

      <form
        action={createModuleAction}
        className="mx-auto mt-6 flex max-w-md gap-2"
      >
        <input
          name="title"
          required
          placeholder="First module title"
          className="min-w-0 flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />

        <button
          type="submit"
          className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          <Plus size={17} />
          Add
        </button>
      </form>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Stat Card                                                                  */
/* -------------------------------------------------------------------------- */

function StatCard({
  icon,
  label,
  value,
  secondary,
}: {
  icon: ReactNode;
  label: string;
  value: number;
  secondary?: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-blue-600">
          {icon}
        </div>
      </div>

      <p className="mt-4 text-sm font-medium text-slate-500">
        {label}
      </p>

      <p className="mt-1 text-3xl font-bold tracking-tight text-slate-950">
        {value}
      </p>

      {secondary && (
        <p className="mt-1 text-xs font-semibold text-slate-400">
          {secondary}
        </p>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Info Row                                                                   */
/* -------------------------------------------------------------------------- */

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex min-w-0 items-center gap-3">
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-slate-100 text-slate-500">
          {icon}
        </div>

        <span className="text-sm font-medium text-slate-600">
          {label}
        </span>
      </div>

      <span className="text-right text-sm font-semibold text-slate-900">
        {value}
      </span>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Field                                                                      */
/* -------------------------------------------------------------------------- */

function Field({
  name,
  label,
  placeholder,
  type = "text",
  required = false,
  min,
}: {
  name: string;
  label: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
  min?: string;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block text-sm font-semibold text-slate-700"
      >
        {label}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        required={required}
        min={min}
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Status Badge                                                               */
/* -------------------------------------------------------------------------- */

function StatusBadge({
  status,
}: {
  status: string;
}) {
  const normalized = status.toUpperCase();

  if (
    normalized === "PUBLISHED" ||
    normalized === "ACTIVE"
  ) {
    return (
      <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-700">
        {formatStatus(status)}
      </span>
    );
  }

  if (
    normalized === "DRAFT" ||
    normalized === "PENDING"
  ) {
    return (
      <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">
        {formatStatus(status)}
      </span>
    );
  }

  return (
    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
      {formatStatus(status)}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/* Formatting                                                                 */
/* -------------------------------------------------------------------------- */

function formatStatus(value: string) {
  return value
    .toLowerCase()
    .split("_")
    .map(
      (part) =>
        part.charAt(0).toUpperCase() +
        part.slice(1),
    )
    .join(" ");
}