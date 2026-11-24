"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  Users,
  Church,
  UserCheck,
  Building2,
  Baby,
  Search,
  Download,
  Trash2,
} from "lucide-react";

type RegistrationCategory =
  | "guest"
  | "church"
  | "parent_and_children"
  | "corporate";

interface CampRegistration {
  id: string;
  registration_code: string | null;
  category: RegistrationCategory;
  primary_contact_name: string;
  email: string;
  phone: string;
  total_attendees: number;
  details: Record<string, any>;
  created_at: string;
}

export default function AdminCampRegistrationsPage() {
  const [registrations, setRegistrations] = useState<CampRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadRegistrations();
  }, []);

  async function loadRegistrations() {
    setLoading(true);
    const { data, error } = await supabase
      .from("camp_registrations")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error loading camp registrations:", error);
      setLoading(false);
      return;
    }

    setRegistrations(data || []);
    setLoading(false);
  }

  async function handleDelete(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this registration record?"
    );
    if (!confirmed) return;

    const { error } = await supabase
      .from("camp_registrations")
      .delete()
      .eq("id", id);

    if (error) {
      alert("Failed to delete registration: " + error.message);
      return;
    }

    setRegistrations((prev) => prev.filter((item) => item.id !== id));
  }

  // Headcount calculations
  const totalHeadcount = registrations.reduce(
    (sum, r) => sum + (r.total_attendees || 0),
    0
  );
  const getCategoryHeadcount = (cat: RegistrationCategory) =>
    registrations
      .filter((r) => r.category === cat)
      .reduce((sum, r) => sum + (r.total_attendees || 0), 0);

  // Filter & Search (includes registration code + name verification)
  const filteredRegistrations = registrations.filter((reg) => {
    const matchesCategory =
      selectedCategory === "all" || reg.category === selectedCategory;

    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !q ||
      (reg.registration_code &&
        reg.registration_code.toLowerCase().includes(q)) ||
      reg.primary_contact_name.toLowerCase().includes(q) ||
      reg.email.toLowerCase().includes(q) ||
      reg.phone.toLowerCase().includes(q) ||
      JSON.stringify(reg.details).toLowerCase().includes(q);

    return matchesCategory && matchesSearch;
  });

  // Export filtered records to CSV
  function exportToCSV() {
    const headers = [
      "Reg. Code",
      "Category",
      "Primary Contact",
      "Email",
      "Phone",
      "Total Attendees",
      "Details",
      "Registered At",
    ];

    const rows = filteredRegistrations.map((r) => [
      r.registration_code || "",
      r.category.replace(/_/g, " "),
      `"${r.primary_contact_name.replace(/"/g, '""')}"`,
      r.email,
      `"${r.phone}"`,
      r.total_attendees,
      `"${JSON.stringify(r.details).replace(/"/g, '""')}"`,
      new Date(r.created_at).toLocaleString(),
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `camp-registrations-${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  const categoryBadge = (cat: RegistrationCategory) => {
    const styles: Record<RegistrationCategory, string> = {
      guest: "bg-blue-50 text-blue-700 border-blue-200",
      church: "bg-purple-50 text-purple-700 border-purple-200",
      parent_and_children: "bg-orange-50 text-orange-700 border-orange-200",
      corporate: "bg-emerald-50 text-emerald-700 border-emerald-200",
    };
    const labels: Record<RegistrationCategory, string> = {
      guest: "Guest",
      church: "Church Group",
      parent_and_children: "Parent & Kids",
      corporate: "Corporate",
    };

    return (
      <span
        className={`inline-block rounded-full border px-3 py-1 text-xs font-semibold ${styles[cat]}`}
      >
        {labels[cat]}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Camp Meeting Registrations
          </h1>
          <p className="text-sm text-gray-500">
            Search by registration code (e.g. REF-123456) or name to verify attendees at check-in.
          </p>
        </div>

        <button
          onClick={exportToCSV}
          disabled={filteredRegistrations.length === 0}
          className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600 disabled:opacity-50"
        >
          <Download size={16} />
          Export CSV
        </button>
      </div>

      {/* Headcount Summary Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <div className="rounded-2xl border border-orange-200 bg-orange-50 p-5">
          <div className="flex items-center justify-between text-orange-600">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Total Expected
            </span>
            <Users size={18} />
          </div>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {totalHeadcount}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Across {registrations.length} submissions
          </p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Guests
            </span>
            <UserCheck size={18} className="text-blue-500" />
          </div>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {getCategoryHeadcount("guest")}
          </p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Churches
            </span>
            <Church size={18} className="text-purple-500" />
          </div>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {getCategoryHeadcount("church")}
          </p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Parents & Kids
            </span>
            <Baby size={18} className="text-orange-500" />
          </div>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {getCategoryHeadcount("parent_and_children")}
          </p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Corporate
            </span>
            <Building2 size={18} className="text-emerald-500" />
          </div>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {getCategoryHeadcount("corporate")}
          </p>
        </div>
      </div>

      {/* Filters & Search Bar */}
      <div className="flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {[
            { id: "all", label: "All" },
            { id: "guest", label: "Guests" },
            { id: "church", label: "Churches" },
            { id: "parent_and_children", label: "Parents & Kids" },
            { id: "corporate", label: "Corporate" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedCategory(tab.id)}
              className={`rounded-xl px-4 py-2 text-xs font-semibold transition ${
                selectedCategory === tab.id
                  ? "bg-orange-500 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-80">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Verify code (REF-...) or search name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-gray-200 py-2 pl-10 pr-4 text-sm text-gray-900 placeholder:text-gray-400 focus:border-orange-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Data Table */}
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        {loading ? (
          <div className="py-16 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-orange-100 border-t-orange-500" />
            <p className="mt-4 text-sm text-gray-500">Loading registrations...</p>
          </div>
        ) : filteredRegistrations.length === 0 ? (
          <div className="py-16 text-center text-sm text-gray-500">
            No registrations found matching your search or filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="border-b border-gray-100 bg-gray-50 text-xs font-semibold uppercase tracking-wider text-gray-500">
                <tr>
                  <th className="px-5 py-3.5">Reg. Code</th>
                  <th className="px-5 py-3.5">Category</th>
                  <th className="px-5 py-3.5">Primary Contact</th>
                  <th className="px-5 py-3.5">Contact Info</th>
                  <th className="px-5 py-3.5">Headcount</th>
                  <th className="px-5 py-3.5">Registration Details</th>
                  <th className="px-5 py-3.5">Date</th>
                  <th className="px-5 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredRegistrations.map((reg) => (
                  <tr key={reg.id} className="hover:bg-gray-50/70">
                    <td className="px-5 py-4 align-top font-mono text-xs font-bold text-orange-600 whitespace-nowrap">
                      {reg.registration_code || "—"}
                    </td>
                    <td className="px-5 py-4 align-top">
                      {categoryBadge(reg.category)}
                    </td>
                    <td className="px-5 py-4 align-top font-semibold text-gray-900">
                      {reg.primary_contact_name}
                    </td>
                    <td className="px-5 py-4 align-top text-xs text-gray-600">
                      <div>{reg.email}</div>
                      <div className="mt-0.5 font-medium text-gray-800">
                        {reg.phone}
                      </div>
                    </td>
                    <td className="px-5 py-4 align-top font-bold text-gray-900">
                      {reg.total_attendees}
                    </td>
                    <td className="px-5 py-4 align-top text-xs text-gray-700 space-y-1 max-w-xs">
                      {reg.category === "guest" && (
                        <>
                          <div>
                            <span className="font-semibold">Location:</span>{" "}
                            {reg.details.city_or_branch}
                          </div>
                          {reg.details.arrival_date && (
                            <div>
                              <span className="font-semibold">Arrival:</span>{" "}
                              {reg.details.arrival_date}
                            </div>
                          )}
                          <div>
                            <span className="font-semibold">Accommodation:</span>{" "}
                            {reg.details.accommodation_needed ? "Yes" : "No"}
                          </div>
                          {reg.details.special_needs &&
                            reg.details.special_needs !== "None" && (
                              <div>
                                <span className="font-semibold">Needs:</span>{" "}
                                {reg.details.special_needs}
                              </div>
                            )}
                        </>
                      )}

                      {reg.category === "church" && (
                        <>
                          <div>
                            <span className="font-semibold">Church:</span>{" "}
                            {reg.details.church_name}
                          </div>
                          <div>
                            <span className="font-semibold">Pastor/Leader:</span>{" "}
                            {reg.details.pastor_or_leader}
                          </div>
                          <div>
                            <span className="font-semibold">Arrival:</span>{" "}
                            {reg.details.arrival_date}
                          </div>
                        </>
                      )}

                      {reg.category === "parent_and_children" && (
                        <>
                          <div>
                            <span className="font-semibold">Parent Attending:</span>{" "}
                            {reg.details.parent_attending ? "Yes" : "No"}
                          </div>
                          {reg.details.home_address && (
                            <div>
                              <span className="font-semibold">Address:</span>{" "}
                              {reg.details.home_address}
                            </div>
                          )}
                          <div>
                            <span className="font-semibold">Emergency:</span>{" "}
                            {reg.details.emergency_contact}
                          </div>
                          {reg.details.transport_mode === "camp_pickup" ? (
                            <>
                              <div>
                                <span className="font-semibold text-orange-600">
                                  Pick-up Point:
                                </span>{" "}
                                {reg.details.pickup_location}
                              </div>
                              <div>
                                <span className="font-semibold text-orange-600">
                                  Return Point:
                                </span>{" "}
                                {reg.details.return_location}
                              </div>
                            </>
                          ) : (
                            <>
                              {reg.details.person_bringing && (
                                <div>
                                  <span className="font-semibold">
                                    Brought By:
                                  </span>{" "}
                                  {reg.details.person_bringing}
                                </div>
                              )}
                              {reg.details.person_picking_up && (
                                <div>
                                  <span className="font-semibold">
                                    Picked Up By:
                                  </span>{" "}
                                  {reg.details.person_picking_up}
                                </div>
                              )}
                            </>
                          )}
                          <div>
                            <span className="font-semibold">
                              Children ({reg.details.children?.length || 0}):
                            </span>{" "}
                            {reg.details.children
                              ?.map(
                                (c: any) => `${c.name} (${c.age}y, ${c.gender})`
                              )
                              .join(", ")}
                          </div>
                          {reg.details.special_needs &&
                            reg.details.special_needs !== "None" && (
                              <div>
                                <span className="font-semibold text-red-600">
                                  Special Needs:
                                </span>{" "}
                                {reg.details.special_needs}
                              </div>
                            )}
                        </>
                      )}

                      {reg.category === "corporate" && (
                        <>
                          <div>
                            <span className="font-semibold">Organization:</span>{" "}
                            {reg.details.organization_name}
                          </div>
                          <div>
                            <span className="font-semibold">Sector:</span>{" "}
                            {reg.details.industry_or_sector}
                          </div>
                        </>
                      )}
                    </td>
                    <td className="px-5 py-4 align-top text-xs text-gray-500">
                      {new Date(reg.created_at).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-5 py-4 align-top text-right">
                      <button
                        onClick={() => handleDelete(reg.id)}
                        className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600"
                        title="Delete record"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}