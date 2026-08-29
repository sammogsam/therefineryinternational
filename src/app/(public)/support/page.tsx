"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CreditCard,
  Package,
  PhoneCall,
  CalendarDays,
  Copy,
  Check,
  Heart,
  Send,
  ShieldCheck,
  MessageCircle,
  ArrowRight,
  RotateCcw,
  Clock,
  BellRing,
  CheckCircle2,
  Loader2,
  HeartHandshake,
  UploadCloud,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function SupportPage() {
  const [supportType, setSupportType] = useState<"direct" | "pledge" | "materials" | "contact">("direct");
  const [targetProgram, setTargetProgram] = useState("General Ministry Support");

  // Direct Transfer Workflow States
  const [directSubStep, setDirectSubStep] = useState<"choose" | "sent_form" | "later_prompt" | "later_form" | "sent_done" | "later_done">("choose");
  const [sentPhone, setSentPhone] = useState("");
  const [sentName, setSentName] = useState("");
  const [isSentAnonymous, setIsSentAnonymous] = useState(false);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);

  // Send Later Reminder States
  const [reminderPhone, setReminderPhone] = useState("");
  const [reminderEmail, setReminderEmail] = useState("");

  // Financial Pledge States
  const [pledgeData, setPledgeData] = useState({
    fullName: "",
    email: "",
    phone: "",
    amount: "",
    fulfillmentDate: "",
    isAnonymous: false,
    subscribeReminders: true,
    notes: "",
  });

  // In-Kind Material States
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [customMaterial, setCustomMaterial] = useState("");
  const [materialOptions, setMaterialOptions] = useState<string[]>([
    "Children Bibles & Devotionals",
    "Storybooks & Christian Literature",
    "Writing Materials & Stationery",
    "Camp Welfare, Meals & Refreshments",
    "Audio / Visual & Media Gear",
    "Musical Instruments",
  ]);
  const [materialContact, setMaterialContact] = useState({
    fullName: "",
    email: "",
    phone: "",
    deliveryNotes: "",
    subscribeReminders: true,
  });

  // Direct Consultation / Callback States
  const [callbackData, setCallbackData] = useState({
    fullName: "",
    phone: "",
    email: "",
    topic: "Major Donation & Project Sponsorship",
    message: "",
  });

  // Feedback & Loading States
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [copied, setCopied] = useState(false);

  // Live Bank Settings
  const [bankDetails, setBankDetails] = useState({
    bankName: "Loading Bank...",
    accountName: "The Refinery International",
    accountNumber: "—",
    primaryPhone: "+234 903 227 0825",
    secondaryPhone: "+234 706 523 1908",
    primaryEmail: "therefineryinternational@gmail.com",
  });
  const [loadingConfig, setLoadingConfig] = useState(true);

  useEffect(() => {
    async function loadConfig() {
      try {
        const { data: config } = await supabase
          .from("site_settings")
          .select("*")
          .eq("id", "primary_config")
          .single();

        if (config) {
          setBankDetails({
            bankName: config.bank_name || "First Bank of Nigeria",
            accountName: config.account_name || "The Refinery International",
            accountNumber: config.account_number || "—",
            primaryPhone: config.primary_phone || "+234 903 227 0825",
            secondaryPhone: config.secondary_phone || "+234 706 523 1908",
            primaryEmail: config.primary_email || "therefineryinternational@gmail.com",
          });
        }

        const { data: mats } = await supabase
          .from("needed_materials")
          .select("name")
          .order("created_at", { ascending: true });

        if (mats && mats.length > 0) {
          setMaterialOptions(mats.map((m) => m.name));
        }
      } catch (err) {
        console.error("Error loading settings:", err);
      } finally {
        setLoadingConfig(false);
      }
    }

    loadConfig();
  }, []);

  const handleCopyAccount = () => {
    if (!bankDetails.accountNumber || bankDetails.accountNumber === "—") return;
    navigator.clipboard.writeText(bankDetails.accountNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleToggleMaterial = (item: string) => {
    if (selectedMaterials.includes(item)) {
      setSelectedMaterials(selectedMaterials.filter((m) => m !== item));
    } else {
      setSelectedMaterials([...selectedMaterials, item]);
    }
  };

  // 1. Submit "I Have Sent It" Confirmation
  const handleConfirmSentPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage(null);

    let receiptUrl: string | null = null;

    if (receiptFile) {
      const fileExt = receiptFile.name.split(".").pop();
      const filePath = `receipts/${Date.now()}-${fileExt}`;
      const { error: uploadErr } = await supabase.storage
        .from("resource-images")
        .upload(filePath, receiptFile);

      if (!uploadErr) {
        const { data } = supabase.storage.from("resource-images").getPublicUrl(filePath);
        receiptUrl = data.publicUrl;
      }
    }

    const { error } = await supabase.from("support_pledges").insert([
      {
        full_name: isSentAnonymous ? "Anonymous Supporter" : (sentName.trim() || "Supporter"),
        phone: sentPhone.trim(),
        is_anonymous: isSentAnonymous,
        target_program: targetProgram,
        support_type: "Direct Transfer",
        payment_status: "Transferred / Completed",
        receipt_url: receiptUrl,
        wants_reminder: false,
      },
    ]);

    setLoading(false);
    if (error) {
      setStatusMessage({ type: "error", text: error.message });
    } else {
      setDirectSubStep("sent_done");
    }
  };

  // 2. Submit "Send Later" (With or Without Reminder)
  const handleSendLaterChoice = async (withReminder: boolean, e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setStatusMessage(null);

    const { error } = await supabase.from("support_pledges").insert([
      {
        full_name: "Pledged Supporter",
        phone: withReminder ? reminderPhone.trim() : null,
        email: withReminder ? reminderEmail.trim() : null,
        is_anonymous: true,
        target_program: targetProgram,
        support_type: "Direct Transfer (Pending)",
        payment_status: "Pledged",
        wants_reminder: withReminder,
      },
    ]);

    setLoading(false);
    if (error) {
      setStatusMessage({ type: "error", text: error.message });
    } else {
      setDirectSubStep("later_done");
    }
  };

  // 3. Submit Financial Pledge Form
  const handleSubmitPledge = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage(null);

    const { error } = await supabase.from("support_pledges").insert([
      {
        full_name: pledgeData.isAnonymous ? "Anonymous Donor" : pledgeData.fullName,
        email: pledgeData.email || null,
        phone: pledgeData.phone || null,
        is_anonymous: pledgeData.isAnonymous,
        target_program: targetProgram,
        support_type: "Financial Pledge",
        pledge_amount: parseFloat(pledgeData.amount) || null,
        fulfillment_date: pledgeData.fulfillmentDate || null,
        subscribe_reminders: pledgeData.subscribeReminders,
        notes: pledgeData.notes || null,
        payment_status: "Pledged",
      },
    ]);

    if (error) {
      setStatusMessage({ type: "error", text: error.message });
    } else {
      setStatusMessage({
        type: "success",
        text: "Thank you for your generous pledge! May God reward your labor of love.",
      });
      setPledgeData({
        fullName: "",
        email: "",
        phone: "",
        amount: "",
        fulfillmentDate: "",
        isAnonymous: false,
        subscribeReminders: true,
        notes: "",
      });
    }
    setLoading(false);
  };

  // 4. Submit Material Form
  const handleSubmitMaterials = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage(null);

    if (selectedMaterials.length === 0 && !customMaterial.trim()) {
      setStatusMessage({ type: "error", text: "Please select at least one material option or specify under others." });
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("support_pledges").insert([
      {
        full_name: materialContact.fullName,
        email: materialContact.email,
        phone: materialContact.phone,
        is_anonymous: false,
        target_program: targetProgram,
        support_type: "Material Support",
        material_items: selectedMaterials,
        material_other: customMaterial.trim() || null,
        subscribe_reminders: materialContact.subscribeReminders,
        notes: materialContact.deliveryNotes || null,
        payment_status: "Pledged",
      },
    ]);

    if (error) {
      setStatusMessage({ type: "error", text: error.message });
    } else {
      setStatusMessage({
        type: "success",
        text: "Thank you for supporting with resources! Our logistics team will reach out to coordinate delivery.",
      });
      setSelectedMaterials([]);
      setCustomMaterial("");
      setMaterialContact({
        fullName: "",
        email: "",
        phone: "",
        deliveryNotes: "",
        subscribeReminders: true,
      });
    }
    setLoading(false);
  };

  // 5. Submit Consultation Request
  const handleSubmitConsultation = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage(null);

    const { error } = await supabase.from("contact_messages").insert([
      {
        name: callbackData.fullName,
        phone: callbackData.phone,
        email: callbackData.email,
        subject: `[Leadership Consultation] - ${callbackData.topic}`,
        message: callbackData.message || "Requesting direct discussion with ministry leadership regarding major support.",
      },
    ]);

    if (error) {
      setStatusMessage({ type: "error", text: error.message });
    } else {
      setStatusMessage({
        type: "success",
        text: "Your consultation request has been received. Our leadership will reach out directly.",
      });
      setCallbackData({
        fullName: "",
        phone: "",
        email: "",
        topic: "Major Donation & Project Sponsorship",
        message: "",
      });
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="bg-orange-500 py-16 text-center text-white sm:py-20">
        <div className="mx-auto max-w-5xl px-6">
          <span className="text-xs font-bold uppercase tracking-widest text-orange-200">
            Sow Into Eternity
          </span>
          <h1 className="mt-3 text-4xl font-bold sm:text-5xl md:text-6xl">
            Support The Vision
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-orange-50 sm:text-lg">
            Every gift, material contribution, and seed planted equips children to encounter God, discover purpose, and shine as light.
          </p>
        </div>
      </section>

      {/* Main Support Area */}
      <section className="py-14 sm:py-20">
        <div className="mx-auto max-w-5xl px-6">
          
          {/* Target Designation Selector */}
          <div className="rounded-3xl border border-gray-200/90 bg-white p-6 shadow-sm sm:p-8">
            <label className="block text-sm font-bold uppercase tracking-wider text-gray-700">
              Select What You Wish To Support:
            </label>
            <select
              value={targetProgram}
              onChange={(e) => setTargetProgram(e.target.value)}
              className="mt-3 w-full rounded-2xl border border-gray-300 bg-gray-50/50 px-4 py-3.5 text-base font-semibold text-gray-900 outline-none transition focus:border-orange-500 focus:bg-white"
            >
              <option value="General Ministry Support">🌟 General Ministry Support & Operations</option>
              <option value="Upcoming Children Camp Meeting">⛺ Upcoming Children Camp Meeting</option>
              <option value="School Outreaches & Scripture Distribution">🏫 School Outreaches & Scripture Distribution</option>
              <option value="Community & Rural Children Outreaches">🤝 Community & Rural Children Outreaches</option>
            </select>
            <p className="mt-2 text-xs text-gray-500">
              Your contribution will be directed specifically to this area of ministry.
            </p>
          </div>

          {/* Pathway Navigation Tabs */}
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <button
              type="button"
              onClick={() => { setSupportType("direct"); setStatusMessage(null); }}
              className={`flex flex-col items-center justify-center gap-2 rounded-2xl p-4 text-center text-sm font-bold transition ${
                supportType === "direct"
                  ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20"
                  : "bg-white text-gray-700 hover:bg-orange-50 border border-gray-200"
              }`}
            >
              <CreditCard size={20} />
              <span>Direct Transfer</span>
            </button>

            <button
              type="button"
              onClick={() => { setSupportType("pledge"); setStatusMessage(null); }}
              className={`flex flex-col items-center justify-center gap-2 rounded-2xl p-4 text-center text-sm font-bold transition ${
                supportType === "pledge"
                  ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20"
                  : "bg-white text-gray-700 hover:bg-orange-50 border border-gray-200"
              }`}
            >
              <CalendarDays size={20} />
              <span>Submit a Pledge</span>
            </button>

            <button
              type="button"
              onClick={() => { setSupportType("materials"); setStatusMessage(null); }}
              className={`flex flex-col items-center justify-center gap-2 rounded-2xl p-4 text-center text-sm font-bold transition ${
                supportType === "materials"
                  ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20"
                  : "bg-white text-gray-700 hover:bg-orange-50 border border-gray-200"
              }`}
            >
              <Package size={20} />
              <span>Give Materials</span>
            </button>

            <button
              type="button"
              onClick={() => { setSupportType("contact"); setStatusMessage(null); }}
              className={`flex flex-col items-center justify-center gap-2 rounded-2xl p-4 text-center text-sm font-bold transition ${
                supportType === "contact"
                  ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20"
                  : "bg-white text-gray-700 hover:bg-orange-50 border border-gray-200"
              }`}
            >
              <PhoneCall size={20} />
              <span>Talk to Us</span>
            </button>
          </div>

          {/* Feedback Alert */}
          {statusMessage && (
            <div
              className={`mt-6 rounded-2xl p-5 text-sm font-medium ${
                statusMessage.type === "success"
                  ? "border border-green-200 bg-green-50 text-green-800"
                  : "border border-red-200 bg-red-50 text-red-800"
              }`}
            >
              {statusMessage.text}
            </div>
          )}

          {/* TAB 1: DIRECT TRANSFER (ACCOUNT CARD + CONFIRMATION WORKFLOW) */}
          {supportType === "direct" && (
            <div className="mt-8 overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-xl">
              <div className="bg-slate-900 p-8 text-white sm:p-12">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-500 text-white shadow-md">
                  <ShieldCheck size={32} />
                </div>
                <span className="mt-4 block text-center text-xs font-bold uppercase tracking-widest text-orange-400">
                  Official Giving Placard
                </span>
                <h2 className="mt-1 text-center text-2xl font-bold sm:text-3xl">
                  Make a Direct Bank Transfer
                </h2>
                <p className="mx-auto mt-2 max-w-lg text-center text-sm text-gray-300">
                  Seed towards <strong>{targetProgram}</strong> using the official account details below.
                </p>

                {/* Account Details Box */}
                <div className="mx-auto mt-8 max-w-md rounded-2xl border border-slate-700 bg-slate-800/90 p-6 text-left shadow-lg">
                  <div className="flex justify-between border-b border-slate-700/80 pb-3">
                    <span className="text-xs uppercase tracking-wider text-gray-400">Bank Name</span>
                    <span className="text-sm font-bold text-white">
                      {loadingConfig ? "Loading..." : bankDetails.bankName}
                    </span>
                  </div>

                  <div className="flex justify-between border-b border-slate-700/80 py-3">
                    <span className="text-xs uppercase tracking-wider text-gray-400">Account Name</span>
                    <span className="text-sm font-bold text-orange-300">
                      {loadingConfig ? "Loading..." : bankDetails.accountName}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center justify-between pt-1">
                    <div>
                      <span className="block text-xs uppercase tracking-wider text-gray-400">Account Number</span>
                      <span className="font-mono text-2xl font-black tracking-wider text-white">
                        {loadingConfig ? "..." : bankDetails.accountNumber}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={handleCopyAccount}
                      disabled={loadingConfig || bankDetails.accountNumber === "—"}
                      className="flex items-center gap-1.5 rounded-xl bg-orange-500 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-orange-600 active:scale-95 disabled:opacity-50"
                    >
                      {copied ? (
                        <>
                          <Check size={14} /> Copied!
                        </>
                      ) : (
                        <>
                          <Copy size={14} /> Copy
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* --- 1. CHOOSE STATUS BUTTONS --- */}
                {directSubStep === "choose" && (
                  <div className="mx-auto mt-8 max-w-md text-center space-y-4">
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                      Kindly confirm your payment status:
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => setDirectSubStep("sent_form")}
                        className="flex items-center justify-center gap-2 rounded-2xl bg-orange-500 hover:bg-orange-600 py-3.5 px-4 text-sm font-bold text-white shadow-lg shadow-orange-500/20 transition hover:scale-[1.02]"
                      >
                        <Send size={16} />
                        <span>I Have Sent It</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setDirectSubStep("later_prompt")}
                        className="flex items-center justify-center gap-2 rounded-2xl bg-slate-800 hover:bg-slate-700 py-3.5 px-4 text-sm font-bold text-gray-300 hover:text-white transition border border-slate-700"
                      >
                        <Clock size={16} />
                        <span>I Will Send Later</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* --- 2. "I HAVE SENT IT" APPRECIATION & RECEIPT FORM --- */}
                {directSubStep === "sent_form" && (
                  <form onSubmit={handleConfirmSentPayment} className="mx-auto mt-8 max-w-md space-y-5 rounded-2xl border border-slate-700 bg-slate-800/80 p-6 text-left">
                    <div>
                      <h3 className="text-base font-bold text-white">Confirm & Attach Payment</h3>
                      <p className="text-xs text-gray-400 mt-1">
                        Please provide your phone number so leadership can appreciate you, and optionally attach your proof of payment.
                      </p>
                    </div>

                    <div className="rounded-xl bg-slate-900/60 p-3 border border-slate-700">
                      <label className="flex items-center gap-2 text-xs font-semibold text-gray-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isSentAnonymous}
                          onChange={(e) => setIsSentAnonymous(e.target.checked)}
                          className="h-4 w-4 rounded border-gray-600 text-orange-500 focus:ring-orange-500"
                        />
                        <span>I prefer to give anonymously</span>
                      </label>
                    </div>

                    {!isSentAnonymous && (
                      <div>
                        <label className="block text-xs font-bold uppercase text-gray-400 mb-1">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={sentName}
                          onChange={(e) => setSentName(e.target.value)}
                          placeholder="e.g. Samuel Mogaji"
                          className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm text-white focus:border-orange-500 focus:outline-none"
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-400 mb-1">
                        Phone Number * (Required for our appreciation)
                      </label>
                      <input
                        type="tel"
                        required
                        value={sentPhone}
                        onChange={(e) => setSentPhone(e.target.value)}
                        placeholder="e.g. 08012345678"
                        className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm text-white focus:border-orange-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-400 mb-1">
                        Attach Payment Receipt / Screenshot
                      </label>
                      <div className="rounded-xl border border-dashed border-slate-700 bg-slate-900 p-4 text-center">
                        <input
                          type="file"
                          accept="image/*,application/pdf"
                          onChange={(e) => setReceiptFile(e.target.files?.[0] || null)}
                          className="mx-auto block text-xs text-gray-400 file:mr-3 file:rounded-full file:border-0 file:bg-orange-500 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white hover:file:bg-orange-600 cursor-pointer"
                        />
                        {receiptFile && (
                          <p className="mt-2 text-xs font-semibold text-orange-400">Attached: {receiptFile.name}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-orange-500 py-3 text-xs font-bold text-white shadow-md hover:bg-orange-600 transition disabled:opacity-50"
                      >
                        {loading && <Loader2 size={14} className="animate-spin" />}
                        <span>{loading ? "Submitting..." : "Submit Confirmation"}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setDirectSubStep("choose")}
                        className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-xs font-semibold text-gray-400 hover:text-white"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}

                {/* --- 3. "SEND LATER" REMINDER PROMPT --- */}
                {directSubStep === "later_prompt" && (
                  <div className="mx-auto mt-8 max-w-md rounded-2xl border border-slate-700 bg-slate-800/80 p-6 text-center space-y-4">
                    <h3 className="text-base font-bold text-white">Would you like us to send a reminder?</h3>
                    <p className="text-xs text-gray-400">
                      We can send you a gentle follow-up via phone call, SMS, or email.
                    </p>
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setDirectSubStep("later_form")}
                        className="flex items-center justify-center gap-2 rounded-xl bg-orange-500 hover:bg-orange-600 py-3 text-xs font-bold text-white shadow-md transition"
                      >
                        <BellRing size={14} />
                        <span>Send Reminder</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSendLaterChoice(false)}
                        className="flex items-center justify-center rounded-xl bg-slate-900 hover:bg-slate-700 border border-slate-700 py-3 text-xs font-semibold text-gray-300 hover:text-white transition"
                      >
                        Don't Send Reminder
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => setDirectSubStep("choose")}
                      className="text-xs text-gray-500 hover:text-gray-400 mt-2 block mx-auto underline"
                    >
                      Back to options
                    </button>
                  </div>
                )}

                {/* --- 4. "SEND LATER" REMINDER DETAILS INPUT --- */}
                {directSubStep === "later_form" && (
                  <form onSubmit={(e) => handleSendLaterChoice(true, e)} className="mx-auto mt-8 max-w-md space-y-4 rounded-2xl border border-slate-700 bg-slate-800/80 p-6 text-left">
                    <div>
                      <h3 className="text-base font-bold text-white">Reminder Details</h3>
                      <p className="text-xs text-gray-400 mt-1">
                        Please enter your phone number and optional email for the reminder.
                      </p>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-400 mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={reminderPhone}
                        onChange={(e) => setReminderPhone(e.target.value)}
                        placeholder="e.g. 08012345678"
                        className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm text-white focus:border-orange-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-400 mb-1">
                        Email Address (Optional)
                      </label>
                      <input
                        type="email"
                        value={reminderEmail}
                        onChange={(e) => setReminderEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm text-white focus:border-orange-500 focus:outline-none"
                      />
                    </div>

                    <div className="flex gap-2 pt-2">
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-orange-500 py-3 text-xs font-bold text-white shadow-md hover:bg-orange-600 transition disabled:opacity-50"
                      >
                        {loading && <Loader2 size={14} className="animate-spin" />}
                        <span>{loading ? "Saving..." : "Save Reminder"}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setDirectSubStep("later_prompt")}
                        className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-xs font-semibold text-gray-400 hover:text-white"
                      >
                        Back
                      </button>
                    </div>
                  </form>
                )}

                {/* --- 5. "SENT" APPRECIATION SCREEN + PARTNER WITH US BUTTON --- */}
                {directSubStep === "sent_done" && (
                  <div className="mx-auto mt-8 max-w-md rounded-2xl border border-green-500/30 bg-green-500/10 p-8 text-center space-y-5">
                    <div className="h-14 w-14 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle2 size={30} />
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-white">We Value Your Sacrifice!</h3>
                      <p className="mt-2 text-xs leading-relaxed text-gray-300">
                        Thank you immensely for your generous seed! We have safely recorded your confirmation and look forward to reaching out to appreciate you.
                      </p>
                    </div>

                    <div className="flex flex-col gap-3 pt-2">
                      <Link
                        href="/partner"
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 hover:bg-orange-600 px-6 py-3.5 text-xs font-bold text-white shadow-lg shadow-orange-500/20 transition"
                      >
                        <HeartHandshake size={16} />
                        <span>Partner With Us Regularly</span>
                        <ArrowRight size={14} />
                      </Link>

                      <button
                        type="button"
                        onClick={() => {
                          setDirectSubStep("choose");
                          setSentPhone("");
                          setSentName("");
                          setReceiptFile(null);
                        }}
                        className="text-xs text-gray-400 hover:text-white underline mt-1"
                      >
                        Make another transfer note
                      </button>
                    </div>
                  </div>
                )}

                {/* --- 6. "SEND LATER" COMPLETED SCREEN --- */}
                {directSubStep === "later_done" && (
                  <div className="mx-auto mt-8 max-w-md rounded-2xl border border-slate-700 bg-slate-800/80 p-8 text-center space-y-5">
                    <div className="h-14 w-14 bg-orange-500/10 text-orange-400 rounded-full flex items-center justify-center mx-auto border border-orange-500/30">
                      <Heart size={26} />
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-white">Thank You!</h3>
                      <p className="mt-2 text-xs leading-relaxed text-gray-300">
                        We will be anticipating you and your seed in God&apos;s work. Your heart for the next generation is deeply valued!
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setDirectSubStep("choose")}
                      className="inline-flex items-center gap-2 text-xs font-semibold text-orange-400 hover:text-orange-300 transition"
                    >
                      <RotateCcw size={14} />
                      <span>Back to payment options</span>
                    </button>
                  </div>
                )}

              </div>

              {/* Gratitude Scripture footer */}
              <div className="bg-orange-50/60 p-8 text-center sm:p-10">
                <Heart size={28} className="mx-auto text-orange-500" />
                <h3 className="mt-3 text-lg font-bold text-gray-900">
                  With Heartfelt Gratitude
                </h3>
                <p className="mx-auto mt-2 max-w-2xl text-sm leading-relaxed text-gray-600">
                  &ldquo;Every man according as he purposeth in his heart, so let him give; not grudgingly, or of necessity: for God loveth a cheerful giver.&rdquo; — <em>2 Corinthians 9:7</em>
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: FINANCIAL PLEDGE SUBMISSION */}
          {supportType === "pledge" && (
            <div className="mt-8 rounded-3xl border border-gray-200 bg-white p-8 shadow-sm sm:p-10">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                  Submit a Financial Pledge
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                  Schedule your giving towards <strong>{targetProgram}</strong>. We will pray with you and send gentle reminders if requested.
                </p>
              </div>

              <form onSubmit={handleSubmitPledge} className="mt-8 space-y-6">
                <div className="rounded-2xl bg-orange-50/60 p-4">
                  <label className="flex items-center gap-3 font-semibold text-gray-900 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={pledgeData.isAnonymous}
                      onChange={(e) => setPledgeData({ ...pledgeData, isAnonymous: e.target.checked })}
                      className="h-5 w-5 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                    />
                    <span>Make this an Anonymous Pledge</span>
                  </label>
                  <p className="mt-1 ml-8 text-xs text-gray-500">
                    Your identity will remain private from public acknowledgments.
                  </p>
                </div>

                {!pledgeData.isAnonymous && (
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700">Full Name *</label>
                      <input
                        type="text"
                        required={!pledgeData.isAnonymous}
                        value={pledgeData.fullName}
                        onChange={(e) => setPledgeData({ ...pledgeData, fullName: e.target.value })}
                        placeholder="e.g. John Doe"
                        className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-orange-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700">Phone Number *</label>
                      <input
                        type="tel"
                        required={!pledgeData.isAnonymous}
                        value={pledgeData.phone}
                        onChange={(e) => setPledgeData({ ...pledgeData, phone: e.target.value })}
                        placeholder="+234..."
                        className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-orange-500"
                      />
                    </div>
                  </div>
                )}

                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700">Email Address (Optional for reminders)</label>
                    <input
                      type="email"
                      value={pledgeData.email}
                      onChange={(e) => setPledgeData({ ...pledgeData, email: e.target.value })}
                      placeholder="you@example.com"
                      className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700">Pledge Amount (₦) *</label>
                    <input
                      type="number"
                      required
                      value={pledgeData.amount}
                      onChange={(e) => setPledgeData({ ...pledgeData, amount: e.target.value })}
                      placeholder="e.g. 50000"
                      className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-orange-500 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700">Expected Fulfillment Date</label>
                  <input
                    type="date"
                    value={pledgeData.fulfillmentDate}
                    onChange={(e) => setPledgeData({ ...pledgeData, fulfillmentDate: e.target.value })}
                    className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700">Special Note / Prayer Request</label>
                  <textarea
                    rows={3}
                    value={pledgeData.notes}
                    onChange={(e) => setPledgeData({ ...pledgeData, notes: e.target.value })}
                    placeholder="Optional message for our prayer and support team..."
                    className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-orange-500"
                  />
                </div>

                <div className="rounded-2xl border border-gray-200 bg-gray-50/50 p-4">
                  <label className="flex items-center gap-3 font-medium text-gray-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={pledgeData.subscribeReminders}
                      onChange={(e) => setPledgeData({ ...pledgeData, subscribeReminders: e.target.checked })}
                      className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                    />
                    <span className="text-sm">Keep me updated by email on upcoming programs and pledge reminders.</span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-orange-500 py-4 font-bold text-white shadow-md transition hover:bg-orange-600 disabled:opacity-50"
                >
                  <Send size={18} />
                  <span>{loading ? "Submitting Pledge..." : "Confirm & Submit Pledge"}</span>
                </button>
              </form>
            </div>
          )}

          {/* TAB 3: MATERIAL & IN-KIND GIVING */}
          {supportType === "materials" && (
            <div className="mt-8 rounded-3xl border border-gray-200 bg-white p-8 shadow-sm sm:p-10">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                  Provide Materials & Resources
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                  Select the items you would like to provide for <strong>{targetProgram}</strong>.
                </p>
              </div>

              <form onSubmit={handleSubmitMaterials} className="mt-8 space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-800">
                    Select Material Items You Wish to Supply:
                  </label>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    {materialOptions.map((item) => (
                      <button
                        type="button"
                        key={item}
                        onClick={() => handleToggleMaterial(item)}
                        className={`flex items-center gap-3 rounded-2xl border p-4 text-left text-sm font-medium transition ${
                          selectedMaterials.includes(item)
                            ? "border-orange-500 bg-orange-50 text-orange-900"
                            : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        <div
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${
                            selectedMaterials.includes(item)
                              ? "border-orange-600 bg-orange-600 text-white"
                              : "border-gray-300 bg-white"
                          }`}
                        >
                          {selectedMaterials.includes(item) && <Check size={12} />}
                        </div>
                        <span>{item}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700">
                    Other Specific Materials (If not listed above):
                  </label>
                  <input
                    type="text"
                    value={customMaterial}
                    onChange={(e) => setCustomMaterial(e.target.value)}
                    placeholder="e.g. 100 sets of children school shoes, 200 plastic chairs..."
                    className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-orange-500"
                  />
                </div>

                <div className="border-t border-gray-100 pt-6">
                  <h3 className="text-base font-bold text-gray-900">Your Contact & Delivery Coordination</h3>
                  <div className="mt-4 grid gap-6 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={materialContact.fullName}
                        onChange={(e) => setMaterialContact({ ...materialContact, fullName: e.target.value })}
                        placeholder="John Doe"
                        className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-orange-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700">Phone Number *</label>
                      <input
                        type="tel"
                        required
                        value={materialContact.phone}
                        onChange={(e) => setMaterialContact({ ...materialContact, phone: e.target.value })}
                        placeholder="+234..."
                        className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-orange-500"
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-semibold text-gray-700">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={materialContact.email}
                      onChange={(e) => setMaterialContact({ ...materialContact, email: e.target.value })}
                      placeholder="you@example.com"
                      className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-orange-500"
                    />
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-semibold text-gray-700">Delivery / Waybill Notes</label>
                    <textarea
                      rows={2}
                      value={materialContact.deliveryNotes}
                      onChange={(e) => setMaterialContact({ ...materialContact, deliveryNotes: e.target.value })}
                      placeholder="e.g. Items can be picked up in Lagos or delivered directly to camp site..."
                      className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-gray-50/50 p-4">
                  <label className="flex items-center gap-3 font-medium text-gray-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={materialContact.subscribeReminders}
                      onChange={(e) => setMaterialContact({ ...materialContact, subscribeReminders: e.target.checked })}
                      className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                    />
                    <span className="text-sm">Subscribe to ministry updates and upcoming material need notifications.</span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-orange-500 py-4 font-bold text-white shadow-md transition hover:bg-orange-600 disabled:opacity-50"
                >
                  <Package size={18} />
                  <span>{loading ? "Submitting..." : "Submit Material Support Offering"}</span>
                </button>
              </form>
            </div>
          )}

          {/* TAB 4: TALK DIRECTLY WITH MINISTRY LEADERSHIP */}
          {supportType === "contact" && (
            <div className="mt-8 rounded-3xl border border-gray-200 bg-white p-8 shadow-sm sm:p-10">
              <div className="text-center">
                <span className="rounded-full bg-orange-100 px-3.5 py-1 text-xs font-bold text-orange-700">
                  Major Contributions & Partnerships
                </span>
                <h2 className="mt-3 text-2xl font-bold text-gray-900 sm:text-3xl">
                  Speak Directly With Leadership
                </h2>
                <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-gray-600">
                  If you are planning a significant seed, major program sponsorship, asset donation, or wish to discuss directly before giving, connect through our direct channels below.
                </p>
              </div>

              {/* Direct Calling & WhatsApp Cards */}
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-orange-200 bg-orange-50/60 p-6">
                  <PhoneCall size={24} className="text-orange-600" />
                  <h3 className="mt-3 text-base font-bold text-gray-900">Direct Phone Lines</h3>
                  <div className="mt-2 flex flex-col gap-1 text-sm font-semibold text-gray-700">
                    <a href={`tel:${bankDetails.primaryPhone.replace(/\s+/g, '')}`} className="hover:text-orange-600 transition">
                      📞 {bankDetails.primaryPhone}
                    </a>
                    <a href={`tel:${bankDetails.secondaryPhone.replace(/\s+/g, '')}`} className="hover:text-orange-600 transition">
                      📞 {bankDetails.secondaryPhone}
                    </a>
                  </div>
                </div>

                <div className="rounded-2xl border border-green-200 bg-green-50/60 p-6">
                  <MessageCircle size={24} className="text-green-600" />
                  <h3 className="mt-3 text-base font-bold text-gray-900">WhatsApp Discussion</h3>
                  <p className="mt-1 text-xs text-gray-600">Start an instant private chat with leadership:</p>
                  <a
                    href={`https://wa.me/${bankDetails.primaryPhone.replace(/[^0-9]/g, '')}?text=Hello%20The%20Refinery%20International,%20I%20would%20like%20to%20discuss%20supporting%20the%20ministry.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-green-600 px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-green-700"
                  >
                    Chat on WhatsApp
                  </a>
                </div>
              </div>

              {/* Consultation Callback Form */}
              <form onSubmit={handleSubmitConsultation} className="mt-8 border-t border-gray-100 pt-8 space-y-6">
                <h3 className="text-lg font-bold text-gray-900">Or Request a Direct Callback</h3>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={callbackData.fullName}
                      onChange={(e) => setCallbackData({ ...callbackData, fullName: e.target.value })}
                      placeholder="Your Name"
                      className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={callbackData.phone}
                      onChange={(e) => setCallbackData({ ...callbackData, phone: e.target.value })}
                      placeholder="+234..."
                      className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700">Email Address (Optional)</label>
                    <input
                      type="email"
                      value={callbackData.email}
                      onChange={(e) => setCallbackData({ ...callbackData, email: e.target.value })}
                      placeholder="you@example.com"
                      className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700">Discussion Purpose</label>
                    <select
                      value={callbackData.topic}
                      onChange={(e) => setCallbackData({ ...callbackData, topic: e.target.value })}
                      className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-orange-500"
                    >
                      <option value="Major Donation & Project Sponsorship">Major Donation & Project Sponsorship</option>
                      <option value="Camp Facility / Land Provision">Camp Facility / Land Provision</option>
                      <option value="Foundation / Grant Alignment">Foundation / Grant Alignment</option>
                      <option value="General Leadership Inquiry">General Leadership Inquiry</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700">Notes / Preferred Call Time</label>
                  <textarea
                    rows={3}
                    value={callbackData.message}
                    onChange={(e) => setCallbackData({ ...callbackData, message: e.target.value })}
                    placeholder="Briefly state your preferred time to receive a call..."
                    className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-orange-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-orange-500 py-4 font-bold text-white shadow-md transition hover:bg-orange-600 disabled:opacity-50"
                >
                  <PhoneCall size={18} />
                  <span>{loading ? "Submitting Request..." : "Request Leadership Callback"}</span>
                </button>
              </form>
            </div>
          )}

        </div>
      </section>
    </main>
  );
}