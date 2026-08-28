"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Images } from "lucide-react";
import { supabase } from "@/lib/supabase";

type MomentPhoto = {
  url: string;
  title: string;
  slug: string;
};

export default function Gallery() {
  const [photos, setPhotos] = useState<MomentPhoto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLatestMoments() {
      setLoading(true);

      const { data, error } = await supabase
        .from("resources")
        .select("title, slug, cover_image, gallery_images")
        .eq("status", "Published")
        .order("resource_date", { ascending: false })
        .limit(6);

      if (error || !data) {
        console.error("Error loading moments:", error);
        setLoading(false);
        return;
      }

      const extractedPhotos: MomentPhoto[] = [];

      for (const item of data) {
        if (item.cover_image && !extractedPhotos.some((p) => p.url === item.cover_image)) {
          extractedPhotos.push({
            url: item.cover_image,
            title: item.title,
            slug: item.slug,
          });
        }

        if (Array.isArray(item.gallery_images)) {
          for (const imgUrl of item.gallery_images) {
            if (imgUrl && !extractedPhotos.some((p) => p.url === imgUrl)) {
              extractedPhotos.push({
                url: imgUrl,
                title: item.title,
                slug: item.slug,
              });
            }
            if (extractedPhotos.length >= 3) break;
          }
        }

        if (extractedPhotos.length >= 3) break;
      }

      setPhotos(extractedPhotos.slice(0, 3));
      setLoading(false);
    }

    loadLatestMoments();
  }, []);

  return (
    <section className="bg-white py-16 sm:py-20 md:py-24">
      <div className="mx-auto max-w-6xl px-6 text-center">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-orange-500 sm:text-sm">
          Our Moments
        </p>

        <h2 className="mt-3 text-3xl font-bold text-gray-900 sm:text-4xl md:text-5xl">
          Glimpses of The Refinery
        </h2>

        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-gray-600 sm:text-lg">
          Moments of children encountering God, building friendships, discovering purpose, and growing together.
        </p>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {loading ? (
            [1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-80 w-full animate-pulse rounded-3xl bg-orange-100/60"
              />
            ))
          ) : photos.length > 0 ? (
            photos.map((photo, index) => (
              <Link
                key={`${photo.url}-${index}`}
                href={`/explore/${photo.slug}`}
                className="group relative block h-80 overflow-hidden rounded-3xl bg-gray-100 shadow-sm transition hover:-translate-y-1.5 hover:shadow-xl"
              >
                <img
                  src={photo.url}
                  alt={photo.title}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-left text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <p className="text-xs font-semibold uppercase tracking-wider text-orange-300">
                    View Album
                  </p>
                  <h3 className="mt-1 line-clamp-2 text-base font-bold">
                    {photo.title}
                  </h3>
                </div>
              </Link>
            ))
          ) : (
            [1, 2, 3].map((item) => (
              <div
                key={item}
                className="flex h-80 flex-col items-center justify-center rounded-3xl border border-dashed border-orange-200 bg-orange-50/50 p-6 text-center text-orange-400"
              >
                <Images size={40} className="mb-2 opacity-60" />
                <p className="text-sm font-semibold">Upload photos in Resources</p>
              </div>
            ))
          )}
        </div>

        <div className="mt-12">
          <Link
            href="/gallery"
            className="inline-flex items-center justify-center rounded-full bg-orange-500 px-8 py-3.5 text-base font-semibold text-white shadow-sm transition hover:bg-orange-600 hover:shadow-md"
          >
            View Gallery
          </Link>
        </div>
      </div>
    </section>
  );
}