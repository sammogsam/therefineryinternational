"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Images } from "lucide-react";
import { supabase } from "@/lib/supabase";

type Resource = {
  id: string;
  title: string;
  slug: string;
  type: string;
  category: string | null;
  cover_image: string | null;
  gallery_images: string[] | null;
  event_name: string | null;
  resource_date: string | null;
  status: string;
};

type GalleryPhoto = {
  url: string;
  title: string;
  slug: string;
  date: string | null;
};

export default function Gallery() {
  const [loading, setLoading] = useState(true);
  const [campPhotos, setCampPhotos] = useState<GalleryPhoto[]>([]);
  const [schoolPhotos, setSchoolPhotos] = useState<GalleryPhoto[]>([]);
  const [communityPhotos, setCommunityPhotos] = useState<GalleryPhoto[]>([]);

  useEffect(() => {
    async function loadGalleryData() {
      setLoading(true);

      const { data, error } = await supabase
        .from("resources")
        .select("*")
        .eq("status", "Published")
        .order("resource_date", { ascending: false });

      if (error || !data) {
        console.error("Error loading gallery photos:", error);
        setLoading(false);
        return;
      }

      const camps: GalleryPhoto[] = [];
      const schools: GalleryPhoto[] = [];
      const community: GalleryPhoto[] = [];

      data.forEach((resource: Resource) => {
        // Collect all available image URLs for this resource
        const images: string[] = [];
        if (resource.cover_image) images.push(resource.cover_image);
        if (Array.isArray(resource.gallery_images)) {
          resource.gallery_images.forEach((img) => {
            if (img && !images.includes(img)) images.push(img);
          });
        }

        const photoObjects: GalleryPhoto[] = images.map((url) => ({
          url,
          title: resource.title,
          slug: resource.slug,
          date: resource.resource_date,
        }));

        const combinedText = `${resource.title || ""} ${resource.event_name || ""} ${resource.category || ""}`.toLowerCase();

        // Categorize based on keywords & category tags
        if (
          combinedText.includes("camp") ||
          resource.category?.toLowerCase() === "camp meetings"
        ) {
          camps.push(...photoObjects);
        } else if (combinedText.includes("school")) {
          schools.push(...photoObjects);
        } else {
          // Outreaches / Community
          community.push(...photoObjects);
        }
      });

      setCampPhotos(camps);
      setSchoolPhotos(schools);
      setCommunityPhotos(community);
      setLoading(false);
    }

    loadGalleryData();
  }, []);

  function PhotoGrid({
    photos,
    emptyText,
  }: {
    photos: GalleryPhoto[];
    emptyText: string;
  }) {
    if (photos.length === 0) {
      return (
        <div className="flex h-56 flex-col items-center justify-center rounded-3xl border border-dashed border-gray-300 bg-white/60 p-8 text-center">
          <Images size={36} className="text-orange-400" />
          <p className="mt-3 text-sm text-gray-500">{emptyText}</p>
        </div>
      );
    }

    return (
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
        {photos.map((photo, idx) => (
          <Link
            key={`${photo.url}-${idx}`}
            href={`/explore/${photo.slug}`}
            className="group relative block h-72 overflow-hidden rounded-3xl bg-gray-100 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <img
              src={photo.url}
              alt={photo.title}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="absolute bottom-0 left-0 right-0 p-5 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <p className="text-xs font-semibold text-orange-300">View Album</p>
              <h3 className="line-clamp-1 text-sm font-bold">{photo.title}</h3>
            </div>
          </Link>
        ))}
      </div>
    );
  }

  return (
    <main>
      {/* Hero */}
      <section className="bg-orange-500 py-20 text-center text-white sm:py-24">
        <div className="mx-auto max-w-5xl px-6">
          <h1 className="text-4xl font-bold sm:text-5xl md:text-6xl">Gallery</h1>
          <p className="mx-auto mt-6 max-w-3xl text-base text-orange-50 sm:text-lg">
            Capturing moments where children encounter God, grow together, and experience His love.
          </p>
        </div>
      </section>

      {/* Children Camp Meetings */}
      <section className="bg-white py-16 sm:py-20 md:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                Children Camp Meetings
              </h2>
              <p className="mt-3 max-w-3xl text-base text-gray-600 sm:text-lg">
                Moments of worship, teaching, fellowship, and spiritual growth.
              </p>
            </div>
            {!loading && campPhotos.length > 0 && (
              <span className="rounded-full bg-orange-100 px-3.5 py-1 text-xs font-semibold text-orange-700">
                {campPhotos.length} {campPhotos.length === 1 ? "Photo" : "Photos"}
              </span>
            )}
          </div>

          <div className="mt-10">
            {loading ? (
              <div className="flex h-48 items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-200 border-t-orange-500" />
              </div>
            ) : (
              <PhotoGrid
                photos={campPhotos}
                emptyText="Camp meeting photos uploaded in Resources will automatically appear here."
              />
            )}
          </div>
        </div>
      </section>

      {/* School Outreaches */}
      <section className="bg-orange-50 py-16 sm:py-20 md:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                School Outreaches
              </h2>
              <p className="mt-3 max-w-3xl text-base text-gray-600 sm:text-lg">
                Reaching children in schools with the message of Christ, hope, and purpose.
              </p>
            </div>
            {!loading && schoolPhotos.length > 0 && (
              <span className="rounded-full bg-orange-200 px-3.5 py-1 text-xs font-semibold text-orange-800">
                {schoolPhotos.length} {schoolPhotos.length === 1 ? "Photo" : "Photos"}
              </span>
            )}
          </div>

          <div className="mt-10">
            {loading ? (
              <div className="flex h-48 items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-200 border-t-orange-500" />
              </div>
            ) : (
              <PhotoGrid
                photos={schoolPhotos}
                emptyText="School outreach photos uploaded in Resources will automatically appear here."
              />
            )}
          </div>
        </div>
      </section>

      {/* Community Outreaches */}
      <section className="bg-white py-16 sm:py-20 md:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                Community Outreaches
              </h2>
              <p className="mt-3 max-w-3xl text-base text-gray-600 sm:text-lg">
                Extending God's love beyond our walls and reaching children within communities.
              </p>
            </div>
            {!loading && communityPhotos.length > 0 && (
              <span className="rounded-full bg-orange-100 px-3.5 py-1 text-xs font-semibold text-orange-700">
                {communityPhotos.length} {communityPhotos.length === 1 ? "Photo" : "Photos"}
              </span>
            )}
          </div>

          <div className="mt-10">
            {loading ? (
              <div className="flex h-48 items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-200 border-t-orange-500" />
              </div>
            ) : (
              <PhotoGrid
                photos={communityPhotos}
                emptyText="Community outreach photos uploaded in Resources will automatically appear here."
              />
            )}
          </div>
        </div>
      </section>

      {/* Closing */}
      <section className="bg-orange-500 py-20 text-center text-white">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="text-3xl font-bold sm:text-4xl">Every Moment Matters</h2>
          <p className="mt-4 text-base text-orange-50 sm:text-lg">
            Every gathering is an opportunity for a child to encounter God and be refined for His purpose.
          </p>
        </div>
      </section>
    </main>
  );
}