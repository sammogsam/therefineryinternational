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

export default function NewResourcePage() {
  const router = useRouter();

  const [type, setType] = useState("Gallery");
  const [galleryCategory, setGalleryCategory] = useState("Camp Meeting");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [eventName, setEventName] = useState("");
  const [resourceDate, setResourceDate] = useState("");
  const [status, setStatus] = useState("Published");
  const [featured, setFeatured] = useState("No");

  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [galleryImages, setGalleryImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      if (!title.trim()) {
        setMessage("Please enter a title for this edition / story.");
        setLoading(false);
        return;
      }

      const slug = `${createSlug(title)}-${Date.now()}`;
      let coverImageUrl: string | null = null;
      const uploadedGalleryUrls: string[] = [];

      // 1. Cover Image Upload
      if (coverImage) {
        const fileExt = coverImage.name.split(".").pop();
        const filePath = `covers/${Date.now()}-${slug}.${fileExt}`;

        const { error: uploadErr } = await supabase.storage
          .from("resource-images")
          .upload(filePath, coverImage, { cacheControl: "3600", upsert: false });

        if (uploadErr) {
          setMessage(`Cover image upload failed: ${uploadErr.message}`);
          setLoading(false);
          return;
        }

        const { data: publicUrlData } = supabase.storage
          .from("resource-images")
          .getPublicUrl(filePath);

        coverImageUrl = publicUrlData.publicUrl;
      }

      // 2. Multi-Picture Gallery Upload
      if (type === "Gallery" && galleryImages.length > 0) {
        for (let i = 0; i < galleryImages.length; i++) {
          const image = galleryImages[i];
          const fileExt = image.name.split(".").pop();
          const filePath = `galleries/${Date.now()}-${i}-${slug}.${fileExt}`;

          const { error: uploadErr } = await supabase.storage
            .from("resource-images")
            .upload(filePath, image, { cacheControl: "3600", upsert: false });

          if (uploadErr) {
            setMessage(`Gallery image (${image.name}) upload failed: ${uploadErr.message}`);
            setLoading(false);
            return;
          }

          const { data: publicUrlData } = supabase.storage
            .from("resource-images")
            .getPublicUrl(filePath);

          uploadedGalleryUrls.push(publicUrlData.publicUrl);
        }
      }

      const formattedCategory =
        type === "Article"
          ? "Articles"
          : galleryCategory === "Camp Meeting"
          ? "Camp Meetings"
          : "Outreaches";

      // 3. Save Primary Resource / Album Record
      const { data: insertedResource, error: insertError } = await supabase
        .from("resources")
        .insert({
          title,
          slug,
          type,
          category: formattedCategory,
          description: description || null,
          content: type === "Article" ? content || null : null,
          cover_image: coverImageUrl || (uploadedGalleryUrls.length > 0 ? uploadedGalleryUrls[0] : null),
          gallery_images: uploadedGalleryUrls,
          event_name: type === "Gallery" ? (eventName.trim() || title.trim()) : null,
          resource_date: resourceDate || null,
          status,
          featured: featured === "Yes",
        })
        .select()
        .single();

      if (insertError) {
        setMessage(insertError.message);
        setLoading(false);
        return;
      }

      // 4. Save into resource_images (if relational table is present)
      if (uploadedGalleryUrls.length > 0 && insertedResource) {
        const imageRows = uploadedGalleryUrls.map((url) => ({
          resource_id: insertedResource.id,
          image_url: url,
        }));

        await supabase.from("resource_images").insert(imageRows);
      }

      setMessage("Saved successfully!");
      setLoading(false);

      setTimeout(() => {
        router.push("/admin/resources");
        router.refresh();
      }, 1000);
    } catch (err: any) {
      setMessage(err.message || "An unexpected error occurred while saving.");
      setLoading(false);
    }
  }

  return (
    <main>
      <div>
        <h1 className="text-4xl font-bold text-gray-900">Create New Resource</h1>
        <p className="mt-2 text-gray-500">
          Add an isolated camp meeting album, outreach gallery, or article.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-8 rounded-3xl border border-gray-200 bg-white p-8 shadow-sm"
      >
        <div className="grid gap-6 md:grid-cols-2">
          {/* Resource Type */}
          <div>
            <label className="mb-2 block font-semibold text-gray-900">Resource Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-orange-500"
            >
              <option value="Gallery">Gallery / Event Photos</option>
              <option value="Article">Article / Written Story</option>
            </select>
          </div>

          {/* Date */}
          <div>
            <label className="mb-2 block font-semibold text-gray-900">Date of Event</label>
            <input
              type="date"
              value={resourceDate}
              onChange={(e) => setResourceDate(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-orange-500"
            />
          </div>

          {/* Gallery Category */}
          {type === "Gallery" && (
            <div>
              <label className="mb-2 block font-semibold text-gray-900">Gallery Section</label>
              <select
                value={galleryCategory}
                onChange={(e) => setGalleryCategory(e.target.value)}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-orange-500"
              >
                <option value="Camp Meeting">Camp Meeting (Separate Album)</option>
                <option value="Outreach">Outreach (Separate Album)</option>
              </select>
            </div>
          )}

          {/* Event / Edition Identifier */}
          {type === "Gallery" && (
            <div>
              <label className="mb-2 block font-semibold text-gray-900">
                {galleryCategory === "Camp Meeting" ? "Camp Meeting Edition" : "Outreach Location / Target"}
              </label>
              <input
                type="text"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                placeholder={
                  galleryCategory === "Camp Meeting"
                    ? "e.g. Ikere Ekiti Camp 2026"
                    : "e.g. EKSUTH Hospital Outreach"
                }
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-orange-500"
              />
            </div>
          )}

          {/* Title */}
          <div className="md:col-span-2">
            <label className="mb-2 block font-semibold text-gray-900">
              {type === "Article" ? "Article Title" : "Album & Meeting Title"}
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={
                type === "Article"
                  ? "Lessons from the Fire: Raising Lights"
                  : galleryCategory === "Camp Meeting"
                  ? "Ikere Children Camp Meeting 2026"
                  : "Community School Outreach 2026"
              }
              required
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-orange-500"
            />
          </div>

          {/* Short Description */}
          <div className="md:col-span-2">
            <label className="mb-2 block font-semibold text-gray-900">Summary / Reflection</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A brief summary of what happened at this specific meeting or outreach..."
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-orange-500"
            />
          </div>

          {/* Article Body */}
          {type === "Article" && (
            <div className="md:col-span-2">
              <label className="mb-2 block font-semibold text-gray-900">Article Content</label>
              <textarea
                rows={10}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write full article here..."
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-orange-500"
              />
            </div>
          )}

          {/* Cover Photo */}
          <div className="md:col-span-2">
            <label className="mb-2 block font-semibold text-gray-900">
              Primary Cover Photo {type === "Gallery" && "(Optional - first gallery image used if empty)"}
            </label>
            <div className="rounded-2xl border-2 border-dashed border-orange-200 bg-orange-50/40 p-6 text-center">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setCoverImage(e.target.files?.[0] || null)}
                className="mx-auto block text-sm text-gray-500 file:mr-4 file:rounded-full file:border-0 file:bg-orange-500 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-orange-600"
              />
              {coverImage && <p className="mt-2 text-sm text-green-600">Selected: {coverImage.name}</p>}
            </div>
          </div>

          {/* Multiple Pictures for Event */}
          {type === "Gallery" && (
            <div className="md:col-span-2">
              <label className="mb-2 block font-semibold text-gray-900">
                Pictures from this Meeting / Outreach
              </label>
              <div className="rounded-2xl border-2 border-dashed border-orange-200 bg-orange-50/40 p-6 text-center">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => setGalleryImages(Array.from(e.target.files || []))}
                  className="mx-auto block text-sm text-gray-500 file:mr-4 file:rounded-full file:border-0 file:bg-orange-500 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-orange-600"
                />
                {galleryImages.length > 0 && (
                  <p className="mt-2 text-sm font-semibold text-green-600">
                    {galleryImages.length} picture{galleryImages.length > 1 ? "s" : ""} selected for this album
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Status */}
          <div>
            <label className="mb-2 block font-semibold text-gray-900">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3"
            >
              <option value="Published">Published</option>
              <option value="Draft">Draft</option>
            </select>
          </div>

          {/* Featured */}
          <div>
            <label className="mb-2 block font-semibold text-gray-900">Featured on Explore</label>
            <select
              value={featured}
              onChange={(e) => setFeatured(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3"
            >
              <option value="No">No</option>
              <option value="Yes">Yes</option>
            </select>
          </div>
        </div>

        {message && (
          <div
            className={`mt-6 rounded-xl px-4 py-3 text-sm font-medium ${
              message.includes("success")
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {message}
          </div>
        )}

        <div className="mt-10 flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-orange-500 px-8 py-3.5 font-semibold text-white transition hover:bg-orange-600 disabled:opacity-60"
          >
            {loading ? "Uploading & Saving..." : "Save Event Album"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-xl border border-gray-300 px-8 py-3.5 font-semibold hover:bg-gray-100"
          >
            Cancel
          </button>
        </div>
      </form>
    </main>
  );
}