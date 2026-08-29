"use client";

import { useEffect, useState } from "react";
import { 
  Calendar, 
  Plus, 
  Trash2, 
  Save, 
  Loader2, 
  CheckCircle, 
  Users, 
  PackageCheck,
  AlignLeft,
  Tag
} from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function AdminCampManagerPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Settings State
  const [eventType, setEventType] = useState<"Camp Meeting" | "Outreach">("Camp Meeting");
  const [eventName, setEventName] = useState("");
  const [formInstruction, setFormInstruction] = useState("");
  const [days, setDays] = useState<string[]>([]);
  const [newDayInput, setNewDayInput] = useState("");

  // Submissions State
  const [submissions, setSubmissions] = useState<any[]>([]);

  useEffect(() => {
    async function loadData() {
      setLoading(true);

      const { data: config } = await supabase
        .from("camp_meeting_settings")
        .select("*")
        .eq("id", "current_camp")
        .single();

      if (config) {
        setEventType(config.event_type || "Camp Meeting");
        setEventName(config.event_name || "");
        setFormInstruction(
          config.form_instruction ||
          "This is to collect information about availability and needs for the upcoming camp meeting. kindly fill in your availability and include things you will probably need for the camp meeting."
        );
        setDays(config.available_days || []);
      }

      const { data: subData } = await supabase
        .from("camp_availabilities")
        .select("*")
        .order("created_at", { ascending: false });

      if (subData) {
        setSubmissions(subData);
      }

      setLoading(false);
    }

    loadData();
  }, []);

  function handleAddDay(e: React.FormEvent) {
    e.preventDefault();
    if (!newDayInput.trim()) return;
    if (days.includes(newDayInput.trim())) {
      alert("This session option already exists.");
      return;
    }
    setDays([...days, newDayInput.trim()]);
    setNewDayInput("");
  }

  function handleRemoveDay(index: number) {
    setDays(days.filter((_, i) => i !== index));
  }

  async function handleSaveSettings(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    const { error } = await supabase
      .from("camp_meeting_settings")
      .upsert({
        id: "current_camp",
        event_type: eventType,
        event_name: eventName,
        form_instruction: formInstruction,
        available_days: days,
        updated_at: new Date().toISOString(),
      });

    setSaving(false);

    if (error) {
      setMessage({ type: "error", text: error.message });
    } else {
      setMessage({ type: "success", text: "Settings published! Team members will now see your exact instructions and session list." });
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
    <div className="max-w-5xl mx-auto space-y-10 p-6 md:p-8">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-orange-500">
          Admin Control Center
        </span>
        <h1 className="text-3xl font-extrabold text-gray-900 mt-1">
          Availability & Logistics Manager
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Configure active camp meetings or outreach events, provide custom instructions, and manage team choices.
        </p>
      </div>

      {message && (
        <div className={`rounded-2xl p-4 text-sm font-semibold flex items-center gap-2 ${
          message.type === "success" ? "bg-green-50 border border-green-200 text-green-700" : "bg-red-50 border border-red-200 text-red-700"
        }`}>
          <CheckCircle size={18} />
          <span>{message.text}</span>
        </div>
      )}

      {/* 1. SETTINGS FORM */}
      <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
        <div className="flex items-center gap-3 border-b border-gray-100 pb-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
            <Calendar size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Event & Availability Form Settings</h2>
            <p className="text-xs text-gray-500">Everything you configure here controls the Team Portal view.</p>
          </div>
        </div>

        <form onSubmit={handleSaveSettings} className="mt-6 space-y-6">
          <div className="grid sm:grid-cols-2 gap-6">
            {/* Event Type */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                Event Category
              </label>
              <select
                value={eventType}
                onChange={(e) => setEventType(e.target.value as any)}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 font-semibold focus:border-orange-500 focus:outline-none"
              >
                <option value="Camp Meeting">Camp Meeting</option>
                <option value="Outreach">Outreach Event</option>
              </select>
            </div>

            {/* Target Gathering */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                Target Gathering Name *
              </label>
              <input
                type="text"
                required
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                placeholder="e.g. Ikere Ekiti Camp Meeting 2026 or Hospital Outreach"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 font-semibold focus:border-orange-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Form Instruction / Notice */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
              Team Instructions & Purpose Notice
            </label>
            <textarea
              rows={3}
              value={formInstruction}
              onChange={(e) => setFormInstruction(e.target.value)}
              placeholder="e.g. This is to collect information about availability and needs for the upcoming camp meeting. kindly fill in your availability and include things youll probably need for the camp meeting."
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 focus:border-orange-500 focus:outline-none"
            />
          </div>

          {/* Dynamic Sessions & Day Choices */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
              Selectable Sessions / Days for Team Members ({days.length})
            </label>

            <div className="space-y-2">
              {days.map((day, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-800"
                >
                  <span className="flex items-center gap-2">
                    <Tag size={14} className="text-orange-500" />
                    {day}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveDay(idx)}
                    className="text-gray-400 hover:text-red-600 transition"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-4 flex gap-2">
              <input
                type="text"
                value={newDayInput}
                onChange={(e) => setNewDayInput(e.target.value)}
                placeholder="e.g. Morning Session, Day 1 - Vigil, Outreach Team A..."
                className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-orange-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddDay}
                className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-bold text-white hover:bg-slate-800 transition"
              >
                <Plus size={14} />
                <span>Add Session</span>
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 rounded-xl bg-orange-500 px-7 py-3 text-sm font-bold text-white shadow-lg shadow-orange-500/20 hover:bg-orange-600 transition disabled:opacity-50"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            <span>Save & Publish to Team Hub</span>
          </button>
        </form>
      </div>

      {/* 2. SUBMISSIONS TABLE */}
      <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
        <div className="flex items-center gap-3 border-b border-gray-100 pb-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
            <Users size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Team Member Responses ({submissions.length})
            </h2>
            <p className="text-xs text-gray-500">Live list of availability and requested items.</p>
          </div>
        </div>

        {submissions.length === 0 ? (
          <div className="text-center py-12 text-sm text-gray-400">
            No team responses submitted yet.
          </div>
        ) : (
          <div className="mt-6 divide-y divide-gray-100">
            {submissions.map((sub) => (
              <div key={sub.id} className="py-5 first:pt-0 last:pb-0 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <h3 className="text-base font-bold text-gray-900">{sub.member_name}</h3>
                  <span className="text-xs text-gray-400">{sub.member_email}</span>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {sub.available_dates?.map((dateStr: string, idx: number) => (
                    <span
                      key={idx}
                      className="rounded-lg bg-orange-50 border border-orange-200 px-2.5 py-1 text-xs font-bold text-orange-700"
                    >
                      {dateStr}
                    </span>
                  ))}
                </div>

                {sub.needed_items && (
                  <div className="flex items-start gap-2 pt-1 text-xs text-gray-600">
                    <PackageCheck size={14} className="text-orange-500 shrink-0 mt-0.5" />
                    <span><strong>Requested Items:</strong> {sub.needed_items}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}