import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/app/lib/prisma";
import { getCurrentUser } from "@/app/lib/auth";

type LessonPageProps = {
  params: Promise<{
    slug: string;
    lessonId: string;
  }>;
};

export default async function LessonPage({
  params,
}: LessonPageProps) {
  const { slug, lessonId } = await params;

  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "STUDENT") {
    redirect("/admin");
  }

  const course = await prisma.course.findUnique({
    where: {
      slug,
    },
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
  });

  if (!course) {
    notFound();
  }

  const lesson = await prisma.lesson.findFirst({
    where: {
      id: lessonId,
      module: {
        courseId: course.id,
      },
      isPublished: true,
    },
    include: {
      module: true,
    },
  });

  if (!lesson) {
    notFound();
  }

  const enrollment = await prisma.enrollment.findUnique({
    where: {
      studentId_courseId: {
        studentId: user.id,
        courseId: course.id,
      },
    },
  });

  if (!enrollment) {
    redirect(`/student/courses/${course.slug}`);
  }

  const lessonProgress = await prisma.lessonProgress.findUnique({
    where: {
      enrollmentId_lessonId: {
        enrollmentId: enrollment.id,
        lessonId: lesson.id,
      },
    },
  });

  const allLessons = course.modules.flatMap(
    (module) => module.lessons
  );

  const currentIndex = allLessons.findIndex(
    (item) => item.id === lesson.id
  );

  const previousLesson =
    currentIndex > 0
      ? allLessons[currentIndex - 1]
      : null;

  const nextLesson =
    currentIndex >= 0 &&
    currentIndex < allLessons.length - 1
      ? allLessons[currentIndex + 1]
      : null;

  const completedLessons = await prisma.lessonProgress.count({
    where: {
      enrollmentId: enrollment.id,
      completed: true,
      lesson: {
        module: {
          courseId: course.id,
        },
      },
    },
  });

  const totalLessons = allLessons.length;

  const calculatedProgress =
    totalLessons > 0
      ? Math.min(
          100,
          Math.round((completedLessons / totalLessons) * 100)
        )
      : 0;

  const lessonNumber = currentIndex + 1;

  return (
    <main className="min-h-screen bg-slate-50">
      {/* HEADER */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto max-w-7xl px-5 py-4 lg:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <Link
                href={`/student/courses/${course.slug}`}
                className="text-sm font-semibold text-blue-600 hover:text-blue-700"
              >
                ← Back to Course
              </Link>

              <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-slate-500">
                <span>{course.title}</span>
                <span>•</span>
                <span>Lesson {lessonNumber}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-sm text-slate-500">
                Progress
              </div>

              <div className="w-28">
                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-blue-600 transition-all"
                    style={{
                      width: `${calculatedProgress}%`,
                    }}
                  />
                </div>
              </div>

              <span className="text-sm font-bold text-slate-900">
                {calculatedProgress}%
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-8 lg:grid-cols-[1fr_320px] lg:px-8">
        {/* LESSON */}
        <section>
          <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            {/* LESSON HEADER */}
            <div className="border-b border-slate-200 p-7 sm:p-9">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-700">
                  {lesson.module.title}
                </span>

                <span className="text-sm text-slate-400">
                  Lesson {lessonNumber} of {totalLessons}
                </span>
              </div>

              <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                {lesson.title}
              </h1>

              {lesson.description && (
                <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
                  {lesson.description}
                </p>
              )}

              <div className="mt-5 flex flex-wrap gap-3">
                {lesson.duration && (
                  <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-600">
                    {lesson.duration} minutes
                  </span>
                )}

                {lessonProgress?.completed && (
                  <span className="rounded-full bg-green-50 px-4 py-2 text-sm font-semibold text-green-700">
                    ✓ Completed
                  </span>
                )}
              </div>
            </div>

            {/* VIDEO */}
            {lesson.videoUrl && (
              <div className="bg-slate-950 p-5 sm:p-7">
                <div className="aspect-video overflow-hidden rounded-2xl bg-black">
                  <iframe
                    src={lesson.videoUrl}
                    title={lesson.title}
                    className="h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
              </div>
            )}

            {/* CONTENT */}
            <div className="p-7 sm:p-9">
              <div className="mb-5">
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-600">
                  Lesson Material
                </p>

                <h2 className="mt-2 text-2xl font-bold text-slate-950">
                  {lesson.title}
                </h2>
              </div>

              {lesson.content ? (
                <div className="whitespace-pre-wrap text-base leading-8 text-slate-700">
                  {lesson.content}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
                  <p className="font-semibold text-slate-900">
                    Lesson content coming soon
                  </p>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Your instructor has not added the lesson material yet.
                  </p>
                </div>
              )}
            </div>

            {/* COMPLETE */}
            <div className="border-t border-slate-200 p-7 sm:p-9">
              <form
                action="/api/student/lessons/complete"
                method="POST"
              >
                <input
                  type="hidden"
                  name="lessonId"
                  value={lesson.id}
                />

                <input
                  type="hidden"
                  name="courseId"
                  value={course.id}
                />

                <button
                  type="submit"
                  disabled={lessonProgress?.completed}
                  className={`w-full rounded-xl px-6 py-4 font-semibold transition ${
                    lessonProgress?.completed
                      ? "cursor-not-allowed bg-green-100 text-green-700"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  {lessonProgress?.completed
                    ? "✓ Lesson Completed"
                    : "Mark Lesson as Complete"}
                </button>
              </form>
            </div>

            {/* NAVIGATION */}
            <div className="grid gap-4 border-t border-slate-200 p-7 sm:grid-cols-2 sm:p-9">
              {previousLesson ? (
                <Link
                  href={`/student/courses/${course.slug}/lessons/${previousLesson.id}`}
                  className="rounded-xl border border-slate-200 p-5 transition hover:border-blue-300 hover:bg-blue-50"
                >
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Previous Lesson
                  </p>

                  <p className="mt-2 font-semibold text-slate-900">
                    ← {previousLesson.title}
                  </p>
                </Link>
              ) : (
                <div />
              )}

              {nextLesson ? (
                <Link
                  href={`/student/courses/${course.slug}/lessons/${nextLesson.id}`}
                  className="rounded-xl border border-slate-200 p-5 text-left transition hover:border-blue-300 hover:bg-blue-50 sm:text-right"
                >
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Next Lesson
                  </p>

                  <p className="mt-2 font-semibold text-slate-900">
                    {nextLesson.title} →
                  </p>
                </Link>
              ) : (
                <Link
                  href={`/student/courses/${course.slug}`}
                  className="rounded-xl bg-green-50 p-5 transition hover:bg-green-100 sm:text-right"
                >
                  <p className="text-xs font-semibold uppercase tracking-wider text-green-600">
                    Final Lesson
                  </p>

                  <p className="mt-2 font-semibold text-green-800">
                    Return to Course →
                  </p>
                </Link>
              )}
            </div>
          </article>
        </section>

        {/* SIDEBAR */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-600">
              Course Contents
            </p>

            <h2 className="mt-2 font-bold text-slate-950">
              {course.title}
            </h2>

            {/* PROGRESS */}
            <div className="mt-5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">
                  Your Progress
                </span>

                <span className="font-bold text-slate-900">
                  {calculatedProgress}%
                </span>
              </div>

              <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-blue-600"
                  style={{
                    width: `${calculatedProgress}%`,
                  }}
                />
              </div>
            </div>

            {/* MODULES */}
            <div className="mt-7 space-y-7">
              {course.modules.map((module, moduleIndex) => (
                <div key={module.id}>
                  <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                    Module {moduleIndex + 1}
                  </p>

                  <p className="mb-3 text-sm font-semibold text-slate-900">
                    {module.title}
                  </p>

                  <div className="space-y-1">
                    {module.lessons.map((moduleLesson) => {
                      const isCurrent =
                        moduleLesson.id === lesson.id;

                      return (
                        <Link
                          key={moduleLesson.id}
                          href={`/student/courses/${course.slug}/lessons/${moduleLesson.id}`}
                          className={`flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm transition ${
                            isCurrent
                              ? "bg-blue-50 font-semibold text-blue-700"
                              : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                          }`}
                        >
                          <span>
                            {isCurrent ? "▶" : "○"}
                          </span>

                          <span>{moduleLesson.title}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}