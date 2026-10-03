"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Trash2, Users, Calendar, CheckCircle, AlertCircle, Loader2, FileText, Eraser } from "lucide-react";

export default function AdminManageFormsPage() {
  const [forms, setForms] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<Record<string, any[]>>({});
  const [loading, setLoading] = useState(true);
  const [selectedFormId, setSelectedFormId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetchFormsAndSubmissions();
  }, []);

  async function fetchFormsAndSubmissions() {
    setLoading(true);
    const { data: formsData } = await supabase
      .from("admin_custom_forms")
      .select("*")
      .order("created_at", { ascending: false });

    if (formsData) {
      setForms(formsData);
      if (formsData.length > 0 && !selectedFormId) {
        setSelectedFormId(formsData[0].id);
      }
    }

    const { data: subsData } = await supabase
      .from("admin_form_submissions")
      .select("*");

    if (subsData) {
      const grouped: Record<string, any[]> = {};
      subsData.forEach((sub) => {
        if (!grouped[sub.form_id]) grouped[sub.form_id] = [];
        grouped[sub.form_id].push(sub);
      });
      setSubmissions(grouped);
    }
    setLoading(false);
  }

  // 1. Delete Questionnaire Only (Submissions remain safe)
  async function handleDeleteForm(formId: string) {
    if (!confirm("Are you sure you want to delete this form? (Team member submissions will be preserved)")) return;

    const { error } = await supabase
      .from("admin_custom_forms")
      .delete()
      .eq("id", formId);

    if (!error) {
      setMessage({ type: "success", text: "Form questionnaire deleted successfully. Submissions remain safely stored." });
      fetchFormsAndSubmissions();
    } else {
      setMessage({ type: "error", text: error.message });
    }
  }

  // 2. Clear All Submissions for this form only
  async function handleClearSubmissions(formId: string) {
    if (!confirm("Are you sure you want to clear all responses for this form? This cannot be undone.")) return;

    const { error } = await supabase
      .from("admin_form_submissions")
      .delete()
      .eq("form_id", formId);

    if (!error) {
      setMessage({ type: "success", text: "All submissions for this form have been cleared." });
      fetchFormsAndSubmissions();
    } else {
      setMessage({ type: "error", text: error.message });
    }
  }

  // 3. Delete a single member submission
  async function handleDeleteSingleSubmission(subId: string) {
    if (!confirm("Remove this specific member response?")) return;

    const { error } = await supabase
      .from("admin_form_submissions")
      .delete()
      .eq("id", subId);

    if (!error) {
      setMessage({ type: "success", text: "Submission removed." });
      fetchFormsAndSubmissions();
    } else {
      setMessage({ type: "error", text: error.message });
    }
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  const selectedForm = forms.find((f) => f.id === selectedFormId);
  const formSubs = selectedFormId ? submissions[selectedFormId] || [] : [];

  return (
    <main className="space-y-8 max-w-5xl p-6 md:p-10">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Manage Forms & View Submissions</h1>
        <p className="mt-2 text-sm text-gray-500">Review member responses, clear submissions, or delete questionnaires independently.</p>
      </div>

      {message && (
        <div className={`flex items-center gap-2 rounded-2xl p-4 text-xs font-semibold ${
          message.type === "success" ? "border border-green-200 bg-green-50 text-green-700" : "border border-red-200 bg-red-50 text-red-700"
        }`}>
          {message.type === "success" ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
          <span>{message.text}</span>
        </div>
      )}

      {forms.length === 0 ? (
        <div className="rounded-3xl border border-gray-200 bg-white p-12 text-center text-gray-500 shadow-sm">
          <FileText size={36} className="mx-auto mb-3 text-orange-500 opacity-60" />
          <p className="text-sm font-semibold text-gray-800">No active custom forms found.</p>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Form List Sidebar */}
          <div className="space-y-3">
            <h2 className="text-xs font-bold uppercase text-gray-500 tracking-wider">Published Forms</h2>
            {forms.map((form) => {
              const count = (submissions[form.id] || []).length;
              const isSelected = form.id === selectedFormId;
              return (
                <div
                  key={form.id}
                  onClick={() => setSelectedFormId(form.id)}
                  className={`cursor-pointer rounded-2xl border p-4 transition shadow-xs ${
                    isSelected 
                      ? "border-orange-500 bg-orange-50/50 shadow-sm" 
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <h3 className="text-sm font-bold text-gray-900 truncate">{form.title}</h3>
                  <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Users size={13} /> {count} submission{count !== 1 ? "s" : ""}
                    </span>
                    {form.deadline && (
                      <span className="flex items-center gap-1">
                        <Calendar size={13} /> {form.deadline}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Submissions Detail Panel */}
          <div className="lg:col-span-2 space-y-6">
            {selectedForm && (
              <div className="rounded-3xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-gray-100 pb-5">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{selectedForm.title}</h2>
                    {selectedForm.description && (
                      <p className="mt-1 text-xs text-gray-500">{selectedForm.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {formSubs.length > 0 && (
                      <button
                        onClick={() => handleClearSubmissions(selectedForm.id)}
                        className="inline-flex items-center gap-1 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-bold text-amber-700 hover:bg-amber-100 transition shadow-xs"
                      >
                        <Eraser size={14} /> Clear Responses
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteForm(selectedForm.id)}
                      className="inline-flex items-center gap-1 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-100 transition shadow-xs"
                    >
                      <Trash2 size={14} /> Delete Form
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-bold uppercase text-gray-500 mb-4 tracking-wider">
                    Team Member Responses ({formSubs.length})
                  </h3>

                  {formSubs.length === 0 ? (
                    <p className="text-xs text-gray-400 py-8 text-center bg-gray-50 rounded-2xl border border-gray-100">
                      No team members have submitted responses for this form yet.
                    </p>
                  ) : (
                    <div className="space-y-4 max-h-[550px] overflow-y-auto pr-2">
                      {formSubs.map((sub) => (
                        <div key={sub.id} className="rounded-2xl border border-gray-200 bg-gray-50 p-5 space-y-3 shadow-xs relative group">
                          <div className="flex items-center justify-between border-b border-gray-200/60 pb-3">
                            <span className="text-xs font-bold text-gray-900">{sub.member_name || sub.member_email}</span>
                            <div className="flex items-center gap-3">
                              <span className="text-[10px] text-gray-400 font-medium">
                                {new Date(sub.submitted_at).toLocaleDateString()}
                              </span>
                              <button
                                onClick={() => handleDeleteSingleSubmission(sub.id)}
                                className="text-gray-400 hover:text-red-600 transition p-1"
                                title="Delete this response"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </div>

                          <div className="space-y-3 pt-1">
                            {selectedForm.questions.map((q: any, qIdx: number) => {
                              const qText = typeof q === "string" ? q : q.text;
                              const rawAnswer = sub.answers?.[qIdx];
                              
                              let displayAnswer = "No response";
                              if (Array.isArray(rawAnswer)) {
                                displayAnswer = rawAnswer.length > 0 ? rawAnswer.join(", ") : "None selected";
                              } else if (rawAnswer !== undefined && rawAnswer !== null && rawAnswer !== "") {
                                displayAnswer = String(rawAnswer);
                              }

                              return (
                                <div key={qIdx} className="text-xs space-y-1">
                                  <p className="font-bold text-gray-800">{qIdx + 1}. {qText}</p>
                                  <p className="text-gray-700 bg-white p-3 rounded-xl border border-gray-200 shadow-xs">
                                    {displayAnswer}
                                  </p>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}