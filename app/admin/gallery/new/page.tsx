/* eslint-disable @next/next/no-img-element */
// app/admin/gallery/new/page.tsx

"use client";

import Link from "next/link";
import {
  useRef,
  useState,
} from "react";

import { createGalleryItem } from "../actions";

const categories = [
  "Training",
  "Students",
  "Events",
  "Projects",
  "Campus",
  "Graduation",
  "Workshop",
  "Facilities",
  "Other",
];

export default function NewGalleryItemPage() {
  const fileInputRef =
    useRef<HTMLInputElement | null>(null);

  const [imageUrl, setImageUrl] =
    useState("");

  const [previewUrl, setPreviewUrl] =
    useState("");

  const [uploading, setUploading] =
    useState(false);

  const [uploadError, setUploadError] =
    useState("");

  const [uploaded, setUploaded] =
    useState(false);

  async function handleImageUpload(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    setUploadError("");
    setUploaded(false);
    setUploading(true);

    try {
      const formData =
        new FormData();

      formData.append(
        "file",
        file,
      );

      const response =
        await fetch(
          "/api/gallery/upload",
          {
            method: "POST",
            body: formData,
          },
        );

      const contentType =
        response.headers.get(
          "content-type",
        ) || "";

      if (
        !contentType.includes(
          "application/json",
        )
      ) {
        throw new Error(
          "The upload server returned an invalid response. Restart the development server and try again.",
        );
      }

      const result =
        await response.json();

      if (
        !response.ok ||
        !result.success
      ) {
        throw new Error(
          result.message ||
            "Image upload failed.",
        );
      }

      if (!result.url) {
        throw new Error(
          "The upload succeeded but no image URL was returned.",
        );
      }

      setImageUrl(
        result.url,
      );

      setPreviewUrl(
        result.url,
      );

      setUploaded(true);
    } catch (error) {
      console.error(
        "GALLERY IMAGE UPLOAD ERROR:",
        error,
      );

      setUploadError(
        error instanceof Error
          ? error.message
          : "Image upload failed.",
      );

      setImageUrl("");
      setPreviewUrl("");
    } finally {
      setUploading(false);

      if (fileInputRef.current) {
        fileInputRef.current.value =
          "";
      }
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/admin/gallery"
          className="text-sm font-medium text-slate-500 transition hover:text-slate-900"
        >
          ← Back to Gallery
        </Link>

        <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="border-b border-slate-200 pb-5">
            <h1 className="text-2xl font-bold text-slate-900">
              Add Gallery Item
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Upload a real EDSEC photograph,
              graduation picture, classroom
              photograph, event picture or
              other visual content.
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
                placeholder="EDSEC Graduation Ceremony"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10"
              />
            </div>

            {/* IMAGE UPLOAD */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Gallery Image
              </label>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={
                  handleImageUpload
                }
                className="hidden"
              />

              {!previewUrl ? (
                <button
                  type="button"
                  onClick={() =>
                    fileInputRef.current?.click()
                  }
                  disabled={uploading}
                  className="flex w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center transition hover:border-blue-500 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-3xl">
                    {uploading
                      ? "⏳"
                      : "📷"}
                  </div>

                  <span className="mt-4 text-sm font-bold text-slate-800">
                    {uploading
                      ? "Uploading image..."
                      : "Choose Image"}
                  </span>

                  <span className="mt-1 text-xs text-slate-500">
                    JPG, PNG, WEBP or GIF
                    · Maximum 10 MB
                  </span>
                </button>
              ) : (
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={previewUrl}
                      alt="Gallery preview"
                      className="h-full w-full object-cover"
                    />

                    <div className="absolute left-4 top-4 rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white shadow">
                      ✓ Image uploaded
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-800">
                        Ready for gallery
                      </p>

                      <p className="mt-1 truncate text-xs text-slate-400">
                        {imageUrl}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setImageUrl("");
                        setPreviewUrl("");
                        setUploaded(false);
                        setUploadError("");
                      }}
                      className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                      Choose Another
                    </button>
                  </div>
                </div>
              )}

              {uploadError && (
                <div className="mt-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                  {uploadError}
                </div>
              )}

              {uploaded && (
                <p className="mt-2 text-xs font-medium text-emerald-600">
                  ✓ Image uploaded permanently to
                  EDSEC Gallery Storage.
                </p>
              )}

              {/* This is what Prisma receives */}
              <input
                type="hidden"
                name="imageUrl"
                value={imageUrl}
                required
                readOnly
              />
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
                defaultValue=""
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10"
              >
                <option value="">
                  Select category
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
                htmlFor="description"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Description
              </label>

              <textarea
                id="description"
                name="description"
                rows={5}
                placeholder="Describe this EDSEC moment..."
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10"
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
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10"
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
                  Published images appear in
                  the public EDSEC Gallery.
                </span>
              </span>
            </label>

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Link
                href="/admin/gallery"
                className="rounded-xl border border-slate-300 px-5 py-3 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={
                  uploading ||
                  !imageUrl
                }
                className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {uploading
                  ? "Uploading..."
                  : "Create Gallery Item"}
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}