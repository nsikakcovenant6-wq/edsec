import { NextResponse } from "next/server";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import crypto from "crypto";

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100 MB

const ALLOWED_TYPES = new Set([
  // Images
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",

  // Videos
  "video/mp4",
  "video/webm",
  "video/quicktime",

  // Documents
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",

  // Archives
  "application/zip",
  "application/x-zip-compressed",

  // Text
  "text/plain",
]);

function getExtension(fileName: string) {
  const extension = path.extname(fileName).toLowerCase();

  return extension || "";
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          success: false,
          message: "No file was uploaded.",
        },
        { status: 400 },
      );
    }

    if (file.size === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "The uploaded file is empty.",
        },
        { status: 400 },
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          success: false,
          message: "File is too large. Maximum size is 100 MB.",
        },
        { status: 400 },
      );
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json(
        {
          success: false,
          message: `File type "${file.type || "unknown"}" is not supported.`,
        },
        { status: 400 },
      );
    }

    const uploadDirectory = path.join(
      process.cwd(),
      "public",
      "uploads",
    );

    await mkdir(uploadDirectory, {
      recursive: true,
    });

    const extension = getExtension(file.name);

    const uniqueName = `${Date.now()}-${crypto.randomUUID()}${extension}`;

    const filePath = path.join(
      uploadDirectory,
      uniqueName,
    );

    const bytes = await file.arrayBuffer();

    const buffer = Buffer.from(bytes);

    await writeFile(filePath, buffer);

    const url = `/uploads/${uniqueName}`;

    return NextResponse.json({
      success: true,
      url,
      fileName: uniqueName,
      originalName: file.name,
      mimeType: file.type,
      size: file.size,
    });
  } catch (error) {
    console.error("UPLOAD ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to upload file.",
      },
      { status: 500 },
    );
  }
}