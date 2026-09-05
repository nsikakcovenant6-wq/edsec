"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/app/lib/prisma";
import { requireRole } from "@/app/lib/auth";
import { notifyPaymentFullyPaid } from "@/app/lib/payment-notifications";

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

function getString(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}

function getOptionalString(
  formData: FormData,
  key: string
): string | null {
  const value = getString(formData, key);
  return value || null;
}

function getNumber(formData: FormData, key: string): number {
  const value = Number(formData.get(key) ?? 0);

  return Number.isFinite(value) ? value : 0;
}

function getOptionalDate(
  formData: FormData,
  key: string
): Date | null {
  const value = getString(formData, key);

  if (!value) {
    return null;
  }

  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? null : date;
}

function getPaymentMethod(value: string): PaymentMethod {
  if (
    value === "MANUAL" ||
    value === "PAYSTACK" ||
    value === "FLUTTERWAVE" ||
    value === "BANK_TRANSFER" ||
    value === "CASH"
  ) {
    return value;
  }

  return "MANUAL";
}

function calculatePaymentStatus(
  amount: number,
  amountPaid: number,
  dueDate: Date | null
): PaymentStatus {
  const balance = Math.max(0, amount - amountPaid);

  if (balance <= 0 && amount > 0) {
    return "PAID";
  }

  if (dueDate && dueDate.getTime() < Date.now()) {
    return "OVERDUE";
  }

  if (amountPaid > 0) {
    return "PARTIAL";
  }

  return "PENDING";
}

function validateAmounts(
  amount: number,
  amountPaid: number
): void {
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error(
      "Payment amount must be greater than zero."
    );
  }

  if (!Number.isFinite(amountPaid) || amountPaid < 0) {
    throw new Error(
      "Amount paid cannot be negative."
    );
  }

  if (amountPaid > amount) {
    throw new Error(
      "Amount paid cannot be greater than the payment amount."
    );
  }
}

async function verifyStudent(studentId: string) {
  if (!studentId) {
    throw new Error("Student is required.");
  }

  const student = await prisma.user.findFirst({
    where: {
      id: studentId,
      role: "STUDENT",
      status: {
        not: "INACTIVE",
      },
    },
    select: {
      id: true,
    },
  });

  if (!student) {
    throw new Error("Selected student was not found.");
  }

  return student;
}

async function verifyEnrollment(
  enrollmentId: string,
  studentId: string
) {
  if (!enrollmentId) {
    return null;
  }

  const enrollment = await prisma.enrollment.findFirst({
    where: {
      id: enrollmentId,
      studentId,
      status: {
        not: "DROPPED",
      },
    },
    select: {
      id: true,
    },
  });

  if (!enrollment) {
    throw new Error(
      "Selected enrollment does not belong to the selected student."
    );
  }

  return enrollment;
}

function generateReceiptNumber(): string {
  const year = new Date().getFullYear();

  const randomPart = crypto
    .randomUUID()
    .replaceAll("-", "")
    .slice(0, 10)
    .toUpperCase();

  return `EDSEC-${year}-${randomPart}`;
}

async function createPaymentActivity(
  studentId: string,
  paymentId: string,
  amountPaid: number,
  status: PaymentStatus
) {
  try {
    await prisma.studentActivity.create({
      data: {
        studentId,
        type: "PAYMENT_MADE",
        title: "Payment recorded",
        metadata: JSON.stringify({
          paymentId,
          amountPaid,
          status,
        }),
      },
    });
  } catch (error) {
    console.error(
      "[Payment Activity] Failed to create activity:",
      error
    );
  }
}

export async function createPayment(
  formData: FormData
): Promise<void> {
  await requireRole("ADMIN");

  const studentId = getString(formData, "studentId");
  const enrollmentId = getString(formData, "enrollmentId");

  const amount = getNumber(formData, "amount");
  const amountPaid = getNumber(formData, "amountPaid");

  const method = getPaymentMethod(
    getString(formData, "method")
  );

  const reference = getOptionalString(
    formData,
    "reference"
  );

  const notes = getOptionalString(formData, "notes");

  const dueDate = getOptionalDate(
    formData,
    "dueDate"
  );

  validateAmounts(amount, amountPaid);

  await verifyStudent(studentId);

  const enrollment = await verifyEnrollment(
    enrollmentId,
    studentId
  );

  const balance = Math.max(
    0,
    amount - amountPaid
  );

  const status = calculatePaymentStatus(
    amount,
    amountPaid,
    dueDate
  );

  const isPaid = status === "PAID";

  const payment = await prisma.payment.create({
    data: {
      studentId,
      enrollmentId: enrollment?.id ?? null,
      amount,
      amountPaid,
      balance,
      status,
      reference,
      receiptNumber: isPaid
        ? generateReceiptNumber()
        : null,
      method,
      notes,
      paidAt: isPaid ? new Date() : null,
      dueDate,
    },
  });

  await createPaymentActivity(
    studentId,
    payment.id,
    amountPaid,
    status
  );

  if (isPaid) {
    await notifyPaymentFullyPaid(payment.id);
  }

  redirect("/admin/payments");
}

export async function updatePayment(
  formData: FormData
): Promise<void> {
  await requireRole("ADMIN");

  const paymentId = getString(formData, "paymentId");

  if (!paymentId) {
    throw new Error("Payment ID is required.");
  }

  const existing = await prisma.payment.findUnique({
    where: {
      id: paymentId,
    },
  });

  if (!existing) {
    throw new Error("Payment not found.");
  }

  const studentId = getString(formData, "studentId");
  const enrollmentId = getString(formData, "enrollmentId");

  const amount = getNumber(formData, "amount");
  const amountPaid = getNumber(formData, "amountPaid");

  const method = getPaymentMethod(
    getString(formData, "method")
  );

  const reference = getOptionalString(
    formData,
    "reference"
  );

  const notes = getOptionalString(
    formData,
    "notes"
  );

  const dueDate = getOptionalDate(
    formData,
    "dueDate"
  );

  validateAmounts(amount, amountPaid);

  await verifyStudent(studentId);

  const enrollment = await verifyEnrollment(
    enrollmentId,
    studentId
  );

  const balance = Math.max(
    0,
    amount - amountPaid
  );

  const status = calculatePaymentStatus(
    amount,
    amountPaid,
    dueDate
  );

  const isPaid = status === "PAID";

  const payment = await prisma.payment.update({
    where: {
      id: paymentId,
    },
    data: {
      studentId,
      enrollmentId: enrollment?.id ?? null,
      amount,
      amountPaid,
      balance,
      status,
      reference,
      method,
      notes,
      dueDate,

      paidAt: isPaid
        ? existing.paidAt ?? new Date()
        : null,

      receiptNumber: isPaid
        ? existing.receiptNumber ?? generateReceiptNumber()
        : null,

      paymentNotificationSentAt:
        isPaid && existing.status === "PAID"
          ? existing.paymentNotificationSentAt
          : null,

      dueReminderSentAt:
        existing.amount !== amount ||
        existing.amountPaid !== amountPaid ||
        existing.dueDate?.getTime() !== dueDate?.getTime()
          ? null
          : existing.dueReminderSentAt,

      overdueReminderSentAt:
        existing.amount !== amount ||
        existing.amountPaid !== amountPaid ||
        existing.dueDate?.getTime() !== dueDate?.getTime()
          ? null
          : existing.overdueReminderSentAt,
    },
  });

  if (
    isPaid &&
    existing.status !== "PAID"
  ) {
    await notifyPaymentFullyPaid(payment.id);
  }

  redirect("/admin/payments");
}

export async function updatePaymentStatus(
  formData: FormData
): Promise<void> {
  await requireRole("ADMIN");

  const paymentId = getString(
    formData,
    "paymentId"
  );

  const requestedStatus = getString(
    formData,
    "status"
  ) as PaymentStatus;

  if (!paymentId) {
    throw new Error("Payment ID is required.");
  }

  const payment = await prisma.payment.findUnique({
    where: {
      id: paymentId,
    },
  });

  if (!payment) {
    throw new Error("Payment not found.");
  }

  const validStatuses: PaymentStatus[] = [
    "PENDING",
    "PAID",
    "PARTIAL",
    "OVERDUE",
    "CANCELLED",
  ];

  if (!validStatuses.includes(requestedStatus)) {
    throw new Error("Invalid payment status.");
  }

  if (
    requestedStatus === "PAID" &&
    payment.balance > 0
  ) {
    throw new Error(
      "A payment with an outstanding balance cannot be marked as PAID."
    );
  }

  const isPaid =
    requestedStatus === "PAID";

  const updated = await prisma.payment.update({
    where: {
      id: paymentId,
    },
    data: {
      status: requestedStatus,

      paidAt: isPaid
        ? payment.paidAt ?? new Date()
        : payment.paidAt,

      receiptNumber: isPaid
        ? payment.receiptNumber ?? generateReceiptNumber()
        : payment.receiptNumber,

      paymentNotificationSentAt:
        isPaid && payment.status !== "PAID"
          ? null
          : payment.paymentNotificationSentAt,
    },
  });

  if (
    isPaid &&
    payment.status !== "PAID"
  ) {
    await notifyPaymentFullyPaid(
      updated.id
    );
  }

  redirect("/admin/payments");
}

export async function deletePayment(
  formData: FormData
): Promise<void> {
  await requireRole("ADMIN");

  const paymentId = getString(
    formData,
    "paymentId"
  );

  if (!paymentId) {
    throw new Error("Payment ID is required.");
  }

  const payment = await prisma.payment.findUnique({
    where: {
      id: paymentId,
    },
    select: {
      id: true,
      status: true,
      receiptNumber: true,
    },
  });

  if (!payment) {
    throw new Error("Payment not found.");
  }

  if (
    payment.status === "PAID" &&
    payment.receiptNumber
  ) {
    throw new Error(
      "Paid payments with receipts cannot be deleted. Reverse or correct the payment instead."
    );
  }

  await prisma.payment.delete({
    where: {
      id: paymentId,
    },
  });

  redirect("/admin/payments");
}