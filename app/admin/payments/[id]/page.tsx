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

export default async function PaymentDetailsPage({
  params,
}: PageProps) {
  await requireRole("ADMIN");

  const { id } = await params;

  const payment = await prisma.payment.findUnique({
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
          status: true,
          studentProfile: {
            select: {
              studentNumber: true,
              educationalLevel: true,
            },
          },
        },
      },
      enrollment: {
        select: {
          id: true,
          status: true,
          progress: true,
          startedAt: true,
          completedAt: true,
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
              status: true,
              startDate: true,
              endDate: true,
            },
          },
          payments: {
            select: {
              id: true,
              amount: true,
              amountPaid: true,
              balance: true,
              status: true,
              method: true,
              reference: true,
              paidAt: true,
              dueDate: true,
              createdAt: true,
            },
            orderBy: {
              createdAt: "desc",
            },
          },
        },
      },
    },
  });

  if (!payment) {
    notFound();
  }

  const studentName =
    `${payment.student.firstName} ${payment.student.lastName}`.trim();

  const enrollmentPayments = payment.enrollment?.payments ?? [];

  const enrollmentTotal = enrollmentPayments.reduce(
    (sum, item) => sum + item.amount,
    0
  );

  const enrollmentPaid = enrollmentPayments.reduce(
    (sum, item) => sum + item.amountPaid,
    0
  );

  const enrollmentBalance = enrollmentPayments.reduce(
    (sum, item) => sum + item.balance,
    0
  );

  const statusClass: Record<string, string> = {
    PENDING: "bg-amber-100 text-amber-700",
    PAID: "bg-emerald-100 text-emerald-700",
    PARTIAL: "bg-blue-100 text-blue-700",
    OVERDUE: "bg-red-100 text-red-700",
    CANCELLED: "bg-slate-100 text-slate-600",
  };

  const formatDate = (date: Date | null) => {
    if (!date) {
      return "—";
    }

    return new Intl.DateTimeFormat("en-NG", {
      dateStyle: "medium",
    }).format(date);
  };

  const formatDateTime = (date: Date | null) => {
    if (!date) {
      return "—";
    }

    return new Intl.DateTimeFormat("en-NG", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date);
  };

  const toDateInputValue = (date: Date | null) => {
    if (!date) {
      return "";
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  return (
    <main className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              href="/admin/payments"
              className="mb-2 inline-flex text-sm font-medium text-slate-500 hover:text-slate-900"
            >
              ← Back to Payments
            </Link>

            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              Payment Details
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              View and manage this financial record.
            </p>
          </div>

          <span
            className={`inline-flex w-fit rounded-full px-3 py-1 text-sm font-semibold ${
              statusClass[payment.status] ??
              "bg-slate-100 text-slate-700"
            }`}
          >
            {payment.status}
          </span>
        </div>

        {/* Payment Summary */}
        <div className="grid gap-4 sm:grid-cols-3">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Total Amount
            </p>

            <p className="mt-2 text-2xl font-bold text-slate-900">
              ₦{payment.amount.toLocaleString("en-NG")}
            </p>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Amount Paid
            </p>

            <p className="mt-2 text-2xl font-bold text-emerald-600">
              ₦{payment.amountPaid.toLocaleString("en-NG")}
            </p>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Outstanding
            </p>

            <p className="mt-2 text-2xl font-bold text-red-600">
              ₦{payment.balance.toLocaleString("en-NG")}
            </p>
          </section>
        </div>

        {/* Student + Payment */}
        <div className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900">
              Student Information
            </h2>

            <div className="mt-5 space-y-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Name
                </p>

                <Link
                  href={`/admin/students/${payment.student.id}`}
                  className="mt-1 inline-block font-semibold text-slate-900 hover:underline"
                >
                  {studentName}
                </Link>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Email
                </p>

                <p className="mt-1 text-slate-700">
                  {payment.student.email}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Phone
                </p>

                <p className="mt-1 text-slate-700">
                  {payment.student.phone ?? "—"}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Student Number
                </p>

                <p className="mt-1 text-slate-700">
                  {payment.student.studentProfile?.studentNumber ??
                    "—"}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Educational Level
                </p>

                <p className="mt-1 text-slate-700">
                  {payment.student.studentProfile?.educationalLevel ??
                    "—"}
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900">
              Payment Information
            </h2>

            <div className="mt-5 space-y-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Payment Method
                </p>

                <p className="mt-1 font-medium text-slate-700">
                  {payment.method.replace("_", " ")}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Reference
                </p>

                <p className="mt-1 break-all text-slate-700">
                  {payment.reference ?? "No reference"}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Payment Date
                </p>

                <p className="mt-1 text-slate-700">
                  {formatDateTime(payment.paidAt)}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Due Date
                </p>

                <p className="mt-1 text-slate-700">
                  {formatDate(payment.dueDate)}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Created
                </p>

                <p className="mt-1 text-slate-700">
                  {formatDateTime(payment.createdAt)}
                </p>
              </div>

              {payment.notes && (
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Notes
                  </p>

                  <p className="mt-1 whitespace-pre-wrap text-sm text-slate-700">
                    {payment.notes}
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Enrollment */}
        {payment.enrollment && (
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Enrollment
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Course connected to this payment.
                </p>
              </div>

              <Link
                href={`/admin/enrollments/${payment.enrollment.id}`}
                className="inline-flex w-fit rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
              >
                View Enrollment
              </Link>
            </div>

            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Course
                </p>

                <p className="mt-1 font-semibold text-slate-900">
                  {payment.enrollment.course.title}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Cohort
                </p>

                <p className="mt-1 text-slate-700">
                  {payment.enrollment.cohort?.name ??
                    "No cohort assigned"}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Enrollment Status
                </p>

                <p className="mt-1 text-slate-700">
                  {payment.enrollment.status}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Course Progress
                </p>

                <p className="mt-1 text-slate-700">
                  {payment.enrollment.progress}%
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Edit Payment */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Edit Payment
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Update the financial details for this payment.
            </p>
          </div>

          <form
            action={updatePayment}
            className="mt-6 space-y-6"
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
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Amount
                </label>

                <div className="flex">
                  <span className="inline-flex items-center rounded-l-xl border border-r-0 border-slate-300 bg-slate-50 px-4 text-sm font-semibold text-slate-600">
                    ₦
                  </span>

                  <input
                    id="amount"
                    name="amount"
                    type="number"
                    min="0.01"
                    step="0.01"
                    required
                    defaultValue={payment.amount}
                    className="w-full rounded-r-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="amountPaid"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Amount Paid
                </label>

                <div className="flex">
                  <span className="inline-flex items-center rounded-l-xl border border-r-0 border-slate-300 bg-slate-50 px-4 text-sm font-semibold text-slate-600">
                    ₦
                  </span>

                  <input
                    id="amountPaid"
                    name="amountPaid"
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    defaultValue={payment.amountPaid}
                    className="w-full rounded-r-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
                  />
                </div>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="method"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Payment Method
                </label>

                <select
                  id="method"
                  name="method"
                  defaultValue={payment.method}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-900"
                >
                  <option value="MANUAL">Manual</option>
                  <option value="BANK_TRANSFER">
                    Bank Transfer
                  </option>
                  <option value="CASH">Cash</option>
                  <option value="PAYSTACK">Paystack</option>
                  <option value="FLUTTERWAVE">
                    Flutterwave
                  </option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="reference"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Reference
                </label>

                <input
                  id="reference"
                  name="reference"
                  defaultValue={payment.reference ?? ""}
                  placeholder="Payment reference"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
                />
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="paidAt"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Payment Date
                </label>

                <input
                  id="paidAt"
                  name="paidAt"
                  type="date"
                  defaultValue={toDateInputValue(payment.paidAt)}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
                />
              </div>

              <div>
                <label
                  htmlFor="dueDate"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Due Date
                </label>

                <input
                  id="dueDate"
                  name="dueDate"
                  type="date"
                  defaultValue={toDateInputValue(payment.dueDate)}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="notes"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Notes
              </label>

              <textarea
                id="notes"
                name="notes"
                rows={4}
                defaultValue={payment.notes ?? ""}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
              />
            </div>

            <button
              type="submit"
              className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Save Changes
            </button>
          </form>
        </section>

        {/* Status */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">
            Manage Status
          </h2>

          <form
            action={updatePaymentStatus}
            className="mt-5 flex flex-col gap-3 sm:flex-row"
          >
            <input
              type="hidden"
              name="paymentId"
              value={payment.id}
            />

            <select
              name="status"
              defaultValue={payment.status}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-900 sm:max-w-xs"
            >
              <option value="PENDING">Pending</option>
              <option value="PAID">Paid</option>
              <option value="PARTIAL">Partial</option>
              <option value="OVERDUE">Overdue</option>
              <option value="CANCELLED">Cancelled</option>
            </select>

            <button
              type="submit"
              className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Update Status
            </button>
          </form>
        </section>

        {/* Enrollment Payment History */}
        {payment.enrollment && (
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 p-6">
              <h2 className="text-lg font-bold text-slate-900">
                Enrollment Payment History
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Financial history for{" "}
                {payment.enrollment.course.title}.
              </p>
            </div>

            <div className="grid gap-4 border-b border-slate-200 p-6 sm:grid-cols-3">
              <div>
                <p className="text-xs text-slate-500">
                  Total Charges
                </p>

                <p className="mt-1 font-bold text-slate-900">
                  ₦{enrollmentTotal.toLocaleString("en-NG")}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-500">
                  Total Paid
                </p>

                <p className="mt-1 font-bold text-emerald-600">
                  ₦{enrollmentPaid.toLocaleString("en-NG")}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-500">
                  Outstanding
                </p>

                <p className="mt-1 font-bold text-red-600">
                  ₦{enrollmentBalance.toLocaleString("en-NG")}
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-200 text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4">Paid</th>
                    <th className="px-6 py-4">Balance</th>
                    <th className="px-6 py-4">Method</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Reference</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {enrollmentPayments.map((item) => (
                    <tr
                      key={item.id}
                      className={
                        item.id === payment.id
                          ? "bg-slate-50"
                          : ""
                      }
                    >
                      <td className="px-6 py-4">
                        {formatDate(item.createdAt)}
                      </td>

                      <td className="px-6 py-4 font-medium">
                        ₦{item.amount.toLocaleString("en-NG")}
                      </td>

                      <td className="px-6 py-4 text-emerald-600">
                        ₦{item.amountPaid.toLocaleString("en-NG")}
                      </td>

                      <td className="px-6 py-4 text-red-600">
                        ₦{item.balance.toLocaleString("en-NG")}
                      </td>

                      <td className="px-6 py-4">
                        {item.method.replace("_", " ")}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                            statusClass[item.status] ??
                            "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>

                      <td className="max-w-50 break-all px-6 py-4 text-slate-500">
                        {item.reference ?? "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Delete */}
        <section className="rounded-2xl border border-red-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-red-700">
            Delete Payment
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Deleting a payment permanently removes this financial
            record. Use this only when the record was created by
            mistake.
          </p>

          <form
            action={deletePayment}
            className="mt-5"
          >
            <input
              type="hidden"
              name="paymentId"
              value={payment.id}
            />

            <button
              type="submit"
              className="rounded-xl border border-red-200 px-5 py-3 text-sm font-semibold text-red-600 hover:bg-red-50"
            >
              Delete Payment
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}