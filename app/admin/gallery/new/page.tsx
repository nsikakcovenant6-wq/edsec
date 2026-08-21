import Link from "next/link";

import { requireRole } from "@/app/lib/auth";

import { createGalleryItem } from "../actions";

export default async function NewGalleryItemPage() {
  await requireRole("ADMIN");

  return (
    <main className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/admin/gallery"
          className="text-sm font-medium text-slate-500 hover:text-slate-900"
        >
          ← Back to Gallery
        </Link>

        <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="border-b border-slate-200 pb-5">
            <h1 className="text-2xl font-bold text-slate-900">
              Add Gallery Item
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Add an image to the EDSEC gallery.
            </p>
          </div>

          <form
            action={createGalleryItem}
            className="mt-6 space-y-6"
          >
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
                placeholder="EDSEC ICT Training Session"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
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
                required
                placeholder="https://example.com/image.jpg"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
              />

              <p className="mt-2 text-xs text-slate-500">
                Use a publicly accessible image URL.
              </p>
            </div>

            <div>
              <label
                htmlFor="category"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Category
              </label>

              <input
                id="category"
                name="category"
                placeholder="Training, Students, Events..."
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Description
              </label>

              <textarea
                id="description"
                name="description"
                rows={5}
                placeholder="Describe this gallery image..."
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
              />
            </div>

            <div>
              <label
                htmlFor="displayOrder"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Display Order
              </label>

              <input
                id="displayOrder"
                name="displayOrder"
                type="number"
                min="0"
                defaultValue="0"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
              />
            </div>

            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <input
                type="checkbox"
                name="isPublished"
                value="true"
                defaultChecked
                className="h-4 w-4 rounded border-slate-300"
              />

              <span>
                <span className="block text-sm font-semibold text-slate-800">
                  Publish immediately
                </span>

                <span className="block text-xs text-slate-500">
                  Published images can appear on the public website.
                </span>
              </span>
            </label>

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Link
                href="/admin/gallery"
                className="rounded-xl border border-slate-300 px-5 py-3 text-center text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </Link>

              <button
                type="submit"
                className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
              >
                Create Gallery Item
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}