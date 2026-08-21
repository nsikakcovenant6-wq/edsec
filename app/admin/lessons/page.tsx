import Link from "next/link";
import { redirect } from "next/navigation";
import {
  BookOpen,
  CheckCircle2,
  Clock3,
  FileText,
  Filter,
  Layers3,
  Pencil,
  Plus,
  Search,
  Video,
  XCircle,
} from "lucide-react";

import { prisma } from "@/app/lib/prisma";
import { requireRole } from "@/app/lib/auth";

export default async function AdminLessonsPage({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string;
    courseId?: string;
    moduleId?: string;
    status?: string;
  }>;
}) {
  const admin = await requireRole("ADMIN");

  if (!admin) {
    redirect("/login");
  }

  const params = await searchParams;

  const search = params.search?.trim() ?? "";
  const courseId = params.courseId ?? "";
  const moduleId = params.moduleId ?? "";
  const status = params.status ?? "";

  const [courses, modules, lessons] = await Promise.all([
    prisma.course.findMany({
      orderBy: {
        title: "asc",
      },
      select: {
        id: true,
        title: true,
      },
    }),

    prisma.courseModule.findMany({
      where: courseId
        ? {
            courseId,
          }
        : undefined,
      orderBy: [
        {
          courseId: "asc",
        },
        {
          displayOrder: "asc",
        },
      ],
      select: {
        id: true,
        title: true,
        courseId: true,
        course: {
          select: {
            title: true,
          },
        },
      },
    }),

    prisma.lesson.findMany({
      where: {
        ...(search
          ? {
              OR: [
                {
                  title: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
                {
                  description: {
                    contains: search,
                    mode: "insensitive",
                  },
              },
            ],
            }
          : {}),

        ...(moduleId
          ? {
              moduleId,
            }
          : {}),

        ...(courseId
          ? {
              module: {
                courseId,
              },
            }
          : {}),

        ...(status === "published"
          ? {
              isPublished: true,
            }
          : status === "draft"
            ? {
                isPublished: false,
              }
            : {}),
      },

      orderBy: [
        {
          module: {
            courseId: "asc",
          },
        },
        {
          moduleId: "asc",
        },
        {
          displayOrder: "asc",
        },
      ],

      include: {
        module: {
          select: {
            id: true,
            title: true,
            courseId: true,
            course: {
              select: {
                id: true,
                title: true,
              },
            },
          },
        },
      },
    }),
  ]);

  const publishedCount = lessons.filter(
    (lesson) => lesson.isPublished
  ).length;

  const draftCount = lessons.length - publishedCount;

  const totalDuration = lessons.reduce(
    (total, lesson) =>
      total + (lesson.duration ?? 0),
    0
  );

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-6 lg:px-8">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-blue-700">
                  Admin
                </span>

                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                  Lessons
                </span>
              </div>

              <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
                Lessons
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                Manage lessons across all EDSEC courses.
              </p>
            </div>

            <Link
              href="/admin/lessons/new"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
            >
              <Plus size={18} />
              Create Lesson
            </Link>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={<BookOpen size={20} />}
            label="Total Lessons"
            value={lessons.length}
          />

          <StatCard
            icon={<CheckCircle2 size={20} />}
            label="Published"
            value={publishedCount}
          />

          <StatCard
            icon={<XCircle size={20} />}
            label="Drafts"
            value={draftCount}
          />

          <StatCard
            icon={<Clock3 size={20} />}
            label="Total Duration"
            value={formatDuration(totalDuration)}
          />
        </div>

        {/* Filters */}
        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <Filter size={18} className="text-blue-600" />

            <h2 className="font-bold text-slate-950">
              Filter Lessons
            </h2>
          </div>

          <form
            method="GET"
            className="grid gap-3 lg:grid-cols-[1.5fr_1fr_1fr_180px_auto]"
          >
            <div className="relative">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                name="search"
                defaultValue={search}
                placeholder="Search lessons..."
                className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <select
              name="courseId"
              defaultValue={courseId}
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="">All courses</option>

              {courses.map((course) => (
                <option
                  key={course.id}
                  value={course.id}
                >
                  {course.title}
                </option>
              ))}
            </select>

            <select
              name="moduleId"
              defaultValue={moduleId}
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="">All modules</option>

              {modules.map((module) => (
                <option
                  key={module.id}
                  value={module.id}
                >
                  {module.title}
                </option>
              ))}
            </select>

            <select
              name="status"
              defaultValue={status}
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="">All statuses</option>
              <option value="published">
                Published
              </option>
              <option value="draft">Draft</option>
            </select>

            <button
              type="submit"
              className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Apply
            </button>
          </form>

          {(search ||
            courseId ||
            moduleId ||
            status) && (
            <div className="mt-4">
              <Link
                href="/admin/lessons"
                className="text-sm font-semibold text-blue-600 hover:text-blue-700"
              >
                Clear filters
              </Link>
            </div>
          )}
        </section>

        {/* Lessons */}
        <section className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 p-6">
            <h2 className="text-xl font-bold text-slate-950">
              Lesson Library
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {lessons.length} lesson
              {lessons.length === 1 ? "" : "s"} found.
            </p>
          </div>

          {lessons.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="divide-y divide-slate-100">
              {lessons.map((lesson, index) => (
                <LessonRow
                  key={lesson.id}
                  lesson={lesson}
                  index={index}
                />
              ))}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}

function LessonRow({
  lesson,
  index,
}: {
  lesson: {
    id: string;
    title: string;
    description: string | null;
    videoUrl: string | null;
    content: string | null;
    duration: number | null;
    displayOrder: number;
    isPublished: boolean;
    module: {
      id: string;
      title: string;
      courseId: string;
      course: {
        id: string;
        title: string;
      };
    };
  };
  index: number;
}) {
  return (
    <div className="flex flex-col gap-5 p-5 transition hover:bg-slate-50 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex min-w-0 gap-4">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-blue-50 text-sm font-bold text-blue-700">
          {index + 1}
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-bold text-slate-900">
              {lesson.title}
            </h3>

            {lesson.isPublished ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 text-[10px] font-bold text-green-700">
                <CheckCircle2 size={12} />
                Published
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-600">
                <XCircle size={12} />
                Draft
              </span>
            )}
          </div>

          <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-400">
            <span className="inline-flex items-center gap-1">
              <Layers3 size={12} />
              {lesson.module.title}
            </span>

            <span>
              {lesson.module.course.title}
            </span>
          </div>

          {lesson.description && (
            <p className="mt-2 line-clamp-2 max-w-2xl text-sm leading-6 text-slate-500">
              {lesson.description}
            </p>
          )}

          <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-400">
            {lesson.duration != null && (
              <span className="inline-flex items-center gap-1">
                <Clock3 size={13} />
                {lesson.duration} min
              </span>
            )}

            {lesson.videoUrl && (
              <span className="inline-flex items-center gap-1">
                <Video size={13} />
                Video
              </span>
            )}

            {lesson.content && (
              <span className="inline-flex items-center gap-1">
                <FileText size={13} />
                Content
              </span>
            )}

            <span>
              Order: {lesson.displayOrder}
            </span>
          </div>
        </div>
      </div>

      <div className="flex shrink-0 flex-wrap gap-2">
        <Link
          href={`/admin/lessons/${lesson.id}`}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
        >
          <Pencil size={14} />
          Manage
        </Link>
      </div>
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
        No lessons found
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        Try changing your filters or create the first lesson.
      </p>

      <Link
        href="/admin/lessons/new"
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
      >
        <Plus size={17} />
        Create Lesson
      </Link>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-blue-600">
        {icon}
      </div>

      <p className="mt-5 text-2xl font-bold tracking-tight text-slate-950">
        {value}
      </p>

      <p className="mt-1 text-sm font-semibold text-slate-900">
        {label}
      </p>
    </div>
  );
}

function formatDuration(minutes: number) {
  if (!minutes) {
    return "0 min";
  }

  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;

  if (hours === 0) {
    return `${minutes} min`;
  }

  if (remaining === 0) {
    return `${hours} hr`;
  }

  return `${hours} hr ${remaining} min`;
}