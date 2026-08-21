import Link from "next/link";
import { notFound } from "next/navigation";

import { prisma } from "@/app/lib/prisma";
import {
  approveProjectSubmission,
  deleteProjectSubmission,
  deleteStudentProject,
  gradeStudentProject,
  toggleStudentProjectFeatured,
  toggleStudentProjectPublished,
  updateStudentProject,
} from "../actions";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function StudentProjectDetailsPage({
  params,
}: PageProps) {
  await import("@/app/lib/auth").then(({ requireRole }) =>
    requireRole("ADMIN"),
  );

  const { id } = await params;

  const project = await prisma.studentProject.findUnique({
    where: {
      id,
    },
    include: {
      records: {
        orderBy: {
          createdAt: "desc",
        },
        include: {
          student: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      },
    },
  });

  if (!project) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-6xl space-y-8">
        <div>
          <Link
            href="/admin/student-projects"
            className="text-sm font-medium text-slate-500 hover:text-slate-900"
          >
            ← Back to Student Projects
          </Link>

          <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="flex flex-wrap gap-2">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    project.isPublished
                      ? "bg-green-100 text-green-700"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {project.isPublished
                    ? "Published"
                    : "Unpublished"}
                </span>

                {project.isFeatured && (
                  <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                    Featured
                  </span>
                )}
              </div>

              <h1 className="mt-3 text-3xl font-bold text-slate-900">
                {project.title}
              </h1>

              <p className="mt-2 text-sm text-slate-600">
                {project.studentName || "Student project"}
                {project.courseName
                  ? ` • ${project.courseName}`
                  : ""}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <form action={toggleStudentProjectPublished}>
                <input
                  type="hidden"
                  name="id"
                  value={project.id}
                />

                <button
                  type="submit"
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  {project.isPublished
                    ? "Unpublish"
                    : "Publish"}
                </button>
              </form>

              <form action={toggleStudentProjectFeatured}>
                <input
                  type="hidden"
                  name="id"
                  value={project.id}
                />

                <button
                  type="submit"
                  className="rounded-xl border border-amber-200 bg-white px-4 py-2 text-sm font-semibold text-amber-700 hover:bg-amber-50"
                >
                  {project.isFeatured
                    ? "Remove Featured"
                    : "Make Featured"}
                </button>
              </form>

              <form action={deleteStudentProject}>
                <input
                  type="hidden"
                  name="id"
                  value={project.id}
                />

                <button
                  type="submit"
                  className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
                >
                  Delete
                </button>
              </form>
            </div>
          </div>
        </div>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">
            Project Information
          </h2>

          <form
            action={updateStudentProject}
            className="mt-6 space-y-6"
          >
            <input
              type="hidden"
              name="id"
              value={project.id}
            />

            <div className="grid gap-6 md:grid-cols-2">
              <Field
                label="Project Title"
                name="title"
                defaultValue={project.title}
                required
              />

              <Field
                label="Slug"
                name="slug"
                defaultValue={project.slug}
                required
              />

              <Field
                label="Student Name"
                name="studentName"
                defaultValue={project.studentName ?? ""}
              />

              <Field
                label="Course"
                name="courseName"
                defaultValue={project.courseName ?? ""}
              />

              <Field
                label="Image URL"
                name="imageUrl"
                defaultValue={project.imageUrl ?? ""}
              />

              <Field
                label="Technologies"
                name="technologies"
                defaultValue={project.technologies ?? ""}
              />

              <Field
                label="Live Demo URL"
                name="liveDemoUrl"
                defaultValue={project.liveDemoUrl ?? ""}
              />

              <Field
                label="GitHub URL"
                name="githubUrl"
                defaultValue={project.githubUrl ?? ""}
              />

              <Field
                label="Display Order"
                name="displayOrder"
                type="number"
                defaultValue={String(project.displayOrder)}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Description
              </label>

              <textarea
                name="description"
                required
                defaultValue={project.description}
                rows={6}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="flex items-center gap-3 rounded-xl border border-slate-200 p-4">
                <input
                  type="checkbox"
                  name="isFeatured"
                  value="true"
                  defaultChecked={project.isFeatured}
                  className="h-4 w-4"
                />

                <span className="text-sm font-semibold text-slate-700">
                  Featured project
                </span>
              </label>

              <label className="flex items-center gap-3 rounded-xl border border-slate-200 p-4">
                <input
                  type="checkbox"
                  name="isPublished"
                  value="true"
                  defaultChecked={project.isPublished}
                  className="h-4 w-4"
                />

                <span className="text-sm font-semibold text-slate-700">
                  Published project
                </span>
              </label>
            </div>

            <button
              type="submit"
              className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Save Changes
            </button>
          </form>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 p-6">
            <h2 className="text-xl font-bold text-slate-900">
              Student Submissions
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Review and grade submissions associated with this project.
            </p>
          </div>

          {project.records.length === 0 ? (
            <div className="p-10 text-center text-sm text-slate-500">
              No student submissions yet.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {project.records.map((record) => (
                <div key={record.id} className="p-6">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <h3 className="font-semibold text-slate-900">
                        {record.student.firstName}{" "}
                        {record.student.lastName}
                      </h3>

                      <p className="text-sm text-slate-500">
                        {record.student.email}
                      </p>

                      <div className="mt-3 flex flex-wrap gap-2">
                        <StatusBadge status={record.status} />

                        {record.score !== null && (
                          <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                            Score: {record.score}/100
                          </span>
                        )}
                      </div>

                      {record.description && (
                        <p className="mt-4 max-w-2xl text-sm text-slate-600">
                          {record.description}
                        </p>
                      )}

                      {record.feedback && (
                        <div className="mt-4 rounded-xl bg-slate-50 p-4">
                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Feedback
                          </p>

                          <p className="mt-1 text-sm text-slate-700">
                            {record.feedback}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {record.status !== "APPROVED" && (
                        <form action={approveProjectSubmission}>
                          <input
                            type="hidden"
                            name="recordId"
                            value={record.id}
                          />

                          <button
                            type="submit"
                            className="rounded-lg bg-green-600 px-3 py-2 text-xs font-semibold text-white hover:bg-green-700"
                          >
                            Approve
                          </button>
                        </form>
                      )}

                      <form action={deleteProjectSubmission}>
                        <input
                          type="hidden"
                          name="recordId"
                          value={record.id}
                        />

                        <button
                          type="submit"
                          className="rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </form>
                    </div>
                  </div>

                  <form
                    action={gradeStudentProject}
                    className="mt-6 grid gap-4 rounded-xl bg-slate-50 p-4 md:grid-cols-4"
                  >
                    <input
                      type="hidden"
                      name="recordId"
                      value={record.id}
                    />

                    <div>
                      <label className="mb-1 block text-xs font-semibold text-slate-600">
                        Score
                      </label>

                      <input
                        name="score"
                        type="number"
                        min="0"
                        max="100"
                        step="0.01"
                        defaultValue={
                          record.score !== null
                            ? record.score
                            : ""
                        }
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-semibold text-slate-600">
                        Status
                      </label>

                      <select
                        name="status"
                        defaultValue={record.status}
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
                      >
                        {projectStatuses.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label className="mb-1 block text-xs font-semibold text-slate-600">
                        Feedback
                      </label>

                      <div className="flex gap-2">
                        <input
                          name="feedback"
                          defaultValue={record.feedback ?? ""}
                          placeholder="Add feedback..."
                          className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
                        />

                        <button
                          type="submit"
                          className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function Field({
  label,
  name,
  defaultValue,
  type = "text",
  required = false,
}: {
  label: string;
  name: string;
  defaultValue: string;
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
        defaultValue={defaultValue}
        required={required}
        min={type === "number" ? 0 : undefined}
        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
      />
    </div>
  );
}

function StatusBadge({
  status,
}: {
  status: string;
}) {
  const classes =
    status === "APPROVED"
      ? "bg-green-100 text-green-700"
      : status === "REJECTED"
        ? "bg-red-100 text-red-700"
        : status === "GRADED"
          ? "bg-blue-100 text-blue-700"
          : status === "SUBMITTED"
            ? "bg-orange-100 text-orange-700"
            : "bg-slate-100 text-slate-600";

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${classes}`}
    >
      {status}
    </span>
  );
}

const projectStatuses = [
  "PENDING",
  "SUBMITTED",
  "GRADED",
  "APPROVED",
  "REJECTED",
] as const;