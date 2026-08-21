/* eslint-disable @next/next/no-location-assign-relative-destination */
"use client";

import { useState, useTransition } from "react";
import {
  CheckCircle2,
  Loader2,
  Pencil,
  Save,
  Trash2,
  XCircle,
} from "lucide-react";

import {
  deleteModule,
  toggleModulePublished,
  updateModule,
} from "../actions";

type Props = {
  moduleId: string;
  courseId: string;
  title: string;
  description: string | null;
  isPublished: boolean;
};

export default function ModuleActions({
  moduleId,
  title,
  description,
  isPublished,
}: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [moduleTitle, setModuleTitle] = useState(title);
  const [moduleDescription, setModuleDescription] = useState(
    description ?? ""
  );
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<
    "success" | "error" | ""
  >("");

  const [pending, startTransition] = useTransition();

  function showMessage(
    text: string,
    type: "success" | "error"
  ) {
    setMessage(text);
    setMessageType(type);
  }

  function handleUpdate() {
    if (!moduleTitle.trim()) {
      showMessage("Module title is required.", "error");
      return;
    }

    const formData = new FormData();

    formData.set("title", moduleTitle.trim());
    formData.set(
      "description",
      moduleDescription.trim()
    );

    startTransition(async () => {
      const result = await updateModule(
        moduleId,
        formData
      );

      if (result.success) {
        showMessage(result.message, "success");
        setIsEditing(false);
      } else {
        showMessage(result.message, "error");
      }
    });
  }

  function handleTogglePublished() {
    startTransition(async () => {
      const result = await toggleModulePublished(
        moduleId
      );

      if (result.success) {
        showMessage(result.message, "success");
      } else {
        showMessage(result.message, "error");
      }
    });
  }

  function handleDelete() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this module? Modules containing lessons cannot be deleted."
    );

    if (!confirmed) {
      return;
    }

    startTransition(async () => {
      const result = await deleteModule(moduleId);

      if (result.success) {
        window.location.href = "/admin/modules";
        return;
      }

      showMessage(result.message, "error");
    });
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-bold text-slate-950">
          Module Actions
        </h2>

        {!isEditing && (
          <button
            type="button"
            onClick={() => {
              setMessage("");
              setMessageType("");
              setIsEditing(true);
            }}
            disabled={pending}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Pencil size={14} />
            Edit
          </button>
        )}
      </div>

      {message && (
        <div
          className={`mt-4 rounded-xl px-4 py-3 text-sm font-medium ${
            messageType === "success"
              ? "border border-green-200 bg-green-50 text-green-700"
              : "border border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {message}
        </div>
      )}

      {isEditing ? (
        <div className="mt-5 space-y-4">
          <div>
            <label
              htmlFor="module-title"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Module title
            </label>

            <input
              id="module-title"
              value={moduleTitle}
              onChange={(event) =>
                setModuleTitle(event.target.value)
              }
              disabled={pending}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50"
            />
          </div>

          <div>
            <label
              htmlFor="module-description"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Description
            </label>

            <textarea
              id="module-description"
              value={moduleDescription}
              onChange={(event) =>
                setModuleDescription(
                  event.target.value
                )
              }
              disabled={pending}
              rows={5}
              placeholder="Describe what students will learn in this module..."
              className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleUpdate}
              disabled={pending}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {pending ? (
                <Loader2
                  size={16}
                  className="animate-spin"
                />
              ) : (
                <Save size={16} />
              )}

              Save Changes
            </button>

            <button
              type="button"
              onClick={() => {
                setModuleTitle(title);
                setModuleDescription(
                  description ?? ""
                );
                setIsEditing(false);
                setMessage("");
                setMessageType("");
              }}
              disabled={pending}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-5 space-y-3">
          <button
            type="button"
            onClick={handleTogglePublished}
            disabled={pending}
            className={`flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${
              isPublished
                ? "border border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100"
                : "bg-green-600 text-white hover:bg-green-700"
            }`}
          >
            {pending ? (
              <Loader2
                size={17}
                className="animate-spin"
              />
            ) : isPublished ? (
              <XCircle size={17} />
            ) : (
              <CheckCircle2 size={17} />
            )}

            {isPublished
              ? "Unpublish Module"
              : "Publish Module"}
          </button>

          <button
            type="button"
            onClick={() => {
              setMessage("");
              setMessageType("");
              setIsEditing(true);
            }}
            disabled={pending}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Pencil size={17} />
            Edit Module
          </button>

          <button
            type="button"
            onClick={handleDelete}
            disabled={pending}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {pending ? (
              <Loader2
                size={17}
                className="animate-spin"
              />
            ) : (
              <Trash2 size={17} />
            )}

            Delete Module
          </button>
        </div>
      )}
    </div>
  );
}