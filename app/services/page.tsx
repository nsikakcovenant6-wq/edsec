/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import {
  Code2,
  MonitorCog,
  Palette,
  Megaphone,
  GraduationCap,
  Network,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

const services = [
  {
    title: "Website Design & Development",
    description:
      "Modern, responsive websites designed to help businesses, schools, churches, hotels and organizations build a strong online presence.",
    icon: Code2,
    image:
      "https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=1400&q=80",
    features: [
      "Business websites",
      "School websites",
      "Church websites",
      "E-commerce websites",
      "Portfolio websites",
    ],
  },
  {
    title: "Software Development",
    description:
      "Custom software solutions designed around the real needs of your organization and business.",
    icon: MonitorCog,
    image:
      "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1400&q=80",
    features: [
      "School management systems",
      "Student portals",
      "POS systems",
      "Inventory systems",
      "Custom business software",
    ],
  },
  {
    title: "IT Support & Networking",
    description:
      "Reliable technical support for computers, networks and everyday business technology.",
    icon: Network,
    image:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1400&q=80",
    features: [
      "Computer troubleshooting",
      "Windows installation",
      "Network setup",
      "Wi-Fi configuration",
      "Printer setup",
    ],
  },
  {
    title: "Creative & Brand Design",
    description:
      "Professional visual designs that help organizations communicate clearly and build recognizable brands.",
    icon: Palette,
    image:
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=1400&q=80",
    features: [
      "Logo design",
      "Brand identity",
      "Flyers",
      "Brochures",
      "Social media graphics",
    ],
  },
  {
    title: "Digital Marketing",
    description:
      "Digital strategies that help businesses reach their audience and grow their online presence.",
    icon: Megaphone,
    image:
      "https://images.unsplash.com/photo-1557838923-2985c318be48?auto=format&fit=crop&w=1400&q=80",
    features: [
      "Social media management",
      "Content creation",
      "Basic SEO",
      "Digital advertising",
      "Online presence strategy",
    ],
  },
  {
    title: "Corporate Training",
    description:
      "Practical technology training designed for companies, schools, churches, hospitals and other organizations.",
    icon: GraduationCap,
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1400&q=80",
    features: [
      "Microsoft Office",
      "Advanced Excel",
      "Cybersecurity awareness",
      "AI productivity",
      "Digital skills",
    ],
  },
];

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-white text-slate-950">
      {/* HERO */}
      <section className="relative overflow-hidden bg-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.22),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(14,165,233,0.12),transparent_35%)]" />

        <div className="relative mx-auto max-w-7xl px-6 py-24 sm:px-8 lg:px-12 lg:py-32">
          <div className="max-w-3xl">
            <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-blue-300">
              EDSEC Technology Solutions
            </span>

            <h1 className="mt-6 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Technology solutions built for{" "}
              <span className="text-blue-400">real-world needs.</span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              From websites and software to IT support, creative services and
              corporate training, EDSEC helps organizations use technology
              effectively.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 font-semibold text-white transition hover:bg-blue-500"
              >
                Discuss a Project
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/corporate-training"
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-3.5 font-semibold text-white transition hover:bg-white/10"
              >
                Corporate Training
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-12">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
            What we do
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Practical technology services
          </h2>

          <p className="mt-4 text-slate-600">
            Whether you need a digital platform, technical support or
            professional training, our services are designed around practical
            outcomes.
          </p>
        </div>

        <div className="mt-12 grid gap-7 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => {
            const Icon = service.icon;

            return (
              <article
                key={service.title}
                className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-2 hover:border-blue-200 hover:shadow-2xl"
              >
                {/* SERVICE IMAGE */}
                <div className="relative aspect-16/10 overflow-hidden bg-slate-100">
                  <img
                    src={service.image}
                    alt={service.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-110"
                  />

                  <div className="absolute inset-0 bg-linear-to-t from-slate-950/70 via-slate-950/10 to-transparent" />

                  {/* ICON */}
                  <div className="absolute bottom-4 left-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 bg-white/90 text-blue-600 shadow-xl backdrop-blur-sm transition duration-300 group-hover:bg-blue-600 group-hover:text-white">
                    <Icon className="h-6 w-6" />
                  </div>

                  {/* EDSEC LABEL */}
                  <div className="absolute right-4 top-4 rounded-full border border-white/20 bg-slate-950/60 px-3 py-1 text-[10px] font-bold tracking-[0.2em] text-white backdrop-blur-md">
                    EDSEC
                  </div>
                </div>

                {/* CONTENT */}
                <div className="p-7">
                  <h3 className="text-xl font-bold text-slate-950 transition group-hover:text-blue-600">
                    {service.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {service.description}
                  </p>

                  <div className="mt-6 border-t border-slate-100 pt-5">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      What we provide
                    </p>

                    <ul className="mt-4 space-y-3">
                      {service.features.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-start gap-2 text-sm text-slate-700"
                        >
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />

                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Link
                    href="/contact"
                    className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-blue-600 transition hover:gap-3"
                  >
                    Discuss this service
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* TRAINING CTA */}
      <section className="mx-auto max-w-7xl px-6 pb-20 sm:px-8 lg:px-12">
        <div className="relative overflow-hidden rounded-3xl bg-slate-900 px-8 py-12 sm:px-12 lg:flex lg:items-center lg:justify-between">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-600/20 blur-3xl" />

          <div className="relative max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">
              Need technology training?
            </p>

            <h2 className="mt-3 text-3xl font-bold text-white">
              Train your team with practical digital skills.
            </h2>

            <p className="mt-4 leading-7 text-slate-300">
              EDSEC provides practical technology training for businesses,
              schools, churches, hospitals, hotels, retail organizations and
              other institutions.
            </p>
          </div>

          <Link
            href="/corporate-training"
            className="relative mt-8 inline-flex shrink-0 items-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 font-semibold text-white transition hover:bg-blue-500 lg:mt-0"
          >
            Request Training
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="border-t border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-4xl px-6 py-20 text-center sm:px-8">
          <h2 className="text-3xl font-bold sm:text-4xl">
            Have a technology project in mind?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-600">
            Tell us what you need and let&apos;s find a practical solution
            together.
          </p>

          <Link
            href="/contact"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-7 py-3.5 font-semibold text-white transition hover:bg-slate-800"
          >
            Contact EDSEC
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}