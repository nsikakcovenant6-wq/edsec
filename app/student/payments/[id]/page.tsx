import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { prisma } from "@/app/lib/prisma";
import { getCurrentUser } from "@/app/lib/auth";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
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

function getStatusClass(status: string) {
  switch (status) {
    case "PAID":
      return "bg-emerald-100 text-emerald-700";

    case "PARTIAL":
      return "bg-blue-100 text-blue-700";

    case "OVERDUE":
      return "bg-red-100 text-red-700";

    case "CANCELLED":
      return "bg-slate-100 text-slate-600";

    case "PENDING":
    default:
      return "bg-amber-100 text-amber-700";
  }
}

function getStatusLabel(status: string) {
  switch (status) {
    case "PAID":
      return "Paid";

    case "PARTIAL":
      return "Partially Paid";

    case "OVERDUE":
      return "Overdue";

    case "CANCELLED":
      return "Cancelled";

    case "PENDING":
      return "Pending";

    default:
      return status;
  }
}

export default async function StudentPaymentDetailPage({
  params,
}: PageProps) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "STUDENT") {
    redirect("/admin");
  }

  const { id } = await params;

  const payment =
    await prisma.payment.findFirst({
      where: {
        id,
        studentId: user.id,
      },
      include: {
        student: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },

        enrollment: {
          include: {
            course: {
              select: {
                id: true,
                title: true,
                duration: true,
                learningFormat: true,
              },
            },

            cohort: {
              select: {
                id: true,
                name: true,
                startDate: true,
                endDate: true,
                status: true,
              },
            },

            payments: {
              orderBy: {
                createdAt: "desc",
              },
              select: {
                id: true,
                amount: true,
                amountPaid: true,
                balance: true,
                status: true,
                method: true,
                receiptNumber: true,
                paidAt: true,
                createdAt: true,
              },
            },
          },
        },
      },
    });

  if (!payment) {
    notFound();
  }

  const percentage =
    payment.amount > 0
      ? Math.min(
          100,
          Math.round(
            (payment.amountPaid /
              payment.amount) *
              100
          )
        )
      : 0;

  const canViewReceipt =
    payment.status === "PAID" &&
    Boolean(payment.receiptNumber);

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <div>
          <Link
            href="/student/payments"
            className="text-sm font-semibold text-slate-500 transition hover:text-slate-900"
          >
            ← Payments & Fees
          </Link>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                Payment Details
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Review this payment and its
                associated course information.
              </p>
            </div>

            <span
              className={`inline-flex w-fit rounded-full px-3 py-1.5 text-xs font-bold ${getStatusClass(
                payment.status
              )}`}
            >
              {getStatusLabel(
                payment.status
              )}
            </span>
          </div>
        </div>

        {/* Main payment card */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 p-5 sm:p-6">
            <p className="text-sm font-medium text-slate-500">
              {payment.enrollment?.course
                .title ?? "EDSEC Payment"}
            </p>

            {payment.enrollment?.cohort
              ?.name && (
              <p className="mt-1 text-sm text-slate-400">
                {payment.enrollment.cohort.name}
              </p>
            )}
          </div>

          <div className="grid gap-6 p-5 sm:grid-cols-3 sm:p-6">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Total Charge
              </p>

              <p className="mt-2 text-2xl font-bold text-slate-900">
                {formatCurrency(
                  payment.amount
                )}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Amount Paid
              </p>

              <p className="mt-2 text-2xl font-bold text-emerald-600">
                {formatCurrency(
                  payment.amountPaid
                )}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Balance
              </p>

              <p
                className={`mt-2 text-2xl font-bold ${
                  payment.balance > 0
                    ? "text-red-600"
                    : "text-emerald-600"
                }`}
              >
                {formatCurrency(
                  payment.balance
                )}
              </p>
            </div>
          </div>

          <div className="border-t border-slate-100 p-5 sm:p-6">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>
                Payment progress
              </span>

              <span className="font-bold text-slate-700">
                {percentage}%
              </span>
            </div>

            <div className="mt-2 h-3 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-slate-900"
                style={{
                  width: `${percentage}%`,
                }}
              />
            </div>
          </div>
        </section>

        {/* Receipt */}
        {canViewReceipt ? (
          <section className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-emerald-600">
                  Payment Complete
                </p>

                <h2 className="mt-1 text-lg font-bold text-emerald-900">
                  Your receipt is ready
                </h2>

                <p className="mt-1 text-sm text-emerald-700">
                  Receipt number:{" "}
                  <strong>
                    {payment.receiptNumber}
                  </strong>
                </p>
              </div>

              <Link
                href={`/student/payments/${payment.id}/receipt`}
                className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-700"
              >
                View Receipt
              </Link>
            </div>
          </section>
        ) : (
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="font-bold text-slate-900">
              Receipt
            </h2>

            <p className="mt-1 text-sm leading-6 text-slate-500">
              A receipt becomes available when
              this payment has been fully paid and
              EDSEC has generated its receipt number.
            </p>
          </section>
        )}

        {/* Payment information */}
        <div className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 p-5">
              <h2 className="font-bold text-slate-900">
                Payment Information
              </h2>
            </div>

            <div className="divide-y divide-slate-100">
              <InfoRow
                label="Payment method"
                value={formatMethod(
                  payment.method
                )}
              />

              <InfoRow
                label="Reference"
                value={
                  payment.reference ??
                  "—"
                }
              />

              <InfoRow
                label="Payment date"
                value={formatDateTime(
                  payment.paidAt
                )}
              />

              <InfoRow
                label="Due date"
                value={formatDate(
                  payment.dueDate
                )}
              />

              <InfoRow
                label="Recorded"
                value={formatDateTime(
                  payment.createdAt
                )}
              />
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 p-5">
              <h2 className="font-bold text-slate-900">
                Course Information
              </h2>
            </div>

            <div className="divide-y divide-slate-100">
              <InfoRow
                label="Course"
                value={
                  payment.enrollment
                    ?.course.title ??
                  "—"
                }
              />

              <InfoRow
                label="Cohort"
                value={
                  payment.enrollment
                    ?.cohort?.name ??
                  "No cohort"
                }
              />

              <InfoRow
                label="Duration"
                value={
                  payment.enrollment
                    ?.course
                    .duration ??
                  "—"
                }
              />

              <InfoRow
                label="Learning format"
                value={
                  payment.enrollment
                    ?.course
                    .learningFormat ??
                  "—"
                }
              />
            </div>
          </section>
        </div>

        {/* Payment history */}
        {payment.enrollment &&
          payment.enrollment.payments
            .length > 0 && (
            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 p-5">
                <h2 className="font-bold text-slate-900">
                  Course Payment History
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Other payment records for
                  this enrollment.
                </p>
              </div>

              <div className="divide-y divide-slate-100">
                {payment.enrollment.payments.map(
                  (item) => (
                    <div
                      key={item.id}
                      className={`flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between ${
                        item.id === payment.id
                          ? "bg-slate-50"
                          : ""
                      }`}
                    >
                      <div>
                        <p className="font-semibold text-slate-900">
                          {formatCurrency(
                            item.amountPaid
                          )}{" "}
                          paid
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {formatDate(
                            item.paidAt ??
                              item.createdAt
                          )}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusClass(
                            item.status
                          )}`}
                        >
                          {getStatusLabel(
                            item.status
                          )}
                        </span>

                        {item.status ===
                          "PAID" &&
                          item.receiptNumber && (
                            <Link
                              href={`/student/payments/${item.id}/receipt`}
                              className="text-sm font-semibold text-slate-900 hover:underline"
                            >
                              Receipt
                            </Link>
                          )}
                      </div>
                    </div>
                  )
                )}
              </div>
            </section>
          )}
      </div>
    </main>
  );
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col gap-1 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
      <span className="text-sm text-slate-500">
        {label}
      </span>

      <span className="break-all text-sm font-semibold text-slate-900 sm:text-right">
        {value}
      </span>
    </div>
  );
}