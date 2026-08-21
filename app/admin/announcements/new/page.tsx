import Link from "next/link";

import { requireRole } from "@/app/lib/auth";

import { createAnnouncement } from "../actions";

export default async function NewAnnouncementPage() {
  await requireRole("ADMIN");

  return (
    <main className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/admin/announcements"
          className="text-sm font-medium text-slate-500 hover:text-slate-900"
        >
          ← Back to Announcements
        </Link>

        <div className="mt-5 rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 p-6 sm:p-8">
            <p className="text-sm font-medium text-slate-500">
              Administration
            </p>

            <h1 className="mt-1 text-2xl font-bold text-slate-900">
              Create Announcement
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Create an announcement that can be published to
              students.
            </p>
          </div>

          <form
            action={createAnnouncement}
            className="space-y-6 p-6 sm:p-8"
          >
            <div>
              <label
                htmlFor="title"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Announcement Title
              </label>

              <input
                id="title"
                name="title"
                required
                placeholder="e.g. New Web Development Class Schedule"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-100"
              />
            </div>

            <div>
              <label
                htmlFor="content"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Announcement Content
              </label>

              <textarea
                id="content"
                name="content"
                required
                rows={10}
                placeholder="Write the announcement here..."
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm leading-6 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-100"
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
                placeholder="https://example.com/image.jpg"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-100"
              />

              <p className="mt-2 text-xs text-slate-400">
                Optional. Add an image URL to display with the
                announcement.
              </p>
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
                defaultValue="DRAFT"
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-900"
              >
                <option value="DRAFT">
                  Save as Draft
                </option>

                <option value="PUBLISHED">
                  Publish Now
                </option>

                <option value="ARCHIVED">
                  Archived
                </option>
              </select>
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-end">
              <Link
                href="/admin/announcements"
                className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-center text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </Link>

              <button
                type="submit"
                className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
              >
                Create Announcement
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}