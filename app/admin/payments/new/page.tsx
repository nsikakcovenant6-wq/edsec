import Link from "next/link";
import { prisma } from "@/app/lib/prisma";
import { requireRole } from "@/app/lib/auth";
import { createPayment } from "../actions";

export default async function NewPaymentPage() {
  await requireRole("ADMIN");

  const students = await prisma.user.findMany({
    where: {
      role: "STUDENT",
      status: {
        not: "INACTIVE",
      },
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      enrollments: {
        where: {
          status: {
            not: "DROPPED",
          },
        },
        select: {
          id: true,
          course: {
            select: {
              title: true,
            },
          },
          cohort: {
            select: {
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
    orderBy: [
      {
        firstName: "asc",
      },
      {
        lastName: "asc",
      },
    ],
  });

  return (
    <main className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6">
          <Link
            href="/admin/payments"
            className="inline-flex text-sm font-medium text-slate-500 hover:text-slate-900"
          >
            ← Back to Payments
          </Link>

          <h1 className="mt-3 text-2xl font-bold text-slate-900 sm:text-3xl">
            Record Payment
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Record a payment or financial charge for a student.
          </p>
        </div>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          {students.length === 0 ? (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-800">
              There are currently no students available for payment
              recording.
            </div>
          ) : (
            <form action={createPayment} className="space-y-6">
              {/* Student */}
              <div>
                <label
                  htmlFor="studentId"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Student
                </label>

                <select
                  id="studentId"
                  name="studentId"
                  required
                  defaultValue=""
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-100"
                >
                  <option value="" disabled>
                    Select student
                  </option>

                  {students.map((student) => {
                    const name =
                      `${student.firstName} ${student.lastName}`.trim();

                    return (
                      <option key={student.id} value={student.id}>
                        {name} — {student.email}
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Enrollment */}
              <div>
                <label
                  htmlFor="enrollmentId"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Enrollment / Course
                </label>

                <select
                  id="enrollmentId"
                  name="enrollmentId"
                  defaultValue=""
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-100"
                >
                  <option value="">
                    General payment / no specific enrollment
                  </option>

                  {students.map((student) => {
                    const studentName =
                      `${student.firstName} ${student.lastName}`.trim();

                    return student.enrollments.map((enrollment) => (
                      <option
                        key={enrollment.id}
                        value={enrollment.id}
                      >
                        {studentName} — {enrollment.course.title}
                        {enrollment.cohort
                          ? ` — ${enrollment.cohort.name}`
                          : ""}
                      </option>
                    ));
                  })}
                </select>

                <p className="mt-2 text-xs text-slate-500">
                  Select the enrollment this payment belongs to, or leave it
                  as a general payment.
                </p>
              </div>

              {/* Amounts */}
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="amount"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Amount / Charge
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
                      placeholder="150000"
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
                      defaultValue="0"
                      required
                      placeholder="50000"
                      className="w-full rounded-r-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
                    />
                  </div>
                </div>
              </div>

              {/* Method */}
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
                  defaultValue="MANUAL"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-900"
                >
                  <option value="MANUAL">Manual</option>
                  <option value="BANK_TRANSFER">Bank Transfer</option>
                  <option value="CASH">Cash</option>
                  <option value="PAYSTACK">Paystack</option>
                  <option value="FLUTTERWAVE">Flutterwave</option>
                </select>
              </div>

              {/* Reference */}
              <div>
                <label
                  htmlFor="reference"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Payment Reference
                </label>

                <input
                  id="reference"
                  name="reference"
                  placeholder="e.g. EDSEC-2026-0001"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
                />

                <p className="mt-2 text-xs text-slate-500">
                  Optional. Useful for bank transfers and online payments.
                </p>
              </div>

              {/* Dates */}
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
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
                  />
                </div>
              </div>

              {/* Notes */}
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
                  placeholder="Add any additional payment information..."
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
                />
              </div>

              {/* Actions */}
              <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-end">
                <Link
                  href="/admin/payments"
                  className="inline-flex justify-center rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </Link>

                <button
                  type="submit"
                  className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
                >
                  Record Payment
                </button>
              </div>
            </form>
          )}
        </section>
      </div>
    </main>
  );
}