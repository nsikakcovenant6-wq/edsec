import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { saveService, deleteService } from "./actions";
export const dynamic="force-dynamic";

export default async function AdminServicesPage(){
 const user=await getCurrentUser();
 if(!user)redirect("/login");
 if(user.role!=="ADMIN")redirect("/");
 const services=await prisma.serviceOffering.findMany({orderBy:[{displayOrder:"asc"},{createdAt:"asc"}]});
 return <main className="min-h-screen bg-slate-50 px-5 py-10 text-slate-950"><div className="mx-auto max-w-6xl">
  <Link href="/admin" className="font-bold text-blue-700">← Admin dashboard</Link>
  <div className="mt-7 flex flex-wrap items-center justify-between gap-4"><div><h1 className="text-3xl font-extrabold">Manage Services</h1><p className="mt-2 text-slate-600">Edit, publish and organize services shown on the public website.</p></div><Link href="/services" target="_blank" className="rounded-xl bg-blue-700 px-5 py-3 font-semibold text-white">View public page ↗</Link></div>
  <section className="mt-8 rounded-2xl border border-blue-200 bg-blue-50 p-6"><h2 className="text-xl font-bold">Add a new service</h2><form action={saveService} className="mt-5 grid gap-4 sm:grid-cols-2">
   <label className="grid gap-1 text-sm font-semibold">Service title<input name="title" required minLength={3} maxLength={120} className="rounded-lg border p-3"/></label>
   <label className="grid gap-1 text-sm font-semibold">Display order<input name="displayOrder" type="number" min={0} max={10000} defaultValue={services.length} className="rounded-lg border p-3"/></label>
   <label className="grid gap-1 text-sm font-semibold sm:col-span-2">Description<textarea name="description" required minLength={15} maxLength={2000} rows={3} className="rounded-lg border p-3"/></label>
   <label className="grid gap-1 text-sm font-semibold sm:col-span-2">Features (one per line)<textarea name="features" maxLength={2500} rows={3} className="rounded-lg border p-3"/></label>
   <label className="grid gap-1 text-sm font-semibold sm:col-span-2">Image URL (HTTPS)<input name="imageUrl" type="url" placeholder="https://..." className="rounded-lg border p-3"/></label>
   <label className="flex items-center gap-2 font-semibold"><input type="checkbox" name="isPublished" defaultChecked/>Publish immediately</label>
   <button className="rounded-xl bg-blue-700 px-5 py-3 font-bold text-white">Add service</button>
  </form></section>
  <div className="mt-8 grid gap-6">{services.map(item=><article key={item.id} className="rounded-2xl border bg-white p-6 shadow-sm">
    <h2 className="mb-4 text-xl font-bold">{item.title} <span className="text-xs font-medium text-slate-500">{item.isPublished?"Published":"Draft"}</span></h2>
    <form action={saveService} className="grid gap-4 sm:grid-cols-2">
      <input type="hidden" name="id" value={item.id}/>
      <label className="grid gap-1 text-sm font-semibold">Title<input name="title" defaultValue={item.title} required minLength={3} maxLength={120} className="rounded-lg border p-3"/></label>
      <label className="grid gap-1 text-sm font-semibold">Display order<input name="displayOrder" type="number" min={0} max={10000} defaultValue={item.displayOrder} className="rounded-lg border p-3"/></label>
      <label className="grid gap-1 text-sm font-semibold sm:col-span-2">Description<textarea name="description" defaultValue={item.description} required minLength={15} maxLength={2000} rows={3} className="rounded-lg border p-3"/></label>
      <label className="grid gap-1 text-sm font-semibold sm:col-span-2">Features<textarea name="features" defaultValue={item.features} maxLength={2500} rows={3} className="rounded-lg border p-3"/></label>
      <label className="grid gap-1 text-sm font-semibold sm:col-span-2">Image URL<input name="imageUrl" type="url" defaultValue={item.imageUrl||""} className="rounded-lg border p-3"/></label>
      <label className="flex items-center gap-2 font-semibold"><input type="checkbox" name="isPublished" defaultChecked={item.isPublished}/>Published</label>
      <button className="rounded-xl bg-blue-700 px-5 py-3 font-bold text-white">Save changes</button>
    </form>
    <form action={deleteService} className="mt-5 flex flex-wrap items-center gap-3 border-t pt-5"><input type="hidden" name="id" value={item.id}/><label className="text-sm">Type <strong>{item.title}</strong> to delete <input name="confirmation" required className="ml-2 rounded-lg border p-2"/></label><button className="rounded-lg border border-red-300 px-4 py-2 font-semibold text-red-700">Delete service</button></form>
  </article>)}</div>
  {services.length===0&&<p className="mt-6 rounded-xl border bg-white p-6 text-slate-600">No custom services yet. The public page shows the standard EDSEC services until you publish custom entries.</p>}
 </div></main>;
}
