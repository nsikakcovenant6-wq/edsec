import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  BriefcaseBusiness,
  Check,
  ChevronDown,
  Cloud,
  Code2,
  Headphones,
  Laptop,
  Network,
  Palette,
  Rocket,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import LaunchPromoCountdown from "@/components/LaunchPromoCountdown";

export const metadata = {
  title: "Launch Promo",
  description:
    "EDSEC ICT INSTITUTE Launch Promo — learn a professional digital skill from ₦20,000.",
};

type PromoCourse = {
  title: string;
  slug: string;
  normalPrice: number;
  promoPrice: number;
  duration: string;
  description: string;
  image: string;
  icon: typeof Laptop;
  accent: string;
  learns: string[];
};

const promoCourses: PromoCourse[] = [
  {
    title: "Microsoft Office Professional",
    slug: "microsoft-office-professional",
    normalPrice: 70000,
    promoPrice: 20000,
    duration: "8 Weeks",
    description:
      "Master the essential Microsoft productivity tools used in schools, offices, businesses, and professional environments.",
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=85",
    icon: Laptop,
    accent: "blue",
    learns: [
      "Microsoft Word, Excel and PowerPoint",
      "Professional documents, spreadsheets and presentations",
      "Workplace productivity and digital organization",
    ],
  },
  {
    title: "Graphic Design",
    slug: "graphic-design",
    normalPrice: 90000,
    promoPrice: 20000,
    duration: "12 Weeks",
    description:
      "Turn ideas into professional visual content for brands, businesses, social media, events, and digital campaigns.",
    image:
      "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=1200&q=85",
    icon: Palette,
    accent: "violet",
    learns: [
      "Design principles, layouts, typography and colour",
      "Branding, social media and promotional graphics",
      "Practical design projects and portfolio pieces",
    ],
  },
  {
    title: "UI/UX Design",
    slug: "ui-ux-design",
    normalPrice: 100000,
    promoPrice: 25000,
    duration: "12 Weeks",
    description:
      "Learn to research users, structure interfaces, prototype ideas, and create useful digital experiences.",
    image:
      "https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=1200&q=85",
    icon: Palette,
    accent: "pink",
    learns: [
      "User research, personas and user journeys",
      "Wireframes, interface design and prototypes",
      "Practical UI/UX case studies for your portfolio",
    ],
  },
  {
    title: "Full-Stack Web Development",
    slug: "full-stack-web-development",
    normalPrice: 150000,
    promoPrice: 50000,
    duration: "24 Weeks",
    description:
      "Build modern websites and full-stack applications while learning the technologies behind real web products.",
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=85",
    icon: Code2,
    accent: "cyan",
    learns: [
      "HTML, CSS, JavaScript and modern frontend development",
      "Backend development, APIs, databases and authentication",
      "Real-world projects, deployment and portfolio development",
    ],
  },
  {
    title: "Cybersecurity",
    slug: "cybersecurity",
    normalPrice: 180000,
    promoPrice: 50000,
    duration: "16 Weeks",
    description:
      "Build a strong cybersecurity foundation and understand how to protect systems, networks, data, and users.",
    image:
      "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=1200&q=85",
    icon: ShieldCheck,
    accent: "emerald",
    learns: [
      "Cybersecurity fundamentals, threats and vulnerabilities",
      "Networking, system security and defensive practices",
      "Security tools, safe practices and practical exercises",
    ],
  },
  {
    title: "Data Analysis",
    slug: "data-analysis",
    normalPrice: 150000,
    promoPrice: 40000,
    duration: "12 Weeks",
    description:
      "Learn how to turn raw information into useful insights that support better business and professional decisions.",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=85",
    icon: BarChart3,
    accent: "amber",
    learns: [
      "Data cleaning, organization and analysis",
      "Spreadsheets, charts and data visualization",
      "Practical analysis projects and reporting",
    ],
  },
  {
    title: "Digital Marketing",
    slug: "digital-marketing",
    normalPrice: 80000,
    promoPrice: 20000,
    duration: "10 Weeks",
    description:
      "Develop practical skills for promoting businesses, products, services, and personal brands online.",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=85",
    icon: BriefcaseBusiness,
    accent: "orange",
    learns: [
      "Social media strategy and content planning",
      "Digital advertising and campaign fundamentals",
      "Online brand growth, analytics and practical campaigns",
    ],
  },
  {
    title: "IT Support & Networking",
    slug: "it-support-networking",
    normalPrice: 100000,
    promoPrice: 30000,
    duration: "12 Weeks",
    description:
      "Build practical skills for diagnosing computer problems, supporting users, maintaining systems, and managing networks.",
    image:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=85",
    icon: Network,
    accent: "sky",
    learns: [
      "Computer hardware, operating systems and troubleshooting",
      "Networking fundamentals, devices and connectivity",
      "IT support workflows, maintenance and user support",
    ],
  },
  {
    title: "Cloud Computing",
    slug: "cloud-computing",
    normalPrice: 150000,
    promoPrice: 50000,
    duration: "4 Months",
    description:
      "Understand modern cloud infrastructure and how applications, servers, storage, databases, and services operate online.",
    image:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=85",
    icon: Cloud,
    accent: "indigo",
    learns: [
      "Cloud concepts, services and infrastructure",
      "Compute, storage, networking and databases",
      "Practical cloud workflows and deployment concepts",
    ],
  },
  {
    title: "Virtual Assistant",
    slug: "virtual-assistant",
    normalPrice: 80000,
    promoPrice: 20000,
    duration: "3 Months",
    description:
      "Build professional remote-work skills for supporting entrepreneurs, executives, businesses, and online teams.",
    image:
      "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=85",
    icon: Headphones,
    accent: "teal",
    learns: [
      "Professional communication, scheduling and administration",
      "Productivity tools and remote-work workflows",
      "Client support, organization and virtual collaboration",
    ],
  },
];

const faqs = [
  {
    question: "Who can join the Launch Promo?",
    answer:
      "The promo is designed for beginners, students, professionals, entrepreneurs, career changers, and anyone who wants to develop a practical digital skill.",
  },
  {
    question: "Do I need previous technology experience?",
    answer:
      "Most EDSEC programs are beginner-friendly. Individual course requirements vary, and you can contact EDSEC if you are unsure which program is right for you.",
  },
  {
    question: "Can I apply online?",
    answer:
      "Yes. Select your preferred course and use the Apply Now button. You will be taken to EDSEC's existing application form, where you can submit your details.",
  },
  {
    question: "Is the training practical?",
    answer:
      "Yes. EDSEC focuses on practical exercises, projects, technology tools, assessments, and skills that learners can apply beyond the classroom.",
  },
  {
    question: "Can I learn online or on-site?",
    answer:
      "EDSEC's courses support on-site, online, and hybrid learning formats where available. Your preferred format can be selected during the application process.",
  },
  {
    question: "Will I receive a certificate?",
    answer:
      "Successful learners receive an EDSEC Certificate of Completion after meeting the requirements of their training program.",
  },
];

const formatCurrency = (value: number) =>
  `₦${value.toLocaleString("en-NG")}`;

function ComicIllustration() {
  return (
    <div className="relative mx-auto w-full max-w-xl overflow-hidden rounded-[2rem] border border-blue-100 bg-white shadow-2xl shadow-blue-950/10">
      <svg
        viewBox="0 0 760 520"
        role="img"
        aria-label="EDSEC launch promo comic: Why wait? Start today"
        className="h-auto w-full"
      >
        <defs>
          <linearGradient id="promoBg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#eff6ff" />
            <stop offset="100%" stopColor="#dbeafe" />
          </linearGradient>
          <linearGradient id="shirtBlue" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#2563eb" />
            <stop offset="100%" stopColor="#1d4ed8" />
          </linearGradient>
        </defs>

        <rect width="760" height="520" rx="32" fill="url(#promoBg)" />
        <circle cx="680" cy="70" r="110" fill="#ffffff" opacity="0.7" />
        <circle cx="90" cy="450" r="130" fill="#ffffff" opacity="0.6" />

        <path d="M520 92h170a18 18 0 0 1 18 18v60a18 18 0 0 1-18 18h-92l-28 25v-25h-50a18 18 0 0 1-18-18v-60a18 18 0 0 1 18-18Z" fill="#fff" stroke="#2563eb" strokeWidth="4" />
        <text x="605" y="125" textAnchor="middle" fontSize="18" fontWeight="800" fill="#0f172a">You said</text>
        <text x="605" y="151" textAnchor="middle" fontSize="18" fontWeight="800" fill="#2563eb">next month! 😂</text>

        <path d="M75 76h235a18 18 0 0 1 18 18v70a18 18 0 0 1-18 18h-95l-32 30v-30H75a18 18 0 0 1-18-18V94a18 18 0 0 1 18-18Z" fill="#fff" stroke="#0f172a" strokeWidth="4" />
        <text x="192" y="113" textAnchor="middle" fontSize="18" fontWeight="800" fill="#0f172a">“I’ll learn tech</text>
        <text x="192" y="140" textAnchor="middle" fontSize="18" fontWeight="800" fill="#2563eb">next month.”</text>

        <g transform="translate(110 205)">
          <circle cx="75" cy="45" r="42" fill="#c9825f" />
          <path d="M36 40c2-38 77-57 82 7-20-11-53-15-82-7Z" fill="#111827" />
          <path d="M27 105c10-25 86-25 96 0l16 135H11Z" fill="url(#shirtBlue)" />
          <path d="M43 105c-16 27-25 54-34 89" stroke="#c9825f" strokeWidth="20" strokeLinecap="round" />
          <path d="M107 105c17 25 29 48 39 80" stroke="#c9825f" strokeWidth="20" strokeLinecap="round" />
          <path d="M49 235v76M101 235v76" stroke="#111827" strokeWidth="27" strokeLinecap="round" />
          <path d="M38 311h31M86 311h31" stroke="#0f172a" strokeWidth="18" strokeLinecap="round" />
          <text x="75" y="176" textAnchor="middle" fontSize="15" fontWeight="900" fill="#fff">EDSEC</text>
        </g>

        <g transform="translate(455 218)">
          <circle cx="75" cy="45" r="42" fill="#a96749" />
          <path d="M34 37c10-43 79-45 84 6-25-8-56-8-84-6Z" fill="#111827" />
          <path d="M25 105c13-25 87-25 100 0l12 135H13Z" fill="#0f172a" />
          <path d="M43 108c-13 25-24 52-31 81" stroke="#a96749" strokeWidth="20" strokeLinecap="round" />
          <path d="M108 108c16 21 26 43 35 68" stroke="#a96749" strokeWidth="20" strokeLinecap="round" />
          <path d="M48 235v76M102 235v76" stroke="#1e3a8a" strokeWidth="27" strokeLinecap="round" />
          <path d="M36 311h34M86 311h34" stroke="#0f172a" strokeWidth="18" strokeLinecap="round" />
        </g>

        <rect x="247" y="370" width="270" height="92" rx="24" fill="#0f172a" />
        <rect x="269" y="389" width="226" height="50" rx="12" fill="#2563eb" />
        <text x="382" y="422" textAnchor="middle" fontSize="21" fontWeight="900" fill="#fff">WHY WAIT?</text>

        <text x="382" y="493" textAnchor="middle" fontSize="23" fontWeight="900" fill="#1d4ed8">START TODAY! 💻🚀</text>
      </svg>
    </div>
  );
}

export default function LaunchPromoPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-white text-slate-950">
      {/* HERO */}
      <section className="relative overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(37,99,235,0.32),transparent_32%),radial-gradient(circle_at_85%_80%,rgba(14,165,233,0.18),transparent_30%)]" />
        <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-blue-600/10 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl gap-12 px-6 py-20 sm:px-8 sm:py-24 lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:px-12 lg:py-28">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-sm font-bold text-blue-300">
              <Sparkles className="h-4 w-4" />
              EDSEC LAUNCH PROMO IS LIVE!
            </div>

            <img
              src="/edsec-logo.png"
              alt="EDSEC ICT Institute"
              className="mt-7 h-14 w-auto object-contain"
            />

            <h1 className="mt-7 max-w-3xl text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
              Learn a professional digital skill from{" "}
              <span className="text-blue-400">₦20,000.</span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
              Practical, career-focused technology training for students,
              professionals, entrepreneurs, and anyone ready to build useful
              digital skills.
            </p>

            <div className="mt-7 flex flex-wrap gap-2 text-sm text-slate-200">
              {[
                "Web Development",
                "Cybersecurity",
                "Design",
                "Data Analysis",
                "Cloud Computing",
              ].map((item) => (
                <span key={item} className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                  {item}
                </span>
              ))}
            </div>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a
                href="#promo-courses"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 font-bold text-slate-950 transition hover:-translate-y-0.5 hover:bg-blue-50"
              >
                View Promo Courses
                <ArrowRight className="h-4 w-4" />
              </a>
              <Link
                href="/apply"
                className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/10 px-6 py-3.5 font-bold text-white backdrop-blur-sm transition hover:-translate-y-0.5 hover:bg-white/15"
              >
                Apply Now
              </Link>
            </div>

            <div className="mt-8 grid max-w-2xl gap-3 sm:grid-cols-3">
              {["Practical training", "Project-based learning", "Certificate of Completion"].map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm text-slate-300">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500/20 text-blue-300">
                    <Check className="h-3 w-3" />
                  </span>
                  {item}
                </div>
              ))}
            </div>
          </div>

          <ComicIllustration />
        </div>
      </section>

      {/* URGENCY */}
      <section className="bg-slate-50 px-6 py-10 sm:px-8 sm:py-14 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <LaunchPromoCountdown />
        </div>
      </section>

      {/* PROMO COURSES */}
      <section id="promo-courses" className="scroll-mt-24 bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">
              10 Launch Promo Courses
            </p>
            <h2 className="mt-4 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
              Choose your next digital skill.
            </h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">
              Get started with practical technology training at special launch
              pricing while the offer is live.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {promoCourses.map((course) => {
              const Icon = course.icon;
              const savings = course.normalPrice - course.promoPrice;

              return (
                <article
                  key={course.slug}
                  className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-2xl"
                >
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={course.image}
                      alt={course.title}
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-slate-950/10 to-transparent" />
                    <div className="absolute left-5 top-5 flex h-11 w-11 items-center justify-center rounded-xl bg-white/95 text-blue-600 shadow-lg">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="absolute right-5 top-5 rounded-full bg-blue-600 px-3 py-1.5 text-xs font-black text-white shadow-lg">
                      SAVE {formatCurrency(savings)}
                    </div>
                    <div className="absolute bottom-5 left-5 right-5">
                      <p className="text-xs font-bold uppercase tracking-wider text-blue-200">{course.duration}</p>
                      <h3 className="mt-1 text-xl font-black text-white">{course.title}</h3>
                    </div>
                  </div>

                  <div className="p-6">
                    <p className="text-sm leading-6 text-slate-600">{course.description}</p>

                    <div className="mt-5 space-y-2.5">
                      {course.learns.map((item) => (
                        <div key={item} className="flex items-start gap-2.5 text-sm text-slate-700">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 flex items-end justify-between gap-4 border-t border-slate-100 pt-5">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Launch price</p>
                        <div className="mt-1 flex flex-wrap items-baseline gap-2">
                          <span className="text-sm font-semibold text-slate-400 line-through decoration-red-400 decoration-2">
                            {formatCurrency(course.normalPrice)}
                          </span>
                          <span className="text-2xl font-black text-blue-700">
                            {formatCurrency(course.promoPrice)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <Link
                      href={`/apply?course=${course.slug}`}
                      className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-blue-700"
                    >
                      Apply for this course
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* WHY PROMO */}
      <section className="bg-slate-950 py-20 text-white sm:py-28">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr] lg:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-400">Why start now?</p>
              <h2 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">
                Your “next month” can become today.
              </h2>
              <p className="mt-5 text-lg leading-8 text-slate-400">
                The Launch Promo makes it easier to take the first step. Choose
                a skill, apply, learn by doing, and start building your future.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { icon: Users, title: "Beginner-friendly", text: "Start from the foundations and build confidence." },
                { icon: Laptop, title: "Practical learning", text: "Use modern tools and practice what you learn." },
                { icon: Rocket, title: "Build projects", text: "Turn knowledge into practical work you can show." },
                { icon: Sparkles, title: "Grow professionally", text: "Develop useful skills for work, business and freelancing." },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-300">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-5 font-bold">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-400">{item.text}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-slate-50 py-20 sm:py-28">
        <div className="mx-auto max-w-4xl px-6 sm:px-8">
          <div className="text-center">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">FAQ</p>
            <h2 className="mt-3 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
              Questions? We have answers.
            </h2>
          </div>

          <div className="mt-12 space-y-3">
            {faqs.map((faq) => (
              <details key={faq.question} className="group rounded-2xl border border-slate-200 bg-white px-5 py-1 shadow-sm">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 font-bold text-slate-950 [&::-webkit-details-marker]:hidden">
                  {faq.question}
                  <ChevronDown className="h-5 w-5 shrink-0 text-blue-600 transition group-open:rotate-180" />
                </summary>
                <p className="max-w-3xl pb-5 pr-8 text-sm leading-7 text-slate-600">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT / CTA */}
      <section className="bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-5xl px-6 sm:px-8">
          <div className="overflow-hidden rounded-[2rem] bg-blue-600 p-8 text-white shadow-2xl shadow-blue-900/20 sm:p-12 lg:p-14">
            <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-bold">
                  <Rocket className="h-4 w-4" />
                  Start today
                </div>
                <h2 className="mt-5 text-4xl font-black tracking-tight sm:text-5xl">
                  Why wait? Start your tech journey now.
                </h2>
                <p className="mt-5 max-w-2xl text-lg leading-8 text-blue-50">
                  Pick a program, submit your application, and let EDSEC help
                  you take the next step.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <Link
                  href="/apply"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-7 py-3.5 font-bold text-blue-700 transition hover:-translate-y-0.5 hover:bg-blue-50"
                >
                  Apply Now
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href="https://wa.me/2348142137101?text=Hello%20EDSEC%2C%20I%20am%20interested%20in%20the%20Launch%20Promo."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-xl border border-white/30 bg-white/10 px-7 py-3.5 font-bold text-white backdrop-blur-sm transition hover:bg-white/15"
                >
                  WhatsApp EDSEC
                </a>
              </div>
            </div>

            <div className="mt-10 border-t border-white/15 pt-6 text-sm text-blue-50">
              EDSEC ICT INSTITUTE • Innovate. Educate. Elevate.
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
