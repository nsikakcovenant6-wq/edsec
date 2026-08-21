import Link from "next/link";
import { redirect } from "next/navigation";

import { prisma } from "@/app/lib/prisma";
import { getCurrentUser } from "@/app/lib/auth";

const adminSections = [
  {
    title: "Applications",
    description:
      "Review applications, approve students, reject applications, and manage admission.",
    href: "/admin/applications",
    icon: "applications",
  },
  {
    title: "Students",
    description:
      "View registered students, profiles, enrollments, progress, and account status.",
    href: "/admin/students",
    icon: "students",
  },
  {
    title: "Courses",
    description:
      "Create and manage ICT programs, modules, lessons, publishing, and course content.",
    href: "/admin/courses",
    icon: "courses",
  },
  {
    title: "Tests & Assessments",
    description:
      "Create tests, questions, assessments, exams, assignments, and manage results.",
    href: "/admin/tests",
    icon: "tests",
  },
  {
    title: "Live Classes",
    description:
      "Schedule live classes, add meeting links, publish classes, and manage attendance.",
    href: "/admin/live-classes",
    icon: "live",
  },
  {
    title: "Cohorts",
    description:
      "Create training cohorts, set dates, assign students, and manage cohort status.",
    href: "/admin/cohorts",
    icon: "cohorts",
  },
  {
    title: "Payments",
    description:
      "Track student payments, balances, references, and payment methods.",
    href: "/admin/payments",
    icon: "payments",
  },
  {
    title: "Announcements",
    description:
      "Create and publish important updates that students will see in their portal.",
    href: "/admin/announcements",
    icon: "announcements",
  },
  {
    title: "Student Projects",
    description:
      "Manage student projects, submissions, grading, feedback, and featured projects.",
    href: "/admin/projects",
    icon: "projects",
  },
  {
    title: "Corporate Training",
    description:
      "Manage corporate training requests from organizations and businesses.",
    href: "/admin/corporate-training",
    icon: "corporate",
  },
  {
    title: "Blog",
    description:
      "Create, edit, publish, and manage EDSEC articles and educational content.",
    href: "/admin/blog",
    icon: "blog",
  },
  {
    title: "Gallery",
    description:
      "Manage images and visual content displayed throughout the EDSEC website.",
    href: "/admin/gallery",
    icon: "gallery",
  },
  {
    title: "Services",
    description:
      "Manage the services displayed on the public EDSEC website.",
    href: "/admin/services",
    icon: "services",
  },
  {
    title: "Website Settings",
    description:
      "Manage website information, contact details, branding, and other settings.",
    href: "/admin/settings",
    icon: "settings",
  },
];

const inspiringMessages = [
  "Every student you help equip today is a future problem-solver, creator, and leader.",
  "Great education does more than teach skills; it creates opportunities.",
  "Build EDSEC into a place where students discover what they are capable of.",
  "Small improvements today can create a stronger institution tomorrow.",
  "Technology changes quickly. Keep EDSEC learning, adapting, and growing.",
  "Your leadership helps create an environment where students can turn knowledge into real-world skills.",
];

function getGreeting() {
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 12) {
    return "Good morning";
  }

  if (hour >= 12 && hour < 17) {
    return "Good afternoon";
  }

  return "Good evening";
}

function formatDate(date: Date | null | undefined) {
  if (!date) return "—";

  return date.toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatDateTime(date: Date | null | undefined) {
  if (!date) return "—";

  return date.toLocaleString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatCurrency(amount: number) {
  return `₦${amount.toLocaleString("en-NG", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
}

function getStatusClass(status: string) {
  switch (status) {
    case "APPROVED":
    case "ACTIVE":
    case "PAID":
    case "PUBLISHED":
    case "PRESENT":
    case "COMPLETED":
    case "GRADED":
      return "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-100";

    case "PENDING":
    case "NEW":
    case "UPCOMING":
    case "SCHEDULED":
    case "PARTIAL":
    case "CONTACTED":
    case "IN_PROGRESS":
    case "SUBMITTED":
      return "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-100";

    case "REJECTED":
    case "CANCELLED":
    case "SUSPENDED":
    case "DROPPED":
    case "OVERDUE":
      return "bg-red-50 text-red-700 ring-1 ring-inset ring-red-100";

    default:
      return "bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-200";
  }
}

function getActivityIcon(type: string) {
  switch (type) {
    case "LESSON_COMPLETED":
      return "✓";

    case "TEST_COMPLETED":
      return "T";

    case "PROJECT_SUBMITTED":
      return "P";

    case "LIVE_CLASS_ATTENDED":
      return "L";

    case "ACHIEVEMENT_EARNED":
      return "★";

    case "PAYMENT_MADE":
      return "₦";

    case "COURSE_ENROLLED":
      return "+";

    case "LOGIN":
      return "→";

    default:
      return "•";
  }
}

export default async function AdminDashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "ADMIN") {
    redirect("/student");
  }

  const now = new Date();

  const [
    studentCount,
    pendingApplications,
    applicationCount,
    activeCourses,
    totalModules,
    publishedModules,
    totalTests,
    publishedTests,
    corporateInquiryCount,
    pendingPayments,
    totalPayments,
    upcomingClasses,
    liveClasses,
    cohortCount,
    activeCohorts,
    projectCount,
    pendingProjects,
    announcementCount,
    publishedAnnouncements,
    galleryCount,
    blogCount,
    recentStudents,
    recentApplications,
    recentAnnouncements,
    recentActivities,
    recentPayments,
  ] = await Promise.all([
    prisma.user.count({
      where: {
        role: "STUDENT",
      },
    }),

    prisma.application.count({
      where: {
        status: "PENDING",
      },
    }),

    prisma.application.count(),

    prisma.course.count({
      where: {
        status: "ACTIVE",
      },
    }),

    prisma.courseModule.count(),

    prisma.courseModule.count({
      where: {
        isPublished: true,
      },
    }),

    prisma.test.count(),

    prisma.test.count({
      where: {
        status: "PUBLISHED",
      },
    }),

    prisma.corporateInquiry.count({
      where: {
        status: {
          in: ["NEW", "CONTACTED", "IN_PROGRESS"],
        },
      },
    }),

    prisma.payment.count({
      where: {
        status: {
          in: ["PENDING", "PARTIAL", "OVERDUE"],
        },
      },
    }),

    prisma.payment.aggregate({
      _sum: {
        amountPaid: true,
      },
      where: {
        status: {
          in: ["PAID", "PARTIAL"],
        },
      },
    }),

    prisma.liveClass.findMany({
      where: {
        isPublished: true,
        status: "SCHEDULED",
        scheduledAt: {
          gte: now,
        },
      },
      orderBy: {
        scheduledAt: "asc",
      },
      take: 5,
      include: {
        course: {
          select: {
            title: true,
          },
        },
      },
    }),

    prisma.liveClass.findMany({
      where: {
        status: "LIVE",
        isPublished: true,
      },
      orderBy: {
        scheduledAt: "asc",
      },
      take: 5,
      include: {
        course: {
          select: {
            title: true,
          },
        },
      },
    }),

    prisma.cohort.count(),

    prisma.cohort.count({
      where: {
        status: "ACTIVE",
      },
    }),

    prisma.studentProject.count(),

    prisma.studentProjectRecord.count({
      where: {
        status: {
          in: ["PENDING", "SUBMITTED"],
        },
      },
    }),

    prisma.announcement.count(),

    prisma.announcement.count({
      where: {
        status: "PUBLISHED",
      },
    }),

    prisma.galleryItem.count(),

    prisma.blogPost.count(),

    prisma.user.findMany({
      where: {
        role: "STUDENT",
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        status: true,
        createdAt: true,
        studentProfile: {
          select: {
            studentNumber: true,
          },
        },
      },
    }),

    prisma.application.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 6,
      include: {
        course: {
          select: {
            title: true,
          },
        },
      },
    }),

    prisma.announcement.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
    }),

    prisma.studentActivity.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 8,
      include: {
        student: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        enrollment: {
          include: {
            course: {
              select: {
                title: true,
              },
            },
          },
        },
      },
    }),

    prisma.payment.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
      include: {
        student: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    }),
  ]);

  const greeting = getGreeting();

  const message =
    inspiringMessages[
      now.getDate() % inspiringMessages.length
    ];

  const totalAmountPaid = totalPayments._sum.amountPaid ?? 0;

  const totalClasses =
    liveClasses.length + upcomingClasses.length;

  const adminName =
    `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() ||
    "Administrator";

  const firstName = user.firstName?.trim() || "Administrator";

  const todayLabel = now.toLocaleDateString("en-NG", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <main className="min-h-screen bg-[#f8fafc] text-slate-950">
      {/* =========================================================
          TOP HEADER
      ========================================================== */}

      <header className="border-b border-slate-200/80 bg-white">
        <div className="mx-auto max-w-375 px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />

                <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">
                  EDSEC ICT Institute
                </p>
              </div>

              <div className="mt-3 flex flex-wrap items-end gap-x-4 gap-y-1">
                <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                  {greeting}, {firstName}
                </h1>

                <span className="mb-1 hidden text-sm text-slate-400 sm:block">
                  •
                </span>

                <p className="text-sm font-medium text-slate-500">
                  {todayLabel}
                </p>
              </div>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Here is your operational overview of students, admissions,
                learning, payments, and EDSEC activities.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
              >
                <Icon name="external" className="h-4 w-4" />
                View Website
              </Link>

              <Link
                href="/admin/settings"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-600/20 transition hover:bg-blue-700"
              >
                <Icon name="settings" className="h-4 w-4" />
                Settings
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* =========================================================
          MAIN CONTENT
      ========================================================== */}

      <section className="mx-auto max-w-375 sm:px-6 sm:py-8 lg:px-8">
        {/* =======================================================
            HERO / OVERVIEW
        ======================================================== */}

        <section className="relative overflow-hidden rounded-[28px] bg-slate-950 shadow-xl shadow-slate-950/10">
          <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-blue-600/20 blur-3xl" />
          <div className="absolute -bottom-32 left-1/3 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />

          <div className="relative grid gap-8 p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:p-10">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />

                <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-blue-300">
                  Administrator Overview
                </span>
              </div>

              <h2 className="mt-5 max-w-2xl text-2xl font-bold leading-tight text-white sm:text-3xl lg:text-4xl">
                {message}
              </h2>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400">
                Keep building an institution where practical education,
                technology, discipline, and opportunity come together.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/admin/applications"
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-slate-100"
                >
                  Review Applications
                  <Icon name="arrow" className="h-4 w-4" />
                </Link>

                <Link
                  href="/admin/courses"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Manage Courses
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 self-end sm:min-w-85">
              <HeroMetric
                value={studentCount}
                label="Students"
                icon="students"
              />

              <HeroMetric
                value={activeCourses}
                label="Active courses"
                icon="courses"
              />

              <HeroMetric
                value={activeCohorts}
                label="Active cohorts"
                icon="cohorts"
              />

              <HeroMetric
                value={liveClasses.length}
                label="Live now"
                icon="live"
                live={liveClasses.length > 0}
              />
            </div>
          </div>
        </section>

        {/* =======================================================
            PRIMARY STATISTICS
        ======================================================== */}

        <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            value={String(studentCount)}
            label="Students"
            description="Registered EDSEC students"
            href="/admin/students"
            icon="students"
          />

          <StatCard
            value={String(pendingApplications)}
            label="Pending Applications"
            description={`${applicationCount} total applications`}
            href="/admin/applications"
            icon="applications"
            highlight={pendingApplications > 0}
          />

          <StatCard
            value={String(activeCourses)}
            label="Active Courses"
            description={`${publishedModules} published modules`}
            href="/admin/courses"
            icon="courses"
          />

          <StatCard
            value={String(corporateInquiryCount)}
            label="Corporate Inquiries"
            description="Open corporate requests"
            href="/admin/corporate-training"
            icon="corporate"
          />
        </section>

        {/* =======================================================
            SECONDARY STATISTICS
        ======================================================== */}

        <section className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          <MiniStat
            label="Payments Attention"
            value={pendingPayments}
            href="/admin/payments"
            icon="payments"
            alert={pendingPayments > 0}
          />

          <MiniStat
            label="Amount Collected"
            value={formatCurrency(totalAmountPaid)}
            href="/admin/payments"
            icon="naira"
          />

          <MiniStat
            label="Upcoming / Live"
            value={totalClasses}
            href="/admin/live-classes"
            icon="live"
          />

          <MiniStat
            label="Tests Published"
            value={publishedTests}
            href="/admin/tests"
            icon="tests"
          />

          <MiniStat
            label="Projects Awaiting"
            value={pendingProjects}
            href="/admin/projects"
            icon="projects"
          />

          <MiniStat
            label="Announcements"
            value={publishedAnnouncements}
            href="/admin/announcements"
            icon="announcements"
          />
        </section>

        {/* =======================================================
            QUICK ACTIONS
        ======================================================== */}

        <section className="mt-10">
          <SectionHeading
            eyebrow="Quick Actions"
            title="Manage EDSEC"
            description="Get to the most important administrative tasks quickly."
          />

          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <QuickAction
              href="/admin/applications"
              title="Review Applications"
              description="Approve or reject new student applications."
              icon="applications"
              badge={
                pendingApplications > 0
                  ? `${pendingApplications} pending`
                  : undefined
              }
            />

            <QuickAction
              href="/admin/students"
              title="Manage Students"
              description="View students, profiles, enrollments and status."
              icon="students"
            />

            <QuickAction
              href="/admin/courses"
              title="Manage Courses"
              description="Create courses, modules and lessons."
              icon="courses"
            />

            <QuickAction
              href="/admin/live-classes"
              title="Create Live Class"
              description="Schedule and publish an online class."
              icon="live"
            />
          </div>
        </section>

        {/* =======================================================
            APPLICATIONS + STUDENTS
        ======================================================== */}

        <section className="mt-8 grid gap-6 xl:grid-cols-2">
          {/* APPLICATIONS */}

          <DashboardCard>
            <CardHeader
              eyebrow="Admissions"
              title="Recent Applications"
              href="/admin/applications"
              action="View all"
            />

            <div className="mt-5 space-y-2">
              {recentApplications.length > 0 ? (
                recentApplications.map((application) => (
                  <Link
                    key={application.id}
                    href="/admin/applications"
                    className="group flex items-center justify-between gap-4 rounded-2xl border border-transparent p-3.5 transition hover:border-blue-100 hover:bg-blue-50/50"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <Avatar
                        name={application.fullName}
                        variant="blue"
                      />

                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-slate-900 group-hover:text-blue-700">
                          {application.fullName}
                        </p>

                        <p className="mt-0.5 truncate text-xs text-slate-500">
                          {application.course?.title ??
                            "Course not selected"}
                        </p>

                        <p className="mt-1 text-[11px] text-slate-400">
                          Applied {formatDate(application.createdAt)}
                        </p>
                      </div>
                    </div>

                    <StatusBadge status={application.status} />
                  </Link>
                ))
              ) : (
                <EmptyState text="No applications yet." />
              )}
            </div>
          </DashboardCard>

          {/* STUDENTS */}

          <DashboardCard>
            <CardHeader
              eyebrow="Students"
              title="Recently Registered"
              href="/admin/students"
              action="View all"
            />

            <div className="mt-5 space-y-2">
              {recentStudents.length > 0 ? (
                recentStudents.map((student) => (
                  <Link
                    key={student.id}
                    href="/admin/students"
                    className="group flex items-center justify-between gap-4 rounded-2xl border border-transparent p-3.5 transition hover:border-blue-100 hover:bg-blue-50/50"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <Avatar
                        name={`${student.firstName} ${student.lastName}`}
                        variant="blue"
                      />

                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-slate-900 group-hover:text-blue-700">
                          {student.firstName} {student.lastName}
                        </p>

                        <p className="truncate text-xs text-slate-500">
                          {student.studentProfile?.studentNumber ??
                            student.email}
                        </p>

                        <p className="mt-1 text-[11px] text-slate-400">
                          Joined {formatDate(student.createdAt)}
                        </p>
                      </div>
                    </div>

                    <StatusBadge status={student.status} />
                  </Link>
                ))
              ) : (
                <EmptyState text="No students registered yet." />
              )}
            </div>
          </DashboardCard>
        </section>

        {/* =======================================================
            LIVE CLASSES
        ======================================================== */}

        <section className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white">
          <div className="border-b border-slate-100 p-6 sm:p-7">
            <CardHeader
              eyebrow="Live Learning"
              title="Live Classes"
              href="/admin/live-classes"
              action="Manage classes"
            />
          </div>

          <div className="p-6 sm:p-7">
            {liveClasses.length > 0 && (
              <div className="mb-5">
                <div className="mb-3 flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
                  </span>

                  <p className="text-xs font-bold uppercase tracking-[0.15em] text-red-600">
                    Live now
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {liveClasses.map((liveClass) => (
                    <LiveClassCard
                      key={liveClass.id}
                      liveClass={liveClass}
                      isLive
                    />
                  ))}
                </div>
              </div>
            )}

            {upcomingClasses.length > 0 && (
              <div className={liveClasses.length > 0 ? "mt-7" : ""}>
                <div className="mb-3 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-blue-500" />

                  <p className="text-xs font-bold uppercase tracking-[0.15em] text-blue-600">
                    Upcoming
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {upcomingClasses.map((liveClass) => (
                    <LiveClassCard
                      key={liveClass.id}
                      liveClass={liveClass}
                    />
                  ))}
                </div>
              </div>
            )}

            {liveClasses.length === 0 &&
              upcomingClasses.length === 0 && (
                <EmptyState text="No upcoming or live classes." />
              )}
          </div>
        </section>

        {/* =======================================================
            ACTIVITY + PAYMENTS
        ======================================================== */}

        <section className="mt-6 grid gap-6 xl:grid-cols-2">
          {/* ACTIVITY */}

          <DashboardCard>
            <CardHeader
              eyebrow="Activity"
              title="Recent Student Activity"
            />

            <div className="mt-5 space-y-1">
              {recentActivities.length > 0 ? (
                recentActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex gap-3 rounded-2xl p-3 transition hover:bg-slate-50"
                  >
                    <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-blue-50 text-xs font-bold text-blue-600">
                      {getActivityIcon(activity.type)}
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-900">
                        {activity.student.firstName}{" "}
                        {activity.student.lastName}
                      </p>

                      <p className="mt-0.5 text-sm text-slate-600">
                        {activity.title}
                      </p>

                      {activity.enrollment?.course.title && (
                        <p className="mt-1 truncate text-xs text-slate-400">
                          {activity.enrollment.course.title}
                        </p>
                      )}

                      <p className="mt-1 text-[11px] text-slate-400">
                        {formatDateTime(activity.createdAt)}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <EmptyState text="No student activity yet." />
              )}
            </div>
          </DashboardCard>

          {/* PAYMENTS */}

          <DashboardCard>
            <CardHeader
              eyebrow="Finance"
              title="Recent Payments"
              href="/admin/payments"
              action="View all"
            />

            <div className="mt-5 space-y-2">
              {recentPayments.length > 0 ? (
                recentPayments.map((payment) => (
                  <div
                    key={payment.id}
                    className="flex items-center justify-between gap-4 rounded-2xl border border-transparent p-3.5 transition hover:border-slate-100 hover:bg-slate-50"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-50 text-sm font-bold text-emerald-700">
                        ₦
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-slate-900">
                          {payment.student.firstName}{" "}
                          {payment.student.lastName}
                        </p>

                        <p className="mt-0.5 text-sm font-semibold text-slate-700">
                          {formatCurrency(payment.amountPaid)}
                        </p>

                        <p className="mt-1 text-[11px] text-slate-400">
                          {formatDate(payment.createdAt)}
                          {payment.method
                            ? ` • ${payment.method.replace(
                                "_",
                                " "
                              )}`
                            : ""}
                        </p>
                      </div>
                    </div>

                    <StatusBadge status={payment.status} />
                  </div>
                ))
              ) : (
                <EmptyState text="No payment records yet." />
              )}
            </div>
          </DashboardCard>
        </section>

        {/* =======================================================
            ANNOUNCEMENTS
        ======================================================== */}

        <section className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white">
          <div className="border-b border-slate-100 p-6 sm:p-7">
            <CardHeader
              eyebrow="EDSEC Updates"
              title="Latest Announcements"
              href="/admin/announcements"
              action="Manage"
            />
          </div>

          <div className="grid gap-4 p-6 sm:grid-cols-2 sm:p-7 lg:grid-cols-3">
            {recentAnnouncements.length > 0 ? (
              recentAnnouncements.map((announcement) => (
                <div
                  key={announcement.id}
                  className="rounded-2xl border border-slate-100 p-5 transition hover:border-blue-100 hover:shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-600">
                      <Icon name="announcements" className="h-4 w-4" />
                    </div>

                    <StatusBadge status={announcement.status} />
                  </div>

                  <h3 className="mt-4 line-clamp-2 font-bold text-slate-900">
                    {announcement.title}
                  </h3>

                  <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-500">
                    {announcement.content}
                  </p>

                  <p className="mt-4 text-[11px] font-medium text-slate-400">
                    Created {formatDate(announcement.createdAt)}
                  </p>
                </div>
              ))
            ) : (
              <div className="sm:col-span-2 lg:col-span-3">
                <EmptyState text="No announcements created yet." />
              </div>
            )}
          </div>
        </section>

        {/* =======================================================
            PLATFORM SNAPSHOT
        ======================================================== */}

        <section className="mt-10">
          <SectionHeading
            eyebrow="Platform Snapshot"
            title="EDSEC at a glance"
            description="A quick view of the content and academic infrastructure currently managed from the platform."
          />

          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <SnapshotCard
              label="Course Modules"
              value={totalModules}
              secondary={`${publishedModules} published`}
              href="/admin/courses"
              icon="modules"
            />

            <SnapshotCard
              label="Tests"
              value={totalTests}
              secondary={`${publishedTests} published`}
              href="/admin/tests"
              icon="tests"
            />

            <SnapshotCard
              label="Training Cohorts"
              value={cohortCount}
              secondary={`${activeCohorts} active`}
              href="/admin/cohorts"
              icon="cohorts"
            />

            <SnapshotCard
              label="Student Projects"
              value={projectCount}
              secondary={`${pendingProjects} awaiting review`}
              href="/admin/projects"
              icon="projects"
            />

            <SnapshotCard
              label="Announcements"
              value={announcementCount}
              secondary={`${publishedAnnouncements} published`}
              href="/admin/announcements"
              icon="announcements"
            />

            <SnapshotCard
              label="Gallery Items"
              value={galleryCount}
              secondary="Website media"
              href="/admin/gallery"
              icon="gallery"
            />

            <SnapshotCard
              label="Blog Posts"
              value={blogCount}
              secondary="Educational content"
              href="/admin/blog"
              icon="blog"
            />

            <SnapshotCard
              label="Total Applications"
              value={applicationCount}
              secondary={`${pendingApplications} pending`}
              href="/admin/applications"
              icon="applications"
            />
          </div>
        </section>

        {/* =======================================================
            MANAGEMENT
        ======================================================== */}

        <section className="mt-10">
          <SectionHeading
            eyebrow="Administration"
            title="EDSEC Management"
            description="Manage the academic, student, financial, content, and operational sides of the EDSEC ICT Institute."
          />

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {adminSections.map((section) => (
              <Link
                key={section.title}
                href={section.href}
                className="group rounded-2xl border border-slate-200 bg-white p-5 transition duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-100/40"
              >
                <div className="flex items-start justify-between">
                  <div className="grid h-11 w-11 place-items-center rounded-xl bg-blue-50 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
                    <Icon
                      name={section.icon}
                      className="h-5 w-5"
                    />
                  </div>

                  <span className="grid h-8 w-8 place-items-center rounded-lg text-slate-300 transition group-hover:bg-blue-50 group-hover:text-blue-600">
                    <Icon
                      name="arrow"
                      className="h-4 w-4"
                    />
                  </span>
                </div>

                <h3 className="mt-5 font-bold text-slate-950 group-hover:text-blue-600">
                  {section.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {section.description}
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* =======================================================
            ADMIN ACCOUNT
        ======================================================== */}

        <section className="mt-10 overflow-hidden rounded-3xl bg-slate-950 shadow-xl shadow-slate-950/10">
          <div className="relative p-6 sm:p-8">
            <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-blue-600/10 blur-3xl" />

            <div className="relative flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-4">
                <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-blue-600 text-lg font-bold text-white shadow-lg shadow-blue-600/20">
                  {user.firstName?.charAt(0)?.toUpperCase() || "A"}
                  {user.lastName?.charAt(0)?.toUpperCase() || ""}
                </div>

                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-blue-400">
                    Administrator Account
                  </p>

                  <h2 className="mt-1 text-xl font-bold text-white sm:text-2xl">
                    {adminName}
                  </h2>

                  <p className="mt-1 text-sm text-slate-400">
                    {user.email}
                  </p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <AccountDetail
                  label="Role"
                  value={user.role}
                />

                <AccountDetail
                  label="Status"
                  value={user.status}
                />

                <AccountDetail
                  label="Access"
                  value="Full Admin"
                />
              </div>
            </div>
          </div>
        </section>

        {/* =======================================================
            FOOTER
        ======================================================== */}

        <footer className="py-10 text-center">
          <p className="text-sm font-bold text-slate-700">
            EDSEC ICT Institute
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Innovate. Educate. Elevate.
          </p>
        </footer>
      </section>
    </main>
  );
}

/* ================================================================
   DASHBOARD COMPONENTS
================================================================ */

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
        {eyebrow}
      </p>

      <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">
        {title}
      </h2>

      <p className="mt-1.5 max-w-2xl text-sm leading-6 text-slate-500">
        {description}
      </p>
    </div>
  );
}

function DashboardCard({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-7">
      {children}
    </div>
  );
}

function CardHeader({
  eyebrow,
  title,
  href,
  action,
}: {
  eyebrow: string;
  title: string;
  href?: string;
  action?: string;
}) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-600">
          {eyebrow}
        </p>

        <h2 className="mt-2 text-xl font-bold tracking-tight text-slate-950">
          {title}
        </h2>
      </div>

      {href && action && (
        <Link
          href={href}
          className="shrink-0 text-sm font-bold text-blue-600 transition hover:text-blue-700"
        >
          {action} →
        </Link>
      )}
    </div>
  );
}

function HeroMetric({
  value,
  label,
  icon,
  live = false,
}: {
  value: number;
  label: string;
  icon: string;
  live?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/6 p-4 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div className="grid h-8 w-8 place-items-center rounded-lg bg-white/10 text-white">
          <Icon name={icon} className="h-4 w-4" />
        </div>

        {live && (
          <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-red-300">
            <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
            Live
          </span>
        )}
      </div>

      <p className="mt-4 text-2xl font-bold text-white">
        {value}
      </p>

      <p className="mt-1 text-xs text-slate-400">
        {label}
      </p>
    </div>
  );
}

function StatCard({
  value,
  label,
  description,
  href,
  icon,
  highlight = false,
}: {
  value: string;
  label: string;
  description: string;
  href: string;
  icon: string;
  highlight?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`group rounded-2xl border bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-lg ${
        highlight
          ? "border-amber-200 hover:border-amber-300"
          : "border-slate-200 hover:border-blue-200"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div
          className={`grid h-10 w-10 place-items-center rounded-xl ${
            highlight
              ? "bg-amber-50 text-amber-600"
              : "bg-blue-50 text-blue-600"
          }`}
        >
          <Icon name={icon} className="h-5 w-5" />
        </div>

        <span className="text-slate-300 transition group-hover:text-blue-500">
          <Icon name="arrow" className="h-4 w-4" />
        </span>
      </div>

      <p className="mt-5 text-3xl font-bold tracking-tight text-slate-950">
        {value}
      </p>

      <p className="mt-1.5 font-bold text-slate-900">
        {label}
      </p>

      <p className="mt-1 text-xs leading-5 text-slate-500">
        {description}
      </p>
    </Link>
  );
}

function MiniStat({
  label,
  value,
  href,
  icon,
  alert = false,
}: {
  label: string;
  value: number | string;
  href: string;
  icon: string;
  alert?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`group rounded-2xl border bg-white p-4 transition hover:border-blue-200 hover:shadow-md ${
        alert
          ? "border-amber-200"
          : "border-slate-200"
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <p className="line-clamp-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          {label}
        </p>

        <Icon
          name={icon}
          className={`h-4 w-4 shrink-0 ${
            alert ? "text-amber-500" : "text-slate-300"
          }`}
        />
      </div>

      <p className="mt-2 text-xl font-bold tracking-tight text-slate-950">
        {value}
      </p>
    </Link>
  );
}

function QuickAction({
  href,
  title,
  description,
  icon,
  badge,
}: {
  href: string;
  title: string;
  description: string;
  icon: string;
  badge?: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-lg"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
          <Icon name={icon} className="h-5 w-5" />
        </div>

        {badge && (
          <span className="rounded-full bg-amber-50 px-2 py-1 text-[10px] font-bold text-amber-700">
            {badge}
          </span>
        )}
      </div>

      <h3 className="mt-4 font-bold text-slate-900 group-hover:text-blue-600">
        {title}
      </h3>

      <p className="mt-1.5 text-sm leading-6 text-slate-500">
        {description}
      </p>
    </Link>
  );
}

function LiveClassCard({
  liveClass,
  isLive = false,
}: {
  liveClass: {
    id: string;
    title: string;
    scheduledAt: Date;
    course: {
      title: string;
    };
  };
  isLive?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-5 transition hover:shadow-md ${
        isLive
          ? "border-red-100 bg-red-50/50"
          : "border-slate-100 bg-slate-50/50"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <span
          className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
            isLive
              ? "bg-red-100 text-red-700"
              : "bg-blue-50 text-blue-700"
          }`}
        >
          {isLive ? "Live now" : "Upcoming"}
        </span>

        <Icon
          name="live"
          className={`h-4 w-4 ${
            isLive ? "text-red-500" : "text-blue-500"
          }`}
        />
      </div>

      <h3 className="mt-4 line-clamp-2 font-bold text-slate-900">
        {liveClass.title}
      </h3>

      <p className="mt-1 line-clamp-1 text-sm text-slate-500">
        {liveClass.course.title}
      </p>

      <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
        <Icon name="calendar" className="h-3.5 w-3.5" />
        {formatDateTime(liveClass.scheduledAt)}
      </div>
    </div>
  );
}

function SnapshotCard({
  label,
  value,
  secondary,
  href,
  icon,
}: {
  label: string;
  value: number;
  secondary: string;
  href: string;
  icon: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-blue-200 hover:shadow-md"
    >
      <div className="flex items-center gap-3">
        <div className="grid h-9 w-9 place-items-center rounded-xl bg-slate-50 text-slate-500 transition group-hover:bg-blue-50 group-hover:text-blue-600">
          <Icon name={icon} className="h-4 w-4" />
        </div>

        <p className="text-xs font-bold text-slate-600">
          {label}
        </p>
      </div>

      <p className="mt-4 text-2xl font-bold tracking-tight text-slate-950">
        {value}
      </p>

      <p className="mt-1 text-xs text-slate-400">
        {secondary}
      </p>
    </Link>
  );
}

function Avatar({
  name,
  variant = "blue",
}: {
  name: string;
  variant?: "blue";
}) {
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

  return (
    <div
      className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl text-xs font-bold ${
        variant === "blue"
          ? "bg-blue-50 text-blue-600"
          : "bg-slate-100 text-slate-600"
      }`}
    >
      {initials || "?"}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${getStatusClass(
        status
      )}`}
    >
      {status.replaceAll("_", " ")}
    </span>
  );
}

function AccountDetail({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
        {label}
      </p>

      <p className="mt-1 text-sm font-semibold text-white">
        {value.replaceAll("_", " ")}
      </p>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-7 text-center">
      <div className="mx-auto grid h-10 w-10 place-items-center rounded-xl bg-white text-slate-300 shadow-sm">
        <Icon name="inbox" className="h-5 w-5" />
      </div>

      <p className="mt-3 text-sm font-medium text-slate-500">
        {text}
      </p>
    </div>
  );
}

/* ================================================================
   ICON SYSTEM
================================================================ */

function Icon({
  name,
  className = "h-5 w-5",
}: {
  name: string;
  className?: string;
}) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  switch (name) {
    case "students":
      return (
        <svg viewBox="0 0 24 24" className={className} {...common}>
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      );

    case "applications":
      return (
        <svg viewBox="0 0 24 24" className={className} {...common}>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
          <path d="M14 2v6h6" />
          <path d="M8 13h8" />
          <path d="M8 17h5" />
        </svg>
      );

    case "courses":
    case "modules":
      return (
        <svg viewBox="0 0 24 24" className={className} {...common}>
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" />
          <path d="M8 6h8" />
          <path d="M8 10h8" />
        </svg>
      );

    case "tests":
      return (
        <svg viewBox="0 0 24 24" className={className} {...common}>
          <path d="M9 11l3 3L22 4" />
          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
          <path d="M7 7h4" />
        </svg>
      );

    case "live":
      return (
        <svg viewBox="0 0 24 24" className={className} {...common}>
          <circle cx="12" cy="12" r="3" />
          <path d="M19 5a10 10 0 0 1 0 14" />
          <path d="M5 5a10 10 0 0 0 0 14" />
          <path d="M22 2a14 14 0 0 1 0 20" />
          <path d="M2 2a14 14 0 0 0 0 20" />
        </svg>
      );

    case "cohorts":
      return (
        <svg viewBox="0 0 24 24" className={className} {...common}>
          <circle cx="12" cy="7" r="4" />
          <path d="M5.5 21a6.5 6.5 0 0 1 13 0" />
          <path d="M18 5a4 4 0 0 1 0 7" />
          <path d="M21 19a5 5 0 0 0-3-4.58" />
        </svg>
      );

    case "payments":
    case "naira":
      return (
        <svg viewBox="0 0 24 24" className={className} {...common}>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="M7 9v6" />
          <path d="M10 9l4 6" />
          <path d="M14 9v6" />
          <path d="M17 9h-4" />
          <path d="M17 15h-4" />
        </svg>
      );

    case "announcements":
      return (
        <svg viewBox="0 0 24 24" className={className} {...common}>
          <path d="M3 11v2a2 2 0 0 0 2 2h2l4 5h2l-1-5h3l5 3V6l-5 3H5a2 2 0 0 0-2 2Z" />
        </svg>
      );

    case "projects":
      return (
        <svg viewBox="0 0 24 24" className={className} {...common}>
          <path d="M4 4h16v16H4z" />
          <path d="M8 8h8" />
          <path d="M8 12h8" />
          <path d="M8 16h5" />
        </svg>
      );

    case "corporate":
      return (
        <svg viewBox="0 0 24 24" className={className} {...common}>
          <path d="M3 21h18" />
          <path d="M5 21V5h10v16" />
          <path d="M15 9h4v12" />
          <path d="M8 8h4" />
          <path d="M8 12h4" />
          <path d="M8 16h4" />
        </svg>
      );

    case "blog":
      return (
        <svg viewBox="0 0 24 24" className={className} {...common}>
          <path d="M4 5a2 2 0 0 1 2-2h13v18H6a2 2 0 0 1-2-2Z" />
          <path d="M8 7h7" />
          <path d="M8 11h7" />
          <path d="M8 15h5" />
        </svg>
      );

    case "gallery":
      return (
        <svg viewBox="0 0 24 24" className={className} {...common}>
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <circle cx="8.5" cy="9" r="1.5" />
          <path d="M21 15l-5-5L5 20" />
        </svg>
      );

    case "services":
      return (
        <svg viewBox="0 0 24 24" className={className} {...common}>
          <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5Z" />
          <path d="M19 15l.75 2.25L22 18l-2.25.75L19 21l-.75-2.25L16 18l2.25-.75Z" />
        </svg>
      );

    case "settings":
      return (
        <svg viewBox="0 0 24 24" className={className} {...common}>
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-1.41 1.41-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1.03 1.56V20h-2v-.09a1.7 1.7 0 0 0-1.03-1.56 1.7 1.7 0 0 0-1.88.34l-.06.06-1.41-1.41.06-.06A1.7 1.7 0 0 0 9.4 15a1.7 1.7 0 0 0-1.56-1.03H7v-2h.84A1.7 1.7 0 0 0 9.4 11a1.7 1.7 0 0 0-.34-1.88L9 9.06l1.41-1.41.06.06A1.7 1.7 0 0 0 12.35 8.05 1.7 1.7 0 0 0 13.38 6.5V6h2v.5a1.7 1.7 0 0 0 1.03 1.56 1.7 1.7 0 0 0 1.88-.34l.06-.06 1.41 1.41-.06.06A1.7 1.7 0 0 0 19.4 11c.23.62.82 1.03 1.48 1.03H21v2h-.12A1.7 1.7 0 0 0 19.4 15Z" />
        </svg>
      );

    case "calendar":
      return (
        <svg viewBox="0 0 24 24" className={className} {...common}>
          <rect x="3" y="4" width="18" height="17" rx="2" />
          <path d="M16 2v4M8 2v4M3 10h18" />
        </svg>
      );

    case "external":
      return (
        <svg viewBox="0 0 24 24" className={className} {...common}>
          <path d="M14 3h7v7" />
          <path d="M10 14L21 3" />
          <path d="M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5" />
        </svg>
      );

    case "arrow":
      return (
        <svg viewBox="0 0 24 24" className={className} {...common}>
          <path d="M5 12h14" />
          <path d="m13 6 6 6-6 6" />
        </svg>
      );

    case "inbox":
      return (
        <svg viewBox="0 0 24 24" className={className} {...common}>
          <path d="M4 4h16l1 11H3L4 4Z" />
          <path d="M3 15l2 5h14l2-5" />
          <path d="M8 11h8" />
        </svg>
      );

    default:
      return (
        <svg viewBox="0 0 24 24" className={className} {...common}>
          <circle cx="12" cy="12" r="8" />
        </svg>
      );
  }
}