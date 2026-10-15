"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";

async function requireAdmin() {
  const user=await getCurrentUser();
  if(!user || user.role!=="ADMIN") throw new Error("Administrator access required");
}

export async function saveService(formData:FormData) {
  await requireAdmin();
  const id=String(formData.get("id")||"").trim();
  const title=String(formData.get("title")||"").trim();
  const description=String(formData.get("description")||"").trim();
  const features=String(formData.get("features")||"").trim();
  const imageUrl=String(formData.get("imageUrl")||"").trim();
  const order=Number(formData.get("displayOrder")||0);
  if(title.length<3||title.length>120||description.length<15||description.length>2000||features.length>2500)throw new Error("Invalid service information");
  if(imageUrl && (!/^https:\/\//.test(imageUrl)||imageUrl.length>1000))throw new Error("Use an HTTPS image URL");
  if(!Number.isSafeInteger(order)||order<0||order>10000)throw new Error("Invalid display order");
  const data={title,description,features,imageUrl:imageUrl||null,displayOrder:order,isPublished:formData.get("isPublished")==="on"};
  if(id)await prisma.serviceOffering.update({where:{id},data});
  else await prisma.serviceOffering.create({data});
  revalidatePath("/admin/services");
  revalidatePath("/services");
}

export async function deleteService(formData:FormData) {
  await requireAdmin();
  const id=String(formData.get("id")||"");
  const confirmation=String(formData.get("confirmation")||"");
  const item=await prisma.serviceOffering.findUnique({where:{id},select:{title:true}});
  if(!item||confirmation!==item.title)throw new Error("Type the exact service title to confirm deletion");
  await prisma.serviceOffering.delete({where:{id}});
  revalidatePath("/admin/services");
  revalidatePath("/services");
}
