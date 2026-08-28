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

type VolunteerApplication = {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  programme: string;
  reason: string;
  created_at: string;
};

export default function AdminDashboard() {
  const router = useRouter();

  const [teamApplications, setTeamApplications] = useState<
    TeamApplication[]
  >([]);

  const [volunteerApplications, setVolunteerApplications] = useState<
    VolunteerApplication[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  async function loadApplications() {
    setLoading(true);
    setErrorMessage("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/admin/login");
      return;
    }

    const { data: teamData, error: teamError } = await supabase
      .from("team_applications")
      .select("*")
      .order("created_at", { ascending: false });

    if (teamError) {
      console.error("TEAM APPLICATION ERROR:", teamError);
      setErrorMessage(teamError.message);
    }

    const { data: volunteerData, error: volunteerError } = await supabase
      .from("volunteer_applications")
      .select("*")
      .order("created_at", { ascending: false });

    if (volunteerError) {
      console.error(
        "VOLUNTEER APPLICATION ERROR:",
        volunteerError
      );
      setErrorMessage(volunteerError.message);
    }

    setTeamApplications(teamData || []);
    setVolunteerApplications(volunteerData || []);

    setLoading(false);
  }

  useEffect(() => {
    loadApplications();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString("en-NG", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  return (
    <main className="min-h-screen bg-orange-50">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="border-b border-orange-100 bg-white">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          <div className="flex items-center gap-4">

            <img
              src="/logo.png"
              alt="The Refinery International"
              className="h-14 w-auto object-contain"
            />

            <div className="hidden sm:block">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-orange-500">
                Administration
              </p>

              <h1 className="mt-1 text-lg font-bold text-gray-900">
                The Refinery International
              </h1>
            </div>

          </div>


          <button
            onClick={handleLogout}
            className="rounded-full border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-orange-500 hover:text-orange-500"
          >
            Logout
          </button>

        </div>

      </header>



      {/* =====================================================
          DASHBOARD
      ===================================================== */}

      <section className="px-6 py-10 sm:py-14">

        <div className="mx-auto max-w-7xl">

          {/* Heading */}

          <div className="mb-10">

            <p className="text-sm font-bold uppercase tracking-[0.3em] text-orange-500">
              Admin Dashboard
            </p>

            <h2 className="mt-3 text-3xl font-bold text-gray-900 sm:text-4xl">
              Applications
            </h2>

            <p className="mt-3 max-w-2xl text-gray-600">
              Review and manage people who have expressed interest
              in serving with The Refinery International.
            </p>

          </div>



          {/* =================================================
              STAT CARDS
          ================================================= */}

          <div className="grid gap-5 sm:grid-cols-2">

            {/* Team */}

            <div className="rounded-3xl bg-white p-6 shadow-sm">

              <p className="text-sm font-semibold text-gray-500">
                Team Member Applications
              </p>

              <p className="mt-3 text-4xl font-bold text-gray-900">
                {teamApplications.length}
              </p>

              <p className="mt-2 text-sm text-gray-500">
                People interested in joining the ministry team
              </p>

            </div>


            {/* Volunteer */}

            <div className="rounded-3xl bg-white p-6 shadow-sm">

              <p className="text-sm font-semibold text-gray-500">
                Volunteer Applications
              </p>

              <p className="mt-3 text-4xl font-bold text-gray-900">
                {volunteerApplications.length}
              </p>

              <p className="mt-2 text-sm text-gray-500">
                People interested in serving at programmes and outreaches
              </p>

            </div>

          </div>



          {/* Error */}

          {errorMessage && (
            <div className="mt-8 rounded-2xl bg-red-100 px-5 py-4 text-sm text-red-700">
              <strong>Database error:</strong> {errorMessage}
            </div>
          )}



          {/* =================================================
              TEAM APPLICATIONS
          ================================================= */}

          <section className="mt-10 rounded-3xl bg-white shadow-sm">

            <div className="border-b border-gray-100 px-6 py-6 sm:px-8">

              <h3 className="text-2xl font-bold text-gray-900">
                Team Member Applications
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                People who have expressed interest in becoming
                part of The Refinery International team.
              </p>

            </div>


            {loading ? (

              <div className="px-6 py-12 text-center text-gray-500">
                Loading applications...
              </div>

            ) : teamApplications.length === 0 ? (

              <div className="px-6 py-12 text-center text-gray-500">
                No team member applications yet.
              </div>

            ) : (

              <div className="overflow-x-auto">

                <table className="w-full min-w-[900px]">

                  <thead className="bg-orange-50">

                    <tr>

                      <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                        Name
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                        Contact
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                        Department
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                        Reason
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                        Date
                      </th>

                    </tr>

                  </thead>


                  <tbody className="divide-y divide-gray-100">

                    {teamApplications.map((application) => (

                      <tr
                        key={application.id}
                        className="transition hover:bg-orange-50/50"
                      >

                        <td className="px-6 py-5">

                          <p className="font-semibold text-gray-900">
                            {application.full_name}
                          </p>

                        </td>


                        <td className="px-6 py-5">

                          <p className="text-sm text-gray-700">
                            {application.email}
                          </p>

                          <p className="mt-1 text-sm text-gray-500">
                            {application.phone}
                          </p>

                        </td>


                        <td className="px-6 py-5 text-sm text-gray-700">
                          {application.department}
                        </td>


                        <td className="max-w-xs px-6 py-5 text-sm leading-relaxed text-gray-600">
                          {application.reason}
                        </td>


                        <td className="whitespace-nowrap px-6 py-5 text-sm text-gray-500">
                          {formatDate(application.created_at)}
                        </td>

                      </tr>

                    ))}

                  </tbody>

                </table>

              </div>

            )}

          </section>



          {/* =================================================
              VOLUNTEER APPLICATIONS
          ================================================= */}

          <section className="mt-10 rounded-3xl bg-white shadow-sm">

            <div className="border-b border-gray-100 px-6 py-6 sm:px-8">

              <h3 className="text-2xl font-bold text-gray-900">
                Volunteer Applications
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                People who would like to serve at specific
                programmes, outreaches, or camp meetings.
              </p>

            </div>


            {loading ? (

              <div className="px-6 py-12 text-center text-gray-500">
                Loading applications...
              </div>

            ) : volunteerApplications.length === 0 ? (

              <div className="px-6 py-12 text-center text-gray-500">
                No volunteer applications yet.
              </div>

            ) : (

              <div className="overflow-x-auto">

                <table className="w-full min-w-[900px]">

                  <thead className="bg-orange-50">

                    <tr>

                      <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                        Name
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                        Contact
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                        Programme
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                        How They'd Like To Serve
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                        Date
                      </th>

                    </tr>

                  </thead>


                  <tbody className="divide-y divide-gray-100">

                    {volunteerApplications.map((application) => (

                      <tr
                        key={application.id}
                        className="transition hover:bg-orange-50/50"
                      >

                        <td className="px-6 py-5">

                          <p className="font-semibold text-gray-900">
                            {application.full_name}
                          </p>

                        </td>


                        <td className="px-6 py-5">

                          <p className="text-sm text-gray-700">
                            {application.email}
                          </p>

                          <p className="mt-1 text-sm text-gray-500">
                            {application.phone}
                          </p>

                        </td>


                        <td className="px-6 py-5 text-sm text-gray-700">
                          {application.programme}
                        </td>


                        <td className="max-w-xs px-6 py-5 text-sm leading-relaxed text-gray-600">
                          {application.reason}
                        </td>


                        <td className="whitespace-nowrap px-6 py-5 text-sm text-gray-500">
                          {formatDate(application.created_at)}
                        </td>

                      </tr>

                    ))}

                  </tbody>

                </table>

              </div>

            )}

          </section>



          {/* Refresh */}

          <div className="mt-8 text-center">

            <button
              onClick={loadApplications}
              disabled={loading}
              className="rounded-full bg-orange-500 px-7 py-3 font-semibold text-white transition hover:bg-orange-600 disabled:opacity-60"
            >
              {loading ? "Refreshing..." : "Refresh Applications"}
            </button>

          </div>

        </div>

      </section>



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