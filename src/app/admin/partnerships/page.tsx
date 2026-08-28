"use client";

import { useEffect, useState } from "react";
import { 
  Users, 
  ShieldCheck, 
  HeartHandshake, 
  Church, 
  Building2, 
  Package, 
  Search, 
  Phone, 
  Mail, 
  MapPin, 
  Trash2 
} from "lucide-react";
import { supabase } from "@/lib/supabase";

type Partnership = {
  id: string;
  partner_type: string;
  full_name: string;
  organization_name: string | null;
  email: string;
  phone: string;
  city: string | null;
  financial_frequency: string | null;
  financial_pledge: number | null;
  service_professions: string[] | null;
  service_other: string | null;
  church_support_types: string[] | null;
  corporate_support_types: string[] | null;
  resource_items: string[] | null;
  notes: string | null;
  status: string;
  created_at: string;
};

export default function AdminPartnerships() {
  const [partners, setPartners] = useState<Partnership[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const loadPartners = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("partnerships")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error loading partners:", error);
    } else {
      setPartners(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadPartners();
  }, []);

  const updateStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase
      .from("partnerships")
      .update({ status: newStatus })
      .eq("id", id);

    if (!error) {
      setPartners((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p))
      );
    }
  };

  const deletePartner = async (id: string) => {
    if (!confirm("Are you sure you want to remove this partner record?")) return;
    const { error } = await supabase.from("partnerships").delete().eq("id", id);
    if (!error) {
      setPartners((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const filteredPartners = partners.filter((p) => {
    const matchesTab = activeTab === "all" || p.partner_type.toLowerCase() === activeTab.toLowerCase();
    const matchesSearch =
      p.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.organization_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.phone.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="p-6 md:p-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Ministry Partnerships</h1>
          <p className="mt-1 text-sm text-gray-500">
            Track and coordinate all long-term covenant partners across all tracks.
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-100 px-3.5 py-1.5 text-xs font-bold text-orange-800">
          {partners.length} Total Partners
        </span>
      </div>

      {/* Search & Track Filters */}
      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, organization, email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-2xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-orange-500"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {["all", "Prayer", "Financial", "Service", "Church", "Corporate", "Resource"].map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setActiveTab(t)}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold capitalize transition ${
                activeTab.toLowerCase() === t.toLowerCase()
                  ? "bg-slate-900 text-white"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Partner Cards List */}
      <div className="mt-6 space-y-4">
        {loading ? (
          <div className="py-16 text-center text-sm text-gray-500">Loading partners...</div>
        ) : filteredPartners.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-gray-300 bg-white py-16 text-center text-sm text-gray-500">
            No partner registrations found.
          </div>
        ) : (
          filteredPartners.map((p) => (
            <div
              key={p.id}
              className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-lg bg-orange-500 px-3 py-1 text-xs font-bold text-white">
                      {p.partner_type} Partner
                    </span>
                    {p.organization_name && (
                      <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                        🏛️ {p.organization_name}
                      </span>
                    )}
                  </div>

                  <h3 className="mt-3 text-xl font-bold text-gray-900">{p.full_name}</h3>

                  <div className="mt-2 flex flex-wrap gap-4 text-xs font-medium text-gray-600">
                    <span className="flex items-center gap-1">
                      <Phone size={13} className="text-gray-400" /> {p.phone}
                    </span>
                    <span className="flex items-center gap-1">
                      <Mail size={13} className="text-gray-400" /> {p.email}
                    </span>
                    {p.city && (
                      <span className="flex items-center gap-1">
                        <MapPin size={13} className="text-gray-400" /> {p.city}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <select
                    value={p.status}
                    onChange={(e) => updateStatus(p.id, e.target.value)}
                    className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-bold outline-none focus:border-orange-500"
                  >
                    <option value="Active">🟢 Active</option>
                    <option value="Contacted">📞 Contacted</option>
                    <option value="Pending Review">⏳ Pending Review</option>
                  </select>

                  <button
                    type="button"
                    onClick={() => deletePartner(p.id)}
                    className="rounded-xl p-2 text-gray-400 hover:bg-red-50 hover:text-red-600 transition"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Specific Track Badges */}
              <div className="mt-4 rounded-2xl bg-gray-50 p-4 text-xs">
                {p.partner_type === "Financial" && (
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-gray-800">Frequency: {p.financial_frequency}</span>
                    {p.financial_pledge && (
                      <span className="font-extrabold text-emerald-600">
                        Pledged: ₦{p.financial_pledge.toLocaleString()}
                      </span>
                    )}
                  </div>
                )}

                {p.partner_type === "Service" && p.service_professions && (
                  <div className="flex flex-wrap gap-1.5">
                    {p.service_professions.map((s, idx) => (
                      <span key={idx} className="rounded-md bg-white border border-gray-200 px-2 py-0.5 font-semibold text-gray-700">
                        {s}
                      </span>
                    ))}
                    {p.service_other && <span className="text-orange-700 font-semibold">Other: {p.service_other}</span>}
                  </div>
                )}

                {p.partner_type === "Church" && p.church_support_types && (
                  <div className="flex flex-wrap gap-1.5">
                    {p.church_support_types.map((c, idx) => (
                      <span key={idx} className="rounded-md bg-white border border-gray-200 px-2 py-0.5 font-semibold text-gray-700">
                        {c}
                      </span>
                    ))}
                  </div>
                )}

                {p.partner_type === "Corporate" && p.corporate_support_types && (
                  <div className="flex flex-wrap gap-1.5">
                    {p.corporate_support_types.map((c, idx) => (
                      <span key={idx} className="rounded-md bg-white border border-gray-200 px-2 py-0.5 font-semibold text-gray-700">
                        {c}
                      </span>
                    ))}
                  </div>
                )}

                {p.partner_type === "Resource" && p.resource_items && (
                  <div className="flex flex-wrap gap-1.5">
                    {p.resource_items.map((r, idx) => (
                      <span key={idx} className="rounded-md bg-white border border-gray-200 px-2 py-0.5 font-semibold text-gray-700">
                        {r}
                      </span>
                    ))}
                  </div>
                )}

                {p.partner_type === "Prayer" && (
                  <span className="font-medium text-gray-600">
                    Committed to regular intercession for children outreaches and camp meetings.
                  </span>
                )}
              </div>

              {p.notes && (
                <p className="mt-3 text-xs italic text-gray-600 bg-orange-50/50 p-3 rounded-xl">
                  &ldquo;{p.notes}&rdquo;
                </p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}