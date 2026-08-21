/* eslint-disable @next/next/no-img-element */
import Link from "next/link";

import { prisma } from "@/app/lib/prisma";
import { requireRole } from "@/app/lib/auth";

import {
  deleteAnnouncement,
  updateAnnouncement,
  updateAnnouncementStatus,
} from "../actions";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

function formatDate(date: Date | null) {
  if (!date) {
    return "Not published";
  }

  return new Intl.DateTimeFormat("en-NG", {
    dateStyle: "full",
    timeStyle: "short",
  }).format(date);
}

const statusClass: Record<string, string> = {
  DRAFT: "bg-amber-100 text-amber-700",
  PUBLISHED: "bg-emerald-100 text-emerald-700",
  ARCHIVED: "bg-slate-100 text-slate-700",
};

export default async function AnnouncementDetailsPage({
  params,
}: PageProps) {
  await requireRole("ADMIN");

  const { id } = await params;

  const announcement =
    await prisma.announcement.findUnique({
      where: {
        id,
      },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

  if (!announcement) {
    return (
      <main className="min-h-screen bg-slate-50 p-6">
        <div className="mx-auto max-w-3xl rounded-2xl border border-red-200 bg-white p-8 text-center">
          <h1 className="text-xl font-bold text-slate-900">
            Announcement not found
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            The announcement you are looking for does not
            exist.
          </p>

          <Link
            href="/admin/announcements"
            className="mt-5 inline-flex rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white"
          >
            Back to Announcements
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <div>
          <Link
            href="/admin/announcements"
            className="text-sm font-medium text-slate-500 hover:text-slate-900"
          >
            ← Back to Announcements
          </Link>

          <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                  {announcement.title}
                </h1>

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

              <p className="mt-2 text-sm text-slate-500">
                Created{" "}
                {formatDate(announcement.createdAt)}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {announcement.status !==
                "PUBLISHED" && (
                <form
                  action={updateAnnouncementStatus}
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
                  action={updateAnnouncementStatus}
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

              {announcement.status ===
                "ARCHIVED" && (
                <form
                  action={updateAnnouncementStatus}
                >
                  <input
                    type="hidden"
                    name="id"
                    value={announcement.id}
                  />

                  <input
                    type="hidden"
                    name="status"
                    value="DRAFT"
                  />

                  <button
                    type="submit"
                    className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Restore
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="border-b border-slate-200 pb-6">
            <h2 className="text-lg font-bold text-slate-900">
              Edit Announcement
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Update the announcement content or publication
              status.
            </p>
          </div>

          <form
            action={updateAnnouncement}
            className="mt-6 space-y-6"
          >
            <input
              type="hidden"
              name="id"
              value={announcement.id}
            />

            <div>
              <label
                htmlFor="title"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Title
              </label>

              <input
                id="title"
                name="title"
                required
                defaultValue={announcement.title}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
              />
            </div>

            <div>
              <label
                htmlFor="content"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Content
              </label>

              <textarea
                id="content"
                name="content"
                required
                rows={12}
                defaultValue={announcement.content}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm leading-6 outline-none focus:border-slate-900"
              />
            </div>

            <div>
              <label
                htmlFor="imageUrl"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Image URL
              </label>

              <input
                id="imageUrl"
                name="imageUrl"
                type="url"
                defaultValue={
                  announcement.imageUrl ?? ""
                }
                placeholder="https://example.com/image.jpg"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
              />
            </div>

            <div>
              <label
                htmlFor="status"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Status
              </label>

              <select
                id="status"
                name="status"
                defaultValue={announcement.status}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-900"
              >
                <option value="DRAFT">
                  Draft
                </option>

                <option value="PUBLISHED">
                  Published
                </option>

                <option value="ARCHIVED">
                  Archived
                </option>
              </select>
            </div>

            <button
              type="submit"
              className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Save Changes
            </button>
          </form>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">
            Announcement Preview
          </h2>

          <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200">
            {announcement.imageUrl && (
              <img
                src={announcement.imageUrl}
                alt={announcement.title}
                className="h-64 w-full object-cover"
              />
            )}

            <div className="p-6">
              <h3 className="text-xl font-bold text-slate-900">
                {announcement.title}
              </h3>

              <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-600">
                {announcement.content}
              </p>

              <div className="mt-6 border-t border-slate-200 pt-4 text-xs text-slate-400">
                Published{" "}
                {formatDate(
                  announcement.publishedAt,
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-red-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-red-700">
            Danger Zone
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Deleting this announcement permanently removes
            it from the system.
          </p>

          <form
            action={deleteAnnouncement}
            className="mt-5"
          >
            <input
              type="hidden"
              name="id"
              value={announcement.id}
            />

            <button
              type="submit"
              className="rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white hover:bg-red-700"
            >
              Delete Announcement
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}