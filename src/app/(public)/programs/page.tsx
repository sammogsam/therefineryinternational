"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Calendar, ArrowRight, Loader2, Sparkles } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function Programs() {
  const [outreaches, setOutreaches] = useState<any[]>([]);
  const [loadingOutreaches, setLoadingOutreaches] = useState(true);

  useEffect(() => {
    async function loadOutreaches() {
      try {
        const { data, error } = await supabase
          .from("resources")
          .select("*")
          .in("category", ["outreach", "camp"])
          .eq("status", "Published")
          .order("event_date", { ascending: false });

        if (!error && data) {
          setOutreaches(data);
        }
      } catch (err) {
        console.error("Error loading outreach records:", err);
      } finally {
        setLoadingOutreaches(false);
      }
    }

    loadOutreaches();
  }, []);

  function formatDate(dateStr: string) {
    if (!dateStr) return "";
    return new Date(dateStr + "T00:00:00").toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  return (
    <main>
      {/* Hero */}
      <section className="bg-orange-500 py-16 text-center text-white sm:py-20 md:py-24">
        <div className="mx-auto max-w-5xl px-6">
          <h1 className="text-4xl font-bold sm:text-5xl md:text-6xl">
            Our Programs
          </h1>
          <p className="mx-auto mt-5 max-w-3xl text-base leading-relaxed text-orange-50 sm:text-lg">
            Creating opportunities for children to encounter God,
            grow in truth, discover purpose, and shine as lights.
          </p>
        </div>
      </section>

      {/* Program Introduction */}
      <section className="bg-white py-16 sm:py-20 md:py-24">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Creating Experiences Where Children Encounter God
          </h2>
          <p className="mx-auto mt-5 max-w-3xl text-base leading-relaxed text-gray-600 sm:text-lg">
            Through intentional programs and activities, children are
            encouraged to grow spiritually, discover their gifts,
            and build meaningful relationships.
          </p>
        </div>
      </section>

      {/* Programs Pillars */}
      <section className="bg-orange-50 py-16 sm:py-20 md:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Bible Experiences */}
            <div className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">
              <div className="text-4xl">📖</div>
              <h3 className="mt-5 text-xl font-bold text-gray-900 sm:text-2xl">
                Bible Experiences
              </h3>
              <p className="mt-3 text-base leading-relaxed text-gray-600">
                Helping children encounter God&apos;s Word through engaging
                teachings, activities, and practical lessons.
              </p>
            </div>

            {/* Creative Expression */}
            <div className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">
              <div className="text-4xl">🎨</div>
              <h3 className="mt-5 text-xl font-bold text-gray-900 sm:text-2xl">
                Creative Expression
              </h3>
              <p className="mt-3 text-base leading-relaxed text-gray-600">
                Providing opportunities for children to discover and
                develop their creativity and talents.
              </p>
            </div>

            {/* Community */}
            <div className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">
              <div className="text-4xl">🤝</div>
              <h3 className="mt-5 text-xl font-bold text-gray-900 sm:text-2xl">
                Community & Fellowship
              </h3>
              <p className="mt-3 text-base leading-relaxed text-gray-600">
                Creating a loving environment where children build
                friendships and grow together.
              </p>
            </div>

            {/* Growth */}
            <div className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">
              <div className="text-4xl">🌱</div>
              <h3 className="mt-5 text-xl font-bold text-gray-900 sm:text-2xl">
                Growth & Leadership
              </h3>
              <p className="mt-3 text-base leading-relaxed text-gray-600">
                Equipping children to become confident, responsible,
                and purpose-driven lights in their generation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Outreaches & Camp Meetings Timeline (Dynamic with Dates & Photos) */}
      <section className="bg-white py-16 sm:py-20 md:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-gray-100 pb-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-orange-500">
                Ministry Footprints & Timeline
              </span>
              <h2 className="mt-2 text-3xl font-bold text-gray-900 sm:text-4xl">
                Outreaches & Camp Meetings
              </h2>
            </div>
            <Link
              href="/support"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-orange-500 hover:text-orange-600"
            >
              <span>Partner with an outreach</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="mt-10">
            {loadingOutreaches ? (
              <div className="py-12 text-center">
                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-orange-100 border-t-orange-500" />
                <p className="mt-4 text-xs text-gray-500">Loading outreach timeline...</p>
              </div>
            ) : outreaches.length === 0 ? (
              <div className="rounded-3xl border border-gray-100 bg-gray-50/50 p-10 text-center">
                <Sparkles size={28} className="mx-auto text-orange-400" />
                <p className="mt-3 text-sm font-semibold text-gray-700">
                  Outreach photo memories and reports will appear here as they are uploaded.
                </p>
              </div>
            ) : (
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {outreaches.map((item) => (
                  <div
                    key={item.id}
                    className="group overflow-hidden rounded-3xl border border-gray-200/80 bg-white shadow-sm transition hover:shadow-md"
                  >
                    {/* Outreach Cover Image & Date Badge */}
                    <div className="relative h-56 w-full overflow-hidden bg-slate-900">
                      {item.cover_image ? (
                        <img
                          src={item.cover_image}
                          alt={item.title}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-orange-100 text-orange-500 font-semibold text-sm">
                          The Refinery Outreach
                        </div>
                      )}

                      {/* Date Badge */}
                      {item.event_date && (
                        <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-slate-950/85 backdrop-blur-md px-3.5 py-1 text-xs font-bold text-orange-400 shadow-md">
                          <Calendar size={13} />
                          {formatDate(item.event_date)}
                        </span>
                      )}

                      {/* Category Badge */}
                      <span className="absolute top-4 right-4 rounded-full bg-orange-500/90 backdrop-blur-md px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
                        {item.category === "camp" ? "Camp Meeting" : "Outreach"}
                      </span>
                    </div>

                    {/* Description & Impact */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-orange-600 transition">
                        {item.title}
                      </h3>
                      {item.description && (
                        <p className="mt-3 text-sm leading-relaxed text-gray-600 line-clamp-3">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Where We Serve */}
      <section className="bg-gray-50 py-16 sm:py-20 md:py-24">
        <div className="mx-auto max-w-5xl px-6 text-center sm:text-left">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Where We Serve
          </h2>
          <p className="mt-5 text-base leading-relaxed text-gray-600 sm:text-lg">
            Through children&apos;s camp meetings and school outreaches,
            The Refinery creates spaces where children can encounter
            God, receive truth, and grow into who God has called them to be.
          </p>
        </div>
      </section>
    </main>
  );
}