import { Bell, Search } from "lucide-react";

export default function Header() {
  return (
    <header className="flex items-center justify-between border-b border-gray-200 bg-white px-8 py-6">

      {/* Left Side */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back 👋
        </h1>

        <p className="mt-2 text-base text-gray-500">
          Continue raising and refining the next generation.
        </p>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-5">

        {/* Search */}
        <div className="flex w-80 items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 px-5 py-3">

          <Search size={20} className="text-gray-400" />

          <input
            type="text"
            placeholder="Search..."
            className="w-full bg-transparent outline-none"
          />

        </div>

        {/* Notification */}
        <button className="rounded-2xl bg-orange-100 p-4 transition hover:bg-orange-200">

          <Bell size={22} className="text-orange-600" />

        </button>

      </div>

    </header>
  );
}