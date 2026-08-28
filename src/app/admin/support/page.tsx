"use client";

import { useEffect, useState } from "react";
import { 
  Heart, 
  Package, 
  Calendar, 
  Phone, 
  Mail, 
  Trash2, 
  Search,
  CreditCard,
  Bell,
  RefreshCw,
  Clock
} from "lucide-react";
import { supabase } from "@/lib/supabase";

type SupportPledge = {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  is_anonymous: boolean;
  target_program: string;
  support_type: string; // 'Direct Transfer', 'Financial Pledge', 'Material Support'
  material_items: string[] | null;
  material_other: string | null;
  pledge_amount: number | null;
  payment_status: string; // 'Pledged', 'Direct Transfer', 'Fulfilled'
  fulfillment_date: string | null;
  subscribe_reminders: boolean;
  notes: string | null;
  created_at: string;
};

export default function AdminSupportPledges() {
  const [pledges, setPledges] = useState<SupportPledge[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const loadPledges = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("support_pledges")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error loading pledges:", error);
    } else {
      setPledges(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadPledges();
  }, []);

  const updateStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase
      .from("support_pledges")
      .update({ payment_status: newStatus })
      .eq("id", id);

    if (!error) {
      setPledges((prev) =>
        prev.map((item) => (item.id === id ? { ...item, payment_status: newStatus } : item))
      );
    }
  };

  const deletePledge = async (id: string) => {
    if (!confirm("Are you sure you want to delete this record?")) return;
    const { error } = await supabase.from("support_pledges").delete().eq("id", id);
    if (!error) {
      setPledges((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const filteredPledges = pledges.filter((item) => {
    const matchesFilter =
      filterType === "all" ||
      (filterType === "direct" && item.support_type === "Direct Transfer") ||
      (filterType === "pledge" && item.support_type === "Financial Pledge") ||
      (filterType === "materials" && item.support_type?.includes("Material"));

    const matchesSearch =
      (item.full_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.phone || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.target_program || "").toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="p-6 md:p-10">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Support & Giving Submissions</h1>
          <p className="mt-1 text-sm text-gray-500">
            Track direct bank transfers, scheduled pledges, and in-kind material contributions.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={loadPledges}
            className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs font-bold text-gray-700 shadow-sm transition hover:bg-gray-50"
          >
            <RefreshCw size={14} className={loading ? "animate-spin text-orange-500" : ""} />
            <span>Refresh</span>
          </button>
          <span className="inline-flex items-center rounded-full bg-orange-100 px-3.5 py-1.5 text-xs font-bold text-orange-800">
            {pledges.length} Total
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, phone, or program..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-2xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-orange-500"
          />
        </div>

        {/* Categories Filter Tabs */}
        <div className="flex flex-wrap gap-2">
          {[
            { id: "all", label: "All Giving" },
            { id: "direct", label: "Direct Transfers" },
            { id: "pledge", label: "Pledges" },
            { id: "materials", label: "Materials" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilterType(tab.id)}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
                filterType === tab.id
                  ? "bg-slate-900 text-white"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Submissions Cards */}
      <div className="mt-6 space-y-4">
        {loading ? (
          <div className="py-16 text-center text-sm text-gray-500">Loading giving records...</div>
        ) : filteredPledges.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-gray-300 bg-white py-16 text-center text-sm text-gray-500">
            No submissions found under this filter.
          </div>
        ) : (
          filteredPledges.map((item) => (
            <div
              key={item.id}
              className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Support Type Tag */}
                    <span
                      className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-bold ${
                        item.support_type === "Direct Transfer"
                          ? "bg-purple-100 text-purple-800"
                          : item.support_type?.includes("Financial")
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {item.support_type === "Direct Transfer" && <CreditCard size={12} />}
                      {item.support_type === "Financial Pledge" && <Heart size={12} />}
                      {item.support_type?.includes("Material") && <Package size={12} />}
                      {item.support_type || "Contribution"}
                    </span>

                    {/* Program Tag */}
                    {item.target_program && (
                      <span className="rounded-lg bg-orange-50 px-2.5 py-1 text-xs font-bold text-orange-700">
                        🎯 {item.target_program}
                      </span>
                    )}

                    {/* Anonymous Tag */}
                    {item.is_anonymous && (
                      <span className="rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600">
                        🔒 Anonymous Donor
                      </span>
                    )}

                    {/* Email Reminder Opt-in */}
                    {item.subscribe_reminders && (
                      <span className="inline-flex items-center gap-1 rounded-lg bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
                        <Bell size={11} /> Subscribed to Updates
                      </span>
                    )}
                  </div>

                  <h3 className="mt-3 text-lg font-bold text-gray-900">
                    {item.is_anonymous ? "Anonymous Supporter" : item.full_name || "Supporter"}
                  </h3>

                  <div className="mt-2 flex flex-wrap gap-4 text-xs font-medium text-gray-600">
                    {item.phone && (
                      <span className="flex items-center gap-1">
                        <Phone size={13} className="text-gray-400" /> {item.phone}
                      </span>
                    )}
                    {item.email && (
                      <span className="flex items-center gap-1">
                        <Mail size={13} className="text-gray-400" /> {item.email}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Calendar size={13} className="text-gray-400" /> Date:{" "}
                      {new Date(item.created_at).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                    {item.fulfillment_date && (
                      <span className="flex items-center gap-1 text-orange-600 font-semibold">
                        <Clock size={13} /> Promised By: {item.fulfillment_date}
                      </span>
                    )}
                  </div>
                </div>

                {/* Status & Amount Control */}
                <div className="flex flex-row items-center justify-between gap-3 border-t border-gray-100 pt-3 md:flex-col md:items-end md:border-none md:pt-0">
                  {item.pledge_amount ? (
                    <div className="text-right">
                      <span className="text-xs text-gray-400 block">
                        {item.support_type === "Direct Transfer" ? "Transferred / Estimated" : "Pledge Amount"}
                      </span>
                      <span className="text-xl font-extrabold text-emerald-600">
                        ₦{item.pledge_amount.toLocaleString()}
                      </span>
                    </div>
                  ) : null}

                  <div className="flex items-center gap-2">
                    <select
                      value={item.payment_status || "Pledged"}
                      onChange={(e) => updateStatus(item.id, e.target.value)}
                      className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-bold outline-none focus:border-orange-500"
                    >
                      <option value="Direct Transfer">💳 Direct Transfer</option>
                      <option value="Pledged">⏳ Pledged</option>
                      <option value="Pending">⏳ Pending</option>
                      <option value="Fulfilled">✅ Fulfilled / Confirmed</option>
                    </select>

                    <button
                      type="button"
                      onClick={() => deletePledge(item.id)}
                      className="rounded-xl p-2 text-gray-400 hover:bg-red-50 hover:text-red-600 transition"
                      title="Delete record"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Material Details */}
              {item.material_items && item.material_items.length > 0 && (
                <div className="mt-4 rounded-2xl bg-slate-50 p-4">
                  <span className="text-xs font-bold text-gray-700">Supplied Materials:</span>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {item.material_items.map((m, idx) => (
                      <span
                        key={idx}
                        className="rounded-lg border border-gray-200 bg-white px-2.5 py-1 text-xs font-semibold text-gray-800"
                      >
                        ✓ {m}
                      </span>
                    ))}
                    {item.material_other && (
                      <span className="rounded-lg border border-orange-200 bg-orange-50 px-2.5 py-1 text-xs font-semibold text-orange-800">
                        Other: {item.material_other}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Notes */}
              {item.notes && (
                <p className="mt-3 text-xs italic text-gray-600 bg-orange-50/50 p-3 rounded-xl">
                  &ldquo;{item.notes}&rdquo;
                </p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}