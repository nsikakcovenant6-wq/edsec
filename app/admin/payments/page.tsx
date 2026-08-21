import Link from "next/link";
import { prisma } from "@/app/lib/prisma";
import { requireRole } from "@/app/lib/auth";

export default async function AdminPaymentsPage() {
  await requireRole("ADMIN");

  const payments = await prisma.payment.findMany({
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
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const totalCharges = payments.reduce(
    (sum, payment) => sum + payment.amount,
    0
  );

  const totalPaid = payments.reduce(
    (sum, payment) => sum + payment.amountPaid,
    0
  );

  const totalBalance = payments.reduce(
    (sum, payment) => sum + payment.balance,
    0
  );

  const paidCount = payments.filter(
    (payment) => payment.status === "PAID"
  ).length;

  const pendingCount = payments.filter(
    (payment) =>
      payment.status === "PENDING" ||
      payment.status === "PARTIAL" ||
      payment.status === "OVERDUE"
  ).length;

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

  return (
    <main className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              href="/admin"
              className="mb-2 inline-flex text-sm font-medium text-slate-500 hover:text-slate-900"
            >
              ← Admin Dashboard
            </Link>

            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              Payments
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage student payments, balances and financial records.
            </p>
          </div>

          <Link
            href="/admin/payments/new"
            className="inline-flex w-fit items-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            + Record Payment
          </Link>
        </div>

        {/* Summary */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Total Charges
            </p>

            <p className="mt-2 text-2xl font-bold text-slate-900">
              ₦{totalCharges.toLocaleString("en-NG")}
            </p>

            <p className="mt-1 text-xs text-slate-400">
              {payments.length} payment records
            </p>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Total Paid
            </p>

            <p className="mt-2 text-2xl font-bold text-emerald-600">
              ₦{totalPaid.toLocaleString("en-NG")}
            </p>

            <p className="mt-1 text-xs text-slate-400">
              {paidCount} fully paid
            </p>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Outstanding
            </p>

            <p className="mt-2 text-2xl font-bold text-red-600">
              ₦{totalBalance.toLocaleString("en-NG")}
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Amount remaining
            </p>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Open Payments
            </p>

            <p className="mt-2 text-2xl font-bold text-amber-600">
              {pendingCount}
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Pending, partial or overdue
            </p>
          </section>
        </div>

        {/* Payment List */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 p-6">
            <h2 className="text-lg font-bold text-slate-900">
              Payment Records
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              View and manage all recorded student payments.
            </p>
          </div>

          {payments.length === 0 ? (
            <div className="p-10 text-center">
              <p className="font-semibold text-slate-900">
                No payments recorded yet.
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Record your first student payment to get started.
              </p>

              <Link
                href="/admin/payments/new"
                className="mt-5 inline-flex rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
              >
                Record Payment
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-250 text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-6 py-4">Student</th>
                    <th className="px-6 py-4">Course</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4">Paid</th>
                    <th className="px-6 py-4">Balance</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Method</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {payments.map((payment) => {
                    const studentName =
                      `${payment.student.firstName} ${payment.student.lastName}`.trim();

                    return (
                      <tr
                        key={payment.id}
                        className="transition hover:bg-slate-50"
                      >
                        <td className="px-6 py-4">
                          <Link
                            href={`/admin/students/${payment.student.id}`}
                            className="font-semibold text-slate-900 hover:underline"
                          >
                            {studentName}
                          </Link>

                          <p className="mt-1 text-xs text-slate-500">
                            {payment.student.email}
                          </p>
                        </td>

                        <td className="px-6 py-4 text-slate-700">
                          {payment.enrollment?.course.title ?? "General Payment"}
                        </td>

                        <td className="px-6 py-4 font-medium text-slate-900">
                          ₦{payment.amount.toLocaleString("en-NG")}
                        </td>

                        <td className="px-6 py-4 font-medium text-emerald-600">
                          ₦{payment.amountPaid.toLocaleString("en-NG")}
                        </td>

                        <td className="px-6 py-4 font-medium text-red-600">
                          ₦{payment.balance.toLocaleString("en-NG")}
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                              statusClass[payment.status] ??
                              "bg-slate-100 text-slate-700"
                            }`}
                          >
                            {payment.status}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-slate-600">
                          {payment.method.replace("_", " ")}
                        </td>

                        <td className="px-6 py-4 text-slate-600">
                          {formatDate(payment.createdAt)}
                        </td>

                        <td className="px-6 py-4">
                          <Link
                            href={`/admin/payments/${payment.id}`}
                            className="font-semibold text-slate-700 hover:underline"
                          >
                            View
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}