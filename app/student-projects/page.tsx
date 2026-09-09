// app/student-projects/page.tsx

import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Code2,
  ExternalLink,
  GitBranch,
  Layers3,
  Sparkles,
} from "lucide-react";
import { prisma } from "@/app/lib/prisma";

function isExternalImage(url: string) {
  return /^https?:\/\//i.test(url);
}

function getTechnologies(value: string | null) {
  if (!value) return [];

  return value
    .split(/[,|\n]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Student Projects | EDSEC ICT INSTITUTE",
  description:
    "Explore practical projects built by EDSEC ICT INSTITUTE students.",
};

export default async function StudentProjectsPage() {
  const [projects, activeCourses] = await Promise.all([
    prisma.studentProject.findMany({
      where: {
        isPublished: true,
      },
      orderBy: [
        {
          isFeatured: "desc",
        },
        {
          displayOrder: "asc",
        },
        {
          createdAt: "desc",
        },
      ],
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        imageUrl: true,
        studentName: true,
        courseName: true,
        technologies: true,
        liveDemoUrl: true,
        githubUrl: true,
        isFeatured: true,
      },
    }),
    prisma.course.count({
      where: {
        status: "ACTIVE",
      },
    }),
  ]);

  return (
    <main className="min-h-screen bg-white">
      <section className="relative overflow-hidden bg-slate-950">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />
          <div className="absolute -bottom-40 left-1/4 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />

          <div className="absolute right-[12%] top-1/2 hidden h-64 w-64 -translate-y-1/2 rotate-12 rounded-[3rem] border border-blue-400/10 bg-blue-500/5 lg:block" />

          <div className="absolute right-[18%] top-1/2 hidden h-44 w-44 -translate-y-1/2 rotate-45 rounded-3xl border border-white/10 bg-white/[0.02] lg:block" />
        </div>

        <div className="relative mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-300">
              <Sparkles className="h-4 w-4" />
              Student Showcase
            </div>

            <h1 className="mt-7 text-5xl font-bold tracking-tighter text-white sm:text-6xl lg:text-7xl">
              Students learn by
              <span className="block text-blue-400">
                building real things.
              </span>
            </h1>

            <p className="mt-7 max-w-3xl text-lg leading-8 text-slate-400 sm:text-xl">
              Explore practical projects created by EDSEC learners as they
              turn technology concepts into websites, applications, designs,
              data solutions, and other digital products.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/courses"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 font-semibold text-white transition hover:bg-blue-500"
              >
                Explore courses
                <ArrowUpRight className="h-4 w-4" />
              </Link>

              <Link
                href="/apply"
                className="inline-flex items-center justify-center rounded-xl border border-slate-700 px-6 py-3.5 font-semibold text-white transition hover:bg-white/5"
              >
                Start learning
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto grid max-w-7xl gap-px px-5 sm:grid-cols-3 lg:px-8">
          <div className="bg-slate-50 py-8 sm:px-6">
            <p className="text-3xl font-bold text-slate-950">
              {projects.length}
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Published student projects
            </p>
          </div>

          <div className="bg-slate-50 py-8 sm:px-6">
            <p className="text-3xl font-bold text-slate-950">
              {activeCourses}
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Active learning programs
            </p>
          </div>

          <div className="bg-slate-50 py-8 sm:px-6">
            <p className="text-3xl font-bold text-slate-950">01</p>
            <p className="mt-1 text-sm text-slate-500">
              Principle: learn, practice, build
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
              The work
            </p>

            <h2 className="mt-3 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
              Built during the learning journey.
            </h2>

            <p className="mt-5 text-lg leading-8 text-slate-600">
              These projects represent the practical side of technology
              education at EDSEC.
            </p>
          </div>

          {projects.length === 0 ? (
            <div className="mt-12 rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-6 py-16 text-center">
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-blue-100 text-blue-600">
                <Layers3 className="h-6 w-6" />
              </div>

              <h3 className="mt-5 text-xl font-semibold text-slate-950">
                Projects are being prepared.
              </h3>

              <p className="mx-auto mt-2 max-w-lg leading-7 text-slate-600">
                Student projects will appear here as they are published by
                EDSEC.
              </p>

              <Link
                href="/courses"
                className="mt-7 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
              >
                Explore courses
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <div className="mt-12 grid gap-7 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => {
                const technologies = getTechnologies(project.technologies);
                const image = project.imageUrl;

                return (
                  <article
                    key={project.id}
                    className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-2xl hover:shadow-slate-200/60"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-slate-950">
                      {image ? (
                        <Image
                          src={image}
                          alt={project.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                          unoptimized={isExternalImage(image)}
                          className="object-cover transition duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="absolute inset-0 grid place-items-center bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
                          <Code2 className="h-14 w-14 text-blue-400/70" />
                        </div>
                      )}

                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                      {project.isFeatured && (
                        <div className="absolute left-4 top-4 rounded-full border border-white/10 bg-slate-950/80 px-3 py-1.5 text-xs font-semibold text-blue-300 backdrop-blur">
                          Featured project
                        </div>
                      )}
                    </div>

                    <div className="p-6">
                      <div className="flex flex-wrap gap-2">
                        {project.courseName && (
                          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                            {project.courseName}
                          </span>
                        )}
                      </div>

                      <h3 className="mt-4 text-2xl font-bold tracking-tight text-slate-950">
                        {project.title}
                      </h3>

                      <p className="mt-3 line-clamp-3 leading-7 text-slate-600">
                        {project.description}
                      </p>

                      {project.studentName && (
                        <p className="mt-5 text-sm text-slate-500">
                          Built by{" "}
                          <span className="font-semibold text-slate-800">
                            {project.studentName}
                          </span>
                        </p>
                      )}

                      {technologies.length > 0 && (
                        <div className="mt-5 flex flex-wrap gap-2">
                          {technologies.slice(0, 6).map((technology) => (
                            <span
                              key={technology}
                              className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-600"
                            >
                              {technology}
                            </span>
                          ))}
                        </div>
                      )}

                      {(project.liveDemoUrl || project.githubUrl) && (
                        <div className="mt-6 flex flex-wrap gap-3 border-t border-slate-100 pt-5">
                          {project.liveDemoUrl && (
                            <a
                              href={project.liveDemoUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-600"
                            >
                              <ExternalLink className="h-4 w-4" />
                              Live project
                            </a>
                          )}

                          {project.githubUrl && (
                            <a
                              href={project.githubUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                            >
                              <GitBranch className="h-4 w-4" />
                              Source
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <section className="bg-slate-950 py-20 sm:py-24">
        <div className="mx-auto max-w-4xl px-5 text-center lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-400">
            Build your own
          </p>

          <h2 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Your project could be next.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-400">
            Choose a program, develop practical skills, and turn what you
            learn into work you can show.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/courses"
              className="rounded-xl bg-blue-600 px-7 py-3.5 font-semibold text-white transition hover:bg-blue-500"
            >
              View courses
            </Link>

            <Link
              href="/apply"
              className="rounded-xl border border-slate-700 px-7 py-3.5 font-semibold text-white transition hover:bg-white/5"
            >
              Apply to EDSEC
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}