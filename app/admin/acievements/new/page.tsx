import Link from "next/link";

import { createAchievement } from "../actions";
import { requireRole } from "@/app/lib/auth";

export default async function NewAchievementPage() {
  await requireRole("ADMIN");

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <Link
            href="/admin/achievements"
            className="text-sm font-medium text-orange-600 hover:text-orange-700"
          >
            ← Back to achievements
          </Link>

          <h1 className="mt-4 text-3xl font-bold text-slate-900">
            Create Achievement
          </h1>

          <p className="mt-2 text-sm text-slate-600">
            Create a new achievement students can earn.
          </p>
        </div>

        <form
          action={createAchievement}
          className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
        >
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Achievement name
            </label>

            <input
              id="name"
              name="name"
              required
              maxLength={100}
              placeholder="e.g. Web Development Champion"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
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
              rows={4}
              placeholder="Describe what the student achieved..."
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
            />
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label
                htmlFor="icon"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Icon
              </label>

              <input
                id="icon"
                name="icon"
                placeholder="🏆"
                maxLength={20}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              />

              <p className="mt-2 text-xs text-slate-500">
                You can use an emoji such as 🏆, ⭐, 💻 or 🎓.
              </p>
            </div>

            <div>
              <label
                htmlFor="points"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Points
              </label>

              <input
                id="points"
                name="points"
                type="number"
                min="0"
                defaultValue="10"
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              />
            </div>
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">
            <Link
              href="/admin/achievements"
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </Link>

            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-xl bg-orange-600 px-5 py-3 text-sm font-semibold text-white hover:bg-orange-700"
            >
              Create Achievement
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}