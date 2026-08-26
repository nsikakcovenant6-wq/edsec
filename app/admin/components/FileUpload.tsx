/* eslint-disable @next/next/no-img-element */
"use client";

import {
  CheckCircle2,
  File,
  ImageIcon,
  Loader2,
  Upload,
  Video,
  X,
} from "lucide-react";
import { useRef, useState } from "react";

type FileUploadProps = {
  name: string;
  accept?: string;
  label?: string;
  description?: string;
  currentUrl?: string | null;
  onUploaded?: (url: string) => void;
};

export default function FileUpload({
  name,
  accept = "image/*",
  label = "Upload file",
  description = "Choose a file from your computer.",
  currentUrl = null,
  onUploaded,
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState(
    currentUrl ?? "",
  );
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");

  async function handleFileChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setError("");
    setUploading(true);

    try {
      const formData = new FormData();

      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Upload failed.",
        );
      }

      setUploadedUrl(result.url);
      setFileName(result.name);

      onUploaded?.(result.url);
    } catch (error) {
      console.error("FILE UPLOAD ERROR:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Unable to upload file.",
      );
    } finally {
      setUploading(false);
    }
  }

  function clearFile() {
    setUploadedUrl("");
    setFileName("");
    setError("");

    if (inputRef.current) {
      inputRef.current.value = "";
    }

    onUploaded?.("");
  }

  const isImage =
    uploadedUrl &&
    /\.(jpg|jpeg|png|webp|gif)$/i.test(uploadedUrl);

  const isVideo =
    uploadedUrl &&
    /\.(mp4|webm|mov)$/i.test(uploadedUrl);

  return (
    <div>
      <input
        type="hidden"
        name={name}
        value={uploadedUrl}
        readOnly
      />

      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </label>

      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5">
        {!uploadedUrl ? (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="flex w-full flex-col items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-10 text-center transition hover:border-blue-300 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {uploading ? (
              <>
                <Loader2
                  size={30}
                  className="animate-spin text-blue-600"
                />

                <p className="mt-3 text-sm font-bold text-slate-800">
                  Uploading...
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Please wait while the file is uploaded.
                </p>
              </>
            ) : (
              <>
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-blue-50 text-blue-600">
                  <Upload size={22} />
                </div>

                <p className="mt-4 text-sm font-bold text-slate-800">
                  Click to upload
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  {description}
                </p>
              </>
            )}
          </button>
        ) : (
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            {isImage && (
              <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
                <img
                  src={uploadedUrl}
                  alt={fileName || "Uploaded file"}
                  className="h-full w-full object-cover"
                />
              </div>
            )}

            <div className="flex items-center gap-3 p-4">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-green-50 text-green-600">
                {isImage ? (
                  <ImageIcon size={19} />
                ) : isVideo ? (
                  <Video size={19} />
                ) : (
                  <File size={19} />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-slate-800">
                  {fileName || "File uploaded"}
                </p>

                <p className="mt-0.5 flex items-center gap-1 text-xs font-medium text-green-600">
                  <CheckCircle2 size={13} />
                  Uploaded successfully
                </p>
              </div>

              <button
                type="button"
                onClick={clearFile}
                className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                title="Remove file"
              >
                <X size={17} />
              </button>
            </div>
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {error && (
        <p className="mt-2 rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-600">
          {error}
        </p>
      )}

      <p className="mt-2 text-xs text-slate-400">
        Maximum file size: 100MB.
      </p>
    </div>
  );
}