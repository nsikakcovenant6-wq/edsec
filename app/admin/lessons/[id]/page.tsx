import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Clock3,
  FileText,
  GraduationCap,
  Save,
  Trash2,
  Video,
  XCircle,
} from "lucide-react";

import { prisma } from "@/app/lib/prisma";
import { requireRole } from "@/app/lib/auth";

import {
  deleteLesson,
  toggleLessonPublished,
  updateLesson,
} from "../actions";

export default async function AdminLessonManagementPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const admin = await requireRole("ADMIN");

  if (!admin) {
    redirect("/login");
  }

  const { id } = await params;

  const result = await prisma.lesson.findUnique({
    where: {
      id,
    },
    include: {
      module: {
        include: {
          course: {
            select: {
              id: true,
              title: true,
              slug: true,
            },
          },
        },
      },
    },
  });

  if (!result) {
    notFound();
  }

  // Explicitly narrow Prisma's nullable result.
  const lesson = result;

  const updateLessonAction = async (formData: FormData): Promise<void> => {
    await updateLesson(lesson.id, formData);
  };

  const togglePublishedAction = async (): Promise<void> => {
    await toggleLessonPublished(lesson.id);
  };

  const deleteLessonAction = async (): Promise<void> => {
    await deleteLesson(lesson.id);
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-5 py-6 lg:px-8">
          <Link
            href="/admin/lessons"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-blue-600"
          >
            <ArrowLeft size={17} />
            Back to Lessons
          </Link>

          <div className="mt-5 flex flex-col justify-between gap-5 lg:flex-row lg:items-start">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-blue-700">
                  Lesson Management
                </span>

                {lesson.isPublished ? (
                  <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                    Published
                  </span>
                ) : (
                  <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                    Draft
                  </span>
                )}
              </div>

              <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
                {lesson.title}
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                {lesson.module.course.title} / {lesson.module.title}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Link
                href={`/admin/courses/${lesson.module.course.id}`}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
              >
                <BookOpen size={17} />
                Course
              </Link>

              <form action={togglePublishedAction}>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  {lesson.isPublished ? (
                    <>
                      <XCircle size={17} />
                      Unpublish
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={17} />
                      Publish
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-5 py-8 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 p-6">
              <h2 className="text-xl font-bold text-slate-950">
                Lesson Details
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Update the lesson information and learning content.
              </p>
            </div>

            <form action={updateLessonAction} className="space-y-6 p-6">
              <div className="grid gap-5 sm:grid-cols-2">
                <Field
                  name="title"
                  label="Lesson title"
                  defaultValue={lesson.title}
                  required
                />

                <Field
                  name="duration"
                  label="Duration (minutes)"
                  type="number"
                  min="1"
                  defaultValue={
                    lesson.duration
                      ? String(lesson.duration)
                      : ""
                  }
                />
              </div>

              <Field
                name="description"
                label="Short description"
                defaultValue={lesson.description ?? ""}
                placeholder="What will students learn in this lesson?"
              />

              <Field
                name="videoUrl"
                label="Video URL"
                defaultValue={lesson.videoUrl ?? ""}
                placeholder="https://..."
              />

              <div>
                <label
                  htmlFor="content"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Lesson content
                </label>

                <textarea
                  id="content"
                  name="content"
                  rows={12}
                  defaultValue={lesson.content ?? ""}
                  placeholder="Write the lesson content here..."
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div className="flex flex-wrap gap-3 border-t border-slate-100 pt-5">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  <Save size={17} />
                  Save Changes
                </button>

                <Link
                  href="/admin/lessons"
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Cancel
                </Link>
              </div>
            </form>
          </section>

          <aside className="space-y-5">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="font-bold text-slate-950">
                Lesson Information
              </h2>

              <div className="mt-5 space-y-5">
                <InfoRow
                  icon={<BookOpen size={17} />}
                  label="Course"
                  value={lesson.module.course.title}
                />

                <InfoRow
                  icon={<GraduationCap size={17} />}
                  label="Module"
                  value={lesson.module.title}
                />

                <InfoRow
                  icon={<Clock3 size={17} />}
                  label="Duration"
                  value={
                    lesson.duration
                      ? `${lesson.duration} minutes`
                      : "Not specified"
                  }
                />

                <InfoRow
                  icon={<Video size={17} />}
                  label="Video"
                  value={
                    lesson.videoUrl
                      ? "Available"
                      : "Not added"
                  }
                />

                <InfoRow
                  icon={<FileText size={17} />}
                  label="Content"
                  value={
                    lesson.content
                      ? "Available"
                      : "Not added"
                  }
                />

                <InfoRow
                  icon={
                    lesson.isPublished ? (
                      <CheckCircle2 size={17} />
                    ) : (
                      <XCircle size={17} />
                    )
                  }
                  label="Status"
                  value={
                    lesson.isPublished
                      ? "Published"
                      : "Draft"
                  }
                />
              </div>
            </div>

            <div className="rounded-2xl border border-red-100 bg-red-50 p-6">
              <h2 className="font-bold text-red-950">
                Danger Zone
              </h2>

              <p className="mt-2 text-sm leading-6 text-red-800">
                Deleting this lesson permanently removes it from
                the course curriculum.
              </p>

              <form
                action={deleteLessonAction}
                className="mt-5"
              >
                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
                >
                  <Trash2 size={17} />
                  Delete Lesson
                </button>
              </form>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

function Field({
  name,
  label,
  defaultValue,
  placeholder,
  type = "text",
  required = false,
  min,
}: {
  name: string;
  label: string;
  defaultValue?: string;
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
        min={min}
        defaultValue={defaultValue}
        placeholder={placeholder}
        required={required}
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
    <div className="flex items-start justify-between gap-4">
      <div className="flex items-center gap-2 text-sm text-slate-500">
        {icon}
        <span>{label}</span>
      </div>

      <span className="max-w-42.5 text-right text-sm font-semibold text-slate-800">
        {value}
      </span>
    </div>
  );
}