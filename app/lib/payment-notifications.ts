import { prisma } from "@/app/lib/prisma";

type PaymentWithRelations = {
  id: string;
  amount: number;
  amountPaid: number;
  balance: number;
  status: string;
  method: string;
  reference: string | null;
  receiptNumber: string | null;
  paidAt: Date | null;
  dueDate: Date | null;

  paymentNotificationSentAt: Date | null;
  dueReminderSentAt: Date | null;
  overdueReminderSentAt: Date | null;

  student: {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
  };

  enrollment: {
    id: string;
    course: {
      id: string;
      title: string;
    };
    cohort: {
      id: string;
      name: string;
    } | null;
  } | null;
};

function getEnv(name: string): string {
  return process.env[name]?.trim() ?? "";
}

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
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function getStudentName(
  student: PaymentWithRelations["student"]
): string {
  const name = [student.firstName, student.lastName]
    .filter(Boolean)
    .join(" ")
    .trim();

  return name || student.email;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

async function getPayment(
  paymentId: string
): Promise<PaymentWithRelations | null> {
  return prisma.payment.findUnique({
    where: {
      id: paymentId,
    },
    include: {
      student: {
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
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

          cohort: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });
}

async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}): Promise<boolean> {
  const apiKey = getEnv("RESEND_API_KEY");
  const from = getEnv("PAYMENT_NOTIFICATION_FROM");

  if (!apiKey) {
    console.error(
      "[Payment Notifications] RESEND_API_KEY is not configured."
    );

    return false;
  }

  if (!from) {
    console.error(
      "[Payment Notifications] PAYMENT_NOTIFICATION_FROM is not configured."
    );

    return false;
  }

  if (!to) {
    console.error(
      "[Payment Notifications] Recipient email is missing."
    );

    return false;
  }

  try {
    const response = await fetch(
      "https://api.resend.com/emails",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from,
          to: [to],
          subject,
          html,
        }),
      }
    );

    if (!response.ok) {
      const body = await response.text();

      console.error(
        "[Payment Notifications] Resend request failed:",
        response.status,
        body
      );

      return false;
    }

    return true;
  } catch (error) {
    console.error(
      "[Payment Notifications] Email request failed:",
      error
    );

    return false;
  }
}

function paymentSummaryHtml(
  payment: PaymentWithRelations
): string {
  const studentName = getStudentName(payment.student);

  const courseName =
    payment.enrollment?.course.title ??
    "Course not specified";

  const cohortName =
    payment.enrollment?.cohort?.name ??
    "Cohort not specified";

  return `
    <div style="font-family:Arial,Helvetica,sans-serif;max-width:680px;margin:0 auto;color:#172033;">
      <table style="width:100%;border-collapse:collapse;">
        <tr>
          <td style="padding:10px 0;color:#667085;">Student</td>
          <td style="padding:10px 0;text-align:right;font-weight:600;">
            ${escapeHtml(studentName)}
          </td>
        </tr>

        <tr>
          <td style="padding:10px 0;color:#667085;">Email</td>
          <td style="padding:10px 0;text-align:right;">
            ${escapeHtml(payment.student.email)}
          </td>
        </tr>

        <tr>
          <td style="padding:10px 0;color:#667085;">Course</td>
          <td style="padding:10px 0;text-align:right;font-weight:600;">
            ${escapeHtml(courseName)}
          </td>
        </tr>

        <tr>
          <td style="padding:10px 0;color:#667085;">Cohort</td>
          <td style="padding:10px 0;text-align:right;">
            ${escapeHtml(cohortName)}
          </td>
        </tr>

        <tr>
          <td style="padding:10px 0;color:#667085;">Payment amount</td>
          <td style="padding:10px 0;text-align:right;font-weight:600;">
            ${formatCurrency(payment.amount)}
          </td>
        </tr>

        <tr>
          <td style="padding:10px 0;color:#667085;">Amount paid</td>
          <td style="padding:10px 0;text-align:right;font-weight:600;">
            ${formatCurrency(payment.amountPaid)}
          </td>
        </tr>

        <tr>
          <td style="padding:10px 0;color:#667085;">Balance</td>
          <td style="padding:10px 0;text-align:right;font-weight:700;">
            ${formatCurrency(payment.balance)}
          </td>
        </tr>

        <tr>
          <td style="padding:10px 0;color:#667085;">Payment method</td>
          <td style="padding:10px 0;text-align:right;">
            ${escapeHtml(payment.method)}
          </td>
        </tr>

        <tr>
          <td style="padding:10px 0;color:#667085;">Reference</td>
          <td style="padding:10px 0;text-align:right;">
            ${escapeHtml(payment.reference ?? "—")}
          </td>
        </tr>

        <tr>
          <td style="padding:10px 0;color:#667085;">Receipt number</td>
          <td style="padding:10px 0;text-align:right;font-weight:600;">
            ${escapeHtml(payment.receiptNumber ?? "Pending")}
          </td>
        </tr>

        <tr>
          <td style="padding:10px 0;color:#667085;">Due date</td>
          <td style="padding:10px 0;text-align:right;">
            ${formatDate(payment.dueDate)}
          </td>
        </tr>

        <tr>
          <td style="padding:10px 0;color:#667085;">Paid at</td>
          <td style="padding:10px 0;text-align:right;">
            ${formatDate(payment.paidAt)}
          </td>
        </tr>
      </table>
    </div>
  `;
}

export async function notifyPaymentFullyPaid(
  paymentId: string
): Promise<boolean> {
  const payment = await getPayment(paymentId);

  if (!payment) {
    console.error(
      `[Payment Notifications] Payment ${paymentId} was not found.`
    );

    return false;
  }

  if (
    payment.status !== "PAID" ||
    payment.balance > 0 ||
    payment.amountPaid < payment.amount
  ) {
    return false;
  }

  if (payment.paymentNotificationSentAt) {
    return true;
  }

  const recipient = getEnv(
    "PAYMENT_NOTIFICATION_EMAIL"
  );

  if (!recipient) {
    console.error(
      "[Payment Notifications] PAYMENT_NOTIFICATION_EMAIL is not configured."
    );

    return false;
  }

  const studentName = getStudentName(
    payment.student
  );

  const sent = await sendEmail({
    to: recipient,
    subject: `Payment fully paid — ${studentName}`,

    html: `
      <div style="font-family:Arial,Helvetica,sans-serif;max-width:680px;margin:0 auto;color:#172033;">
        <div style="padding:24px 0;border-bottom:1px solid #e5e7eb;">
          <h1 style="margin:0;font-size:24px;">
            Payment Fully Paid
          </h1>

          <p style="margin:6px 0 0;color:#667085;">
            EDSEC Computer Training
          </p>
        </div>

        <div style="padding:28px 0;">
          <p style="font-size:16px;">
            A student payment has been fully completed.
          </p>

          ${paymentSummaryHtml(payment)}
        </div>
      </div>
    `,
  });

  if (!sent) {
    return false;
  }

  await prisma.payment.updateMany({
    where: {
      id: payment.id,
      paymentNotificationSentAt: null,
    },

    data: {
      paymentNotificationSentAt: new Date(),
    },
  });

  return true;
}

export async function sendPaymentDueReminder(
  paymentId: string
): Promise<boolean> {
  const payment = await getPayment(paymentId);

  if (!payment) {
    return false;
  }

  if (
    payment.status === "PAID" ||
    payment.status === "CANCELLED" ||
    payment.balance <= 0 ||
    !payment.dueDate
  ) {
    return false;
  }

  if (payment.dueDate.getTime() > Date.now()) {
    return false;
  }

  if (payment.dueReminderSentAt) {
    return true;
  }

  const recipient = getEnv(
    "PAYMENT_NOTIFICATION_EMAIL"
  );

  if (!recipient) {
    console.error(
      "[Payment Notifications] PAYMENT_NOTIFICATION_EMAIL is not configured."
    );

    return false;
  }

  const studentName = getStudentName(
    payment.student
  );

  const sent = await sendEmail({
    to: recipient,
    subject: `Payment due — ${studentName}`,

    html: `
      <div style="font-family:Arial,Helvetica,sans-serif;max-width:680px;margin:0 auto;color:#172033;">
        <div style="padding:24px 0;border-bottom:1px solid #e5e7eb;">
          <h1 style="margin:0;font-size:24px;">
            Payment Due
          </h1>

          <p style="margin:6px 0 0;color:#667085;">
            EDSEC Computer Training
          </p>
        </div>

        <div style="padding:28px 0;">
          <p style="font-size:16px;">
            A student payment has reached its due date and still has an outstanding balance.
          </p>

          ${paymentSummaryHtml(payment)}
        </div>
      </div>
    `,
  });

  if (!sent) {
    return false;
  }

  await prisma.payment.updateMany({
    where: {
      id: payment.id,
      dueReminderSentAt: null,
    },

    data: {
      dueReminderSentAt: new Date(),
    },
  });

  return true;
}

export async function sendPaymentOverdueReminder(
  paymentId: string
): Promise<boolean> {
  const payment = await getPayment(paymentId);

  if (!payment) {
    return false;
  }

  if (
    payment.status === "PAID" ||
    payment.status === "CANCELLED" ||
    payment.balance <= 0 ||
    !payment.dueDate
  ) {
    return false;
  }

  if (payment.dueDate.getTime() >= Date.now()) {
    return false;
  }

  if (payment.overdueReminderSentAt) {
    return true;
  }

  const recipient = getEnv(
    "PAYMENT_NOTIFICATION_EMAIL"
  );

  if (!recipient) {
    console.error(
      "[Payment Notifications] PAYMENT_NOTIFICATION_EMAIL is not configured."
    );

    return false;
  }

  const studentName = getStudentName(
    payment.student
  );

  const sent = await sendEmail({
    to: recipient,
    subject: `Payment overdue — ${studentName}`,

    html: `
      <div style="font-family:Arial,Helvetica,sans-serif;max-width:680px;margin:0 auto;color:#172033;">
        <div style="padding:24px 0;border-bottom:1px solid #e5e7eb;">
          <h1 style="margin:0;font-size:24px;">
            Payment Overdue
          </h1>

          <p style="margin:6px 0 0;color:#667085;">
            EDSEC Computer Training
          </p>
        </div>

        <div style="padding:28px 0;">
          <p style="font-size:16px;">
            A student payment is now overdue and still has an outstanding balance.
          </p>

          ${paymentSummaryHtml(payment)}
        </div>
      </div>
    `,
  });

  if (!sent) {
    return false;
  }

  await prisma.payment.updateMany({
    where: {
      id: payment.id,
      overdueReminderSentAt: null,
    },

    data: {
      overdueReminderSentAt: new Date(),
    },
  });

  return true;
}