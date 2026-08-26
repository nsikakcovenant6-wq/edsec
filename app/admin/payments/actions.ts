"use server";

import { redirect } from "next/navigation";

import { prisma } from "@/app/lib/prisma";
import { requireRole } from "@/app/lib/auth";

type PaymentMethod =
  | "MANUAL"
  | "PAYSTACK"
  | "FLUTTERWAVE"
  | "BANK_TRANSFER"
  | "CASH";

type PaymentStatus =
  | "PENDING"
  | "PAID"
  | "PARTIAL"
  | "OVERDUE"
  | "CANCELLED";

function getString(formData: FormData, name: string) {
  const value = formData.get(name);

  return typeof value === "string" ? value.trim() : "";
}

function getOptionalString(formData: FormData, name: string) {
  const value = getString(formData, name);

  return value.length > 0 ? value : null;
}

function getNumber(formData: FormData, name: string) {
  const value = Number(formData.get(name));

  return Number.isFinite(value) ? value : 0;
}

function getOptionalDate(formData: FormData, name: string) {
  const value = getString(formData, name);

  if (!value) {
    return null;
  }

  const date = new Date(`${value}T00:00:00`);

  return Number.isNaN(date.getTime()) ? null : date;
}

function getPaymentMethod(value: string): PaymentMethod {
  const methods: PaymentMethod[] = [
    "MANUAL",
    "PAYSTACK",
    "FLUTTERWAVE",
    "BANK_TRANSFER",
    "CASH",
  ];

  if (methods.includes(value as PaymentMethod)) {
    return value as PaymentMethod;
  }

  return "MANUAL";
}

function getPaymentStatus(value: string): PaymentStatus {
  const statuses: PaymentStatus[] = [
    "PENDING",
    "PAID",
    "PARTIAL",
    "OVERDUE",
    "CANCELLED",
  ];

  if (statuses.includes(value as PaymentStatus)) {
    return value as PaymentStatus;
  }

  throw new Error("Invalid payment status.");
}

function calculatePaymentStatus(
  amount: number,
  amountPaid: number,
  dueDate: Date | null
): PaymentStatus {
  if (amountPaid >= amount) {
    return "PAID";
  }

  if (amountPaid > 0) {
    return "PARTIAL";
  }

  if (dueDate && dueDate.getTime() < Date.now()) {
    return "OVERDUE";
  }

  return "PENDING";
}

function validateAmounts(amount: number, amountPaid: number) {
  if (amount <= 0) {
    throw new Error("Payment amount must be greater than zero.");
  }

  if (amountPaid < 0) {
    throw new Error("Amount paid cannot be negative.");
  }

  if (amountPaid > amount) {
    throw new Error(
      "Amount paid cannot be greater than the payment amount."
    );
  }
}

async function verifyStudent(studentId: string) {
  const student = await prisma.user.findUnique({
    where: {
      id: studentId,
    },
    select: {
      id: true,
      role: true,
      status: true,
    },
  });

  if (!student || student.role !== "STUDENT") {
    throw new Error("Selected student was not found.");
  }

  return student;
}

async function verifyEnrollment(
  enrollmentId: string,
  studentId: string
) {
  const enrollment = await prisma.enrollment.findUnique({
    where: {
      id: enrollmentId,
    },
    select: {
      id: true,
      studentId: true,
    },
  });

  if (!enrollment) {
    throw new Error("Selected enrollment was not found.");
  }

  if (enrollment.studentId !== studentId) {
    throw new Error(
      "The selected enrollment does not belong to this student."
    );
  }

  return enrollment;
}

export async function createPayment(
  formData: FormData
): Promise<void> {
  await requireRole("ADMIN");

  const studentId = getString(formData, "studentId");
  const enrollmentId = getOptionalString(formData, "enrollmentId");

  const amount = getNumber(formData, "amount");
  const amountPaid = getNumber(formData, "amountPaid");

  const method = getPaymentMethod(
    getString(formData, "method") || "MANUAL"
  );

  const reference = getOptionalString(formData, "reference");
  const notes = getOptionalString(formData, "notes");

  const paidAt = getOptionalDate(formData, "paidAt");
  const dueDate = getOptionalDate(formData, "dueDate");

  if (!studentId) {
    throw new Error("Student is required.");
  }

  validateAmounts(amount, amountPaid);

  await verifyStudent(studentId);

  if (enrollmentId) {
    await verifyEnrollment(enrollmentId, studentId);
  }

  const balance = Math.max(0, amount - amountPaid);

  const status = calculatePaymentStatus(
    amount,
    amountPaid,
    dueDate
  );

  const payment = await prisma.payment.create({
    data: {
      studentId,
      enrollmentId,
      amount,
      amountPaid,
      balance,
      status,
      method,
      reference,
      notes,
      paidAt:
        amountPaid > 0
          ? paidAt ?? new Date()
          : null,
      dueDate,
    },
  });

  await prisma.studentActivity.create({
    data: {
      studentId,
      enrollmentId,
      type: "PAYMENT_MADE",
      title:
        status === "PAID"
          ? "Payment completed"
          : "Payment recorded",
      description:
        amountPaid > 0
          ? `Payment of ₦${amountPaid.toLocaleString(
              "en-NG"
            )} was recorded.`
          : `A charge of ₦${amount.toLocaleString(
              "en-NG"
            )} was recorded.`,
      metadata: JSON.stringify({
        paymentId: payment.id,
        amount,
        amountPaid,
        balance,
        status,
        method,
        reference,
      }),
    },
  });

  redirect(`/admin/payments/${payment.id}`);
}

export async function updatePayment(
  formData: FormData
): Promise<void> {
  await requireRole("ADMIN");

  const paymentId = getString(formData, "paymentId");

  if (!paymentId) {
    throw new Error("Payment ID is required.");
  }

  const existingPayment = await prisma.payment.findUnique({
    where: {
      id: paymentId,
    },
    select: {
      id: true,
      studentId: true,
      enrollmentId: true,
    },
  });

  if (!existingPayment) {
    throw new Error("Payment not found.");
  }

  const amount = getNumber(formData, "amount");
  const amountPaid = getNumber(formData, "amountPaid");

  const method = getPaymentMethod(
    getString(formData, "method") || "MANUAL"
  );

  const reference = getOptionalString(formData, "reference");
  const notes = getOptionalString(formData, "notes");

  const paidAt = getOptionalDate(formData, "paidAt");
  const dueDate = getOptionalDate(formData, "dueDate");

  validateAmounts(amount, amountPaid);

  const balance = Math.max(0, amount - amountPaid);

  const status = calculatePaymentStatus(
    amount,
    amountPaid,
    dueDate
  );

  const payment = await prisma.payment.update({
    where: {
      id: paymentId,
    },
    data: {
      amount,
      amountPaid,
      balance,
      status,
      method,
      reference,
      notes,
      paidAt:
        amountPaid > 0
          ? paidAt ?? new Date()
          : null,
      dueDate,
    },
  });

  await prisma.studentActivity.create({
    data: {
      studentId: payment.studentId,
      enrollmentId: payment.enrollmentId,
      type: "PAYMENT_MADE",
      title: "Payment record updated",
      description:
        amountPaid > 0
          ? `Payment was updated to ₦${amountPaid.toLocaleString(
              "en-NG"
            )} paid.`
          : `Payment charge was updated to ₦${amount.toLocaleString(
              "en-NG"
            )}.`,
      metadata: JSON.stringify({
        paymentId: payment.id,
        amount,
        amountPaid,
        balance,
        status,
        method,
        reference,
      }),
    },
  });

  redirect(`/admin/payments/${payment.id}`);
}

export async function updatePaymentStatus(
  formData: FormData
): Promise<void> {
  await requireRole("ADMIN");

  const paymentId = getString(formData, "paymentId");
  const rawStatus = getString(formData, "status");

  if (!paymentId) {
    throw new Error("Payment ID is required.");
  }

  const status = getPaymentStatus(rawStatus);

  const payment = await prisma.payment.findUnique({
    where: {
      id: paymentId,
    },
    select: {
      id: true,
      studentId: true,
      enrollmentId: true,
      status: true,
    },
  });

  if (!payment) {
    throw new Error("Payment not found.");
  }

  await prisma.payment.update({
    where: {
      id: paymentId,
    },
    data: {
      status,
    },
  });

  if (payment.status !== status) {
    await prisma.studentActivity.create({
      data: {
        studentId: payment.studentId,
        enrollmentId: payment.enrollmentId,
        type: "PAYMENT_MADE",
        title: "Payment status updated",
        description: `Payment status changed from ${payment.status} to ${status}.`,
        metadata: JSON.stringify({
          paymentId,
          previousStatus: payment.status,
          status,
        }),
      },
    });
  }

  redirect(`/admin/payments/${paymentId}`);
}

export async function deletePayment(
  formData: FormData
): Promise<void> {
  await requireRole("ADMIN");

  const paymentId = getString(formData, "paymentId");

  if (!paymentId) {
    throw new Error("Payment ID is required.");
  }

  const payment = await prisma.payment.findUnique({
    where: {
      id: paymentId,
    },
    select: {
      id: true,
      studentId: true,
      enrollmentId: true,
    },
  });

  if (!payment) {
    throw new Error("Payment not found.");
  }

  await prisma.payment.delete({
    where: {
      id: paymentId,
    },
  });

  redirect("/admin/payments");
}