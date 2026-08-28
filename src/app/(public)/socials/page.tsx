import { ArrowUpRight, Sparkles } from "lucide-react";

export default function SocialsPage() {
  const socialLinks = [
    {
      name: "Instagram",
      handle: "@therefineryintl",
      description: "Daily devotions, event snapshots, and ministry highlights.",
      href: "https://instagram.com/therefineryintl",
      accent: "hover:border-pink-500/50 hover:bg-pink-500/10",
      badge: "from-pink-500 to-rose-500",
      icon: (
        <svg className="h-6 w-6 fill-none stroke-current stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
          <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
        </svg>
      ),
    },
    {
      name: "WhatsApp Community",
      handle: "Refinery Broadcast & Groups",
      description: "Instant event notifications, prayer updates, and community connection.",
      href: "https://chat.whatsapp.com/your-group-invite",
      accent: "hover:border-emerald-500/50 hover:bg-emerald-500/10",
      badge: "from-emerald-600 to-green-500",
      icon: (
        <svg className="h-6 w-6 fill-none stroke-current stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
        </svg>
      ),
    },
    {
      name: "TikTok",
      handle: "@therefineryintl",
      description: "Short-form teachings, camp moments, and youth engagement clips.",
      href: "https://tiktok.com/@therefineryintl",
      accent: "hover:border-cyan-500/50 hover:bg-cyan-500/10",
      badge: "from-cyan-500 to-blue-500",
      icon: (
        <svg className="h-6 w-6 fill-currentColor" viewBox="0 0 24 24">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.49 6.3 6.3 0 0 0 1.86-4.49V8.58a8.28 8.28 0 0 0 4.91 1.56V6.69z" />
        </svg>
      ),
    },
    {
      name: "Facebook",
      handle: "The Refinery International",
      description: "Ministry announcements, articles, testimonies, and live sessions.",
      href: "https://facebook.com/therefineryintl",
      accent: "hover:border-blue-500/50 hover:bg-blue-500/10",
      badge: "from-blue-600 to-indigo-500",
      icon: (
        <svg className="h-6 w-6 fill-none stroke-current stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 py-16 text-white sm:py-24">
      <div className="mx-auto max-w-4xl px-6">
        {/* Header */}
        <div className="text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-orange-400">
            <Sparkles size={14} /> Connect With Our Family
          </span>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-5xl">
            Follow The Refinery
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-gray-400 sm:text-lg">
            Stay connected with what God is doing across our programmes, outreaches, and youth camp meetings through our social channels.
          </p>
        </div>

        {/* 4 Social Link Cards */}
        <div className="mt-12 space-y-4">
          {socialLinks.map((item) => (
            <a
              key={item.name}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`group flex items-center justify-between rounded-2xl border border-gray-800 bg-black/60 p-5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 sm:p-6 ${item.accent}`}
            >
              <div className="flex items-center gap-4 sm:gap-5">
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${item.badge} text-white shadow-md`}
                >
                  {item.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-white sm:text-lg">
                      {item.name}
                    </h2>
                    <span className="text-xs font-medium text-gray-500">
                      {item.handle}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-gray-400 sm:text-sm">
                    {item.description}
                  </p>
                </div>
              </div>

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gray-800 bg-slate-900/60 text-gray-400 transition group-hover:border-orange-500 group-hover:bg-orange-500 group-hover:text-white">
                <ArrowUpRight size={18} />
              </div>
            </a>
          ))}
        </div>

        {/* Bottom Banner */}
        <div className="mt-12 rounded-3xl border border-orange-500/20 bg-gradient-to-r from-orange-950/40 via-black to-slate-950 p-8 text-center sm:p-10">
          <h3 className="text-xl font-bold text-white sm:text-2xl">
            Have questions or want to partner?
          </h3>
          <p className="mx-auto mt-2 max-w-xl text-sm text-gray-400">
            Reach our ministry team directly or explore opportunities to collaborate with us.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <a
              href="/contact"
              className="rounded-full bg-orange-500 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
            >
              Contact Us
            </a>
            <a
              href="/partner"
              className="rounded-full border border-gray-700 bg-white/5 px-6 py-2.5 text-sm font-semibold text-gray-200 transition hover:bg-white/10"
            >
              Partner With Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}