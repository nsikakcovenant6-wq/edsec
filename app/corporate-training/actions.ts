"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/app/lib/prisma";

export async function submitCorporateInquiry(formData: FormData) {
  const organization = String(
    formData.get("organization") ?? "",
  ).trim();

  const contactName = String(
    formData.get("contactName") ?? "",
  ).trim();

  const email = String(
    formData.get("email") ?? "",
  ).trim();

  const phone = String(
    formData.get("phone") ?? "",
  ).trim();

  const organizationType = String(
    formData.get("organizationType") ?? "",
  ).trim();

  const trainingNeeds = String(
    formData.get("trainingNeeds") ?? "",
  ).trim();

  const preferredFormat = String(
    formData.get("preferredFormat") ?? "",
  ).trim();

  const message = String(
    formData.get("message") ?? "",
  ).trim();

  if (!organization) {
    throw new Error("Organization name is required.");
  }

  if (!contactName) {
    throw new Error("Contact person is required.");
  }

  if (!email) {
    throw new Error("Email is required.");
  }

  if (!trainingNeeds) {
    throw new Error("Training needs are required.");
  }

  await prisma.corporateInquiry.create({
    data: {
      organization,
      contactName,
      email,
      phone: phone || null,
      organizationType: organizationType || null,
      trainingNeeds,
      preferredFormat: preferredFormat || null,
      message: message || null,
      status: "NEW",
    },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/corporate-training");
}