import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/app/lib/prisma";

export const dynamic="force-dynamic";

export default async function BlogArticle({params}:{params:Promise<{slug:string}>}) {
  const {slug}=await params;
  const post=await prisma.blogPost.findFirst({where:{slug,status:"PUBLISHED"}});
  if(!post)notFound();
  const related=await prisma.blogPost.findMany({where:{status:"PUBLISHED",id:{not:post.id},...(post.category?{category:post.category}:{})},orderBy:{publishedAt:"desc"},take:3,select:{id:true,title:true,slug:true}});
  return <main className="min-h-screen bg-white text-slate-950">
    <article className="mx-auto max-w-3xl px-6 py-16">
      <Link href="/blog" className="font-semibold text-blue-700">← All articles</Link>
      <p className="mt-10 text-sm font-bold uppercase tracking-widest text-blue-700">{post.category||"EDSEC Insights"}</p>
      <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">{post.title}</h1>
      <p className="mt-5 text-sm text-slate-500">{post.authorName||"EDSEC Team"} · {(post.publishedAt||post.createdAt).toLocaleDateString("en-NG",{day:"numeric",month:"long",year:"numeric"})}</p>
      {post.coverImageUrl&&<img src={post.coverImageUrl} alt={post.title} className="mt-8 aspect-video w-full rounded-2xl object-cover"/>}
      {post.excerpt&&<p className="mt-8 text-xl leading-8 text-slate-600">{post.excerpt}</p>}
      <div className="mt-8 whitespace-pre-wrap break-words text-base leading-8 text-slate-800">{post.content}</div>
    </article>
    {related.length>0&&<aside className="mx-auto max-w-3xl border-t border-slate-200 px-6 py-12"><h2 className="text-2xl font-bold">Related articles</h2><div className="mt-5 grid gap-3">{related.map(item=><Link key={item.id} href={`/blog/${item.slug}`} className="rounded-xl border border-slate-200 p-4 font-semibold text-blue-700 hover:bg-blue-50">{item.title} →</Link>)}</div></aside>}
    <div className="mx-auto max-w-3xl px-6 pb-16"><Link href="/courses" className="inline-flex rounded-xl bg-blue-700 px-6 py-3 font-bold text-white">Explore EDSEC courses</Link></div>
  </main>;
}
