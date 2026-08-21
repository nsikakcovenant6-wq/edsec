import Link from "next/link";

import { createStudentProject } from "../actions";

export default async function NewStudentProjectPage() {
  await import("@/app/lib/auth").then(({ requireRole }) =>
    requireRole("ADMIN"),
  );

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6">
          <Link
            href="/admin/student-projects"
            className="text-sm font-medium text-slate-500 hover:text-slate-900"
          >
            ← Back to Student Projects
          </Link>

          <h1 className="mt-4 text-3xl font-bold text-slate-900">
            Add Student Project
          </h1>

          <p className="mt-2 text-sm text-slate-600">
            Add a project to the EDSEC student portfolio.
          </p>
        </div>

        <form
          action={createStudentProject}
          className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <div className="grid gap-6 md:grid-cols-2">
            <Field
              label="Project Title"
              name="title"
              placeholder="E-commerce Website"
              required
            />

            <Field
              label="Slug"
              name="slug"
              placeholder="e-commerce-website"
              required
            />

            <Field
              label="Student Name"
              name="studentName"
              placeholder="John Doe"
            />

            <Field
              label="Course"
              name="courseName"
              placeholder="Full-Stack Web Development"
            />

            <Field
              label="Image URL"
              name="imageUrl"
              placeholder="https://..."
            />

            <Field
              label="Technologies"
              name="technologies"
              placeholder="Next.js, TypeScript, PostgreSQL"
            />

            <Field
              label="Live Demo URL"
              name="liveDemoUrl"
              placeholder="https://..."
            />

            <Field
              label="GitHub URL"
              name="githubUrl"
              placeholder="https://github.com/..."
            />

            <Field
              label="Display Order"
              name="displayOrder"
              type="number"
              placeholder="0"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Description
            </label>

            <textarea
              name="description"
              required
              rows={6}
              placeholder="Describe the project..."
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 p-4">
              <input
                type="checkbox"
                name="isFeatured"
                value="true"
                className="h-4 w-4"
              />

              <span>
                <span className="block text-sm font-semibold text-slate-800">
                  Featured project
                </span>

                <span className="text-xs text-slate-500">
                  Highlight this project publicly.
                </span>
              </span>
            </label>

            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 p-4">
              <input
                type="checkbox"
                name="isPublished"
                value="true"
                defaultChecked
                className="h-4 w-4"
              />

              <span>
                <span className="block text-sm font-semibold text-slate-800">
                  Publish project
                </span>

                <span className="text-xs text-slate-500">
                  Make the project visible on the public website.
                </span>
              </span>
            </label>
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">
            <Link
              href="/admin/student-projects"
              className="rounded-xl border border-slate-200 px-5 py-3 text-center text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </Link>

            <button
              type="submit"
              className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Create Project
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

function Field({
  label,
  name,
  placeholder,
  type = "text",
  required = false,
}: {
  label: string;
  name: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block text-sm font-semibold text-slate-700"
      >
        {label}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        min={type === "number" ? 0 : undefined}
        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
      />
    </div>
  );
}