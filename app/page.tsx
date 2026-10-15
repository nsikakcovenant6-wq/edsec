import Link from "next/link";
import { prisma } from "@/app/lib/prisma";
import { ArrowRight, BookOpen, Code2, GraduationCap, Monitor, ShieldCheck, Users, CheckCircle2 } from "lucide-react";

export const dynamic = "force-dynamic";
export const metadata = { title: "EDSEC ICT Institute | Practical Digital Skills & Technology Solutions", description: "Build practical ICT skills, enrol in EDSEC courses, or request professional websites, school digital platforms and business technology services." };

const solutions=[
  {title:"School Digital Platform",description:"Websites, admissions, student and parent portals, CBT, results, fees and school administration.",href:"/school-management-system",cta:"Explore school platform"},
  {title:"Website & Software Development",description:"Modern websites and software for schools, businesses and organizations.",href:"/services",cta:"Explore our services"},
  {title:"Corporate ICT Training",description:"Practical digital-skills programs for teams, schools and organizations.",href:"/corporate-training",cta:"Train your team"},
];
const benefits=["Practical, project-based learning","Support from experienced instructors","Training designed around real-world skills","Opportunities to build a portfolio"];

export default async function HomePage(){
  const courses=await prisma.course.findMany({where:{status:"ACTIVE"},orderBy:[{featured:"desc"},{displayOrder:"asc"}],take:6,select:{id:true,title:true,slug:true,shortDescription:true,duration:true,learningFormat:true,imageUrl:true}});
  const photos=await prisma.galleryItem.findMany({where:{isPublished:true},orderBy:[{displayOrder:"asc"},{createdAt:"desc"}],take:3,select:{id:true,title:true,imageUrl:true}});
  return <main className="bg-white text-slate-950">
    <section className="relative overflow-hidden bg-slate-950 px-6 py-20 text-white sm:py-28">
      <div className="pointer-events-none absolute -right-32 -top-40 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl"/>
      <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-cyan-400">EDSEC ICT Institute · Innovate. Educate. Elevate.</p>
          <h1 className="mt-6 max-w-3xl text-4xl font-extrabold leading-tight tracking-tight sm:text-6xl">Learn practical tech skills. <span className="text-cyan-400">Build real solutions.</span></h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">Learn digital skills through hands-on training, or partner with EDSEC to build websites, school platforms and technology solutions for your organization.</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/apply" className="rounded-xl bg-cyan-400 px-6 py-4 font-bold text-slate-950 hover:bg-cyan-300">Apply for Training →</Link>
            <Link href="/school-management-system" className="rounded-xl border border-white/25 px-6 py-4 font-bold text-white hover:bg-white/10">Get a School Website</Link>
            <Link href="/consultation" className="rounded-xl border border-white/25 px-6 py-4 font-bold text-white hover:bg-white/10">Request a Consultation</Link>
          </div>
          <div className="mt-9 flex flex-wrap gap-5 text-sm text-slate-300"><span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-cyan-400"/>Hands-on training</span><span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-cyan-400"/>Real projects</span><span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-cyan-400"/>Student portal</span></div>
        </div>
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-4 shadow-2xl">
          {photos[0]?<img src={photos[0].imageUrl} alt={photos[0].title} className="aspect-[4/3] w-full rounded-2xl object-cover"/>:<div className="flex aspect-[4/3] flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-blue-950 to-cyan-900 p-8 text-center"><GraduationCap className="h-16 w-16 text-cyan-300"/><p className="mt-5 text-2xl font-bold">Learn. Build. Grow.</p><p className="mt-3 text-slate-300">Practical digital skills for your next opportunity.</p></div>}
          <div className="flex items-center justify-between gap-3 px-2 pt-4 text-sm text-slate-200"><span>Discover the EDSEC learning experience</span><Link href="/gallery" className="font-bold text-cyan-300">View gallery →</Link></div>
        </div>
      </div>
    </section>
    <section className="mx-auto max-w-7xl px-6 py-20" id="courses">
      <div className="flex flex-wrap items-end justify-between gap-5"><div><p className="font-bold uppercase tracking-widest text-blue-700">Our courses</p><h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">Choose a practical learning path.</h2><p className="mt-3 max-w-2xl text-slate-600">Explore programs and find the skills you want to build.</p></div><Link href="/courses" className="font-bold text-blue-700">View all courses →</Link></div>
      {courses.length?<div className="mt-9 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{courses.map(course=><article key={course.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {course.imageUrl?<img src={course.imageUrl} alt={course.title} loading="lazy" className="aspect-video w-full object-cover"/>:<div className="flex aspect-video items-center justify-center bg-gradient-to-br from-blue-950 to-cyan-900"><BookOpen className="h-12 w-12 text-cyan-300"/></div>}
        <div className="p-6"><h3 className="text-xl font-bold">{course.title}</h3><p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">{course.shortDescription}</p><p className="mt-4 text-xs font-semibold text-slate-500">{[course.duration,course.learningFormat].filter(Boolean).join(" · ")}</p><Link href={`/courses/${course.slug}`} className="mt-5 inline-flex items-center gap-2 font-bold text-blue-700">View course <ArrowRight className="h-4 w-4"/></Link></div>
      </article>)}</div>:<div className="mt-9 rounded-2xl border border-slate-200 bg-slate-50 p-8 text-slate-600">Course listings are being updated. <Link href="/contact" className="font-bold text-blue-700">Ask about available training.</Link></div>}
    </section>
    <section className="bg-slate-50 px-6 py-20"><div className="mx-auto max-w-7xl"><p className="font-bold uppercase tracking-widest text-blue-700">Our solutions</p><h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">Technology that helps organizations grow.</h2><div className="mt-9 grid gap-6 md:grid-cols-3">{solutions.map((s,i)=><article key={s.title} className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm"><div className="grid h-12 w-12 place-items-center rounded-xl bg-blue-50 text-blue-700">{i===0?<GraduationCap/>:i===1?<Code2/>:<Users/>}</div><h3 className="mt-5 text-xl font-bold">{s.title}</h3><p className="mt-3 leading-7 text-slate-600">{s.description}</p><Link href={s.href} className="mt-6 inline-flex items-center gap-2 font-bold text-blue-700">{s.cta}<ArrowRight className="h-4 w-4"/></Link></article>)}</div></div></section>
    <section className="mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-2 lg:items-center"><div><p className="font-bold uppercase tracking-widest text-blue-700">Why EDSEC</p><h2 className="mt-4 text-3xl font-extrabold sm:text-4xl">Learn by doing, not just watching.</h2><p className="mt-5 leading-8 text-slate-600">Our focus is practical education, useful technology and supporting learners as they apply their skills to meaningful projects.</p><Link href="/about" className="mt-6 inline-flex font-bold text-blue-700">Learn about EDSEC →</Link></div><div className="grid gap-4">{benefits.map(b=><div key={b} className="flex items-start gap-3 rounded-xl border border-slate-200 p-5"><ShieldCheck className="h-6 w-6 shrink-0 text-blue-700"/><span className="font-semibold">{b}</span></div>)}</div></section>
    {photos.length>1&&<section className="bg-slate-50 px-6 py-20"><div className="mx-auto max-w-7xl"><div className="flex items-end justify-between gap-4"><h2 className="text-3xl font-extrabold">Inside EDSEC</h2><Link href="/gallery" className="font-bold text-blue-700">View all photos →</Link></div><div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{photos.map(p=><figure key={p.id} className="overflow-hidden rounded-2xl bg-white"><img src={p.imageUrl} alt={p.title} loading="lazy" className="aspect-video w-full object-cover"/><figcaption className="p-4 text-sm font-semibold">{p.title}</figcaption></figure>)}</div></div></section>}
    <section className="bg-slate-950 px-6 py-20 text-center text-white"><div className="mx-auto max-w-3xl"><h2 className="text-3xl font-extrabold sm:text-4xl">Ready to take the next step?</h2><p className="mt-5 text-lg text-slate-300">Start your learning journey or talk with our team about your next technology project.</p><div className="mt-8 flex flex-wrap justify-center gap-3"><Link href="/apply" className="rounded-xl bg-cyan-400 px-7 py-4 font-bold text-slate-950">Apply Now</Link><Link href="/contact" className="rounded-xl border border-white/30 px-7 py-4 font-bold">Contact EDSEC</Link><Link href="/school-management-system/demo" className="rounded-xl border border-white/30 px-7 py-4 font-bold">Try School Demo</Link></div></div></section>
  </main>;
}
