"use client";

import { useState } from "react";
import {
  Users,
  HeartHandshake,
  ShieldCheck,
  Check,
  Copy,
  Send,
  PhoneCall,
  Church,
  Building2,
  Package,
  Sparkles,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function PartnerPage() {
  const [partnerType, setPartnerType] = useState<string>("Prayer");
  
  // Common Partner Info
  const [formData, setFormData] = useState({
    fullName: "",
    organizationName: "",
    email: "",
    phone: "",
    city: "",
    notes: "",
  });

  // Track-specific state
  const [financialFrequency, setFinancialFrequency] = useState("Monthly Partner");
  const [financialPledge, setFinancialPledge] = useState("");
  
  const [serviceProfessions, setServiceProfessions] = useState<string[]>([]);
  const [serviceOther, setServiceOther] = useState("");

  const [churchSupport, setChurchSupport] = useState<string[]>([]);
  const [corporateSupport, setCorporateSupport] = useState<string[]>([]);
  const [resourceItems, setResourceItems] = useState<string[]>([]);

  // Feedback states
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const bankDetails = {
    bankName: "First Bank of Nigeria",
    accountName: "Mogaji Samuel Damilola",
    accountNumber: "3113375029",
  };

  const handleCopyAccount = () => {
    navigator.clipboard.writeText(bankDetails.accountNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const toggleCheckbox = (list: string[], item: string, setter: (val: string[]) => void) => {
    if (list.includes(item)) {
      setter(list.filter((i) => i !== item));
    } else {
      setter([...list, item]);
    }
  };

  const handleSubmitPartnership = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage(null);

    const { error } = await supabase.from("partnerships").insert([
      {
        partner_type: partnerType,
        full_name: formData.fullName,
        organization_name: formData.organizationName || null,
        email: formData.email,
        phone: formData.phone,
        city: formData.city || null,
        financial_frequency: partnerType === "Financial" ? financialFrequency : null,
        financial_pledge: partnerType === "Financial" && financialPledge ? parseFloat(financialPledge) : null,
        service_professions: partnerType === "Service" ? serviceProfessions : null,
        service_other: partnerType === "Service" ? serviceOther : null,
        church_support_types: partnerType === "Church" ? churchSupport : null,
        corporate_support_types: partnerType === "Corporate" ? corporateSupport : null,
        resource_items: partnerType === "Resource" ? resourceItems : null,
        notes: formData.notes || null,
      },
    ]);

    if (error) {
      setStatusMessage({ type: "error", text: error.message });
    } else {
      setStatusMessage({
        type: "success",
        text: `Welcome to the partnership family! Thank you for committing as a ${partnerType} Partner with The Refinery International.`,
      });
      setFormData({
        fullName: "",
        organizationName: "",
        email: "",
        phone: "",
        city: "",
        notes: "",
      });
      setFinancialPledge("");
      setServiceProfessions(([]) as string[]);
      setChurchSupport(([]) as string[]);
      setCorporateSupport(([]) as string[]);
      setResourceItems(([]) as string[]);
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="bg-orange-500 py-16 text-center text-white sm:py-20">
        <div className="mx-auto max-w-5xl px-6">
          <span className="text-xs font-bold uppercase tracking-widest text-orange-200">
            Covenant Alliance & Vision Bearers
          </span>
          <h1 className="mt-3 text-4xl font-bold sm:text-5xl md:text-6xl">
            Partner With Us
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-orange-50 sm:text-lg">
            Join hands with The Refinery International in a committed alliance to raise, mentor, and refine children for God&apos;s ultimate purpose.
          </p>
        </div>
      </section>

      {/* Partnership Hub */}
      <section className="py-14 sm:py-20">
        <div className="mx-auto max-w-5xl px-6">

          {/* Intro Card */}
          <div className="rounded-3xl border border-gray-200/90 bg-white p-8 shadow-sm text-center">
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Choose Your Partnership Track
            </h2>
            <p className="mx-auto mt-2 max-w-2xl text-sm text-gray-600">
              Partners are fully invested in our mandate through prayer, giving, professional service, church collaboration, corporate sponsorship, or resource provision.
            </p>

            {/* Track Selector Buttons */}
            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {[
                { id: "Prayer", label: "Prayer", icon: Users },
                { id: "Financial", label: "Financial", icon: ShieldCheck },
                { id: "Service", label: "Service", icon: HeartHandshake },
                { id: "Church", label: "Church", icon: Church },
                { id: "Corporate", label: "Corporate", icon: Building2 },
                { id: "Resource", label: "Resource", icon: Package },
              ].map((track) => {
                const IconComponent = track.icon;
                const isActive = partnerType === track.id;
                return (
                  <button
                    key={track.id}
                    type="button"
                    onClick={() => { setPartnerType(track.id); setStatusMessage(null); }}
                    className={`flex flex-col items-center justify-center gap-2 rounded-2xl p-4 text-center text-xs font-bold transition ${
                      isActive
                        ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20"
                        : "bg-gray-50 text-gray-700 hover:bg-orange-50 border border-gray-200"
                    }`}
                  >
                    <IconComponent size={20} />
                    <span>{track.label}</span>
                  </button>
                );
              })}
            </div>
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

          {/* DYNAMIC FORM CONTAINER */}
          <div className="mt-8 rounded-3xl border border-gray-200 bg-white p-8 shadow-sm sm:p-10">
            <div className="border-b border-gray-100 pb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
                Selected Track
              </span>
              <h3 className="mt-1 text-2xl font-bold text-gray-900">
                {partnerType} Partner Registration
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                {partnerType === "Prayer" && "Join our intercession network, receiving regular prayer bulletins and updates for our outreaches."}
                {partnerType === "Financial" && "Commit as a monthly supporter, camp meeting sponsor, or one-time kingdom builder."}
                {partnerType === "Service" && "Offer your professional expertise (Medical, Media, Event Coordination, Counseling, Teaching)."}
                {partnerType === "Church" && "Collaborate as a ministry or local church through hosting outreaches, providing facilities, or mobilization."}
                {partnerType === "Corporate" && "Engage through business sponsorship, foundations, funding, tech, and institutional support."}
                {partnerType === "Resource" && "Supply continuous physical materials such as Bibles, books, instruments, or clothing items."}
              </p>
            </div>

            <form onSubmit={handleSubmitPartnership} className="mt-8 space-y-6">

              {/* TRACK SPECIFIC SECTION */}
              {partnerType === "Financial" && (
                <div className="rounded-2xl border border-orange-200 bg-orange-50/50 p-6 space-y-6">
                  <h4 className="text-base font-bold text-gray-900">Financial Partnership Details</h4>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700">Giving Category</label>
                    <select
                      value={financialFrequency}
                      onChange={(e) => setFinancialFrequency(e.target.value)}
                      className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-orange-500 font-medium"
                    >
                      <option value="Monthly Partner">Regular Monthly Partner</option>
                      <option value="Program Sponsor">Specific Program / Camp Meeting Sponsor</option>
                      <option value="One-Time Donor">One-Time Kingdom Builder / Donor</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700">Committed Amount (₦) - Optional</label>
                    <input
                      type="number"
                      value={financialPledge}
                      onChange={(e) => setFinancialPledge(e.target.value)}
                      placeholder="e.g. 25000"
                      className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-orange-500"
                    />
                  </div>

                  {/* Direct Bank Placard Toggle */}
                  <div className="rounded-xl bg-slate-900 p-6 text-white">
                    <div className="flex items-center gap-2 text-orange-400 text-xs font-bold uppercase tracking-wider">
                      <Sparkles size={14} /> Official Ministry Account for Transfers
                    </div>
                    <div className="mt-3 grid gap-2 text-sm sm:grid-cols-3">
                      <div>
                        <span className="text-xs text-gray-400 block">Bank</span>
                        <span className="font-bold">{bankDetails.bankName}</span>
                      </div>
                      <div>
                        <span className="text-xs text-gray-400 block">Account Name</span>
                        <span className="font-bold text-orange-300">{bankDetails.accountName}</span>
                      </div>
                      <div className="flex items-center justify-between sm:justify-start sm:gap-4">
                        <div>
                          <span className="text-xs text-gray-400 block">Account Number</span>
                          <span className="font-mono font-black text-lg">{bankDetails.accountNumber}</span>
                        </div>
                        <button
                          type="button"
                          onClick={handleCopyAccount}
                          className="flex items-center gap-1 rounded-lg bg-orange-500 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-orange-600"
                        >
                          {copied ? <Check size={12} /> : <Copy size={12} />}
                          <span>{copied ? "Copied" : "Copy"}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {partnerType === "Service" && (
                <div className="rounded-2xl border border-orange-200 bg-orange-50/50 p-6 space-y-4">
                  <h4 className="text-base font-bold text-gray-900">Select Your Professional Service Areas</h4>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {[
                      "Medical Personnel (Doctors, Nurses, First Aid)",
                      "Media & Production (Photography, Videography, Graphics)",
                      "Event Coordination, Logistics & Ushers",
                      "Teaching, Counseling & Child Mentorship",
                      "Music, Sound & Drama Ministry",
                    ].map((item) => (
                      <button
                        type="button"
                        key={item}
                        onClick={() => toggleCheckbox(serviceProfessions, item, setServiceProfessions)}
                        className={`flex items-center gap-3 rounded-xl border p-3.5 text-left text-sm font-medium transition ${
                          serviceProfessions.includes(item)
                            ? "border-orange-500 bg-orange-50 text-orange-900"
                            : "border-gray-200 bg-white text-gray-700"
                        }`}
                      >
                        <div className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${serviceProfessions.includes(item) ? "border-orange-600 bg-orange-600 text-white" : "border-gray-300"}`}>
                          {serviceProfessions.includes(item) && <Check size={10} />}
                        </div>
                        <span>{item}</span>
                      </button>
                    ))}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mt-2">Other Professional Skills</label>
                    <input
                      type="text"
                      value={serviceOther}
                      onChange={(e) => setServiceOther(e.target.value)}
                      placeholder="e.g. Legal, Project Management, Catering..."
                      className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-orange-500"
                    />
                  </div>
                </div>
              )}

              {partnerType === "Church" && (
                <div className="rounded-2xl border border-orange-200 bg-orange-50/50 p-6 space-y-4">
                  <h4 className="text-base font-bold text-gray-900">Church Partnership Engagement Options</h4>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {[
                      "Hosting Ministry Outreaches & Camp Meetings",
                      "Mobilizing Youth & Adult Volunteers",
                      "Providing Facility / Venue Support",
                      "Joint Financial & Material Sponsorship",
                    ].map((item) => (
                      <button
                        type="button"
                        key={item}
                        onClick={() => toggleCheckbox(churchSupport, item, setChurchSupport)}
                        className={`flex items-center gap-3 rounded-xl border p-3.5 text-left text-sm font-medium transition ${
                          churchSupport.includes(item)
                            ? "border-orange-500 bg-orange-50 text-orange-900"
                            : "border-gray-200 bg-white text-gray-700"
                        }`}
                      >
                        <div className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${churchSupport.includes(item) ? "border-orange-600 bg-orange-600 text-white" : "border-gray-300"}`}>
                          {churchSupport.includes(item) && <Check size={10} />}
                        </div>
                        <span>{item}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {partnerType === "Corporate" && (
                <div className="rounded-2xl border border-orange-200 bg-orange-50/50 p-6 space-y-4">
                  <h4 className="text-base font-bold text-gray-900">Corporate / NGO / Foundation Support Channels</h4>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {[
                      "Grant & Funding Support",
                      "Equipment & Technology Provision",
                      "Educational Materials & Kits",
                      "Venue & Facilities",
                      "Logistics & Transportation Assistance",
                    ].map((item) => (
                      <button
                        type="button"
                        key={item}
                        onClick={() => toggleCheckbox(corporateSupport, item, setCorporateSupport)}
                        className={`flex items-center gap-3 rounded-xl border p-3.5 text-left text-sm font-medium transition ${
                          corporateSupport.includes(item)
                            ? "border-orange-500 bg-orange-50 text-orange-900"
                            : "border-gray-200 bg-white text-gray-700"
                        }`}
                      >
                        <div className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${corporateSupport.includes(item) ? "border-orange-600 bg-orange-600 text-white" : "border-gray-300"}`}>
                          {corporateSupport.includes(item) && <Check size={10} />}
                        </div>
                        <span>{item}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {partnerType === "Resource" && (
                <div className="rounded-2xl border border-orange-200 bg-orange-50/50 p-6 space-y-4">
                  <h4 className="text-base font-bold text-gray-900">Resource Supply Channels</h4>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {[
                      "Bibles & Christian Devotionals",
                      "Writing Materials & School Stationery",
                      "Musical Instruments & Audio Gear",
                      "Food Items & Camp Welfare Materials",
                      "Clothing & Footwear for Children",
                    ].map((item) => (
                      <button
                        type="button"
                        key={item}
                        onClick={() => toggleCheckbox(resourceItems, item, setResourceItems)}
                        className={`flex items-center gap-3 rounded-xl border p-3.5 text-left text-sm font-medium transition ${
                          resourceItems.includes(item)
                            ? "border-orange-500 bg-orange-50 text-orange-900"
                            : "border-gray-200 bg-white text-gray-700"
                        }`}
                      >
                        <div className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${resourceItems.includes(item) ? "border-orange-600 bg-orange-600 text-white" : "border-gray-300"}`}>
                          {resourceItems.includes(item) && <Check size={10} />}
                        </div>
                        <span>{item}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* GENERAL CONTACT & PERSONAL DETAILS */}
              <div className="border-t border-gray-100 pt-6 space-y-6">
                <h4 className="text-lg font-bold text-gray-900">Your Contact & Bio Information</h4>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700">Full Name / Representative *</label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="e.g. Pastor John Doe"
                      className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700">Church / Organization Name (If applicable)</label>
                    <input
                      type="text"
                      value={formData.organizationName}
                      onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
                      placeholder="e.g. Grace Assembly / Foundation"
                      className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="you@example.com"
                      className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700">Phone Number / WhatsApp *</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+234..."
                      className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700">City & State / Country</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="e.g. Lagos, Nigeria"
                    className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700">Additional Notes / Expectation</label>
                  <textarea
                    rows={3}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Tell us how you would like to fellowship or collaborate..."
                    className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-orange-500 py-4 font-bold text-white shadow-md transition hover:bg-orange-600 disabled:opacity-50"
              >
                <Send size={18} />
                <span>{loading ? "Submitting Partnership..." : `Register as ${partnerType} Partner`}</span>
              </button>
            </form>
          </div>

          {/* Direct Leadership Engagement Box */}
          <div className="mt-12 rounded-3xl bg-slate-900 p-8 text-center text-white sm:p-12">
            <PhoneCall size={32} className="mx-auto text-orange-400" />
            <h3 className="mt-4 text-xl font-bold">Want to Speak With Ministry Leadership Directly?</h3>
            <p className="mx-auto mt-2 max-w-xl text-sm text-gray-300">
              For major institutional partnerships, foundation alliances, or private discussions, our leadership is available to connect.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <a
                href="tel:+2349032270825"
                className="rounded-xl bg-orange-500 px-6 py-3 text-sm font-bold text-white transition hover:bg-orange-600"
              >
                📞 +234 903 227 0825
              </a>
              <a
                href="tel:+2347065231908"
                className="rounded-xl bg-slate-800 border border-slate-700 px-6 py-3 text-sm font-bold text-white transition hover:bg-slate-700"
              >
                📞 +234 706 523 1908
              </a>
            </div>
          </div>

        </div>
      </section>
    </main>
  );
}