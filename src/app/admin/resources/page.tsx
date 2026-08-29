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
  Clock,
  Check,
  Eye,
  User,
  Search,
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
  author_name: string | null;
  author_email: string | null;
  created_at: string;
};

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filters & Tabs
  const [activeTab, setActiveTab] = useState<"all" | "pending" | "published">("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Modals & Action States
  const [resourceToDelete, setResourceToDelete] = useState<Resource | null>(null);
  const [previewResource, setPreviewResource] = useState<Resource | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [approvingId, setApprovingId] = useState<string | null>(null);
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

  // Approve resource
  async function handleApprove(resource: Resource) {
    setApprovingId(resource.id);

    const { error } = await supabase
      .from("resources")
      .update({ status: "Published" })
      .eq("id", resource.id);

    if (error) {
      showToast(`Approval failed: ${error.message}`, "error");
    } else {
      setResources((current) =>
        current.map((item) =>
          item.id === resource.id ? { ...item, status: "Published" } : item
        )
      );
      if (previewResource?.id === resource.id) {
        setPreviewResource((curr) => (curr ? { ...curr, status: "Published" } : null));
      }
      showToast(`"${resource.title}" approved and published successfully!`, "success");
    }

    setApprovingId(null);
  }

  // Delete resource
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
      if (previewResource?.id === resourceToDelete.id) {
        setPreviewResource(null);
      }
      showToast("Resource deleted successfully.", "success");
    }

    setIsDeleting(false);
    setResourceToDelete(null);
  }

  // Count items awaiting approval
  const pendingCount = resources.filter((r) => r.status === "Pending Approval").length;

  // Filtered resources
  const filteredResources = resources.filter((r) => {
    const matchesSearch =
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.category && r.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (r.author_name && r.author_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (r.event_name && r.event_name.toLowerCase().includes(searchQuery.toLowerCase()));

    if (activeTab === "pending") {
      return matchesSearch && r.status === "Pending Approval";
    }
    if (activeTab === "published") {
      return matchesSearch && r.status === "Published";
    }
    return matchesSearch;
  });

  return (
    <main className="relative space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Resources & Galleries</h1>
          <p className="mt-2 text-gray-500">
            Manage your separate camp meeting albums, outreaches, and team-submitted articles.
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

      {/* Tabs & Search Bar */}
      <div className="flex flex-col gap-4 border-b border-gray-200 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
              activeTab === "all"
                ? "bg-gray-900 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            All ({resources.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("pending")}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition ${
              activeTab === "pending"
                ? "bg-orange-500 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <Clock size={16} />
            Pending Review
            {pendingCount > 0 && (
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                  activeTab === "pending"
                    ? "bg-white text-orange-600"
                    : "bg-orange-500 text-white"
                }`}
              >
                {pendingCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("published")}
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
              activeTab === "published"
                ? "bg-gray-900 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Published ({resources.filter((r) => r.status === "Published").length})
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search title, category, author..."
            className="w-full rounded-xl border border-gray-300 py-2 pl-9 pr-4 text-sm outline-none focus:border-orange-500"
          />
        </div>
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
      {!loading && !error && filteredResources.length === 0 && (
        <div className="rounded-3xl border border-dashed border-gray-300 bg-white p-12 text-center">
          <FileText size={48} className="mx-auto text-orange-500" />
          <h2 className="mt-5 text-2xl font-bold text-gray-900">
            {activeTab === "pending" ? "No pending submissions" : "No resources found"}
          </h2>
          <p className="mx-auto mt-2 max-w-md text-gray-500">
            {activeTab === "pending"
              ? "All submitted articles and media albums have been reviewed."
              : "Create your first camp meeting album or article to start building your gallery."}
          </p>
          {activeTab !== "pending" && (
            <Link
              href="/admin/resources/new"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white transition hover:bg-orange-600"
            >
              <Plus size={18} />
              Create Resource
            </Link>
          )}
        </div>
      )}

      {/* Resource Cards */}
      {!loading && filteredResources.length > 0 && (
        <div className="grid gap-8 lg:grid-cols-2">
          {filteredResources.map((resource) => {
            const photoCount = resource.gallery_images?.length || 0;
            const isPending = resource.status === "Pending Approval";

            return (
              <div
                key={resource.id}
                className={`overflow-hidden rounded-3xl border bg-white shadow-sm transition hover:shadow-md ${
                  isPending ? "border-orange-300 ring-2 ring-orange-200/50" : "border-gray-200"
                }`}
              >
                {/* Cover Image */}
                {resource.cover_image ? (
                  <div className="relative h-52 w-full overflow-hidden bg-gray-100">
                    <img
                      src={resource.cover_image}
                      alt={resource.title}
                      className="h-full w-full object-cover"
                    />
                    {isPending && (
                      <span className="absolute left-4 top-4 rounded-full bg-orange-600 px-3 py-1 text-xs font-bold text-white shadow-md">
                        Awaiting Admin Approval
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="relative flex h-52 items-center justify-center bg-orange-50">
                    {resource.type === "Gallery" ? (
                      <Images size={52} className="text-orange-400" />
                    ) : (
                      <FileText size={52} className="text-orange-400" />
                    )}
                    {isPending && (
                      <span className="absolute left-4 top-4 rounded-full bg-orange-600 px-3 py-1 text-xs font-bold text-white shadow-md">
                        Awaiting Admin Approval
                      </span>
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
                          : resource.status === "Pending Approval"
                          ? "bg-orange-100 text-orange-800 font-bold"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {resource.status}
                    </span>
                  </div>

                  {/* Author / Contributor Info */}
                  {resource.author_name && (
                    <p className="mt-2.5 flex items-center gap-1.5 text-xs font-medium text-gray-600">
                      <User size={14} className="text-orange-500" />
                      Submitted by: <strong className="text-gray-900">{resource.author_name}</strong>
                      {resource.author_email && (
                        <span className="text-gray-400">({resource.author_email})</span>
                      )}
                    </p>
                  )}

                  {resource.resource_date && (
                    <p className="mt-2.5 flex items-center gap-1.5 text-xs text-gray-500">
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
                  <div className="mt-7 flex flex-wrap items-center gap-3 border-t border-gray-100 pt-6">
                    {/* Approve Button (Visible for Pending items) */}
                    {isPending && (
                      <button
                        type="button"
                        disabled={approvingId === resource.id}
                        onClick={() => handleApprove(resource)}
                        className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-50"
                      >
                        <Check size={16} />
                        {approvingId === resource.id ? "Approving..." : "Approve & Publish"}
                      </button>
                    )}

                    {/* Preview Button */}
                    <button
                      type="button"
                      onClick={() => setPreviewResource(resource)}
                      className="flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                    >
                      <Eye size={16} />
                      Preview
                    </button>

                    {/* Edit Button */}
                    <Link
                      href={`/admin/resources/${resource.id}/edit`}
                      className="flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                    >
                      <Pencil size={16} />
                      Edit
                    </Link>

                    {/* Delete Button */}
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

      {/* Preview Modal */}
      {previewResource && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl sm:p-8 space-y-6">
            <div className="flex items-start justify-between border-b border-gray-100 pb-4">
              <div>
                <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
                  {previewResource.category || previewResource.type}
                </span>
                <h2 className="mt-2 text-2xl font-bold text-gray-900">{previewResource.title}</h2>
                {previewResource.author_name && (
                  <p className="mt-1 text-xs text-gray-500">
                    Submitted by: <strong>{previewResource.author_name}</strong>{" "}
                    {previewResource.author_email && `(${previewResource.author_email})`}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => setPreviewResource(null)}
                className="rounded-xl p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            {/* Description */}
            {previewResource.description && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Summary</h4>
                <p className="mt-1.5 rounded-2xl bg-gray-50 p-4 text-sm leading-relaxed text-gray-700">
                  {previewResource.description}
                </p>
              </div>
            )}

            {/* Content for Articles */}
            {previewResource.content && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Article Content</h4>
                <div className="mt-1.5 max-h-60 overflow-y-auto whitespace-pre-wrap rounded-2xl bg-gray-50 p-4 text-sm leading-relaxed text-gray-800">
                  {previewResource.content}
                </div>
              </div>
            )}

            {/* Photo Gallery Thumbnails */}
            {previewResource.gallery_images && previewResource.gallery_images.length > 0 && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                  Pictures ({previewResource.gallery_images.length})
                </h4>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                  {previewResource.gallery_images.map((imgUrl, i) => (
                    <a key={i} href={imgUrl} target="_blank" rel="noopener noreferrer">
                      <img
                        src={imgUrl}
                        alt=""
                        className="h-24 w-full rounded-xl object-cover border border-gray-200 transition hover:opacity-85"
                      />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 border-t border-gray-100 pt-5">
              {previewResource.status === "Pending Approval" ? (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setResourceToDelete(previewResource);
                      setPreviewResource(null);
                    }}
                    className="rounded-xl border border-red-200 px-5 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                  >
                    Reject & Delete
                  </button>
                  <button
                    type="button"
                    disabled={approvingId === previewResource.id}
                    onClick={() => handleApprove(previewResource)}
                    className="rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-50"
                  >
                    {approvingId === previewResource.id ? "Approving..." : "Approve & Publish"}
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setPreviewResource(null)}
                  className="rounded-xl bg-gray-900 px-6 py-2.5 text-sm font-semibold text-white hover:bg-gray-800 transition"
                >
                  Close Preview
                </button>
              )}
            </div>
          </div>
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