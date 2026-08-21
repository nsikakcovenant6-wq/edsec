/* eslint-disable @typescript-eslint/no-unused-vars */
import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/app/lib/prisma";
import { getCurrentUser } from "@/app/lib/auth";

export default async function StudentProgressPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "STUDENT") {
    redirect("/admin");
  }

  const enrollments = await prisma.enrollment.findMany({
    where: {
      studentId: user.id,
    },
    include: {
      course: {
        include: {
          modules: {
            where: {
              isPublished: true,
            },
            include: {
              lessons: {
                where: {
                  isPublished: true,
                },
              },
            },
            orderBy: {
              displayOrder: "asc",
            },
          },
          tests: {
            where: {
              status: "PUBLISHED",
            },
            include: {
              attempts: {
                where: {
                  studentId: user.id,
                  status: "GRADED",
                },
                orderBy: {
                  submittedAt: "desc",
                },
              },
            },
          },
        },
      },
      lessonProgress: {
        where: {
          completed: true,
        },
        include: {
          lesson: true,
        },
        orderBy: {
          completedAt: "desc",
        },
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  const totalCourses = enrollments.length;

  const completedCourses = enrollments.filter(
    (enrollment) =>
      enrollment.status === "COMPLETED" ||
      enrollment.progress >= 100
  ).length;

  const activeCourses = enrollments.filter(
    (enrollment) =>
      enrollment.status === "ACTIVE" &&
      enrollment.progress < 100
  ).length;

  const totalLessons = enrollments.reduce(
    (total, enrollment) =>
      total +
      enrollment.course.modules.reduce(
        (moduleTotal, module) =>
          moduleTotal + module.lessons.length,
        0
      ),
    0
  );

  const completedLessons = enrollments.reduce(
    (total, enrollment) =>
      total + enrollment.lessonProgress.length,
    0
  );

  const totalTests = enrollments.reduce(
    (total, enrollment) =>
      total + enrollment.course.tests.length,
    0
  );

  const testAttempts = enrollments.flatMap(
    (enrollment) =>
      enrollment.course.tests.flatMap(
        (test) => test.attempts
      )
  );

  const gradedAttempts = testAttempts.filter(
    (attempt) =>
      attempt.status === "GRADED" &&
      attempt.totalPoints &&
      attempt.totalPoints > 0
  );

  const averageTestScore =
    gradedAttempts.length > 0
      ? Math.round(
          gradedAttempts.reduce(
            (total, attempt) =>
              total +
              ((attempt.score ?? 0) /
                (attempt.totalPoints ?? 1)) *
                100,
            0
          ) / gradedAttempts.length
        )
      : 0;

  const overallProgress =
    totalCourses > 0
      ? Math.round(
          enrollments.reduce(
            (total, enrollment) =>
              total +
              Math.min(
                Math.max(enrollment.progress, 0),
                100
              ),
            0
          ) / totalCourses
        )
      : 0;

  const recentActivity = enrollments
    .flatMap((enrollment) =>
      enrollment.lessonProgress.map((progress) => ({
        id: progress.id,
        courseId: enrollment.course.id,
        courseSlug: enrollment.course.slug,
        courseTitle: enrollment.course.title,
        lessonTitle: progress.lesson.title,
        completedAt: progress.completedAt,
      }))
    )
    .sort((a, b) => {
      const first = a.completedAt
        ? new Date(a.completedAt).getTime()
        : 0;

      const second = b.completedAt
        ? new Date(b.completedAt).getTime()
        : 0;

      return second - first;
    })
    .slice(0, 6);

  return (
    <main className="min-h-screen bg-slate-50">
      {/* HEADER */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
          <Link
            href="/student"
            className="text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            ← Back to Dashboard
          </Link>

          <div className="mt-5">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-600">
              Learning Analytics
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              My Progress
            </h1>

            <p className="mt-3 max-w-2xl leading-7 text-slate-600">
              Track your course completion, lessons,
              assessments, and overall learning progress.
            </p>
          </div>
        </div>
      </header>

      {/* OVERALL PROGRESS */}
      <section className="bg-slate-950 text-white">
        <div className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1fr_300px] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-400">
                Overall Progress
              </p>

              <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
                Keep building your skills.
              </h2>

              <p className="mt-4 max-w-2xl leading-7 text-slate-400">
                Your progress is calculated from your
                enrolled courses and completed lessons.
                Keep learning consistently to complete
                your EDSEC training.
              </p>

              <div className="mt-7 h-3 max-w-2xl overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-blue-500 transition-all"
                  style={{
                    width: `${overallProgress}%`,
                  }}
                />
              </div>

              <p className="mt-3 text-sm text-slate-400">
                You have completed{" "}
                <span className="font-semibold text-white">
                  {overallProgress}%
                </span>{" "}
                of your enrolled training.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-7 text-center">
              <p className="text-sm font-semibold text-slate-400">
                Overall completion
              </p>

              <p className="mt-3 text-6xl font-bold">
                {overallProgress}%
              </p>

              <p className="mt-2 text-sm text-slate-500">
                Across all courses
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* STATISTICS */}
      <section className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Enrolled Courses"
            value={totalCourses.toString()}
            description={`${activeCourses} active`}
          />

          <StatCard
            label="Lessons Completed"
            value={completedLessons.toString()}
            description={`${totalLessons} total lessons`}
          />

          <StatCard
            label="Courses Completed"
            value={completedCourses.toString()}
            description={`${totalCourses} enrolled`}
          />

          <StatCard
            label="Average Test Score"
            value={`${averageTestScore}%`}
            description={`${gradedAttempts.length} graded attempts`}
          />
        </div>

        {/* COURSES */}
        <section className="mt-10">
          <div className="mb-6">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-600">
              Course Progress
            </p>

            <h2 className="mt-2 text-2xl font-bold text-slate-950">
              Your Learning Journey
            </h2>
          </div>

          {enrollments.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">
              <h3 className="text-lg font-bold text-slate-950">
                No courses yet
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
                You are not enrolled in any courses yet.
                Explore EDSEC courses and start your
                learning journey.
              </p>

              <Link
                href="/courses"
                className="mt-6 inline-flex rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
              >
                Explore Courses
              </Link>
            </div>
          ) : (
            <div className="space-y-5">
              {enrollments.map((enrollment) => {
                const progress = Math.min(
                  Math.max(enrollment.progress, 0),
                  100
                );

                const courseLessons =
                  enrollment.course.modules.reduce(
                    (total, module) =>
                      total + module.lessons.length,
                    0
                  );

                const completedCourseLessons =
                  enrollment.lessonProgress.length;

                const courseTests =
                  enrollment.course.tests.length;

                const courseAttempts =
                  enrollment.course.tests.reduce(
                    (total, test) =>
                      total + test.attempts.length,
                    0
                  );

                return (
                  <div
                    key={enrollment.id}
                    className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7"
                  >
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-3">
                          <h3 className="text-xl font-bold text-slate-950">
                            {enrollment.course.title}
                          </h3>

                          {enrollment.status ===
                            "COMPLETED" ||
                          progress >= 100 ? (
                            <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-700">
                              ✓ Completed
                            </span>
                          ) : (
                            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                              In Progress
                            </span>
                          )}
                        </div>

                        <p className="mt-2 text-sm leading-6 text-slate-600">
                          {enrollment.course.shortDescription}
                        </p>

                        <div className="mt-5">
                          <div className="flex items-center justify-between text-sm">
                            <span className="font-medium text-slate-500">
                              Course progress
                            </span>

                            <span className="font-bold text-slate-950">
                              {progress}%
                            </span>
                          </div>

                          <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-slate-100">
                            <div
                              className="h-full rounded-full bg-blue-600 transition-all"
                              style={{
                                width: `${progress}%`,
                              }}
                            />
                          </div>
                        </div>

                        <div className="mt-5 flex flex-wrap gap-3 text-sm text-slate-500">
                          <span className="rounded-lg bg-slate-50 px-3 py-2">
                            {completedCourseLessons} /{" "}
                            {courseLessons} lessons
                          </span>

                          <span className="rounded-lg bg-slate-50 px-3 py-2">
                            {courseTests} tests
                          </span>

                          <span className="rounded-lg bg-slate-50 px-3 py-2">
                            {courseAttempts} attempts
                          </span>
                        </div>
                      </div>

                      <div className="shrink-0">
                        <Link
                          href={`/student/courses/${enrollment.course.slug}`}
                          className="inline-flex w-full justify-center rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 sm:w-auto"
                        >
                          {progress > 0 && progress < 100
                            ? "Continue Learning"
                            : progress >= 100
                              ? "View Course"
                              : "Start Course"}
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* RECENT ACTIVITY */}
        <section className="mt-10">
          <div className="mb-6">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-600">
              Recent Activity
            </p>

            <h2 className="mt-2 text-2xl font-bold text-slate-950">
              Your Latest Learning Activity
            </h2>
          </div>

          {recentActivity.length === 0 ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center">
              <p className="font-semibold text-slate-950">
                No learning activity yet
              </p>

              <p className="mt-2 text-sm text-slate-500">
                Complete a lesson and your activity
                will appear here.
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="divide-y divide-slate-100">
                {recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex min-w-0 gap-4">
                      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-green-50 text-green-600">
                        ✓
                      </div>

                      <div className="min-w-0">
                        <p className="font-semibold text-slate-950">
                          Lesson completed
                        </p>

                        <p className="mt-1 truncate text-sm text-slate-600">
                          {activity.lessonTitle}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          {activity.courseTitle}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0">
                      <Link
                        href={`/student/courses/${activity.courseSlug}`}
                        className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                      >
                        View Course →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* QUICK ACTIONS */}
        <section className="mt-10">
          <div className="rounded-3xl bg-blue-600 p-7 text-white sm:p-9">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-200">
                  Keep Learning
                </p>

                <h2 className="mt-2 text-2xl font-bold">
                  Continue building your digital skills.
                </h2>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-blue-100">
                  Stay consistent with your lessons and
                  assessments. Every completed lesson moves
                  you closer to your training goals.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/student/courses"
                  className="rounded-xl bg-white px-6 py-3 text-center font-semibold text-blue-700 transition hover:bg-blue-50"
                >
                  My Courses
                </Link>

                <Link
                  href="/student"
                  className="rounded-xl border border-white/20 bg-white/10 px-6 py-3 text-center font-semibold text-white transition hover:bg-white/20"
                >
                  Dashboard
                </Link>
              </div>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}

function StatCard({
  label,
  value,
  description,
}: {
  label: string;
  value: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-medium text-slate-500">
        {label}
      </p>

      <p className="mt-2 text-3xl font-bold text-slate-950">
        {value}
      </p>

      <p className="mt-2 text-xs text-slate-400">
        {description}
      </p>
    </div>
  );
}