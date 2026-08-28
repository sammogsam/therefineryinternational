"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  FileText,
  Images,
  Plus,
  Pencil,
  Trash2,
  CalendarDays,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  X,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

type Resource = {
  id: string;
  title: string;
  slug: string;
  type: string;
  category: string | null;
  description: string | null;
  content: string | null;
  cover_image: string | null;
  gallery_images: string[] | null;
  event_name: string | null;
  resource_date: string | null;
  status: string;
  featured: boolean;
  created_at: string;
};

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Custom Modal & Toast States
  const [resourceToDelete, setResourceToDelete] = useState<Resource | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast((curr) => (curr?.message === message ? null : curr));
    }, 4000);
  };

  async function loadResources() {
    setLoading(true);
    setError("");

    const { data, error } = await supabase
      .from("resources")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      setError(error.message);
      setLoading(false);
      return;
    }

    setResources(data || []);
    setLoading(false);
  }

  useEffect(() => {
    loadResources();
  }, []);

  async function handleConfirmDelete() {
    if (!resourceToDelete) return;
    setIsDeleting(true);

    const { error } = await supabase
      .from("resources")
      .delete()
      .eq("id", resourceToDelete.id);

    if (error) {
      showToast(`Delete failed: ${error.message}`, "error");
    } else {
      setResources((current) =>
        current.filter((item) => item.id !== resourceToDelete.id)
      );
      showToast("Resource deleted successfully.", "success");
    }

    setIsDeleting(false);
    setResourceToDelete(null);
  }

  return (
    <main className="relative space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Resources & Galleries</h1>
          <p className="mt-2 text-gray-500">
            Manage your separate camp meeting albums, outreaches, and articles.
          </p>
        </div>

        <Link
          href="/admin/resources/new"
          className="inline-flex w-fit items-center gap-2 rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white transition hover:bg-orange-600"
        >
          <Plus size={18} />
          New Resource / Album
        </Link>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-2xl bg-red-50 p-5 text-red-700">
          <p className="font-semibold">Unable to load resources</p>
          <p className="mt-1 text-sm">{error}</p>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="rounded-3xl border border-gray-200 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-orange-500" />
          <p className="mt-4 text-gray-500">Loading albums & articles...</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && resources.length === 0 && (
        <div className="rounded-3xl border border-dashed border-gray-300 bg-white p-12 text-center">
          <FileText size={48} className="mx-auto text-orange-500" />
          <h2 className="mt-5 text-2xl font-bold text-gray-900">No resources yet</h2>
          <p className="mx-auto mt-2 max-w-md text-gray-500">
            Create your first camp meeting album or article to start building your gallery.
          </p>
          <Link
            href="/admin/resources/new"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white transition hover:bg-orange-600"
          >
            <Plus size={18} />
            Create Resource
          </Link>
        </div>
      )}

      {/* Resource Cards */}
      {!loading && resources.length > 0 && (
        <div className="grid gap-8 lg:grid-cols-2">
          {resources.map((resource) => {
            const photoCount = resource.gallery_images?.length || 0;

            return (
              <div
                key={resource.id}
                className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
              >
                {/* Cover Image */}
                {resource.cover_image ? (
                  <div className="h-52 w-full overflow-hidden bg-gray-100">
                    <img
                      src={resource.cover_image}
                      alt={resource.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex h-52 items-center justify-center bg-orange-50">
                    {resource.type === "Gallery" ? (
                      <Images size={52} className="text-orange-400" />
                    ) : (
                      <FileText size={52} className="text-orange-400" />
                    )}
                  </div>
                )}

                {/* Content */}
                <div className="p-7">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
                        {resource.category || resource.type}
                      </span>
                      <h2 className="mt-3 text-2xl font-bold text-gray-900">
                        {resource.title}
                      </h2>
                    </div>

                    <span
                      className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                        resource.status === "Published"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {resource.status}
                    </span>
                  </div>

                  {resource.resource_date && (
                    <p className="mt-3 flex items-center gap-1.5 text-xs text-gray-500">
                      <CalendarDays size={14} className="text-orange-500" />
                      {new Date(resource.resource_date + "T00:00:00").toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  )}

                  {resource.description && (
                    <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-gray-600">
                      {resource.description}
                    </p>
                  )}

                  {resource.type === "Gallery" && (
                    <div className="mt-4 flex items-center gap-2">
                      <span className="rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                        📸 {photoCount} picture{photoCount === 1 ? "" : "s"} in album
                      </span>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="mt-7 flex items-center gap-3 border-t border-gray-100 pt-6">
                    <Link
                      href={`/admin/resources/${resource.id}/edit`}
                      className="flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                    >
                      <Pencil size={16} />
                      Edit
                    </Link>

                    <button
                      type="button"
                      onClick={() => setResourceToDelete(resource)}
                      className="flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {resourceToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                <AlertTriangle size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Delete Resource</h3>
                <p className="text-xs text-gray-500">This action cannot be undone.</p>
              </div>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-gray-600">
              Are you sure you want to delete <strong className="text-gray-900">&ldquo;{resourceToDelete.title}&rdquo;</strong>?
            </p>

            <div className="mt-8 flex justify-end gap-3">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setResourceToDelete(null)}
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
                {isDeleting ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl border border-gray-100 bg-white px-5 py-4 shadow-2xl ring-1 ring-black/5">
          {toast.type === "success" ? (
            <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />
          ) : (
            <AlertCircle className="h-5 w-5 shrink-0 text-rose-500" />
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