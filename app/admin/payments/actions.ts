"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/app/lib/prisma";
import { requireRole } from "@/app/lib/auth";

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

  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? null : date;
}

function calculatePaymentStatus(
  amount: number,
  amountPaid: number,
  dueDate: Date | null
) {
  if (amountPaid >= amount) {
    return "PAID" as const;
  }

  if (amountPaid > 0) {
    return "PARTIAL" as const;
  }

  if (dueDate && dueDate.getTime() < Date.now()) {
    return "OVERDUE" as const;
  }

  return "PENDING" as const;
}

export async function createPayment(formData: FormData): Promise<void> {
  await requireRole("ADMIN");

  const studentId = getString(formData, "studentId");
  const enrollmentId = getOptionalString(formData, "enrollmentId");

  const amount = getNumber(formData, "amount");
  const amountPaid = getNumber(formData, "amountPaid");

  const method = getString(formData, "method") || "MANUAL";
  const reference = getOptionalString(formData, "reference");
  const notes = getOptionalString(formData, "notes");

  const paidAt = getOptionalDate(formData, "paidAt");
  const dueDate = getOptionalDate(formData, "dueDate");

  if (!studentId) {
    throw new Error("Student is required.");
  }

  if (amount <= 0) {
    throw new Error("Payment amount must be greater than zero.");
  }

  if (amountPaid < 0) {
    throw new Error("Amount paid cannot be negative.");
  }

  if (amountPaid > amount) {
    throw new Error("Amount paid cannot be greater than the payment amount.");
  }

  const student = await prisma.user.findUnique({
    where: {
      id: studentId,
    },
    select: {
      id: true,
      role: true,
    },
  });

  if (!student || student.role !== "STUDENT") {
    throw new Error("Selected student was not found.");
  }

  if (enrollmentId) {
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
      throw new Error("The enrollment does not belong to this student.");
    }
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
      reference,
      method: method as
        | "MANUAL"
        | "PAYSTACK"
        | "FLUTTERWAVE"
        | "BANK_TRANSFER"
        | "CASH",
      notes,
      paidAt: amountPaid > 0 ? paidAt ?? new Date() : null,
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
      description: `Payment of ₦${amountPaid.toLocaleString(
        "en-NG"
      )} was recorded.`,
      metadata: JSON.stringify({
        paymentId: payment.id,
        amount,
        amountPaid,
        balance,
        status,
        reference,
      }),
    },
  });

  redirect(`/admin/payments/${payment.id}`);
}

export async function updatePayment(formData: FormData): Promise<void> {
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

  const method = getString(formData, "method") || "MANUAL";
  const reference = getOptionalString(formData, "reference");
  const notes = getOptionalString(formData, "notes");

  const paidAt = getOptionalDate(formData, "paidAt");
  const dueDate = getOptionalDate(formData, "dueDate");

  if (amount <= 0) {
    throw new Error("Payment amount must be greater than zero.");
  }

  if (amountPaid < 0) {
    throw new Error("Amount paid cannot be negative.");
  }

  if (amountPaid > amount) {
    throw new Error("Amount paid cannot be greater than the payment amount.");
  }

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
      reference,
      method: method as
        | "MANUAL"
        | "PAYSTACK"
        | "FLUTTERWAVE"
        | "BANK_TRANSFER"
        | "CASH",
      notes,
      paidAt: amountPaid > 0 ? paidAt ?? new Date() : null,
      dueDate,
    },
  });

  if (amountPaid > 0) {
    await prisma.studentActivity.create({
      data: {
        studentId: payment.studentId,
        enrollmentId: payment.enrollmentId,
        type: "PAYMENT_MADE",
        title: "Payment updated",
        description: `Payment was updated to ₦${amountPaid.toLocaleString(
          "en-NG"
        )} paid.`,
        metadata: JSON.stringify({
          paymentId: payment.id,
          amount,
          amountPaid,
          balance,
          status,
          reference,
        }),
      },
    });
  }

  redirect(`/admin/payments/${payment.id}`);
}

export async function updatePaymentStatus(
  formData: FormData
): Promise<void> {
  await requireRole("ADMIN");

  const paymentId = getString(formData, "paymentId");
  const status = getString(formData, "status");

  if (!paymentId) {
    throw new Error("Payment ID is required.");
  }

  const validStatuses = [
    "PENDING",
    "PAID",
    "PARTIAL",
    "OVERDUE",
    "CANCELLED",
  ];

  if (!validStatuses.includes(status)) {
    throw new Error("Invalid payment status.");
  }

  await prisma.payment.update({
    where: {
      id: paymentId,
    },
    data: {
      status: status as
        | "PENDING"
        | "PAID"
        | "PARTIAL"
        | "OVERDUE"
        | "CANCELLED",
    },
  });

  redirect(`/admin/payments/${paymentId}`);
}

export async function deletePayment(formData: FormData): Promise<void> {
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