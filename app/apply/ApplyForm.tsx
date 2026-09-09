"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type Course = {
  id: string;
  title: string;
  slug: string;
};

type ApplyFormProps = {
  courses: Course[];
};

export default function ApplyForm({ courses }: ApplyFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const courseSlug = searchParams.get("course");

  const initialCourseId =
    courses.find((course) => course.slug === courseSlug)?.id ?? "";

  const [selectedCourseId, setSelectedCourseId] =
    useState(initialCourseId);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  function handleCourseChange(
    event: React.ChangeEvent<HTMLSelectElement>
  ) {
    setSelectedCourseId(event.target.value);
    setError("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsSubmitting(true);
    setSuccess("");
    setError("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    const firstName = String(formData.get("firstName") || "").trim();
    const lastName = String(formData.get("lastName") || "").trim();
    const email = String(formData.get("email") || "")
      .trim()
      .toLowerCase();
    const phone = String(formData.get("phone") || "").trim();
    const dateOfBirth = String(formData.get("dateOfBirth") || "").trim();
    const educationalLevel = String(
      formData.get("educationalLevel") || ""
    ).trim();
    const preferredFormat = String(
      formData.get("preferredFormat") || ""
    ).trim();
    const preferredStartDate = String(
      formData.get("preferredStartDate") || ""
    ).trim();
    const additionalInfo = String(
      formData.get("additionalInfo") || ""
    ).trim();

    if (!selectedCourseId) {
      setError("Please select a course.");
      setIsSubmitting(false);
      return;
    }

    if (!firstName || !lastName || !email || !phone) {
      setError("Please complete all required fields.");
      setIsSubmitting(false);
      return;
    }

    const selectedCourse = courses.find(
      (course) => course.id === selectedCourseId
    );

    if (!selectedCourse) {
      setError(
        "The selected course is no longer available. Please select another course."
      );
      setIsSubmitting(false);
      return;
    }

    const payload = {
      fullName: `${firstName} ${lastName}`.trim(),
      email,
      phone,
      courseId: selectedCourse.id,
      dateOfBirth,
      educationalLevel,
      preferredFormat,
      preferredStartDate,
      additionalInfo,
    };

    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Unable to submit your application. Please try again."
        );
      }

      setSuccess(
        data?.message ||
          "Your application has been submitted successfully."
      );

      form.reset();
      setSelectedCourseId("");

      router.push("/apply/success");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to submit your application. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="relative overflow-hidden bg-slate-950 px-6 py-20 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.22),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(14,165,233,0.16),transparent_35%)]" />

        <div className="relative mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">
              EDSEC Computer Training
            </p>

            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Start your technology journey.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              Apply to EDSEC and gain practical technology skills through
              structured, hands-on training designed to prepare you for real
              opportunities.
            </p>
          </div>
        </div>
      </section>

      <section className="px-6 py-12 sm:py-16">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_360px]">
          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8 lg:p-10">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-950">
                Application Form
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Complete the form below and our team will contact you with the
                next steps.
              </p>
            </div>

            {error && (
              <div
                role="alert"
                className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
              >
                {error}
              </div>
            )}

            {success && (
              <div
                role="status"
                className="mb-6 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700"
              >
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <h3 className="mb-4 text-lg font-semibold text-slate-950">
                  Personal Information
                </h3>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="mb-2 block text-sm font-medium text-slate-700"
                    >
                      First Name
                    </label>

                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      required
                      autoComplete="given-name"
                      placeholder="Enter your first name"
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="lastName"
                      className="mb-2 block text-sm font-medium text-slate-700"
                    >
                      Last Name
                    </label>

                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      required
                      autoComplete="family-name"
                      placeholder="Enter your last name"
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block text-sm font-medium text-slate-700"
                    >
                      Email Address
                    </label>

                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      placeholder="you@example.com"
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="mb-2 block text-sm font-medium text-slate-700"
                    >
                      Phone Number
                    </label>

                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      autoComplete="tel"
                      placeholder="+234 800 000 0000"
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="dateOfBirth"
                      className="mb-2 block text-sm font-medium text-slate-700"
                    >
                      Date of Birth
                    </label>

                    <input
                      id="dateOfBirth"
                      name="dateOfBirth"
                      type="date"
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="educationalLevel"
                      className="mb-2 block text-sm font-medium text-slate-700"
                    >
                      Educational Level
                    </label>

                    <select
                      id="educationalLevel"
                      name="educationalLevel"
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    >
                      <option value="">Select your level</option>
                      <option value="Secondary School">
                        Secondary School
                      </option>
                      <option value="Undergraduate">
                        Undergraduate
                      </option>
                      <option value="Graduate">Graduate</option>
                      <option value="Working Professional">
                        Working Professional
                      </option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="mb-4 text-lg font-semibold text-slate-950">
                  Course Selection
                </h3>

                <div>
                  <label
                    htmlFor="course"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Course
                  </label>

                  <select
                    id="course"
                    name="course"
                    value={selectedCourseId}
                    onChange={handleCourseChange}
                    required
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  >
                    <option value="">Select a course</option>

                    {courses.map((course) => (
                      <option key={course.id} value={course.id}>
                        {course.title}
                      </option>
                    ))}
                  </select>

                  <p className="mt-2 text-xs text-slate-500">
                    {courses.length} active courses available.
                  </p>
                </div>
              </div>

              <div>
                <h3 className="mb-4 text-lg font-semibold text-slate-950">
                  Training Preferences
                </h3>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="preferredFormat"
                      className="mb-2 block text-sm font-medium text-slate-700"
                    >
                      Preferred Learning Format
                    </label>

                    <select
                      id="preferredFormat"
                      name="preferredFormat"
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    >
                      <option value="">Select format</option>
                      <option value="On-site">On-site</option>
                      <option value="Online">Online</option>
                      <option value="Hybrid">Hybrid</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="preferredStartDate"
                      className="mb-2 block text-sm font-medium text-slate-700"
                    >
                      Preferred Start Date
                    </label>

                    <input
                      id="preferredStartDate"
                      name="preferredStartDate"
                      type="date"
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label
                  htmlFor="additionalInfo"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Additional Information
                </label>

                <textarea
                  id="additionalInfo"
                  name="additionalInfo"
                  rows={5}
                  placeholder="Tell us anything else you would like us to know..."
                  className="w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <div className="flex flex-col gap-4 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
                <p className="max-w-md text-xs leading-5 text-slate-500">
                  By submitting this application, you agree that EDSEC may
                  contact you regarding your application and training options.
                </p>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex min-h-12 items-center justify-center rounded-xl bg-blue-600 px-7 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? "Submitting..." : "Submit Application"}
                </button>
              </div>
            </form>
          </div>

          <aside className="h-fit rounded-3xl bg-slate-950 p-7 text-white shadow-sm">
            <h2 className="text-xl font-bold">What happens next?</h2>

            <div className="mt-7 space-y-6">
              <div className="flex gap-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold">
                  1
                </div>

                <div>
                  <h3 className="font-semibold">Application Review</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-400">
                    Our team reviews the information you provide.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold">
                  2
                </div>

                <div>
                  <h3 className="font-semibold">Confirmation</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-400">
                    We contact you to confirm your application and discuss the
                    next steps.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold">
                  3
                </div>

                <div>
                  <h3 className="font-semibold">Start Learning</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-400">
                    Complete your registration and begin your training.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 border-t border-slate-800 pt-6">
              <Link
                href="/courses"
                className="text-sm font-semibold text-blue-400 transition hover:text-blue-300"
              >
                Explore all courses →
              </Link>

              <Link
                href="/contact"
                className="mt-3 block text-sm font-semibold text-slate-300 transition hover:text-white"
              >
                Contact EDSEC →
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}