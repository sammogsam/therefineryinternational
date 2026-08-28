"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  CalendarDays,
  FileText,
  Users,
  UserPlus,
  Mail,
  Settings,
  LogOut,
  HeartHandshake,
  Handshake,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const links = [
    {
      name: "Dashboard",
      href: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Support Pledges",
      href: "/admin/support",
      icon: HeartHandshake,
    },
    {
      name: "Partnerships",
      href: "/admin/partnerships",
      icon: Handshake,
    },
    {
      name: "Events",
      href: "/admin/events",
      icon: CalendarDays,
    },
    {
      name: "Resources",
      href: "/admin/resources",
      icon: FileText,
    },
    {
      name: "Team Applications",
      href: "/admin/team",
      icon: Users,
    },
    {
      name: "Volunteer Applications",
      href: "/admin/volunteers",
      icon: UserPlus,
    },
    {
      name: "Messages",
      href: "/admin/messages",
      icon: Mail,
    },
    {
      name: "Settings",
      href: "/admin/settings",
      icon: Settings,
    },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/admin/login");
  };

  return (
    <aside className="flex min-h-screen w-72 flex-col bg-slate-950 text-white">
      {/* Logo */}
      <div className="border-b border-slate-800 px-6 py-10">
        <Image
          src="/logo.png"
          alt="The Refinery"
          width={180}
          height={80}
          className="mx-auto h-auto w-44"
          priority
        />
        <h2 className="mt-6 text-center text-2xl font-bold tracking-wide">
          Administration
        </h2>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1.5 p-5">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);

          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex items-center gap-4 rounded-xl px-4 py-3 text-sm font-medium transition ${
                isActive
                  ? "bg-orange-500 text-white shadow-sm"
                  : "text-slate-300 hover:bg-slate-900 hover:text-white"
              }`}
            >
              <Icon size={20} />
              <span>{link.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-slate-800 p-5">
        <p className="font-semibold text-white">Samuel Mogaji</p>
        <p className="text-sm text-slate-400">Founder</p>

        <button
          type="button"
          onClick={handleLogout}
          className="mt-5 flex items-center gap-2 text-sm text-red-400 transition hover:text-red-300"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}