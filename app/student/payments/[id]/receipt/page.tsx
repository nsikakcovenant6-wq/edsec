import { notFound, redirect } from "next/navigation";
import { prisma } from "@/app/lib/prisma";
import { getCurrentUser } from "@/app/lib/auth";
import PrintReceiptButton from "./PrintReceiptButton";

type ReceiptPageProps = {
  params: Promise<{
    id: string;
  }>;
};

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 2,
  }).format(amount);
}

function formatDate(date: Date | null): string {
  if (!date) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-NG", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(date);
}

export default async function ReceiptPage({
  params,
}: ReceiptPageProps) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "STUDENT") {
    redirect("/admin");
  }

  const { id } = await params;

  const payment = await prisma.payment.findFirst({
    where: {
      id,
      studentId: user.id,
      status: "PAID",
      balance: {
        lte: 0,
      },
    },
    include: {
      enrollment: {
        include: {
          course: true,
          cohort: true,
        },
      },
      student: {
        select: {
          firstName: true,
          lastName: true,
          email: true,
        },
      },
    },
  });

  if (!payment) {
    notFound();
  }

  const studentName =
    [payment.student.firstName, payment.student.lastName]
      .filter(Boolean)
      .join(" ") || payment.student.email;

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8 print:bg-white">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 flex items-center justify-between print:hidden">
          <a
            href="/student/payments"
            className="text-sm font-medium text-slate-600 transition hover:text-slate-900"
          >
            ← Back to payments
          </a>

          <PrintReceiptButton />
        </div>

        <section className="overflow-hidden rounded-2xl bg-white shadow-sm print:rounded-none print:shadow-none">
          <div className="border-b border-slate-200 px-8 py-8 sm:px-10">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-950">
                  EDSEC Computer Training
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                  Innovate. Educate. Elevate.
                </p>
              </div>

              <div className="sm:text-right">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Payment Receipt
                </p>

                <p className="mt-1 text-lg font-bold text-slate-950">
                  {payment.receiptNumber ?? "Receipt"}
                </p>
              </div>
            </div>
          </div>

          <div className="px-8 py-8 sm:px-10">
            <div className="grid gap-8 sm:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Student
                </p>

                <p className="mt-2 font-semibold text-slate-950">
                  {studentName}
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  {payment.student.email}
                </p>
              </div>

              <div className="sm:text-right">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Payment date
                </p>

                <p className="mt-2 font-semibold text-slate-950">
                  {formatDate(payment.paidAt)}
                </p>
              </div>
            </div>

            <div className="my-8 border-t border-slate-200" />

            <div className="space-y-4">
              <div className="flex items-start justify-between gap-6">
                <span className="text-sm text-slate-500">
                  Course
                </span>

                <span className="text-right font-medium text-slate-950">
                  {payment.enrollment?.course.title ?? "—"}
                </span>
              </div>

              <div className="flex items-start justify-between gap-6">
                <span className="text-sm text-slate-500">
                  Cohort
                </span>

                <span className="text-right font-medium text-slate-950">
                  {payment.enrollment?.cohort?.name ?? "—"}
                </span>
              </div>

              <div className="flex items-start justify-between gap-6">
                <span className="text-sm text-slate-500">
                  Payment method
                </span>

                <span className="text-right font-medium capitalize text-slate-950">
                  {payment.method.replaceAll("_", " ")}
                </span>
              </div>

              <div className="flex items-start justify-between gap-6">
                <span className="text-sm text-slate-500">
                  Reference
                </span>

                <span className="break-all text-right font-medium text-slate-950">
                  {payment.reference ?? "—"}
                </span>
              </div>

              <div className="flex items-start justify-between gap-6">
                <span className="text-sm text-slate-500">
                  Amount
                </span>

                <span className="text-right font-semibold text-slate-950">
                  {formatCurrency(payment.amount)}
                </span>
              </div>

              <div className="flex items-start justify-between gap-6">
                <span className="text-sm text-slate-500">
                  Amount paid
                </span>

                <span className="text-right font-semibold text-slate-950">
                  {formatCurrency(payment.amountPaid)}
                </span>
              </div>

              <div className="flex items-start justify-between gap-6 border-t border-slate-200 pt-4">
                <span className="font-semibold text-slate-950">
                  Balance
                </span>

                <span className="font-bold text-slate-950">
                  {formatCurrency(payment.balance)}
                </span>
              </div>
            </div>

            <div className="mt-8 rounded-xl border border-emerald-200 bg-emerald-50 p-5">
              <p className="font-semibold text-emerald-800">
                Payment completed
              </p>

              <p className="mt-1 text-sm text-emerald-700">
                This receipt confirms that the payment has been
                fully settled.
              </p>
            </div>

            {payment.notes && (
              <div className="mt-8">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Notes
                </p>

                <p className="mt-2 whitespace-pre-wrap text-sm text-slate-700">
                  {payment.notes}
                </p>
              </div>
            )}
          </div>

          <div className="border-t border-slate-200 bg-slate-50 px-8 py-6 text-center sm:px-10 print:bg-white">
            <p className="text-xs text-slate-500">
              Thank you for choosing EDSEC Computer Training.
            </p>

            <p className="mt-1 text-xs text-slate-400">
              This receipt was generated electronically.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}