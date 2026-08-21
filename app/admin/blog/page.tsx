import Link from "next/link";

import { prisma } from "@/app/lib/prisma";
import {
  deleteBlogPost,
  updateBlogPostStatus,
} from "./actions";

function formatDate(date: Date | null) {
  if (!date) {
    return "Not published";
  }

  return new Intl.DateTimeFormat("en-NG", {
    dateStyle: "medium",
  }).format(date);
}

function statusClass(status: string) {
  switch (status) {
    case "PUBLISHED":
      return "bg-green-100 text-green-700";
    case "ARCHIVED":
      return "bg-gray-100 text-gray-700";
    default:
      return "bg-yellow-100 text-yellow-700";
  }
}

export default async function AdminBlogPage() {
  const posts = await prisma.blogPost.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  const totalCount = posts.length;
  const publishedCount = posts.filter(
    (post) => post.status === "PUBLISHED",
  ).length;
  const draftCount = posts.filter(
    (post) => post.status === "DRAFT",
  ).length;
  const archivedCount = posts.filter(
    (post) => post.status === "ARCHIVED",
  ).length;

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <p className="text-sm font-medium text-orange-600">
              EDSEC CONTENT MANAGEMENT
            </p>

            <h1 className="mt-1 text-3xl font-bold tracking-tight text-gray-900">
              Blog
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Create and manage EDSEC news, articles, tutorials,
              announcements and educational content.
            </p>
          </div>

          <Link
            href="/admin/blog/new"
            className="inline-flex items-center justify-center rounded-xl bg-orange-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-700"
          >
            + Create Blog Post
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Total Posts</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              {totalCount}
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Published</p>
            <p className="mt-2 text-3xl font-bold text-green-600">
              {publishedCount}
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Drafts</p>
            <p className="mt-2 text-3xl font-bold text-yellow-600">
              {draftCount}
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Archived</p>
            <p className="mt-2 text-3xl font-bold text-gray-600">
              {archivedCount}
            </p>
          </div>
        </div>

        <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 px-6 py-5">
            <h2 className="font-semibold text-gray-900">
              All Blog Posts
            </h2>
          </div>

          {posts.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-orange-50 text-2xl">
                📝
              </div>

              <h3 className="mt-4 text-lg font-semibold text-gray-900">
                No blog posts yet
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                Create your first EDSEC blog post to get started.
              </p>

              <Link
                href="/admin/blog/new"
                className="mt-6 inline-flex rounded-xl bg-orange-600 px-5 py-3 text-sm font-semibold text-white hover:bg-orange-700"
              >
                Create First Post
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {posts.map((post) => (
                <article
                  key={post.id}
                  className="flex flex-col gap-5 p-6 transition hover:bg-gray-50 lg:flex-row lg:items-center lg:justify-between"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass(
                          post.status,
                        )}`}
                      >
                        {post.status}
                      </span>

                      {post.category && (
                        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                          {post.category}
                        </span>
                      )}
                    </div>

                    <h3 className="mt-3 text-lg font-bold text-gray-900">
                      {post.title}
                    </h3>

                    {post.excerpt && (
                      <p className="mt-2 line-clamp-2 max-w-3xl text-sm text-gray-500">
                        {post.excerpt}
                      </p>
                    )}

                    <div className="mt-3 flex flex-wrap gap-4 text-xs text-gray-400">
                      <span>
                        Created {formatDate(post.createdAt)}
                      </span>

                      <span>
                        Published {formatDate(post.publishedAt)}
                      </span>

                      {post.authorName && (
                        <span>
                          By {post.authorName}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <Link
                      href={`/admin/blog/${post.id}`}
                      className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Edit
                    </Link>

                    {post.status === "PUBLISHED" ? (
                      <form action={updateBlogPostStatus}>
                        <input
                          type="hidden"
                          name="id"
                          value={post.id}
                        />

                        <input
                          type="hidden"
                          name="status"
                          value="DRAFT"
                        />

                        <button
                          type="submit"
                          className="rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-2 text-sm font-medium text-yellow-700 hover:bg-yellow-100"
                        >
                          Unpublish
                        </button>
                      </form>
                    ) : (
                      <form action={updateBlogPostStatus}>
                        <input
                          type="hidden"
                          name="id"
                          value={post.id}
                        />

                        <input
                          type="hidden"
                          name="status"
                          value="PUBLISHED"
                        />

                        <button
                          type="submit"
                          className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
                        >
                          Publish
                        </button>
                      </form>
                    )}

                    <form action={deleteBlogPost}>
                      <input
                        type="hidden"
                        name="id"
                        value={post.id}
                      />

                      <button
                        type="submit"
                        className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-100"
                      >
                        Delete
                      </button>
                    </form>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}