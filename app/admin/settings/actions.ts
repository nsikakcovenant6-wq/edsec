"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";

export async function updateAdminProfile(formData: FormData) {
  const admin = await requireAdmin();
  const firstName = String(formData.get("firstName") ?? "").trim();
  const lastName = String(formData.get("lastName") ?? "").trim();
  const avatarUrl = String(formData.get("avatarUrl") ?? "").trim();
  if (!firstName || !lastName || firstName.length > 80 || lastName.length > 80) {
    throw new Error("Enter a valid first and last name.");
  }
  if (avatarUrl) {
    const base = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
    if (!base || !avatarUrl.startsWith(base + "/storage/v1/object/public/edsec-gallery/") || avatarUrl.length > 1500) {
      throw new Error("Upload a profile picture using the EDSEC uploader.");
    }
  }
  await prisma.user.update({ where: { id: admin.id }, data: { firstName, lastName, avatarUrl: avatarUrl || null } });
  revalidatePath("/admin");
  revalidatePath("/admin/settings");
  redirect("/admin/settings?updated=1");
}
