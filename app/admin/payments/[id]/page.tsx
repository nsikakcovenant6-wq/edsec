/* eslint-disable react/no-unescaped-entities */
import Link from "next/link";
import { notFound } from "next/navigation";

import { prisma } from "@/app/lib/prisma";
import { requireRole } from "@/app/lib/auth";
import {
  updatePayment,
  updatePaymentStatus,
  deletePayment,
} from "../actions";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

const PAYMENT_STATUSES = [
  "PENDING",
  "PAID",
  "PARTIAL",
  "OVERDUE",
  "CANCELLED",
] as const;

const PAYMENT_METHODS = [
  "MANUAL",
  "PAYSTACK",
  "FLUTTERWAVE",
  "BANK_TRANSFER",
  "CASH",
] as const;

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function formatDate(
  value: Date | string | null | undefined
): string {
  if (!value) {
    return "—";
  }

  const date =
    value instanceof Date
      ? value
      : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-NG", {
    dateStyle: "medium",
  }).format(date);
}

function formatDateTime(
  value: Date | string | null | undefined
): string {
  if (!value) {
    return "—";
  }

  const date =
    value instanceof Date
      ? value
      : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function formatMethod(
  method: string
): string {
  switch (method) {
    case "BANK_TRANSFER":
      return "Bank Transfer";

    case "PAYSTACK":
      return "Paystack";

    case "FLUTTERWAVE":
      return "Flutterwave";

    case "CASH":
      return "Cash";

    case "MANUAL":
      return "Manual";

    default:
      return method;
  }
}

function getStatusClasses(
  status: string
): string {
  switch (status) {
    case "PAID":
      return "bg-emerald-50 text-emerald-700 ring-emerald-200";

    case "PARTIAL":
      return "bg-amber-50 text-amber-700 ring-amber-200";

    case "OVERDUE":
      return "bg-red-50 text-red-700 ring-red-200";

    case "CANCELLED":
      return "bg-gray-100 text-gray-600 ring-gray-200";

    case "PENDING":
    default:
      return "bg-blue-50 text-blue-700 ring-blue-200";
  }
}

function getStatusLabel(
  status: string
): string {
  switch (status) {
    case "PAID":
      return "Paid";

    case "PARTIAL":
      return "Partial";

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

function getPaymentDateTimeValue(
  value: Date | null
): string {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  const year =
    date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    date.getDate()
  ).padStart(2, "0");

  const hours = String(
    date.getHours()
  ).padStart(2, "0");

  const minutes = String(
    date.getMinutes()
  ).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function getPaymentDateValue(
  value: Date | null
): string {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  const year =
    date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    date.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function isOverdue(
  dueDate: Date | null,
  balance: number
): boolean {
  return Boolean(
    dueDate &&
      balance > 0 &&
      dueDate.getTime() < Date.now()
  );
}

export default async function PaymentDetailPage({
  params,
}: PageProps) {
  await requireRole("ADMIN");

  const { id } = await params;

  const payment =
    await prisma.payment.findUnique({
      where: {
        id,
      },
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            studentProfile: {
              select: {
                id: true,
              },
            },
          },
        },

        enrollment: {
          include: {
            course: {
              select: {
                id: true,
                title: true,
                slug: true,
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
                reference: true,
                receiptNumber: true,
                paidAt: true,
                dueDate: true,
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

  const enrollmentPayments =
    payment.enrollment?.payments ?? [];

  const enrollmentTotal =
    enrollmentPayments.reduce(
      (sum, item) =>
        sum + item.amount,
      0
    );

  const enrollmentPaid =
    enrollmentPayments.reduce(
      (sum, item) =>
        sum + item.amountPaid,
      0
    );

  const enrollmentBalance =
    enrollmentPayments.reduce(
      (sum, item) =>
        sum + item.balance,
      0
    );

  const paymentProgress =
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

  const enrollmentProgress =
    enrollmentTotal > 0
      ? Math.min(
          100,
          Math.round(
            (enrollmentPaid /
              enrollmentTotal) *
              100
          )
        )
      : 0;

  const paymentIsOverdue =
    isOverdue(
      payment.dueDate,
      payment.balance
    );

  const studentName =
    `${payment.student.firstName} ${payment.student.lastName}`;

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm text-gray-500">
              <Link
                href="/admin/payments"
                className="transition hover:text-gray-900"
              >
                Payments
              </Link>

              <span>/</span>

              <span>
                Payment Details
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                Payment Details
              </h1>

              <span
                className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ${getStatusClasses(
                  payment.status
                )}`}
              >
                {getStatusLabel(
                  payment.status
                )}
              </span>
            </div>

            <p className="mt-1 text-sm text-gray-500">
              Review, update and manage
              this payment record.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              href="/admin/payments"
              className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              ← Back to Payments
            </Link>

            <Link
              href={`/admin/students/${payment.student.id}`}
              className="inline-flex items-center justify-center rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
            >
              View Student
            </Link>
          </div>
        </div>

        {/* Payment overview */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Total Charge
            </p>

            <p className="mt-2 text-2xl font-bold text-gray-900">
              {formatCurrency(
                payment.amount
              )}
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Amount Paid
            </p>

            <p className="mt-2 text-2xl font-bold text-emerald-600">
              {formatCurrency(
                payment.amountPaid
              )}
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
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

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Payment Progress
            </p>

            <div className="mt-3">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>
                  {paymentProgress}%
                </span>

                <span>
                  {formatCurrency(
                    payment.amountPaid
                  )}{" "}
                  /{" "}
                  {formatCurrency(
                    payment.amount
                  )}
                </span>
              </div>

              <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full bg-emerald-500 transition-all"
                  style={{
                    width: `${paymentProgress}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Overdue alert */}
        {paymentIsOverdue && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4">
            <div className="flex gap-3">
              <div className="mt-0.5 text-red-600">
                ⚠
              </div>

              <div>
                <h2 className="font-semibold text-red-800">
                  Payment is overdue
                </h2>

                <p className="mt-1 text-sm text-red-700">
                  This payment has an
                  outstanding balance of{" "}
                  <strong>
                    {formatCurrency(
                      payment.balance
                    )}
                  </strong>{" "}
                  and its due date was{" "}
                  <strong>
                    {formatDate(
                      payment.dueDate
                    )}
                  </strong>
                  .
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main column */}
          <div className="space-y-6 lg:col-span-2">
            {/* Student */}
            <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
              <div className="border-b border-gray-100 px-5 py-4">
                <h2 className="font-semibold text-gray-900">
                  Student
                </h2>
              </div>

              <div className="p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <Link
                      href={`/admin/students/${payment.student.id}`}
                      className="text-lg font-semibold text-gray-900 hover:underline"
                    >
                      {studentName}
                    </Link>

                    <p className="mt-1 text-sm text-gray-500">
                      {payment.student.email}
                    </p>

                    {payment.student.phone && (
                      <p className="mt-1 text-sm text-gray-500">
                        {payment.student.phone}
                      </p>
                    )}
                  </div>

                  <Link
                    href={`/admin/students/${payment.student.id}`}
                    className="inline-flex w-fit items-center rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                  >
                    Open Student
                  </Link>
                </div>
              </div>
            </section>

            {/* Enrollment */}
            <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
              <div className="border-b border-gray-100 px-5 py-4">
                <h2 className="font-semibold text-gray-900">
                  Enrollment
                </h2>
              </div>

              <div className="p-5">
                {payment.enrollment ? (
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                        Course
                      </p>

                      <Link
                        href={`/admin/courses/${payment.enrollment.course.id}`}
                        className="mt-1 block font-semibold text-gray-900 hover:underline"
                      >
                        {
                          payment.enrollment
                            .course.title
                        }
                      </Link>
                    </div>

                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                        Cohort
                      </p>

                      <p className="mt-1 font-semibold text-gray-900">
                        {payment.enrollment
                          .cohort?.name ??
                          "No cohort assigned"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                        Enrollment Status
                      </p>

                      <p className="mt-1 font-medium text-gray-900">
                        {
                          payment.enrollment
                            .status
                        }
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                        Cohort Dates
                      </p>

                      <p className="mt-1 font-medium text-gray-900">
                        {formatDate(
                          payment.enrollment
                            .cohort
                            ?.startDate
                        )}{" "}
                        —{" "}
                        {formatDate(
                          payment.enrollment
                            .cohort
                            ?.endDate
                        )}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                    <p className="text-sm font-medium text-amber-800">
                      This payment is not
                      linked to an enrollment.
                    </p>

                    <p className="mt-1 text-sm text-amber-700">
                      Link payments to an
                      enrollment whenever
                      possible so the student's
                      course and cohort can be
                      tracked correctly.
                    </p>
                  </div>
                )}
              </div>
            </section>

            {/* Payment history */}
            {payment.enrollment && (
              <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
                <div className="flex flex-col gap-2 border-b border-gray-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="font-semibold text-gray-900">
                      Enrollment Payment History
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                      All payment records
                      attached to this
                      enrollment.
                    </p>
                  </div>

                  <div className="text-sm text-gray-600">
                    {formatCurrency(
                      enrollmentPaid
                    )}{" "}
                    paid of{" "}
                    {formatCurrency(
                      enrollmentTotal
                    )}
                  </div>
                </div>

                <div className="p-5">
                  <div className="mb-5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-gray-700">
                        Enrollment payment
                        progress
                      </span>

                      <span className="font-semibold text-gray-900">
                        {enrollmentProgress}%
                      </span>
                    </div>

                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100">
                      <div
                        className="h-full rounded-full bg-emerald-500"
                        style={{
                          width: `${enrollmentProgress}%`,
                        }}
                      />
                    </div>

                    <div className="mt-2 flex justify-between text-xs text-gray-500">
                      <span>
                        Paid:{" "}
                        {formatCurrency(
                          enrollmentPaid
                        )}
                      </span>

                      <span>
                        Balance:{" "}
                        {formatCurrency(
                          enrollmentBalance
                        )}
                      </span>
                    </div>
                  </div>

                  {enrollmentPayments.length >
                  0 ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-100 text-sm">
                        <thead>
                          <tr className="text-left text-xs uppercase tracking-wide text-gray-400">
                            <th className="px-3 py-3 font-medium">
                              Date
                            </th>

                            <th className="px-3 py-3 font-medium">
                              Charge
                            </th>

                            <th className="px-3 py-3 font-medium">
                              Paid
                            </th>

                            <th className="px-3 py-3 font-medium">
                              Balance
                            </th>

                            <th className="px-3 py-3 font-medium">
                              Status
                            </th>
                          </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-100">
                          {enrollmentPayments.map(
                            (item) => (
                              <tr
                                key={
                                  item.id
                                }
                                className={
                                  item.id ===
                                  payment.id
                                    ? "bg-gray-50"
                                    : ""
                                }
                              >
                                <td className="px-3 py-3 text-gray-700">
                                  <Link
                                    href={`/admin/payments/${item.id}`}
                                    className="font-medium hover:underline"
                                  >
                                    {formatDate(
                                      item.createdAt
                                    )}
                                  </Link>
                                </td>

                                <td className="px-3 py-3 font-medium text-gray-900">
                                  {formatCurrency(
                                    item.amount
                                  )}
                                </td>

                                <td className="px-3 py-3 text-emerald-700">
                                  {formatCurrency(
                                    item.amountPaid
                                  )}
                                </td>

                                <td className="px-3 py-3 text-red-700">
                                  {formatCurrency(
                                    item.balance
                                  )}
                                </td>

                                <td className="px-3 py-3">
                                  <span
                                    className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ring-1 ${getStatusClasses(
                                      item.status
                                    )}`}
                                  >
                                    {getStatusLabel(
                                      item.status
                                    )}
                                  </span>
                                </td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">
                      No payment history is
                      available for this
                      enrollment.
                    </p>
                  )}
                </div>
              </section>
            )}

            {/* Edit payment */}
            <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
              <div className="border-b border-gray-100 px-5 py-4">
                <h2 className="font-semibold text-gray-900">
                  Edit Payment
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Update the financial
                  information for this payment.
                </p>
              </div>

              <form
                action={updatePayment}
                className="space-y-5 p-5"
              >
                <input
                  type="hidden"
                  name="paymentId"
                  value={payment.id}
                />

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="amount"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Total Charge
                    </label>

                    <input
                      id="amount"
                      name="amount"
                      type="number"
                      min="0.01"
                      step="0.01"
                      defaultValue={
                        payment.amount
                      }
                      required
                      className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="amountPaid"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Amount Paid
                    </label>

                    <input
                      id="amountPaid"
                      name="amountPaid"
                      type="number"
                      min="0"
                      step="0.01"
                      defaultValue={
                        payment.amountPaid
                      }
                      required
                      className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="method"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Payment Method
                    </label>

                    <select
                      id="method"
                      name="method"
                      defaultValue={
                        payment.method
                      }
                      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
                    >
                      {PAYMENT_METHODS.map(
                        (method) => (
                          <option
                            key={method}
                            value={method}
                          >
                            {formatMethod(
                              method
                            )}
                          </option>
                        )
                      )}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="reference"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Payment Reference
                    </label>

                    <input
                      id="reference"
                      name="reference"
                      type="text"
                      defaultValue={
                        payment.reference ??
                        ""
                      }
                      placeholder="e.g. bank reference"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="paidAt"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Paid At
                    </label>

                    <input
                      id="paidAt"
                      name="paidAt"
                      type="datetime-local"
                      defaultValue={getPaymentDateTimeValue(
                        payment.paidAt
                      )}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="dueDate"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Due Date
                    </label>

                    <input
                      id="dueDate"
                      name="dueDate"
                      type="date"
                      defaultValue={getPaymentDateValue(
                        payment.dueDate
                      )}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="notes"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Notes
                  </label>

                  <textarea
                    id="notes"
                    name="notes"
                    rows={4}
                    defaultValue={
                      payment.notes ??
                      ""
                    }
                    placeholder="Optional payment notes..."
                    className="w-full resize-y rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800"
                  >
                    Save Payment Changes
                  </button>
                </div>
              </form>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Payment information */}
            <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
              <div className="border-b border-gray-100 px-5 py-4">
                <h2 className="font-semibold text-gray-900">
                  Payment Information
                </h2>
              </div>

              <div className="divide-y divide-gray-100">
                <div className="px-5 py-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                    Payment ID
                  </p>

                  <p className="mt-1 break-all font-mono text-xs text-gray-700">
                    {payment.id}
                  </p>
                </div>

                <div className="px-5 py-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                    Receipt Number
                  </p>

                  {payment.receiptNumber ? (
                    <p className="mt-1 font-semibold text-gray-900">
                      {payment.receiptNumber}
                    </p>
                  ) : (
                    <p className="mt-1 text-sm text-gray-500">
                      Not generated yet
                    </p>
                  )}
                </div>

                <div className="px-5 py-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                    Reference
                  </p>

                  <p className="mt-1 break-all text-sm font-medium text-gray-900">
                    {payment.reference ??
                      "—"}
                  </p>
                </div>

                <div className="px-5 py-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                    Method
                  </p>

                  <p className="mt-1 text-sm font-medium text-gray-900">
                    {formatMethod(
                      payment.method
                    )}
                  </p>
                </div>

                <div className="px-5 py-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                    Created
                  </p>

                  <p className="mt-1 text-sm font-medium text-gray-900">
                    {formatDateTime(
                      payment.createdAt
                    )}
                  </p>
                </div>

                <div className="px-5 py-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                    Last Updated
                  </p>

                  <p className="mt-1 text-sm font-medium text-gray-900">
                    {formatDateTime(
                      payment.updatedAt
                    )}
                  </p>
                </div>
              </div>
            </section>

            {/* Due date */}
            <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
              <div className="border-b border-gray-100 px-5 py-4">
                <h2 className="font-semibold text-gray-900">
                  Payment Schedule
                </h2>
              </div>

              <div className="space-y-4 p-5">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                    Due Date
                  </p>

                  <p
                    className={`mt-1 font-semibold ${
                      paymentIsOverdue
                        ? "text-red-600"
                        : "text-gray-900"
                    }`}
                  >
                    {formatDate(
                      payment.dueDate
                    )}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                    Payment Date
                  </p>

                  <p className="mt-1 font-semibold text-gray-900">
                    {formatDateTime(
                      payment.paidAt
                    )}
                  </p>
                </div>
              </div>
            </section>

            {/* Notification tracking */}
            <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
              <div className="border-b border-gray-100 px-5 py-4">
                <h2 className="font-semibold text-gray-900">
                  Notification Tracking
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  Used by the automated payment
                  notification system.
                </p>
              </div>

              <div className="divide-y divide-gray-100">
                <div className="flex items-center justify-between gap-4 px-5 py-4">
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      Full payment notification
                    </p>

                    <p className="mt-0.5 text-xs text-gray-500">
                      Mr. Mmekan
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                      payment.paymentNotificationSentAt
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {payment.paymentNotificationSentAt
                      ? "Sent"
                      : "Pending"}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4 px-5 py-4">
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      Due reminder
                    </p>

                    <p className="mt-0.5 text-xs text-gray-500">
                      Payment due date
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                      payment.dueReminderSentAt
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {payment.dueReminderSentAt
                      ? "Sent"
                      : "Pending"}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4 px-5 py-4">
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      Overdue reminder
                    </p>

                    <p className="mt-0.5 text-xs text-gray-500">
                      Outstanding payment
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                      payment.overdueReminderSentAt
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {payment.overdueReminderSentAt
                      ? "Sent"
                      : "Pending"}
                  </span>
                </div>
              </div>
            </section>

            {/* Status management */}
            <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
              <div className="border-b border-gray-100 px-5 py-4">
                <h2 className="font-semibold text-gray-900">
                  Payment Status
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  Status is calculated from payment
                  amounts and due date. Cancellation
                  can be applied manually.
                </p>
              </div>

              <form
                action={updatePaymentStatus}
                className="space-y-4 p-5"
              >
                <input
                  type="hidden"
                  name="paymentId"
                  value={payment.id}
                />

                <select
                  name="status"
                  defaultValue={
                    payment.status
                  }
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
                >
                  {PAYMENT_STATUSES.map(
                    (status) => (
                      <option
                        key={status}
                        value={status}
                      >
                        {getStatusLabel(
                          status
                        )}
                      </option>
                    )
                  )}
                </select>

                <button
                  type="submit"
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                >
                  Update Status
                </button>
              </form>
            </section>

            {/* Delete */}
            <section className="rounded-xl border border-red-200 bg-white shadow-sm">
              <div className="border-b border-red-100 px-5 py-4">
                <h2 className="font-semibold text-red-700">
                  Delete Payment
                </h2>
              </div>

              <div className="p-5">
                <p className="text-sm leading-6 text-gray-600">
                  Deleting a payment removes the
                  financial record permanently.
                  This action cannot be undone.
                </p>

                <form
                  action={deletePayment}
                  className="mt-4"
                >
                  <input
                    type="hidden"
                    name="paymentId"
                    value={payment.id}
                  />

                  <button
                    type="submit"
                    className="w-full rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
                  >
                    Delete Payment
                  </button>
                </form>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}