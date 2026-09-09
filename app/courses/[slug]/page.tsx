import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  BriefcaseBusiness,
  Check,
  ChevronDown,
  Cloud,
  Code2,
  Database,
  GraduationCap,
  Laptop,
  Palette,
  Rocket,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
  Wifi,
  Wrench,
} from "lucide-react";
import { prisma } from "@/app/lib/prisma";

export const dynamic = "force-dynamic";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1800&q=90";

const visuals = {
  "full-stack-web-development": {
    category: "Software Development",
    level: "Beginner to Advanced",
    accent: "from-blue-600 to-cyan-500",
    icon: Code2,
    audience: [
      "Complete beginners who want a serious entry into software development",
      "Students who want to turn coding knowledge into working applications",
      "Aspiring freelance developers and junior software engineers",
      "Entrepreneurs who want to understand and build their own digital products",
    ],
    outcomes: [
      "Build responsive websites that work across phones, tablets and computers",
      "Create interactive interfaces with modern JavaScript and React",
      "Develop full web applications with Next.js, TypeScript and backend APIs",
      "Design databases and connect applications to persistent data",
      "Implement authentication, validation and practical application security",
      "Use Git and GitHub to manage real software projects",
      "Deploy applications and understand the path from code to production",
    ],
    opportunities: ["Junior Web Developer", "Frontend Developer", "Full-Stack Developer", "Freelance Developer", "Startup/Product Builder", "Web Development Intern"],
    projects: ["Business website with contact system", "Student management portal", "Authentication-enabled web application", "REST API connected to a database", "Responsive e-commerce prototype", "Personal developer portfolio"],
    journey: ["Understand the web and write your first pages", "Build responsive interfaces with JavaScript", "Create reusable React components", "Connect frontend applications to APIs and databases", "Build complete authenticated applications", "Deploy and present a production-style capstone project"],
    experience: "You spend less time memorising syntax and more time solving development problems. Lessons move from guided exercises into increasingly independent builds, code reviews, debugging and a final portfolio-ready project.",
    skills: ["HTML & CSS", "JavaScript", "React", "Next.js", "TypeScript", "Node/API concepts", "SQL & databases", "Git & GitHub", "Authentication", "Deployment"],
    faqs: [
      ["Do I need previous coding experience?", "No. The journey starts with fundamentals and progressively introduces professional development concepts."],
      ["Will I build real projects?", "Yes. The course is structured around practical builds rather than theory alone."],
      ["Can this prepare me for freelance work?", "It gives you a practical foundation for building websites and applications, creating a portfolio and taking on entry-level projects."],
    ],
  },
  cybersecurity: {
    category: "Cybersecurity",
    level: "Beginner to Intermediate",
    accent: "from-violet-600 to-blue-600",
    icon: ShieldCheck,
    audience: ["Beginners curious about protecting computers and networks", "IT students moving toward security", "Aspiring junior security analysts", "Professionals who need stronger security awareness"],
    outcomes: ["Explain core cybersecurity concepts and common attack surfaces", "Identify common vulnerabilities across endpoints and networks", "Understand authentication, access control and secure account practices", "Use defensive security workflows for monitoring and investigation", "Recognise phishing, malware and social-engineering techniques", "Apply basic incident-response thinking to security events", "Build safer systems using practical security principles"],
    opportunities: ["Junior Cybersecurity Analyst", "SOC Trainee", "IT Security Support", "Security Operations Intern", "Cybersecurity Awareness Assistant", "IT Support with Security Focus"],
    projects: ["Security awareness campaign", "Home/lab network security assessment", "Password and access-control policy", "Basic incident-response scenario", "Vulnerability assessment exercise", "Security monitoring mini-lab"],
    journey: ["Learn the security mindset and core terminology", "Understand computers, networks and attack surfaces", "Study threats, vulnerabilities and defensive controls", "Practise monitoring, investigation and response", "Work through realistic security scenarios", "Complete a practical security-focused capstone"],
    experience: "Cybersecurity is taught as a defensive discipline. You work through realistic scenarios, security checklists, investigations and controlled practical exercises so concepts become habits rather than memorised definitions.",
    skills: ["Threat awareness", "Network security", "Identity & access", "Vulnerability concepts", "Security monitoring", "Incident response", "Security policies", "Risk awareness", "Endpoint protection", "Security hygiene"],
    faqs: [["Is cybersecurity only for advanced programmers?", "No. Security covers systems, people, networks, policies and technology. The course starts from fundamentals."], ["Will I practise security scenarios?", "Yes. Practical exercises and controlled lab-style scenarios are used to connect concepts with real situations."], ["Can I move into advanced certifications later?", "Yes. A strong fundamentals-first approach gives you a useful base for further security study and certifications." ]],
  },
  "graphic-design": {
    category: "Creative Design",
    level: "Beginner to Advanced",
    accent: "from-pink-600 to-orange-500",
    icon: Palette,
    audience: ["Beginners who want to become confident visual designers", "Business owners creating their own brand materials", "Aspiring freelance designers", "Students interested in branding, advertising and digital content"],
    outcomes: ["Create balanced layouts using professional design principles", "Choose typography and colour combinations with purpose", "Develop logos and visual identities", "Design flyers, posters and social-media graphics", "Prepare graphics for digital and print use", "Build a consistent brand look across multiple assets", "Present design work professionally to clients or employers"],
    opportunities: ["Graphic Designer", "Brand Designer", "Social Media Designer", "Freelance Designer", "Marketing Creative", "Visual Content Creator"],
    projects: ["Complete brand identity", "Business logo system", "Promotional flyer campaign", "Social media content pack", "Event poster series", "Digital advertising creative set"],
    journey: ["Learn visual principles and the design process", "Master composition, typography and colour", "Create individual graphics with increasing complexity", "Develop brand identities and campaign assets", "Work from creative briefs like a real designer", "Build a portfolio of finished client-style projects"],
    experience: "You learn by designing. Instead of stopping at tool demonstrations, EDSEC pushes you from a blank canvas to a finished visual, then teaches you how to improve hierarchy, consistency, readability and professional presentation.",
    skills: ["Composition", "Typography", "Colour theory", "Branding", "Logo design", "Layout", "Social graphics", "Advertising design", "Creative briefs", "Portfolio presentation"],
    faqs: [["Do I need to be naturally artistic?", "No. Design can be learned through principles, practice, feedback and repetition."], ["Can I use the skills for freelance work?", "Yes. The projects are designed to help you practise common client and business design needs."], ["Will I build a portfolio?", "Yes. Your practical projects can become the foundation of a design portfolio." ]],
  },
  "data-analysis": {
    category: "Data & Business Intelligence",
    level: "Beginner to Intermediate",
    accent: "from-emerald-600 to-cyan-500",
    icon: BarChart3,
    audience: ["Students who enjoy numbers, patterns and problem solving", "Business owners who want to understand their data", "Beginners targeting entry-level analyst roles", "Professionals who want stronger spreadsheet and reporting skills"],
    outcomes: ["Clean messy datasets and prepare them for analysis", "Use spreadsheet formulas and functions confidently", "Summarise information with tables and meaningful calculations", "Build clear charts and dashboards", "Find trends, patterns and anomalies in business data", "Turn analysis into understandable reports", "Present data-backed recommendations to decision makers"],
    opportunities: ["Junior Data Analyst", "Reporting Assistant", "Business Data Assistant", "Operations Analyst Trainee", "Excel/Data Specialist", "Research Assistant"],
    projects: ["Sales performance dashboard", "Customer analysis report", "Inventory analysis workbook", "Expense and budget tracker", "Survey-data insight report", "Management KPI dashboard"],
    journey: ["Learn how analysts think about questions and data", "Master spreadsheet foundations", "Clean and transform practical datasets", "Analyse trends and relationships", "Build dashboards and reports", "Present a complete business insight project"],
    experience: "Every major concept is tied to a question: What happened? Why did it happen? What should we do next? You practise cleaning, calculating, visualising and explaining data so your work becomes useful rather than merely technical.",
    skills: ["Excel", "Data cleaning", "Formulas", "Pivot-style analysis", "Charts", "Dashboards", "Data storytelling", "Business metrics", "Reporting", "Insight generation"],
    faqs: [["Do I need advanced mathematics?", "No. The course focuses on practical analysis, logical thinking, spreadsheets and communicating insights."], ["Is this useful for business owners?", "Very. You can use the skills to understand sales, expenses, customers, inventory and performance."], ["Will I build dashboards?", "Yes. Visual reporting and dashboard-style projects are part of the practical journey." ]],
  },
  "digital-marketing": {
    category: "Digital Marketing",
    level: "Beginner",
    accent: "from-orange-500 to-pink-600",
    icon: BriefcaseBusiness,
    audience: ["Business owners who want to attract customers online", "Beginners seeking a digital marketing career", "Content creators and social media managers", "Freelancers who want a marketable online service"],
    outcomes: ["Create a practical digital marketing strategy", "Identify target audiences and customer needs", "Plan content around business goals", "Build stronger social-media campaigns", "Understand SEO and discoverability fundamentals", "Understand digital advertising concepts and campaign structure", "Read marketing metrics and improve campaigns from evidence"],
    opportunities: ["Digital Marketing Assistant", "Social Media Manager", "Content Marketer", "Marketing Assistant", "Freelance Digital Marketer", "Small-Business Marketing Consultant"],
    projects: ["30-day content strategy", "Business social-media campaign", "SEO content plan", "Customer persona and funnel", "Digital ad campaign mock-up", "Marketing performance report"],
    journey: ["Understand customers, markets and digital channels", "Build a content and social strategy", "Learn discoverability and SEO fundamentals", "Plan campaigns and advertising", "Measure performance with useful metrics", "Present an end-to-end marketing campaign"],
    experience: "Marketing sessions connect creativity with measurement. You create campaign ideas, content plans and audience strategies, then learn how to judge performance and improve what you publish.",
    skills: ["Content strategy", "Social media", "SEO basics", "Audience research", "Campaign planning", "Copywriting", "Analytics", "Brand communication", "Digital advertising", "Marketing strategy"],
    faqs: [["Can I use this for my own business?", "Absolutely. The course is designed around practical campaigns that can be adapted to real businesses."], ["Do I need to know how to code?", "No. Digital marketing is primarily about audiences, content, campaigns and measurement."], ["Will I learn advertising?", "You will learn the principles and workflow behind digital advertising and campaign planning." ]],
  },
  "it-support-networking": {
    category: "IT Support & Networking",
    level: "Beginner to Intermediate",
    accent: "from-cyan-600 to-blue-600",
    icon: Wifi,
    audience: ["Beginners who enjoy fixing computers and technical problems", "Students targeting help-desk and IT support roles", "Small-business staff responsible for office technology", "Aspiring network technicians and system support professionals"],
    outcomes: ["Identify and troubleshoot common hardware faults", "Install and configure operating systems and software", "Diagnose everyday Windows and workstation problems", "Understand IP addressing, LANs, Wi-Fi and network devices", "Configure basic routers and local networks", "Support printers, peripherals and user connectivity", "Approach technical tickets with a structured troubleshooting process"],
    opportunities: ["IT Support Specialist", "Help Desk Technician", "Desktop Support Technician", "Network Support Trainee", "Computer Technician", "Service Desk Analyst"],
    projects: ["Assemble and configure a workstation", "Windows troubleshooting lab", "Small office LAN design", "Wi-Fi setup and troubleshooting exercise", "Printer and peripheral support workflow", "IT support ticket simulation"],
    journey: ["Understand computer hardware and operating systems", "Learn systematic troubleshooting", "Configure workstations and peripherals", "Build networking fundamentals", "Practise LAN and Wi-Fi troubleshooting", "Complete a simulated IT support environment"],
    experience: "This is a hands-on support pathway. You learn to inspect a problem, isolate the cause, test a solution and document the result—the same disciplined thinking used in real IT support environments.",
    skills: ["Hardware", "Windows", "Troubleshooting", "Networking", "IP addressing", "Wi-Fi", "Routers", "Peripherals", "User support", "Ticket handling"],
    faqs: [["Is this suitable for someone who has never repaired a computer?", "Yes. Hardware and troubleshooting fundamentals are introduced progressively."], ["Will I learn networking too?", "Yes. The program combines workstation support with practical networking foundations."], ["What jobs can this lead toward?", "It can prepare you for entry-level IT support, help desk, desktop support and related junior technical roles." ]],
  },
  "ui-ux-design": {
    category: "UI/UX Design",
    level: "Beginner to Advanced",
    accent: "from-fuchsia-600 to-violet-600",
    icon: Palette,
    audience: ["Creative people interested in digital products", "Graphic designers moving into product design", "Beginners targeting UI/UX careers", "Developers who want to design better user experiences"],
    outcomes: ["Understand the difference between visual design and user experience", "Research users and define meaningful problems", "Create personas, user flows and information structures", "Turn ideas into wireframes and high-fidelity interfaces", "Design responsive screens and reusable components", "Prototype and test ideas before development", "Explain design decisions in a professional portfolio"],
    opportunities: ["UI Designer", "UX Designer", "Product Designer Trainee", "UX Research Assistant", "Design Intern", "Freelance UI/UX Designer"],
    projects: ["Mobile app redesign", "Responsive website interface", "User-flow and wireframe system", "Dashboard design", "Design-system starter kit", "Portfolio-ready product case study"],
    journey: ["Learn how people experience digital products", "Research and define a user problem", "Map flows and structure information", "Wireframe and prototype", "Create polished responsive interfaces", "Test, refine and present a complete case study"],
    experience: "You are taught to design for people, not just screenshots. Research, structure, wireframes, prototypes, visual systems and feedback are connected into a repeatable product-design workflow.",
    skills: ["User research", "Personas", "User flows", "Wireframing", "Prototyping", "Visual hierarchy", "Responsive UI", "Design systems", "Usability testing", "Case studies"],
    faqs: [["Do I need to know graphic design?", "No. Visual fundamentals are taught alongside UX thinking."], ["Will I create a portfolio case study?", "Yes. The course is designed to help you explain the problem, process, design and outcome."], ["Can UI/UX lead to freelance work?", "Yes. Websites, dashboards, mobile interfaces and product improvements are common design service areas." ]],
  },
  "microsoft-office-professional": {
    category: "Digital Productivity",
    level: "Beginner to Advanced",
    accent: "from-blue-600 to-indigo-600",
    icon: Laptop,
    audience: ["Students who want stronger computer skills", "Job seekers preparing for office-based roles", "Business owners and assistants", "Anyone who wants to work faster and more professionally with documents and spreadsheets"],
    outcomes: ["Create polished professional documents in Word", "Use Excel for calculations, records and practical reporting", "Build clear PowerPoint presentations", "Format business documents consistently", "Work with spreadsheets using formulas and structured data", "Create charts and presentation-ready reports", "Improve everyday digital productivity"],
    opportunities: ["Administrative Assistant", "Office Assistant", "Data Entry/Records Assistant", "Executive Assistant", "Customer Service Support", "Business Operations Assistant"],
    projects: ["Professional CV and business letter", "Expense tracker", "Sales spreadsheet", "Automated-style reporting workbook", "Business presentation", "Office productivity project pack"],
    journey: ["Build confident computer and file-management habits", "Create professional Word documents", "Move from simple Excel sheets to useful analysis", "Design persuasive PowerPoint presentations", "Combine documents, spreadsheets and presentations", "Complete an integrated workplace productivity project"],
    experience: "The goal is workplace confidence. You practise the kinds of documents, spreadsheets and presentations that students, employees and business owners actually need—not isolated button-by-button demonstrations.",
    skills: ["Word", "Excel", "PowerPoint", "Document formatting", "Formulas", "Charts", "Presentations", "File management", "Business productivity", "Professional communication"],
    faqs: [["Is this course only for beginners?", "No. Beginners can start from the fundamentals while more experienced users can build stronger professional workflows."], ["Will Excel be practical?", "Yes. Exercises focus on records, calculations, reports, charts and useful business spreadsheets."], ["Can students benefit from it?", "Yes. Word, Excel and PowerPoint are valuable for school, projects, presentations and future employment." ]],
  },
  "cloud-computing": {
    category: "Cloud Technology",
    level: "Beginner to Intermediate",
    accent: "from-sky-500 to-blue-700",
    icon: Cloud,
    audience: ["IT and computer science students", "Developers who want to understand modern infrastructure", "Beginners exploring cloud careers", "Technical professionals moving beyond traditional local servers"],
    outcomes: ["Explain IaaS, PaaS and SaaS in practical terms", "Understand how cloud servers, storage and databases work", "Understand virtualisation and cloud networking concepts", "Work with cloud identity and access principles", "Recognise important cloud security considerations", "Understand application deployment in cloud environments", "Design a simple cloud architecture for a practical use case"],
    opportunities: ["Cloud Support Trainee", "Junior Cloud Technician", "Cloud Operations Intern", "DevOps/Cloud Learner", "Technical Support with Cloud Focus", "Junior Infrastructure Assistant"],
    projects: ["Cloud architecture diagram", "Virtual-server deployment exercise", "Cloud storage workflow", "Cloud-hosted application concept", "Identity and access design", "Small business cloud migration plan"],
    journey: ["Understand why organisations use cloud computing", "Explore services, regions and virtual resources", "Learn storage, compute and networking concepts", "Study identity, security and cost awareness", "Deploy and connect simple cloud resources", "Design a practical cloud solution"],
    experience: "Cloud concepts can feel abstract until you connect them to real systems. EDSEC uses architecture diagrams, deployment exercises and practical scenarios to show how applications and infrastructure fit together.",
    skills: ["Cloud concepts", "Virtual machines", "Storage", "Databases", "Cloud networking", "IAM concepts", "Cloud security", "Deployment", "Architecture", "Infrastructure thinking"],
    faqs: [["Do I need to be a programmer?", "No. Programming can help, but the course also covers infrastructure, architecture and cloud operations concepts."], ["Is cloud computing only for large companies?", "No. Small organisations can also benefit from cloud-hosted applications, storage, collaboration and infrastructure."], ["Can I continue into certifications later?", "Yes. The course provides foundational concepts that can support deeper cloud study and certification preparation." ]],
  },
  "virtual-assistant": {
    category: "Remote Work & Professional Skills",
    level: "Beginner to Intermediate",
    accent: "from-amber-500 to-orange-600",
    icon: Users,
    audience: ["Beginners seeking remote-work opportunities", "Organised people who enjoy communication and administration", "Entrepreneurs who want to offer support services", "Job seekers building modern office and digital-work skills"],
    outcomes: ["Manage professional email and calendars effectively", "Organise tasks, meetings and digital files", "Conduct online research and present useful findings", "Communicate professionally with clients and teams", "Use common productivity and collaboration tools", "Support customer-service and administrative workflows", "Build a professional remote-work routine"],
    opportunities: ["Virtual Assistant", "Executive Assistant", "Administrative Assistant", "Customer Support Assistant", "Remote Operations Assistant", "Freelance VA"],
    projects: ["Executive weekly schedule", "Inbox-management workflow", "Research and reporting task", "Client onboarding checklist", "Remote project task board", "Virtual-assistant service portfolio"],
    journey: ["Build professional communication habits", "Master digital organisation and productivity", "Practise email, calendars and research", "Learn client and customer support workflows", "Manage realistic remote-work tasks", "Package your skills into a professional service profile"],
    experience: "Virtual assistance is about reliability, communication and organisation. You practise realistic business tasks and learn how to deliver work clearly, on time and with professional attention to detail.",
    skills: ["Email management", "Calendar management", "Online research", "Google Workspace", "Microsoft Office", "Task management", "Customer support", "Communication", "Remote collaboration", "Professional organisation"],
    faqs: [["Can I start without office experience?", "Yes. The course introduces the tools, workflows and professional habits from the beginning."], ["Can I work remotely after learning?", "The skills are suitable for remote administrative and support work, although finding work still requires applications, networking and a strong service profile."], ["Do I need expensive equipment?", "A reliable computer, internet connection and willingness to practise are the main essentials." ]],
  },
} as const;

const fallbackVisual = {
  category: "Technology",
  level: "Beginner to Advanced",
  accent: "from-cyan-600 to-blue-700",
  icon: GraduationCap,
  audience: ["Students, beginners and career changers", "Professionals who want practical digital skills"],
  outcomes: ["Build practical skills through guided learning", "Apply concepts to realistic projects", "Develop confidence using professional tools"],
  opportunities: ["Entry-level digital roles", "Freelance opportunities", "Further professional training"],
  projects: ["Guided practical project", "Portfolio project", "Real-world skills assessment"],
  journey: ["Learn the fundamentals", "Practise guided tasks", "Build independent projects", "Present your final work"],
  experience: "EDSEC combines instructor guidance, practical exercises, projects and progressive challenges to help students turn knowledge into usable skills.",
  skills: ["Digital fundamentals", "Problem solving", "Professional tools", "Project work", "Communication"],
  faqs: [["Is the course beginner friendly?", "Yes. Course content is structured progressively."], ["Will there be practical work?", "Yes. EDSEC focuses on learning by doing." ]],
};

function isExternalImage(url: string) {
  return /^https?:\/\//i.test(url);
}

export async function generateStaticParams() {
  const courses = await prisma.course.findMany({ where: { status: "ACTIVE" }, select: { slug: true } });
  return courses.map((course) => ({ slug: course.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const course = await prisma.course.findUnique({ where: { slug }, select: { title: true, shortDescription: true, description: true, imageUrl: true, status: true } });
  if (!course || course.status !== "ACTIVE") return { title: "Course | EDSEC Computer Training" };
  return {
    title: `${course.title} | EDSEC Computer Training`,
    description: course.description || course.shortDescription,
    openGraph: { title: `${course.title} | EDSEC Computer Training`, description: course.description || course.shortDescription, images: course.imageUrl ? [course.imageUrl] : undefined },
  };
}

export default async function CoursePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const course = await prisma.course.findUnique({
    where: { slug },
    include: {
      modules: {
        where: { isPublished: true },
        orderBy: { displayOrder: "asc" },
        include: { lessons: { where: { isPublished: true }, orderBy: { displayOrder: "asc" }, select: { id: true, title: true, duration: true, displayOrder: true } } },
      },
    },
  });

  if (!course || course.status !== "ACTIVE") notFound();

  const visual = visuals[course.slug as keyof typeof visuals] ?? fallbackVisual;
  const CourseIcon = visual.icon;
  const image = course.imageUrl || FALLBACK_IMAGE;
  const totalLessons = course.modules.reduce((sum, module) => sum + module.lessons.length, 0);
  const totalMinutes = course.modules.reduce((sum, module) => sum + module.lessons.reduce((lessonSum, lesson) => lessonSum + (lesson.duration ?? 0), 0), 0);
  const requirements = course.requirements?.split(/\r?\n|•/).map((item) => item.trim()).filter(Boolean) ?? ["Basic computer literacy", "Willingness to learn", "Commitment to practical practice"];
  const related = await prisma.course.findMany({ where: { status: "ACTIVE", slug: { not: course.slug } }, orderBy: [{ featured: "desc" }, { displayOrder: "asc" }, { title: "asc" }], take: 3, select: { id: true, title: true, slug: true, shortDescription: true, imageUrl: true, duration: true } });

  return (
    <main className="min-h-screen overflow-hidden bg-white text-slate-950">
      <Hero course={course} visual={visual} CourseIcon={CourseIcon} image={image} />

      <section className="relative z-10 -mt-8 px-5">
        <div className="mx-auto grid max-w-6xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-slate-200/60 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="Duration" value={course.duration || "Flexible"} icon={<Target size={20} />} />
          <Stat label="Level" value={visual.level} icon={<GraduationCap size={20} />} />
          <Stat label="Modules" value={`${course.modules.length}`} icon={<Database size={20} />} />
          <Stat label="Lessons" value={totalLessons ? `${totalLessons}` : "Practical"} icon={<Rocket size={20} />} />
        </div>
      </section>

      <section className="px-5 py-20 lg:px-8 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_360px]">
          <div className="space-y-16">
            <SectionIntro eyebrow="Start here" title="A course designed to move you from interest to ability." text={course.description || course.shortDescription} />
            <Audience items={visual.audience} />
            <Outcomes items={visual.outcomes} />
            <ActionSection title="What will you be able to do after learning?" items={visual.outcomes.slice(0, 6)} icon={<Wrench size={24} />} />
            <OpportunitySection items={visual.opportunities} />
            <Projects items={visual.projects} />
            <LearningExperience text={visual.experience} />
            <Skills items={visual.skills} />
            <Journey items={visual.journey} />
            <Requirements items={requirements} />
            <Curriculum modules={course.modules} totalMinutes={totalMinutes} />
            <Faqs items={visual.faqs} />
          </div>

          <aside className="lg:sticky lg:top-8 lg:self-start">
            <div className="overflow-hidden rounded-4xl border border-slate-200 bg-white shadow-xl shadow-slate-200/50">
              <div className={`bg-linear-to-br ${visual.accent} p-7 text-white`}>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-white/70">Ready to start?</p>
                <h2 className="mt-3 text-2xl font-black">Turn this course into your next skill.</h2>
                <p className="mt-3 text-sm leading-6 text-white/80">Learn with structure, practise with purpose and build work you can talk about.</p>
              </div>
              <div className="p-6">
                <Link href={`/apply?course=${encodeURIComponent(course.slug)}`} className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-4 font-bold text-white transition hover:bg-cyan-600">Apply Now <ArrowUpRight size={18} /></Link>
                <div className="mt-6 space-y-4 text-sm">
                  <Mini label="Duration" value={course.duration || "Flexible"} />
                  <Mini label="Level" value={visual.level} />
                  <Mini label="Format" value={course.learningFormat || "Practical training"} />
                  {totalMinutes > 0 && <Mini label="Published learning time" value={`${Math.ceil(totalMinutes / 60)}+ hours`} />}
                </div>
                <div className="mt-6 rounded-2xl bg-cyan-50 p-4 text-sm leading-6 text-slate-700"><strong className="text-slate-950">EDSEC promise:</strong> You will not only study concepts—you will practise applying them.</div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="bg-slate-950 px-5 py-20 text-white lg:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <SectionIntro eyebrow="Why EDSEC" title="Learn in a way that prepares you to use the skill." text="EDSEC combines structured instruction, practical exercises, project work and progressive challenges so learning does not end when the lesson ends." dark />
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            <Why icon={<Laptop size={22} />} title="Hands-on" text="Spend time doing the work, not only watching it." />
            <Why icon={<Rocket size={22} />} title="Project-led" text="Turn lessons into useful projects and evidence of ability." />
            <Why icon={<Users size={22} />} title="Instructor guidance" text="Learn with direction, feedback and a clear progression." />
            <Why icon={<Sparkles size={22} />} title="Career-minded" text="Build practical skills that connect to work, business and further learning." />
          </div>
        </div>
      </section>

      {related.length > 0 && <section className="px-5 py-20 lg:px-8"><div className="mx-auto max-w-7xl"><SectionIntro eyebrow="Keep exploring" title="Your next skill could be one click away." text="Explore other EDSEC programmes and build a broader digital skill set." /><div className="mt-10 grid gap-6 md:grid-cols-3">{related.map((item) => <Link key={item.id} href={`/courses/${item.slug}`} className="group overflow-hidden rounded-3xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:border-cyan-200 hover:shadow-xl"><div className="relative aspect-16/10 overflow-hidden bg-slate-100"><Image src={item.imageUrl || FALLBACK_IMAGE} alt={item.title} fill sizes="(max-width: 768px) 100vw, 33vw" unoptimized={isExternalImage(item.imageUrl || FALLBACK_IMAGE)} className="object-cover transition duration-700 group-hover:scale-110" /></div><div className="p-6"><h3 className="text-xl font-black group-hover:text-cyan-600">{item.title}</h3><p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-600">{item.shortDescription}</p><div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-5 text-sm font-bold text-slate-500"><span>{item.duration || "Flexible"}</span><ArrowRight size={18} className="text-cyan-600 transition group-hover:translate-x-1" /></div></div></Link>)}</div></div></section>}

      <section className="px-5 pb-24 lg:px-8"><div className="relative mx-auto max-w-7xl overflow-hidden rounded-4xl bg-slate-950 px-7 py-16 text-center text-white sm:px-12"><div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" /><div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-blue-600/10 blur-3xl" /><div className="relative mx-auto max-w-3xl"><div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-cyan-500 text-slate-950"><GraduationCap size={28} /></div><p className="mt-6 text-sm font-black uppercase tracking-[0.2em] text-cyan-400">Your next chapter starts here</p><h2 className="mt-4 text-3xl font-black tracking-tight sm:text-5xl">Ready to learn {course.title}?</h2><p className="mx-auto mt-5 max-w-2xl leading-7 text-slate-300">Take the next step toward a practical digital skill. Apply now and begin your EDSEC learning journey.</p><Link href={`/apply?course=${encodeURIComponent(course.slug)}`} className="mt-9 inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-500 px-8 py-4 font-bold text-slate-950 transition hover:bg-cyan-400">Apply Now <ArrowUpRight size={19} /></Link></div></div></section>
    </main>
  );
}

function Hero({ course, visual, CourseIcon, image }: { course: any; visual: any; CourseIcon: any; image: string }) {
  return <section className="relative isolate overflow-hidden bg-slate-950 text-white"><div className="absolute inset-0"><Image src={image} alt="" fill priority sizes="100vw" unoptimized={isExternalImage(image)} className="object-cover opacity-30" /><div className="absolute inset-0 bg-slate-950/80" /><div className="absolute inset-0 bg-linear-to-r from-slate-950 via-slate-950/85 to-blue-950/50" /></div><div className="relative mx-auto max-w-7xl px-5 py-8 lg:px-8"><Link href="/courses" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-300 backdrop-blur-md transition hover:bg-white/10 hover:text-white"><ArrowLeft size={16} /> Back to all courses</Link></div><div className="relative mx-auto grid max-w-7xl gap-12 px-5 pb-24 pt-10 lg:grid-cols-[1fr_.82fr] lg:items-center lg:px-8 lg:pt-14"><div><div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-bold text-cyan-300"><Sparkles size={15} /> EDSEC ICT INSTITUTE</div><div className="mt-7 flex items-center gap-4"><div className={`grid h-16 w-16 place-items-center rounded-2xl bg-linear-to-br ${visual.accent}`}><CourseIcon size={30} /></div><div><p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-400">{visual.category}</p><p className="mt-1 text-sm text-slate-400">Practical • Project-Based • Career-Minded</p></div></div><h1 className="mt-7 max-w-4xl text-4xl font-black tracking-[-0.04em] sm:text-5xl lg:text-6xl">{course.title}</h1><p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">{course.description || course.shortDescription}</p><div className="mt-8 flex flex-wrap gap-3"><Badge>{course.duration || "Flexible"}</Badge><Badge>{visual.level}</Badge><Badge cyan>Practical Training</Badge></div><div className="mt-9 flex flex-col gap-3 sm:flex-row"><Link href={`/apply?course=${encodeURIComponent(course.slug)}`} className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-500 px-7 py-4 font-black text-slate-950 shadow-xl transition hover:-translate-y-1 hover:bg-cyan-400">Apply Now <ArrowUpRight size={19} /></Link><a href="#who-is-this-for" className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 px-7 py-4 font-bold text-white transition hover:bg-white/10">See what you will learn</a></div></div><div className="relative"><div className="absolute -inset-6 rounded-[2.5rem] bg-cyan-500/10 blur-3xl" /><div className="relative overflow-hidden rounded-4xl border border-white/10 bg-white/5 p-2 shadow-2xl"><div className="relative aspect-4/3 overflow-hidden rounded-3xl"><Image src={image} alt={course.title} fill priority sizes="(max-width: 1024px) 100vw, 45vw" unoptimized={isExternalImage(image)} className="object-cover transition duration-700 hover:scale-105" /><div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-transparent to-transparent" /><div className="absolute bottom-5 left-5 right-5"><p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-300">LEARN • BUILD • GROW</p><p className="mt-2 text-2xl font-black">Build skills that move with you.</p></div></div></div></div></div></div></section>;
}

function Stat({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) { return <div className="border-b border-slate-100 p-6 lg:border-b-0 lg:border-r lg:last:border-r-0"><div className="flex items-start gap-4"><div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-cyan-50 text-cyan-600">{icon}</div><div className="min-w-0"><p className="text-xs font-bold uppercase tracking-wider text-slate-400">{label}</p><p className="mt-1 truncate text-sm font-black text-slate-900">{value}</p></div></div></div>; }
function SectionIntro({ eyebrow, title, text, dark = false }: { eyebrow: string; title: string; text: string; dark?: boolean }) { return <div><p className={`text-sm font-black uppercase tracking-[0.2em] ${dark ? "text-cyan-400" : "text-cyan-600"}`}>{eyebrow}</p><h2 className={`mt-3 max-w-4xl text-3xl font-black tracking-tight sm:text-4xl ${dark ? "text-white" : "text-slate-950"}`}>{title}</h2><p className={`mt-4 max-w-3xl leading-8 ${dark ? "text-slate-400" : "text-slate-600"}`}>{text}</p></div>; }
function Audience({ items }: { items: readonly string[] }) { return <section id="who-is-this-for"><SectionIntro eyebrow="🎯 Who this course is for" title="If you recognise yourself here, this programme was built for you." text="You do not need to have everything figured out before you start. You need a reason to learn and the commitment to practise." /><div className="mt-8 grid gap-4 sm:grid-cols-2">{items.map((item) => <Card key={item} text={item} />)}</div></section>; }
function Outcomes({ items }: { items: readonly string[] }) { return <section><SectionIntro eyebrow="💡 What you will learn" title="Knowledge becomes useful when you can apply it." text="The learning outcomes below are the capabilities the programme is designed to develop." /><div className="mt-8 grid gap-3 sm:grid-cols-2">{items.map((item) => <CheckItem key={item} text={item} />)}</div></section>; }
function ActionSection({ title, items, icon }: { title: string; items: readonly string[]; icon: React.ReactNode }) { return <section className="rounded-4xl border border-slate-200 bg-slate-50 p-7 sm:p-9"><div className="flex gap-4"><div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-slate-950 text-white">{icon}</div><div><p className="text-sm font-black uppercase tracking-[0.15em] text-cyan-600">🛠️ After the course</p><h2 className="mt-1 text-2xl font-black">{title}</h2></div></div><div className="mt-7 space-y-3">{items.map((item) => <CheckItem key={item} text={item} />)}</div></section>; }
function OpportunitySection({ items }: { items: readonly string[] }) { return <section><SectionIntro eyebrow="💼 Career & business opportunities" title="Skills create options." text="Your next step may be employment, freelancing, entrepreneurship, an internship or deeper technical study. The exact path depends on your effort, portfolio and opportunities." /><div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{items.map((item) => <div key={item} className="rounded-2xl border border-slate-200 bg-white p-5 font-bold text-slate-800 shadow-sm">{item}</div>)}</div></section>; }
function Projects({ items }: { items: readonly string[] }) { return <section><SectionIntro eyebrow="🚀 Real projects" title="Build things you can show, discuss and improve." text="Projects give your learning a destination. They also help you discover what you enjoy and where you still need practice." /><div className="mt-8 grid gap-5 md:grid-cols-2">{items.map((item, index) => <div key={item} className="group rounded-3xl border border-slate-200 p-6 transition hover:-translate-y-1 hover:border-cyan-200 hover:shadow-lg"><div className="flex items-center justify-between"><span className="text-xs font-black tracking-[0.2em] text-cyan-600">PROJECT {String(index + 1).padStart(2, "0")}</span><ArrowUpRight size={18} className="text-slate-300 transition group-hover:text-cyan-600" /></div><h3 className="mt-5 text-xl font-black">{item}</h3><p className="mt-2 text-sm leading-6 text-slate-600">A practical build that turns course concepts into a realistic outcome.</p></div>)}</div></section>; }
function LearningExperience({ text }: { text: string }) { return <section><SectionIntro eyebrow="📚 Learning experience" title="A structured path, not a pile of lessons." text={text} /><div className="mt-8 grid gap-4 sm:grid-cols-3"><Card text="Instructor-led learning" /><Card text="Hands-on exercises" /><Card text="Progressive projects" /></div></section>; }
function Skills({ items }: { items: readonly string[] }) { return <section><SectionIntro eyebrow="🧠 Skills you will gain" title="A toolkit you can keep building on." text="These skills are the practical building blocks behind the course." /><div className="mt-8 flex flex-wrap gap-3">{items.map((item) => <span key={item} className="rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm">{item}</span>)}</div></section>; }
function Journey({ items }: { items: readonly string[] }) { return <section><SectionIntro eyebrow="🎓 Beginner → advanced journey" title="Start with the foundations. Finish with independence." text="The exact pace varies by learner, but the progression is designed to reduce overwhelm and steadily increase responsibility." /><div className="mt-8 space-y-3">{items.map((item, index) => <div key={item} className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-5"><div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-cyan-100 text-sm font-black text-cyan-700">{index + 1}</div><p className="font-bold leading-7 text-slate-700">{item}</p></div>)}</div></section>; }
function Requirements({ items }: { items: string[] }) { return <section><SectionIntro eyebrow="📋 Course requirements" title="What you need before you begin." text="Keep the starting point simple. The goal is to make the learning path accessible while still challenging you to grow." /><div className="mt-7 space-y-3">{items.map((item) => <CheckItem key={item} text={item} />)}</div></section>; }
function Curriculum({ modules, totalMinutes }: { modules: { id: string; title: string; description: string | null; lessons: { id: string; title: string; duration: number | null }[] }[]; totalMinutes: number }) { return <section><SectionIntro eyebrow="📖 Curriculum" title="See how the learning is organised." text={modules.length ? `${modules.length} published module${modules.length === 1 ? "" : "s"}${totalMinutes ? ` • ${Math.ceil(totalMinutes / 60)}+ hours of published lesson time` : ""}.` : "The detailed curriculum is being prepared by the EDSEC training team."} />{modules.length > 0 && <div className="mt-8 space-y-4">{modules.map((module, index) => <details key={module.id} className="group overflow-hidden rounded-3xl border border-slate-200 bg-white"><summary className="flex cursor-pointer list-none items-center gap-4 p-6"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-slate-950 text-xs font-black text-white">{String(index + 1).padStart(2, "0")}</span><span className="min-w-0 flex-1"><span className="block font-black text-slate-950">{module.title}</span>{module.description && <span className="mt-1 block text-sm text-slate-500">{module.description}</span>}</span><ChevronDown className="shrink-0 text-slate-400 transition group-open:rotate-180" size={20} /></summary><div className="border-t border-slate-100 bg-slate-50 px-6 py-4">{module.lessons.length ? module.lessons.map((lesson) => <div key={lesson.id} className="flex items-center justify-between gap-4 border-b border-slate-100 py-3 last:border-0"><span className="text-sm font-semibold text-slate-700">{lesson.title}</span>{lesson.duration ? <span className="text-xs font-medium text-slate-400">{lesson.duration} min</span> : null}</div>) : <p className="py-2 text-sm text-slate-500">Lessons will be published as the module is developed.</p>}</div></details>)}</div>}</section>; }
function Faqs({ items }: { items: readonly (readonly [string, string])[] }) { return <section><SectionIntro eyebrow="❓ FAQ" title="Questions learners often ask." text="If you still need an answer before applying, contact EDSEC and the training team can guide you." /><div className="mt-8 space-y-3">{items.map(([question, answer]) => <details key={question} className="group rounded-2xl border border-slate-200 bg-white p-5"><summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-black text-slate-900">{question}<ChevronDown size={19} className="shrink-0 text-slate-400 transition group-open:rotate-180" /></summary><p className="mt-4 max-w-3xl pr-6 text-sm leading-7 text-slate-600">{answer}</p></details>)}</div></section>; }
function Card({ text }: { text: string }) { return <div className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-cyan-100 text-cyan-700"><Check size={14} strokeWidth={3} /></span><span className="text-sm font-semibold leading-6 text-slate-700">{text}</span></div>; }
function CheckItem({ text }: { text: string }) { return <div className="flex items-start gap-3"><Check size={18} className="mt-1 shrink-0 text-cyan-600" strokeWidth={3} /><p className="text-sm leading-7 text-slate-600">{text}</p></div>; }
function Mini({ label, value }: { label: string; value: string }) { return <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3 last:border-0 last:pb-0"><span className="text-slate-500">{label}</span><span className="max-w-[190px] text-right font-bold text-slate-800">{value}</span></div>; }
function Badge({ children, cyan = false }: { children: React.ReactNode; cyan?: boolean }) { return <span className={cyan ? "rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-300" : "rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold text-white"}>{children}</span>; }
function Why({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) { return <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 transition hover:border-cyan-400/30 hover:bg-white/[0.07]"><div className="grid h-11 w-11 place-items-center rounded-xl bg-cyan-400/10 text-cyan-400">{icon}</div><h3 className="mt-6 font-black">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-400">{text}</p></div>; }
