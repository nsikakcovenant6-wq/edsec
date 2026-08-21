/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Search,
  UserRound,
  Users,
} from "lucide-react";

import { prisma } from "@/app/lib/prisma";
import { requireRole } from "@/app/lib/auth";
import { redirect } from "next/navigation";

type SearchParams = {
  search?: string;
  status?: string;
  page?: string;
};

const ENROLLMENT_STATUSES = [
  "ACTIVE",
  "COMPLETED",
  "SUSPENDED",
  "DROPPED",
] as const;

type EnrollmentStatusValue =
  (typeof ENROLLMENT_STATUSES)[number];

const PAGE_SIZE = 15;

export default async function AdminEnrollmentsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const admin = await requireRole("ADMIN");

  if (!admin) {
    redirect("/login");
  }

  const params = await searchParams;

  const search = String(params.search ?? "").trim();

  const rawStatus = String(params.status ?? "").toUpperCase();

  const status: EnrollmentStatusValue | undefined =
    ENROLLMENT_STATUSES.includes(
      rawStatus as EnrollmentStatusValue
    )
      ? (rawStatus as EnrollmentStatusValue)
      : undefined;

  const requestedPage = Number(params.page ?? "1");

  const currentPage =
    Number.isFinite(requestedPage) &&
    requestedPage > 0
      ? Math.floor(requestedPage)
      : 1;

  const where = {
    ...(status
      ? {
          status,
        }
      : {}),
    ...(search
      ? {
          OR: [
            {
              student: {
                firstName: {
                  contains: search,
                  mode: "insensitive" as const,
                },
              },
            },
            {
              student: {
                lastName: {
                  contains: search,
                  mode: "insensitive" as const,
                },
              },
            },
            {
              student: {
                email: {
                  contains: search,
                  mode: "insensitive" as const,
                },
              },
            },
            {
              course: {
                title: {
                  contains: search,
                  mode: "insensitive" as const,
                },
              },
            },
          ],
        }
      : {}),
  };

  const [totalEnrollments, enrollments] =
    await Promise.all([
      prisma.enrollment.count({
        where,
      }),

      prisma.enrollment.findMany({
        where,
        include: {
          student: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              avatarUrl: true,
              status: true,
            },
          },
          course: {
            select: {
              id: true,
              title: true,
              slug: true,
              imageUrl: true,
              status: true,
            },
          },
          cohort: {
            select: {
              id: true,
              name: true,
              status: true,
              startDate: true,
              endDate: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        skip: (currentPage - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
      }),
    ]);

  const totalPages = Math.max(
    1,
    Math.ceil(totalEnrollments / PAGE_SIZE)
  );

  const safePage = Math.min(
    currentPage,
    totalPages
  );

  const activeCount = await prisma.enrollment.count({
    where: {
      status: "ACTIVE",
    },
  });

  const completedCount = await prisma.enrollment.count({
    where: {
      status: "COMPLETED",
    },
  });

  const suspendedCount = await prisma.enrollment.count({
    where: {
      status: "SUSPENDED",
    },
  });

  const droppedCount = await prisma.enrollment.count({
    where: {
      status: "DROPPED",
    },
  });

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-7 lg:px-8">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold text-blue-600">
                <GraduationCap size={17} />
                Admin Management
              </div>

              <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
                Enrollments
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Manage students enrolled in EDSEC courses,
                track their progress, and monitor enrollment
                status.
              </p>
            </div>

            <Link
              href="/admin/courses"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              <BookOpen size={17} />
              View Courses
            </Link>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <StatCard
            icon={<Users size={19} />}
            label="Total"
            value={totalEnrollments}
          />

          <StatCard
            icon={<UserRound size={19} />}
            label="Active"
            value={activeCount}
          />

          <StatCard
            icon={<GraduationCap size={19} />}
            label="Completed"
            value={completedCount}
          />

          <StatCard
            icon={<UserRound size={19} />}
            label="Suspended"
            value={suspendedCount}
          />

          <StatCard
            icon={<UserRound size={19} />}
            label="Dropped"
            value={droppedCount}
          />
        </div>

        <div className="mt-8 rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 p-5">
            <form
              method="GET"
              className="flex flex-col gap-3 lg:flex-row"
            >
              <div className="relative flex-1">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  name="search"
                  defaultValue={search}
                  placeholder="Search student, email, or course..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <select
                name="status"
                defaultValue={status ?? ""}
                className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
              >
                <option value="">
                  All statuses
                </option>

                <option value="ACTIVE">
                  Active
                </option>

                <option value="COMPLETED">
                  Completed
                </option>

                <option value="SUSPENDED">
                  Suspended
                </option>

                <option value="DROPPED">
                  Dropped
                </option>
              </select>

              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                <Search size={17} />
                Search
              </button>
            </form>
          </div>

          {enrollments.length === 0 ? (
            <EmptyState
              hasFilters={Boolean(search || status)}
            />
          ) : (
            <>
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-left">
                      <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-slate-500">
                        Student
                      </th>

                      <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-slate-500">
                        Course
                      </th>

                      <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-slate-500">
                        Cohort
                      </th>

                      <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-slate-500">
                        Progress
                      </th>

                      <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-slate-500">
                        Status
                      </th>

                      <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-slate-500">
                        Enrolled
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {enrollments.map((enrollment) => (
                      <EnrollmentRow
                        key={enrollment.id}
                        enrollment={enrollment}
                      />
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="divide-y divide-slate-100 md:hidden">
                {enrollments.map((enrollment) => (
                  <EnrollmentMobileCard
                    key={enrollment.id}
                    enrollment={enrollment}
                  />
                ))}
              </div>
            </>
          )}

          <Pagination
            currentPage={safePage}
            totalPages={totalPages}
            search={search}
            status={status}
          />
        </div>
      </section>
    </main>
  );
}

function EnrollmentRow({
  enrollment,
}: {
  enrollment: {
    id: string;
    status: EnrollmentStatusValue;
    progress: number;
    startedAt: Date;
    student: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      avatarUrl: string | null;
      status: string;
    };
    course: {
      id: string;
      title: string;
      slug: string;
      imageUrl: string | null;
      status: string;
    };
    cohort: {
      id: string;
      name: string;
      status: string;
      startDate: Date | null;
      endDate: Date | null;
    } | null;
  };
}) {
  return (
    <tr className="transition hover:bg-slate-50">
      <td className="px-5 py-5">
        <StudentIdentity student={enrollment.student} />
      </td>

      <td className="px-5 py-5">
        <Link
          href={`/admin/courses/${enrollment.course.id}`}
          className="font-semibold text-slate-800 transition hover:text-blue-600"
        >
          {enrollment.course.title}
        </Link>
      </td>

      <td className="px-5 py-5">
        {enrollment.cohort ? (
          <span className="text-sm font-medium text-slate-700">
            {enrollment.cohort.name}
          </span>
        ) : (
          <span className="text-sm text-slate-400">
            No cohort
          </span>
        )}
      </td>

      <td className="px-5 py-5">
        <ProgressBar
          progress={enrollment.progress}
        />
      </td>

      <td className="px-5 py-5">
        <StatusBadge status={enrollment.status} />
      </td>

      <td className="px-5 py-5">
        <span className="text-sm text-slate-500">
          {formatDate(enrollment.startedAt)}
        </span>
      </td>
    </tr>
  );
}

function EnrollmentMobileCard({
  enrollment,
}: {
  enrollment: {
    id: string;
    status: EnrollmentStatusValue;
    progress: number;
    startedAt: Date;
    student: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      avatarUrl: string | null;
      status: string;
    };
    course: {
      id: string;
      title: string;
      slug: string;
      imageUrl: string | null;
      status: string;
    };
    cohort: {
      id: string;
      name: string;
      status: string;
      startDate: Date | null;
      endDate: Date | null;
    } | null;
  };
}) {
  return (
    <div className="p-5">
      <StudentIdentity student={enrollment.student} />

      <div className="mt-5">
        <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
          Course
        </p>

        <Link
          href={`/admin/courses/${enrollment.course.id}`}
          className="mt-1 block font-semibold text-slate-800 hover:text-blue-600"
        >
          {enrollment.course.title}
        </Link>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
            Status
          </p>

          <div className="mt-2">
            <StatusBadge status={enrollment.status} />
          </div>
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
            Enrolled
          </p>

          <p className="mt-2 text-sm font-medium text-slate-700">
            {formatDate(enrollment.startedAt)}
          </p>
        </div>
      </div>

      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
            Progress
          </p>

          <span className="text-xs font-bold text-slate-700">
            {enrollment.progress}%
          </span>
        </div>

        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
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

      <div className="mt-4">
        <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
          Cohort
        </p>

        <p className="mt-1 text-sm text-slate-600">
          {enrollment.cohort?.name ?? "No cohort"}
        </p>
      </div>
    </div>
  );
}

function StudentIdentity({
  student,
}: {
  student: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatarUrl: string | null;
    status: string;
  };
}) {
  const fullName =
    `${student.firstName} ${student.lastName}`.trim();

  const initials =
    `${student.firstName.charAt(0)}${student.lastName.charAt(
      0
    )}`.toUpperCase();

  return (
    <div className="flex items-center gap-3">
      {student.avatarUrl ? (
        <img
          src={student.avatarUrl}
          alt={fullName}
          className="h-10 w-10 rounded-full object-cover"
        />
      ) : (
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-blue-50 text-xs font-bold text-blue-700">
          {initials || "ST"}
        </div>
      )}

      <div className="min-w-0">
        <p className="truncate font-semibold text-slate-800">
          {fullName || "Unnamed Student"}
        </p>

        <p className="truncate text-xs text-slate-400">
          {student.email}
        </p>
      </div>
    </div>
  );
}

function ProgressBar({
  progress,
}: {
  progress: number;
}) {
  const safeProgress = Math.min(
    100,
    Math.max(0, progress)
  );

  return (
    <div className="w-32">
      <div className="mb-1.5 flex justify-between">
        <span className="text-xs font-semibold text-slate-500">
          Progress
        </span>

        <span className="text-xs font-bold text-slate-700">
          {safeProgress}%
        </span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-blue-600"
          style={{
            width: `${safeProgress}%`,
          }}
        />
      </div>
    </div>
  );
}

function StatusBadge({
  status,
}: {
  status: EnrollmentStatusValue;
}) {
  const config: Record<
    EnrollmentStatusValue,
    {
      label: string;
      className: string;
    }
  > = {
    ACTIVE: {
      label: "Active",
      className:
        "bg-green-50 text-green-700",
    },
    COMPLETED: {
      label: "Completed",
      className:
        "bg-blue-50 text-blue-700",
    },
    SUSPENDED: {
      label: "Suspended",
      className:
        "bg-amber-50 text-amber-700",
    },
    DROPPED: {
      label: "Dropped",
      className:
        "bg-red-50 text-red-700",
    },
  };

  const item = config[status];

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${item.className}`}
    >
      {item.label}
    </span>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-blue-600">
        {icon}
      </div>

      <p className="mt-4 text-2xl font-bold text-slate-950">
        {value}
      </p>

      <p className="mt-1 text-sm font-semibold text-slate-500">
        {label}
      </p>
    </div>
  );
}

function EmptyState({
  hasFilters,
}: {
  hasFilters: boolean;
}) {
  return (
    <div className="px-6 py-20 text-center">
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-slate-100 text-slate-400">
        <Users size={26} />
      </div>

      <h2 className="mt-4 text-lg font-bold text-slate-900">
        No enrollments found
      </h2>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        {hasFilters
          ? "Try changing your search or status filter."
          : "There are no student enrollments yet."}
      </p>
    </div>
  );
}

function Pagination({
  currentPage,
  totalPages,
  search,
  status,
}: {
  currentPage: number;
  totalPages: number;
  search: string;
  status?: EnrollmentStatusValue;
}) {
  if (totalPages <= 1) {
    return null;
  }

  const previousPage = Math.max(
    1,
    currentPage - 1
  );

  const nextPage = Math.min(
    totalPages,
    currentPage + 1
  );

  const createUrl = (page: number) => {
    const query = new URLSearchParams();

    if (search) {
      query.set("search", search);
    }

    if (status) {
      query.set("status", status);
    }

    query.set("page", String(page));

    return `/admin/enrollments?${query.toString()}`;
  };

  return (
    <div className="flex items-center justify-between border-t border-slate-200 px-5 py-4">
      <p className="text-sm text-slate-500">
        Page{" "}
        <span className="font-semibold text-slate-800">
          {currentPage}
        </span>{" "}
        of{" "}
        <span className="font-semibold text-slate-800">
          {totalPages}
        </span>
      </p>

      <div className="flex items-center gap-2">
        <Link
          href={createUrl(previousPage)}
          aria-disabled={currentPage === 1}
          className={`inline-flex h-9 w-9 items-center justify-center rounded-lg border text-slate-600 transition ${
            currentPage === 1
              ? "pointer-events-none border-slate-100 bg-slate-50 opacity-40"
              : "border-slate-200 bg-white hover:bg-slate-50"
          }`}
        >
          <ChevronLeft size={17} />
        </Link>

        <Link
          href={createUrl(nextPage)}
          aria-disabled={currentPage === totalPages}
          className={`inline-flex h-9 w-9 items-center justify-center rounded-lg border text-slate-600 transition ${
            currentPage === totalPages
              ? "pointer-events-none border-slate-100 bg-slate-50 opacity-40"
              : "border-slate-200 bg-white hover:bg-slate-50"
          }`}
        >
          <ChevronRight size={17} />
        </Link>
      </div>
    </div>
  );
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}