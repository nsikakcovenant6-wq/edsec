/* eslint-disable @next/next/no-assign-module-variable */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Clock3,
  Edit3,
  FileText,
  Layers3,
  PlayCircle,
  Users,
  Video,
  XCircle,
} from "lucide-react";

import { prisma } from "@/app/lib/prisma";
import { requireRole } from "@/app/lib/auth";

import ModuleActions from "./ModuleActions";

export default async function AdminModuleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const admin = await requireRole("ADMIN");

  if (!admin) {
    redirect("/login");
  }

  const { id } = await params;

  const module = await prisma.courseModule.findUnique({
    where: {
      id,
    },
    include: {
      course: {
        select: {
          id: true,
          title: true,
          slug: true,
          status: true,
        },
      },
      lessons: {
        orderBy: {
          displayOrder: "asc",
        },
      },
      _count: {
        select: {
          lessons: true,
        },
      },
    },
  });

  if (!module) {
    notFound();
  }

  const publishedLessons = module.lessons.filter(
    (lesson) => lesson.isPublished
  ).length;

  const totalDuration = module.lessons.reduce(
    (total, lesson) => total + (lesson.duration ?? 0),
    0
  );

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-6 lg:px-8">
          <Link
            href="/admin/modules"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-blue-600"
          >
            <ArrowLeft size={17} />
            Back to Modules
          </Link>

          <div className="mt-6 flex flex-col justify-between gap-6 lg:flex-row lg:items-start">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-blue-700">
                  Module
                </span>

                {module.isPublished ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                    <CheckCircle2 size={13} />
                    Published
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                    <XCircle size={13} />
                    Draft
                  </span>
                )}
              </div>

              <h1 className="mt-3 wrap-break-word text-3xl font-bold tracking-tight text-slate-950">
                {module.title}
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                Course:{" "}
                <Link
                  href={`/admin/courses/${module.course.id}`}
                  className="font-semibold text-blue-600 hover:text-blue-700"
                >
                  {module.course.title}
                </Link>
              </p>

              {module.description && (
                <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">
                  {module.description}
                </p>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              <Link
                href={`/admin/courses/${module.course.id}`}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
              >
                <Layers3 size={17} />
                View Course
              </Link>

              <Link
                href={`/courses/${module.course.slug}`}
                target="_blank"
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
              >
                <PlayCircle size={17} />
                Public Course
              </Link>
            </div>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
        {/* Statistics */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={<BookOpen size={20} />}
            label="Lessons"
            value={module._count.lessons}
            secondary={`${publishedLessons} published`}
          />

          <StatCard
            icon={<Clock3 size={20} />}
            label="Total Duration"
            value={formatDuration(totalDuration)}
            secondary="Across all lessons"
          />

          <StatCard
            icon={<CheckCircle2 size={20} />}
            label="Published"
            value={`${publishedLessons}/${module._count.lessons}`}
            secondary="Lessons published"
          />

          <StatCard
            icon={<Layers3 size={20} />}
            label="Module Order"
            value={String(module.displayOrder)}
            secondary="Curriculum position"
          />
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px]">
          {/* Lessons */}
          <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-col justify-between gap-4 border-b border-slate-200 p-6 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-xl font-bold text-slate-950">
                  Lessons
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Lessons belonging to this module.
                </p>
              </div>

              <Link
                href={`/admin/lessons?moduleId=${module.id}`}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                <BookOpen size={17} />
                Manage Lessons
              </Link>
            </div>

            {module.lessons.length === 0 ? (
              <div className="px-6 py-20 text-center">
                <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-blue-50 text-blue-600">
                  <BookOpen size={30} />
                </div>

                <h3 className="mt-5 text-lg font-bold text-slate-950">
                  No lessons yet
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                  This module does not have any lessons yet. Add
                  lessons from the lesson management section.
                </p>

                <Link
                  href={`/admin/lessons?moduleId=${module.id}`}
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  <BookOpen size={17} />
                  Add First Lesson
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {module.lessons.map((lesson, index) => (
                  <div
                    key={lesson.id}
                    className="flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-center"
                  >
                    <div className="flex min-w-0 gap-4">
                      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-slate-100 text-sm font-bold text-slate-600">
                        {index + 1}
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-semibold text-slate-900">
                            {lesson.title}
                          </h3>

                          {lesson.isPublished ? (
                            <span className="rounded-full bg-green-50 px-2.5 py-1 text-[10px] font-bold text-green-700">
                              Published
                            </span>
                          ) : (
                            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-600">
                              Draft
                            </span>
                          )}
                        </div>

                        {lesson.description && (
                          <p className="mt-1 line-clamp-2 text-sm leading-6 text-slate-500">
                            {lesson.description}
                          </p>
                        )}

                        <div className="mt-2 flex flex-wrap gap-4 text-xs text-slate-400">
                          {lesson.duration != null && (
                            <span className="inline-flex items-center gap-1">
                              <Clock3 size={13} />
                              {lesson.duration} minutes
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
                        </div>
                      </div>
                    </div>

                    <Link
                      href={`/admin/lessons/${lesson.id}`}
                      className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                      <Edit3 size={14} />
                      Manage
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Sidebar */}
          <aside className="space-y-5">
            <ModuleActions
              moduleId={module.id}
              courseId={module.course.id}
              title={module.title}
              description={module.description}
              isPublished={module.isPublished}
            />

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="font-bold text-slate-950">
                Module Information
              </h2>

              <div className="mt-5 space-y-4">
                <InfoRow
                  icon={<Layers3 size={17} />}
                  label="Course"
                  value={module.course.title}
                />

                <InfoRow
                  icon={<BookOpen size={17} />}
                  label="Lessons"
                  value={String(module._count.lessons)}
                />

                <InfoRow
                  icon={<CheckCircle2 size={17} />}
                  label="Published Lessons"
                  value={String(publishedLessons)}
                />

                <InfoRow
                  icon={<Clock3 size={17} />}
                  label="Total Duration"
                  value={formatDuration(totalDuration)}
                />

                <InfoRow
                  icon={<Layers3 size={17} />}
                  label="Display Order"
                  value={String(module.displayOrder)}
                />
              </div>
            </div>

            <div className="rounded-2xl border border-blue-100 bg-blue-50 p-6">
              <h2 className="font-bold text-blue-950">
                Publishing
              </h2>

              <p className="mt-2 text-sm leading-6 text-blue-800">
                Published modules can be made available to students
                as part of the public course curriculum.
              </p>

              <div className="mt-4">
                {module.isPublished ? (
                  <div className="inline-flex items-center gap-2 rounded-lg bg-green-100 px-3 py-2 text-xs font-semibold text-green-700">
                    <CheckCircle2 size={14} />
                    Module is published
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-2 rounded-lg bg-amber-100 px-3 py-2 text-xs font-semibold text-amber-700">
                    <XCircle size={14} />
                    Module is currently a draft
                  </div>
                )}
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

function formatDuration(minutes: number) {
  if (!minutes) {
    return "0 min";
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours === 0) {
    return `${minutes} min`;
  }

  if (remainingMinutes === 0) {
    return `${hours} hr`;
  }

  return `${hours} hr ${remainingMinutes} min`;
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
    <div className="flex items-start justify-between gap-4">
      <div className="flex items-center gap-2 text-sm text-slate-500">
        {icon}
        <span>{label}</span>
      </div>

      <span className="max-w-45 text-right text-sm font-semibold text-slate-800">
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
  value: string | number;
  secondary?: string;
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

      {secondary && (
        <p className="mt-1 text-xs text-slate-400">
          {secondary}
        </p>
      )}
    </div>
  );
}