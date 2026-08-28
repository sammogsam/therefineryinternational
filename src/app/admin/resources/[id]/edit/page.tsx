"use client";

import { FormEvent, useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Loader2, Trash2, Plus, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

function createSlug(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function EditResourcePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const resourceId = resolvedParams.id;
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  // Primary Fields
  const [type, setType] = useState("Gallery");
  const [galleryCategory, setGalleryCategory] = useState("Camp Meeting");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [eventName, setEventName] = useState("");
  const [resourceDate, setResourceDate] = useState("");
  const [status, setStatus] = useState("Published");
  const [featured, setFeatured] = useState("No");

  // Images
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null);
  const [existingGalleryUrls, setExistingGalleryUrls] = useState<string[]>([]);
  const [newCoverFile, setNewCoverFile] = useState<File | null>(null);

  useEffect(() => {
    async function loadResource() {
      setLoading(true);
      setMessage("");

      const { data, error } = await supabase
        .from("resources")
        .select("*")
        .eq("id", resourceId)
        .single();

      if (error || !data) {
        alert("Resource not found");
        router.push("/admin/resources");
        return;
      }

      setType(data.type || "Gallery");
      setTitle(data.title || "");
      setDescription(data.description || "");
      setContent(data.content || "");
      setEventName(data.event_name || "");
      setResourceDate(
        data.resource_date
          ? data.resource_date.split("T")[0]
          : data.event_date
          ? data.event_date.split("T")[0]
          : ""
      );
      setStatus(data.status || "Published");
      setFeatured(data.featured ? "Yes" : "No");
      setCoverImageUrl(data.cover_image || null);

      if (data.category === "Camp Meetings" || data.category === "Camp Meeting") {
        setGalleryCategory("Camp Meeting");
      } else {
        setGalleryCategory("Outreach");
      }

      // 1. Fetch images from gallery_images column or resource_images table
      let loadedImages: string[] = [];
      if (Array.isArray(data.gallery_images)) {
        loadedImages = data.gallery_images;
      }

      // If empty in resources table, check relational resource_images table
      if (loadedImages.length === 0) {
        const { data: relationalImages } = await supabase
          .from("resource_images")
          .select("image_url")
          .eq("resource_id", resourceId);

        if (relationalImages && relationalImages.length > 0) {
          loadedImages = relationalImages.map((r) => r.image_url);
        }
      }

      // Fallback: If still empty but cover exists
      if (loadedImages.length === 0 && data.cover_image) {
        loadedImages = [data.cover_image];
      }

      setExistingGalleryUrls(loadedImages);
      setLoading(false);
    }

    loadResource();
  }, [resourceId, router]);

  // Handle uploading additional gallery pictures immediately
  async function handleAddGalleryPictures(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const newUploaded: string[] = [];
    const slug = createSlug(title || "resource");

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileExt = file.name.split(".").pop();
      const filePath = `galleries/${Date.now()}-${i}-${slug}.${fileExt}`;

      const { error: uploadErr } = await supabase.storage
        .from("resource-images")
        .upload(filePath, file, { cacheControl: "3600", upsert: false });

      if (!uploadErr) {
        const { data: publicUrlData } = supabase.storage
          .from("resource-images")
          .getPublicUrl(filePath);

        newUploaded.push(publicUrlData.publicUrl);
      }
    }

    const updatedList = [...existingGalleryUrls, ...newUploaded];
    setExistingGalleryUrls(updatedList);

    if (!coverImageUrl && updatedList.length > 0) {
      setCoverImageUrl(updatedList[0]);
    }

    setUploading(false);
  }

  // Remove single photo from gallery
  function handleRemovePhoto(indexToRemove: number) {
    const photoToRemove = existingGalleryUrls[indexToRemove];
    const updated = existingGalleryUrls.filter((_, idx) => idx !== indexToRemove);
    setExistingGalleryUrls(updated);

    if (coverImageUrl === photoToRemove) {
      setCoverImageUrl(updated.length > 0 ? updated[0] : null);
    }
  }

  // Form Submit
  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      if (!title.trim()) {
        setMessage("Please enter a title for this edition / story.");
        setSaving(false);
        return;
      }

      const slug = `${createSlug(title)}-${Date.now()}`;
      let finalCoverUrl = coverImageUrl;

      // Upload replacement cover if user chose a new file
      if (newCoverFile) {
        const fileExt = newCoverFile.name.split(".").pop();
        const filePath = `covers/${Date.now()}-${slug}.${fileExt}`;

        const { error: uploadErr } = await supabase.storage
          .from("resource-images")
          .upload(filePath, newCoverFile, { cacheControl: "3600", upsert: false });

        if (uploadErr) {
          setMessage(`Cover image upload failed: ${uploadErr.message}`);
          setSaving(false);
          return;
        }

        const { data: publicUrlData } = supabase.storage
          .from("resource-images")
          .getPublicUrl(filePath);

        finalCoverUrl = publicUrlData.publicUrl;
      }

      if (!finalCoverUrl && existingGalleryUrls.length > 0) {
        finalCoverUrl = existingGalleryUrls[0];
      }

      const formattedCategory =
        type === "Article"
          ? "Articles"
          : galleryCategory === "Camp Meeting"
          ? "Camp Meetings"
          : "Outreaches";

      // 1. Update Primary Resource Row (without unmapped 'images' field)
      const { error: updateError } = await supabase
        .from("resources")
        .update({
          title,
          type,
          category: formattedCategory,
          description: description || null,
          content: type === "Article" ? content || null : null,
          cover_image: finalCoverUrl,
          gallery_images: existingGalleryUrls,
          event_name: type === "Gallery" ? eventName.trim() || title.trim() : null,
          resource_date: resourceDate || null,
          status,
          featured: featured === "Yes",
        })
        .eq("id", resourceId);

      if (updateError) {
        setMessage(updateError.message);
        setSaving(false);
        return;
      }

      // 2. Sync Relational resource_images table
      await supabase.from("resource_images").delete().eq("resource_id", resourceId);

      if (existingGalleryUrls.length > 0) {
        const imageRows = existingGalleryUrls.map((url) => ({
          resource_id: resourceId,
          image_url: url,
        }));
        await supabase.from("resource_images").insert(imageRows);
      }

      setMessage("Resource and photos updated successfully!");
      setSaving(false);

      setTimeout(() => {
        router.push("/admin/resources");
        router.refresh();
      }, 1000);
    } catch (err: any) {
      setMessage(err.message || "An unexpected error occurred while updating.");
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <main className="max-w-5xl mx-auto p-6 md:p-10">
      <Link
        href="/admin/resources"
        className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-900 mb-6 transition"
      >
        <ArrowLeft size={16} />
        Back to Resources
      </Link>

      <div>
        <h1 className="text-3xl font-bold text-gray-900">Edit Event Album & Story</h1>
        <p className="mt-1 text-sm text-gray-500">
          Modify details, manage uploaded pictures, or add new photos to this record.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-8 rounded-3xl border border-gray-200 bg-white p-8 shadow-sm space-y-6"
      >
        <div className="grid gap-6 md:grid-cols-2">
          {/* Resource Type */}
          <div>
            <label className="mb-2 block font-semibold text-gray-900 text-sm">Resource Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-orange-500 bg-white"
            >
              <option value="Gallery">Gallery / Event Photos</option>
              <option value="Article">Article / Written Story</option>
            </select>
          </div>

          {/* Date of Event */}
          <div>
            <label className="mb-2 block font-semibold text-gray-900 text-sm">Date of Event</label>
            <input
              type="date"
              value={resourceDate}
              onChange={(e) => setResourceDate(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-orange-500 bg-white font-medium"
            />
          </div>

          {/* Gallery Category */}
          {type === "Gallery" && (
            <div>
              <label className="mb-2 block font-semibold text-gray-900 text-sm">Gallery Section</label>
              <select
                value={galleryCategory}
                onChange={(e) => setGalleryCategory(e.target.value)}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-orange-500 bg-white"
              >
                <option value="Camp Meeting">Camp Meeting (Separate Album)</option>
                <option value="Outreach">Outreach (Separate Album)</option>
              </select>
            </div>
          )}

          {/* Event / Edition Identifier */}
          {type === "Gallery" && (
            <div>
              <label className="mb-2 block font-semibold text-gray-900 text-sm">
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
            <label className="mb-2 block font-semibold text-gray-900 text-sm">
              {type === "Article" ? "Article Title *" : "Album & Meeting Title *"}
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-orange-500 font-medium"
            />
          </div>

          {/* Short Description */}
          <div className="md:col-span-2">
            <label className="mb-2 block font-semibold text-gray-900 text-sm">Summary / Reflection</label>
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
              <label className="mb-2 block font-semibold text-gray-900 text-sm">Article Content</label>
              <textarea
                rows={10}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write full article here..."
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-orange-500"
              />
            </div>
          )}
        </div>

        {/* GALLERY PHOTO MANAGER */}
        {type === "Gallery" && (
          <div className="border-t border-gray-100 pt-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="text-base font-bold text-gray-900">Pictures in this Album ({existingGalleryUrls.length})</h3>
                <p className="text-xs text-gray-500">
                  Delete unwanted photos, select which one should be the cover photo, or upload additional photos.
                </p>
              </div>

              <label className="inline-flex items-center gap-2 cursor-pointer rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-slate-800 shrink-0">
                {uploading ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
                <span>{uploading ? "Uploading..." : "Add Pictures"}</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleAddGalleryPictures}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
            </div>

            {existingGalleryUrls.length === 0 ? (
              <div className="rounded-2xl border-2 border-dashed border-gray-200 p-8 text-center bg-gray-50/50">
                <ImageIcon size={36} className="mx-auto text-gray-400" />
                <p className="mt-2 text-sm text-gray-500">No photos currently uploaded in this album.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {existingGalleryUrls.map((imgUrl, index) => {
                  const isCover = coverImageUrl === imgUrl;
                  return (
                    <div
                      key={index}
                      className={`group relative overflow-hidden rounded-2xl border bg-slate-900 ${
                        isCover ? "border-orange-500 ring-2 ring-orange-500" : "border-gray-200"
                      }`}
                    >
                      <img
                        src={imgUrl}
                        alt=""
                        className="h-32 w-full object-cover transition group-hover:opacity-80"
                      />

                      {/* Set As Cover Button */}
                      <button
                        type="button"
                        onClick={() => setCoverImageUrl(imgUrl)}
                        className={`absolute top-2 left-2 rounded-lg px-2 py-0.5 text-[10px] font-bold ${
                          isCover ? "bg-orange-500 text-white" : "bg-black/70 text-white hover:bg-black"
                        }`}
                      >
                        {isCover ? "Primary Cover" : "Make Cover"}
                      </button>

                      {/* Delete Button */}
                      <button
                        type="button"
                        onClick={() => handleRemovePhoto(index)}
                        className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-lg bg-red-600/90 text-white transition hover:bg-red-700 shadow-sm"
                        title="Delete photo from album"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Change Cover Photo Manually */}
        <div className="border-t border-gray-100 pt-6">
          <label className="mb-2 block font-semibold text-gray-900 text-sm">
            Replace Primary Cover Photo with a New File (Optional)
          </label>
          <div className="rounded-2xl border-2 border-dashed border-orange-200 bg-orange-50/40 p-5 text-center">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setNewCoverFile(e.target.files?.[0] || null)}
              className="mx-auto block text-sm text-gray-500 file:mr-4 file:rounded-full file:border-0 file:bg-orange-500 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-orange-600"
            />
            {newCoverFile && (
              <p className="mt-2 text-sm font-semibold text-green-600">
                New cover chosen: {newCoverFile.name}
              </p>
            )}
          </div>
        </div>

        {/* Status & Featured */}
        <div className="grid gap-6 md:grid-cols-2 border-t border-gray-100 pt-6">
          <div>
            <label className="mb-2 block font-semibold text-gray-900 text-sm">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 bg-white font-medium"
            >
              <option value="Published">Published</option>
              <option value="Draft">Draft</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block font-semibold text-gray-900 text-sm">Featured on Explore</label>
            <select
              value={featured}
              onChange={(e) => setFeatured(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 bg-white font-medium"
            >
              <option value="No">No</option>
              <option value="Yes">Yes</option>
            </select>
          </div>
        </div>

        {/* Alert Feedback Message */}
        {message && (
          <div
            className={`rounded-xl px-4 py-3 text-sm font-medium ${
              message.includes("success")
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {message}
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-8 flex gap-4 border-t border-gray-100 pt-6">
          <button
            type="submit"
            disabled={saving || uploading}
            className="flex items-center gap-2 rounded-xl bg-orange-500 px-8 py-3.5 font-bold text-white shadow-md transition hover:bg-orange-600 disabled:opacity-60"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            <span>{saving ? "Saving Changes..." : "Save Event Album"}</span>
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/resources")}
            className="rounded-xl border border-gray-300 px-8 py-3.5 font-semibold text-gray-700 hover:bg-gray-100 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </main>
  );
}