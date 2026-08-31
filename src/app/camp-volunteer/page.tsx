"use client";

import { useEffect, useState, FormEvent } from "react";
import { supabase } from "@/lib/supabase";

export default function StandaloneCampVolunteerPage() {
  const [config, setConfig] = useState<{ title: string; units: string[]; days_options: string[] } | null>(null);
  const [fullName, setFullName] = useState("");
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [selectedUnits, setSelectedUnits] = useState<string[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function fetchConfig() {
      const { data } = await supabase
        .from("camp_volunteers_config")
        .select("*")
        .eq("id", "00000000-0000-0000-0000-000000000001")
        .single();

      if (data) {
        setConfig(data);
      } else {
        setConfig({
          title: "Ikere Children Camp Meeting - Volunteer Registration",
          units: ["Choir", "Ushering", "Media", "Sanitation"],
          days_options: ["Day 1", "Day 2", "Day 3", "Day 4"],
        });
      }
      setLoading(false);
    }
    fetchConfig();
  }, []);

  function handleDayToggle(day: string) {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter((d) => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  }

  function handleUnitToggle(unit: string) {
    if (selectedUnits.includes(unit)) {
      setSelectedUnits(selectedUnits.filter((u) => u !== unit));
    } else {
      setSelectedUnits([...selectedUnits, unit]);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (selectedDays.length === 0) {
      setMessage("Please select at least one day of availability.");
      return;
    }
    if (selectedUnits.length === 0) {
      setMessage("Please select at least one unit you want to serve in.");
      return;
    }

    setSubmitting(true);
    setMessage("");

    const { error } = await supabase.from("camp_volunteers_submissions").insert({
      full_name: fullName,
      days_staying: selectedDays,
      units: selectedUnits,
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Registration submitted successfully! Thank you.");
      setFullName("");
      setSelectedDays([]);
      setSelectedUnits([]);
    }
    setSubmitting(false);
  }

  if (loading) {
    return <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">Loading...</div>;
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white py-16 px-4 flex items-center justify-center">
      <div className="mx-auto max-w-lg w-full space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-orange-400">The Refinery International</span>
          <h1 className="text-3xl font-extrabold sm:text-4xl">{config?.title}</h1>
          <p className="text-gray-400 text-sm">Fill out the form below to register your availability for the camp meeting.</p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-xl space-y-6">
          <div>
            <label className="mb-2 block font-semibold text-sm">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter your full name"
              required
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white placeholder:text-gray-500 outline-none focus:border-orange-500"
            />
          </div>

          {/* Days of Availability Checkboxes */}
          <div>
            <label className="mb-2 block font-semibold text-sm">Days of Availability / Staying <span className="text-xs font-normal text-gray-400">(Select multiple)</span></label>
            <div className="grid grid-cols-2 gap-2 pt-1">
              {config?.days_options?.map((day) => {
                const isSelected = selectedDays.includes(day);
                return (
                  <div
                    key={day}
                    onClick={() => handleDayToggle(day)}
                    className={`flex items-center gap-3 rounded-xl border p-3 cursor-pointer transition ${
                      isSelected ? "border-orange-500 bg-orange-500/10" : "border-slate-800 bg-slate-950 hover:border-slate-700"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => {}}
                      className="h-4 w-4 rounded border-slate-700 text-orange-600 focus:ring-orange-500"
                    />
                    <span className="text-sm text-white">{day}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Units Checkboxes */}
          <div>
            <label className="mb-2 block font-semibold text-sm">Unit(s) You Want to Serve In <span className="text-xs font-normal text-gray-400">(Select multiple)</span></label>
            <div className="space-y-2 pt-1">
              {config?.units?.map((unit) => {
                const isSelected = selectedUnits.includes(unit);
                return (
                  <div
                    key={unit}
                    onClick={() => handleUnitToggle(unit)}
                    className={`flex items-center gap-3 rounded-xl border p-3 cursor-pointer transition ${
                      isSelected ? "border-orange-500 bg-orange-500/10" : "border-slate-800 bg-slate-950 hover:border-slate-700"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => {}}
                      className="h-4 w-4 rounded border-slate-700 text-orange-600 focus:ring-orange-500"
                    />
                    <span className="text-sm text-white">{unit}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {message && (
            <div className={`rounded-xl px-4 py-3 text-sm ${message.includes("success") ? "bg-green-950 text-green-300 border border-green-800" : "bg-red-950 text-red-300 border border-red-800"}`}>
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-orange-500 hover:bg-orange-600 py-3.5 font-bold text-white transition disabled:opacity-60 text-sm"
          >
            {submitting ? "Submitting..." : "Submit Registration"}
          </button>
        </form>
      </div>
    </main>
  );
}