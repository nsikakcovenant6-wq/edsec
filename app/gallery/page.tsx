// app/gallery/page.tsx

/* eslint-disable @next/next/no-img-element */

import Link from "next/link";

import { prisma } from "@/app/lib/prisma";

const unsplashGalleryItems = [
  {
    title: "Practical Computer Training",
    category: "Training",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1400&q=85",
    description:
      "A practical learning environment where students develop essential digital and computer skills.",
  },
  {
    title: "Technology & Development",
    category: "Technology",
    image:
      "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1400&q=85",
    description:
      "Collaborative technology environments designed for learning, innovation and problem solving.",
  },
  {
    title: "Students Learning Technology",
    category: "Students",
    image:
      "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1400&q=85",
    description:
      "Students working together, sharing ideas and building confidence with technology.",
  },
  {
    title: "Creative Design Training",
    category: "Design",
    image:
      "https://images.unsplash.com/photo-1559028012-481c04fa702d?auto=format&fit=crop&w=1400&q=85",
    description:
      "Creative digital environments where students explore design, graphics and visual communication.",
  },
  {
    title: "Cybersecurity & Networking",
    category: "Cybersecurity",
    image:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1400&q=85",
    description:
      "Practical technology training inspired by modern networking, infrastructure and cybersecurity environments.",
  },
  {
    title: "Technology Workshop",
    category: "Workshop",
    image:
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1400&q=85",
    description:
      "Interactive workshops where learners collaborate, experiment and solve real-world problems.",
  },
  {
    title: "Student Project Development",
    category: "Projects",
    image:
      "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1400&q=85",
    description:
      "Project-focused learning that encourages students to turn ideas into practical digital solutions.",
  },
  {
    title: "Modern Learning Environment",
    category: "Learning",
    image:
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1400&q=85",
    description:
      "A modern, collaborative environment designed to inspire learning, creativity and innovation.",
  },
];

function GalleryImage({
  image,
  title,
}: {
  image: string;
  title: string;
}) {
  return (
    <div className="group relative aspect-4/3 overflow-hidden bg-slate-200">
      <img
        src={image}
        alt={title}
        loading="lazy"
        className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-110"
      />

      <div className="absolute inset-0 bg-linear-to-t from-slate-950/70 via-transparent to-transparent opacity-80" />

      <div className="absolute left-5 top-5 rounded-full border border-white/30 bg-slate-950/60 px-3 py-1 text-[10px] font-bold tracking-[0.2em] text-white backdrop-blur-md">
        EDSEC
      </div>

      <div className="absolute bottom-5 right-5 translate-y-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white opacity-0 backdrop-blur-md transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
        Explore
      </div>
    </div>
  );
}

function DatabaseGalleryImage({
  image,
  title,
}: {
  image: string;
  title: string;
}) {
  return (
    <div className="group relative aspect-4/3 overflow-hidden bg-slate-200">
      <img
        src={image}
        alt={title}
        loading="lazy"
        className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-105"
      />

      <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-slate-950/10 to-transparent" />

      <div className="absolute left-4 top-4 rounded-full border border-white/30 bg-slate-950/60 px-3 py-1 text-[10px] font-bold tracking-[0.2em] text-white backdrop-blur-md">
        EDSEC
      </div>

      <div className="absolute bottom-4 left-4 right-4">
        <span className="inline-flex rounded-full bg-blue-600/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur">
          Gallery
        </span>

        <h3 className="mt-2 text-lg font-bold text-white">
          {title}
        </h3>
      </div>
    </div>
  );
}

export default async function GalleryPage() {
  const uploadedGalleryItems =
    await prisma.galleryItem.findMany({
      where: {
        isPublished: true,
      },
      orderBy: [
        {
          displayOrder: "asc",
        },
        {
          createdAt: "desc",
        },
      ],
    });

  return (
    <main className="min-h-screen bg-white text-slate-900">
      {/* HERO */}
      <section className="relative overflow-hidden bg-slate-950 px-6 py-24 text-white">
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />

        <div className="absolute -bottom-40 -left-32 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">
            EDSEC Gallery
          </p>

          <h1 className="max-w-4xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Learning, building and creating the future.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            Explore the technology, creativity,
            collaboration and practical learning
            experience that inspires the EDSEC
            community.
          </p>
        </div>
      </section>

      {/* UNSPLASH / FEATURED GALLERY */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
                Inside EDSEC
              </p>

              <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                Our learning experience
              </h2>
            </div>

            <p className="max-w-md text-sm leading-6 text-slate-500">
              Practical learning, technology,
              creativity and collaboration —
              inspired by modern technology
              environments.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {unsplashGalleryItems.map(
              (item) => (
                <article
                  key={item.title}
                  className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-2xl"
                >
                  <GalleryImage
                    image={item.image}
                    title={item.title}
                  />

                  <div className="p-5">
                    <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                      {item.category}
                    </p>

                    <h3 className="mt-2 text-lg font-semibold text-slate-900">
                      {item.title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      {item.description}
                    </p>
                  </div>
                </article>
              ),
            )}
          </div>
        </div>
      </section>

      {/* REAL EDSEC DATABASE GALLERY */}
      <section className="border-y border-slate-100 bg-slate-50 px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-blue-700">
                <span className="h-2 w-2 rounded-full bg-blue-600" />
                Real EDSEC Moments
              </div>

              <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                EDSEC Gallery
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500">
                Photos from EDSEC training sessions,
                students, workshops, graduations,
                projects, facilities and special
                events.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600 shadow-sm">
              {uploadedGalleryItems.length}{" "}
              {uploadedGalleryItems.length === 1
                ? "photo"
                : "photos"}
            </div>
          </div>

          {uploadedGalleryItems.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-3xl">
                📸
              </div>

              <h3 className="mt-5 text-xl font-bold text-slate-900">
                EDSEC photographs coming soon
              </h3>

              <p className="mx-auto mt-2 max-w-lg text-sm leading-7 text-slate-500">
                Our latest photographs from
                classrooms, students, graduations,
                workshops and EDSEC events will
                appear here.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {uploadedGalleryItems.map(
                (item) => (
                  <article
                    key={item.id}
                    className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                  >
                    <DatabaseGalleryImage
                      image={item.imageUrl}
                      title={item.title}
                    />

                    <div className="p-5">
                      {item.category && (
                        <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                          {item.category}
                        </p>
                      )}

                      <h3 className="mt-2 text-lg font-bold text-slate-900">
                        {item.title}
                      </h3>

                      {item.description && (
                        <p className="mt-2 text-sm leading-6 text-slate-500">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </article>
                ),
              )}
            </div>
          )}
        </div>
      </section>

      {/* EXPERIENCE */}
      <section className="border-y border-slate-100 bg-white px-6 py-20">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
              More than a classroom
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Learn. Build. Create.
            </h2>

            <p className="mt-5 max-w-xl leading-8 text-slate-600">
              EDSEC is designed around practical
              learning. Students don&apos;t simply
              watch lessons — they develop projects,
              solve problems, experiment with
              technology and build confidence.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                ["20+", "Systems"],
                ["8+", "Courses"],
                ["100%", "Practical"],
                ["∞", "Possibilities"],
              ].map(
                ([number, label]) => (
                  <div
                    key={label}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                  >
                    <div className="text-2xl font-bold text-blue-600">
                      {number}
                    </div>

                    <div className="mt-1 text-xs text-slate-500">
                      {label}
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-md">
            <div className="rounded-3xl bg-slate-950 p-6 shadow-2xl">
              <div className="mb-5 flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-red-400" />
                <div className="h-3 w-3 rounded-full bg-yellow-400" />
                <div className="h-3 w-3 rounded-full bg-green-400" />
              </div>

              <div className="rounded-2xl bg-slate-900 p-6 font-mono text-sm">
                <p className="text-blue-400">
                  const
                </p>

                <p className="mt-2 text-slate-300">
                  <span className="text-purple-400">
                    student
                  </span>{" "}
                  = {"{"}
                </p>

                <p className="ml-5 mt-2 text-slate-400">
                  learn:{" "}
                  <span className="text-green-400">
                    &quot;technology&quot;
                  </span>
                  ,
                </p>

                <p className="ml-5 text-slate-400">
                  build:{" "}
                  <span className="text-green-400">
                    &quot;real projects&quot;
                  </span>
                  ,
                </p>

                <p className="ml-5 text-slate-400">
                  future:{" "}
                  <span className="text-green-400">
                    &quot;unlimited&quot;
                  </span>
                </p>

                <p className="text-slate-300">
                  {"}"}
                </p>
              </div>

              <div className="mt-5 text-center text-xs font-semibold tracking-[0.25em] text-slate-500">
                INNOVATE · EDUCATE · ELEVATE
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl bg-blue-600 px-6 py-14 text-center text-white sm:px-12">
          <h2 className="text-3xl font-bold sm:text-4xl">
            Start your technology journey with
            EDSEC.
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-blue-100">
            Learn practical digital skills, build
            real projects and prepare yourself for
            the future of technology.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/courses"
              className="rounded-xl bg-white px-6 py-3 font-semibold text-blue-600 transition hover:bg-blue-50"
            >
              Explore Courses
            </Link>

            <Link
              href="/apply"
              className="rounded-xl border border-white/30 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
            >
              Apply Now
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}