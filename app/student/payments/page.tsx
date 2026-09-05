import Link from "next/link";
import { redirect } from "next/navigation";

import { prisma } from "@/app/lib/prisma";
import { getCurrentUser } from "@/app/lib/auth";

const statusClass: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-700",
  PAID: "bg-emerald-100 text-emerald-700",
  PARTIAL: "bg-blue-100 text-blue-700",
  OVERDUE: "bg-red-100 text-red-700",
  CANCELLED: "bg-slate-100 text-slate-600",
};

const statusLabel: Record<string, string> = {
  PENDING: "Pending",
  PAID: "Paid",
  PARTIAL: "Partially Paid",
  OVERDUE: "Overdue",
  CANCELLED: "Cancelled",
};

function formatCurrency(amount: number) {
  return `₦${amount.toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatDate(date: Date | null) {
  if (!date) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-NG", {
    dateStyle: "medium",
  }).format(date);
}

function formatDateTime(date: Date | null) {
  if (!date) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function formatMethod(method: string) {
  return method
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    );
}

export default async function StudentPaymentsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "STUDENT") {
    redirect("/admin");
  }

  const payments =
    await prisma.payment.findMany({
      where: {
        studentId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        enrollment: {
          include: {
            course: {
              select: {
                id: true,
                title: true,
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
        },
      },
    });

  const totalCharges = payments.reduce(
    (sum, payment) =>
      sum + payment.amount,
    0
  );

  const totalPaid = payments.reduce(
    (sum, payment) =>
      sum + payment.amountPaid,
    0
  );

  const totalBalance = payments.reduce(
    (sum, payment) =>
      sum + payment.balance,
    0
  );

  const paidPayments =
    payments.filter(
      (payment) =>
        payment.status === "PAID"
    ).length;

  const openPayments =
    payments.filter(
      (payment) =>
        payment.status === "PENDING" ||
        payment.status === "PARTIAL" ||
        payment.status === "OVERDUE"
    ).length;

  const enrollmentMap = new Map<
    string,
    {
      enrollmentId: string;
      courseTitle: string;
      cohortName: string | null;
      total: number;
      paid: number;
      balance: number;
      paymentCount: number;
    }
  >();

  for (const payment of payments) {
    if (!payment.enrollment) {
      continue;
    }

    const enrollmentId =
      payment.enrollment.id;

    const existing =
      enrollmentMap.get(
        enrollmentId
      );

    if (existing) {
      existing.total += payment.amount;
      existing.paid += payment.amountPaid;
      existing.balance += payment.balance;
      existing.paymentCount += 1;
    } else {
      enrollmentMap.set(
        enrollmentId,
        {
          enrollmentId,
          courseTitle:
            payment.enrollment.course.title,
          cohortName:
            payment.enrollment.cohort
              ?.name ?? null,
          total: payment.amount,
          paid: payment.amountPaid,
          balance: payment.balance,
          paymentCount: 1,
        }
      );
    }
  }

  const enrollmentSummaries =
    Array.from(
      enrollmentMap.values()
    );

  const overallPercentage =
    totalCharges > 0
      ? Math.min(
          100,
          Math.round(
            (totalPaid / totalCharges) *
              100
          )
        )
      : 0;

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div>
          <Link
            href="/student/dashboard"
            className="inline-flex items-center text-sm font-semibold text-slate-500 transition hover:text-slate-900"
          >
            ← Student Dashboard
          </Link>

          <div className="mt-4">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Payments & Fees
            </h1>

            <p className="mt-1 max-w-2xl text-sm text-slate-500 sm:text-base">
              View your course fees, payment
              history, outstanding balances and
              receipts.
            </p>
          </div>
        </div>

        {/* Summary */}
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
            description={`${paidPayments} fully paid ${
              paidPayments === 1
                ? "record"
                : "records"
            }`}
            valueClassName="text-emerald-600"
          />

          <SummaryCard
            label="Outstanding Balance"
            value={formatCurrency(
              totalBalance
            )}
            description="Amount remaining"
            valueClassName={
              totalBalance > 0
                ? "text-red-600"
                : "text-emerald-600"
            }
          />

          <SummaryCard
            label="Open Payments"
            value={String(openPayments)}
            description="Pending, partial or overdue"
            valueClassName={
              openPayments > 0
                ? "text-amber-600"
                : "text-emerald-600"
            }
          />
        </div>

        {/* Overall Progress */}
        {totalCharges > 0 && (
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="font-bold text-slate-900">
                  Overall Payment Progress
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Your payments toward all
                  recorded charges.
                </p>
              </div>

              <p className="text-lg font-bold text-slate-900">
                {overallPercentage}%
              </p>
            </div>

            <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-slate-900 transition-all"
                style={{
                  width: `${overallPercentage}%`,
                }}
              />
            </div>

            <div className="mt-3 flex flex-col justify-between gap-1 text-xs text-slate-500 sm:flex-row">
              <span>
                Paid:{" "}
                {formatCurrency(totalPaid)}
              </span>

              <span>
                Remaining:{" "}
                {formatCurrency(
                  totalBalance
                )}
              </span>
            </div>
          </section>
        )}

        {/* Course Summary */}
        {enrollmentSummaries.length > 0 && (
          <section className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Course Financial Summary
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Your payment position for each
                enrolled course.
              </p>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              {enrollmentSummaries.map(
                (enrollment) => {
                  const percentage =
                    enrollment.total > 0
                      ? Math.min(
                          100,
                          Math.round(
                            (enrollment.paid /
                              enrollment.total) *
                              100
                          )
                        )
                      : 0;

                  return (
                    <div
                      key={
                        enrollment.enrollmentId
                      }
                      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <h3 className="font-bold text-slate-900">
                            {
                              enrollment.courseTitle
                            }
                          </h3>

                          {enrollment.cohortName && (
                            <p className="mt-1 text-sm text-slate-500">
                              {
                                enrollment.cohortName
                              }
                            </p>
                          )}
                        </div>

                        <span className="inline-flex w-fit rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                          {
                            enrollment.paymentCount
                          }{" "}
                          {enrollment.paymentCount ===
                          1
                            ? "payment"
                            : "payments"}
                        </span>
                      </div>

                      <div className="mt-5 grid grid-cols-3 gap-3">
                        <div>
                          <p className="text-xs text-slate-400">
                            Charges
                          </p>

                          <p className="mt-1 text-sm font-bold text-slate-900">
                            {formatCurrency(
                              enrollment.total
                            )}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-slate-400">
                            Paid
                          </p>

                          <p className="mt-1 text-sm font-bold text-emerald-600">
                            {formatCurrency(
                              enrollment.paid
                            )}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-slate-400">
                            Balance
                          </p>

                          <p className="mt-1 text-sm font-bold text-red-600">
                            {formatCurrency(
                              enrollment.balance
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="mt-5">
                        <div className="mb-2 flex items-center justify-between text-xs">
                          <span className="text-slate-500">
                            Payment progress
                          </span>

                          <span className="font-semibold text-slate-700">
                            {percentage}%
                          </span>
                        </div>

                        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className="h-full rounded-full bg-slate-900 transition-all"
                            style={{
                              width: `${percentage}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </section>
        )}

        {/* Payment History */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 p-5 sm:p-6">
            <h2 className="text-lg font-bold text-slate-900">
              Payment History
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              View individual payment records
              and receipts.
            </p>
          </div>

          {payments.length === 0 ? (
            <div className="p-10 text-center sm:p-14">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-2xl">
                ₦
              </div>

              <h3 className="mt-4 font-bold text-slate-900">
                No payment records yet
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                Your payment records will
                appear here once a payment or
                course charge has been recorded
                by EDSEC.
              </p>
            </div>
          ) : (
            <>
              {/* Mobile */}
              <div className="divide-y divide-slate-100 md:hidden">
                {payments.map(
                  (payment) => (
                    <div
                      key={payment.id}
                      className="p-5"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <h3 className="truncate font-bold text-slate-900">
                            {payment.enrollment
                              ?.course
                              .title ??
                              "General Payment"}
                          </h3>

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

                        <span
                          className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${
                            statusClass[
                              payment.status
                            ] ??
                            "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {statusLabel[
                            payment.status
                          ] ??
                            payment.status}
                        </span>
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
                          label="Method"
                          value={formatMethod(
                            payment.method
                          )}
                        />
                      </div>

                      <div className="mt-5 space-y-2 border-t border-slate-100 pt-4 text-xs text-slate-500">
                        <div className="flex justify-between gap-4">
                          <span>
                            Payment date
                          </span>

                          <span className="text-right font-medium text-slate-700">
                            {formatDateTime(
                              payment.paidAt
                            )}
                          </span>
                        </div>

                        <div className="flex justify-between gap-4">
                          <span>
                            Due date
                          </span>

                          <span className="text-right font-medium text-slate-700">
                            {formatDate(
                              payment.dueDate
                            )}
                          </span>
                        </div>

                        {payment.receiptNumber && (
                          <div className="flex justify-between gap-4">
                            <span>
                              Receipt
                            </span>

                            <span className="text-right font-medium text-slate-700">
                              {
                                payment.receiptNumber
                              }
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="mt-5 flex flex-wrap gap-2">
                        <Link
                          href={`/student/payments/${payment.id}`}
                          className="inline-flex flex-1 items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
                        >
                          View Details
                        </Link>

                        {payment.status ===
                          "PAID" &&
                          payment.receiptNumber && (
                            <Link
                              href={`/student/payments/${payment.id}/receipt`}
                              className="inline-flex flex-1 items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100"
                            >
                              View Receipt
                            </Link>
                          )}
                      </div>
                    </div>
                  )
                )}
              </div>

              {/* Desktop */}
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full min-w-275 text-left text-sm">
                  <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="px-6 py-4">
                        Course
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
                        Receipt
                      </th>
                      <th className="px-6 py-4">
                        Payment Date
                      </th>
                      <th className="px-6 py-4">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {payments.map(
                      (payment) => (
                        <tr
                          key={payment.id}
                          className="transition hover:bg-slate-50"
                        >
                          <td className="px-6 py-5">
                            <p className="font-semibold text-slate-900">
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
                            <span
                              className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${
                                statusClass[
                                  payment
                                    .status
                                ] ??
                                "bg-slate-100 text-slate-600"
                              }`}
                            >
                              {statusLabel[
                                payment.status
                              ] ??
                                payment.status}
                            </span>
                          </td>

                          <td className="px-6 py-5">
                            {payment.receiptNumber ? (
                              <span className="font-medium text-slate-700">
                                {
                                  payment.receiptNumber
                                }
                              </span>
                            ) : (
                              <span className="text-slate-400">
                                —
                              </span>
                            )}
                          </td>

                          <td className="px-6 py-5 text-slate-600">
                            {formatDate(
                              payment.paidAt
                            )}
                          </td>

                          <td className="px-6 py-5">
                            <div className="flex flex-wrap gap-2">
                              <Link
                                href={`/student/payments/${payment.id}`}
                                className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
                              >
                                Details
                              </Link>

                              {payment.status ===
                                "PAID" &&
                                payment.receiptNumber && (
                                  <Link
                                    href={`/student/payments/${payment.id}/receipt`}
                                    className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700"
                                  >
                                    Receipt
                                  </Link>
                                )}
                            </div>
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="font-bold text-slate-900">
            Payment Information
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Fully paid payments receive an EDSEC
            receipt number. You can open the payment
            details or view the receipt directly from
            your payment history.
          </p>
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