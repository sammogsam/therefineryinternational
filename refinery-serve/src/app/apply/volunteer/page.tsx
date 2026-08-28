"use client";

import { FormEvent, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function VolunteerApplication() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [programme, setProgramme] = useState("");
  const [reason, setReason] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setMessage("");

    const { error } = await supabase
      .from("volunteer_applications")
      .insert({
        full_name: fullName,
        email: email,
        phone: phone,
        programme: programme,
        reason: reason,
      });

    if (error) {
      console.error("VOLUNTEER APPLICATION ERROR:", error);

      setMessage(`Error: ${error.message}`);

      setLoading(false);
      return;
    }

    setMessage(
      "Application submitted successfully! We will be in touch with you."
    );

    setFullName("");
    setEmail("");
    setPhone("");
    setProgramme("");
    setReason("");

    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-orange-50">

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="bg-gradient-to-br from-[#120d18] via-[#4b1608] to-orange-600 px-6 py-16 text-white sm:py-20 md:py-24">
        <div className="mx-auto max-w-5xl text-center">

          {/* Logo */}

          <div className="mb-12 flex justify-center">
            <img
              src="/logo.png"
              alt="The Refinery International"
              className="h-20 w-auto object-contain sm:h-24 md:h-28"
            />
          </div>

          {/* Small Heading */}

          <p className="text-sm font-bold uppercase tracking-[0.35em] text-orange-200 sm:text-base">
            Volunteer Application
          </p>

          {/* Main Heading */}

          <h1 className="mx-auto mt-5 max-w-4xl text-4xl font-bold leading-tight sm:text-5xl md:text-6xl">
            Serve With The Refinery International
          </h1>

          {/* Description */}

          <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-orange-50 sm:text-lg md:text-xl">
            If you would like to support a specific programme,
            outreach, camp meeting, or event, we would love to
            have you serve with us.
          </p>

        </div>
      </section>


      {/* =====================================================
          APPLICATION SECTION
      ===================================================== */}

      <section className="px-6 py-16 sm:py-20 md:py-24">
        <div className="mx-auto max-w-5xl">

          <div className="rounded-3xl bg-white p-6 shadow-sm sm:p-10 md:p-12">

            {/* Introduction */}

            <div className="max-w-3xl">

              <p className="text-sm font-bold uppercase tracking-[0.25em] text-orange-500">
                Join Us
              </p>

              <h2 className="mt-4 text-3xl font-bold text-gray-900 sm:text-4xl">
                Tell Us About Yourself
              </h2>

              <p className="mt-5 text-base leading-relaxed text-gray-600 sm:text-lg">
                Please complete the form below. Your application will
                help us understand how you would like to serve and the
                areas where your gifts, skills, and availability may be
                useful.
              </p>

            </div>


            {/* Form */}

            <form
              onSubmit={handleSubmit}
              className="mt-10 space-y-6"
            >

              {/* Full Name */}

              <div>
                <label
                  htmlFor="fullName"
                  className="mb-2 block text-sm font-semibold text-gray-800"
                >
                  Full Name
                </label>

                <input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  placeholder="Enter your full name"
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
                />
              </div>


              {/* Email */}

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-gray-800"
                >
                  Email Address
                </label>

                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Enter your email address"
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
                />
              </div>


              {/* Phone */}

              <div>
                <label
                  htmlFor="phone"
                  className="mb-2 block text-sm font-semibold text-gray-800"
                >
                  Phone Number
                </label>

                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  placeholder="Enter your phone number"
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
                />
              </div>


              {/* Programme */}

              <div>
                <label
                  htmlFor="programme"
                  className="mb-2 block text-sm font-semibold text-gray-800"
                >
                  Programme / Event Interested In
                </label>

                <input
                  id="programme"
                  type="text"
                  value={programme}
                  onChange={(e) => setProgramme(e.target.value)}
                  required
                  placeholder="e.g. Camp Meeting, Outreach, Children's Programme"
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
                />
              </div>


              {/* Reason / Service */}

              <div>
                <label
                  htmlFor="reason"
                  className="mb-2 block text-sm font-semibold text-gray-800"
                >
                  How Would You Like To Serve?
                </label>

                <textarea
                  id="reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  required
                  rows={6}
                  placeholder="Tell us about the skills, gifts, experience, or time you would like to contribute..."
                  className="w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
                />
              </div>


              {/* Message */}

              {message && (
                <div
                  className={`rounded-xl px-5 py-4 text-sm leading-relaxed ${
                    message.includes("successfully")
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {message}
                </div>
              )}


              {/* Submit Button */}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-full bg-orange-500 px-8 py-4 font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                >
                  {loading
                    ? "Submitting..."
                    : "Submit Volunteer Application"}
                </button>
              </div>

            </form>

          </div>
        </div>
      </section>


      {/* =====================================================
          BACK LINK
      ===================================================== */}

      <div className="px-6 pb-12 text-center">
        <a
          href="/"
          className="text-sm font-medium text-gray-500 transition hover:text-orange-500"
        >
          ← Back to The Refinery International
        </a>
      </div>


      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="border-t border-orange-100 bg-white px-6 py-8 text-center">
        <p className="text-sm text-gray-500">
          © {new Date().getFullYear()} The Refinery International.
          All rights reserved.
        </p>
      </footer>

    </main>
  );
}