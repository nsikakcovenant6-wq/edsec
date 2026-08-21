import Link from "next/link";

import { createBlogPost } from "../actions";

export default function NewBlogPostPage() {
  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <Link
            href="/admin/blog"
            className="text-sm font-medium text-orange-600 hover:text-orange-700"
          >
            ← Back to Blog
          </Link>

          <h1 className="mt-4 text-3xl font-bold text-gray-900">
            Create Blog Post
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Create an article, tutorial, news update or
            educational resource for EDSEC.
          </p>
        </div>

        <form
          action={createBlogPost}
          className="space-y-6"
        >
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
                  placeholder="Enter blog post title"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Excerpt
                </label>

                <textarea
                  name="excerpt"
                  rows={3}
                  placeholder="Short summary of the article..."
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Content
                </label>

                <textarea
                  name="content"
                  rows={18}
                  required
                  placeholder="Write the full blog article here..."
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm leading-6 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
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
                  placeholder="https://example.com/image.jpg"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Category
                </label>

                <input
                  type="text"
                  name="category"
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
                  defaultValue="DRAFT"
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                >
                  <option value="DRAFT">Draft</option>
                  <option value="PUBLISHED">Published</option>
                  <option value="ARCHIVED">Archived</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Publication Date
                </label>

                <input
                  type="datetime-local"
                  name="publishedAt"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                />
              </div>
            </div>
          </section>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
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
              Create Blog Post
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}