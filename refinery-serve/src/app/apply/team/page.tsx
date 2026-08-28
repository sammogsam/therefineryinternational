"use client";

import { FormEvent, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function TeamApplicationPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setErrorMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    const fullName = formData.get("fullName") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const location = formData.get("location") as string;
    const department = formData.get("department") as string;
    const experience = formData.get("experience") as string;
    const reason = formData.get("reason") as string;
    const availability = formData.get("availability") as string;

    const { error } = await supabase
      .from("team_applications")
      .insert({
        full_name: fullName,
        email: email,
        phone: phone,
        location: location,
        department: department,
        experience: experience,
        reason: reason,
        availability: availability,
      });

    if (error) {
      console.error("TEAM APPLICATION ERROR:", error);

      setErrorMessage(
        `We could not submit your application. ${error.message}`
      );

      setLoading(false);
      return;
    }

    setLoading(false);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <main className="min-h-screen bg-orange-50 px-6 py-16">
        <div className="mx-auto flex min-h-[70vh] max-w-2xl items-center justify-center">
          <div className="w-full rounded-3xl bg-white p-8 text-center shadow-sm sm:p-12">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl">
              ✓
            </div>

            <h1 className="mt-6 text-3xl font-bold text-gray-900">
              Application Received
            </h1>

            <p className="mx-auto mt-4 max-w-lg leading-relaxed text-gray-600">
              Thank you for expressing your desire to serve with The Refinery
              International. We have received your application and will be in
              touch with you.
            </p>

            <a
              href="/"
              className="mt-8 inline-flex rounded-full bg-orange-500 px-7 py-3 font-semibold text-white transition hover:bg-orange-600"
            >
              Return Home
            </a>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-orange-50">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <section className="bg-gradient-to-br from-gray-950 via-orange-950 to-orange-600 px-6 py-16 text-center text-white sm:py-20">
        <div className="mx-auto max-w-3xl">

          <a href="/" className="inline-block">
            <img
              src="/logo.png"
              alt="The Refinery International"
              className="mx-auto h-20 w-auto object-contain"
            />
          </a>

          <p className="mt-8 text-sm font-semibold uppercase tracking-[0.25em] text-orange-200">
            Team Member Application
          </p>

          <h1 className="mt-3 text-4xl font-bold sm:text-5xl">
            Serve With The Refinery International
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-orange-50 sm:text-lg">
            If you sense a lasting call to serve within The Refinery
            International, we would love to hear from you.
          </p>

        </div>
      </section>


      {/* =====================================================
          FORM
      ===================================================== */}

      <section className="px-6 py-12 sm:py-16">
        <div className="mx-auto max-w-3xl">

          <form
            onSubmit={handleSubmit}
            className="rounded-3xl bg-white p-6 shadow-sm sm:p-10"
          >

            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Tell Us About Yourself
              </h2>

              <p className="mt-2 text-gray-600">
                Please complete the form below. We will review your
                application and contact you.
              </p>
            </div>


            <div className="mt-8 space-y-5">

              {/* Full Name */}

              <div>
                <label className="mb-2 block font-semibold text-gray-900">
                  Full Name
                </label>

                <input
                  type="text"
                  name="fullName"
                  placeholder="Your full name"
                  required
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                />
              </div>


              {/* Email */}

              <div>
                <label className="mb-2 block font-semibold text-gray-900">
                  Email Address
                </label>

                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  required
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                />
              </div>


              {/* Phone */}

              <div>
                <label className="mb-2 block font-semibold text-gray-900">
                  Phone Number
                </label>

                <input
                  type="tel"
                  name="phone"
                  placeholder="Your phone number"
                  required
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                />
              </div>


              {/* Location */}

              <div>
                <label className="mb-2 block font-semibold text-gray-900">
                  Location
                </label>

                <input
                  type="text"
                  name="location"
                  placeholder="City / State / Country"
                  required
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                />
              </div>


              {/* Department */}

              <div>
                <label className="mb-2 block font-semibold text-gray-900">
                  Area You Would Like To Serve
                </label>

                <input
                  type="text"
                  name="department"
                  placeholder="e.g. Children, Media, Welfare, Administration..."
                  required
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                />
              </div>


              {/* Experience */}

              <div>
                <label className="mb-2 block font-semibold text-gray-900">
                  Previous Ministry / Service Experience
                </label>

                <textarea
                  name="experience"
                  rows={4}
                  placeholder="Tell us briefly about any previous experience serving in church, ministry, outreach, or another organisation."
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                />
              </div>


              {/* Reason */}

              <div>
                <label className="mb-2 block font-semibold text-gray-900">
                  Why Would You Like To Serve With The Refinery International?
                </label>

                <textarea
                  name="reason"
                  rows={5}
                  placeholder="Tell us about your desire to serve and why you believe The Refinery International is a place where you can contribute."
                  required
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                />
              </div>


              {/* Availability */}

              <div>
                <label className="mb-2 block font-semibold text-gray-900">
                  Availability
                </label>

                <textarea
                  name="availability"
                  rows={3}
                  placeholder="Tell us when you are generally available to serve."
                  required
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                />
              </div>


              {/* Commitment */}

              <div className="rounded-2xl bg-orange-50 p-5">
                <label className="flex gap-3">

                  <input
                    type="checkbox"
                    name="commitment"
                    required
                    className="mt-1 h-5 w-5 accent-orange-500"
                  />

                  <span className="text-sm leading-relaxed text-gray-700">
                    I understand that becoming a team member involves
                    consistent service, participation, growth, accountability,
                    and a willingness to uphold the values and vision of The
                    Refinery International.
                  </span>

                </label>
              </div>

            </div>


            {/* Error Message */}

            {errorMessage && (
              <div className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-sm leading-relaxed text-red-700">
                {errorMessage}
              </div>
            )}


            {/* Submit */}

            <button
              type="submit"
              disabled={loading}
              className="mt-8 w-full rounded-full bg-orange-500 px-6 py-4 font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Submitting Application..."
                : "Submit Application"}
            </button>


            <p className="mt-4 text-center text-xs leading-relaxed text-gray-500">
              By submitting this form, you are expressing your interest in
              serving with The Refinery International.
            </p>

          </form>

        </div>
      </section>

    </main>
  );
}