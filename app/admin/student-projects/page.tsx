/* eslint-disable @next/next/no-img-element */
import Link from "next/link";

import { prisma } from "@/app/lib/prisma";
import {
  deleteStudentProject,
  toggleStudentProjectFeatured,
  toggleStudentProjectPublished,
} from "./actions";

export default async function AdminStudentProjectsPage() {
  await import("@/app/lib/auth").then(({ requireRole }) =>
    requireRole("ADMIN"),
  );

  const projects = await prisma.studentProject.findMany({
    orderBy: [
      {
        displayOrder: "asc",
      },
      {
        createdAt: "desc",
      },
    ],
    include: {
      records: {
        select: {
          id: true,
          status: true,
          score: true,
          studentId: true,
        },
      },
    },
  });

  const totalProjects = projects.length;

  const publishedProjects = projects.filter(
    (project) => project.isPublished,
  ).length;

  const featuredProjects = projects.filter(
    (project) => project.isFeatured,
  ).length;

  const submissions = projects.reduce(
    (total, project) => total + project.records.length,
    0,
  );

  const pendingSubmissions = projects.reduce(
    (total, project) =>
      total +
      project.records.filter(
        (record) =>
          record.status === "PENDING" ||
          record.status === "SUBMITTED",
      ).length,
    0,
  );

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-orange-600">
              EDSEC ICT Institute
            </p>

            <h1 className="mt-1 text-3xl font-bold text-slate-900">
              Student Projects
            </h1>

            <p className="mt-2 max-w-2xl text-sm text-slate-600">
              Manage student projects, showcase completed work, and review
              submitted projects.
            </p>
          </div>

          <Link
            href="/admin/student-projects/new"
            className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            + Add Project
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Total Projects"
            value={totalProjects}
          />

          <StatCard
            label="Published"
            value={publishedProjects}
          />

          <StatCard
            label="Featured"
            value={featuredProjects}
          />

          <StatCard
            label="Pending Submissions"
            value={pendingSubmissions}
          />
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-6 py-5">
            <h2 className="font-semibold text-slate-900">
              Project Portfolio
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {submissions} total student submission
              {submissions === 1 ? "" : "s"}.
            </p>
          </div>

          {projects.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-2xl">
                📁
              </div>

              <h3 className="mt-4 font-semibold text-slate-900">
                No student projects yet
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Create your first project to start building the EDSEC student
                portfolio.
              </p>

              <Link
                href="/admin/student-projects/new"
                className="mt-5 inline-flex rounded-xl bg-orange-600 px-5 py-3 text-sm font-semibold text-white hover:bg-orange-700"
              >
                Create Project
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {projects.map((project) => {
                const projectPending = project.records.filter(
                  (record) =>
                    record.status === "PENDING" ||
                    record.status === "SUBMITTED",
                ).length;

                return (
                  <div
                    key={project.id}
                    className="flex flex-col gap-5 p-6 lg:flex-row lg:items-center lg:justify-between"
                  >
                    <div className="flex min-w-0 gap-4">
                      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                        {project.imageUrl ? (
                          <img
                            src={project.imageUrl}
                            alt={project.title}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-2xl">
                            💻
                          </div>
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="truncate font-semibold text-slate-900">
                            {project.title}
                          </h3>

                          {project.isFeatured && (
                            <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-700">
                              Featured
                            </span>
                          )}

                          <span
                            className={`rounded-full px-2 py-1 text-xs font-medium ${
                              project.isPublished
                                ? "bg-green-100 text-green-700"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {project.isPublished
                              ? "Published"
                              : "Unpublished"}
                          </span>
                        </div>

                        <p className="mt-1 text-sm text-slate-500">
                          {project.studentName || "Student project"}
                          {project.courseName
                            ? ` • ${project.courseName}`
                            : ""}
                        </p>

                        <p className="mt-2 line-clamp-2 max-w-2xl text-sm text-slate-600">
                          {project.description}
                        </p>

                        <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-500">
                          <span>
                            {project.records.length} submission
                            {project.records.length === 1 ? "" : "s"}
                          </span>

                          {projectPending > 0 && (
                            <span className="font-semibold text-orange-600">
                              {projectPending} pending review
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 lg:justify-end">
                      <Link
                        href={`/admin/student-projects/${project.id}`}
                        className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                      >
                        Manage
                      </Link>

                      <form action={toggleStudentProjectPublished}>
                        <input
                          type="hidden"
                          name="id"
                          value={project.id}
                        />

                        <button
                          type="submit"
                          className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
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
                          className="rounded-lg border border-amber-200 px-3 py-2 text-sm font-medium text-amber-700 hover:bg-amber-50"
                        >
                          {project.isFeatured
                            ? "Unfeature"
                            : "Feature"}
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
                          className="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </form>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

function StatCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
    </div>
  );
}