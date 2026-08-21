/* eslint-disable @next/next/no-img-element */
import Link from "next/link";

import { prisma } from "@/app/lib/prisma";
import { requireRole } from "@/app/lib/auth";

import {
  createGalleryItem,
  deleteGalleryItem,
  toggleGalleryPublished,
  updateGalleryItem,
} from "./actions";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

const categories = [
  "Training",
  "Students",
  "Events",
  "Projects",
  "Campus",
  "Other",
];

export default async function AdminGalleryPage() {
  await requireRole("ADMIN");

  const galleryItems = await prisma.galleryItem.findMany({
    orderBy: [
      {
        displayOrder: "asc",
      },
      {
        createdAt: "desc",
      },
    ],
  });

  const totalCount = galleryItems.length;

  const publishedCount = galleryItems.filter(
    (item) => item.isPublished,
  ).length;

  const unpublishedCount = totalCount - publishedCount;

  return (
    <main className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <Link
              href="/admin"
              className="text-sm font-medium text-slate-500 hover:text-slate-900"
            >
              ← Back to Dashboard
            </Link>

            <h1 className="mt-3 text-2xl font-bold text-slate-900 sm:text-3xl">
              Gallery
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage photos and visual content displayed across
              the EDSEC platform.
            </p>
          </div>

          <a
            href="#add-gallery"
            className="inline-flex w-fit rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
          >
            + Add Gallery Item
          </a>
        </div>

        {/* Statistics */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Total Items
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-900">
              {totalCount}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Published
            </p>

            <p className="mt-2 text-3xl font-bold text-emerald-600">
              {publishedCount}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Unpublished
            </p>

            <p className="mt-2 text-3xl font-bold text-amber-600">
              {unpublishedCount}
            </p>
          </div>
        </div>

        {/* Add Gallery Item */}
        <section
          id="add-gallery"
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <div className="border-b border-slate-200 pb-5">
            <h2 className="text-lg font-bold text-slate-900">
              Add Gallery Item
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Upload or add an image that can be displayed on the
              public EDSEC website.
            </p>
          </div>

          <form
            action={createGalleryItem}
            className="mt-6 space-y-6"
          >
            <div className="grid gap-6 md:grid-cols-2">
              <div className="md:col-span-2">
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
                  placeholder="e.g. Web Development Training"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
                />
              </div>

              <div className="md:col-span-2">
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
                  placeholder="https://..."
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
                />

                <p className="mt-2 text-xs text-slate-400">
                  Use the URL of the image you want to display.
                </p>
              </div>

              <div>
                <label
                  htmlFor="category"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Category
                </label>

                <select
                  id="category"
                  name="category"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
                  defaultValue=""
                >
                  <option value="">Select category</option>

                  {categories.map((category) => (
                    <option
                      key={category}
                      value={category}
                    >
                      {category}
                    </option>
                  ))}
                </select>
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
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
                />
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="description"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Description
                </label>

                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  placeholder="Describe this image..."
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
                />
              </div>
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
                  Published gallery items can appear on the public
                  website.
                </span>
              </span>
            </label>

            <button
              type="submit"
              className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Add Gallery Item
            </button>
          </form>
        </section>

        {/* Gallery Items */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 p-6">
            <h2 className="text-lg font-bold text-slate-900">
              Gallery Items
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Edit, publish, unpublish or delete gallery content.
            </p>
          </div>

          {galleryItems.length === 0 ? (
            <div className="p-10 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-2xl">
                🖼️
              </div>

              <h3 className="mt-4 font-semibold text-slate-900">
                No gallery items yet
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Add your first image using the form above.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {galleryItems.map((item) => (
                <div
                  key={item.id}
                  className="p-5 sm:p-6"
                >
                  <div className="flex flex-col gap-6 lg:flex-row">
                    {/* Image */}
                    <div className="w-full shrink-0 lg:w-56">
                      <div className="aspect-video overflow-hidden rounded-2xl bg-slate-100">
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <h3 className="text-lg font-bold text-slate-900">
                            {item.title}
                          </h3>

                          <div className="mt-2 flex flex-wrap gap-2">
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                item.isPublished
                                  ? "bg-emerald-100 text-emerald-700"
                                  : "bg-amber-100 text-amber-700"
                              }`}
                            >
                              {item.isPublished
                                ? "Published"
                                : "Unpublished"}
                            </span>

                            {item.category && (
                              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                                {item.category}
                              </span>
                            )}

                            <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                              Order: {item.displayOrder}
                            </span>
                          </div>
                        </div>
                      </div>

                      {item.description && (
                        <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-600">
                          {item.description}
                        </p>
                      )}

                      <p className="mt-3 break-all text-xs text-slate-400">
                        {item.imageUrl}
                      </p>

                      <p className="mt-2 text-xs text-slate-400">
                        Added {formatDate(item.createdAt)}
                      </p>

                      {/* Edit Form */}
                      <details className="mt-5 rounded-xl border border-slate-200">
                        <summary className="cursor-pointer px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                          Edit Gallery Item
                        </summary>

                        <form
                          action={updateGalleryItem}
                          className="border-t border-slate-200 p-4"
                        >
                          <input
                            type="hidden"
                            name="id"
                            value={item.id}
                          />

                          <div className="grid gap-4 md:grid-cols-2">
                            <div className="md:col-span-2">
                              <label
                                htmlFor={`title-${item.id}`}
                                className="mb-2 block text-xs font-semibold text-slate-600"
                              >
                                Title
                              </label>

                              <input
                                id={`title-${item.id}`}
                                name="title"
                                required
                                defaultValue={item.title}
                                className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-900"
                              />
                            </div>

                            <div className="md:col-span-2">
                              <label
                                htmlFor={`imageUrl-${item.id}`}
                                className="mb-2 block text-xs font-semibold text-slate-600"
                              >
                                Image URL
                              </label>

                              <input
                                id={`imageUrl-${item.id}`}
                                name="imageUrl"
                                type="url"
                                required
                                defaultValue={item.imageUrl}
                                className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-900"
                              />
                            </div>

                            <div>
                              <label
                                htmlFor={`category-${item.id}`}
                                className="mb-2 block text-xs font-semibold text-slate-600"
                              >
                                Category
                              </label>

                              <select
                                id={`category-${item.id}`}
                                name="category"
                                defaultValue={
                                  item.category ?? ""
                                }
                                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-slate-900"
                              >
                                <option value="">
                                  No category
                                </option>

                                {categories.map(
                                  (category) => (
                                    <option
                                      key={category}
                                      value={category}
                                    >
                                      {category}
                                    </option>
                                  ),
                                )}
                              </select>
                            </div>

                            <div>
                              <label
                                htmlFor={`displayOrder-${item.id}`}
                                className="mb-2 block text-xs font-semibold text-slate-600"
                              >
                                Display Order
                              </label>

                              <input
                                id={`displayOrder-${item.id}`}
                                name="displayOrder"
                                type="number"
                                min="0"
                                defaultValue={
                                  item.displayOrder
                                }
                                className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-900"
                              />
                            </div>

                            <div className="md:col-span-2">
                              <label
                                htmlFor={`description-${item.id}`}
                                className="mb-2 block text-xs font-semibold text-slate-600"
                              >
                                Description
                              </label>

                              <textarea
                                id={`description-${item.id}`}
                                name="description"
                                rows={3}
                                defaultValue={
                                  item.description ?? ""
                                }
                                className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-900"
                              />
                            </div>
                          </div>

                          <label className="mt-4 flex cursor-pointer items-center gap-3">
                            <input
                              type="checkbox"
                              name="isPublished"
                              value="true"
                              defaultChecked={
                                item.isPublished
                              }
                              className="h-4 w-4 rounded border-slate-300"
                            />

                            <span className="text-sm font-medium text-slate-700">
                              Published
                            </span>
                          </label>

                          <button
                            type="submit"
                            className="mt-4 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
                          >
                            Save Changes
                          </button>
                        </form>
                      </details>

                      {/* Actions */}
                      <div className="mt-4 flex flex-wrap gap-2">
                        <form
                          action={toggleGalleryPublished}
                        >
                          <input
                            type="hidden"
                            name="id"
                            value={item.id}
                          />

                          <button
                            type="submit"
                            className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                          >
                            {item.isPublished
                              ? "Unpublish"
                              : "Publish"}
                          </button>
                        </form>

                        <form action={deleteGalleryItem}>
                          <input
                            type="hidden"
                            name="id"
                            value={item.id}
                          />

                          <button
                            type="submit"
                            className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700"
                          >
                            Delete
                          </button>
                        </form>
                      </div>
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