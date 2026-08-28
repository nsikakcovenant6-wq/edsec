import { NextResponse } from "next/server";

import { requireRole } from "@/app/lib/auth";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

const BUCKET_NAME = "edsec-gallery";

function getSupabaseConfig() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL is not configured.",
    );
  }

  if (!publishableKey) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY is not configured.",
    );
  }

  return {
    supabaseUrl: supabaseUrl.replace(/\/$/, ""),
    publishableKey,
  };
}

function getExtension(fileName: string) {
  const lastDot = fileName.lastIndexOf(".");

  if (lastDot === -1) {
    return "";
  }

  return fileName.slice(lastDot).toLowerCase();
}

function sanitizeFileName(fileName: string) {
  return fileName
    .replace(/[^a-zA-Z0-9._-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function POST(request: Request) {
  try {
    /*
     * Only administrators can upload Gallery images.
     */
    await requireRole("ADMIN");

    const formData = await request.formData();

    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          success: false,
          message: "No image was uploaded.",
        },
        { status: 400 },
      );
    }

    if (file.size === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "The uploaded image is empty.",
        },
        { status: 400 },
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Image is too large. Maximum image size is 10 MB.",
        },
        { status: 400 },
      );
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Unsupported image type. Please upload JPG, PNG, WEBP or GIF.",
        },
        { status: 400 },
      );
    }

    const { supabaseUrl, publishableKey } =
      getSupabaseConfig();

    const extension = getExtension(file.name);

    const safeOriginalName = sanitizeFileName(
      file.name.replace(extension, ""),
    );

    const uniqueName = `${Date.now()}-${cryptoRandomId()}-${safeOriginalName || "gallery-image"}${extension}`;

    /*
     * Store images inside:
     *
     * edsec-gallery/gallery/
     */
    const storagePath = `gallery/${uniqueName}`;

    const uploadUrl =
      `${supabaseUrl}/storage/v1/object/` +
      `${BUCKET_NAME}/${encodeURIComponent(storagePath)}`;

    const bytes = await file.arrayBuffer();

    const uploadResponse = await fetch(uploadUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${publishableKey}`,
        apikey: publishableKey,
        "Content-Type": file.type,
        "x-upsert": "false",
      },
      body: bytes,
      cache: "no-store",
    });

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();

      console.error(
        "SUPABASE STORAGE ERROR:",
        uploadResponse.status,
        errorText,
      );

      return NextResponse.json(
        {
          success: false,
          message:
            "Supabase Storage rejected the image upload. Check your Storage policies and bucket configuration.",
        },
        { status: 500 },
      );
    }

    /*
     * This works because the edsec-gallery bucket
     * is configured as a public bucket.
     */
    const publicUrl =
      `${supabaseUrl}/storage/v1/object/public/` +
      `${BUCKET_NAME}/${storagePath}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      path: storagePath,
      originalName: file.name,
      mimeType: file.type,
      size: file.size,
    });
  } catch (error) {
    console.error("GALLERY UPLOAD ERROR:", error);

    const message =
      error instanceof Error
        ? error.message
        : "Unable to upload gallery image.";

    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status: 500 },
    );
  }
}

function cryptoRandomId() {
  return Math.random()
    .toString(36)
    .slice(2, 10);
}