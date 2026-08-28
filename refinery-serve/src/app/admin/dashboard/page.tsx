"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  UserPlus,
  LogOut,
  RefreshCw,
  ArrowRight,
  ShieldCheck,
  ClipboardList,
  CheckCircle2,
  LayoutDashboard,
  Clock3,
} from "lucide-react";

import { supabase } from "@/lib/supabase";

export default function AdminDashboard() {
  const router = useRouter();

  const [checkingAccess, setCheckingAccess] = useState(true);
  const [loading, setLoading] = useState(false);

  const [teamCount, setTeamCount] = useState(0);
  const [volunteerCount, setVolunteerCount] = useState(0);

  const [error, setError] = useState("");

  async function checkAdminAndLoadData() {
    setCheckingAccess(true);
    setError("");

    // Check login
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.replace("/admin/login");
      return;
    }

    // Check administrator status
    const { data: isAdmin, error: adminError } =
      await supabase.rpc("is_admin");

    if (adminError) {
      console.error("ADMIN CHECK ERROR:", adminError);

      setError("We could not verify administrator access.");
      setCheckingAccess(false);
      return;
    }

    if (!isAdmin) {
      await supabase.auth.signOut();

      router.replace("/admin/login");
      return;
    }

    // Load team applications
    const {
      count: teamApplications,
      error: teamError,
    } = await supabase
      .from("team_applications")
      .select("*", {
        count: "exact",
        head: true,
      });

    // Load volunteer applications
    const {
      count: volunteerApplications,
      error: volunteerError,
    } = await supabase
      .from("volunteer_applications")
      .select("*", {
        count: "exact",
        head: true,
      });

    if (teamError || volunteerError) {
      console.error(
        "APPLICATION COUNT ERROR:",
        teamError || volunteerError
      );

      setError(
        "We could not load the application statistics."
      );
    }

    setTeamCount(teamApplications ?? 0);
    setVolunteerCount(volunteerApplications ?? 0);

    setCheckingAccess(false);
  }

  useEffect(() => {
    checkAdminAndLoadData();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace("/admin/login");
  }

  async function refreshDashboard() {
    setLoading(true);
    await checkAdminAndLoadData();
    setLoading(false);
  }

  if (checkingAccess) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#faf8f6]">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-orange-100 border-t-orange-500" />

          <p className="mt-4 text-sm font-medium text-gray-600">
            Preparing your dashboard...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#faf8f6] text-gray-900">

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 flex-col bg-[#15100f] text-white lg:flex">

        {/* Brand */}

        <div className="border-b border-white/10 px-7 py-7">

          <div className="flex items-center gap-4">

            {/* Logo */}

            <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white p-2 shadow-sm">

              <img
                src="/logo.png"
                alt="The Refinery International"
                className="h-full w-full object-contain"
              />

            </div>


            <div>
              <p className="text-sm font-bold">
                The Refinery
              </p>

              <p className="mt-0.5 text-xs text-white/50">
                Administration Portal
              </p>
            </div>

          </div>

        </div>


        {/* Navigation */}

        <nav className="flex-1 px-4 py-7">

          <p className="px-3 text-[10px] font-bold uppercase tracking-[0.25em] text-white/30">
            Main Menu
          </p>


          <div className="mt-4 space-y-2">

            {/* Dashboard */}

            <button
              onClick={() =>
                router.push("/admin/dashboard")
              }
              className="flex w-full items-center gap-3 rounded-2xl bg-orange-500 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-orange-950/20"
            >
              <LayoutDashboard size={19} />
              Dashboard
            </button>


            {/* Team Applications */}

            <button
              onClick={() =>
                router.push("/admin/applications/team")
              }
              className="flex w-full items-center justify-between rounded-2xl px-4 py-3.5 text-sm font-medium text-white/60 transition hover:bg-white/5 hover:text-white"
            >

              <span className="flex items-center gap-3">
                <Users size={19} />
                Team Applications
              </span>

              <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs">
                {teamCount}
              </span>

            </button>


            {/* Volunteer Applications */}

            <button
              onClick={() =>
                router.push(
                  "/admin/applications/volunteer"
                )
              }
              className="flex w-full items-center justify-between rounded-2xl px-4 py-3.5 text-sm font-medium text-white/60 transition hover:bg-white/5 hover:text-white"
            >

              <span className="flex items-center gap-3">
                <UserPlus size={19} />
                Volunteers
              </span>

              <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs">
                {volunteerCount}
              </span>

            </button>

          </div>

        </nav>


        {/* Sidebar Bottom */}

        <div className="border-t border-white/10 p-4">

          {/* Admin Status */}

          <div className="mb-4 rounded-2xl bg-white/5 p-4">

            <div className="flex items-center gap-3">

              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-500/10 text-green-400">
                <ShieldCheck size={18} />
              </div>

              <div>

                <p className="text-xs font-semibold text-white">
                  Administrator
                </p>

                <p className="mt-0.5 text-[11px] text-white/40">
                  Access verified
                </p>

              </div>

            </div>

          </div>


          {/* Logout */}

          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-white/50 transition hover:bg-red-500/10 hover:text-red-300"
          >
            <LogOut size={18} />
            Sign Out
          </button>

        </div>

      </aside>


      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <div className="lg:pl-72">


        {/* =====================================================
            TOP BAR
        ===================================================== */}

        <header className="sticky top-0 z-20 border-b border-gray-200/70 bg-[#faf8f6]/90 backdrop-blur">

          <div className="flex items-center justify-between px-6 py-5 sm:px-8 lg:px-10">

            <div>

              <p className="text-xs font-bold uppercase tracking-[0.25em] text-orange-500">
                Administration
              </p>

              <h1 className="mt-1 text-xl font-bold text-gray-900 sm:text-2xl">
                Dashboard
              </h1>

            </div>


            <div className="flex items-center gap-2 sm:gap-3">

              {/* Refresh */}

              <button
                onClick={refreshDashboard}
                disabled={loading}
                className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:border-orange-300 hover:text-orange-500 disabled:cursor-not-allowed disabled:opacity-50"
              >

                <RefreshCw
                  size={16}
                  className={
                    loading
                      ? "animate-spin"
                      : ""
                  }
                />

                <span className="hidden sm:inline">
                  Refresh
                </span>

              </button>


              {/* Logout */}

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-xl bg-[#15100f] px-3.5 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800"
              >

                <LogOut size={16} />

                <span className="hidden sm:inline">
                  Logout
                </span>

              </button>

            </div>

          </div>

        </header>


        {/* =====================================================
            PAGE CONTENT
        ===================================================== */}

        <section className="px-6 py-8 sm:px-8 lg:px-10 lg:py-10">

          <div className="mx-auto max-w-7xl">


            {/* Error */}

            {error && (
              <div className="mb-8 flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm text-red-700">

                <Clock3
                  size={18}
                  className="mt-0.5 shrink-0"
                />

                <p>{error}</p>

              </div>
            )}


            {/* =================================================
                WELCOME BANNER
            ================================================= */}

            <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#17100f] via-[#42170c] to-orange-600 px-7 py-8 text-white shadow-xl shadow-orange-950/10 sm:px-10 sm:py-10">

              <div className="relative z-10 max-w-2xl">

                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-semibold text-orange-100 backdrop-blur">

                  <CheckCircle2 size={14} />

                  Administration portal active

                </div>


                <h2 className="text-3xl font-bold leading-tight sm:text-4xl">
                  Welcome back.
                </h2>


                <p className="mt-4 max-w-xl text-sm leading-relaxed text-orange-50/80 sm:text-base">
                  Manage applications and stay informed about people
                  expressing interest in serving with The Refinery
                  International.
                </p>

              </div>


              {/* Decorative Elements */}

              <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-orange-400/10" />

              <div className="absolute -bottom-32 right-20 h-72 w-72 rounded-full bg-white/5" />

            </div>


            {/* =================================================
                OVERVIEW
            ================================================= */}

            <div className="mt-10">

              <p className="text-xs font-bold uppercase tracking-[0.25em] text-orange-500">
                Overview
              </p>

              <h2 className="mt-2 text-2xl font-bold text-gray-900">
                Application Statistics
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                A live overview of applications submitted through
                the recruitment website.
              </p>

            </div>


            {/* =================================================
                STATISTICS
            ================================================= */}

            <div className="mt-6 grid gap-5 md:grid-cols-2">


              {/* Team Applications */}

              <div className="group relative overflow-hidden rounded-[1.75rem] border border-orange-100 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-orange-900/5">

                <div className="flex items-start justify-between">

                  <div>

                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-orange-500">
                      <Users size={23} />
                    </div>

                    <p className="mt-6 text-sm font-semibold text-gray-500">
                      Team Applications
                    </p>

                    <p className="mt-1 text-5xl font-bold tracking-tight text-gray-950">
                      {teamCount}
                    </p>

                  </div>


                  <div className="rounded-full bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700">
                    Live
                  </div>

                </div>


                <div className="mt-7 border-t border-gray-100 pt-5">

                  <button
                    onClick={() =>
                      router.push(
                        "/admin/applications/team"
                      )
                    }
                    className="flex items-center gap-2 text-sm font-bold text-orange-500 transition group-hover:gap-3 hover:text-orange-600"
                  >

                    Review team applications

                    <ArrowRight size={16} />

                  </button>

                </div>

              </div>


              {/* Volunteer Applications */}

              <div className="group relative overflow-hidden rounded-[1.75rem] border border-orange-100 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-orange-900/5">

                <div className="flex items-start justify-between">

                  <div>

                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-orange-500">
                      <UserPlus size={23} />
                    </div>

                    <p className="mt-6 text-sm font-semibold text-gray-500">
                      Volunteer Applications
                    </p>

                    <p className="mt-1 text-5xl font-bold tracking-tight text-gray-950">
                      {volunteerCount}
                    </p>

                  </div>


                  <div className="rounded-full bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700">
                    Live
                  </div>

                </div>


                <div className="mt-7 border-t border-gray-100 pt-5">

                  <button
                    onClick={() =>
                      router.push(
                        "/admin/applications/volunteer"
                      )
                    }
                    className="flex items-center gap-2 text-sm font-bold text-orange-500 transition group-hover:gap-3 hover:text-orange-600"
                  >

                    Review volunteer applications

                    <ArrowRight size={16} />

                  </button>

                </div>

              </div>

            </div>


            {/* =================================================
                QUICK ACTIONS
            ================================================= */}

            <div className="mt-8 grid gap-5 lg:grid-cols-3">


              {/* Team */}

              <button
                onClick={() =>
                  router.push(
                    "/admin/applications/team"
                  )
                }
                className="group flex items-center gap-4 rounded-3xl border border-gray-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-md"
              >

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-700 transition group-hover:bg-orange-50 group-hover:text-orange-500">
                  <ClipboardList size={20} />
                </div>


                <div className="min-w-0">

                  <p className="font-bold text-gray-900">
                    Team Applications
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    Review submitted team applications
                  </p>

                </div>


                <ArrowRight
                  size={17}
                  className="ml-auto shrink-0 text-gray-300 transition group-hover:translate-x-1 group-hover:text-orange-500"
                />

              </button>


              {/* Volunteer */}

              <button
                onClick={() =>
                  router.push(
                    "/admin/applications/volunteer"
                  )
                }
                className="group flex items-center gap-4 rounded-3xl border border-gray-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-md"
              >

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-700 transition group-hover:bg-orange-50 group-hover:text-orange-500">
                  <UserPlus size={20} />
                </div>


                <div className="min-w-0">

                  <p className="font-bold text-gray-900">
                    Volunteer Applications
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    Review volunteer submissions
                  </p>

                </div>


                <ArrowRight
                  size={17}
                  className="ml-auto shrink-0 text-gray-300 transition group-hover:translate-x-1 group-hover:text-orange-500"
                />

              </button>


              {/* System Status */}

              <div className="flex items-center gap-4 rounded-3xl border border-green-100 bg-green-50/70 p-5">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-green-600 shadow-sm">
                  <ShieldCheck size={20} />
                </div>


                <div>

                  <p className="font-bold text-gray-900">
                    Portal Status
                  </p>

                  <p className="mt-1 flex items-center gap-1.5 text-xs font-medium text-green-700">

                    <span className="h-2 w-2 rounded-full bg-green-500" />

                    System operational

                  </p>

                </div>

              </div>

            </div>


            {/* =================================================
                MANAGEMENT INFORMATION
            ================================================= */}

            <div className="mt-8 rounded-[1.75rem] border border-gray-200 bg-white p-7 shadow-sm sm:p-8">

              <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">

                <div className="max-w-2xl">

                  <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
                      <ShieldCheck size={19} />
                    </div>

                    <h3 className="text-lg font-bold text-gray-900">
                      Application Management
                    </h3>

                  </div>


                  <p className="mt-4 text-sm leading-relaxed text-gray-500">
                    Authorized administrators can review applications
                    submitted through The Refinery International&apos;s
                    recruitment website. Application totals shown above
                    are retrieved directly from the database.
                  </p>

                </div>


                {/* Total */}

                <div className="shrink-0 rounded-2xl bg-gray-50 px-5 py-4">

                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Total Applications
                  </p>

                  <p className="mt-1 text-2xl font-bold text-gray-900">
                    {teamCount + volunteerCount}
                  </p>

                </div>

              </div>

            </div>


            {/* =================================================
                FOOTER
            ================================================= */}

            <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-gray-200 pt-6 text-xs text-gray-400 sm:flex-row">

              <p>
                The Refinery International · Administration Portal
              </p>

              <p>
                Authorized access only
              </p>

            </div>

          </div>

        </section>

      </div>

    </main>
  );
}