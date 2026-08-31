"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Users, Calendar, Briefcase, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function CampSubmissionsPage() {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  async function fetchSubmissions() {
    const { data } = await supabase
      .from("camp_volunteers_submissions")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) setSubmissions(data);
    setLoading(false);
  }

  function formatArrayData(val: any) {
    if (Array.isArray(val)) {
      return val.join(", ");
    }
    return val || "None selected";
  }

  return (
    <main className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Camp Meeting Registrations</h1>
          <p className="mt-2 text-gray-500 text-sm">Review volunteers who registered via the separate camp link.</p>
        </div>

        <Link
          href="/camp-volunteer"
          target="_blank"
          className="flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-3 text-sm font-semibold text-white hover:bg-orange-600 transition w-fit shadow-sm"
        >
          <ExternalLink size={16} />
          Open Public Form Link
        </Link>
      </div>

      <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Users size={20} className="text-orange-500" />
          Submissions ({submissions.length})
        </h2>

        {loading ? (
          <p className="text-sm text-gray-500 py-4">Loading submissions...</p>
        ) : submissions.length === 0 ? (
          <p className="text-sm text-gray-500 py-4">No camp volunteers have registered yet.</p>
        ) : (
          <div className="space-y-4">
            {submissions.map((sub) => (
              <div 
                key={sub.id} 
                className="flex flex-col sm:flex-row sm:items-center justify-between rounded-2xl border border-gray-100 bg-gray-50/50 p-5 gap-4 transition hover:bg-gray-50"
              >
                <div className="space-y-2">
                  <h3 className="font-bold text-gray-900 text-lg">{sub.full_name}</h3>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-sm text-gray-600">
                    <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-gray-200 shadow-xs">
                      <Calendar size={15} className="text-orange-500 shrink-0" />
                      <span><strong>Availability:</strong> {formatArrayData(sub.days_staying)}</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-gray-200 shadow-xs">
                      <Briefcase size={15} className="text-orange-500 shrink-0" />
                      <span><strong>Units:</strong> {formatArrayData(sub.units || sub.unit)}</span>
                    </div>
                  </div>
                </div>
                <span className="rounded-full bg-orange-100 px-3.5 py-1.5 text-xs font-semibold text-orange-700 w-fit h-fit">
                  Confirmed
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}