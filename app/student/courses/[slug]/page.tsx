// app/student/courses/[slug]/page.tsx

import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { getCurrentUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function StudentCourseDetailsPage({
  params,
}: Props) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "STUDENT") {
    redirect("/admin");
  }

  const { slug } = await params;

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

          tests: {
            orderBy: {
              createdAt: "asc",
            },
          },

          liveClasses: {
            where: {
              isPublished: true,
            },
            orderBy: {
              scheduledAt: "asc",
            },
            take: 5,
          },
        },
      },

      lessonProgress: {
        where: {
          completed: true,
        },
        select: {
          lessonId: true,
          completedAt: true,
        },
      },
    },
  });

  if (!enrollment) {
    notFound();
  }

  const enrollmentStatus = String(enrollment.status);

  const approved =
    enrollmentStatus === "ACTIVE" ||
    enrollmentStatus === "APPROVED" ||
    enrollmentStatus === "ENROLLED" ||
    enrollmentStatus === "COMPLETED";

  /*
   * Students must not access course lessons before
   * their enrollment has been approved.
   */
  if (!approved) {
    return (
      <main className="min-h-screen bg-slate-50">
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 lg:px-8">
            <Link
              href="/student/courses"
              className="text-sm font-semibold text-blue-600"
            >
              ← Back to My Courses
            </Link>

            <Link
              href="/student/dashboard"
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Dashboard
            </Link>
          </div>
        </header>

        <div className="mx-auto flex min-h-[70vh] max-w-2xl items-center justify-center px-5 py-12">
          <div className="w-full rounded-3xl border border-amber-200 bg-white p-8 text-center shadow-sm sm:p-10">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-amber-50 text-2xl">
              ⏳
            </div>

            <p className="mt-6 text-sm font-semibold uppercase tracking-[0.16em] text-amber-600">
              Enrollment Pending
            </p>

            <h1 className="mt-3 text-3xl font-bold">
              {enrollment.course.title}
            </h1>

            <p className="mt-4 leading-7 text-slate-500">
              Your enrollment request has been received and is
              waiting for approval from EDSEC. Course lessons
              will become available after your enrollment is
              approved.
            </p>

            <div className="mt-7 rounded-2xl bg-amber-50 p-5 text-left">
              <p className="font-semibold text-amber-900">
                Current status
              </p>

              <p className="mt-1 text-sm text-amber-800">
                {enrollmentStatus.replaceAll("_", " ")}
              </p>
            </div>

            <Link
              href="/student/courses"
              className="mt-7 inline-flex rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
            >
              Back to My Courses
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const course = enrollment.course;

  const allLessons = course.modules.flatMap(
    (module) => module.lessons,
  );

  const completedLessonIds = new Set(
    enrollment.lessonProgress.map(
      (progress) => progress.lessonId,
    ),
  );

  const totalLessons = allLessons.length;

  const completedLessons = allLessons.filter((lesson) =>
    completedLessonIds.has(lesson.id),
  ).length;

  const progress =
    totalLessons > 0
      ? Math.round(
          (completedLessons / totalLessons) * 100,
        )
      : 0;

  const firstIncompleteLesson =
    allLessons.find(
      (lesson) => !completedLessonIds.has(lesson.id),
    ) || allLessons[0];

  const courseCompleted =
    totalLessons > 0 &&
    completedLessons === totalLessons;

  return (
    <main className="min-h-screen bg-slate-50">
      {/* HEADER */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 lg:px-8">
          <div>
            <Link
              href="/student/courses"
              className="text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              ← Back to My Courses
            </Link>

            <p className="mt-3 text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
              Learning Course
            </p>
          </div>

          <Link
            href="/student/dashboard"
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Dashboard
          </Link>
        </div>
      </header>

      {/* COURSE HERO */}
      <section className="bg-slate-950 text-white">
        <div className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1fr_360px] lg:items-center">
            <div>
              <span className="inline-flex rounded-full bg-blue-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-400">
                {courseCompleted
                  ? "Course Completed"
                  : "My Course"}
              </span>

              <h1 className="mt-5 max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">
                {course.title}
              </h1>

              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
                {course.shortDescription}
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                {course.duration && (
                  <span className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300">
                    {course.duration}
                  </span>
                )}

                {course.learningFormat && (
                  <span className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300">
                    {course.learningFormat}
                  </span>
                )}

                <span className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300">
                  {course.modules.length} Modules
                </span>

                <span className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300">
                  {totalLessons} Lessons
                </span>
              </div>

              {firstIncompleteLesson && !courseCompleted && (
                <Link
                  href={`/student/courses/${course.slug}/lessons/${firstIncompleteLesson.id}`}
                  className="mt-8 inline-flex rounded-xl bg-blue-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
                >
                  {completedLessons > 0
                    ? "Continue Learning →"
                    : "Start Learning →"}
                </Link>
              )}

              {courseCompleted && (
                <div className="mt-8 inline-flex items-center gap-2 rounded-xl bg-green-500/10 px-5 py-3 text-sm font-semibold text-green-400">
                  ✓ You have completed this course
                </div>
              )}
            </div>

            {/* PROGRESS */}
            <div className="rounded-3xl border border-white/10 bg-white/5 p-7 backdrop-blur">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-400">
                  Your Progress
                </p>

                <span className="text-sm font-bold text-blue-400">
                  {completedLessons}/{totalLessons}
                </span>
              </div>

              <div className="mt-4 flex items-end justify-between">
                <span className="text-5xl font-bold">
                  {progress}%
                </span>

                <span className="pb-1 text-sm text-slate-400">
                  completed
                </span>
              </div>

              <div className="mt-5 h-3 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-blue-500 transition-all"
                  style={{
                    width: `${progress}%`,
                  }}
                />
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-white/5 p-4">
                  <p className="text-2xl font-bold">
                    {course.modules.length}
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Modules
                  </p>
                </div>

                <div className="rounded-2xl bg-white/5 p-4">
                  <p className="text-2xl font-bold">
                    {completedLessons}
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Completed
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
          <div>
            {/* OVERVIEW */}
            <section className="rounded-3xl border border-slate-200 bg-white p-7">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-600">
                Course Overview
              </p>

              <h2 className="mt-3 text-2xl font-bold">
                About this course
              </h2>

              <p className="mt-4 whitespace-pre-line leading-7 text-slate-600">
                {course.description ||
                  course.shortDescription}
              </p>
            </section>

            {/* CURRICULUM */}
            <section className="mt-8">
              <div className="mb-5">
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-600">
                  Curriculum
                </p>

                <h2 className="mt-2 text-2xl font-bold">
                  Course Content
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  Work through each lesson in order. Your
                  progress is saved automatically.
                </p>
              </div>

              {course.modules.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">
                  <h3 className="text-lg font-bold">
                    Course content is being prepared
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Your instructor has not published any
                    modules for this course yet.
                  </p>
                </div>
              ) : (
                <div className="space-y-5">
                  {course.modules.map((module, index) => {
                    const moduleCompletedLessons =
                      module.lessons.filter((lesson) =>
                        completedLessonIds.has(
                          lesson.id,
                        ),
                      ).length;

                    const moduleTotalLessons =
                      module.lessons.length;

                    const moduleProgress =
                      moduleTotalLessons > 0
                        ? Math.round(
                            (moduleCompletedLessons /
                              moduleTotalLessons) *
                              100,
                          )
                        : 0;

                    return (
                      <div
                        key={module.id}
                        className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
                      >
                        <div className="border-b border-slate-100 bg-slate-50 p-6">
                          <div className="flex items-start gap-4">
                            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-blue-600 font-bold text-white">
                              {index + 1}
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-start justify-between gap-3">
                                <div>
                                  <h3 className="text-lg font-bold">
                                    {module.title}
                                  </h3>

                                  {module.description && (
                                    <p className="mt-1 text-sm leading-6 text-slate-500">
                                      {module.description}
                                    </p>
                                  )}
                                </div>

                                <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-500">
                                  {moduleCompletedLessons}/
                                  {moduleTotalLessons}{" "}
                                  lessons
                                </span>
                              </div>

                              <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200">
                                <div
                                  className="h-full rounded-full bg-blue-600"
                                  style={{
                                    width: `${moduleProgress}%`,
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        {module.lessons.length === 0 ? (
                          <div className="p-6 text-sm text-slate-500">
                            No published lessons in this
                            module yet.
                          </div>
                        ) : (
                          <div>
                            {module.lessons.map(
                              (lesson, lessonIndex) => {
                                const completed =
                                  completedLessonIds.has(
                                    lesson.id,
                                  );

                                return (
                                  <Link
                                    key={lesson.id}
                                    href={`/student/courses/${course.slug}/lessons/${lesson.id}`}
                                    className="group flex items-center gap-4 border-b border-slate-100 px-6 py-5 last:border-b-0 hover:bg-slate-50"
                                  >
                                    <div
                                      className={`grid h-10 w-10 shrink-0 place-items-center rounded-full text-sm font-bold ${
                                        completed
                                          ? "bg-green-100 text-green-700"
                                          : "bg-blue-50 text-blue-600"
                                      }`}
                                    >
                                      {completed
                                        ? "✓"
                                        : lessonIndex + 1}
                                    </div>

                                    <div className="min-w-0 flex-1">
                                      <div className="flex flex-wrap items-center gap-2">
                                        <h4
                                          className={`font-semibold ${
                                            completed
                                              ? "text-slate-600"
                                              : "text-slate-950"
                                          }`}
                                        >
                                          {lesson.title}
                                        </h4>

                                        {completed && (
                                          <span className="rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-green-700">
                                            Completed
                                          </span>
                                        )}
                                      </div>

                                      {lesson.description && (
                                        <p className="mt-1 line-clamp-2 text-sm leading-6 text-slate-500">
                                          {lesson.description}
                                        </p>
                                      )}

                                      <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-400">
                                        {lesson.duration && (
                                          <span>
                                            {lesson.duration} min
                                          </span>
                                        )}

                                        {lesson.videoUrl && (
                                          <span>
                                            Video lesson
                                          </span>
                                        )}
                                      </div>
                                    </div>

                                    <span className="shrink-0 text-sm font-semibold text-blue-600 transition group-hover:translate-x-1">
                                      {completed
                                        ? "Review →"
                                        : "Start →"}
                                    </span>
                                  </Link>
                                );
                              },
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          </div>

          {/* SIDEBAR */}
          <aside className="space-y-5">
            <div className="rounded-3xl border border-slate-200 bg-white p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-600">
                Course Details
              </p>

              <div className="mt-5 space-y-4">
                <Detail
                  label="Duration"
                  value={course.duration || "Not specified"}
                />

                <Detail
                  label="Learning format"
                  value={
                    course.learningFormat ||
                    "Not specified"
                  }
                />

                <Detail
                  label="Modules"
                  value={course.modules.length.toString()}
                />

                <Detail
                  label="Lessons"
                  value={totalLessons.toString()}
                />

                <Detail
                  label="Completed"
                  value={`${completedLessons} / ${totalLessons}`}
                />

                <Detail
                  label="Published tests"
                  value={course.tests.length.toString()}
                />

                <Detail
                  label="Progress"
                  value={`${progress}%`}
                />
              </div>
            </div>

            {firstIncompleteLesson &&
              !courseCompleted && (
                <div className="rounded-3xl bg-blue-600 p-6 text-white">
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-200">
                    Continue Learning
                  </p>

                  <h2 className="mt-3 text-xl font-bold">
                    {firstIncompleteLesson.title}
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-blue-100">
                    Continue from where you stopped and keep
                    building your skills.
                  </p>

                  <Link
                    href={`/student/courses/${course.slug}/lessons/${firstIncompleteLesson.id}`}
                    className="mt-5 block rounded-xl bg-white px-5 py-3 text-center font-semibold text-blue-700 hover:bg-blue-50"
                  >
                    Continue →
                  </Link>
                </div>
              )}

            <div className="rounded-3xl bg-slate-950 p-6 text-white">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-400">
                Assessments
              </p>

              <h2 className="mt-3 text-xl font-bold">
                Course Tests
              </h2>

              {course.tests.length === 0 ? (
                <p className="mt-3 text-sm leading-6 text-slate-400">
                  No assessments have been published for this
                  course yet.
                </p>
              ) : (
                <div className="mt-5 space-y-3">
                  {course.tests.map((test) => (
                    <div
                      key={test.id}
                      className="rounded-xl border border-white/10 bg-white/5 p-4"
                    >
                      <p className="font-semibold">
                        {test.title}
                      </p>

                      {test.description && (
                        <p className="mt-1 text-xs leading-5 text-slate-400">
                          {test.description}
                        </p>
                      )}

                      <Link
                        href={`/student/tests/${test.id}`}
                        className="mt-3 inline-block text-sm font-semibold text-blue-400"
                      >
                        Take Test →
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-600">
                Live Learning
              </p>

              <h2 className="mt-3 text-xl font-bold">
                Upcoming Classes
              </h2>

              {course.liveClasses.length === 0 ? (
                <p className="mt-3 text-sm leading-6 text-slate-500">
                  No live classes have been scheduled yet.
                </p>
              ) : (
                <div className="mt-5 space-y-3">
                  {course.liveClasses.map((liveClass) => (
                    <div
                      key={liveClass.id}
                      className="rounded-2xl bg-slate-50 p-4"
                    >
                      <p className="font-semibold">
                        {liveClass.title}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {new Date(
                          liveClass.scheduledAt,
                        ).toLocaleString()}
                      </p>

                      <Link
                        href={liveClass.meetingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-block text-sm font-semibold text-blue-600"
                      >
                        Join Class →
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {course.syllabus && (
              <div className="rounded-3xl border border-slate-200 bg-white p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-600">
                  Syllabus
                </p>

                <p className="mt-4 whitespace-pre-line text-sm leading-6 text-slate-600">
                  {course.syllabus}
                </p>
              </div>
            )}
          </aside>
        </div>
      </section>
    </main>
  );
}

function Detail({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-4 last:border-0 last:pb-0">
      <span className="text-sm text-slate-500">
        {label}
      </span>

      <span className="text-right text-sm font-semibold text-slate-900">
        {value}
      </span>
    </div>
  );
}