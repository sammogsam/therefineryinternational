"use client";

import { useEffect, useState } from "react";
import { Copy, Check, Landmark, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function BankDetailsCard() {
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [bankInfo, setBankInfo] = useState({
    bank_name: "First Bank of Nigeria",
    account_name: "The Refinery International",
    account_number: "—",
  });

  useEffect(() => {
    async function loadConfig() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("site_settings")
          .select("*")
          .eq("id", "primary_config")
          .single();

        if (!error && data) {
          setBankInfo({
            bank_name: data.bank_name || "First Bank of Nigeria",
            account_name: data.account_name || "The Refinery International",
            account_number: data.account_number || "—",
          });
        }
      } catch (err) {
        console.error("Failed to load bank settings:", err);
      } finally {
        setLoading(false);
      }
    }

    loadConfig();
  }, []);

  const handleCopy = () => {
    if (!bankInfo.account_number || bankInfo.account_number === "—") return;
    navigator.clipboard.writeText(bankInfo.account_number);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-3xl border border-orange-500/30 bg-slate-900 p-6 sm:p-8 text-white shadow-xl">
      <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
        <div className="p-3 bg-orange-500/10 rounded-2xl text-orange-400">
          <Landmark size={24} />
        </div>
        <div>
          <h3 className="text-lg font-bold">Direct Bank Transfer</h3>
          <p className="text-xs text-slate-400">Ministry Support & Seeds</p>
        </div>
      </div>

      <div className="mt-6 space-y-4 text-sm">
        <div>
          <p className="text-xs uppercase tracking-wider text-slate-400">Bank Name</p>
          <p className="text-base font-bold text-white mt-0.5">
            {loading ? "Loading..." : bankInfo.bank_name}
          </p>
        </div>

        <div>
          <p className="text-xs uppercase tracking-wider text-slate-400">Account Name</p>
          <p className="text-base font-bold text-white mt-0.5">
            {loading ? "Loading..." : bankInfo.account_name}
          </p>
        </div>

        <div className="flex items-center justify-between rounded-2xl bg-slate-950 p-4 border border-slate-800">
          <div>
            <p className="text-xs uppercase tracking-wider text-slate-400">Account Number</p>
            <p className="text-xl font-mono font-black text-orange-400 mt-0.5 tracking-widest">
              {loading ? "..." : bankInfo.account_number}
            </p>
          </div>
          <button
            type="button"
            onClick={handleCopy}
            disabled={loading || bankInfo.account_number === "—"}
            className="flex items-center gap-1.5 rounded-xl bg-orange-500/20 px-3.5 py-2 text-xs font-bold text-orange-400 hover:bg-orange-500 hover:text-white transition disabled:opacity-50"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            <span>{copied ? "Copied" : "Copy"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}