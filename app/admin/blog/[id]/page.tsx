/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { notFound } from "next/navigation";

import { prisma } from "@/app/lib/prisma";
import {
  deleteBlogPost,
  updateBlogPost,
} from "../actions";

function formatDateTime(date: Date | null) {
  if (!date) {
    return "";
  }

  const pad = (value: number) =>
    String(value).padStart(2, "0");

  return `${date.getFullYear()}-${pad(
    date.getMonth() + 1,
  )}-${pad(date.getDate())}T${pad(
    date.getHours(),
  )}:${pad(date.getMinutes())}`;
}

export default async function EditBlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const post = await prisma.blogPost.findUnique({
    where: {
      id,
    },
  });

  if (!post) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <Link
              href="/admin/blog"
              className="text-sm font-medium text-orange-600 hover:text-orange-700"
            >
              ← Back to Blog
            </Link>

            <h1 className="mt-4 text-3xl font-bold text-gray-900">
              Edit Blog Post
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Update the article content, metadata or
              publication status.
            </p>
          </div>

          {post.status === "PUBLISHED" && (
            <a
              href={`/blog/${post.slug}`}
              target="_blank"
              rel="noreferrer"
              className="rounded-xl border border-gray-300 bg-white px-5 py-3 text-center text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              View Published Post ↗
            </a>
          )}
        </div>

        <form
          action={updateBlogPost}
          className="space-y-6"
        >
          <input
            type="hidden"
            name="id"
            value={post.id}
          />

          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">
              Basic Information
            </h2>

            <div className="mt-6 grid gap-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Title
                </label>

                <input
                  type="text"
                  name="title"
                  required
                  defaultValue={post.title}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Excerpt
                </label>

                <textarea
                  name="excerpt"
                  rows={3}
                  defaultValue={post.excerpt ?? ""}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Content
                </label>

                <textarea
                  name="content"
                  rows={20}
                  required
                  defaultValue={post.content}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm leading-6 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                />
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">
              Media & Categorization
            </h2>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Cover Image URL
                </label>

                <input
                  type="url"
                  name="coverImageUrl"
                  defaultValue={
                    post.coverImageUrl ?? ""
                  }
                  placeholder="https://example.com/image.jpg"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                />

                {post.coverImageUrl && (
                  <div className="mt-4 overflow-hidden rounded-xl border border-gray-200">
                    <img
                      src={post.coverImageUrl}
                      alt={post.title}
                      className="h-48 w-full object-cover"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Category
                </label>

                <input
                  type="text"
                  name="category"
                  defaultValue={post.category ?? ""}
                  placeholder="Technology"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Author
                </label>

                <input
                  type="text"
                  name="authorName"
                  defaultValue={post.authorName ?? ""}
                  placeholder="EDSEC ICT Institute"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                />
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">
              Publishing
            </h2>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Status
                </label>

                <select
                  name="status"
                  defaultValue={post.status}
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                >
                  <option value="DRAFT">Draft</option>
                  <option value="PUBLISHED">
                    Published
                  </option>
                  <option value="ARCHIVED">
                    Archived
                  </option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Publication Date
                </label>

                <input
                  type="datetime-local"
                  name="publishedAt"
                  defaultValue={formatDateTime(
                    post.publishedAt,
                  )}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                />
              </div>
            </div>
          </section>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
            <form
              action={deleteBlogPost}
              className="w-full sm:w-auto"
            >
              <input
                type="hidden"
                name="id"
                value={post.id}
              />

              <button
                type="submit"
                className="w-full rounded-xl border border-red-200 bg-red-50 px-6 py-3 text-sm font-semibold text-red-600 hover:bg-red-100 sm:w-auto"
              >
                Delete Post
              </button>
            </form>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/admin/blog"
                className="rounded-xl border border-gray-300 bg-white px-6 py-3 text-center text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </Link>

              <button
                type="submit"
                className="rounded-xl bg-orange-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-orange-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}