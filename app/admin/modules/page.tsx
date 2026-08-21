import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  BookOpen,
  CheckCircle2,
  Edit3,
  Layers3,
  Plus,
  Trash2,
  XCircle,
} from "lucide-react";

import { prisma } from "@/app/lib/prisma";
import { requireRole } from "@/app/lib/auth";

import {
  createModule,
  deleteModule,
  moveModuleDown,
  moveModuleUp,
  toggleModulePublished,
} from "./actions";

export default async function AdminModulesPage() {
  const admin = await requireRole("ADMIN");

  if (!admin) {
    redirect("/login");
  }

  const modules = await prisma.courseModule.findMany({
    orderBy: [
      {
        course: {
          title: "asc",
        },
      },
      {
        displayOrder: "asc",
      },
    ],
    include: {
      course: {
        select: {
          id: true,
          title: true,
          slug: true,
        },
      },
      _count: {
        select: {
          lessons: true,
        },
      },
    },
  });

  const courses = await prisma.course.findMany({
    orderBy: {
      title: "asc",
    },
    select: {
      id: true,
      title: true,
    },
  });

  const totalModules = modules.length;

  const publishedModules = modules.filter(
    (module) => module.isPublished
  ).length;

  const totalLessons = modules.reduce(
    (total, module) => total + module._count.lessons,
    0
  );

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-6 lg:px-8">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-blue-600"
          >
            <ArrowLeft size={17} />
            Back to Dashboard
          </Link>

          <div className="mt-5 flex flex-col justify-between gap-5 lg:flex-row lg:items-start">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-blue-700">
                <Layers3 size={14} />
                Curriculum Management
              </div>

              <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
                Modules
              </h1>

              <p className="mt-2 max-w-2xl text-slate-600">
                Create, organize, publish, and manage course modules
                across EDSEC ICT Institute.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/admin/courses"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
              >
                <BookOpen size={18} />
                Courses
              </Link>
            </div>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            icon={<Layers3 size={20} />}
            label="Total Modules"
            value={totalModules}
          />

          <StatCard
            icon={<CheckCircle2 size={20} />}
            label="Published Modules"
            value={publishedModules}
            secondary={`${totalModules - publishedModules} unpublished`}
          />

          <StatCard
            icon={<BookOpen size={20} />}
            label="Total Lessons"
            value={totalLessons}
          />
        </div>

        <div className="mt-8 rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 p-6">
            <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
              <div>
                <h2 className="text-xl font-bold text-slate-950">
                  Create Module
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Add a new module to any course.
                </p>
              </div>

              <form
                action={async (formData: FormData) => {
                  "use server";
                  await createModule(formData);
                }}
                className="grid w-full gap-3 lg:max-w-3xl lg:grid-cols-[220px_1fr_auto]"
              >
                <select
                  name="courseId"
                  required
                  defaultValue=""
                  className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="" disabled>
                    Select course
                  </option>

                  {courses.map((course) => (
                    <option
                      key={course.id}
                      value={course.id}
                    >
                      {course.title}
                    </option>
                  ))}
                </select>

                <input
                  name="title"
                  required
                  placeholder="Module title"
                  className="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  <Plus size={17} />
                  Add Module
                </button>

                <textarea
                  name="description"
                  placeholder="Optional module description"
                  rows={2}
                  className="lg:col-span-2 rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </form>
            </div>
          </div>

          {modules.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="divide-y divide-slate-100">
              {modules.map((module, index) => (
                <ModuleRow
                  key={module.id}
                  module={module}
                  index={index}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

function ModuleRow({
  module,
  index,
}: {
  module: {
    id: string;
    title: string;
    description: string | null;
    displayOrder: number;
    isPublished: boolean;
    course: {
      id: string;
      title: string;
      slug: string;
    };
    _count: {
      lessons: number;
    };
  };
  index: number;
}) {
  return (
    <div className="p-6">
      <div className="flex flex-col justify-between gap-5 xl:flex-row xl:items-center">
        <div className="flex min-w-0 gap-4">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-blue-50 text-sm font-bold text-blue-700">
            {index + 1}
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-bold text-slate-950">
                {module.title}
              </h3>

              {module.isPublished ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
                  <CheckCircle2 size={13} />
                  Published
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                  <XCircle size={13} />
                  Draft
                </span>
              )}
            </div>

            <p className="mt-1 text-sm font-semibold text-blue-600">
              {module.course.title}
            </p>

            {module.description && (
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                {module.description}
              </p>
            )}

            <div className="mt-3 flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-400">
              <span className="inline-flex items-center gap-1">
                <BookOpen size={13} />
                {module._count.lessons}{" "}
                {module._count.lessons === 1
                  ? "lesson"
                  : "lessons"}
              </span>

              <span>
                Order: {module.displayOrder}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href={`/admin/modules/${module.id}`}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <Edit3 size={15} />
            Manage
          </Link>

          <form
            action={async () => {
              "use server";
              await moveModuleUp(module.id);
            }}
          >
            <button
              type="submit"
              title="Move module up"
              className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white p-2 text-slate-600 transition hover:bg-slate-50"
            >
              <ArrowUp size={16} />
            </button>
          </form>

          <form
            action={async () => {
              "use server";
              await moveModuleDown(module.id);
            }}
          >
            <button
              type="submit"
              title="Move module down"
              className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white p-2 text-slate-600 transition hover:bg-slate-50"
            >
              <ArrowDown size={16} />
            </button>
          </form>

          <form
            action={async () => {
              "use server";
              await toggleModulePublished(module.id);
            }}
          >
            <button
              type="submit"
              className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold transition ${
                module.isPublished
                  ? "border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100"
                  : "border-green-200 bg-green-50 text-green-700 hover:bg-green-100"
              }`}
            >
              {module.isPublished ? (
                <>
                  <XCircle size={15} />
                  Unpublish
                </>
              ) : (
                <>
                  <CheckCircle2 size={15} />
                  Publish
                </>
              )}
            </button>
          </form>

          <form
            action={async () => {
              "use server";
              await deleteModule(module.id);
            }}
          >
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50"
            >
              <Trash2 size={15} />
              Delete
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="px-6 py-20 text-center">
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-blue-50 text-blue-600">
        <Layers3 size={30} />
      </div>

      <h3 className="mt-5 text-lg font-bold text-slate-950">
        No modules yet
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        Create your first course module using the form above.
      </p>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  secondary,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  secondary?: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-blue-600">
        {icon}
      </div>

      <p className="mt-5 text-3xl font-bold tracking-tight text-slate-950">
        {value}
      </p>

      <p className="mt-1 text-sm font-semibold text-slate-900">
        {label}
      </p>

      {secondary && (
        <p className="mt-1 text-xs text-slate-400">
          {secondary}
        </p>
      )}
    </div>
  );
}