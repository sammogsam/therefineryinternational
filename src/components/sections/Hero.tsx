"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function HomePage() {
  const [heroMode, setHeroMode] = useState<"color" | "slideshow">("color");
  const [heroImages, setHeroImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    async function loadHeroConfig() {
      const { data } = await supabase
        .from("site_settings")
        .select("hero_mode, hero_images")
        .eq("id", "primary_config")
        .single();

      if (data) {
        if (data.hero_mode) setHeroMode(data.hero_mode);
        if (data.hero_images && Array.isArray(data.hero_images)) {
          setHeroImages(data.hero_images);
        }
      }
    }
    loadHeroConfig();
  }, []);

  // Slideshow interval timer (changes every 5 seconds)
  useEffect(() => {
    if (heroMode === "slideshow" && heroImages.length > 1) {
      const timer = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [heroMode, heroImages]);

  return (
    <div className="relative min-h-screen bg-slate-950 text-white flex flex-col justify-between overflow-hidden">
      
      {/* Background Layer: Slideshow or Solid Color */}
      {heroMode === "slideshow" && heroImages.length > 0 ? (
        <div className="absolute inset-0 z-0">
          {heroImages.map((img, idx) => (
            <div
              key={idx}
              className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
                idx === currentImageIndex ? "opacity-100 scale-105" : "opacity-0 scale-100"
              }`}
              style={{ backgroundImage: `url(${img})`, transition: "opacity 1s ease-in-out, transform 6s ease-out" }}
            />
          ))}
          {/* Dark Overlay so text remains readable */}
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-[2px]" />
        </div>
      ) : (
        /* Solid Theme Background */
        <div className="absolute inset-0 z-0 bg-slate-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(249,115,22,0.15),rgba(255,255,255,0))]" />
      )}

      {/* Hero Content */}
      <div className="relative z-10 mx-auto max-w-4xl px-6 py-28 text-center sm:py-36 my-auto space-y-6">
        <span className="text-xs font-bold uppercase tracking-widest text-orange-400">
          A Place Where Children Encounter God
        </span>

        <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl md:text-7xl leading-tight">
          Where We Experience the <span className="text-orange-500">DIVINE</span>, and are indeed <span className="text-orange-400">Refined</span>.
        </h1>

        <p className="mx-auto max-w-xl text-sm sm:text-base text-gray-300 leading-relaxed">
          The Refinery International is a children&apos;s ministry committed to raising children as lights and arrows, helping them encounter God, discover their identity in Christ, and grow into their purpose.
        </p>

        <div className="pt-6 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/programs"
            className="rounded-2xl bg-orange-500 hover:bg-orange-600 px-8 py-4 text-sm font-bold text-white shadow-lg shadow-orange-500/20 transition"
          >
            Explore The Refinery
          </Link>
          <Link
            href="/events"
            className="rounded-2xl border border-orange-500/40 bg-slate-900/80 hover:bg-slate-900 px-8 py-4 text-sm font-bold text-white transition"
          >
            Upcoming Events
          </Link>
          <Link
            href="/support"
            className="rounded-2xl border border-slate-800 bg-slate-900/60 hover:bg-slate-900 px-8 py-4 text-sm font-bold text-gray-200 transition"
          >
            Support Us
          </Link>
          <Link
            href="/partner"
            className="rounded-2xl bg-white hover:bg-gray-100 px-8 py-4 text-sm font-bold text-slate-950 transition"
          >
            Partner With Us
          </Link>
        </div>
      </div>
    </div>
  );
}