"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Settings, ExternalLink, Users } from "lucide-react";

type VolunteerApplication = {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  programme: string | null;
  reason: string | null;
  created_at: string;
};

export default function VolunteerApplicationsPage() {
  const [applications, setApplications] = useState<VolunteerApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadApplications() {
      setLoading(true);
      setError("");

      const { data, error } = await supabase
        .from("volunteer_applications")
        .select("*")
        .order("created_at", {
          ascending: false,
        });

      if (error) {
        console.error(error);
        setError(error.message);
        setLoading(false);
        return;
      }

      setApplications(data || []);
      setLoading(false);
    }

    loadApplications();
  }, []);

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  return (
    <div>
      {/* Page Header with Action Buttons */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Volunteer Applications
          </h1>

          <p className="mt-2 text-sm text-gray-500 sm:text-base">
            Review people who have expressed interest in volunteering with The Refinery.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/camp-volunteer"
            target="_blank"
            className="flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition shadow-sm"
          >
            <ExternalLink size={16} />
            Public Link
          </Link>

          <Link
            href="/admin/volunteers/camp-submissions"
            className="flex items-center gap-2 rounded-xl border border-orange-300 bg-orange-50 px-4 py-3 text-sm font-semibold text-orange-700 hover:bg-orange-100 transition shadow-sm"
          >
            <Users size={16} />
            Camp Submissions
          </Link>

          <Link
            href="/admin/volunteers/camp-settings"
            className="flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white hover:bg-orange-600 transition shadow-sm"
          >
            <Settings size={18} />
            Camp Questionnaire Settings
          </Link>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-orange-500" />
          <p className="mt-4 text-gray-500">
            Loading volunteer applications...
          </p>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="rounded-2xl bg-red-50 p-6 text-red-700">
          <p className="font-semibold">
            Unable to load applications.
          </p>
          <p className="mt-2 text-sm">
            {error}
          </p>
        </div>
      )}

      {/* Empty State */}
      {!loading &&
        !error &&
        applications.length === 0 && (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center">
            <h2 className="text-xl font-bold text-gray-900">
              No volunteer applications yet
            </h2>
            <p className="mt-2 text-gray-500">
              Volunteer applications submitted through the public website will appear here.
            </p>
          </div>
        )}

      {/* Applications List */}
      {!loading &&
        !error &&
        applications.length > 0 && (
          <div className="space-y-5">
            {applications.map((application) => (
              <div
                key={application.id}
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
              >
                <div className="flex flex-col justify-between gap-4 md:flex-row">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {application.full_name}
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                      Applied on{" "}
                      {formatDate(application.created_at)}
                    </p>
                  </div>

                  <span className="h-fit rounded-full bg-orange-100 px-4 py-2 text-xs font-semibold text-orange-600">
                    Volunteer Application
                  </span>
                </div>

                {/* Contact Information */}
                <div className="mt-6 grid gap-5 md:grid-cols-2">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Email
                    </p>
                    <p className="mt-1 text-gray-800">
                      {application.email}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Phone
                    </p>
                    <p className="mt-1 text-gray-800">
                      {application.phone}
                    </p>
                  </div>

                  <div className="md:col-span-2">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Programme / Event Interested In
                    </p>
                    <p className="mt-1 text-gray-800">
                      {application.programme || "Not provided"}
                    </p>
                  </div>
                </div>

                {/* Reason */}
                <div className="mt-6 border-t border-gray-100 pt-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                    How They Would Like To Serve
                  </p>
                  <p className="mt-2 whitespace-pre-line leading-relaxed text-gray-700">
                    {application.reason || "Not provided"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
    </div>
  );
}