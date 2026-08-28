"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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

export default function TeamApplicationsPage() {
  const router = useRouter();

  const [applications, setApplications] = useState<TeamApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadApplications() {
    setLoading(true);
    setError("");

    const { data, error } = await supabase
      .from("team_applications")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("TEAM APPLICATIONS ERROR:", error);
      setError(error.message);
      setLoading(false);
      return;
    }

    setApplications(data || []);
    setLoading(false);
  }

  useEffect(() => {
    loadApplications();
  }, []);

  function formatDate(date: string) {
    return new Date(date).toLocaleString("en-NG", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  }

  return (
    <main className="min-h-screen bg-orange-50">
      {/* Header */}

      <header className="border-b border-orange-100 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-orange-500">
              The Refinery International
            </p>

            <h1 className="mt-2 text-3xl font-bold text-gray-900">
              Team Applications
            </h1>

            <p className="mt-2 text-gray-600">
              Review applications submitted to join the Refinery team.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={loadApplications}
              className="rounded-full border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:border-orange-300 hover:text-orange-500"
            >
              Refresh
            </button>

            <button
              onClick={() => router.push("/admin/dashboard")}
              className="rounded-full bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
            >
              ← Dashboard
            </button>
          </div>
        </div>
      </header>

      {/* Content */}

      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">

          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900">
              Submitted Applications
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {applications.length} application
              {applications.length === 1 ? "" : "s"} received
            </p>
          </div>

          {/* Loading */}

          {loading && (
            <div className="rounded-2xl bg-orange-50 px-6 py-10 text-center">
              <p className="text-gray-600">
                Loading applications...
              </p>
            </div>
          )}

          {/* Error */}

          {!loading && error && (
            <div className="rounded-2xl bg-red-50 px-6 py-5 text-red-600">
              <p className="font-semibold">
                Could not load applications.
              </p>

              <p className="mt-1 text-sm">
                {error}
              </p>
            </div>
          )}

          {/* Empty */}

          {!loading && !error && applications.length === 0 && (
            <div className="rounded-2xl border border-dashed border-gray-200 px-6 py-16 text-center">
              <h3 className="text-lg font-semibold text-gray-900">
                No applications yet
              </h3>

              <p className="mt-2 text-gray-500">
                Team applications will appear here when people submit
                the application form.
              </p>
            </div>
          )}

          {/* Applications */}

          {!loading && !error && applications.length > 0 && (
            <div className="space-y-5">

              {applications.map((application) => (
                <button
                  key={application.id}
                  type="button"
                  onClick={() =>
                    router.push(
                      `/admin/applications/team/${application.id}`
                    )
                  }
                  className="w-full rounded-2xl border border-gray-100 bg-gray-50 p-6 text-left transition hover:border-orange-300 hover:bg-orange-50"
                >
                  <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">

                    <div className="space-y-4">

                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          {application.full_name}
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                          Applied {formatDate(application.created_at)}
                        </p>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">

                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                            Email
                          </p>

                          <p className="mt-1 text-gray-700">
                            {application.email}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                            Phone
                          </p>

                          <p className="mt-1 text-gray-700">
                            {application.phone}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                            Department
                          </p>

                          <p className="mt-1 text-gray-700">
                            {application.department}
                          </p>
                        </div>

                      </div>

                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                          Reason For Joining
                        </p>

                        <p className="mt-2 max-w-3xl truncate leading-relaxed text-gray-700">
                          {application.reason}
                        </p>
                      </div>

                    </div>

                    <div className="flex shrink-0 items-center gap-3">

                      <span className="rounded-full bg-yellow-100 px-4 py-2 text-sm font-semibold text-yellow-700">
                        New Application
                      </span>

                      <span className="text-xl text-gray-400">
                        →
                      </span>

                    </div>

                  </div>
                </button>
              ))}

            </div>
          )}

        </div>
      </section>
    </main>
  );
}