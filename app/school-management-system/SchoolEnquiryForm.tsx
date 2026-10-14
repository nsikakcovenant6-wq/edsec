"use client";
import {FormEvent,useState} from "react";
type Kind="school"|"consultation";
export default function SchoolEnquiryForm(){
 const [kind,setKind]=useState<Kind>("school");
 const [busy,setBusy]=useState(false);
 const [result,setResult]=useState<{ok:boolean;text:string}|null>(null);
 async function submit(e:FormEvent<HTMLFormElement>){
  e.preventDefault();if(busy)return;setBusy(true);setResult(null);
  const form=e.currentTarget;
  const values=Object.fromEntries(new FormData(form).entries());
  try{const response=await fetch("/api/school-enquiry",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({...values,kind})});const data=await response.json();if(!response.ok)throw Error(data.message||"Unable to send enquiry");setResult({ok:true,text:`Request received. Reference: ${data.reference}. EDSEC will contact you to discuss next steps.`});form.reset();}catch(error){setResult({ok:false,text:error instanceof Error?error.message:"Could not send enquiry."});}finally{setBusy(false);}
 }
 const input="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100";
 return <div className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl"><div className="flex border-b border-slate-200 bg-slate-50 p-3 gap-2"><button type="button" onClick={()=>{setKind("school");setResult(null);}} className={`flex-1 rounded-xl px-4 py-3 text-sm font-bold ${kind==="school"?"bg-blue-600 text-white":"text-slate-700 hover:bg-white"}`}>School platform enquiry</button><button type="button" onClick={()=>{setKind("consultation");setResult(null);}} className={`flex-1 rounded-xl px-4 py-3 text-sm font-bold ${kind==="consultation"?"bg-blue-600 text-white":"text-slate-700 hover:bg-white"}`}>Request consultation</button></div><form onSubmit={submit} className="grid gap-5 p-6 sm:grid-cols-2 sm:p-9">
 <label className="text-sm font-semibold">Your full name *<input name="name" required minLength={2} maxLength={100} autoComplete="name" className={input} placeholder="Your name"/></label>
 <label className="text-sm font-semibold">Email address *<input name="email" type="email" required maxLength={200} autoComplete="email" className={input} placeholder="you@school.com"/></label>
 <label className="text-sm font-semibold">Phone / WhatsApp *<input name="phone" type="tel" required minLength={7} maxLength={35} autoComplete="tel" className={input} placeholder="+234 ..."/></label>
 <label className="text-sm font-semibold">School / organisation *<input name="school" required minLength={2} maxLength={140} className={input} placeholder="Your school name"/></label>
 <label className="text-sm font-semibold">Country *<input name="country" required minLength={2} maxLength={80} className={input} placeholder="Nigeria"/></label>
 <label className="text-sm font-semibold">Approximate number of students<input name="students" maxLength={30} className={input} placeholder="e.g. 300"/></label>
 {kind==="consultation"&&<><label className="text-sm font-semibold">Preferred meeting date *<input name="date" type="date" min={new Date().toISOString().slice(0,10)} required className={input}/></label><label className="text-sm font-semibold">Preferred time *<input name="time" type="time" required className={input}/></label><label className="text-sm font-semibold sm:col-span-2">Your time zone *<select name="timezone" required defaultValue="Africa/Lagos (WAT)" className={input}><option>Africa/Lagos (WAT)</option><option>Europe/London</option><option>Europe/Paris</option><option>America/New_York</option><option>America/Los_Angeles</option><option>Asia/Dubai</option><option>Asia/Kolkata</option><option>Africa/Accra</option><option>Africa/Nairobi</option><option>Other (specify in requirements)</option></select></label></>}
 <label className="text-sm font-semibold sm:col-span-2">What would you like EDSEC to help with? *<textarea name="requirements" required minLength={10} maxLength={3000} rows={5} className={input} placeholder="Tell us about your school, your current challenges, or what you would like to see in a demonstration."/></label>
 <div className="hidden" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off"/></label></div>
 <div className="sm:col-span-2"><p className="mb-4 text-xs leading-5 text-slate-500">Your details will be used to respond to your request. Requested meeting times are subject to confirmation. Please do not include passwords or sensitive student records.</p><button disabled={busy} type="submit" className="w-full rounded-xl bg-blue-600 px-7 py-4 font-bold text-white hover:bg-blue-700 disabled:opacity-60">{busy?"Sending request...":kind==="school"?"Send school enquiry":"Request consultation time"}</button>{result&&<p role="status" className={`mt-4 rounded-xl p-4 text-sm font-semibold ${result.ok?"bg-emerald-50 text-emerald-800":"bg-red-50 text-red-800"}`}>{result.text}</p>}</div>
 </form></div>;
}