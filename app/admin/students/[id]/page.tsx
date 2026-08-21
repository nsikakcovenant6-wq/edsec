import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/app/lib/prisma";
import { requireRole } from "@/app/lib/auth";
import StudentStatusButton from "../student-status-button";

export default async function StudentDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const admin = await requireRole("ADMIN");

  if (!admin) {
    redirect("/login");
  }

  const { id } = await params;

  const student = await prisma.user.findUnique({
    where: {
      id,
    },
    include: {
      studentProfile: true,

      enrollments: {
        include: {
          course: true,
          cohort: true,
          lessonProgress: {
            include: {
              lesson: true,
            },
          },
          payments: {
            orderBy: {
              createdAt: "desc",
            },
          },
          grades: {
            include: {
              assessment: true,
            },
            orderBy: {
              gradedAt: "desc",
            },
          },
          liveClasses: {
            include: {
              liveClass: {
                include: {
                  course: true,
                },
              },
            },
          },
          achievements: {
            include: {
              achievement: true,
            },
          },
          activities: {
            orderBy: {
              createdAt: "desc",
            },
            take: 10,
          },
        },
      },

      payments: {
        orderBy: {
          createdAt: "desc",
        },
      },

      attempts: {
        include: {
          test: {
            include: {
              course: true,
            },
          },
          answers: true,
        },
        orderBy: {
          startedAt: "desc",
        },
      },

      attendances: {
        include: {
          liveClass: {
            include: {
              course: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      },

      achievements: {
        include: {
          achievement: true,
        },
        orderBy: {
          earnedAt: "desc",
        },
      },

      activities: {
        orderBy: {
          createdAt: "desc",
        },
        take: 20,
      },

      projects: {
        include: {
          project: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!student || student.role !== "STUDENT") {
    notFound();
  }

  const totalPaid = student.payments.reduce(
    (total, payment) => total + payment.amountPaid,
    0
  );

  const totalBalance = student.payments.reduce(
    (total, payment) => total + payment.balance,
    0
  );

  const activeEnrollments = student.enrollments.filter(
    (enrollment) => enrollment.status === "ACTIVE"
  );

  const completedEnrollments = student.enrollments.filter(
    (enrollment) => enrollment.status === "COMPLETED"
  );

  const totalAttendance = student.attendances.length;

  const presentAttendance = student.attendances.filter(
    (attendance) =>
      attendance.status === "PRESENT" ||
      attendance.status === "LATE"
  ).length;

  const attendancePercentage =
    totalAttendance > 0
      ? Math.round((presentAttendance / totalAttendance) * 100)
      : 0;

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-6 lg:px-8">
          <Link
            href="/admin/students"
            className="text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            ← Back to Students
          </Link>

          <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-blue-50 text-2xl font-bold text-blue-600">
                {getInitials(student.firstName, student.lastName)}
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-3xl font-bold tracking-tight text-slate-950">
                    {student.firstName} {student.lastName}
                  </h1>

                  <StatusBadge status={student.status} />
                </div>

                <p className="mt-1 text-slate-600">{student.email}</p>

                {student.studentProfile?.studentNumber && (
                  <p className="mt-1 text-sm font-semibold text-blue-600">
                    {student.studentProfile.studentNumber}
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              {student.status === "ACTIVE" ? (
                <StudentStatusButton
                  studentId={student.id}
                  status="SUSPENDED"
                  label="Suspend Student"
                  variant="danger"
                />
              ) : (
                <StudentStatusButton
                  studentId={student.id}
                  status="ACTIVE"
                  label="Activate Student"
                  variant="primary"
                />
              )}
            </div>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
        {/* Overview */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            value={activeEnrollments.length}
            label="Active Courses"
            description="Current enrollments"
          />

          <StatCard
            value={completedEnrollments.length}
            label="Completed"
            description="Completed courses"
          />

          <StatCard
            value={`₦${totalPaid.toLocaleString("en-NG")}`}
            label="Total Paid"
            description="Recorded payments"
          />

          <StatCard
            value={`${attendancePercentage}%`}
            label="Attendance"
            description={`${totalAttendance} class records`}
          />
        </div>

        {/* Personal Information */}
        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <SectionHeading
            eyebrow="Student Profile"
            title="Personal Information"
          />

          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Detail label="First Name" value={student.firstName} />

            <Detail label="Last Name" value={student.lastName} />

            <Detail label="Email" value={student.email} />

            <Detail
              label="Phone"
              value={student.phone || "Not provided"}
            />

            <Detail
              label="Student Number"
              value={
                student.studentProfile?.studentNumber ||
                "Not assigned"
              }
            />

            <Detail
              label="Educational Level"
              value={
                student.studentProfile?.educationalLevel ||
                "Not provided"
              }
            />

            <Detail
              label="Date of Birth"
              value={
                student.studentProfile?.dateOfBirth
                  ? formatDate(student.studentProfile.dateOfBirth)
                  : "Not provided"
              }
            />

            <Detail
              label="Address"
              value={
                student.studentProfile?.address ||
                "Not provided"
              }
            />

            <Detail
              label="Account Created"
              value={formatDate(student.createdAt)}
            />

            <Detail
              label="Last Login"
              value={
                student.lastLoginAt
                  ? formatDateTime(student.lastLoginAt)
                  : "No login recorded"
              }
            />
          </div>
        </section>

        {/* Courses */}
        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <SectionHeading
            eyebrow="Academic"
            title="Course Enrollments"
          />

          {student.enrollments.length === 0 ? (
            <Empty text="This student has no course enrollments." />
          ) : (
            <div className="mt-6 space-y-4">
              {student.enrollments.map((enrollment) => (
                <div
                  key={enrollment.id}
                  className="rounded-2xl border border-slate-200 p-5"
                >
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="font-bold text-slate-950">
                          {enrollment.course.title}
                        </h3>

                        <SmallBadge
                          text={formatEnum(enrollment.status)}
                        />
                      </div>

                      {enrollment.cohort && (
                        <p className="mt-2 text-sm text-slate-500">
                          Cohort:{" "}
                          <span className="font-semibold text-slate-700">
                            {enrollment.cohort.name}
                          </span>
                        </p>
                      )}

                      <p className="mt-1 text-xs text-slate-500">
                        Started{" "}
                        {formatDate(enrollment.startedAt)}
                      </p>
                    </div>

                    <div className="w-full lg:w-64">
                      <div className="flex justify-between text-xs">
                        <span className="font-semibold text-slate-600">
                          Course Progress
                        </span>

                        <span className="font-bold text-slate-950">
                          {enrollment.progress}%
                        </span>
                      </div>

                      <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-blue-600"
                          style={{
                            width: `${Math.min(
                              100,
                              Math.max(0, enrollment.progress)
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-3 border-t border-slate-100 pt-5 sm:grid-cols-3">
                    <MiniStat
                      label="Lessons"
                      value={enrollment.lessonProgress.length}
                    />

                    <MiniStat
                      label="Grades"
                      value={enrollment.grades.length}
                    />

                    <MiniStat
                      label="Live Classes"
                      value={enrollment.liveClasses.length}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Payments */}
        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <SectionHeading
            eyebrow="Finance"
            title="Payments"
          />

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <FinancialCard
              label="Total Paid"
              value={`₦${totalPaid.toLocaleString("en-NG")}`}
            />

            <FinancialCard
              label="Outstanding"
              value={`₦${totalBalance.toLocaleString("en-NG")}`}
            />

            <FinancialCard
              label="Transactions"
              value={student.payments.length.toString()}
            />
          </div>

          {student.payments.length > 0 && (
            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-175 text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                    <th className="px-3 py-3">Date</th>
                    <th className="px-3 py-3">Amount</th>
                    <th className="px-3 py-3">Paid</th>
                    <th className="px-3 py-3">Balance</th>
                    <th className="px-3 py-3">Method</th>
                    <th className="px-3 py-3">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {student.payments.map((payment) => (
                    <tr
                      key={payment.id}
                      className="border-b border-slate-100 last:border-0"
                    >
                      <td className="px-3 py-4">
                        {formatDate(payment.createdAt)}
                      </td>

                      <td className="px-3 py-4 font-semibold">
                        ₦{payment.amount.toLocaleString("en-NG")}
                      </td>

                      <td className="px-3 py-4">
                        ₦
                        {payment.amountPaid.toLocaleString(
                          "en-NG"
                        )}
                      </td>

                      <td className="px-3 py-4">
                        ₦
                        {payment.balance.toLocaleString(
                          "en-NG"
                        )}
                      </td>

                      <td className="px-3 py-4">
                        {formatEnum(payment.method)}
                      </td>

                      <td className="px-3 py-4">
                        <SmallBadge
                          text={formatEnum(payment.status)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Grades */}
        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <SectionHeading
            eyebrow="Academic Performance"
            title="Grades & Assessments"
          />

          {student.enrollments.every(
            (enrollment) => enrollment.grades.length === 0
          ) ? (
            <Empty text="No grades have been recorded yet." />
          ) : (
            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-175 text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                    <th className="px-3 py-3">Assessment</th>
                    <th className="px-3 py-3">Course</th>
                    <th className="px-3 py-3">Score</th>
                    <th className="px-3 py-3">Grade</th>
                    <th className="px-3 py-3">Feedback</th>
                  </tr>
                </thead>

                <tbody>
                  {student.enrollments.flatMap((enrollment) =>
                    enrollment.grades.map((grade) => (
                      <tr
                        key={grade.id}
                        className="border-b border-slate-100 last:border-0"
                      >
                        <td className="px-3 py-4 font-semibold">
                          {grade.assessment.title}
                        </td>

                        <td className="px-3 py-4">
                          {enrollment.course.title}
                        </td>

                        <td className="px-3 py-4">
                          {grade.score}/{grade.maxScore}
                        </td>

                        <td className="px-3 py-4 font-bold">
                          {grade.grade || "—"}
                        </td>

                        <td className="max-w-xs px-3 py-4 text-slate-500">
                          {grade.feedback || "No feedback"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Tests */}
        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <SectionHeading
            eyebrow="Testing"
            title="Test Attempts"
          />

          {student.attempts.length === 0 ? (
            <Empty text="This student has not attempted any tests." />
          ) : (
            <div className="mt-6 space-y-3">
              {student.attempts.map((attempt) => (
                <div
                  key={attempt.id}
                  className="flex flex-col gap-3 rounded-xl border border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-semibold text-slate-950">
                      {attempt.test.title}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {attempt.test.course.title} •{" "}
                      {formatDateTime(attempt.startedAt)}
                    </p>
                  </div>

                  <div className="text-left sm:text-right">
                    <p className="font-bold text-slate-950">
                      {attempt.score !== null
                        ? `${attempt.score}`
                        : "Not graded"}
                    </p>

                    <p className="text-xs text-slate-500">
                      {formatEnum(attempt.status)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Attendance */}
        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <SectionHeading
            eyebrow="Live Classes"
            title="Attendance"
          />

          {student.attendances.length === 0 ? (
            <Empty text="No live-class attendance records yet." />
          ) : (
            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-162.5 text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                    <th className="px-3 py-3">Class</th>
                    <th className="px-3 py-3">Course</th>
                    <th className="px-3 py-3">Date</th>
                    <th className="px-3 py-3">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {student.attendances.map((attendance) => (
                    <tr
                      key={attendance.id}
                      className="border-b border-slate-100 last:border-0"
                    >
                      <td className="px-3 py-4 font-semibold">
                        {attendance.liveClass.title}
                      </td>

                      <td className="px-3 py-4">
                        {attendance.liveClass.course.title}
                      </td>

                      <td className="px-3 py-4">
                        {formatDate(
                          attendance.liveClass.scheduledAt
                        )}
                      </td>

                      <td className="px-3 py-4">
                        <SmallBadge
                          text={formatEnum(attendance.status)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Projects */}
        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <SectionHeading
            eyebrow="Student Work"
            title="Projects"
          />

          {student.projects.length === 0 ? (
            <Empty text="No projects have been submitted." />
          ) : (
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {student.projects.map((record) => (
                <div
                  key={record.id}
                  className="rounded-xl border border-slate-200 p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-bold text-slate-950">
                      {record.title}
                    </h3>

                    <SmallBadge
                      text={formatEnum(record.status)}
                    />
                  </div>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {record.description ||
                      "No project description provided."}
                  </p>

                  {record.score !== null && (
                    <p className="mt-4 text-sm font-semibold text-blue-600">
                      Score: {record.score}
                    </p>
                  )}

                  {record.feedback && (
                    <div className="mt-4 rounded-lg bg-slate-50 p-3 text-sm text-slate-600">
                      {record.feedback}
                    </div>
                  )}

                  {record.project && (
                    <p className="mt-4 text-xs text-slate-500">
                      Project: {record.project.title}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Achievements */}
        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <SectionHeading
            eyebrow="Recognition"
            title="Achievements"
          />

          {student.achievements.length === 0 ? (
            <Empty text="No achievements earned yet." />
          ) : (
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {student.achievements.map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl border border-slate-200 p-5"
                >
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-lg">
                      {item.achievement.icon || "★"}
                    </div>

                    <div>
                      <p className="font-bold text-slate-950">
                        {item.achievement.name}
                      </p>

                      <p className="text-xs text-slate-500">
                        {item.achievement.points} points
                      </p>
                    </div>
                  </div>

                  {item.achievement.description && (
                    <p className="mt-3 text-sm text-slate-600">
                      {item.achievement.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Activity */}
        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <SectionHeading
            eyebrow="Student History"
            title="Recent Activity"
          />

          {student.activities.length === 0 ? (
            <Empty text="No activity has been recorded yet." />
          ) : (
            <div className="mt-6 space-y-4">
              {student.activities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex gap-4 border-b border-slate-100 pb-4 last:border-0"
                >
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-blue-50 text-sm font-bold text-blue-600">
                    •
                  </div>

                  <div className="min-w-0">
                    <p className="font-semibold text-slate-950">
                      {activity.title}
                    </p>

                    {activity.description && (
                      <p className="mt-1 text-sm text-slate-600">
                        {activity.description}
                      </p>
                    )}

                    <p className="mt-1 text-xs text-slate-400">
                      {formatEnum(activity.type)} •{" "}
                      {formatDateTime(activity.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Admin note */}
        <section className="mt-8 rounded-2xl bg-slate-950 p-7 text-white">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-400">
            Administrator
          </p>

          <h2 className="mt-2 text-xl font-bold">
            Student management overview
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
            This record combines the student&apos;s profile, enrollments,
            academic performance, payments, attendance, projects,
            achievements, and activity history in one place.
          </p>
        </section>
      </section>
    </main>
  );
}

/* ----------------------------- */
/* Reusable UI components */
/* ----------------------------- */

function SectionHeading({
  eyebrow,
  title,
}: {
  eyebrow: string;
  title: string;
}) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-600">
        {eyebrow}
      </p>

      <h2 className="mt-1 text-xl font-bold text-slate-950">
        {title}
      </h2>
    </div>
  );
}

function StatCard({
  value,
  label,
  description,
}: {
  value: string | number;
  label: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-3xl font-bold tracking-tight text-slate-950">
        {value}
      </p>

      <p className="mt-2 font-semibold text-slate-900">
        {label}
      </p>

      <p className="mt-1 text-sm text-slate-500">
        {description}
      </p>
    </div>
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
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <p className="mt-2 wrap-break-word font-medium text-slate-950">
        {value}
      </p>
    </div>
  );
}

function MiniStat({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <p className="mt-1 text-lg font-bold text-slate-950">
        {value}
      </p>
    </div>
  );
}

function FinancialCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <p className="mt-2 text-xl font-bold text-slate-950">
        {value}
      </p>
    </div>
  );
}

function SmallBadge({ text }: { text: string }) {
  return (
    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
      {text}
    </span>
  );
}

function StatusBadge({
  status,
}: {
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
}) {
  const styles = {
    ACTIVE: "bg-emerald-50 text-emerald-700",
    SUSPENDED: "bg-red-50 text-red-700",
    INACTIVE: "bg-slate-100 text-slate-600",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-bold ${styles[status]}`}
    >
      {status}
    </span>
  );
}

function Empty({ text }: { text: string }) {
  return (
    <div className="mt-5 rounded-xl border border-dashed border-slate-300 p-8 text-center">
      <p className="text-sm text-slate-500">{text}</p>
    </div>
  );
}

function getInitials(firstName: string, lastName: string) {
  return `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`
    .toUpperCase();
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatDateTime(date: Date) {
  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function formatEnum(value: string) {
  return value
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}