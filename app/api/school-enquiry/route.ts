import { NextResponse } from "next/server";
import { z } from "zod";
import { sendEdsecEmail } from "@/app/lib/email";
import { randomUUID } from "node:crypto";
export const runtime="nodejs";
const schema=z.object({
 kind:z.enum(["school","consultation"]),
 audience:z.enum(["school","business","other"]).optional().default("school"),
 meetingMode:z.enum(["online","physical"]).optional().default("online"),
 meetingLocation:z.string().trim().max(300).optional().default(""),
 name:z.string().trim().min(2).max(100),
 email:z.email().max(200),
 phone:z.string().trim().min(7).max(35),
 school:z.string().trim().min(2).max(140),
 country:z.string().trim().min(2).max(80),
 students:z.string().trim().max(30).optional().default(""),
 requirements:z.string().trim().min(10).max(3000),
 date:z.string().max(10).optional().default(""),
 time:z.string().max(5).optional().default(""),
 timezone:z.string().max(70).optional().default(""),
 website:z.string().max(100).optional().default("")
});
const clean=(s:string)=>s.replace(/[\r\n]+/g," ").trim();
export async function POST(request:Request){
 try{
  const origin=request.headers.get("origin");
  const host=request.headers.get("host");
  if(origin&&host){try{if(new URL(origin).host!==host)return NextResponse.json({message:"Request origin not allowed."},{status:403});}catch{return NextResponse.json({message:"Invalid origin."},{status:403});}}
  if(Number(request.headers.get("content-length")||0)>12000)return NextResponse.json({message:"Request too large."},{status:413});
  const data=schema.safeParse(await request.json());
  if(!data.success)return NextResponse.json({message:"Please check the required fields."},{status:400});
  const v=data.data;
  if(v.website)return NextResponse.json({success:true,message:"Thank you for your enquiry."});
  if(v.kind==="consultation"&&(!/^\d{4}-\d{2}-\d{2}$/.test(v.date)||!/^([01]\d|2[0-3]):[0-5]\d$/.test(v.time)||!v.timezone))return NextResponse.json({message:"Please provide your preferred meeting date, time and timezone."},{status:400});
  if(v.kind==="consultation"&&new Date(v.date+"T23:59:59Z").getTime()<Date.now())return NextResponse.json({message:"Please choose a future meeting date."},{status:400});
  const id=randomUUID().slice(0,8).toUpperCase();
  const lines=[`Reference: EDSEC-${id}`,`Type: ${v.kind==="school"?"School platform enquiry":"Consultation request"}`,`Client category: ${clean(v.audience)}`,`Meeting format: ${clean(v.meetingMode)}`,`Meeting location: ${clean(v.meetingLocation||"To be arranged")}`,`Name: ${clean(v.name)}`,`Email: ${clean(v.email)}`,`Phone: ${clean(v.phone)}`,`School/organisation: ${clean(v.school)}`,`Country: ${clean(v.country)}`,`Students: ${clean(v.students||"Not specified")}`,`Preferred date: ${clean(v.date||"Not specified")}`,`Preferred time: ${clean(v.time||"Not specified")}`,`Timezone: ${clean(v.timezone||"Not specified")}`,`Requirements:\n${v.requirements}`];
  const result=await sendEdsecEmail({to:process.env.EDSEC_ENQUIRY_TO||"edseceducation@gmail.com",subject:`[EDSEC-${id}] ${v.kind==="school"?"School platform enquiry":"Consultation request"} — ${clean(v.school)}`,text:lines.join("\n"),html:`<pre style="font:14px/1.6 Arial,sans-serif;white-space:pre-wrap">${lines.join("\n").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}</pre>`});
  if(!result.sent)return NextResponse.json({message:"Online enquiries are temporarily unavailable. Please contact EDSEC via WhatsApp or email."},{status:503});
  return NextResponse.json({success:true,reference:`EDSEC-${id}`,message:"Your request was sent to EDSEC. A consultation time is a preference, not a confirmed booking."});
 }catch(error){console.error("EDSEC_ENQUIRY_FAILED",error);return NextResponse.json({message:"We could not send your request. Please try again or contact EDSEC directly."},{status:500});}
}