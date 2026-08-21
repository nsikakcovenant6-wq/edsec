"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { prisma } from "@/app/lib/prisma";
import { requireRole } from "@/app/lib/auth";

function getString(formData: FormData, name: string): string {
  const value = formData.get(name);

  return typeof value === "string" ? value.trim() : "";
}

function getOptionalString(
  formData: FormData,
  name: string,
): string | null {
  const value = getString(formData, name);

  return value || null;
}

function getOptionalDate(
  formData: FormData,
  name: string,
): Date | null {
  const value = getString(formData, name);

  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
}

const blogStatuses = [
  "DRAFT",
  "PUBLISHED",
  "ARCHIVED",
] as const;

type BlogStatus = (typeof blogStatuses)[number];

function isBlogStatus(value: string): value is BlogStatus {
  return blogStatuses.includes(value as BlogStatus);
}

function createSlug(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

async function getUniqueSlug(
  title: string,
  existingId?: string,
): Promise<string> {
  const baseSlug = createSlug(title) || `post-${Date.now()}`;

  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const existing = await prisma.blogPost.findFirst({
      where: {
        slug,
        ...(existingId
          ? {
              NOT: {
                id: existingId,
              },
            }
          : {}),
      },
      select: {
        id: true,
      },
    });

    if (!existing) {
      return slug;
    }

    counter += 1;
    slug = `${baseSlug}-${counter}`;
  }
}

export async function createBlogPost(
  formData: FormData,
): Promise<void> {
  await requireRole("ADMIN");

  const title = getString(formData, "title");
  const content = getString(formData, "content");
  const excerpt = getOptionalString(formData, "excerpt");
  const coverImageUrl = getOptionalString(
    formData,
    "coverImageUrl",
  );
  const authorName = getOptionalString(
    formData,
    "authorName",
  );
  const category = getOptionalString(formData, "category");
  const statusValue =
    getString(formData, "status") || "DRAFT";
  const publishedAt = getOptionalDate(
    formData,
    "publishedAt",
  );

  if (!title) {
    throw new Error("Blog post title is required.");
  }

  if (!content) {
    throw new Error("Blog post content is required.");
  }

  if (!isBlogStatus(statusValue)) {
    throw new Error("Invalid blog post status.");
  }

  const slug = await getUniqueSlug(title);

  const finalPublishedAt =
    statusValue === "PUBLISHED"
      ? publishedAt ?? new Date()
      : publishedAt;

  const post = await prisma.blogPost.create({
    data: {
      title,
      slug,
      excerpt,
      content,
      coverImageUrl,
      authorName,
      category,
      status: statusValue,
      publishedAt: finalPublishedAt,
    },
  });

  revalidatePath("/admin/blog");
  revalidatePath("/blog");

  if (statusValue === "PUBLISHED") {
    revalidatePath(`/blog/${post.slug}`);
  }

  redirect(`/admin/blog/${post.id}`);
}

export async function updateBlogPost(
  formData: FormData,
): Promise<void> {
  await requireRole("ADMIN");

  const id = getString(formData, "id");
  const title = getString(formData, "title");
  const content = getString(formData, "content");
  const excerpt = getOptionalString(formData, "excerpt");
  const coverImageUrl = getOptionalString(
    formData,
    "coverImageUrl",
  );
  const authorName = getOptionalString(
    formData,
    "authorName",
  );
  const category = getOptionalString(formData, "category");
  const statusValue = getString(formData, "status");
  const publishedAt = getOptionalDate(
    formData,
    "publishedAt",
  );

  if (!id) {
    throw new Error("Blog post ID is required.");
  }

  if (!title) {
    throw new Error("Blog post title is required.");
  }

  if (!content) {
    throw new Error("Blog post content is required.");
  }

  if (!isBlogStatus(statusValue)) {
    throw new Error("Invalid blog post status.");
  }

  const existing = await prisma.blogPost.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      slug: true,
    },
  });

  if (!existing) {
    throw new Error("Blog post not found.");
  }

  const slug = await getUniqueSlug(title, id);

  const finalPublishedAt =
    statusValue === "PUBLISHED"
      ? publishedAt ?? new Date()
      : publishedAt;

  await prisma.blogPost.update({
    where: {
      id,
    },
    data: {
      title,
      slug,
      excerpt,
      content,
      coverImageUrl,
      authorName,
      category,
      status: statusValue,
      publishedAt: finalPublishedAt,
    },
  });

  revalidatePath("/admin/blog");
  revalidatePath(`/admin/blog/${id}`);
  revalidatePath("/blog");
  revalidatePath(`/blog/${existing.slug}`);
  revalidatePath(`/blog/${slug}`);
}

export async function deleteBlogPost(
  formData: FormData,
): Promise<void> {
  await requireRole("ADMIN");

  const id = getString(formData, "id");

  if (!id) {
    throw new Error("Blog post ID is required.");
  }

  const post = await prisma.blogPost.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      slug: true,
    },
  });

  if (!post) {
    throw new Error("Blog post not found.");
  }

  await prisma.blogPost.delete({
    where: {
      id,
    },
  });

  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  revalidatePath(`/blog/${post.slug}`);

  redirect("/admin/blog");
}

export async function updateBlogPostStatus(
  formData: FormData,
): Promise<void> {
  await requireRole("ADMIN");

  const id = getString(formData, "id");
  const statusValue = getString(formData, "status");

  if (!id) {
    throw new Error("Blog post ID is required.");
  }

  if (!isBlogStatus(statusValue)) {
    throw new Error("Invalid blog post status.");
  }

  const post = await prisma.blogPost.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      slug: true,
      publishedAt: true,
    },
  });

  if (!post) {
    throw new Error("Blog post not found.");
  }

  await prisma.blogPost.update({
    where: {
      id,
    },
    data: {
      status: statusValue,
      publishedAt:
        statusValue === "PUBLISHED"
          ? post.publishedAt ?? new Date()
          : post.publishedAt,
    },
  });

  revalidatePath("/admin/blog");
  revalidatePath(`/admin/blog/${id}`);
  revalidatePath("/blog");
  revalidatePath(`/blog/${post.slug}`);
}