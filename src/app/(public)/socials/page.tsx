import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";

export default function SocialsPage() {
  const socialLinks = [
    {
      name: "Instagram",
      handle: "@therefineryinternational",
      description: "Daily devotions, event snapshots, and ministry highlights.",
      href: "https://www.instagram.com/therefineryinternational?igsi=bzBucWxoa2psc3R6",
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
        <svg className="h-6 w-6 fill-currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
        </svg>
      ),
    },
    {
      name: "TikTok",
      handle: "@therefineryinternational",
      description: "Short-form teachings, camp moments, and youth engagement clips.",
      href: "https://tiktok.com/@therefineryintern",
      accent: "hover:border-cyan-500/50 hover:bg-cyan-500/10",
      badge: "from-cyan-500 to-blue-500",
      icon: (
        <svg className="h-6 w-6 fill-currentColor" viewBox="0 0 24 24">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.46 6.27 6.27 0 0 0 1.87-4.46v-7.1a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-.87.01z" />
        </svg>
      ),
    },
    {
      name: "Facebook",
      handle: "The Refinery International",
      description: "Ministry announcements, articles, testimonies, and live sessions.",
      href: "https://www.facebook.com/share/1d6ErfNYAg/",
      accent: "hover:border-blue-500/50 hover:bg-blue-500/10",
      badge: "from-blue-600 to-indigo-500",
      icon: (
        <svg className="h-6 w-6 fill-currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
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
            <Link
              href="/contact"
              className="rounded-full bg-orange-500 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
            >
              Contact Us
            </Link>
            <Link
              href="/partner"
              className="rounded-full border border-gray-700 bg-white/5 px-6 py-2.5 text-sm font-semibold text-gray-200 transition hover:bg-white/10"
            >
              Partner With Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}