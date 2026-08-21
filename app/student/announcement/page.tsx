/* eslint-disable @next/next/no-img-element */
import Link from "next/link";

import { prisma } from "@/app/lib/prisma";
import { requireRole } from "@/app/lib/auth";

function formatDate(date: Date | null) {
  if (!date) {
    return "";
  }

  return new Intl.DateTimeFormat("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export default async function StudentAnnouncementsPage() {
  const student = await requireRole("STUDENT");

  if (!student) {
    throw new Error("Unauthorized.");
  }

  const announcements =
    await prisma.announcement.findMany({
      where: {
        status: "PUBLISHED",
      },
      include: {
        author: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: [
        {
          publishedAt: "desc",
        },
        {
          createdAt: "desc",
        },
      ],
    });

  return (
    <main className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <div>
          <Link
            href="/student"
            className="text-sm font-medium text-slate-500 hover:text-slate-900"
          >
            ← Back to Dashboard
          </Link>

          <div className="mt-5">
            <p className="text-sm font-medium text-slate-500">
              Student Portal
            </p>

            <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
              Announcements
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Stay updated with the latest news and
              information from EDSEC.
            </p>
          </div>
        </div>

        {announcements.length === 0 ? (
          <section className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-3xl">
              📢
            </div>

            <h2 className="mt-5 text-lg font-bold text-slate-900">
              No announcements yet
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              There are currently no published announcements.
              Check back later.
            </p>
          </section>
        ) : (
          <div className="space-y-5">
            {announcements.map((announcement) => (
              <article
                key={announcement.id}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
              >
                {announcement.imageUrl && (
                  <img
                    src={announcement.imageUrl}
                    alt={announcement.title}
                    className="h-56 w-full object-cover sm:h-72"
                  />
                )}

                <div className="p-6 sm:p-8">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                      Announcement
                    </span>

                    {announcement.publishedAt && (
                      <span className="text-xs text-slate-400">
                        {formatDate(
                          announcement.publishedAt,
                        )}
                      </span>
                    )}
                  </div>

                  <h2 className="mt-4 text-xl font-bold text-slate-900 sm:text-2xl">
                    {announcement.title}
                  </h2>

                  <div className="mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-600">
                    {announcement.content}
                  </div>

                  <div className="mt-6 border-t border-slate-100 pt-4">
                    <p className="text-xs text-slate-400">
                      Posted by{" "}
                      {announcement.author
                        ? `${announcement.author.firstName} ${announcement.author.lastName}`
                        : "EDSEC Administration"}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}