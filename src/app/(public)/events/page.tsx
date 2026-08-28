"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

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
    return new Date(date + "T00:00:00").toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  const featuredEvent =
    events.find((event) => event.featured) || events[0];

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
              <p className="mt-5 text-gray-500">
                Loading events...
              </p>
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
                  <p className="text-orange-500">
                    Event Image
                  </p>
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
                <div className="mt-6 space-y-3 text-gray-700">
                  <p>
                    📅 Date: {formatDate(featuredEvent.event_date)}
                  </p>

                  {featuredEvent.event_time && (
                    <p>
                      ⏰ Time: {featuredEvent.event_time}
                    </p>
                  )}

                  <p>
                    📍 Location: {featuredEvent.venue}
                  </p>

                  {featuredEvent.speaker && (
                    <p>
                      🎤 Speaker: {featuredEvent.speaker}
                    </p>
                  )}
                </div>

                {/* Registration */}
                {featuredEvent.registration_link && (
                  <a
                    href={featuredEvent.registration_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-8 inline-block rounded-full bg-orange-500 px-8 py-3 font-semibold text-white transition hover:bg-orange-600"
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
                  className="overflow-hidden rounded-3xl bg-white shadow-sm"
                >
                  {/* Image */}
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
                      <span className="text-orange-500">
                        Event Image
                      </span>
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900">
                      {event.title}
                    </h3>

                    <div className="mt-4 space-y-2 text-sm text-gray-600">
                      <p>
                        📅 {formatDate(event.event_date)}
                      </p>

                      {event.event_time && (
                        <p>
                          ⏰ {event.event_time}
                        </p>
                      )}

                      <p>
                        📍 {event.venue}
                      </p>
                    </div>

                    <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-gray-600">
                      {event.description}
                    </p>

                    {event.registration_link && (
                      <a
                        href={event.registration_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-6 inline-block font-semibold text-orange-500 hover:text-orange-600"
                      >
                        Register →
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Event Categories */}
      <section className="bg-orange-50 py-16 sm:py-20 md:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-center text-3xl font-bold text-gray-900 sm:text-4xl">
            Our Programmes & Gatherings
          </h2>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              [
                "🏫",
                "School Outreach",
                "Bringing the message of Christ into schools and communities.",
              ],
              [
                "🔥",
                "Children Gatherings",
                "Creating meaningful experiences where children encounter God.",
              ],
              [
                "🤝",
                "Community Outreach",
                "Serving children and families through love and compassion.",
              ],
            ].map((event) => (
              <div
                key={event[1]}
                className="rounded-3xl bg-white p-8"
              >
                <div className="text-4xl">
                  {event[0]}
                </div>

                <h3 className="mt-5 text-xl font-bold text-gray-900">
                  {event[1]}
                </h3>

                <p className="mt-3 text-gray-600">
                  {event[2]}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

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
            <a
              href="/socials"
              className="inline-flex items-center justify-center rounded-full bg-orange-500 px-8 py-3.5 font-semibold text-white transition hover:bg-orange-600"
            >
              Follow Us
            </a>

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