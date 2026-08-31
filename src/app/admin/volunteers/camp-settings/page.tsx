"use client";

import { useEffect, useState, FormEvent } from "react";
import { supabase } from "@/lib/supabase";

export default function CampSettingsPage() {
  const [title, setTitle] = useState("Ikere Children Camp Meeting");
  const [unitsInput, setUnitsInput] = useState("");
  const [daysInput, setDaysInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadConfig() {
      const { data } = await supabase
        .from("camp_volunteers_config")
        .select("*")
        .eq("id", "00000000-0000-0000-0000-000000000001")
        .single();

      if (data) {
        setTitle(data.title || "");
        setUnitsInput(data.units ? data.units.join(", ") : "");
        setDaysInput(data.days_options ? data.days_options.join(", ") : "");
      }
    }
    loadConfig();
  }, []);

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const unitsArray = unitsInput.split(",").map((u) => u.trim()).filter(Boolean);
    const daysArray = daysInput.split(",").map((d) => d.trim()).filter(Boolean);

    const { error } = await supabase.from("camp_volunteers_config").upsert({
      id: "00000000-0000-0000-0000-000000000001",
      title,
      units: unitsArray,
      days_options: daysArray,
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Camp volunteer settings saved successfully!");
    }
    setLoading(false);
  }

  return (
    <main className="space-y-8 max-w-xl">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Camp Volunteer Settings</h1>
        <p className="mt-2 text-gray-500 text-sm">Configure form title, selectable units, and selectable days.</p>
      </div>

      <form onSubmit={handleSave} className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm space-y-6">
        <div>
          <label className="mb-2 block font-semibold text-sm text-gray-900">Camp/Form Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-orange-500"
          />
        </div>

        <div>
          <label className="mb-2 block font-semibold text-sm text-gray-900">Available Days (comma-separated)</label>
          <input
            type="text"
            value={daysInput}
            onChange={(e) => setDaysInput(e.target.value)}
            required
            placeholder="Day 1, Day 2, Day 3, Day 4"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-orange-500"
          />
          <p className="text-xs text-gray-500 mt-1">Volunteers will see these as checkboxes to pick multiple days.</p>
        </div>

        <div>
          <label className="mb-2 block font-semibold text-sm text-gray-900">Available Units (comma-separated)</label>
          <textarea
            rows={3}
            value={unitsInput}
            onChange={(e) => setUnitsInput(e.target.value)}
            required
            placeholder="Choir, Ushering, Media, Sanitation"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-orange-500"
          />
          <p className="text-xs text-gray-500 mt-1">Volunteers will see these as checkboxes to pick multiple units.</p>
        </div>

        {message && <p className="text-sm font-semibold text-green-600">{message}</p>}

        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white transition hover:bg-orange-600 text-sm"
        >
          {loading ? "Saving..." : "Save Settings"}
        </button>
      </form>
    </main>
  );
}