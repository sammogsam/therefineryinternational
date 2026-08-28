"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  HeartHandshake,
  Handshake,
  Mail,
  Users,
  UserPlus,
  CalendarDays,
  BookOpen,
  Image as ImageIcon,
  ArrowRight,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

type DashboardCounts = {
  supportPledges: number;
  partnerships: number;
  unreadMessages: number;
  teamApplications: number;
  volunteerApplications: number;
  eventsCount: number;
  articlesCount: number;
  galleryPhotosCount: number;
};

type RecentItem = {
  id: string;
  name: string;
  type: "Team Application" | "Volunteer Application" | "Message";
  status: string;
  date: string;
};

type UpcomingEvent = {
  id: string;
  title: string;
  event_date: string;
};

export default function AdminDashboard() {
  const [counts, setCounts] = useState<DashboardCounts>({
    supportPledges: 0,
    partnerships: 0,
    unreadMessages: 0,
    teamApplications: 0,
    volunteerApplications: 0,
    eventsCount: 0,
    articlesCount: 0,
    galleryPhotosCount: 0,
  });

  const [recentApplications, setRecentApplications] = useState<RecentItem[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<UpcomingEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      setLoading(true);

      try {
        // 1. Live Table Counts
        const [
          { count: supportCount },
          { count: partnersCount },
          { count: messagesCount },
          { count: teamCount },
          { count: volunteerCount },
          { count: eventsCount },
        ] = await Promise.all([
          supabase.from("support_pledges").select("*", { count: "exact", head: true }),
          supabase.from("partnerships").select("*", { count: "exact", head: true }),
          supabase.from("contact_messages").select("*", { count: "exact", head: true }),
          supabase.from("team_applications").select("*", { count: "exact", head: true }),
          supabase.from("volunteer_applications").select("*", { count: "exact", head: true }),
          supabase.from("events").select("*", { count: "exact", head: true }),
        ]);

        // 2. Fetch Resources to compute exact Articles & Photo counts
        const { data: resourcesData } = await supabase
          .from("resources")
          .select("category, type, cover_image, gallery_images")
          .eq("status", "Published");

        let articles = 0;
        let totalImages = 0;

        if (resourcesData) {
          resourcesData.forEach((res) => {
            if (
              res.category?.toLowerCase() === "articles" ||
              res.type?.toLowerCase() === "article"
            ) {
              articles += 1;
            }
            if (res.cover_image) totalImages += 1;
            if (Array.isArray(res.gallery_images)) {
              totalImages += res.gallery_images.length;
            }
          });
        }

        setCounts({
          supportPledges: supportCount || 0,
          partnerships: partnersCount || 0,
          unreadMessages: messagesCount || 0,
          teamApplications: teamCount || 0,
          volunteerApplications: volunteerCount || 0,
          eventsCount: eventsCount || 0,
          articlesCount: articles,
          galleryPhotosCount: totalImages,
        });

        // 3. Fetch Recent Applications / Inquiries
        const [recentTeam, recentVolunteers] = await Promise.all([
          supabase
            .from("team_applications")
            .select("id, full_name, status, created_at")
            .order("created_at", { ascending: false })
            .limit(3),
          supabase
            .from("volunteer_applications")
            .select("id, full_name, status, created_at")
            .order("created_at", { ascending: false })
            .limit(3),
        ]);

        const combinedRecent: RecentItem[] = [
          ...(recentTeam.data || []).map((t) => ({
            id: t.id,
            name: t.full_name || "Applicant",
            type: "Team Application" as const,
            status: t.status || "Pending",
            date: t.created_at,
          })),
          ...(recentVolunteers.data || []).map((v) => ({
            id: v.id,
            name: v.full_name || "Volunteer",
            type: "Volunteer Application" as const,
            status: v.status || "Pending",
            date: v.created_at,
          })),
        ]
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 5);

        setRecentApplications(combinedRecent);

        // 4. Fetch Upcoming Events
        const { data: eventsList } = await supabase
          .from("events")
          .select("id, title, event_date")
          .gte("event_date", new Date().toISOString().split("T")[0])
          .order("event_date", { ascending: true })
          .limit(4);

        setUpcomingEvents(eventsList || []);
      } catch (err) {
        console.error("Error loading dashboard metrics:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  const statCards = [
    {
      title: "Support Pledges",
      value: counts.supportPledges,
      subtext: "Bibles, materials & seeds",
      icon: HeartHandshake,
      href: "/admin/support",
    },
    {
      title: "Partnerships",
      value: counts.partnerships,
      subtext: "Outreaches & camps",
      icon: Handshake,
      href: "/admin/partnerships",
    },
    {
      title: "Messages",
      value: counts.unreadMessages,
      subtext: "Enquiries & direct invites",
      icon: Mail,
      href: "/admin/messages",
    },
    {
      title: "Team Applications",
      value: counts.teamApplications,
      subtext: "Core ministry applicants",
      icon: Users,
      href: "/admin/team",
    },
    {
      title: "Volunteer Applications",
      value: counts.volunteerApplications,
      subtext: "Program volunteers",
      icon: UserPlus,
      href: "/admin/volunteers",
    },
    {
      title: "Events",
      value: counts.eventsCount,
      subtext: "Published programmes",
      icon: CalendarDays,
      href: "/admin/events",
    },
    {
      title: "Explore Articles",
      value: counts.articlesCount,
      subtext: "Published teachings",
      icon: BookOpen,
      href: "/admin/resources",
    },
    {
      title: "Gallery",
      value: counts.galleryPhotosCount,
      subtext: "Photos in albums",
      icon: ImageIcon,
      href: "/admin/resources",
    },
  ];

  return (
    <div className="p-6 md:p-10">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="mt-1 text-sm text-gray-500">
          Monitor real-time activity and metrics across The Refinery International.
        </p>
      </div>

      {/* Dynamic Counter Grid */}
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.title}
              href={card.href}
              className="group flex flex-col justify-between rounded-3xl border border-gray-100 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-orange-200 hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-semibold text-gray-500">{card.title}</span>
                  <div className="mt-2 text-3xl font-black text-gray-900">
                    {loading ? (
                      <span className="inline-block h-8 w-12 animate-pulse rounded bg-gray-100" />
                    ) : (
                      card.value
                    )}
                  </div>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-orange-500 transition group-hover:bg-orange-500 group-hover:text-white">
                  <Icon size={22} />
                </div>
              </div>
              <p className="mt-4 text-xs font-medium text-gray-400">{card.subtext}</p>
            </Link>
          );
        })}
      </div>

      {/* Two Column Bottom Widgets */}
      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        {/* Real Recent Applications */}
        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <h2 className="text-lg font-bold text-gray-900">Recent Applications</h2>
            <Link
              href="/admin/volunteers"
              className="flex items-center gap-1 text-xs font-bold text-orange-600 hover:text-orange-700"
            >
              <span>View all</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="mt-4 divide-y divide-gray-50">
            {recentApplications.length === 0 ? (
              <div className="py-8 text-center text-sm text-gray-400">
                No recent applications received yet.
              </div>
            ) : (
              recentApplications.map((item) => (
                <div key={`${item.type}-${item.id}`} className="flex items-center justify-between py-3.5">
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">{item.name}</h3>
                    <p className="text-xs text-gray-400">{item.type}</p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      item.status?.toLowerCase() === "approved"
                        ? "bg-green-100 text-green-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {item.status || "Pending"}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Real Upcoming Events */}
        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <h2 className="text-lg font-bold text-gray-900">Upcoming Events</h2>
            <Link
              href="/admin/events"
              className="flex items-center gap-1 text-xs font-bold text-orange-600 hover:text-orange-700"
            >
              <span>Manage</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="mt-4 divide-y divide-gray-50">
            {upcomingEvents.length === 0 ? (
              <div className="py-8 text-center text-sm text-gray-400">
                No upcoming events scheduled. Create one in Events.
              </div>
            ) : (
              upcomingEvents.map((evt) => (
                <div key={evt.id} className="flex items-center justify-between py-3.5">
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">{evt.title}</h3>
                    <p className="text-xs text-orange-600 font-medium">
                      {new Date(evt.event_date).toLocaleDateString("en-GB", {
                        weekday: "short",
                        day: "numeric",
                        month: "long",
                      })}
                    </p>
                  </div>
                  <span className="rounded-lg bg-orange-50 px-2.5 py-1 text-xs font-bold text-orange-700">
                    Scheduled
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}