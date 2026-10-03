"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Plus, Trash2, Send, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

type Question = {
  text: string;
  type: "text" | "single" | "multiple";
  options: string[]; // Comma-separated or array of choices
};

export default function AdminCreateFormPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [questions, setQuestions] = useState<Question[]>([
    { text: "", type: "text", options: [] },
  ]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  function addQuestionField() {
    setQuestions([...questions, { text: "", type: "text", options: [] }]);
  }

  function updateQuestionText(index: number, text: string) {
    const updated = [...questions];
    updated[index].text = text;
    setQuestions(updated);
  }

  function updateQuestionType(index: number, type: "text" | "single" | "multiple") {
    const updated = [...questions];
    updated[index].type = type;
    setQuestions(updated);
  }

  function updateQuestionOptions(index: number, optionsString: string) {
    const updated = [...questions];
    // Split by comma and trim whitespace
    updated[index].options = optionsString.split(",").map((o) => o.trim()).filter(Boolean);
    setQuestions(updated);
  }

  function removeQuestionField(index: number) {
    setQuestions(questions.filter((_, i) => i !== index));
  }

  async function handlePublishForm(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      setMessage({ type: "error", text: "Please enter a form title." });
      return;
    }

    setLoading(true);
    setMessage(null);

    const { error } = await supabase.from("admin_custom_forms").insert([
      {
        title,
        description,
        deadline: deadline || null,
        questions: questions.filter((q) => q.text.trim() !== ""),
      },
    ]);

    setLoading(false);
    if (error) {
      setMessage({ type: "error", text: error.message });
    } else {
      setMessage({ type: "success", text: "Custom form published successfully to the team portal!" });
      setTitle("");
      setDescription("");
      setDeadline("");
      setQuestions([{ text: "", type: "text", options: [] }]);
    }
  }

  return (
    <main className="space-y-8 max-w-3xl p-6 md:p-10">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Create Advanced Team Form</h1>
        <p className="mt-2 text-sm text-gray-500">Design custom questionnaires with text, single-choice, or multi-select options.</p>
      </div>

      {message && (
        <div className={`flex items-center gap-2 rounded-2xl p-4 text-xs font-semibold ${
          message.type === "success" ? "border border-green-200 bg-green-50 text-green-700" : "border border-red-200 bg-red-50 text-red-700"
        }`}>
          {message.type === "success" ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
          <span>{message.text}</span>
        </div>
      )}

      <form onSubmit={handlePublishForm} className="space-y-6 rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
        <div>
          <label className="mb-2 block text-xs font-bold uppercase text-gray-700">Form Title *</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Departmental Availability & Preferences"
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 focus:border-orange-500 focus:outline-none shadow-xs"
          />
        </div>

        <div>
          <label className="mb-2 block text-xs font-bold uppercase text-gray-700">Instructions / Description</label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Provide context or guidelines for team members..."
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 focus:border-orange-500 focus:outline-none shadow-xs"
          />
        </div>

        <div>
          <label className="mb-2 block text-xs font-bold uppercase text-gray-700">Deadline</label>
          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 focus:border-orange-500 focus:outline-none shadow-xs"
          />
        </div>

        <div className="space-y-6 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase text-gray-700">Form Questions</label>
            <button
              type="button"
              onClick={addQuestionField}
              className="inline-flex items-center gap-1.5 rounded-xl bg-orange-50 px-3 py-1.5 text-xs font-bold text-orange-700 hover:bg-orange-100"
            >
              <Plus size={14} /> Add Question
            </button>
          </div>

          {questions.map((q, idx) => (
            <div key={idx} className="rounded-2xl border border-gray-200 bg-gray-50 p-5 space-y-4 shadow-xs">
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  required
                  value={q.text}
                  onChange={(e) => updateQuestionText(idx, e.target.value)}
                  placeholder={`Question ${idx + 1} text`}
                  className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-orange-500 focus:outline-none shadow-xs"
                />
                <select
                  value={q.type}
                  onChange={(e) => updateQuestionType(idx, e.target.value as any)}
                  className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-xs font-semibold text-gray-700 focus:border-orange-500 focus:outline-none shadow-xs"
                >
                  <option value="text">Open-ended Text</option>
                  <option value="single">Single Choice</option>
                  <option value="multiple">Multiple Choice (Multi-select)</option>
                </select>
                {questions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeQuestionField(idx)}
                    className="rounded-xl border border-red-200 bg-red-50 p-2.5 text-red-600 hover:bg-red-100"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>

              {q.type !== "text" && (
                <div>
                  <label className="mb-1 block text-[11px] font-bold uppercase text-gray-500">
                    Options (Separate choices with a comma e.g. Yes, No, Maybe)
                  </label>
                  <input
                    type="text"
                    placeholder="Option 1, Option 2, Option 3"
                    onChange={(e) => updateQuestionOptions(idx, e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs text-gray-900 focus:border-orange-500 focus:outline-none shadow-xs"
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 rounded-xl bg-orange-500 px-7 py-3 text-sm font-bold text-white shadow-md shadow-orange-500/20 hover:bg-orange-600 transition disabled:opacity-50"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
          <span>{loading ? "Publishing..." : "Publish Form Live"}</span>
        </button>
      </form>
    </main>
  );
}