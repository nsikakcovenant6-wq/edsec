import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  ImageIcon,
  Layers3,
  Save,
} from "lucide-react";

import FileUpload from "@/app/admin/components/FileUpload";

import { createCourse } from "../actions";

/* -------------------------------------------------------------------------- */
/* Page                                                                       */
/* -------------------------------------------------------------------------- */

export default async function NewCoursePage() {
  const createCourseAction = async (
    formData: FormData,
  ): Promise<void> => {
    "use server";

    await createCourse(formData);
  };

  return (
    <main className="min-h-screen bg-slate-50">
      {/* ------------------------------------------------------------------ */}
      {/* Header                                                             */}
      {/* ------------------------------------------------------------------ */}

      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-5 py-6 lg:px-8">
          <Link
            href="/admin/courses"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-blue-600"
          >
            <ArrowLeft size={17} />
            Back to Courses
          </Link>

          <div className="mt-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-blue-700">
              <BookOpen size={14} />
              Course Management
            </div>

            <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
              Create New Course
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Create a new EDSEC course and configure its basic
              information. After creation, you can manage modules,
              lessons, tests, assessments, cohorts, and live classes.
            </p>
          </div>
        </div>
      </header>

      {/* ------------------------------------------------------------------ */}
      {/* Form                                                               */}
      {/* ------------------------------------------------------------------ */}

      <section className="mx-auto max-w-5xl px-5 py-8 lg:px-8">
        <form action={createCourseAction}>
          <div className="space-y-6">
            {/* ------------------------------------------------------------ */}
            {/* Basic Information                                            */}
            {/* ------------------------------------------------------------ */}

            <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 px-6 py-5">
                <h2 className="font-bold text-slate-950">
                  Basic Information
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Provide the main information students will see
                  about this course.
                </p>
              </div>

              <div className="grid gap-6 p-6">
                <Field
                  name="title"
                  label="Course title"
                  placeholder="e.g. Full-Stack Web Development"
                  required
                />

                <div>
                  <label
                    htmlFor="shortDescription"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Short description
                  </label>

                  <textarea
                    id="shortDescription"
                    name="shortDescription"
                    required
                    rows={3}
                    placeholder="A short summary of what students will learn."
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="description"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Full description
                  </label>

                  <textarea
                    id="description"
                    name="description"
                    rows={6}
                    placeholder="Describe the course in more detail..."
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>
            </section>

            {/* ------------------------------------------------------------ */}
            {/* Course Details                                                */}
            {/* ------------------------------------------------------------ */}

            <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 px-6 py-5">
                <h2 className="font-bold text-slate-950">
                  Course Details
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Configure the format, duration, requirements, and
                  course structure.
                </p>
              </div>

              <div className="grid gap-6 p-6 sm:grid-cols-2">
                <Field
                  name="duration"
                  label="Duration"
                  placeholder="e.g. 6 months"
                />

                <div>
                  <label
                    htmlFor="learningFormat"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Learning format
                  </label>

                  <select
                    id="learningFormat"
                    name="learningFormat"
                    defaultValue=""
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="">
                      Select learning format
                    </option>

                    <option value="Physical">
                      Physical
                    </option>

                    <option value="Online">
                      Online
                    </option>

                    <option value="Hybrid">
                      Hybrid
                    </option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="requirements"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Requirements
                  </label>

                  <textarea
                    id="requirements"
                    name="requirements"
                    rows={5}
                    placeholder="List any requirements or prerequisites for students..."
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="syllabus"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Syllabus
                  </label>

                  <textarea
                    id="syllabus"
                    name="syllabus"
                    rows={7}
                    placeholder="Enter a general syllabus or course outline..."
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>
            </section>

            {/* ------------------------------------------------------------ */}
            {/* Course Image                                                  */}
            {/* ------------------------------------------------------------ */}

            <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 px-6 py-5">
                <h2 className="flex items-center gap-2 font-bold text-slate-950">
                  <ImageIcon size={18} />
                  Course Image
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Upload the image that should represent this course.
                </p>
              </div>

              <div className="p-6">
                <FileUpload
                  name="imageUrl"
                  label="Course cover image"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  description="JPG, PNG, WEBP or GIF. Click here to choose an image."
                />
              </div>
            </section>

            {/* ------------------------------------------------------------ */}
            {/* Publishing Settings                                           */}
            {/* ------------------------------------------------------------ */}

            <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 px-6 py-5">
                <h2 className="font-bold text-slate-950">
                  Publishing Settings
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Choose the initial status and featured setting for
                  this course.
                </p>
              </div>

              <div className="grid gap-6 p-6 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="status"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Course status
                  </label>

                  <select
                    id="status"
                    name="status"
                    defaultValue="DRAFT"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="DRAFT">
                      Draft
                    </option>

                    <option value="ACTIVE">
                      Active
                    </option>

                    <option value="INACTIVE">
                      Inactive
                    </option>
                  </select>

                  <p className="mt-2 text-xs leading-5 text-slate-500">
                    Active courses can be displayed on the public
                    course area.
                  </p>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Featured course
                  </label>

                  <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 p-4 transition hover:bg-slate-50">
                    <input
                      type="checkbox"
                      name="featured"
                      value="true"
                      className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />

                    <span>
                      <span className="block text-sm font-semibold text-slate-800">
                        Mark as featured
                      </span>

                      <span className="mt-1 block text-xs leading-5 text-slate-500">
                        Highlight this course in featured course
                        sections.
                      </span>
                    </span>
                  </label>
                </div>
              </div>
            </section>

            {/* ------------------------------------------------------------ */}
            {/* Information Notice                                            */}
            {/* ------------------------------------------------------------ */}

            <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
              <div className="flex gap-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-blue-600 shadow-sm">
                  <Layers3 size={19} />
                </div>

                <div>
                  <h3 className="font-bold text-blue-950">
                    What happens after creation?
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-blue-800">
                    The course will be created and you can continue
                    managing its modules, lessons, tests, assessments,
                    cohorts, and live classes from the course
                    management page.
                  </p>
                </div>
              </div>
            </div>

            {/* ------------------------------------------------------------ */}
            {/* Actions                                                       */}
            {/* ------------------------------------------------------------ */}

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Link
                href="/admin/courses"
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Cancel
              </Link>

              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <Save size={17} />
                Create Course
              </button>
            </div>
          </div>
        </form>
      </section>
    </main>
  );
}

/* -------------------------------------------------------------------------- */
/* Field                                                                      */
/* -------------------------------------------------------------------------- */

function Field({
  name,
  label,
  placeholder,
  type = "text",
  required = false,
}: {
  name: string;
  label: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block text-sm font-semibold text-slate-700"
      >
        {label}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />
    </div>
  );
}