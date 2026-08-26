/* eslint-disable @next/next/no-img-element */
"use client";

import {
  CheckCircle2,
  FileText,
  Image as ImageIcon,
  Loader2,
  Upload,
  Video,
  X,
} from "lucide-react";
import { useRef, useState } from "react";

type MediaType = "image" | "video" | "file";

type MediaUploadProps = {
  name: string;
  type?: MediaType;
  value?: string;
  label?: string;
  description?: string;
  required?: boolean;
  onChange?: (url: string) => void;
};

export default function MediaUpload({
  name,
  type = "file",
  value = "",
  label = "Upload File",
  description,
  required = false,
  onChange,
}: MediaUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [url, setUrl] = useState(value);
  const [fileName, setFileName] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const accept =
    type === "image"
      ? "image/jpeg,image/png,image/webp,image/gif"
      : type === "video"
        ? "video/mp4,video/webm,video/quicktime"
        : ".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip,.txt";

  function updateValue(newUrl: string) {
    setUrl(newUrl);
    onChange?.(newUrl);
  }

  async function handleFileChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setError("");
    setUploading(true);
    setFileName(file.name);

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

      updateValue(result.url);
    } catch (uploadError) {
      console.error(uploadError);

      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "Unable to upload file.",
      );

      setFileName("");
      updateValue("");
    } finally {
      setUploading(false);

      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  }

  function removeFile() {
    setFileName("");
    updateValue("");
    setError("");
  }

  const Icon =
    type === "image"
      ? ImageIcon
      : type === "video"
        ? Video
        : FileText;

  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
        {required && (
          <span className="ml-1 text-red-500">*</span>
        )}
      </label>

      {description && (
        <p className="mb-3 text-xs leading-5 text-slate-500">
          {description}
        </p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
        required={required && !url}
      />

      {!url ? (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex w-full items-center justify-center gap-3 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 px-5 py-8 text-center transition hover:border-blue-400 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {uploading ? (
            <>
              <Loader2
                size={22}
                className="animate-spin text-blue-600"
              />

              <div>
                <p className="text-sm font-semibold text-slate-700">
                  Uploading...
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Please wait
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-blue-100 text-blue-600">
                <Upload size={21} />
              </div>

              <div className="text-left">
                <p className="text-sm font-semibold text-slate-700">
                  Click to upload
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Select a file from your computer
                </p>
              </div>
            </>
          )}
        </button>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          {type === "image" && (
            <div className="relative aspect-video bg-slate-100">
              <img
                src={url}
                alt={fileName || "Uploaded image"}
                className="h-full w-full object-cover"
              />
            </div>
          )}

          {type === "video" && (
            <video
              src={url}
              controls
              className="aspect-video w-full bg-black"
            />
          )}

          <div className="flex items-center justify-between gap-4 p-4">
            <div className="flex min-w-0 items-center gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-slate-100 text-slate-600">
                <Icon size={19} />
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-800">
                  {fileName || "Uploaded file"}
                </p>

                <p className="mt-0.5 flex items-center gap-1 text-xs font-medium text-green-600">
                  <CheckCircle2 size={13} />
                  Uploaded successfully
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={removeFile}
              className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-600"
              title="Remove file"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      {error && (
        <p className="mt-2 text-sm font-medium text-red-600">
          {error}
        </p>
      )}

      {/* This is what gets submitted with the form */}
      <input
        type="hidden"
        name={name}
        value={url}
        readOnly
      />
    </div>
  );
}