import Link from "next/link";
import { redirect } from "next/navigation";

import { prisma } from "@/app/lib/prisma";
import { getCurrentUser } from "@/app/lib/auth";

export default async function StudentPaymentsPage() {
  const user = await getCurrentUser();

  if (!user) redirect("/login");
  if (user.role !== "STUDENT") redirect("/admin");

  const payments = await prisma.payment.findMany({
    where: {
      studentId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      enrollment: {
        include: {
          course: true,
        },
      },
    },
  });

  const total = payments.reduce((sum, p) => sum + p.amount, 0);
  const paid = payments.reduce((sum, p) => sum + p.amountPaid, 0);
  const balance = Math.max(0, total - paid);

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-8 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Link href="/student/dashboard" className="text-sm font-semibold text-blue-600">
          ← Dashboard
        </Link>

        <h1 className="mt-6 text-3xl font-bold">Payments</h1>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <Stat label="Course Fees" value={`₦${total.toLocaleString()}`} />
          <Stat label="Amount Paid" value={`₦${paid.toLocaleString()}`} />
          <Stat label="Balance" value={`₦${balance.toLocaleString()}`} />
        </div>

        <div className="mt-8 space-y-4">
          {payments.map((payment) => (
            <div
              key={payment.id}
              className="rounded-3xl border border-slate-200 bg-white p-6"
            >
              <div className="flex flex-col justify-between gap-4 sm:flex-row">
                <div>
                  <h2 className="font-bold">
                    {payment.enrollment?.course.title || "Course Payment"}
                  </h2>

                  <p className="mt-2 text-sm text-slate-500">
                    Created {payment.createdAt.toLocaleDateString()}
                  </p>
                </div>

                <div className="text-left sm:text-right">
                  <p className="text-xl font-bold">
                    ₦{payment.amountPaid.toLocaleString()}
                  </p>

                  <span className="text-sm font-semibold text-blue-600">
                    {payment.status}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {payments.length === 0 && (
            <div className="rounded-3xl bg-white p-10 text-center text-slate-500">
              No payment records available.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-bold">{value}</p>
    </div>
  );
}