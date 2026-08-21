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

const announcementStatuses = [
  "DRAFT",
  "PUBLISHED",
  "ARCHIVED",
] as const;

type AnnouncementStatus = (typeof announcementStatuses)[number];

function isAnnouncementStatus(
  value: string,
): value is AnnouncementStatus {
  return announcementStatuses.includes(
    value as AnnouncementStatus,
  );
}

export async function createAnnouncement(
  formData: FormData,
): Promise<void> {
  const admin = await requireRole("ADMIN");

  if (!admin) {
    throw new Error("Unauthorized.");
  }

  const title = getString(formData, "title");
  const content = getString(formData, "content");
  const imageUrl = getOptionalString(formData, "imageUrl");
  const status =
    getString(formData, "status") || "DRAFT";

  if (!title) {
    throw new Error("Announcement title is required.");
  }

  if (!content) {
    throw new Error("Announcement content is required.");
  }

  if (!isAnnouncementStatus(status)) {
    throw new Error("Invalid announcement status.");
  }

  const publishedAt =
    status === "PUBLISHED"
      ? new Date()
      : null;

  const announcement =
    await prisma.announcement.create({
      data: {
        title,
        content,
        imageUrl,
        status,
        publishedAt,
        authorId: admin.id,
      },
    });

  revalidatePath("/admin/announcements");
  revalidatePath(
    `/admin/announcements/${announcement.id}`,
  );
  revalidatePath("/student/announcements");

  redirect(
    `/admin/announcements/${announcement.id}`,
  );
}

export async function updateAnnouncement(
  formData: FormData,
): Promise<void> {
  const admin = await requireRole("ADMIN");

  if (!admin) {
    throw new Error("Unauthorized.");
  }

  const id = getString(formData, "id");
  const title = getString(formData, "title");
  const content = getString(formData, "content");
  const imageUrl = getOptionalString(formData, "imageUrl");
  const status = getString(formData, "status");

  if (!id) {
    throw new Error("Announcement ID is required.");
  }

  if (!title) {
    throw new Error("Announcement title is required.");
  }

  if (!content) {
    throw new Error("Announcement content is required.");
  }

  if (!isAnnouncementStatus(status)) {
    throw new Error("Invalid announcement status.");
  }

  const existing =
    await prisma.announcement.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        status: true,
        publishedAt: true,
      },
    });

  if (!existing) {
    throw new Error("Announcement not found.");
  }

  let publishedAt = existing.publishedAt;

  if (
    status === "PUBLISHED" &&
    !existing.publishedAt
  ) {
    publishedAt = new Date();
  }

  if (status !== "PUBLISHED") {
    publishedAt = null;
  }

  await prisma.announcement.update({
    where: {
      id,
    },
    data: {
      title,
      content,
      imageUrl,
      status,
      publishedAt,
      authorId: admin.id,
    },
  });

  revalidatePath("/admin/announcements");
  revalidatePath(
    `/admin/announcements/${id}`,
  );
  revalidatePath("/student/announcements");
}

export async function deleteAnnouncement(
  formData: FormData,
): Promise<void> {
  await requireRole("ADMIN");

  const id = getString(formData, "id");

  if (!id) {
    throw new Error("Announcement ID is required.");
  }

  const announcement =
    await prisma.announcement.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
      },
    });

  if (!announcement) {
    throw new Error("Announcement not found.");
  }

  await prisma.announcement.delete({
    where: {
      id,
    },
  });

  revalidatePath("/admin/announcements");
  revalidatePath("/student/announcements");

  redirect("/admin/announcements");
}

export async function updateAnnouncementStatus(
  formData: FormData,
): Promise<void> {
  await requireRole("ADMIN");

  const id = getString(formData, "id");
  const status = getString(formData, "status");

  if (!id) {
    throw new Error("Announcement ID is required.");
  }

  if (!isAnnouncementStatus(status)) {
    throw new Error("Invalid announcement status.");
  }

  const existing =
    await prisma.announcement.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        publishedAt: true,
      },
    });

  if (!existing) {
    throw new Error("Announcement not found.");
  }

  let publishedAt = existing.publishedAt;

  if (
    status === "PUBLISHED" &&
    !publishedAt
  ) {
    publishedAt = new Date();
  }

  if (status !== "PUBLISHED") {
    publishedAt = null;
  }

  await prisma.announcement.update({
    where: {
      id,
    },
    data: {
      status,
      publishedAt,
    },
  });

  revalidatePath("/admin/announcements");
  revalidatePath(
    `/admin/announcements/${id}`,
  );
  revalidatePath("/student/announcements");
}