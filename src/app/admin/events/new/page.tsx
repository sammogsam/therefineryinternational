"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

function createSlug(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function NewEventPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [venue, setVenue] = useState("");
  const [speaker, setSpeaker] = useState("");
  const [registrationLink, setRegistrationLink] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Draft");
  const [featured, setFeatured] = useState("No");

  const [flyer, setFlyer] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  function handleFlyerChange(file: File | undefined) {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setMessage("Please select an image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage("Please choose an image smaller than 5MB.");
      return;
    }

    setFlyer(file);
    setPreviewUrl(URL.createObjectURL(file));
    setMessage("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const slug = createSlug(title);

      let imageUrl: string | null = null;

      /*
       * Upload flyer first
       */

      if (flyer) {
        const fileExtension =
          flyer.name.split(".").pop()?.toLowerCase() || "jpg";

        const fileName = `${slug}-${Date.now()}.${fileExtension}`;

        const filePath = `events/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("event-flyers")
          .upload(filePath, flyer, {
            cacheControl: "3600",
            upsert: false,
            contentType: flyer.type,
          });

        if (uploadError) {
          console.error(uploadError);
          setMessage(uploadError.message);
          setLoading(false);
          return;
        }

        /*
         * Get public URL
         */

        const { data } = supabase.storage
          .from("event-flyers")
          .getPublicUrl(filePath);

        imageUrl = data.publicUrl;
      }

      /*
       * Save event
       */

      const { error } = await supabase
        .from("events")
        .insert({
          title,
          slug,
          description,
          speaker: speaker || null,
          venue,
          event_date: date,
          event_time: time || null,
          image: imageUrl,
          registration_link: registrationLink || null,
          status,
          featured: featured === "Yes",
        });

      if (error) {
        console.error(error);
        setMessage(error.message);
        setLoading(false);
        return;
      }

      setMessage("Event saved successfully!");

      setTimeout(() => {
        router.push("/admin/events");
        router.refresh();
      }, 1000);

    } catch (error) {
      console.error(error);

      setMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );

      setLoading(false);
    }
  }

  return (
    <main className="space-y-8">

      {/* Page Header */}

      <div>
        <h1 className="text-4xl font-bold text-gray-900">
          Create New Event
        </h1>

        <p className="mt-2 text-gray-500">
          Fill in the details below to create a new ministry event.
        </p>
      </div>


      {/* Form */}

      <form
        onSubmit={handleSubmit}
        className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm"
      >

        <div className="grid gap-6 md:grid-cols-2">

          {/* Event Title */}

          <div className="md:col-span-2">

            <label className="mb-2 block font-semibold">
              Event Title
            </label>

            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Children's Leadership Conference"
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
              placeholder="EKSUTH Auditorium"
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
              placeholder="Pastor Samuel Mogaji"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-orange-500"
            />

          </div>


          {/* Registration Link */}

          <div className="md:col-span-2">

            <label className="mb-2 block font-semibold">
              Registration Link (Optional)
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
              placeholder="Tell people about this event..."
              required
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-orange-500"
            />

          </div>


          {/* Flyer Upload */}

          <div className="md:col-span-2">

            <label className="mb-2 block font-semibold">
              Event Flyer
            </label>

            <div className="rounded-2xl border-2 border-dashed border-orange-300 bg-orange-50 p-8 text-center">

              {previewUrl ? (

                <div>

                  <img
                    src={previewUrl}
                    alt="Event flyer preview"
                    className="mx-auto max-h-80 rounded-xl object-contain shadow-sm"
                  />

                  <p className="mt-4 text-sm text-gray-600">
                    {flyer?.name}
                  </p>

                  <button
                    type="button"
                    onClick={() => {
                      setFlyer(null);
                      setPreviewUrl("");
                    }}
                    className="mt-4 text-sm font-semibold text-red-500 hover:text-red-600"
                  >
                    Remove Flyer
                  </button>

                </div>

              ) : (

                <>

                  <p className="font-medium text-gray-700">
                    Upload Event Flyer
                  </p>

                  <p className="mt-2 text-sm text-gray-500">
                    PNG, JPG, JPEG or WEBP • Maximum 5MB
                  </p>

                  <label className="mt-5 inline-block cursor-pointer rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white transition hover:bg-orange-600">

                    Choose Flyer

                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={(e) =>
                        handleFlyerChange(e.target.files?.[0])
                      }
                      className="hidden"
                    />

                  </label>

                </>

              )}

            </div>

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
              message === "Event saved successfully!"
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
            disabled={loading}
            className="rounded-xl bg-orange-500 px-8 py-3 font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Saving..." : "Save Event"}
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