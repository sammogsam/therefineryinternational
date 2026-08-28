"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Calendar, Clock, MapPin, User, ArrowRight } from "lucide-react";

type Event = {
  id: string;
  title: string;
  slug: string;
  description: string;
  speaker: string | null;
  venue: string;
  event_date: string;
  event_time: string | null;
  image: string | null;
  registration_link: string | null;
  status: string;
  featured: boolean;
};

export default function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadEvents() {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("status", "Published")
        .order("event_date", { ascending: true });

      if (error) {
        console.error("Error loading events:", error);
        setLoading(false);
        return;
      }

      setEvents(data || []);
      setLoading(false);
    }

    loadEvents();
  }, []);

  function formatDate(date: string) {
    if (!date) return "";
    return new Date(date + "T00:00:00").toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  const featuredEvent = events.find((event) => event.featured) || events[0];
  const otherEvents = featuredEvent
    ? events.filter((event) => event.id !== featuredEvent.id)
    : [];

  return (
    <main>
      {/* Hero */}
      <section className="bg-orange-500 py-16 text-center text-white sm:py-20 md:py-24">
        <div className="mx-auto max-w-5xl px-6">
          <h1 className="text-4xl font-bold sm:text-5xl md:text-6xl">
            Upcoming Events
          </h1>
          <p className="mx-auto mt-5 max-w-3xl text-base leading-relaxed text-orange-50 sm:text-lg">
            Join us as we create spaces where children encounter God,
            discover purpose, and grow together.
          </p>
        </div>
      </section>

      {/* Featured Event */}
      <section className="bg-white py-16 sm:py-20 md:py-24">
        <div className="mx-auto max-w-6xl px-6">
          {loading ? (
            <div className="py-16 text-center">
              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-orange-100 border-t-orange-500" />
              <p className="mt-5 text-gray-500">Loading events...</p>
            </div>
          ) : !featuredEvent ? (
            <div className="py-16 text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-orange-500">
                Coming Soon
              </p>
              <h2 className="mt-4 text-3xl font-bold text-gray-900 sm:text-4xl">
                No Upcoming Events Yet
              </h2>
              <p className="mx-auto mt-5 max-w-2xl text-gray-600">
                We are preparing something special. Check back soon
                for our upcoming programmes and gatherings.
              </p>
            </div>
          ) : (
            <div className="grid gap-10 md:grid-cols-2 md:items-center">
              {/* Event Image */}
              {featuredEvent.image ? (
                <div className="h-80 overflow-hidden rounded-3xl bg-orange-100">
                  <img
                    src={featuredEvent.image}
                    alt={featuredEvent.title}
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <div className="flex h-80 items-center justify-center rounded-3xl bg-orange-100">
                  <p className="text-orange-500 font-semibold">The Refinery Gathering</p>
                </div>
              )}

              {/* Event Details */}
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-orange-500">
                  Featured Event
                </p>

                <h2 className="mt-4 text-3xl font-bold text-gray-900 sm:text-4xl">
                  {featuredEvent.title}
                </h2>

                <p className="mt-5 text-base leading-relaxed text-gray-600 sm:text-lg">
                  {featuredEvent.description}
                </p>

                {/* Event Information */}
                <div className="mt-6 space-y-3 text-gray-700 text-sm">
                  <p className="flex items-center gap-2">
                    <Calendar size={16} className="text-orange-500 shrink-0" />
                    <span><strong>Date:</strong> {formatDate(featuredEvent.event_date)}</span>
                  </p>

                  {featuredEvent.event_time && (
                    <p className="flex items-center gap-2">
                      <Clock size={16} className="text-orange-500 shrink-0" />
                      <span><strong>Time:</strong> {featuredEvent.event_time}</span>
                    </p>
                  )}

                  <p className="flex items-center gap-2">
                    <MapPin size={16} className="text-orange-500 shrink-0" />
                    <span><strong>Location:</strong> {featuredEvent.venue}</span>
                  </p>

                  {featuredEvent.speaker && (
                    <p className="flex items-center gap-2">
                      <User size={16} className="text-orange-500 shrink-0" />
                      <span><strong>Speaker:</strong> {featuredEvent.speaker}</span>
                    </p>
                  )}
                </div>

                {/* Registration Button */}
                {featuredEvent.registration_link && (
                  <a
                    href={featuredEvent.registration_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-8 inline-block rounded-full bg-orange-500 px-8 py-3 font-semibold text-white shadow-md transition hover:bg-orange-600"
                  >
                    Register Now
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Other Upcoming Events */}
      {!loading && otherEvents.length > 0 && (
        <section className="bg-gray-50 py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-6">
            <div className="text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-orange-500">
                More Programmes
              </p>
              <h2 className="mt-3 text-3xl font-bold text-gray-900 sm:text-4xl">
                Upcoming Events
              </h2>
            </div>

            <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {otherEvents.map((event) => (
                <article
                  key={event.id}
                  className="overflow-hidden rounded-3xl bg-white shadow-sm border border-gray-100 flex flex-col justify-between"
                >
                  <div>
                    {event.image ? (
                      <div className="h-48 overflow-hidden">
                        <img
                          src={event.image}
                          alt={event.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="flex h-48 items-center justify-center bg-orange-100">
                        <span className="text-orange-500 font-semibold">Event Image</span>
                      </div>
                    )}

                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900">{event.title}</h3>

                      <div className="mt-4 space-y-2 text-xs text-gray-600">
                        <p className="flex items-center gap-1.5">
                          <Calendar size={13} className="text-orange-500" />
                          <span>{formatDate(event.event_date)}</span>
                        </p>

                        {event.event_time && (
                          <p className="flex items-center gap-1.5">
                            <Clock size={13} className="text-orange-500" />
                            <span>{event.event_time}</span>
                          </p>
                        )}

                        <p className="flex items-center gap-1.5">
                          <MapPin size={13} className="text-orange-500" />
                          <span>{event.venue}</span>
                        </p>
                      </div>

                      <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-gray-600">
                        {event.description}
                      </p>
                    </div>
                  </div>

                  {event.registration_link && (
                    <div className="p-6 pt-0">
                      <a
                        href={event.registration_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 font-semibold text-sm text-orange-500 hover:text-orange-600"
                      >
                        <span>Register</span>
                        <ArrowRight size={14} />
                      </a>
                    </div>
                  )}
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Social Connection */}
      <section className="bg-white py-16 text-center sm:py-20">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Never Miss An Update
          </h2>
          <p className="mt-5 text-base leading-relaxed text-gray-600 sm:text-lg">
            Follow The Refinery on social media for event announcements,
            pictures, videos, and stories from our ministry.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/socials"
              className="inline-flex items-center justify-center rounded-full bg-orange-500 px-8 py-3.5 font-semibold text-white transition hover:bg-orange-600"
            >
              Follow Us
            </Link>

            <a
              href="https://chat.whatsapp.com/your-group-invite"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full border border-orange-500 px-8 py-3.5 font-semibold text-orange-500 transition hover:bg-orange-50"
            >
              Join Community
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}