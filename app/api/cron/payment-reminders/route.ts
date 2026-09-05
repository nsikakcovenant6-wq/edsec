import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/app/lib/prisma";
import {
  sendPaymentDueReminder,
  sendPaymentOverdueReminder,
} from "@/app/lib/payment-notifications";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function isAuthorized(request: NextRequest): boolean {
  const secret = process.env.CRON_SECRET?.trim();

  if (!secret) {
    return false;
  }

  const authorization = request.headers.get("authorization");

  return authorization === `Bearer ${secret}`;
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json(
      {
        success: false,
        error: "Unauthorized",
      },
      {
        status: 401,
      }
    );
  }

  try {
    const now = new Date();

    const payments = await prisma.payment.findMany({
      where: {
        balance: {
          gt: 0,
        },
        dueDate: {
          lte: now,
        },
        status: {
          in: ["PENDING", "PARTIAL", "OVERDUE"],
        },
      },
      select: {
        id: true,
        dueDate: true,
        dueReminderSentAt: true,
        overdueReminderSentAt: true,
      },
      orderBy: {
        dueDate: "asc",
      },
    });

    let dueSent = 0;
    let overdueSent = 0;
    let failed = 0;

    for (const payment of payments) {
      if (!payment.dueDate) {
        continue;
      }

      const isOverdue =
        payment.dueDate.getTime() < now.getTime();

      /*
       * Overdue payments:
       *
       * If the due reminder has already been sent,
       * the overdue reminder can now be sent.
       *
       * If the payment became overdue before the first
       * cron execution, we send only the overdue reminder
       * rather than sending both reminders together.
       */
      if (isOverdue) {
        if (!payment.overdueReminderSentAt) {
          const success =
            await sendPaymentOverdueReminder(
              payment.id
            );

          if (success) {
            overdueSent++;
          } else {
            failed++;
          }
        }

        continue;
      }

      /*
       * Payment is due now but has not passed its due date.
       */
      if (!payment.dueReminderSentAt) {
        const success =
          await sendPaymentDueReminder(payment.id);

        if (success) {
          dueSent++;
        } else {
          failed++;
        }
      }
    }

    return NextResponse.json({
      success: true,
      processed: payments.length,
      dueSent,
      overdueSent,
      failed,
      executedAt: now.toISOString(),
    });
  } catch (error) {
    console.error(
      "[Payment Reminder Cron] Failed:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error: "Payment reminder job failed.",
      },
      {
        status: 500,
      }
    );
  }
}