/* eslint-disable @next/next/no-img-element */
"use client";

import { useRef, useState } from "react";

import { supabase } from "@/app/lib/supabase/client";

const BUCKET_NAME = "edsec-gallery";
const MAX_FILE_SIZE = 10 * 1024 * 1024;

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

type GalleryImageUploadProps = {
  value?: string;
  onChange: (url: string) => void;
};

export default function GalleryImageUpload({
  value,
  onChange,
}: GalleryImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [fileName, setFileName] = useState("");
  const [preview, setPreview] = useState(value || "");
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function handleFileChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setError("");
    setMessage("");

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError(
        "Please select a JPG, PNG, WEBP, or GIF image.",
      );

      event.target.value = "";
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError("Image is too large. Maximum size is 10 MB.");

      event.target.value = "";
      return;
    }

    setFileName(file.name);

    const objectUrl = URL.createObjectURL(file);

    setPreview(objectUrl);
  }

  async function uploadImage() {
    const file = inputRef.current?.files?.[0];

    if (!file) {
      setError("Please choose an image first.");
      return;
    }

    setUploading(true);
    setError("");
    setMessage("");

    try {
      const extension =
        file.name.split(".").pop()?.toLowerCase() || "jpg";

      const uniqueName = `${crypto.randomUUID()}.${extension}`;

      const filePath = `gallery/${uniqueName}`;

      const { error: uploadError } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
          contentType: file.type,
        });

      if (uploadError) {
        throw new Error(uploadError.message);
      }

      const {
        data: { publicUrl },
      } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(filePath);

      if (!publicUrl) {
        throw new Error(
          "The image was uploaded, but a public URL could not be generated.",
        );
      }

      onChange(publicUrl);
      setPreview(publicUrl);
      setMessage("Image uploaded successfully.");
    } catch (error) {
      console.error("Gallery upload error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Unable to upload image.",
      );
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <label
          htmlFor="gallery-image"
          className="mb-2 block text-sm font-semibold text-slate-700"
        >
          Gallery Image
        </label>

        <input
          ref={inputRef}
          id="gallery-image"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={handleFileChange}
          className="sr-only"
        />

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Choose Image
          </button>

          <button
            type="button"
            onClick={uploadImage}
            disabled={uploading || !fileName}
            className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {uploading ? "Uploading..." : "Upload Image"}
          </button>
        </div>

        {fileName && (
          <p className="mt-2 text-xs text-slate-500">
            Selected: {fileName}
          </p>
        )}

        <p className="mt-2 text-xs text-slate-400">
          JPG, PNG, WEBP or GIF. Maximum size: 10 MB.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {message && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {message}
        </div>
      )}

      {preview && (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
          <div className="aspect-video w-full">
            <img
              src={preview}
              alt="Gallery preview"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      )}

      <input
        type="hidden"
        name="imageUrl"
        value={value || ""}
        readOnly
      />
    </div>
  );
}