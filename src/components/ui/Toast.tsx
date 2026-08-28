"use client";

import { CheckCircle2, AlertCircle, X } from "lucide-react";

type ToastProps = {
  message: string;
  type?: "success" | "error";
  onClose: () => void;
};

export default function Toast({ message, type = "success", onClose }: ToastProps) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl border border-gray-100 bg-white px-5 py-4 shadow-xl ring-1 ring-black/5 animate-in slide-in-from-bottom-4">
      {type === "success" ? (
        <CheckCircle2 className="h-5 w-5 text-emerald-500" />
      ) : (
        <AlertCircle className="h-5 w-5 text-rose-500" />
      )}
      <p className="text-sm font-medium text-gray-800">{message}</p>
      <button
        onClick={onClose}
        className="ml-2 rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}