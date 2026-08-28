"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "General Enquiry",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const scrollToForm = (category: string) => {
    setFormData((prev) => ({ ...prev, subject: category }));
    const formElement = document.getElementById("contact-form-section");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    const { error } = await supabase.from("contact_messages").insert([
      {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: formData.subject,
        message: formData.message,
      },
    ]);

    if (error) {
      setStatus({ type: "error", message: error.message });
    } else {
      setStatus({
        type: "success",
        message: "Thank you for reaching out! We will get back to you shortly.",
      });
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "General Enquiry",
        message: "",
      });
    }
    setLoading(false);
  };

  return (
    <main>
      {/* Hero */}
      <section className="bg-orange-500 py-16 text-center text-white sm:py-20 md:py-24">
        <div className="mx-auto max-w-5xl px-6">
          <h1 className="text-4xl font-bold sm:text-5xl md:text-6xl">
            Contact Us
          </h1>
          <p className="mx-auto mt-5 max-w-3xl text-base leading-relaxed text-orange-50 sm:text-lg">
            We would love to hear from you, partner with you, and serve alongside you.
          </p>
        </div>
      </section>

      {/* Ways To Connect */}
      <section className="bg-white py-16 sm:py-20 md:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-orange-500">
              How Can We Help?
            </p>
            <h2 className="mt-4 text-3xl font-bold text-gray-900 sm:text-4xl">
              We&apos;d Love To Connect
            </h2>
            <p className="mx-auto mt-5 max-w-3xl text-base leading-relaxed text-gray-600 sm:text-lg">
              Whether you have a question, would like to invite The Refinery, or want to partner with us, we would love to hear from you.
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {/* General Enquiry */}
            <div className="flex flex-col justify-between rounded-3xl bg-orange-50 p-8 text-center">
              <div>
                <div className="text-4xl">💬</div>
                <h3 className="mt-5 text-2xl font-bold text-gray-900">
                  General Enquiry
                </h3>
                <p className="mt-4 leading-relaxed text-gray-600">
                  Have questions about The Refinery? We&apos;d be delighted to hear from you.
                </p>
              </div>
              <button
                type="button"
                onClick={() => scrollToForm("General Enquiry")}
                className="mt-6 inline-block w-full rounded-full bg-orange-500 py-3 font-semibold text-white transition hover:bg-orange-600"
              >
                Send An Enquiry
              </button>
            </div>

            {/* Invite Us */}
            <div className="flex flex-col justify-between rounded-3xl bg-orange-50 p-8 text-center">
              <div>
                <div className="text-4xl">🏫</div>
                <h3 className="mt-5 text-2xl font-bold text-gray-900">
                  Invite Us
                </h3>
                <p className="mt-4 leading-relaxed text-gray-600">
                  Invite The Refinery to your school, church, community, or event.
                </p>
              </div>
              <button
                type="button"
                onClick={() => scrollToForm("Invitation / Speaking")}
                className="mt-6 inline-block w-full rounded-full bg-orange-500 py-3 font-semibold text-white transition hover:bg-orange-600"
              >
                Invite The Refinery
              </button>
            </div>

            {/* Partner */}
            <div className="flex flex-col justify-between rounded-3xl bg-orange-50 p-8 text-center">
              <div>
                <div className="text-4xl">🤝</div>
                <h3 className="mt-5 text-2xl font-bold text-gray-900">
                  Partner With Us
                </h3>
                <p className="mt-4 leading-relaxed text-gray-600">
                  Join us in raising and refining children by partnering with our vision.
                </p>
              </div>
              <a
                href="/partner"
                className="mt-6 inline-block w-full rounded-full bg-orange-500 py-3 font-semibold text-white transition hover:bg-orange-600"
              >
                Partner With Us
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Message Form */}
      <section id="contact-form-section" className="bg-slate-950 py-16 text-white sm:py-20">
        <div className="mx-auto max-w-3xl px-6">
          <div className="text-center">
            <span className="text-xs font-semibold uppercase tracking-wider text-orange-400">
              Direct Message
            </span>
            <h2 className="mt-2 text-3xl font-bold text-white sm:text-4xl">
              Send Us A Message
            </h2>
            <p className="mt-3 text-sm text-gray-400">
              Fill in your details below and our ministry support team will be in touch.
            </p>
          </div>

          {status && (
            <div
              className={`mt-6 rounded-lg p-4 text-sm ${
                status.type === "success"
                  ? "border border-green-800 bg-green-950/60 text-green-200"
                  : "border border-red-800 bg-red-950/60 text-red-200"
              }`}
            >
              {status.message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-300">Your Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="John Doe"
                  className="mt-2 w-full rounded-lg border border-gray-800 bg-slate-900 px-4 py-3 text-white placeholder-gray-500 focus:border-orange-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300">Phone Number</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+234..."
                  className="mt-2 w-full rounded-lg border border-gray-800 bg-slate-900 px-4 py-3 text-white placeholder-gray-500 focus:border-orange-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-300">Email Address *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="you@example.com"
                  className="mt-2 w-full rounded-lg border border-gray-800 bg-slate-900 px-4 py-3 text-white placeholder-gray-500 focus:border-orange-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300">Category / Subject *</label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="mt-2 w-full rounded-lg border border-gray-800 bg-slate-900 px-4 py-3 text-white focus:border-orange-500 focus:outline-none"
                >
                  <option value="General Enquiry">General Enquiry</option>
                  <option value="Invitation / Speaking">Invitation / Speaking</option>
                  <option value="Camps & Programs">Camps & Programs</option>
                  <option value="Feedback / Other">Feedback / Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300">Your Message *</label>
              <textarea
                rows={5}
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Write your message or invitation details here..."
                className="mt-2 w-full rounded-lg border border-gray-800 bg-slate-900 px-4 py-3 text-white placeholder-gray-500 focus:border-orange-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-orange-500 py-3.5 font-semibold text-white transition hover:bg-orange-600 disabled:opacity-50"
            >
              {loading ? "Sending Message..." : "Send Message"}
            </button>
          </form>
        </div>
      </section>

      {/* Contact Details */}
      <section className="bg-orange-50 py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Contact Information
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-gray-600 sm:text-lg">
            We&apos;d love to hear from you. Reach out through any of the channels below.
          </p>

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {/* Phone Numbers */}
            <div className="rounded-3xl bg-white p-8 shadow-sm transition hover:shadow-md">
              <div className="text-3xl">📞</div>
              <h3 className="mt-4 text-lg font-bold text-gray-900">Phone Numbers</h3>
              <div className="mt-3 flex flex-col gap-1.5 font-medium text-gray-600">
                <a
                  href="tel:+2349032270825"
                  className="transition hover:text-orange-600"
                >
                  +234 903 227 0825
                </a>
                <a
                  href="tel:+2347065231908"
                  className="transition hover:text-orange-600"
                >
                  +234 706 523 1908
                </a>
              </div>
            </div>

            {/* Email Address */}
            <div className="rounded-3xl bg-white p-8 shadow-sm transition hover:shadow-md">
              <div className="text-3xl">✉️</div>
              <h3 className="mt-4 text-lg font-bold text-gray-900">Email Address</h3>
              <div className="mt-3 font-medium text-gray-600">
                <a
                  href="https://mail.google.com/mail/?view=cm&fs=1&to=therefineryinternational@gmail.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="break-all transition hover:text-orange-600"
                >
                  therefineryinternational@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}