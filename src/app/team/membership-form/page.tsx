"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Send, CheckCircle, AlertCircle, Loader2, ShieldCheck, UserCheck, UserPlus, ArrowLeft, ArrowRight } from "lucide-react";

export default function TeamMembershipFormPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [checkingExisting, setCheckingExisting] = useState(true);
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Path & Page Step State
  const [path, setPath] = useState<"returning" | "new" | null>(null);
  const [step, setStep] = useState<number>(0);

  // Form State (Email starts blank)
  const [form, setForm] = useState({
    fullName: "",
    preferredName: "",
    dateOfBirth: "",
    gender: "",
    phoneNumber: "",
    whatsappNumber: "",
    emailAddress: "",
    residentialAddress: "",
    stateOfOrigin: "",
    occupation: "",
    institutionWorkplace: "",
    continuationDecision: "",
    decisionReason: "",
    commitmentWillingness: "",
    understandings: [] as string[],
    attestation: "",
  });

  const understandingItems = [
    "Is a commitment to the vision and mandate of the ministry.",
    "Requires active participation and not merely having my name on the team.",
    "Requires me to take assigned responsibilities seriously and communicate when I am unable to fulfil them.",
    "Requires punctuality, responsibility and accountability.",
    "Requires me to work respectfully with other members of the team.",
    "Requires me to maintain conduct that does not bring the ministry, its leadership or the children we serve into disrepute.",
    "Requires me to remain teachable and willing to grow.",
    "May require sacrifice of my time, comfort and personal convenience when necessary for the work.",
    "Requires me to understand that serving children comes with responsibility, care and appropriate conduct.",
  ];

  useEffect(() => {
    async function init() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/team/login");
        return;
      }
      setUser(session.user);
      // Leaves email blank so it won't auto-fill with logged-in account email
      setForm((prev) => ({ ...prev, emailAddress: "" }));

      // Check if already submitted
      const { data: existing } = await supabase
        .from("team_membership_records")
        .select("*")
        .eq("user_id", session.user.id)
        .single();

      if (existing) {
        setAlreadySubmitted(true);
      }
      setCheckingExisting(false);
    }
    init();
  }, [router]);

  function handleCheckboxToggle(item: string) {
    const exists = form.understandings.includes(item);
    if (exists) {
      setForm({ ...form, understandings: form.understandings.filter((i) => i !== item) });
    } else {
      setForm({ ...form, understandings: [...form.understandings, item] });
    }
  }

  function handleNextStep(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);

    if (step === 1) {
      if (!form.fullName || !form.phoneNumber || !form.whatsappNumber || !form.emailAddress) {
        setMessage({ type: "error", text: "Please fill in all required biodata fields." });
        return;
      }
    }

    if (step === 2) {
      if (!form.continuationDecision) {
        setMessage({ type: "error", text: "Please select your decision." });
        return;
      }
      if (form.continuationDecision.includes("No, I do not wish")) {
        setStep(4);
        return;
      }
    }

    if (step === 3) {
      if (form.understandings.length === 0) {
        setMessage({ type: "error", text: "Please acknowledge the commitments by checking the items." });
        return;
      }
    }

    setStep((prev) => prev + 1);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user?.id) return;

    const isDroppingOut = form.continuationDecision.includes("No, I do not wish");
    if (!isDroppingOut && !form.attestation) {
      setMessage({ type: "error", text: "Please complete the attestation before submitting." });
      return;
    }

    setLoading(true);
    setMessage(null);

    const { error } = await supabase.from("team_membership_records").insert([
      {
        user_id: user.id,
        full_name: form.fullName,
        preferred_name: form.preferredName,
        date_of_birth: form.dateOfBirth || null,
        gender: form.gender,
        phone_number: form.phoneNumber,
        whatsapp_number: form.whatsappNumber,
        email_address: form.emailAddress,
        residential_address: form.residentialAddress,
        state_of_origin: form.stateOfOrigin,
        occupation: form.occupation,
        institution_workplace: form.institutionWorkplace,
        continuation_decision: `${path === "returning" ? "[Returning Member] " : "[New Volunteer Joining] "} ${form.continuationDecision}`,
        decision_reason: form.decisionReason,
        commitment_willingness: isDroppingOut ? "N/A" : form.commitmentWillingness,
        understandings: isDroppingOut ? [] : form.understandings,
        attestation: isDroppingOut ? "No" : form.attestation,
      },
    ]);

    setLoading(false);
    if (error) {
      setMessage({ type: "error", text: error.message });
    } else {
      setAlreadySubmitted(true);
      setMessage({ type: "success", text: "Your membership form has been submitted successfully. Thank you!" });
    }
  }

  if (checkingExisting) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  const isDroppingOut = form.continuationDecision.includes("No, I do not wish");

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 text-gray-900">
      <div className="mx-auto max-w-3xl rounded-3xl border border-gray-200 bg-white p-8 shadow-sm space-y-8">

        {alreadySubmitted ? (
          <div className="rounded-2xl border border-green-200 bg-green-50 p-8 text-center space-y-3">
            <CheckCircle size={40} className="mx-auto text-green-600" />
            <h2 className="text-lg font-bold text-green-900">Form Already Submitted</h2>
            <p className="text-xs text-green-700">You have already submitted your membership form. Thank you for your dedication to the vision.</p>
          </div>
        ) : step === 0 ? (
          <div className="space-y-8 py-6 text-center">
            <div className="space-y-3">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
                <ShieldCheck size={28} />
              </div>
              <h1 className="text-2xl font-black text-gray-900">THE REFINERY INTERNATIONAL</h1>
              <p className="text-sm font-semibold text-orange-600">Team Membership & Registration Portal</p>
              <p className="text-xs text-gray-500 max-w-md mx-auto">
                Please select your current status below to proceed with the appropriate membership form.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 pt-4">
              <button
                type="button"
                onClick={() => { setPath("returning"); setStep(1); }}
                className="group flex flex-col items-center justify-between rounded-2xl border-2 border-gray-200 bg-white p-6 text-center transition hover:border-orange-500 hover:bg-orange-50/30 shadow-xs hover:shadow-md cursor-pointer"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition mb-4">
                  <UserCheck size={24} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">Are you a team member already?</h3>
                  <p className="mt-1 text-xs text-gray-500">Click here to continue and review your commitment.</p>
                </div>
                <span className="mt-6 rounded-xl bg-orange-500 px-4 py-2 text-xs font-bold text-white shadow-xs">
                  Continue as Member
                </span>
              </button>

              <button
                type="button"
                onClick={() => { setPath("new"); setStep(1); }}
                className="group flex flex-col items-center justify-between rounded-2xl border-2 border-gray-200 bg-white p-6 text-center transition hover:border-orange-500 hover:bg-orange-50/30 shadow-xs hover:shadow-md cursor-pointer"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition mb-4">
                  <UserPlus size={24} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">Are you intending to be a part of the team?</h3>
                  <p className="mt-1 text-xs text-gray-500">Click here to register and join as a new member.</p>
                </div>
                <span className="mt-6 rounded-xl bg-orange-500 px-4 py-2 text-xs font-bold text-white shadow-xs">
                  Join the Team
                </span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <button
                type="button"
                onClick={() => {
                  if (step === 1) setStep(0);
                  else if (step === 4 && isDroppingOut) setStep(2);
                  else setStep((prev) => prev - 1);
                }}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-orange-600 transition"
              >
                <ArrowLeft size={16} /> Back
              </button>
              <span className="rounded-full bg-orange-100 px-3 py-1 text-[11px] font-bold text-orange-700">
                Step {step} of 4
              </span>
            </div>

            {step === 1 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-orange-600 font-bold text-xs uppercase tracking-wider">
                  <ShieldCheck size={18} /> The Refinery International Team Portal
                </div>
                <h1 className="text-2xl font-black text-gray-900">
                  {path === "returning" ? "TEAM MEMBERSHIP CONTINUATION FORM" : "TEAM MEMBERSHIP REGISTRATION FORM"}
                </h1>
                
                <div className="rounded-2xl bg-orange-50/60 border border-orange-100 p-6 space-y-3 text-xs sm:text-sm text-gray-700 leading-relaxed">
                  <p className="font-bold text-orange-900 text-base">A CONSCIOUS DECISION TO SERVE</p>
                  <p>Being part of The Refinery International team is more than simply having your name on a list. It is a commitment to the vision, the children we serve, the work we have been entrusted with, and to one another as a team.</p>
                  <p className="font-semibold text-orange-950">Please complete this form only if, after prayer and reflection, you genuinely desire to serve and are willing to give yourself to the responsibilities that come with it.</p>
                </div>
              </div>
            )}

            {message && (
              <div className={`flex items-center gap-2 rounded-2xl p-4 text-xs font-semibold ${
                message.type === "success" ? "border border-green-200 bg-green-50 text-green-700" : "border border-red-200 bg-red-50 text-red-700"
              }`}>
                {message.type === "success" ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                <span>{message.text}</span>
              </div>
            )}

            <form onSubmit={step === 4 || (step === 2 && isDroppingOut) ? handleSubmit : handleNextStep} className="space-y-6">

              {step === 1 && (
                <div className="space-y-4">
                  <h2 className="text-sm font-black uppercase text-orange-600 tracking-wider border-b border-gray-100 pb-2">
                    Section 1 — Biodata
                  </h2>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-xs font-bold text-gray-700">1. Full Name *</label>
                      <input
                        type="text"
                        required
                        value={form.fullName}
                        onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-xs text-gray-900 focus:border-orange-500 focus:outline-none shadow-xs"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-bold text-gray-700">2. Preferred Name</label>
                      <input
                        type="text"
                        value={form.preferredName}
                        onChange={(e) => setForm({ ...form, preferredName: e.target.value })}
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-xs text-gray-900 focus:border-orange-500 focus:outline-none shadow-xs"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-bold text-gray-700">3. Date of Birth</label>
                      <input
                        type="date"
                        value={form.dateOfBirth}
                        onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })}
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-xs text-gray-900 focus:border-orange-500 focus:outline-none shadow-xs"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-bold text-gray-700">4. Gender</label>
                      <select
                        value={form.gender}
                        onChange={(e) => setForm({ ...form, gender: e.target.value })}
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-xs text-gray-900 focus:border-orange-500 focus:outline-none shadow-xs"
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-bold text-gray-700">5. Phone Number *</label>
                      <input
                        type="tel"
                        required
                        value={form.phoneNumber}
                        onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-xs text-gray-900 focus:border-orange-500 focus:outline-none shadow-xs"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-bold text-gray-700">6. WhatsApp Number *</label>
                      <input
                        type="tel"
                        required
                        value={form.whatsappNumber}
                        onChange={(e) => setForm({ ...form, whatsappNumber: e.target.value })}
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-xs text-gray-900 focus:border-orange-500 focus:outline-none shadow-xs"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-bold text-gray-700">7. Email Address *</label>
                      <input
                        type="email"
                        required
                        value={form.emailAddress}
                        onChange={(e) => setForm({ ...form, emailAddress: e.target.value })}
                        placeholder="your.email@example.com"
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-xs text-gray-900 focus:border-orange-500 focus:outline-none shadow-xs"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-bold text-gray-700">9. State of Origin</label>
                      <input
                        type="text"
                        value={form.stateOfOrigin}
                        onChange={(e) => setForm({ ...form, stateOfOrigin: e.target.value })}
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-xs text-gray-900 focus:border-orange-500 focus:outline-none shadow-xs"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="mb-1 block text-xs font-bold text-gray-700">8. Residential Address</label>
                      <textarea
                        rows={2}
                        value={form.residentialAddress}
                        onChange={(e) => setForm({ ...form, residentialAddress: e.target.value })}
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-xs text-gray-900 focus:border-orange-500 focus:outline-none shadow-xs"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-bold text-gray-700">10. Occupation / Course of Study</label>
                      <input
                        type="text"
                        value={form.occupation}
                        onChange={(e) => setForm({ ...form, occupation: e.target.value })}
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-xs text-gray-900 focus:border-orange-500 focus:outline-none shadow-xs"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-bold text-gray-700">11. Institution / Workplace</label>
                      <input
                        type="text"
                        value={form.institutionWorkplace}
                        onChange={(e) => setForm({ ...form, institutionWorkplace: e.target.value })}
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-xs text-gray-900 focus:border-orange-500 focus:outline-none shadow-xs"
                      />
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <h2 className="text-sm font-black uppercase text-orange-600 tracking-wider border-b border-gray-100 pb-2">
                    Section 2 — Your Decision / Intention
                  </h2>

                  <div className="space-y-3">
                    <label className="block text-xs font-bold text-gray-800">
                      16. Having taken time to reflect on the vision, values, expectations and demands of The Refinery International team, what is your decision? *
                    </label>
                    <div className="space-y-2">
                      {[
                        path === "returning" ? "Yes, I genuinely desire to continue as a team member." : "Yes, I genuinely desire to join the team.",
                        "I am still considering my decision.",
                        path === "returning" ? "No, I do not wish to continue." : "No, I do not wish to join at this time."
                      ].map((opt) => (
                        <label key={opt} className="flex items-center gap-2.5 text-xs font-medium text-gray-700 cursor-pointer">
                          <input
                            type="radio"
                            name="continuationDecision"
                            required
                            checked={form.continuationDecision === opt}
                            onChange={() => setForm({ ...form, continuationDecision: opt })}
                            className="text-orange-500 focus:ring-orange-500"
                          />
                          <span>{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {!isDroppingOut && (
                    <>
                      <div className="space-y-2">
                        <label className="block text-xs font-bold text-gray-800">
                          17. What has informed your decision to {path === "returning" ? "continue with" : "join"} the team?
                        </label>
                        <textarea
                          rows={3}
                          value={form.decisionReason}
                          onChange={(e) => setForm({ ...form, decisionReason: e.target.value })}
                          placeholder="Share your thoughts..."
                          className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-xs text-gray-900 focus:border-orange-500 focus:outline-none shadow-xs"
                        />
                      </div>

                      <div className="space-y-3">
                        <label className="block text-xs font-bold text-gray-800">
                          20. Are you willing to commit your time, skills, resources and service to the extent required of you as a team member? *
                        </label>
                        <div className="space-y-2">
                          {["Yes", "No", "I need further clarification"].map((opt) => (
                            <label key={opt} className="flex items-center gap-2.5 text-xs font-medium text-gray-700 cursor-pointer">
                              <input
                                type="radio"
                                name="commitmentWillingness"
                                required
                                checked={form.commitmentWillingness === opt}
                                onChange={() => setForm({ ...form, commitmentWillingness: opt })}
                                className="text-orange-500 focus:ring-orange-500"
                              />
                              <span>{opt}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}

              {step === 3 && !isDroppingOut && (
                <div className="space-y-4">
                  <h2 className="text-sm font-black uppercase text-orange-600 tracking-wider border-b border-gray-100 pb-2">
                    Section 3 — Understanding the Commitment
                  </h2>
                  <p className="text-xs text-gray-500">I understand that being a member of The Refinery International:</p>

                  <div className="space-y-2.5">
                    {understandingItems.map((item, idx) => {
                      const checked = form.understandings.includes(item);
                      return (
                        <label key={idx} className="flex items-start gap-2.5 text-xs font-medium text-gray-700 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => handleCheckboxToggle(item)}
                            className="mt-0.5 rounded text-orange-500 focus:ring-orange-500 shrink-0"
                          />
                          <span>{item}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

              {(step === 4 || (step === 2 && isDroppingOut)) && (
                <div className="space-y-4">
                  <h2 className="text-sm font-black uppercase text-orange-600 tracking-wider border-b border-gray-100 pb-2">
                    {isDroppingOut ? "Closing — Response Summary" : "Section 4 — Personal Commitment & Attestation"}
                  </h2>

                  {isDroppingOut ? (
                    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-xs text-amber-900 space-y-3 shadow-xs">
                      <p className="font-bold text-sm">Thank you for your response, {form.fullName || "Member"}.</p>
                      <p>You have indicated that you do not wish to {path === "returning" ? "continue" : "join"} at this time. Click submit below to finalize your response.</p>
                    </div>
                  ) : (
                    <>
                      <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6 space-y-3 text-xs leading-relaxed text-gray-700">
                        <p className="font-bold text-gray-900">MEMBERSHIP ATTESTATION</p>
                        <p>I, <span className="underline font-semibold">{form.fullName || "________________________"}</span>, having taken time to reflect on {path === "returning" ? "continuing with" : "joining"} The Refinery International, hereby voluntarily confirm my desire to be a part of the team.</p>
                        <p>I understand that being a team member is a commitment and not merely a title or association. I acknowledge the vision, values and responsibilities associated with serving in The Refinery International.</p>
                        <p>I commit myself to serving faithfully, responsibly and respectfully, to the best of my ability. I will make reasonable effort to honour my responsibilities, communicate appropriately when challenges arise, work in unity with other team members, and remain teachable and accountable.</p>
                        <p>I understand that my involvement requires intentionality, sacrifice, integrity and a willingness to serve.</p>
                        <p className="font-semibold text-gray-900">Having considered these things, I freely and consciously choose to {path === "returning" ? "continue as" : "become"} a member of The Refinery International team.</p>
                      </div>

                      <div className="space-y-2 pt-2">
                        <label className="block text-xs font-bold text-gray-800">25. Do you attest to the statement above? *</label>
                        <div className="space-y-2">
                          {["Yes, I do.", "No"].map((opt) => (
                            <label key={opt} className="flex items-center gap-2.5 text-xs font-medium text-gray-700 cursor-pointer">
                              <input
                                type="radio"
                                name="attestation"
                                required
                                checked={form.attestation === opt}
                                onChange={() => setForm({ ...form, attestation: opt })}
                                className="text-orange-500 focus:ring-orange-500"
                              />
                              <span>{opt}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}

              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                {step < 4 && !isDroppingOut ? (
                  <button
                    type="submit"
                    className="ml-auto flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-3 text-xs font-bold text-white shadow-md hover:bg-orange-600 transition"
                  >
                    <span>Next Section</span> <ArrowRight size={16} />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading}
                    className="ml-auto flex items-center gap-2 rounded-xl bg-orange-500 px-8 py-3.5 text-sm font-bold text-white shadow-md hover:bg-orange-600 transition disabled:opacity-50 w-full justify-center sm:w-auto"
                  >
                    {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                    <span>{loading ? "Submitting Form..." : "Submit Final Membership Form"}</span>
                  </button>
                )}
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}