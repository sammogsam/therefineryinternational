"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CalendarDays, Images } from "lucide-react";
import { supabase } from "@/lib/supabase";

type Resource = {
  id: string;
  title: string;
  slug: string;
  type: string;
  category: string | null;
  description: string | null;
  content: string | null;
  cover_image: string | null;
  gallery_images: string[] | null;
  event_name: string | null;
  resource_date: string | null;
  status: string;
};

export default function SingleResourcePage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [resource, setResource] = useState<Resource | null>(null);
  const [imageList, setImageList] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadEventData() {
      if (!slug) return;

      const { data: resData, error } = await supabase
        .from("resources")
        .select("*")
        .eq("slug", slug)
        .single();

      if (error || !resData) {
        setLoading(false);
        return;
      }

      setResource(resData);

      // 1. Gather images from the direct array column
      let photos: string[] = [];
      if (Array.isArray(resData.gallery_images) && resData.gallery_images.length > 0) {
        photos = [...resData.gallery_images];
      }

      // 2. Fetch from the relational table as fallback/extension if exists
      const { data: relImages } = await supabase
        .from("resource_images")
        .select("image_url")
        .eq("resource_id", resData.id)
        .order("created_at", { ascending: true });

      if (relImages && relImages.length > 0) {
        const extraUrls = relImages.map((img) => img.image_url);
        photos = Array.from(new Set([...photos, ...extraUrls]));
      }

      // 3. Fallback to cover_image if no gallery photos were found
      if (photos.length === 0 && resData.cover_image) {
        photos = [resData.cover_image];
      }

      setImageList(photos);
      setLoading(false);
    }

    loadEventData();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-orange-200 border-t-orange-500" />
      </div>
    );
  }

  if (!resource) {
    return (
      <div className="py-24 text-center">
        <h2 className="text-2xl font-bold text-gray-900">Album not found</h2>
        <Link href="/explore" className="mt-4 inline-block font-semibold text-orange-600 underline">
          Back to Explore
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-16">
      <div className="mx-auto max-w-6xl px-6">
        <Link
          href="/explore"
          className="inline-flex items-center gap-2 text-sm font-semibold text-orange-600 transition hover:text-orange-700"
        >
          <ArrowLeft size={16} /> Back to Explore
        </Link>

        <div className="mt-6 rounded-3xl border border-gray-200 bg-white p-8 shadow-sm sm:p-12">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-orange-100 px-3.5 py-1 text-xs font-semibold text-orange-700">
              {resource.category || resource.type}
            </span>
            {resource.event_name && (
              <span className="rounded-full bg-gray-100 px-3.5 py-1 text-xs font-medium text-gray-600">
                {resource.event_name}
              </span>
            )}
          </div>

          <h1 className="mt-4 text-3xl font-bold text-gray-900 sm:text-5xl">
            {resource.title}
          </h1>

          {resource.resource_date && (
            <p className="mt-3 flex items-center gap-2 text-sm text-gray-500">
              <CalendarDays size={16} className="text-orange-500" />
              {new Date(resource.resource_date + "T00:00:00").toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          )}

          {resource.description && (
            <p className="mt-4 text-base leading-relaxed text-gray-700">
              {resource.description}
            </p>
          )}

          {resource.content && (
            <div className="mt-6 whitespace-pre-line text-base leading-relaxed text-gray-800">
              {resource.content}
            </div>
          )}

          {/* Photo Gallery Grid */}
          <div className="mt-12 border-t border-gray-100 pt-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Event Pictures</h2>
              <span className="text-xs font-semibold text-gray-500">
                {imageList.length} Photos
              </span>
            </div>

            {imageList.length > 0 ? (
              <div className="mt-6 grid gap-6 sm:grid-cols-2 md:grid-cols-3">
                {imageList.map((url, idx) => (
                  <div
                    key={`${url}-${idx}`}
                    className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-gray-100 shadow-sm"
                  >
                    <img
                      src={url}
                      alt={`${resource.title} - photo ${idx + 1}`}
                      className="h-64 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-6 rounded-2xl border border-dashed border-gray-300 p-8 text-center text-gray-500">
                <Images size={36} className="mx-auto text-gray-400" />
                <p className="mt-2 text-sm">No photos uploaded for this album yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}