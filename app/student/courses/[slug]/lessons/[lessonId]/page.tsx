import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { getCurrentUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";

import { completeLesson } from "./actions";

type Props = {
  params: Promise<{
    slug: string;
    lessonId: string;
  }>;
};

export default async function StudentLessonPage({
  params,
}: Props) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "STUDENT") {
    redirect("/admin");
  }

  const { slug, lessonId } = await params;

  const enrollment = await prisma.enrollment.findFirst({
    where: {
      studentId: user.id,
      course: {
        slug,
      },
    },
    include: {
      course: {
        include: {
          modules: {
            where: {
              isPublished: true,
            },
            orderBy: {
              displayOrder: "asc",
            },
            include: {
              lessons: {
                where: {
                  isPublished: true,
                },
                orderBy: {
                  displayOrder: "asc",
                },
              },
            },
          },
        },
      },

      lessonProgress: true,
    },
  });

  if (!enrollment) {
    notFound();
  }

  const course = enrollment.course;

  const lesson = course.modules
    .flatMap((module) =>
      module.lessons.map((item) => ({
        lesson: item,
        module,
      })),
    )
    .find((item) => item.lesson.id === lessonId);

  if (!lesson) {
    notFound();
  }

  const currentLesson = lesson.lesson;
  const currentModule = lesson.module;

  const completed = enrollment.lessonProgress.some(
    (item) =>
      item.lessonId === currentLesson.id &&
      item.completed,
  );

  const allLessons = course.modules.flatMap(
    (module) => module.lessons,
  );

  const currentIndex = allLessons.findIndex(
    (item) => item.id === currentLesson.id,
  );

  const previousLesson =
    currentIndex > 0
      ? allLessons[currentIndex - 1]
      : null;

  const nextLesson =
    currentIndex < allLessons.length - 1
      ? allLessons[currentIndex + 1]
      : null;

  return (
    <main className="min-h-screen bg-slate-100">
      {/* TOP BAR */}
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 lg:px-8">
          <Link
            href={`/student/courses/${course.slug}`}
            className="text-sm font-semibold text-blue-600"
          >
            ← Course Content
          </Link>

          <div className="hidden max-w-md truncate text-sm font-semibold text-slate-700 sm:block">
            {course.title}
          </div>

          <Link
            href="/student/dashboard"
            className="text-sm font-semibold text-slate-600"
          >
            Dashboard
          </Link>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-8 lg:grid-cols-[1fr_340px] lg:px-8">
        {/* LESSON */}
        <article>
          <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
            {/* VIDEO */}
            {currentLesson.videoUrl ? (
              <div className="aspect-video overflow-hidden rounded-t-3xl bg-black">
                <iframe
                  src={currentLesson.videoUrl}
                  title={currentLesson.title}
                  className="h-full w-full"
                  allowFullScreen
                />
              </div>
            ) : (
              <div className="flex aspect-video items-center justify-center rounded-t-3xl bg-slate-950">
                <div className="text-center">
                  <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-blue-600 text-2xl font-bold text-white">
                    ▶
                  </div>

                  <p className="mt-4 text-sm text-slate-400">
                    Lesson content
                  </p>
                </div>
              </div>
            )}

            <div className="p-7 sm:p-10">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-600">
                {currentModule.title}
              </p>

              <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
                {currentLesson.title}
              </h1>

              {currentLesson.description && (
                <p className="mt-4 text-lg leading-8 text-slate-500">
                  {currentLesson.description}
                </p>
              )}

              {currentLesson.content ? (
                <div className="mt-8 whitespace-pre-line text-base leading-8 text-slate-700">
                  {currentLesson.content}
                </div>
              ) : (
                <div className="mt-8 rounded-2xl bg-slate-50 p-6 text-sm text-slate-500">
                  Your instructor has not added written content to this lesson
                  yet.
                </div>
              )}

              {/* COMPLETE LESSON */}
              <div className="mt-10 border-t border-slate-100 pt-7">
                {completed ? (
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <p className="font-bold text-green-700">
                        ✓ Lesson completed
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        Your learning progress has been saved.
                      </p>
                    </div>

                    {nextLesson && (
                      <Link
                        href={`/student/courses/${course.slug}/lessons/${nextLesson.id}`}
                        className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
                      >
                        Next Lesson →
                      </Link>
                    )}
                  </div>
                ) : (
                  <form
                    action={completeLesson.bind(
                      null,
                      enrollment.id,
                      currentLesson.id,
                      course.id,
                    )}
                  >
                    <button
                      type="submit"
                      className="w-full rounded-xl bg-blue-600 px-5 py-3.5 font-semibold text-white hover:bg-blue-700 sm:w-auto"
                    >
                      Mark Lesson as Complete →
                    </button>
                  </form>
                )}
              </div>

              {/* PREVIOUS / NEXT */}
              <div className="mt-7 flex flex-wrap justify-between gap-3 border-t border-slate-100 pt-6">
                {previousLesson ? (
                  <Link
                    href={`/student/courses/${course.slug}/lessons/${previousLesson.id}`}
                    className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    ← Previous
                  </Link>
                ) : (
                  <span />
                )}

                {nextLesson && completed && (
                  <Link
                    href={`/student/courses/${course.slug}/lessons/${nextLesson.id}`}
                    className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Next →
                  </Link>
                )}
              </div>
            </div>
          </div>
        </article>

        {/* SIDEBAR */}
        <aside className="h-fit overflow-hidden rounded-3xl border border-slate-200 bg-white lg:sticky lg:top-24">
          <div className="border-b border-slate-100 p-6">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-600">
              Course Content
            </p>

            <h2 className="mt-2 font-bold text-slate-950">
              {course.title}
            </h2>
          </div>

          <div className="max-h-[70vh] overflow-y-auto">
            {course.modules.map((module, moduleIndex) => (
              <div key={module.id}>
                <div className="bg-slate-50 px-5 py-4">
                  <p className="text-xs font-bold text-slate-400">
                    MODULE {moduleIndex + 1}
                  </p>

                  <p className="mt-1 text-sm font-bold text-slate-900">
                    {module.title}
                  </p>
                </div>

                <div>
                  {module.lessons.map((item) => {
                    const isCurrent =
                      item.id === currentLesson.id;

                    const isCompleted =
                      enrollment.lessonProgress.some(
                        (progress) =>
                          progress.lessonId === item.id &&
                          progress.completed,
                      );

                    return (
                      <Link
                        key={item.id}
                        href={`/student/courses/${course.slug}/lessons/${item.id}`}
                        className={`flex items-center gap-3 border-b border-slate-100 px-5 py-4 text-sm ${
                          isCurrent
                            ? "bg-blue-50 text-blue-700"
                            : "text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        <span
                          className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-bold ${
                            isCompleted
                              ? "bg-green-100 text-green-700"
                              : isCurrent
                                ? "bg-blue-600 text-white"
                                : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {isCompleted ? "✓" : "▶"}
                        </span>

                        <span className="min-w-0 flex-1">
                          {item.title}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </main>
  );
}