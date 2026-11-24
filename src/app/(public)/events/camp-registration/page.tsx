"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import {
  ArrowLeft,
  CheckCircle2,
  Plus,
  Trash2,
  Copy,
  Check,
  Ticket,
  ClipboardList,
  Bell,
  ShieldCheck,
  MapPin,
  Clock,
  Phone,
  Users,
} from "lucide-react";

type RegistrationCategory =
  | "guest"
  | "church"
  | "parent_and_children"
  | "corporate";

type ChildTransportMode = "camp_pickup" | "self_dropoff";

interface ChildEntry {
  name: string;
  age: string;
  gender: string;
}

const ITEMS_TO_BRING = [
  "Towel",
  "Pyjamas / Night gown / Cardigan",
  "Toothbrush & Toothpaste",
  "Toilet soap & Sponge",
  "Toilet roll",
  "Cover cloth",
  "Bathroom Slippers",
  "Comb / brush",
  "Plate, Cup & Cutlery",
  "Sport wear",
  "Body cream & hair cream",
  "Bible, jotter and pen",
  "Sanitary Pad (for girls)",
  "Wears to change",
  "The right mindset",
  "Your personal registration code (printed or on your phone)",
];

function generateRegistrationCode() {
  const randomDigits = Math.floor(100000 + Math.random() * 900000);
  return `REF-${randomDigits}`;
}

export default function CampRegistrationPage() {
  const [category, setCategory] = useState<RegistrationCategory>("guest");
  const [primaryContactName, setPrimaryContactName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // Guest fields
  const [cityOrBranch, setCityOrBranch] = useState("");
  const [guestArrivalDate, setGuestArrivalDate] = useState("");
  const [accommodationNeeded, setAccommodationNeeded] = useState(false);
  const [specialNeeds, setSpecialNeeds] = useState("");

  // Church fields
  const [churchName, setChurchName] = useState("");
  const [pastorOrLeader, setPastorOrLeader] = useState("");
  const [delegateCount, setDelegateCount] = useState(5);
  const [arrivalDate, setArrivalDate] = useState("");

  // Parent & Children fields
  const [parentAttending, setParentAttending] = useState(true);
  const [emergencyContact, setEmergencyContact] = useState("");
  const [homeAddress, setHomeAddress] = useState("");
  const [childSpecialNeeds, setChildSpecialNeeds] = useState("");
  const [childTransportMode, setChildTransportMode] =
    useState<ChildTransportMode>("self_dropoff");
  const [pickupLocation, setPickupLocation] = useState("");
  const [returnLocation, setReturnLocation] = useState("");
  const [personBringingName, setPersonBringingName] = useState("");
  const [personPickingUpName, setPersonPickingUpName] = useState("");
  const [childrenList, setChildrenList] = useState<ChildEntry[]>([
    { name: "", age: "", gender: "Male" },
  ]);

  // Corporate fields
  const [organizationName, setOrganizationName] = useState("");
  const [industryOrSector, setIndustryOrSector] = useState("");
  const [staffCount, setStaffCount] = useState(2);

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [assignedCode, setAssignedCode] = useState<string>("");
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedList, setCopiedList] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const addChild = () => {
    setChildrenList([...childrenList, { name: "", age: "", gender: "Male" }]);
  };

  const removeChild = (index: number) => {
    setChildrenList(childrenList.filter((_, i) => i !== index));
  };

  const updateChild = (index: number, field: keyof ChildEntry, value: string) => {
    const updated = [...childrenList];
    updated[index][field] = value;
    setChildrenList(updated);
  };

  async function handleCopyCode() {
    if (!assignedCode) return;
    await navigator.clipboard.writeText(assignedCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  }

  async function handleCopyChecklist() {
    const header = assignedCode
      ? `Items to Bring to Camp Meeting (${assignedCode}):`
      : "Items to Bring to Camp Meeting:";
    const formattedList = `${header}\n${ITEMS_TO_BRING.map(
      (item, index) => `${index + 1}.${item}`
    ).join("\n")}`;
    await navigator.clipboard.writeText(formattedList);
    setCopiedList(true);
    setTimeout(() => setCopiedList(false), 2000);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg(null);

    let total_attendees = 1;
    let details: Record<string, any> = {};

    if (category === "guest") {
      total_attendees = 1;
      details = {
        city_or_branch: cityOrBranch,
        arrival_date: guestArrivalDate,
        accommodation_needed: accommodationNeeded,
        special_needs: specialNeeds || "None",
      };
    } else if (category === "church") {
      total_attendees = Number(delegateCount) || 1;
      details = {
        church_name: churchName,
        pastor_or_leader: pastorOrLeader,
        delegate_count: total_attendees,
        arrival_date: arrivalDate,
      };
    } else if (category === "parent_and_children") {
      total_attendees = childrenList.length + (parentAttending ? 1 : 0);
      details = {
        parent_attending: parentAttending,
        emergency_contact: emergencyContact,
        home_address: homeAddress,
        special_needs: childSpecialNeeds || "None",
        transport_mode: childTransportMode,
        ...(childTransportMode === "camp_pickup"
          ? {
              pickup_location: pickupLocation,
              return_location: returnLocation,
            }
          : {
              person_bringing: personBringingName,
              person_picking_up: personPickingUpName,
            }),
        children: childrenList,
      };
    } else if (category === "corporate") {
      total_attendees = Number(staffCount) || 1;
      details = {
        organization_name: organizationName,
        industry_or_sector: industryOrSector,
        staff_count: total_attendees,
      };
    }

    const registration_code = generateRegistrationCode();

    const { error } = await supabase.from("camp_registrations").insert({
      registration_code,
      category,
      primary_contact_name: primaryContactName,
      email,
      phone,
      total_attendees,
      details,
    });

    setSubmitting(false);

    if (error) {
      console.error("Registration error:", error);
      setErrorMsg(
        "Unable to complete registration. Please check your details and try again."
      );
      return;
    }

    setAssignedCode(registration_code);
    setSubmitted(true);
  }

  return (
    <main className="bg-gray-50 min-h-screen">
      {/* Header Banner */}
      <section className="bg-orange-500 py-14 text-center text-white">
        <div className="mx-auto max-w-4xl px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-100">
            The Refinery International
          </p>
          <h1 className="mt-3 text-3xl font-bold sm:text-5xl">
            Camp Meeting Registration
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-orange-50 sm:text-base">
            Review the important camp guidelines and materials needed below,
            then complete your registration.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-12">
        <Link
          href="/events"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-orange-500"
        >
          <ArrowLeft size={16} />
          Back to Events
        </Link>

        {/* Camp Guidelines & Materials Needed Notice (Before the Form) */}
        {!submitted && (
          <div className="mb-8 grid gap-6 lg:grid-cols-2">
            {/* Left Side: Important Camp Information */}
            <div className="rounded-3xl border border-orange-200 bg-white p-6 sm:p-8 shadow-sm space-y-5">
              <div>
                <span className="inline-block rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-orange-600">
                  Important Note
                </span>
                <h2 className="mt-2 text-xl font-bold text-gray-900">
                  Camp Information & Guidelines
                </h2>
              </div>

              <div className="space-y-3.5 text-sm text-gray-700">
                <div className="flex items-start gap-3">
                  <Users size={18} className="mt-0.5 shrink-0 text-orange-500" />
                  <div>
                    <p className="font-semibold text-gray-900">Age Group</p>
                    <p>Ages 5 and above. Parents can also attend the camp meeting.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin size={18} className="mt-0.5 shrink-0 text-orange-500" />
                  <div>
                    <p className="font-semibold text-gray-900">Venue</p>
                    <p>University Demonstration Secondary School, Ikere-Ekiti.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock size={18} className="mt-0.5 shrink-0 text-orange-500" />
                  <div>
                    <p className="font-semibold text-gray-900">Camp Schedule</p>
                    <p>
                      <span className="font-medium">Camp Opens:</span> 7:00 AM, Mon. 21st December, 2026
                    </p>
                    <p>
                      <span className="font-medium">Camp Closes:</span> 7:00 AM, Thur. 24th December, 2026
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      On-site camp ground check-in/registration starts at 7:00 AM on Mon. 21st Dec.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <ShieldCheck size={18} className="mt-0.5 shrink-0 text-green-600" />
                  <div>
                    <p className="font-semibold text-gray-900">Security</p>
                    <p>Fully secured through partnership with the force.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone size={18} className="mt-0.5 shrink-0 text-orange-500" />
                  <div>
                    <p className="font-semibold text-gray-900">Enquiries & Contacts</p>
                    <p className="text-xs leading-relaxed text-gray-600">
                      Olabisi: <span className="font-medium text-gray-800">08162666731</span> &bull;{" "}
                      Iyanu: <span className="font-medium text-gray-800">09132963923</span> &bull;{" "}
                      Ilesanmi: <span className="font-medium text-gray-800">08142963814</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side: Materials Needed */}
            <div className="rounded-3xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="inline-block rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-gray-600">
                      Checklist
                    </span>
                    <h2 className="mt-2 text-xl font-bold text-gray-900">
                      Materials Needed
                    </h2>
                  </div>

                  <button
                    type="button"
                    onClick={handleCopyChecklist}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-gray-300 bg-gray-50 px-3.5 py-2 text-xs font-semibold text-gray-700 transition hover:border-orange-500 hover:text-orange-600"
                  >
                    {copiedList ? (
                      <>
                        <Check size={14} className="text-green-600" /> Copied!
                      </>
                    ) : (
                      <>
                        <Copy size={14} /> Copy List
                      </>
                    )}
                  </button>
                </div>

                <ol className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 text-xs sm:text-sm text-gray-700">
                  {ITEMS_TO_BRING.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="font-bold text-orange-500">{idx + 1}.</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        )}

        {/* Main Form or Confirmation Card */}
        <div className="mx-auto max-w-3xl">
          {submitted ? (
            <div className="space-y-6 rounded-3xl bg-white p-6 sm:p-10 shadow-sm border border-gray-100">
              <div className="text-center">
                <CheckCircle2 size={52} className="mx-auto text-green-500" />
                <h2 className="mt-4 text-2xl font-bold text-gray-900">
                  Registration Confirmed!
                </h2>
                <p className="mx-auto mt-2 max-w-lg text-sm text-gray-600">
                  Thank you,{" "}
                  <span className="font-semibold text-gray-900">
                    {primaryContactName}
                  </span>
                  . Your{" "}
                  <span className="capitalize font-semibold text-gray-900">
                    {category.replace(/_/g, " ")}
                  </span>{" "}
                  registration has been received.
                </p>
              </div>

              {/* Personal Registration Code Box */}
              <div className="rounded-2xl border-2 border-dashed border-orange-300 bg-orange-50/70 p-5 text-center">
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-orange-600">
                  <Ticket size={15} />
                  Your Personal Registration Code
                </div>
                <p className="mt-2 font-mono text-3xl font-extrabold tracking-widest text-gray-900">
                  {assignedCode}
                </p>
                <p className="mt-2 text-xs text-gray-600">
                  Bring this code to the camp ground. Our team will match this
                  code with your name before granting entry to the camp meeting.
                </p>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="mt-4 inline-flex items-center gap-2 rounded-full bg-orange-500 px-5 py-2 text-xs font-semibold text-white transition hover:bg-orange-600"
                >
                  {copiedCode ? (
                    <>
                      <Check size={14} /> Code Copied!
                    </>
                  ) : (
                    <>
                      <Copy size={14} /> Copy Registration Code
                    </>
                  )}
                </button>
              </div>

              {/* Lookout for Message Notice */}
              <div className="flex items-start gap-3 rounded-2xl border border-blue-100 bg-blue-50/70 p-4 text-sm text-blue-900">
                <Bell size={18} className="mt-0.5 shrink-0 text-blue-600" />
                <div>
                  <p className="font-semibold">
                    Please be on the lookout for a message from us
                  </p>
                  <p className="mt-0.5 text-xs text-blue-800">
                    Keep an eye on your email (
                    <span className="font-medium">{email}</span>) and phone/SMS (
                    <span className="font-medium">{phone}</span>) for updates and
                    instructions from our team.
                  </p>
                </div>
              </div>

              {/* Items to Bring Checklist */}
              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <ClipboardList size={18} className="text-orange-500" />
                    <h3 className="text-base font-bold text-gray-900">
                      Materials Needed for the Camp Meeting
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyChecklist}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-gray-300 bg-white px-3.5 py-1.5 text-xs font-semibold text-gray-700 transition hover:border-orange-500 hover:text-orange-600"
                  >
                    {copiedList ? (
                      <>
                        <Check size={14} className="text-green-600" /> Checklist
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy size={14} /> Copy List
                      </>
                    )}
                  </button>
                </div>

                <ol className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-700">
                  {ITEMS_TO_BRING.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="font-bold text-orange-500">
                        {idx + 1}.
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="flex flex-wrap justify-center gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setAssignedCode("");
                    setCopiedCode(false);
                    setCopiedList(false);
                    setPrimaryContactName("");
                    setEmail("");
                    setPhone("");
                  }}
                  className="rounded-full border border-orange-500 px-6 py-2.5 text-sm font-semibold text-orange-500 hover:bg-orange-50"
                >
                  Register Another
                </button>
                <Link
                  href="/events"
                  className="rounded-full bg-orange-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-orange-600"
                >
                  Return to Events
                </Link>
              </div>
            </div>
          ) : (
            <div className="rounded-3xl bg-white p-6 sm:p-10 shadow-sm border border-gray-100">
              {/* Category Tabs */}
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">
                1. Choose Registration Category
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-8">
                {[
                  { id: "guest", label: "Guest" },
                  { id: "church", label: "Church Group" },
                  { id: "parent_and_children", label: "Parent & Kids" },
                  { id: "corporate", label: "Corporate Body" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setCategory(tab.id as RegistrationCategory)}
                    className={`py-3 px-3 text-sm font-semibold rounded-2xl border transition ${
                      category === tab.id
                        ? "bg-orange-500 text-white border-orange-500 shadow-sm"
                        : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-orange-50"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500">
                  2. Contact Information
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {category === "parent_and_children"
                        ? "Parent / Guardian Full Name"
                        : "Primary Contact Name"}
                    </label>
                    <input
                      required
                      value={primaryContactName}
                      onChange={(e) => setPrimaryContactName(e.target.value)}
                      placeholder="Full Name"
                      className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:border-orange-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+234 800 000 0000"
                      className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:border-orange-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:border-orange-500 focus:outline-none"
                  />
                </div>

                {/* GUEST FIELDS */}
                {category === "guest" && (
                  <div className="space-y-4 pt-4 border-t border-gray-100">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          City / State
                        </label>
                        <input
                          required
                          value={cityOrBranch}
                          onChange={(e) => setCityOrBranch(e.target.value)}
                          placeholder="e.g., Ikere-Ekiti, Ekiti State"
                          className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:border-orange-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Expected Day / Date of Arrival
                        </label>
                        <input
                          type="date"
                          required
                          value={guestArrivalDate}
                          onChange={(e) => setGuestArrivalDate(e.target.value)}
                          className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:border-orange-500 focus:outline-none"
                        />
                      </div>
                    </div>
                    <label className="flex items-center gap-2.5 text-sm text-gray-700">
                      <input
                        type="checkbox"
                        checked={accommodationNeeded}
                        onChange={(e) => setAccommodationNeeded(e.target.checked)}
                        className="h-4 w-4 rounded accent-orange-500"
                      />
                      I will require camp accommodation
                    </label>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Special / Medical Needs (Optional)
                      </label>
                      <input
                        value={specialNeeds}
                        onChange={(e) => setSpecialNeeds(e.target.value)}
                        placeholder="Any allergies or assistance needed"
                        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:border-orange-500 focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                {/* CHURCH FIELDS */}
                {category === "church" && (
                  <div className="space-y-4 pt-4 border-t border-gray-100">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Church / Assembly Name
                        </label>
                        <input
                          required
                          value={churchName}
                          onChange={(e) => setChurchName(e.target.value)}
                          className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:border-orange-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Lead Pastor / Coordinator
                        </label>
                        <input
                          required
                          value={pastorOrLeader}
                          onChange={(e) => setPastorOrLeader(e.target.value)}
                          className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:border-orange-500 focus:outline-none"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Number of Delegates Attending
                        </label>
                        <input
                          type="number"
                          min={1}
                          required
                          value={delegateCount}
                          onChange={(e) => setDelegateCount(Number(e.target.value))}
                          className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:border-orange-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Expected Arrival Date
                        </label>
                        <input
                          type="date"
                          required
                          value={arrivalDate}
                          onChange={(e) => setArrivalDate(e.target.value)}
                          className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:border-orange-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* PARENT & CHILDREN FIELDS */}
                {category === "parent_and_children" && (
                  <div className="space-y-4 pt-4 border-t border-gray-100">
                    <label className="flex items-center gap-2.5 rounded-2xl bg-orange-50 p-3.5 text-sm font-medium text-gray-800">
                      <input
                        type="checkbox"
                        checked={parentAttending}
                        onChange={(e) => setParentAttending(e.target.checked)}
                        className="h-4 w-4 rounded accent-orange-500"
                      />
                      I am also attending the camp meeting alongside my child(ren)
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Emergency Contact Phone
                        </label>
                        <input
                          type="tel"
                          required
                          value={emergencyContact}
                          onChange={(e) => setEmergencyContact(e.target.value)}
                          placeholder="+234 800 000 0000"
                          className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:border-orange-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Home / Residential Address
                        </label>
                        <input
                          required
                          value={homeAddress}
                          onChange={(e) => setHomeAddress(e.target.value)}
                          placeholder="Street, Area, City / Town"
                          className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:border-orange-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Pick-up vs Self Drop-off Question */}
                    <div className="rounded-2xl border border-gray-200 bg-gray-50/70 p-4 space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-2">
                          Do you want your child(ren) picked up by our camp team?
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          <button
                            type="button"
                            onClick={() => setChildTransportMode("camp_pickup")}
                            className={`rounded-xl border px-4 py-2.5 text-xs font-semibold text-left transition ${
                              childTransportMode === "camp_pickup"
                                ? "border-orange-500 bg-orange-500 text-white shadow-sm"
                                : "border-gray-300 bg-white text-gray-700 hover:bg-orange-50"
                            }`}
                          >
                            Yes, pick up & return my child(ren)
                          </button>
                          <button
                            type="button"
                            onClick={() => setChildTransportMode("self_dropoff")}
                            className={`rounded-xl border px-4 py-2.5 text-xs font-semibold text-left transition ${
                              childTransportMode === "self_dropoff"
                                ? "border-orange-500 bg-orange-500 text-white shadow-sm"
                                : "border-gray-300 bg-white text-gray-700 hover:bg-orange-50"
                            }`}
                          >
                            No, we will bring & pick up ourselves
                          </button>
                        </div>
                      </div>

                      {childTransportMode === "camp_pickup" ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Nearest Pick-up Location
                            </label>
                            <input
                              required
                              value={pickupLocation}
                              onChange={(e) => setPickupLocation(e.target.value)}
                              placeholder="Closest bus stop / landmark"
                              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:border-orange-500 focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Where Should They Be Returned To?
                            </label>
                            <input
                              required
                              value={returnLocation}
                              onChange={(e) => setReturnLocation(e.target.value)}
                              placeholder="Drop-off bus stop / address after camp"
                              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:border-orange-500 focus:outline-none"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Name of Person Bringing the Child(ren)
                            </label>
                            <input
                              required
                              value={personBringingName}
                              onChange={(e) =>
                                setPersonBringingName(e.target.value)
                              }
                              placeholder="Full name of person dropping off"
                              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:border-orange-500 focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Name of Person Picking Up the Child(ren)
                            </label>
                            <input
                              required
                              value={personPickingUpName}
                              onChange={(e) =>
                                setPersonPickingUpName(e.target.value)
                              }
                              placeholder="Full name of authorized pick-up person"
                              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:border-orange-500 focus:outline-none"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Children List */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-gray-800">
                          Children Details (Ages 5 & Above)
                        </span>
                        <button
                          type="button"
                          onClick={addChild}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-orange-500 hover:text-orange-600"
                        >
                          <Plus size={14} /> Add Another Child
                        </button>
                      </div>

                      {childrenList.map((child, idx) => (
                        <div
                          key={idx}
                          className="grid grid-cols-12 gap-2 items-center rounded-2xl bg-gray-50 p-3"
                        >
                          <input
                            placeholder="Child's Full Name"
                            required
                            value={child.name}
                            onChange={(e) => updateChild(idx, "name", e.target.value)}
                            className="col-span-6 rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:border-orange-500 focus:outline-none"
                          />
                          <input
                            placeholder="Age"
                            type="number"
                            min={5}
                            max={17}
                            required
                            value={child.age}
                            onChange={(e) => updateChild(idx, "age", e.target.value)}
                            className="col-span-2 rounded-xl border border-gray-300 bg-white px-2.5 py-2 text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:border-orange-500 focus:outline-none"
                          />
                          <select
                            value={child.gender}
                            onChange={(e) => updateChild(idx, "gender", e.target.value)}
                            className="col-span-3 rounded-xl border border-gray-300 bg-white px-2.5 py-2 text-sm font-medium text-gray-900 focus:border-orange-500 focus:outline-none"
                          >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                          </select>
                          {childrenList.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeChild(idx)}
                              className="col-span-1 flex justify-center text-red-500 hover:text-red-600"
                              title="Remove child"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Special / Medical Needs for the Child */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Special / Medical Needs for the Child(ren) (Optional)
                      </label>
                      <input
                        value={childSpecialNeeds}
                        onChange={(e) => setChildSpecialNeeds(e.target.value)}
                        placeholder="Allergies, medications, dietary notes, or special care instructions"
                        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:border-orange-500 focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                {/* CORPORATE FIELDS */}
                {category === "corporate" && (
                  <div className="space-y-4 pt-4 border-t border-gray-100">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Organization / Corporate Name
                        </label>
                        <input
                          required
                          value={organizationName}
                          onChange={(e) => setOrganizationName(e.target.value)}
                          className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:border-orange-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Industry / Sector
                        </label>
                        <input
                        required
                        value={industryOrSector}
                        onChange={(e) => setIndustryOrSector(e.target.value)}
                        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:border-orange-500 focus:outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Number of Representatives Attending
                    </label>
                    <input
                      type="number"
                      min={1}
                      required
                      value={staffCount}
                      onChange={(e) => setStaffCount(Number(e.target.value))}
                      className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:border-orange-500 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {errorMsg && (
                <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-sm text-red-700">
                  {errorMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-full bg-orange-500 py-3.5 font-semibold text-white shadow-md transition hover:bg-orange-600 disabled:opacity-50"
              >
                {submitting
                  ? "Submitting Registration..."
                  : "Complete Registration"}
              </button>
            </form>
          </div>
        )}
        </div>
      </section>
    </main>
  );
}