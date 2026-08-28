"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  CalendarDays,
  MapPin,
  Pencil,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  X,
} from "lucide-react";
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

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Modal & Toast UI state
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [eventToDelete, setEventToDelete] = useState<Event | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const showToast = (
    message: string,
    type: "success" | "error" = "success"
  ) => {
    setToast({ message, type });
    setTimeout(() => {
      setToast((current) => (current?.message === message ? null : current));
    }, 4500);
  };

  /*
   * ============================================
   * LOAD EVENTS
   * ============================================
   */

  async function loadEvents() {
    setLoading(true);
    setError("");

    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("event_date", {
        ascending: true,
      });

    if (error) {
      console.error("Error loading events:", error);
      setError(error.message);
      setLoading(false);
      return;
    }

    setEvents(data || []);
    setLoading(false);
  }

  useEffect(() => {
    loadEvents();
  }, []);

  /*
   * ============================================
   * FORMAT DATE
   * ============================================
   */

  function formatDate(date: string) {
    return new Date(date + "T00:00:00").toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  /*
   * ============================================
   * CONFIRMED DELETE HANDLER
   * ============================================
   */

  async function handleConfirmDelete() {
    if (!eventToDelete) return;

    setIsDeleting(true);
    setError("");

    try {
      const {
        data: sessionData,
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !sessionData.session?.access_token) {
        showToast("Your session has expired. Please log in again.", "error");
        setIsDeleting(false);
        setEventToDelete(null);
        return;
      }

      const accessToken = sessionData.session.access_token;

      const response = await fetch(
        `/api/admin/events/${eventToDelete.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      let result: {
        success?: boolean;
        message?: string;
        error?: string;
        details?: string;
      } = {};

      try {
        result = await response.json();
      } catch {
        result = {};
      }

      if (!response.ok) {
        const errorMsg =
          result.error ||
          result.details ||
          "The event could not be deleted.";
        showToast(errorMsg, "error");
        setIsDeleting(false);
        setEventToDelete(null);
        return;
      }

      // Successful deletion
      setEvents((currentEvents) =>
        currentEvents.filter((item) => item.id !== eventToDelete.id)
      );

      showToast(
        result.message || "Event and flyer deleted successfully.",
        "success"
      );
    } catch (err) {
      console.error("UNEXPECTED DELETION ERROR:", err);
      showToast(
        "Something went wrong while deleting the event. Please try again.",
        "error"
      );
    } finally {
      setIsDeleting(false);
      setEventToDelete(null);
    }
  }

  return (
    <main className="relative space-y-8">
      {/* ========================================
          PAGE HEADER
          ======================================== */}
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Events</h1>
          <p className="mt-2 text-gray-500">
            Manage all ministry programmes.
          </p>
        </div>

        <Link
          href="/admin/events/new"
          className="inline-flex w-fit items-center rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white transition hover:bg-orange-600"
        >
          + New Event
        </Link>
      </div>

      {/* ========================================
          ERROR
          ======================================== */}
      {error && (
        <div className="rounded-2xl bg-red-50 p-5 text-red-700">
          <p className="font-semibold">Unable to load events</p>
          <p className="mt-1 text-sm">{error}</p>
        </div>
      )}

      {/* ========================================
          LOADING
          ======================================== */}
      {loading && (
        <div className="rounded-3xl border border-gray-200 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-orange-500" />
          <p className="mt-4 text-gray-500">Loading events...</p>
        </div>
      )}

      {/* ========================================
          EMPTY STATE
          ======================================== */}
      {!loading && !error && events.length === 0 && (
        <div className="rounded-3xl border border-dashed border-gray-300 bg-white p-12 text-center">
          <CalendarDays size={48} className="mx-auto text-orange-500" />
          <h2 className="mt-5 text-2xl font-bold text-gray-900">
            No events yet
          </h2>
          <p className="mx-auto mt-2 max-w-md text-gray-500">
            You haven't created any events yet. Create your first ministry programme
            to get started.
          </p>
          <Link
            href="/admin/events/new"
            className="mt-6 inline-flex rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white transition hover:bg-orange-600"
          >
            Create New Event
          </Link>
        </div>
      )}

      {/* ========================================
          EVENTS LIST
          ======================================== */}
      {!loading && events.length > 0 && (
        <div className="grid gap-8 lg:grid-cols-2">
          {events.map((event) => (
            <div
              key={event.id}
              className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
            >
              {/* Event Image */}
              {event.image ? (
                <div className="h-48 w-full overflow-hidden bg-gray-100">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <div className="flex h-48 items-center justify-center bg-orange-50">
                  <CalendarDays size={52} className="text-orange-400" />
                </div>
              )}

              {/* Event Content */}
              <div className="p-7">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {event.title}
                    </h2>
                    {event.featured && (
                      <span className="mt-2 inline-block rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-600">
                        Featured
                      </span>
                    )}
                  </div>

                  <span
                    className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                      event.status === "Published"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {event.status}
                  </span>
                </div>

                {/* Event Information */}
                <div className="mt-6 space-y-3 text-sm text-gray-600">
                  <div className="flex items-center gap-3">
                    <CalendarDays size={18} className="text-orange-500" />
                    <span>
                      {formatDate(event.event_date)}
                      {event.event_time && <> • {event.event_time}</>}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <MapPin size={18} className="text-orange-500" />
                    <span>{event.venue}</span>
                  </div>
                </div>

                {/* Speaker */}
                {event.speaker && (
                  <p className="mt-5 text-sm text-gray-500">
                    <span className="font-semibold text-gray-700">
                      Speaker:
                    </span>{" "}
                    {event.speaker}
                  </p>
                )}

                {/* Description */}
                <p className="mt-5 line-clamp-3 text-sm leading-relaxed text-gray-600">
                  {event.description}
                </p>

                {/* Actions */}
                <div className="mt-7 flex gap-3 border-t border-gray-100 pt-6">
                  <Link
                    href={`/admin/events/${event.id}/edit`}
                    className="flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                  >
                    <Pencil size={16} />
                    Edit
                  </Link>

                  <button
                    type="button"
                    onClick={() => setEventToDelete(event)}
                    className="flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ========================================
          DELETE CONFIRMATION MODAL
          ======================================== */}
      {eventToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                <AlertTriangle size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  Delete Event
                </h3>
                <p className="text-xs text-gray-500">
                  This action cannot be undone.
                </p>
              </div>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-gray-600">
              Are you sure you want to delete{" "}
              <strong className="text-gray-900">
                &ldquo;{eventToDelete.title}&rdquo;
              </strong>
              ? Both the event record and its uploaded flyer will be permanently
              removed.
            </p>

            <div className="mt-8 flex justify-end gap-3">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setEventToDelete(null)}
                className="rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                className="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Yes, Delete Event"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================
          TOAST NOTIFICATION
          ======================================== */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl border border-gray-100 bg-white px-5 py-4 shadow-2xl ring-1 ring-black/5">
          {toast.type === "success" ? (
            <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
          ) : (
            <AlertCircle className="h-5 w-5 text-rose-500 shrink-0" />
          )}
          <p className="text-sm font-medium text-gray-800">{toast.message}</p>
          <button
            onClick={() => setToast(null)}
            className="ml-3 rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </main>
  );
}