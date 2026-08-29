"use client";

import { Bell, Search, Menu } from "lucide-react";

export default function Header({ onOpenMobileMenu }: { onOpenMobileMenu?: () => void }) {
  return (
    <header className="flex flex-col gap-4 border-b border-gray-200 bg-white px-4 py-4 sm:px-6 md:flex-row md:items-center md:justify-between md:px-8 md:py-6">

      {/* Left Side */}
      <div className="flex items-center gap-3">
        {/* Mobile Sidebar Toggle Button */}
        <button
          onClick={onOpenMobileMenu}
          className="rounded-xl border border-gray-200 p-2 text-gray-600 hover:bg-gray-50 md:hidden shrink-0"
          aria-label="Open Sidebar"
        >
          <Menu size={22} />
        </button>

        <div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Welcome back 👋
          </h1>

          <p className="mt-1 text-sm text-gray-500 sm:text-base">
            Continue raising and refining the next generation.
          </p>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center justify-between gap-3 sm:gap-5 md:justify-end">

        {/* Search */}
        <div className="flex flex-1 items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-2.5 sm:w-80 sm:px-5 sm:py-3">

          <Search size={20} className="text-gray-400 shrink-0" />

          <input
            type="text"
            placeholder="Search..."
            className="w-full bg-transparent outline-none text-sm"
          />

        </div>

        {/* Notification */}
        <button className="rounded-2xl bg-orange-100 p-3 transition hover:bg-orange-200 sm:p-4 shrink-0">

          <Bell size={20} className="text-orange-600 sm:w-[22px] sm:h-[22px]" />

        </button>

      </div>

    </header>
  );
}