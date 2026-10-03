"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Users, Search, CheckCircle, Loader2, Calendar, Mail, Phone, MapPin, UserCheck, UserPlus, ShieldCheck, XCircle } from "lucide-react";

export default function AdminTeamBiodataPage() {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchRecords();
  }, []);

  async function fetchRecords() {
    setLoading(true);
    const { data } = await supabase
      .from("team_membership_records")
      .select("*")
      .order("submitted_at", { ascending: false });

    if (data && data.length > 0) {
      setRecords(data);
      // Keep currently selected record if it exists, otherwise default to first
      setSelectedRecord((prev: any) => prev ? data.find((r: any) => r.id === prev.id) || data[0] : data[0]);
    } else {
      setRecords([]);
      setSelectedRecord(null);
    }
    setLoading(false);
  }

  // Handle Approval Toggle
  async function handleToggleApproval(recordId: string, currentStatus: boolean) {
    setActionLoading(true);
    const { error } = await supabase
      .from("team_membership_records")
      .update({ is_approved: !currentStatus })
      .eq("id", recordId);

    if (!error) {
      await fetchRecords();
    } else {
      alert("Error updating status: " + error.message);
    }
    setActionLoading(false);
  }

  // Filter records based on name search
  const filteredRecords = records.filter((r) =>
    r.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.email_address?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <main className="space-y-8 max-w-7xl p-6 md:p-10">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Team Membership & Biodata Directory</h1>
        <p className="mt-2 text-sm text-gray-500">
          Review registered members and new volunteers, search by name, approve applications, and inspect complete profile details.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        
        {/* LEFT COLUMN: Search Bar & Member Cards List */}
        <div className="space-y-4">
          <div className="relative">
            <Search size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by member name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white pl-10 pr-4 py-3 text-xs text-gray-900 focus:border-orange-500 focus:outline-none shadow-xs"
            />
          </div>

          <div className="space-y-3 max-h-[650px] overflow-y-auto pr-1">
            {filteredRecords.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-10 bg-white rounded-2xl border border-gray-200">
                No team records found matching your search.
              </p>
            ) : (
              filteredRecords.map((rec) => {
                const isSelected = selectedRecord?.id === rec.id;
                const isReturning = rec.continuation_decision?.includes("Returning Member");
                const isApproved = rec.is_approved === true;

                return (
                  <div
                    key={rec.id}
                    onClick={() => setSelectedRecord(rec)}
                    className={`cursor-pointer rounded-2xl border p-4 transition shadow-xs flex items-center justify-between ${
                      isSelected
                        ? "border-orange-500 bg-orange-50/60 shadow-sm"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-1.5">
                        {isReturning ? <UserCheck size={14} className="text-blue-600 shrink-0" /> : <UserPlus size={14} className="text-orange-600 shrink-0" />}
                        <h3 className="text-sm font-bold text-gray-900 truncate">{rec.full_name}</h3>
                      </div>
                      <p className="text-[11px] text-gray-500 truncate">{rec.occupation || rec.email_address}</p>
                    </div>

                    <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold shrink-0 ${
                      isApproved ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
                    }`}>
                      {isApproved ? "Approved" : "Pending"}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Full Profile Detail Card & Approval Action */}
        <div className="lg:col-span-2">
          {selectedRecord ? (
            <div className="rounded-3xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm space-y-6 max-h-[750px] overflow-y-auto">
              
              {/* Header & Approval Action Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
                <div>
                  <span className="rounded-full bg-orange-100 border border-orange-200 px-3 py-1 text-[10px] font-bold text-orange-700 uppercase tracking-wider">
                    {selectedRecord.continuation_decision?.includes("Returning Member") ? "Returning Member" : "New Volunteer Registration"}
                  </span>
                  <h2 className="text-2xl font-black text-gray-900 mt-2">{selectedRecord.full_name}</h2>
                  {selectedRecord.preferred_name && (
                    <p className="text-xs text-orange-600 font-semibold mt-0.5">Preferred Name: {selectedRecord.preferred_name}</p>
                  )}
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <button
                    type="button"
                    disabled={actionLoading}
                    onClick={() => handleToggleApproval(selectedRecord.id, selectedRecord.is_approved)}
                    className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold text-white shadow-md transition ${
                      selectedRecord.is_approved 
                        ? "bg-red-600 hover:bg-red-700" 
                        : "bg-green-600 hover:bg-green-700"
                    }`}
                  >
                    {actionLoading ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : selectedRecord.is_approved ? (
                      <>
                        <XCircle size={15} /> <span>Revoke Approval</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck size={15} /> <span>Approve Member</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Section 1: Biodata Details */}
              <div className="space-y-3">
                <h3 className="text-xs font-black uppercase text-orange-600 tracking-wider">Section 1: Biodata</h3>
                <div className="grid gap-3 sm:grid-cols-2 text-xs bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <div className="flex items-center gap-2 text-gray-700">
                    <Mail size={14} className="text-orange-500 shrink-0" />
                    <span><strong>Email:</strong> {selectedRecord.email_address}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Phone size={14} className="text-orange-500 shrink-0" />
                    <span><strong>Phone:</strong> {selectedRecord.phone_number} (WhatsApp: {selectedRecord.whatsapp_number})</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Calendar size={14} className="text-orange-500 shrink-0" />
                    <span><strong>DOB:</strong> {selectedRecord.date_of_birth || "N/A"} ({selectedRecord.gender || "N/A"})</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <MapPin size={14} className="text-orange-500 shrink-0" />
                    <span><strong>State of Origin:</strong> {selectedRecord.state_of_origin || "N/A"}</span>
                  </div>
                  <div className="sm:col-span-2 text-gray-700">
                    <strong>Residential Address:</strong> {selectedRecord.residential_address || "N/A"}
                  </div>
                  <div className="sm:col-span-2 text-gray-700">
                    <strong>Occupation / Course:</strong> {selectedRecord.occupation || "N/A"} at {selectedRecord.institution_workplace || "N/A"}
                  </div>
                </div>
              </div>

              {/* Section 2: Decision */}
              <div className="space-y-3">
                <h3 className="text-xs font-black uppercase text-orange-600 tracking-wider">Section 2: Decision & Intention</h3>
                <div className="space-y-2 text-xs bg-gray-50 p-4 rounded-2xl border border-gray-100 text-gray-700">
                  <p><strong>Decision:</strong> <span className="font-bold text-orange-700">{selectedRecord.continuation_decision}</span></p>
                  <p><strong>Reason / Thoughts:</strong> {selectedRecord.decision_reason || "None provided"}</p>
                  <p><strong>Willingness to Commit:</strong> {selectedRecord.commitment_willingness || "N/A"}</p>
                </div>
              </div>

              {/* Section 3: Understandings */}
              {selectedRecord.understandings?.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-xs font-black uppercase text-orange-600 tracking-wider">Section 3: Commitment Understandings Acknowledged</h3>
                  <div className="space-y-1.5 text-xs bg-gray-50 p-4 rounded-2xl border border-gray-100">
                    {selectedRecord.understandings.map((item: string, idx: number) => (
                      <div key={idx} className="flex items-start gap-2 text-gray-700">
                        <CheckCircle size={14} className="text-green-600 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Section 4: Attestation */}
              <div className="space-y-3">
                <h3 className="text-xs font-black uppercase text-orange-600 tracking-wider">Section 4: Attestation</h3>
                <div className="text-xs bg-orange-50/50 p-4 rounded-2xl border border-orange-100 text-gray-800 space-y-2">
                  <p className="font-bold">Attestation Status: <span className="text-orange-700">{selectedRecord.attestation}</span></p>
                  <p className="italic text-gray-600 text-[11px]">
                    "I, {selectedRecord.full_name}, having taken time to reflect on my involvement with The Refinery International, hereby voluntarily confirm my desire to be a part of the team..."
                  </p>
                </div>
              </div>

            </div>
          ) : (
            <div className="rounded-3xl border border-gray-200 bg-white p-16 text-center text-gray-400 shadow-sm">
              <Users size={36} className="mx-auto mb-3 text-orange-500 opacity-60" />
              <p className="text-sm font-semibold">Select a member card from the left list to view and approve their profile.</p>
            </div>
          )}
        </div>

      </div>
    </main>
  );
}