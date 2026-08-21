import Link from "next/link";

import { prisma } from "@/app/lib/prisma";
import { requireRole } from "@/app/lib/auth";

import {
  deleteAnnouncement,
  updateAnnouncementStatus,
} from "./actions";

function formatDate(date: Date | null) {
  if (!date) {
    return "Not published";
  }

  return new Intl.DateTimeFormat("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

const statusClass: Record<string, string> = {
  DRAFT: "bg-amber-100 text-amber-700",
  PUBLISHED: "bg-emerald-100 text-emerald-700",
  ARCHIVED: "bg-slate-100 text-slate-700",
};

export default async function AdminAnnouncementsPage() {
  await requireRole("ADMIN");

  const announcements =
    await prisma.announcement.findMany({
      include: {
        author: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

  const publishedCount =
    announcements.filter(
      (item) => item.status === "PUBLISHED",
    ).length;

  const draftCount =
    announcements.filter(
      (item) => item.status === "DRAFT",
    ).length;

  const archivedCount =
    announcements.filter(
      (item) => item.status === "ARCHIVED",
    ).length;

  return (
    <main className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">
              Administration
            </p>

            <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
              Announcements
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Create and manage announcements for EDSEC
              students.
            </p>
          </div>

          <Link
            href="/admin/announcements/new"
            className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
          >
            + New Announcement
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Total
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-900">
              {announcements.length}
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">
              Published
            </p>

            <p className="mt-2 text-3xl font-bold text-emerald-700">
              {publishedCount}
            </p>
          </div>

          <div className="rounded-2xl border border-amber-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-amber-600">
              Drafts
            </p>

            <p className="mt-2 text-3xl font-bold text-amber-700">
              {draftCount}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Archived
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-700">
              {archivedCount}
            </p>
          </div>
        </div>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 p-6">
            <h2 className="text-lg font-bold text-slate-900">
              All Announcements
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Manage announcements published to the student
              portal.
            </p>
          </div>

          {announcements.length === 0 ? (
            <div className="p-12 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-2xl">
                📢
              </div>

              <h3 className="mt-4 font-semibold text-slate-900">
                No announcements yet
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Create your first announcement for students.
              </p>

              <Link
                href="/admin/announcements/new"
                className="mt-5 inline-flex rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white"
              >
                Create Announcement
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {announcements.map((announcement) => (
                <div
                  key={announcement.id}
                  className="p-5 transition hover:bg-slate-50 sm:p-6"
                >
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-bold text-slate-900">
                          {announcement.title}
                        </h3>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            statusClass[
                              announcement.status
                            ] ??
                            "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {announcement.status}
                        </span>
                      </div>

                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
                        {announcement.content}
                      </p>

                      <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-400">
                        <span>
                          Created{" "}
                          {formatDate(
                            announcement.createdAt,
                          )}
                        </span>

                        <span>
                          Published{" "}
                          {formatDate(
                            announcement.publishedAt,
                          )}
                        </span>

                        <span>
                          By{" "}
                          {announcement.author
                            ? `${announcement.author.firstName} ${announcement.author.lastName}`
                            : "Administrator"}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Link
                        href={`/admin/announcements/${announcement.id}`}
                        className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                      >
                        Manage
                      </Link>

                      {announcement.status !==
                        "PUBLISHED" && (
                        <form
                          action={
                            updateAnnouncementStatus
                          }
                        >
                          <input
                            type="hidden"
                            name="id"
                            value={announcement.id}
                          />

                          <input
                            type="hidden"
                            name="status"
                            value="PUBLISHED"
                          />

                          <button
                            type="submit"
                            className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
                          >
                            Publish
                          </button>
                        </form>
                      )}

                      {announcement.status ===
                        "PUBLISHED" && (
                        <form
                          action={
                            updateAnnouncementStatus
                          }
                        >
                          <input
                            type="hidden"
                            name="id"
                            value={announcement.id}
                          />

                          <input
                            type="hidden"
                            name="status"
                            value="ARCHIVED"
                          />

                          <button
                            type="submit"
                            className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                          >
                            Archive
                          </button>
                        </form>
                      )}

                      <form action={deleteAnnouncement}>
                        <input
                          type="hidden"
                          name="id"
                          value={announcement.id}
                        />

                        <button
                          type="submit"
                          className="rounded-xl bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-100"
                        >
                          Delete
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}