"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { prisma } from "@/app/lib/prisma";
import { requireRole } from "@/app/lib/auth";

function getString(formData: FormData, name: string) {
  const value = formData.get(name);

  return typeof value === "string" ? value.trim() : "";
}

function getOptionalString(formData: FormData, name: string) {
  const value = getString(formData, name);

  return value || null;
}

function getInt(formData: FormData, name: string) {
  const value = getString(formData, name);

  if (!value) {
    return 0;
  }

  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    return 0;
  }

  return Math.round(parsed);
}

function getBoolean(formData: FormData, name: string) {
  return getString(formData, name) === "true";
}

function validateImageUrl(imageUrl: string) {
  try {
    const url = new URL(imageUrl);

    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

export async function createGalleryItem(
  formData: FormData,
): Promise<void> {
  await requireRole("ADMIN");

  const title = getString(formData, "title");
  const description = getOptionalString(formData, "description");
  const imageUrl = getString(formData, "imageUrl");
  const category = getOptionalString(formData, "category");
  const displayOrder = getInt(formData, "displayOrder");
  const isPublished = getBoolean(formData, "isPublished");

  if (!title) {
    throw new Error("Gallery title is required.");
  }

  if (!imageUrl) {
    throw new Error("Image URL is required.");
  }

  if (!validateImageUrl(imageUrl)) {
    throw new Error("Please provide a valid image URL.");
  }

  if (displayOrder < 0) {
    throw new Error("Display order cannot be negative.");
  }

  const galleryItem = await prisma.galleryItem.create({
    data: {
      title,
      description,
      imageUrl,
      category,
      displayOrder,
      isPublished,
    },
  });

  revalidatePath("/admin/gallery");
  revalidatePath("/gallery");
  revalidatePath("/");

  redirect(`/admin/gallery/${galleryItem.id}`);
}

export async function updateGalleryItem(
  formData: FormData,
): Promise<void> {
  await requireRole("ADMIN");

  const id = getString(formData, "id");
  const title = getString(formData, "title");
  const description = getOptionalString(formData, "description");
  const imageUrl = getString(formData, "imageUrl");
  const category = getOptionalString(formData, "category");
  const displayOrder = getInt(formData, "displayOrder");
  const isPublished = getBoolean(formData, "isPublished");

  if (!id) {
    throw new Error("Gallery item ID is required.");
  }

  if (!title) {
    throw new Error("Gallery title is required.");
  }

  if (!imageUrl) {
    throw new Error("Image URL is required.");
  }

  if (!validateImageUrl(imageUrl)) {
    throw new Error("Please provide a valid image URL.");
  }

  if (displayOrder < 0) {
    throw new Error("Display order cannot be negative.");
  }

  const existing = await prisma.galleryItem.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
    },
  });

  if (!existing) {
    throw new Error("Gallery item not found.");
  }

  await prisma.galleryItem.update({
    where: {
      id,
    },
    data: {
      title,
      description,
      imageUrl,
      category,
      displayOrder,
      isPublished,
    },
  });

  revalidatePath("/admin/gallery");
  revalidatePath(`/admin/gallery/${id}`);
  revalidatePath("/gallery");
  revalidatePath("/");
}

export async function deleteGalleryItem(
  formData: FormData,
): Promise<void> {
  await requireRole("ADMIN");

  const id = getString(formData, "id");

  if (!id) {
    throw new Error("Gallery item ID is required.");
  }

  const existing = await prisma.galleryItem.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
    },
  });

  if (!existing) {
    throw new Error("Gallery item not found.");
  }

  await prisma.galleryItem.delete({
    where: {
      id,
    },
  });

  revalidatePath("/admin/gallery");
  revalidatePath("/gallery");
  revalidatePath("/");

  redirect("/admin/gallery");
}

export async function toggleGalleryPublished(
  formData: FormData,
): Promise<void> {
  await requireRole("ADMIN");

  const id = getString(formData, "id");

  if (!id) {
    throw new Error("Gallery item ID is required.");
  }

  const galleryItem = await prisma.galleryItem.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      isPublished: true,
    },
  });

  if (!galleryItem) {
    throw new Error("Gallery item not found.");
  }

  await prisma.galleryItem.update({
    where: {
      id,
    },
    data: {
      isPublished: !galleryItem.isPublished,
    },
  });

  revalidatePath("/admin/gallery");
  revalidatePath(`/admin/gallery/${id}`);
  revalidatePath("/gallery");
  revalidatePath("/");
}