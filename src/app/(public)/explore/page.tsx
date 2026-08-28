"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  BookOpen,
  CalendarDays,
  Image as ImageIcon,
  Heart,
  ArrowRight,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

type Resource = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  content: string | null;
  cover_image: string | null;
  event_name: string | null;
  event_date?: string | null;
  resource_date?: string | null;
  status: string;
  featured: boolean;
  type: string | null;
  category?: string | null;
};

export default function ExplorePage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadResources() {
      setLoading(true);
      setError("");

      const { data, error } = await supabase
        .from("resources")
        .select("*")
        .eq("status", "Published")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching explore resources:", error);
        setError(error.message);
        setLoading(false);
        return;
      }

      setResources(data || []);
      setLoading(false);
    }

    loadResources();
  }, []);

  function formatDate(date: string | null | undefined) {
    if (!date) return "";
    const cleanDate = date.includes("T") ? date.split("T")[0] : date;
    return new Date(cleanDate + "T00:00:00").toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  // Robust category and keyword categorization
  const articles = resources.filter((r) => {
    const cat = r.category?.toLowerCase() || "";
    const typ = r.type?.toLowerCase() || "";
    return cat === "article" || cat === "articles" || cat === "teaching" || typ === "article";
  });

  const campMeetings = resources.filter((r) => {
    const cat = r.category?.toLowerCase() || "";
    const title = r.title?.toLowerCase() || "";
    const evName = r.event_name?.toLowerCase() || "";
    return cat === "camp" || cat === "camp meeting" || cat === "camp meetings" || title.includes("camp") || evName.includes("camp");
  });

  const outreaches = resources.filter((r) => {
    const cat = r.category?.toLowerCase() || "";
    const title = r.title?.toLowerCase() || "";
    const evName = r.event_name?.toLowerCase() || "";
    return (
      cat === "outreach" ||
      cat === "outreaches" ||
      title.includes("outreach") ||
      evName.includes("outreach")
    );
  });

  function EventAlbumCard({ resource }: { resource: Resource }) {
    const isGallery = resource.type?.toLowerCase() === "gallery" || resource.type?.toLowerCase() === "photo";
    const displayDate = resource.event_date || resource.resource_date;

    return (
      <article className="group flex flex-col overflow-hidden rounded-3xl border border-gray-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-xl">
        {/* Cover Image */}
        <div className="relative h-52 w-full overflow-hidden bg-slate-900">
          {resource.cover_image ? (
            <img
              src={resource.cover_image}
              alt={resource.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-orange-50">
              {isGallery ? (
                <ImageIcon size={44} className="text-orange-400" />
              ) : (
                <BookOpen size={44} className="text-orange-400" />
              )}
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-3.5 left-3.5 flex gap-2">
            {resource.featured && (
              <span className="rounded-full bg-orange-500/90 px-3 py-1 text-xs font-semibold text-white shadow-sm backdrop-blur-md">
                Featured
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col justify-between p-6">
          <div>
            {displayDate && (
              <div className="flex items-center gap-1.5 text-xs font-semibold text-orange-600">
                <CalendarDays size={14} />
                <span>{formatDate(displayDate)}</span>
              </div>
            )}

            <h3 className="mt-2 text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors">
              {resource.title}
            </h3>

            {resource.description && (
              <p className="mt-2.5 line-clamp-2 text-sm leading-relaxed text-gray-600">
                {resource.description}
              </p>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100">
            <Link
              href={`/explore/${resource.slug || resource.id}`}
              className="inline-flex items-center gap-2 text-sm font-bold text-orange-600 hover:text-orange-700"
            >
              <span>{isGallery ? "Explore Album & Photos" : "Read Full Story"}</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </article>
    );
  }

  function CategorySection({
    title,
    description,
    icon,
    items,
    emptyMessage,
  }: {
    title: string;
    description: string;
    icon: React.ReactNode;
    items: Resource[];
    emptyMessage: string;
  }) {
    return (
      <div className="rounded-3xl border border-gray-200/80 bg-gray-50/70 p-6 sm:p-8">
        <div className="mb-6 flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-100 text-orange-600 shadow-sm">
            {icon}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
            <p className="mt-1 text-sm text-gray-600">{description}</p>
          </div>
        </div>

        {items.length > 0 ? (
          <div className="space-y-6">
            {items.map((item) => (
              <EventAlbumCard key={item.id} resource={item} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center">
            <ImageIcon size={36} className="mx-auto text-orange-400" />
            <p className="mt-3 text-sm text-gray-500">{emptyMessage}</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-orange-500 py-16 text-center text-white sm:py-20 md:py-24">
        <div className="mx-auto max-w-5xl px-6">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-100 sm:text-sm">
            Explore The Refinery
          </span>
          <h1 className="mt-4 text-4xl font-bold sm:text-5xl md:text-6xl">
            Stories, Articles & Memories
          </h1>
          <p className="mx-auto mt-5 max-w-3xl text-base leading-relaxed text-orange-50 sm:text-lg">
            Discover each camp meeting, outreach, and reflection from The Refinery in its own distinct album and picture gallery.
          </p>
        </div>
      </section>

      {/* Grid Content */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-6">
          {loading && (
            <div className="py-16 text-center">
              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-orange-200 border-t-orange-500" />
              <p className="mt-4 text-gray-500">Loading albums and memories...</p>
            </div>
          )}

          {!loading && error && (
            <div className="rounded-2xl bg-red-50 p-6 text-red-700">
              <p className="font-semibold">Unable to load explore albums.</p>
              <p className="mt-1 text-sm">{error}</p>
            </div>
          )}

          {!loading && !error && (
            <div className="grid gap-8 lg:grid-cols-3">
              {/* Articles */}
              <CategorySection
                title="Articles"
                description="Reflections, lessons, and written teachings."
                icon={<BookOpen size={24} />}
                items={articles}
                emptyMessage="Articles will appear here as we publish new stories."
              />

              {/* Camp Meetings */}
              <CategorySection
                title="Camp Meetings"
                description="Distinct albums and photos from every camp meeting."
                icon={<ImageIcon size={24} />}
                items={campMeetings}
                emptyMessage="Camp meeting albums and memories will appear here."
              />

              {/* Outreaches */}
              <CategorySection
                title="Outreaches"
                description="Memories from communities and schools visited."
                icon={<Heart size={24} />}
                items={outreaches}
                emptyMessage="Outreach albums and pictures will appear here."
              />
            </div>
          )}
        </div>
      </section>
    </main>
  );
}