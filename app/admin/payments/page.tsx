import Link from "next/link";

import { prisma } from "@/app/lib/prisma";
import { requireRole } from "@/app/lib/auth";

const statusClass: Record<
  string,
  string
> = {
  PENDING:
    "bg-amber-100 text-amber-700",
  PAID:
    "bg-emerald-100 text-emerald-700",
  PARTIAL:
    "bg-blue-100 text-blue-700",
  OVERDUE:
    "bg-red-100 text-red-700",
  CANCELLED:
    "bg-slate-100 text-slate-600",
};

const statusLabel: Record<
  string,
  string
> = {
  PENDING: "Pending",
  PAID: "Paid",
  PARTIAL: "Partially Paid",
  OVERDUE: "Overdue",
  CANCELLED: "Cancelled",
};

function formatCurrency(amount: number) {
  return `₦${amount.toLocaleString(
    "en-NG"
  )}`;
}

function formatDate(
  date: Date | null
) {
  if (!date) return "—";

  return new Intl.DateTimeFormat(
    "en-NG",
    {
      dateStyle: "medium",
    }
  ).format(date);
}

function formatMethod(method: string) {
  return method
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(
      /\b\w/g,
      (letter) =>
        letter.toUpperCase()
    );
}

export default async function AdminPaymentsPage() {
  await requireRole("ADMIN");

  const payments =
    await prisma.payment.findMany({
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        enrollment: {
          select: {
            id: true,
            course: {
              select: {
                id: true,
                title: true,
              },
            },
            cohort: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

  const totalCharges =
    payments.reduce(
      (sum, payment) =>
        sum + payment.amount,
      0
    );

  const totalPaid =
    payments.reduce(
      (sum, payment) =>
        sum + payment.amountPaid,
      0
    );

  const totalBalance =
    payments.reduce(
      (sum, payment) =>
        sum + payment.balance,
      0
    );

  const paidCount =
    payments.filter(
      (payment) =>
        payment.status === "PAID"
    ).length;

  const partialCount =
    payments.filter(
      (payment) =>
        payment.status === "PARTIAL"
    ).length;

  const overdueCount =
    payments.filter(
      (payment) =>
        payment.status === "OVERDUE"
    ).length;

  const pendingCount =
    payments.filter(
      (payment) =>
        payment.status === "PENDING"
    ).length;

  const openCount =
    partialCount +
    overdueCount +
    pendingCount;

  const dueTodayCount =
    payments.filter((payment) => {
      if (
        !payment.dueDate ||
        payment.balance <= 0 ||
        payment.status ===
          "CANCELLED"
      ) {
        return false;
      }

      const now = new Date();
      const due = new Date(
        payment.dueDate
      );

      return (
        now.getFullYear() ===
          due.getFullYear() &&
        now.getMonth() ===
          due.getMonth() &&
        now.getDate() ===
          due.getDate()
      );
    }).length;

  return (
    <main className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              href="/admin"
              className="mb-2 inline-flex text-sm font-medium text-slate-500 transition hover:text-slate-900"
            >
              ← Admin Dashboard
            </Link>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Payments
            </h1>

            <p className="mt-1 text-sm text-slate-500 sm:text-base">
              Manage student charges, payments,
              balances and financial records.
            </p>
          </div>

          <Link
            href="/admin/payments/new"
            className="inline-flex w-fit items-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            + Record Payment
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryCard
            label="Total Charges"
            value={formatCurrency(
              totalCharges
            )}
            description={`${payments.length} payment ${
              payments.length === 1
                ? "record"
                : "records"
            }`}
          />

          <SummaryCard
            label="Total Paid"
            value={formatCurrency(
              totalPaid
            )}
            description={`${paidCount} fully paid`}
            valueClassName="text-emerald-600"
          />

          <SummaryCard
            label="Outstanding"
            value={formatCurrency(
              totalBalance
            )}
            description={`${openCount} open payment${
              openCount === 1
                ? ""
                : "s"
            }`}
            valueClassName={
              totalBalance > 0
                ? "text-red-600"
                : "text-emerald-600"
            }
          />

          <SummaryCard
            label="Due Today"
            value={String(
              dueTodayCount
            )}
            description={`${overdueCount} overdue`}
            valueClassName={
              dueTodayCount > 0
                ? "text-amber-600"
                : "text-slate-900"
            }
          />
        </div>

        <section className="grid gap-4 sm:grid-cols-3">
          <MiniStat
            label="Pending"
            value={pendingCount}
            className="text-amber-600"
          />

          <MiniStat
            label="Partially Paid"
            value={partialCount}
            className="text-blue-600"
          />

          <MiniStat
            label="Overdue"
            value={overdueCount}
            className="text-red-600"
          />
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 p-5 sm:p-6">
            <h2 className="text-lg font-bold text-slate-900">
              Payment Records
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              View and manage all recorded student
              financial records.
            </p>
          </div>

          {payments.length === 0 ? (
            <div className="p-10 text-center sm:p-14">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-xl font-bold text-slate-500">
                ₦
              </div>

              <h3 className="mt-4 font-bold text-slate-900">
                No payments recorded yet
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
                Start by recording a student payment
                or course charge.
              </p>

              <Link
                href="/admin/payments/new"
                className="mt-5 inline-flex rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Record Payment
              </Link>
            </div>
          ) : (
            <>
              <div className="divide-y divide-slate-100 md:hidden">
                {payments.map(
                  (payment) => {
                    const studentName =
                      `${payment.student.firstName} ${payment.student.lastName}`.trim();

                    return (
                      <div
                        key={payment.id}
                        className="p-5"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0">
                            <Link
                              href={`/admin/students/${payment.student.id}`}
                              className="font-bold text-slate-900 hover:underline"
                            >
                              {studentName}
                            </Link>

                            <p className="mt-1 truncate text-xs text-slate-500">
                              {payment.student.email}
                            </p>

                            <p className="mt-2 text-sm font-medium text-slate-700">
                              {payment.enrollment?.course
                                .title ??
                                "General Payment"}
                            </p>

                            {payment.enrollment
                              ?.cohort
                              ?.name && (
                              <p className="mt-1 text-xs text-slate-500">
                                {
                                  payment
                                    .enrollment
                                    .cohort
                                    .name
                                }
                              </p>
                            )}
                          </div>

                          <StatusBadge
                            status={
                              payment.status
                            }
                          />
                        </div>

                        <div className="mt-5 grid grid-cols-2 gap-4">
                          <PaymentValue
                            label="Charge"
                            value={formatCurrency(
                              payment.amount
                            )}
                          />

                          <PaymentValue
                            label="Paid"
                            value={formatCurrency(
                              payment.amountPaid
                            )}
                            valueClassName="text-emerald-600"
                          />

                          <PaymentValue
                            label="Balance"
                            value={formatCurrency(
                              payment.balance
                            )}
                            valueClassName={
                              payment.balance >
                              0
                                ? "text-red-600"
                                : "text-emerald-600"
                            }
                          />

                          <PaymentValue
                            label="Due"
                            value={formatDate(
                              payment.dueDate
                            )}
                          />
                        </div>

                        <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                          <span className="text-xs text-slate-500">
                            {formatDate(
                              payment.createdAt
                            )}
                          </span>

                          <Link
                            href={`/admin/payments/${payment.id}`}
                            className="text-sm font-semibold text-slate-900 hover:underline"
                          >
                            View payment →
                          </Link>
                        </div>
                      </div>
                    );
                  }
                )}
              </div>

              <div className="hidden overflow-x-auto md:block">
                <table className="w-full min-w-275 text-left text-sm">
                  <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="px-6 py-4">
                        Student
                      </th>
                      <th className="px-6 py-4">
                        Course / Cohort
                      </th>
                      <th className="px-6 py-4">
                        Charge
                      </th>
                      <th className="px-6 py-4">
                        Paid
                      </th>
                      <th className="px-6 py-4">
                        Balance
                      </th>
                      <th className="px-6 py-4">
                        Status
                      </th>
                      <th className="px-6 py-4">
                        Method
                      </th>
                      <th className="px-6 py-4">
                        Due
                      </th>
                      <th className="px-6 py-4">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {payments.map(
                      (payment) => {
                        const studentName =
                          `${payment.student.firstName} ${payment.student.lastName}`.trim();

                        return (
                          <tr
                            key={payment.id}
                            className="transition hover:bg-slate-50"
                          >
                            <td className="px-6 py-5">
                              <Link
                                href={`/admin/students/${payment.student.id}`}
                                className="font-semibold text-slate-900 hover:underline"
                              >
                                {studentName}
                              </Link>

                              <p className="mt-1 text-xs text-slate-500">
                                {
                                  payment
                                    .student
                                    .email
                                }
                              </p>
                            </td>

                            <td className="px-6 py-5">
                              <p className="font-medium text-slate-700">
                                {payment
                                  .enrollment
                                  ?.course
                                  .title ??
                                  "General Payment"}
                              </p>

                              {payment
                                .enrollment
                                ?.cohort
                                ?.name && (
                                <p className="mt-1 text-xs text-slate-500">
                                  {
                                    payment
                                      .enrollment
                                      .cohort
                                      .name
                                  }
                                </p>
                              )}
                            </td>

                            <td className="px-6 py-5 font-medium text-slate-900">
                              {formatCurrency(
                                payment.amount
                              )}
                            </td>

                            <td className="px-6 py-5 font-medium text-emerald-600">
                              {formatCurrency(
                                payment.amountPaid
                              )}
                            </td>

                            <td
                              className={`px-6 py-5 font-medium ${
                                payment.balance >
                                0
                                  ? "text-red-600"
                                  : "text-emerald-600"
                              }`}
                            >
                              {formatCurrency(
                                payment.balance
                              )}
                            </td>

                            <td className="px-6 py-5">
                              <StatusBadge
                                status={
                                  payment.status
                                }
                              />
                            </td>

                            <td className="px-6 py-5 text-slate-600">
                              {formatMethod(
                                payment.method
                              )}
                            </td>

                            <td className="px-6 py-5 text-slate-600">
                              {formatDate(
                                payment.dueDate
                              )}
                            </td>

                            <td className="px-6 py-5">
                              <Link
                                href={`/admin/payments/${payment.id}`}
                                className="font-semibold text-slate-700 hover:underline"
                              >
                                View
                              </Link>
                            </td>
                          </tr>
                        );
                      }
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
}

function SummaryCard({
  label,
  value,
  description,
  valueClassName = "text-slate-900",
}: {
  label: string;
  value: string;
  description: string;
  valueClassName?: string;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-slate-500">
        {label}
      </p>

      <p
        className={`mt-2 text-2xl font-bold ${valueClassName}`}
      >
        {value}
      </p>

      <p className="mt-1 text-xs text-slate-400">
        {description}
      </p>
    </section>
  );
}

function MiniStat({
  label,
  value,
  className,
}: {
  label: string;
  value: number;
  className: string;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-slate-500">
        {label}
      </p>

      <p
        className={`mt-2 text-2xl font-bold ${className}`}
      >
        {value}
      </p>
    </section>
  );
}

function StatusBadge({
  status,
}: {
  status: string;
}) {
  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${
        statusClass[status] ??
        "bg-slate-100 text-slate-700"
      }`}
    >
      {statusLabel[status] ??
        status}
    </span>
  );
}

function PaymentValue({
  label,
  value,
  valueClassName = "text-slate-900",
}: {
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div>
      <p className="text-xs text-slate-400">
        {label}
      </p>

      <p
        className={`mt-1 text-sm font-bold ${valueClassName}`}
      >
        {value}
      </p>
    </div>
  );
}