/* eslint-disable @typescript-eslint/no-unused-vars */
import Link from "next/link";
import { redirect } from "next/navigation";

import { prisma } from "@/app/lib/prisma";
import { getCurrentUser } from "@/app/lib/auth";

export default async function StudentDashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "STUDENT") {
    redirect("/admin");
  }

  const [
    profile,
    enrollments,
    attempts,
    announcements,
    projectRecords,
    liveClasses,
  ] = await Promise.all([
    prisma.studentProfile.findUnique({
      where: {
        userId: user.id,
      },
    }),

    prisma.enrollment.findMany({
      where: {
        studentId: user.id,
      },
      orderBy: {
        updatedAt: "desc",
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

        lessonProgress: {
          where: {
            completed: true,
          },
          select: {
            lessonId: true,
          },
        },
      },
    }),

    prisma.testAttempt.findMany({
      where: {
        studentId: user.id,
      },
      orderBy: {
        startedAt: "desc",
      },
      take: 10,
      include: {
        test: {
          include: {
            course: true,
          },
        },
      },
    }),

    prisma.announcement.findMany({
      where: {
        status: "PUBLISHED",
      },
      orderBy: {
        publishedAt: "desc",
      },
      take: 5,
    }),

    prisma.studentProjectRecord.findMany({
      where: {
        studentId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
      include: {
        project: true,
      },
    }),

    /*
     * ============================================================
     * LIVE CLASSES
     * ============================================================
     *
     * Only show classes:
     * - belonging to a course the student is actively enrolled in
     * - published by the admin
     * - scheduled or currently live
     */
    prisma.liveClass.findMany({
      where: {
        isPublished: true,

        status: {
          in: ["SCHEDULED", "LIVE"],
        },

        course: {
          enrollments: {
            some: {
              studentId: user.id,
              status: "ACTIVE",
            },
          },
        },
      },

      orderBy: {
        scheduledAt: "asc",
      },

      take: 10,

      include: {
        course: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
    }),
  ]);

  /* ============================================================
     CALCULATIONS
     ============================================================ */

  const activeEnrollments = enrollments.filter(
    (enrollment) => enrollment.status === "ACTIVE"
  );

  const completedCourses = enrollments.filter(
    (enrollment) => enrollment.status === "COMPLETED"
  );

  const completedTests = attempts.filter(
    (attempt) =>
      attempt.status === "SUBMITTED" ||
      attempt.status === "GRADED"
  );

  const gradedTests = attempts.filter(
    (attempt) => attempt.status === "GRADED"
  );

  const averageScore =
    gradedTests.length > 0
      ? Math.round(
          gradedTests.reduce(
            (total, attempt) => total + (attempt.score ?? 0),
            0
          ) / gradedTests.length
        )
      : 0;

  const submittedProjects = projectRecords.filter(
    (project) =>
      project.status === "SUBMITTED" ||
      project.status === "GRADED"
  );

  const gradedProjects = projectRecords.filter(
    (project) => project.status === "GRADED"
  );

  const averageProjectScore =
    gradedProjects.length > 0
      ? Math.round(
          gradedProjects.reduce(
            (total, project) =>
              total + (project.score ?? 0),
            0
          ) / gradedProjects.length
        )
      : 0;

  /* ============================================================
     CONTINUE LEARNING
     ============================================================ */

  const continueLearning = activeEnrollments
    .map((enrollment) => {
      const allLessons = enrollment.course.modules.flatMap(
        (module) => module.lessons
      );

      const completedIds = new Set(
        enrollment.lessonProgress.map(
          (progress) => progress.lessonId
        )
      );

      const nextLesson =
        allLessons.find(
          (lesson) => !completedIds.has(lesson.id)
        ) ?? null;

      return {
        enrollment,
        nextLesson,
        completedCount: enrollment.lessonProgress.length,
        totalLessons: allLessons.length,
      };
    })
    .find((item) => item.nextLesson);

  /* ============================================================
     RECENT DATA
     ============================================================ */

  const recentAttempts = attempts.slice(0, 5);
  const recentProjects = projectRecords.slice(0, 3);

  const firstName =
    user.firstName?.trim() || "Student";

  const fullName =
    `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() ||
    "Student";

  const studentNumber =
    profile?.studentNumber || "Student";

  /* ============================================================
     LIVE CLASS HELPERS
     ============================================================ */

  const liveNowClasses = liveClasses.filter(
    (liveClass) => liveClass.status === "LIVE"
  );

  const upcomingClasses = liveClasses.filter(
    (liveClass) => liveClass.status === "SCHEDULED"
  );

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      {/* ========================================================
          HEADER
      ======================================================== */}

      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-5 py-5 lg:px-8">
          <div className="min-w-0">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-600">
              EDSEC ICT Institute
            </p>

            <h1 className="mt-1 truncate text-2xl font-bold tracking-tight">
              Welcome back, {firstName}
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              {studentNumber}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/student/profile"
              className="hidden rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 sm:block"
            >
              Profile
            </Link>

            <Link
              href="/student/courses"
              className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              My Courses
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
        {/* ======================================================
            HERO
        ====================================================== */}

        <section className="overflow-hidden rounded-3xl bg-slate-950 p-7 text-white shadow-sm sm:p-9">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-400">
                Student Learning Portal
              </p>

              <h2 className="mt-3 max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl">
                Learn technology. Build skills. Grow your future.
              </h2>

              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-400">
                Continue your courses, attend live classes, complete
                lessons, take assessments, submit projects, monitor
                your progress, and manage your student profile from
                one place.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                {continueLearning?.nextLesson ? (
                  <Link
                    href={`/student/courses/${continueLearning.enrollment.course.slug}/lessons/${continueLearning.nextLesson.id}`}
                    className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-500"
                  >
                    Continue Learning →
                  </Link>
                ) : (
                  <Link
                    href="/student/courses"
                    className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-500"
                  >
                    Explore My Courses →
                  </Link>
                )}

                <Link
                  href="/student/live-classes"
                  className="rounded-xl border border-slate-700 px-5 py-3 font-semibold text-white transition hover:bg-white/5"
                >
                  Live Classes
                </Link>

                <Link
                  href="/student/tests"
                  className="rounded-xl border border-slate-700 px-5 py-3 font-semibold text-white transition hover:bg-white/5"
                >
                  View Tests
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <p className="text-3xl font-bold">
                  {activeEnrollments.length}
                </p>

                <p className="mt-1 text-sm text-slate-400">
                  Active Courses
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <p className="text-3xl font-bold">
                  {completedCourses.length}
                </p>

                <p className="mt-1 text-sm text-slate-400">
                  Completed
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <p className="text-3xl font-bold">
                  {completedTests.length}
                </p>

                <p className="mt-1 text-sm text-slate-400">
                  Tests Taken
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <p className="text-3xl font-bold">
                  {liveClasses.length}
                </p>

                <p className="mt-1 text-sm text-slate-400">
                  Live Classes
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ======================================================
            LIVE CLASSES
        ====================================================== */}

        <section className="mt-10">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-600">
                Live Learning
              </p>

              <h2 className="mt-2 text-2xl font-bold tracking-tight">
                Upcoming live classes.
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Join your scheduled EDSEC virtual classes directly
                from your student dashboard.
              </p>
            </div>

            <Link
              href="/student/live-classes"
              className="text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              View all live classes →
            </Link>
          </div>

          {liveClasses.length > 0 ? (
            <div className="mt-5 grid gap-5 lg:grid-cols-2">
              {liveClasses.slice(0, 4).map((liveClass) => {
                const date = new Date(liveClass.scheduledAt);

                const dateText = date.toLocaleDateString(
                  undefined,
                  {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  }
                );

                const timeText = date.toLocaleTimeString(
                  undefined,
                  {
                    hour: "numeric",
                    minute: "2-digit",
                  }
                );

                const isLive =
                  liveClass.status === "LIVE";

                return (
                  <div
                    key={liveClass.id}
                    className={`overflow-hidden rounded-3xl border bg-white transition hover:shadow-lg ${
                      isLive
                        ? "border-red-200"
                        : "border-slate-200"
                    }`}
                  >
                    <div
                      className={`p-6 ${
                        isLive
                          ? "bg-red-50"
                          : "bg-blue-50"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            {isLive ? (
                              <span className="inline-flex items-center gap-2 rounded-full bg-red-600 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
                                <span className="h-2 w-2 animate-pulse rounded-full bg-white" />
                                Live Now
                              </span>
                            ) : (
                              <span className="rounded-full bg-blue-600 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
                                Upcoming
                              </span>
                            )}
                          </div>

                          <h3 className="mt-4 text-xl font-bold text-slate-950">
                            {liveClass.title}
                          </h3>

                          <p className="mt-2 text-sm font-medium text-slate-600">
                            {liveClass.course.title}
                          </p>
                        </div>

                        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white text-xl shadow-sm">
                          🎥
                        </div>
                      </div>
                    </div>

                    <div className="p-6">
                      {liveClass.description && (
                        <p className="line-clamp-2 text-sm leading-6 text-slate-500">
                          {liveClass.description}
                        </p>
                      )}

                      <div className="mt-5 grid gap-3 sm:grid-cols-2">
                        <div className="rounded-2xl bg-slate-50 p-4">
                          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                            Date
                          </p>

                          <p className="mt-1 text-sm font-semibold text-slate-800">
                            {dateText}
                          </p>
                        </div>

                        <div className="rounded-2xl bg-slate-50 p-4">
                          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                            Time
                          </p>

                          <p className="mt-1 text-sm font-semibold text-slate-800">
                            {timeText}
                          </p>
                        </div>
                      </div>

                      {liveClass.duration && (
                        <p className="mt-4 text-xs text-slate-400">
                          Duration: {liveClass.duration} minutes
                        </p>
                      )}

                      <a
                        href={liveClass.meetingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`mt-5 inline-flex w-full items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold text-white transition ${
                          isLive
                            ? "bg-red-600 hover:bg-red-700"
                            : "bg-blue-600 hover:bg-blue-700"
                        }`}
                      >
                        {isLive
                          ? "Join Live Class →"
                          : "Open Class Link →"}
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="mt-5 rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-blue-50 text-2xl">
                🎥
              </div>

              <h3 className="mt-5 font-semibold">
                No live classes scheduled
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                Your upcoming virtual classes will appear here
                when they are published by EDSEC.
              </p>

              <Link
                href="/student/courses"
                className="mt-5 inline-flex rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
              >
                View My Courses
              </Link>
            </div>
          )}
        </section>

        {/* ======================================================
            LIVE NOW ALERT
        ====================================================== */}

        {liveNowClasses.length > 0 && (
          <section className="mt-6">
            <div className="rounded-3xl border border-red-200 bg-red-50 p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 animate-pulse rounded-full bg-red-600" />

                    <p className="text-sm font-bold uppercase tracking-wider text-red-700">
                      Class is currently live
                    </p>
                  </div>

                  <h3 className="mt-2 text-lg font-bold text-red-950">
                    {liveNowClasses[0].title}
                  </h3>

                  <p className="mt-1 text-sm text-red-700">
                    {liveNowClasses[0].course.title}
                  </p>
                </div>

                <a
                  href={liveNowClasses[0].meetingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex shrink-0 items-center justify-center rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
                >
                  Join Now →
                </a>
              </div>
            </div>
          </section>
        )}

        {/* ======================================================
            QUICK ACTIONS
        ====================================================== */}

        <section className="mt-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {[
              {
                number: "01",
                title: "My Courses",
                text: "Access enrolled courses and lessons.",
                href: "/student/courses",
              },
              {
                number: "02",
                title: "Live Classes",
                text: "Join scheduled virtual classes.",
                href: "/student/live-classes",
              },
              {
                number: "03",
                title: "Assessments",
                text: "Take tests and review results.",
                href: "/student/tests",
              },
              {
                number: "04",
                title: "My Projects",
                text: "View and track submitted projects.",
                href: "/student/projects",
              },
              {
                number: "05",
                title: "My Profile",
                text: "Manage your student information.",
                href: "/student/profile",
              },
            ].map((item) => (
              <Link
                key={item.number}
                href={item.href}
                className="group rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
              >
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-blue-50 font-bold text-blue-600">
                  {item.number}
                </div>

                <h3 className="mt-5 font-semibold">
                  {item.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {item.text}
                </p>

                <p className="mt-4 text-sm font-semibold text-blue-600">
                  Open →
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* ======================================================
            CONTINUE LEARNING
        ====================================================== */}

        <section className="mt-10">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-600">
                Continue Learning
              </p>

              <h2 className="mt-2 text-2xl font-bold tracking-tight">
                Pick up where you stopped.
              </h2>
            </div>

            <Link
              href="/student/courses"
              className="text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              View all →
            </Link>
          </div>

          {continueLearning ? (
            <div className="mt-5 overflow-hidden rounded-3xl border border-slate-200 bg-white">
              <div className="grid lg:grid-cols-[1fr_300px]">
                <div className="p-7 sm:p-9">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-700">
                      Continue
                    </span>

                    <span className="text-sm text-slate-500">
                      {continueLearning.enrollment.course.title}
                    </span>
                  </div>

                  <h3 className="mt-4 text-2xl font-bold">
                    {continueLearning.nextLesson?.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-slate-500">
                    Continue your next lesson and keep building
                    your practical ICT skills.
                  </p>

                  <Link
                    href={`/student/courses/${continueLearning.enrollment.course.slug}/lessons/${continueLearning.nextLesson?.id}`}
                    className="mt-6 inline-flex rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
                  >
                    Continue Lesson →
                  </Link>
                </div>

                <div className="bg-slate-50 p-7">
                  <p className="text-sm font-semibold text-slate-500">
                    Course Progress
                  </p>

                  <p className="mt-3 text-4xl font-bold">
                    {continueLearning.enrollment.progress}%
                  </p>

                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200">
                    <div
                      className="h-full rounded-full bg-blue-600"
                      style={{
                        width: `${Math.min(
                          100,
                          Math.max(
                            0,
                            continueLearning.enrollment.progress
                          )
                        )}%`,
                      }}
                    />
                  </div>

                  <p className="mt-3 text-sm text-slate-500">
                    {continueLearning.completedCount} of{" "}
                    {continueLearning.totalLessons} lessons
                    completed
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-5 rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">
              <h3 className="font-semibold">
                You are all caught up.
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Explore your available learning programs.
              </p>

              <Link
                href="/courses"
                className="mt-5 inline-flex rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white"
              >
                Explore Courses
              </Link>
            </div>
          )}
        </section>

        {/* ======================================================
            MY COURSES
        ====================================================== */}

        <section className="mt-10">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-600">
                My Courses
              </p>

              <h2 className="mt-2 text-2xl font-bold tracking-tight">
                Your learning programs.
              </h2>
            </div>

            <Link
              href="/student/courses"
              className="text-sm font-semibold text-blue-600"
            >
              View all →
            </Link>
          </div>

          <div className="mt-5 grid gap-5 md:grid-cols-2">
            {enrollments.slice(0, 4).map((enrollment) => {
              const totalLessons =
                enrollment.course.modules.reduce(
                  (total, module) =>
                    total + module.lessons.length,
                  0
                );

              const completedLessons =
                enrollment.lessonProgress.length;

              return (
                <Link
                  key={enrollment.id}
                  href={`/student/courses/${enrollment.course.slug}`}
                  className="group rounded-3xl border border-slate-200 bg-white p-7 transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-700">
                        {enrollment.status}
                      </span>

                      <h3 className="mt-4 text-xl font-bold">
                        {enrollment.course.title}
                      </h3>
                    </div>

                    <span className="text-xl text-slate-300 transition group-hover:text-blue-600">
                      ↗
                    </span>
                  </div>

                  <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-500">
                    {enrollment.course.shortDescription}
                  </p>

                  <div className="mt-6">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500">
                        Progress
                      </span>

                      <span className="font-bold">
                        {enrollment.progress}%
                      </span>
                    </div>

                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-blue-600"
                        style={{
                          width: `${Math.min(
                            100,
                            Math.max(
                              0,
                              enrollment.progress
                            )
                          )}%`,
                        }}
                      />
                    </div>

                    <p className="mt-3 text-xs text-slate-400">
                      {completedLessons} of {totalLessons} lessons
                      completed
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>

          {enrollments.length === 0 && (
            <div className="mt-5 rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">
              <h3 className="font-semibold">
                No courses yet
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Once you are enrolled, your courses will appear
                here.
              </p>

              <Link
                href="/courses"
                className="mt-5 inline-flex rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white"
              >
                Explore Programs
              </Link>
            </div>
          )}
        </section>

        {/* ======================================================
            PROJECT SUMMARY
        ====================================================== */}

        <section className="mt-10">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-600">
                Student Projects
              </p>

              <h2 className="mt-2 text-2xl font-bold">
                Your practical work.
              </h2>
            </div>

            <Link
              href="/student/projects"
              className="text-sm font-semibold text-blue-600"
            >
              View projects →
            </Link>
          </div>

          <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_auto]">
            <div className="rounded-3xl border border-slate-200 bg-white p-7">
              {recentProjects.length > 0 ? (
                <div className="space-y-3">
                  {recentProjects.map((project) => (
                    <div
                      key={project.id}
                      className="flex items-center justify-between gap-4 rounded-2xl border border-slate-100 p-4"
                    >
                      <div className="min-w-0">
                        <p className="truncate font-semibold">
                          {project.title}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {project.status.replace("_", " ")}
                        </p>
                      </div>

                      {project.score !== null && (
                        <span className="font-bold text-blue-600">
                          {project.score}%
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl bg-slate-50 p-6 text-center">
                  <p className="font-semibold">
                    No projects submitted yet
                  </p>

                  <p className="mt-2 text-sm text-slate-500">
                    Your practical projects will appear here.
                  </p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 lg:w-72 lg:grid-cols-1">
              <div className="rounded-3xl border border-slate-200 bg-white p-6">
                <p className="text-3xl font-bold">
                  {submittedProjects.length}
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Projects
                </p>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-6">
                <p className="text-3xl font-bold">
                  {averageProjectScore}%
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Project Average
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ======================================================
            TESTS + ANNOUNCEMENTS
        ====================================================== */}

        <section className="mt-10 grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-7">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-600">
                  Assessments
                </p>

                <h2 className="mt-2 text-xl font-bold">
                  Recent test activity
                </h2>
              </div>

              <Link
                href="/student/tests"
                className="text-sm font-semibold text-blue-600"
              >
                View all
              </Link>
            </div>

            <div className="mt-6 space-y-3">
              {recentAttempts.length > 0 ? (
                recentAttempts.map((attempt) => (
                  <Link
                    key={attempt.id}
                    href={`/student/tests/${attempt.test.id}`}
                    className="flex items-center justify-between gap-4 rounded-2xl border border-slate-100 p-4 transition hover:border-blue-100 hover:bg-blue-50/50"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-semibold">
                        {attempt.test.title}
                      </p>

                      <p className="mt-1 truncate text-xs text-slate-500">
                        {attempt.test.course.title}
                      </p>
                    </div>

                    <div className="shrink-0 text-right">
                      <p className="text-xs font-semibold uppercase text-slate-400">
                        {attempt.status.replace("_", " ")}
                      </p>

                      {attempt.score !== null && (
                        <p className="mt-1 font-bold text-blue-600">
                          {attempt.score}%
                        </p>
                      )}
                    </div>
                  </Link>
                ))
              ) : (
                <div className="rounded-2xl bg-slate-50 p-6 text-center">
                  <p className="font-semibold">
                    No test activity yet
                  </p>

                  <p className="mt-2 text-sm text-slate-500">
                    Your assessments will appear here.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-7">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-600">
                EDSEC Updates
              </p>

              <h2 className="mt-2 text-xl font-bold">
                Latest announcements
              </h2>
            </div>

            <div className="mt-6 space-y-3">
              {announcements.length > 0 ? (
                announcements.map((announcement) => (
                  <div
                    key={announcement.id}
                    className="rounded-2xl border border-slate-100 p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="font-semibold">
                        {announcement.title}
                      </h3>

                      {announcement.publishedAt && (
                        <span className="shrink-0 text-xs text-slate-400">
                          {announcement.publishedAt.toLocaleDateString()}
                        </span>
                      )}
                    </div>

                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
                      {announcement.content}
                    </p>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl bg-slate-50 p-6 text-center">
                  <p className="font-semibold">
                    No announcements
                  </p>

                  <p className="mt-2 text-sm text-slate-500">
                    New EDSEC updates will appear here.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ======================================================
            PROFILE
        ====================================================== */}

        <section className="mt-10">
          <div className="rounded-3xl border border-slate-200 bg-white p-7 sm:p-9">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-5">
                <div className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-2xl bg-blue-50 text-xl font-bold text-blue-600">
                  {user.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={user.avatarUrl}
                      alt={`${firstName} profile`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    firstName.charAt(0).toUpperCase()
                  )}
                </div>

                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-600">
                    Student Profile
                  </p>

                  <h2 className="mt-1 text-xl font-bold">
                    {fullName}
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    {user.email}
                  </p>
                </div>
              </div>

              <Link
                href="/student/profile"
                className="rounded-xl border border-slate-200 px-5 py-3 text-center font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Manage Profile
              </Link>
            </div>
          </div>
        </section>

        {/* ======================================================
            LEARNING FEATURES
        ====================================================== */}

        <section className="mt-10 rounded-3xl border border-blue-100 bg-blue-50 p-7 sm:p-9">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-600">
            Your EDSEC learning journey
          </p>

          <h2 className="mt-2 text-2xl font-bold">
            Everything you need in one student portal.
          </h2>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              "Courses & Lessons",
              "Lesson Progress",
              "Online Tests",
              "Test Results",
              "Student Projects",
              "Project Feedback",
              "Student Profile",
              "Announcements",
              "Live Classes",
              "Certificates",
              "Learning History",
              "Course Completion",
            ].map((feature) => (
              <div
                key={feature}
                className="rounded-2xl border border-blue-100 bg-white px-4 py-4 text-sm font-medium text-slate-700"
              >
                ✓ {feature}
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}