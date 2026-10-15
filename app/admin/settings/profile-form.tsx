"use client";
/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import { updateAdminProfile } from "./actions";

export default function AdminProfileForm({firstName,lastName,avatarUrl:initialAvatar}:{firstName:string;lastName:string;avatarUrl:string}) {
  const [avatarUrl,setAvatarUrl]=useState(initialAvatar);
  const [uploading,setUploading]=useState(false);
  const [error,setError]=useState("");
  async function uploadPhoto(event:React.ChangeEvent<HTMLInputElement>) {
    const file=event.target.files?.[0];
    if(!file)return;
    setError("");
    if(!["image/jpeg","image/png","image/webp"].includes(file.type)||file.size>5*1024*1024){
      setError("Choose a JPG, PNG or WebP picture smaller than 5 MB.");return;
    }
    setUploading(true);
    try {
      const body=new FormData();body.append("file",file);
      const response=await fetch("/api/gallery/upload",{method:"POST",body});
      const result=await response.json();
      if(!response.ok||!result.success||!result.url)throw new Error(result.message||"Photo upload failed.");
      setAvatarUrl(result.url);
    } catch(e) {setError(e instanceof Error?e.message:"Photo upload failed.");}
    finally {setUploading(false);event.target.value="";}
  }
  return <form action={updateAdminProfile} className="mt-8 space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
    <div>
      <h2 className="text-xl font-bold">Profile picture</h2>
      <p className="mt-1 text-sm text-slate-500">Choose a photo, then save your changes to display it on the dashboard.</p>
      <div className="mt-5 flex flex-wrap items-center gap-5">
        {avatarUrl?<img src={avatarUrl} alt="Administrator profile" className="h-24 w-24 rounded-full border object-cover"/>:<div className="grid h-24 w-24 place-items-center rounded-full bg-blue-100 text-3xl font-bold text-blue-700">{firstName.charAt(0).toUpperCase()||"A"}</div>}
        <div className="space-y-3">
          <label className="block text-sm font-semibold">Upload a photo<input type="file" accept="image/jpeg,image/png,image/webp" onChange={uploadPhoto} disabled={uploading} className="mt-2 block w-full max-w-xs text-sm"/></label>
          <p className="text-xs text-slate-500">JPG, PNG or WebP · Max 5 MB</p>
          {avatarUrl&&<button type="button" onClick={()=>setAvatarUrl("")} className="text-sm font-semibold text-red-700">Remove picture</button>}
        </div>
      </div>
      <input type="hidden" name="avatarUrl" value={avatarUrl}/>
      {uploading&&<p role="status" className="mt-3 text-sm text-blue-700">Uploading photo…</p>}
      {error&&<p role="alert" className="mt-3 text-sm text-red-700">{error}</p>}
    </div>
    <div className="grid gap-5 border-t border-slate-100 pt-6 sm:grid-cols-2">
      <label className="text-sm font-semibold">First name<input name="firstName" defaultValue={firstName} required maxLength={80} className="mt-2 w-full rounded-xl border border-slate-300 p-3"/></label>
      <label className="text-sm font-semibold">Last name<input name="lastName" defaultValue={lastName} required maxLength={80} className="mt-2 w-full rounded-xl border border-slate-300 p-3"/></label>
    </div>
    <button type="submit" disabled={uploading} className="rounded-xl bg-blue-600 px-6 py-3 font-bold text-white hover:bg-blue-700 disabled:opacity-50">Save changes</button>
  </form>;
}
