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
      {/* Hero */}
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

      {/* Services */}
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

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => {
            const Icon = service.icon;

            return (
              <article
                key={service.title}
                className="group rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
                  <Icon className="h-6 w-6" />
                </div>

                <h3 className="mt-6 text-xl font-bold">
                  {service.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {service.description}
                </p>

                <ul className="mt-6 space-y-3">
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
              </article>
            );
          })}
        </div>
      </section>

      {/* Training CTA */}
      <section className="mx-auto max-w-7xl px-6 pb-20 sm:px-8 lg:px-12">
        <div className="overflow-hidden rounded-3xl bg-slate-900 px-8 py-12 sm:px-12 lg:flex lg:items-center lg:justify-between">
          <div className="max-w-2xl">
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
            className="mt-8 inline-flex shrink-0 items-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 font-semibold text-white transition hover:bg-blue-500 lg:mt-0"
          >
            Request Training
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Final CTA */}
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