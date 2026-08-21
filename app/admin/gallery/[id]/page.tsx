/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { notFound } from "next/navigation";

import { prisma } from "@/app/lib/prisma";
import { requireRole } from "@/app/lib/auth";

import {
  deleteGalleryItem,
  toggleGalleryPublished,
  updateGalleryItem,
} from "../actions";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function GalleryItemDetailsPage({
  params,
}: PageProps) {
  await requireRole("ADMIN");

  const { id } = await params;

  const item = await prisma.galleryItem.findUnique({
    where: {
      id,
    },
  });

  if (!item) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <div>
          <Link
            href="/admin/gallery"
            className="text-sm font-medium text-slate-500 hover:text-slate-900"
          >
            ← Back to Gallery
          </Link>

          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                Edit Gallery Item
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Update this gallery item.
              </p>
            </div>

            <div className="flex gap-2">
              <form action={toggleGalleryPublished}>
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
            </div>
          </div>
        </div>

        <section className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="aspect-video bg-slate-100">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Preview
              </p>

              <h2 className="mt-2 text-lg font-bold text-slate-900">
                {item.title}
              </h2>

              {item.description && (
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {item.description}
                </p>
              )}

              <div className="mt-4 flex flex-wrap gap-2">
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
              </div>
            </div>
          </div>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <form
              action={updateGalleryItem}
              className="space-y-6"
            >
              <input
                type="hidden"
                name="id"
                value={item.id}
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
                  defaultValue={item.title}
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
                  defaultValue={item.imageUrl}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
                />
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
                  defaultValue={item.category ?? ""}
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
                  defaultValue={item.description ?? ""}
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
                  defaultValue={item.displayOrder}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
                />
              </div>

              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
                <input
                  type="checkbox"
                  name="isPublished"
                  value="true"
                  defaultChecked={item.isPublished}
                  className="h-4 w-4 rounded border-slate-300"
                />

                <span>
                  <span className="block text-sm font-semibold text-slate-800">
                    Published
                  </span>

                  <span className="block text-xs text-slate-500">
                    Make this image available on the public website.
                  </span>
                </span>
              </label>

              <button
                type="submit"
                className="w-full rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
              >
                Save Changes
              </button>
            </form>
          </section>
        </section>

        <section className="rounded-2xl border border-red-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-red-700">
            Danger Zone
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Permanently remove this gallery item.
          </p>

          <form
            action={deleteGalleryItem}
            className="mt-5"
          >
            <input
              type="hidden"
              name="id"
              value={item.id}
            />

            <button
              type="submit"
              className="rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white hover:bg-red-700"
            >
              Delete Gallery Item
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}