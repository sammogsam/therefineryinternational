"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type TeamApplication = {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  department: string;
  reason: string;
  created_at: string;
};

export default function TeamApplicationDetails() {
  const router = useRouter();
  const params = useParams();

  const id = params.id as string;

  const [application, setApplication] =
    useState<TeamApplication | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadApplication() {
    setLoading(true);
    setError("");

    const { data, error } = await supabase
      .from("team_applications")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("TEAM APPLICATION DETAILS ERROR:", error);
      setError(error.message);
      setLoading(false);
      return;
    }

    setApplication(data);
    setLoading(false);
  }

  useEffect(() => {
    if (id) {
      loadApplication();
    }
  }, [id]);

  function formatDate(date: string) {
    return new Date(date).toLocaleString("en-NG", {
      dateStyle: "full",
      timeStyle: "short",
    });
  }

  return (
    <main className="min-h-screen bg-orange-50">
      {/* Header */}

      <header className="border-b border-orange-100 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-orange-500">
              The Refinery International
            </p>

            <h1 className="mt-2 text-3xl font-bold text-gray-900">
              Team Application
            </h1>
          </div>

          <button
            onClick={() =>
              router.push("/admin/applications/team")
            }
            className="rounded-full bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
          >
            ← All Applications
          </button>
        </div>
      </header>

      {/* Content */}

      <section className="mx-auto max-w-5xl px-6 py-10">
        {loading && (
          <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
            <p className="text-gray-600">
              Loading application...
            </p>
          </div>
        )}

        {!loading && error && (
          <div className="rounded-3xl bg-white p-8 shadow-sm">
            <div className="rounded-2xl bg-red-50 p-5 text-red-600">
              <p className="font-semibold">
                Could not load this application.
              </p>

              <p className="mt-2 text-sm">
                {error}
              </p>
            </div>

            <button
              onClick={() =>
                router.push("/admin/applications/team")
              }
              className="mt-6 rounded-full bg-gray-900 px-6 py-3 font-semibold text-white"
            >
              Back to Applications
            </button>
          </div>
        )}

        {!loading && !error && application && (
          <div className="space-y-6">
            {/* Applicant Header */}

            <div className="rounded-3xl bg-white p-8 shadow-sm sm:p-10">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wider text-orange-500">
                    Team Member Application
                  </p>

                  <h2 className="mt-2 text-3xl font-bold text-gray-900">
                    {application.full_name}
                  </h2>

                  <p className="mt-2 text-sm text-gray-500">
                    Submitted {formatDate(application.created_at)}
                  </p>
                </div>

                <span className="w-fit rounded-full bg-yellow-100 px-4 py-2 text-sm font-semibold text-yellow-700">
                  New Application
                </span>
              </div>
            </div>

            {/* Contact Information */}

            <div className="rounded-3xl bg-white p-8 shadow-sm sm:p-10">
              <h3 className="text-xl font-bold text-gray-900">
                Contact Information
              </h3>

              <div className="mt-6 grid gap-6 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Full Name
                  </p>

                  <p className="mt-2 text-gray-800">
                    {application.full_name}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Email Address
                  </p>

                  <p className="mt-2 break-words text-gray-800">
                    {application.email}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Phone Number
                  </p>

                  <p className="mt-2 text-gray-800">
                    {application.phone}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Department
                  </p>

                  <p className="mt-2 text-gray-800">
                    {application.department}
                  </p>
                </div>
              </div>
            </div>

            {/* Reason */}

            <div className="rounded-3xl bg-white p-8 shadow-sm sm:p-10">
              <h3 className="text-xl font-bold text-gray-900">
                Reason For Joining
              </h3>

              <div className="mt-6 rounded-2xl bg-orange-50 p-6">
                <p className="whitespace-pre-wrap leading-8 text-gray-700">
                  {application.reason}
                </p>
              </div>
            </div>

            {/* Actions */}

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() =>
                  router.push("/admin/applications/team")
                }
                className="rounded-full border border-gray-200 bg-white px-6 py-3 font-semibold text-gray-700 transition hover:border-orange-300 hover:text-orange-500"
              >
                ← Back to Applications
              </button>

              <a
                href={`mailto:${application.email}`}
                className="rounded-full bg-orange-500 px-6 py-3 text-center font-semibold text-white transition hover:bg-orange-600"
              >
                Contact Applicant
              </a>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}