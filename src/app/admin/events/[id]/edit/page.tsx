"use client";

import { FormEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

function createSlug(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function EditEventPage() {
  const params = useParams();
  const router = useRouter();

  const eventId = params.id as string;

  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [venue, setVenue] = useState("");
  const [speaker, setSpeaker] = useState("");
  const [registrationLink, setRegistrationLink] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Draft");
  const [featured, setFeatured] = useState("No");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadEvent() {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("id", eventId)
        .single();

      if (error) {
        console.error(error);
        setMessage(error.message);
        setLoading(false);
        return;
      }

      setTitle(data.title || "");
      setDate(data.event_date || "");
      setTime(data.event_time || "");
      setVenue(data.venue || "");
      setSpeaker(data.speaker || "");
      setRegistrationLink(data.registration_link || "");
      setDescription(data.description || "");
      setStatus(data.status || "Draft");
      setFeatured(data.featured ? "Yes" : "No");

      setLoading(false);
    }

    if (eventId) {
      loadEvent();
    }
  }, [eventId]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSaving(true);
    setMessage("");

    const slug = createSlug(title);

    const { error } = await supabase
      .from("events")
      .update({
        title,
        slug,
        description,
        speaker: speaker || null,
        venue,
        event_date: date,
        event_time: time || null,
        registration_link: registrationLink || null,
        status,
        featured: featured === "Yes",
      })
      .eq("id", eventId);

    if (error) {
      console.error(error);
      setMessage(error.message);
      setSaving(false);
      return;
    }

    setMessage("Event updated successfully!");

    setSaving(false);

    setTimeout(() => {
      router.push("/admin/events");
      router.refresh();
    }, 800);
  }

  if (loading) {
    return (
      <main className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-orange-100 border-t-orange-500" />

          <p className="mt-4 text-gray-500">
            Loading event...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="space-y-8">

      {/* Header */}

      <div>
        <h1 className="text-4xl font-bold text-gray-900">
          Edit Event
        </h1>

        <p className="mt-2 text-gray-500">
          Update the details of this ministry event.
        </p>
      </div>


      {/* Form */}

      <form
        onSubmit={handleSubmit}
        className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm"
      >

        <div className="grid gap-6 md:grid-cols-2">

          {/* Title */}

          <div className="md:col-span-2">

            <label className="mb-2 block font-semibold">
              Event Title
            </label>

            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-orange-500"
            />

          </div>


          {/* Date */}

          <div>

            <label className="mb-2 block font-semibold">
              Event Date
            </label>

            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-orange-500"
            />

          </div>


          {/* Time */}

          <div>

            <label className="mb-2 block font-semibold">
              Time
            </label>

            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-orange-500"
            />

          </div>


          {/* Venue */}

          <div>

            <label className="mb-2 block font-semibold">
              Venue
            </label>

            <input
              type="text"
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              required
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-orange-500"
            />

          </div>


          {/* Speaker */}

          <div>

            <label className="mb-2 block font-semibold">
              Speaker
            </label>

            <input
              type="text"
              value={speaker}
              onChange={(e) => setSpeaker(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-orange-500"
            />

          </div>


          {/* Registration Link */}

          <div className="md:col-span-2">

            <label className="mb-2 block font-semibold">
              Registration Link
            </label>

            <input
              type="url"
              value={registrationLink}
              onChange={(e) => setRegistrationLink(e.target.value)}
              placeholder="https://..."
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-orange-500"
            />

          </div>


          {/* Description */}

          <div className="md:col-span-2">

            <label className="mb-2 block font-semibold">
              Event Description
            </label>

            <textarea
              rows={6}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-orange-500"
            />

          </div>


          {/* Status */}

          <div>

            <label className="mb-2 block font-semibold">
              Status
            </label>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3"
            >

              <option value="Draft">
                Draft
              </option>

              <option value="Published">
                Published
              </option>

            </select>

            <p className="mt-2 text-sm text-gray-500">
              Published events appear on the public website.
            </p>

          </div>


          {/* Featured */}

          <div>

            <label className="mb-2 block font-semibold">
              Featured Event
            </label>

            <select
              value={featured}
              onChange={(e) => setFeatured(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3"
            >

              <option value="No">
                No
              </option>

              <option value="Yes">
                Yes
              </option>

            </select>

          </div>

        </div>


        {/* Message */}

        {message && (
          <div
            className={`mt-6 rounded-xl px-4 py-3 text-sm ${
              message === "Event updated successfully!"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {message}
          </div>
        )}


        {/* Buttons */}

        <div className="mt-10 flex gap-4">

          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-orange-500 px-8 py-3 font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>

          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-xl border border-gray-300 px-8 py-3 font-semibold hover:bg-gray-100"
          >
            Cancel
          </button>

        </div>

      </form>

    </main>
  );
}