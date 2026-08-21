import Link from "next/link";
import { redirect, notFound } from "next/navigation";
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

  /*
   * Keep a non-null reference after the notFound() check.
   * This prevents TypeScript from treating course as possibly null.
   */
  const currentCourse = course;

  const totalModules = currentCourse.modules.length;

  const totalLessons = currentCourse.modules.reduce(
    (total, module) => total + module.lessons.length,
    0
  );

  const publishedModules = currentCourse.modules.filter(
    (module) => module.isPublished
  ).length;

  const publishedLessons = currentCourse.modules.reduce(
    (total, module) =>
      total +
      module.lessons.filter((lesson) => lesson.isPublished).length,
    0
  );

  /*
   * React's native <form action=""> expects an action that returns
   * void or Promise<void>.
   *
   * Our server actions return CourseManagementResult.
   * These wrappers await the server action without returning its result.
   */

  async function handleCreateModule(formData: FormData): Promise<void> {
    await createModule(currentCourse.id, formData);
  }

  return (
    <main className="min-h-screen bg-slate-50">
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
                {currentCourse.shortDescription}
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

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px]">
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
                action={handleCreateModule}
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
                  value={String(currentCourse._count.applications)}
                />

                <InfoRow
                  icon={<Video size={17} />}
                  label="Live Classes"
                  value={String(currentCourse._count.liveClasses)}
                />

                <InfoRow
                  icon={<FileText size={17} />}
                  label="Assessments"
                  value={String(currentCourse._count.assessments)}
                />

                <InfoRow
                  icon={<FileText size={17} />}
                  label="Tests"
                  value={String(currentCourse._count.tests)}
                />

                <InfoRow
                  icon={<Layers3 size={17} />}
                  label="Cohorts"
                  value={String(currentCourse._count.cohorts)}
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
  async function handleToggleModulePublished(): Promise<void> {
    await toggleModulePublished(courseId, module.id);
  }

  async function handleDeleteModule(): Promise<void> {
    await deleteModule(courseId, module.id);
  }

  async function handleCreateLesson(
    formData: FormData
  ): Promise<void> {
    await createLesson(courseId, module.id, formData);
  }

  return (
    <div className="p-6">
      <div className="flex flex-col gap-5">
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
            <form action={handleToggleModulePublished}>
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
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

            <form action={handleDeleteModule}>
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50"
              >
                <Trash2 size={15} />
                Delete
              </button>
            </form>
          </div>
        </div>

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

          <div className="border-t border-slate-200 p-4">
            <details>
              <summary className="flex cursor-pointer list-none items-center gap-2 text-sm font-bold text-blue-600">
                <Plus size={17} />
                Add Lesson
              </summary>

              <form
                action={handleCreateLesson}
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
  async function handleToggleLessonPublished(): Promise<void> {
    await toggleLessonPublished(courseId, moduleId, lesson.id);
  }

  async function handleDeleteLesson(): Promise<void> {
    await deleteLesson(courseId, moduleId, lesson.id);
  }

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
        <form action={handleToggleLessonPublished}>
          <button
            type="submit"
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-100"
          >
            {lesson.isPublished ? "Unpublish" : "Publish"}
          </button>
        </form>

        <form action={handleDeleteLesson}>
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

function EmptyModules({
  courseId,
}: {
  courseId: string;
}) {
  async function handleCreateModule(
    formData: FormData
  ): Promise<void> {
    await createModule(courseId, formData);
  }

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
        action={handleCreateModule}
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
      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </label>

      <input
        name={name}
        type={type}
        min={min}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />
    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-2 text-sm text-slate-500">
        {icon}
        {label}
      </div>

      <span className="text-right text-sm font-semibold text-slate-800">
        {value}
      </span>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  secondary,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  secondary?: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-blue-600">
        {icon}
      </div>

      <p className="mt-5 text-3xl font-bold tracking-tight text-slate-950">
        {value}
      </p>

      <p className="mt-1 text-sm font-semibold text-slate-900">
        {label}
      </p>

      {secondary && (
        <p className="mt-1 text-xs text-slate-400">
          {secondary}
        </p>
      )}
    </div>
  );
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