import Link from "next/link";
import { prisma } from "@/app/lib/prisma";

export const dynamic = "force-dynamic";
export const metadata = { title: "Blog & Technology Insights", description: "Read EDSEC ICT Institute updates, learning tips and practical technology articles." };

export default async function BlogPage({searchParams}:{searchParams:Promise<{q?:string}>}) {
  const {q} = await searchParams;
  const search=(q||"").trim().slice(0,80);
  const posts=await prisma.blogPost.findMany({
    where:{status:"PUBLISHED", ...(search?{OR:[{title:{contains:search,mode:"insensitive" as const}},{excerpt:{contains:search,mode:"insensitive" as const}}]}:{})},
    orderBy:[{publishedAt:"desc"},{createdAt:"desc"}],
    take:60,
    select:{id:true,title:true,slug:true,excerpt:true,category:true,coverImageUrl:true,authorName:true,publishedAt:true,createdAt:true},
  });
  return <main className="min-h-screen bg-slate-50 text-slate-950">
    <section className="bg-slate-950 px-6 py-20 text-white"><div className="mx-auto max-w-6xl">
      <p className="text-sm font-bold uppercase tracking-widest text-cyan-400">EDSEC Insights</p>
      <h1 className="mt-4 text-4xl font-bold sm:text-5xl">Ideas, news and practical technology guides.</h1>
      <p className="mt-5 max-w-2xl text-slate-300">Explore training insights, student resources and EDSEC updates.</p>
    </div></section>
    <section className="mx-auto max-w-6xl px-6 py-14">
      <form action="/blog" className="mb-9 flex flex-wrap gap-3">
        <label htmlFor="blog-search" className="sr-only">Search blog posts</label>
        <input id="blog-search" name="q" type="search" defaultValue={search} placeholder="Search articles" className="min-w-0 flex-1 rounded-xl border border-slate-300 bg-white px-4 py-3"/>
        <button className="rounded-xl bg-blue-700 px-5 py-3 font-bold text-white">Search</button>
        {search&&<Link href="/blog" className="self-center font-semibold text-blue-700">Clear</Link>}
      </form>
      {posts.length===0?<div className="rounded-2xl border bg-white p-10 text-center"><h2 className="text-xl font-bold">No articles found</h2><p className="mt-3 text-slate-600">{search?"Try another search term.":"New articles will appear here when published by EDSEC."}</p></div>:
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{posts.map(post=><article key={post.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {post.coverImageUrl&&<img src={post.coverImageUrl} alt={post.title} loading="lazy" className="aspect-video w-full object-cover"/>}
        <div className="p-6"><p className="text-xs font-bold uppercase tracking-wider text-blue-700">{post.category||"EDSEC Blog"}</p><h2 className="mt-3 text-xl font-bold"><Link href={`/blog/${post.slug}`} className="hover:text-blue-700">{post.title}</Link></h2>
        <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">{post.excerpt||"Read this article on EDSEC Insights."}</p>
        <p className="mt-4 text-xs text-slate-500">{post.authorName||"EDSEC Team"} · {(post.publishedAt||post.createdAt).toLocaleDateString("en-NG",{year:"numeric",month:"short",day:"numeric"})}</p>
        <Link href={`/blog/${post.slug}`} className="mt-5 inline-block font-bold text-blue-700">Read article →</Link></div>
      </article>)}</div>}
    </section>
  </main>;
}
