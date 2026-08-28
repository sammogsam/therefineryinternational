"use client";

import { FormEvent, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function JoinTeam() {
  // ==============================
  // TEAM MEMBER FORM
  // ==============================

  const [teamName, setTeamName] = useState("");
  const [teamEmail, setTeamEmail] = useState("");
  const [teamPhone, setTeamPhone] = useState("");
  const [teamDepartment, setTeamDepartment] = useState("");
  const [teamReason, setTeamReason] = useState("");

  const [teamLoading, setTeamLoading] = useState(false);
  const [teamMessage, setTeamMessage] = useState("");

  async function handleTeamSubmit(event: FormEvent) {
    event.preventDefault();

    setTeamLoading(true);
    setTeamMessage("");

    const { error } = await supabase.from("team_applications").insert({
      full_name: teamName,
      email: teamEmail,
      phone: teamPhone,
      department: teamDepartment,
      reason: teamReason,
    });

    if (error) {
      console.error(error);

      setTeamMessage(
        "We could not submit your application. Please try again."
      );

      setTeamLoading(false);
      return;
    }

    setTeamMessage(
      "Application submitted successfully! We will be in touch with you."
    );

    setTeamName("");
    setTeamEmail("");
    setTeamPhone("");
    setTeamDepartment("");
    setTeamReason("");

    setTeamLoading(false);
  }

  // ==============================
  // VOLUNTEER FORM
  // ==============================

  const [volunteerName, setVolunteerName] = useState("");
  const [volunteerEmail, setVolunteerEmail] = useState("");
  const [volunteerPhone, setVolunteerPhone] = useState("");
  const [volunteerProgramme, setVolunteerProgramme] = useState("");
  const [volunteerReason, setVolunteerReason] = useState("");

  const [volunteerLoading, setVolunteerLoading] = useState(false);
  const [volunteerMessage, setVolunteerMessage] = useState("");

  async function handleVolunteerSubmit(event: FormEvent) {
    event.preventDefault();

    setVolunteerLoading(true);
    setVolunteerMessage("");

    const { error } = await supabase.from("volunteer_applications").insert({
      full_name: volunteerName,
      email: volunteerEmail,
      phone: volunteerPhone,
      programme: volunteerProgramme,
      reason: volunteerReason,
    });

    if (error) {
      console.error(error);

      setVolunteerMessage(
        "We could not submit your application. Please try again."
      );

      setVolunteerLoading(false);
      return;
    }

    setVolunteerMessage(
      "Application submitted successfully! We will be in touch with you."
    );

    setVolunteerName("");
    setVolunteerEmail("");
    setVolunteerPhone("");
    setVolunteerProgramme("");
    setVolunteerReason("");

    setVolunteerLoading(false);
  }

  const inputStyles =
    "w-full rounded-xl border border-gray-300 bg-white px-4 py-3.5 text-sm font-medium text-gray-900 placeholder-gray-500 shadow-sm transition outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20";

  return (
    <>
      {/* Hero */}
      <section className="bg-orange-500 py-16 text-center text-white sm:py-20 md:py-24">
        <div className="mx-auto max-w-5xl px-6">
          <h1 className="text-4xl font-bold sm:text-5xl md:text-6xl">
            Join The Refinery
          </h1>

          <p className="mx-auto mt-5 max-w-3xl text-base leading-relaxed text-orange-50 sm:text-lg">
            There is a place for you to serve, grow, and make an impact in the
            lives of children.
          </p>
        </div>
      </section>

      {/* Introduction */}
      <section className="bg-white py-16 sm:py-20 md:py-24">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-500 sm:text-sm">
            Two Ways To Belong
          </p>

          <h2 className="mt-4 text-3xl font-bold text-gray-900 sm:text-4xl">
            Serve According To Your Calling
          </h2>

          <p className="mt-5 text-base leading-relaxed text-gray-600 sm:text-lg">
            Not everyone who serves at The Refinery is called to serve in the same
            way. Some are called into a sustained part of this ministry, while
            others give their time and gifts to specific outreaches and
            programmes.
          </p>
        </div>
      </section>

      {/* Two Paths */}
      <section className="bg-orange-50 py-16 sm:py-20 md:py-24">
        <div className="mx-auto grid max-w-6xl gap-6 px-6 md:grid-cols-2">
          {/* Team Member Info */}
          <div className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">
            <h3 className="text-2xl font-bold text-gray-900">
              Who Is A Team Member?
            </h3>

            <p className="mt-5 text-base leading-relaxed text-gray-600">
              A Team Member is someone who has sensed a lasting call to serve
              within The Refinery. Team membership involves consistent service,
              growth, and responsibility within the ministry.
            </p>

            <ul className="mt-5 space-y-3 text-gray-600">
              <li>✓ Serves within a ministry department</li>
              <li>✓ Attends regular meetings</li>
              <li>✓ Receives orientation and development</li>
              <li>✓ Grows through mentorship and accountability</li>
            </ul>
          </div>

          {/* Volunteer Info */}
          <div className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">
            <h3 className="text-2xl font-bold text-gray-900">
              Who Is A Volunteer?
            </h3>

            <p className="mt-5 text-base leading-relaxed text-gray-600">
              A Volunteer serves The Refinery for a specific programme or
              outreach without taking on an ongoing membership commitment.
            </p>

            <ul className="mt-5 space-y-3 text-gray-600">
              <li>✓ Serves for specific events</li>
              <li>✓ Receives event-specific briefing</li>
              <li>✓ Uses gifts and time to support programmes</li>
              <li>✓ Can later transition into team membership</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Registration Section */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Ready To Serve?
            </h2>

            <p className="mx-auto mt-5 max-w-3xl text-base leading-relaxed text-gray-600 sm:text-lg">
              Whether you sense a call to join the team or you simply want to
              serve at an upcoming programme, we would love to connect with you.
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-2">
            {/* ==========================================
                TEAM MEMBER REGISTRATION
                ========================================== */}
            <form
              onSubmit={handleTeamSubmit}
              className="rounded-3xl border border-orange-100 bg-orange-50/60 p-6 shadow-sm sm:p-8"
            >
              <h3 className="text-2xl font-bold text-gray-900">
                Become A Team Member
              </h3>

              <p className="mt-4 text-sm leading-relaxed text-gray-600">
                If you sense a lasting call to serve within The Refinery, register
                your interest to become part of our ministry team.
              </p>

              <div className="mt-6 space-y-4">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  required
                  className={inputStyles}
                />

                <input
                  type="email"
                  placeholder="Email Address"
                  value={teamEmail}
                  onChange={(e) => setTeamEmail(e.target.value)}
                  required
                  className={inputStyles}
                />

                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={teamPhone}
                  onChange={(e) => setTeamPhone(e.target.value)}
                  required
                  className={inputStyles}
                />

                <input
                  type="text"
                  placeholder="Department / Area of Interest"
                  value={teamDepartment}
                  onChange={(e) => setTeamDepartment(e.target.value)}
                  required
                  className={inputStyles}
                />

                <textarea
                  placeholder="Why would you like to serve with The Refinery?"
                  rows={4}
                  value={teamReason}
                  onChange={(e) => setTeamReason(e.target.value)}
                  required
                  className={inputStyles}
                />
              </div>

              {teamMessage && (
                <div
                  className={`mt-5 rounded-xl px-4 py-3 text-sm font-medium ${
                    teamMessage.includes("successfully")
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {teamMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={teamLoading}
                className="mt-6 w-full rounded-full bg-orange-500 py-3.5 text-sm font-semibold text-white shadow-md shadow-orange-500/20 transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {teamLoading
                  ? "Submitting..."
                  : "Submit Team Member Application"}
              </button>
            </form>

            {/* ==========================================
                VOLUNTEER REGISTRATION
                ========================================== */}
            <form
              onSubmit={handleVolunteerSubmit}
              className="rounded-3xl border border-orange-100 bg-orange-50/60 p-6 shadow-sm sm:p-8"
            >
              <h3 className="text-2xl font-bold text-gray-900">
                Become A Volunteer
              </h3>

              <p className="mt-4 text-sm leading-relaxed text-gray-600">
                If you would like to support a specific programme, outreach, or
                event, register as a volunteer.
              </p>

              <div className="mt-6 space-y-4">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={volunteerName}
                  onChange={(e) => setVolunteerName(e.target.value)}
                  required
                  className={inputStyles}
                />

                <input
                  type="email"
                  placeholder="Email Address"
                  value={volunteerEmail}
                  onChange={(e) => setVolunteerEmail(e.target.value)}
                  required
                  className={inputStyles}
                />

                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={volunteerPhone}
                  onChange={(e) => setVolunteerPhone(e.target.value)}
                  required
                  className={inputStyles}
                />

                <input
                  type="text"
                  placeholder="Programme / Event Interested In"
                  value={volunteerProgramme}
                  onChange={(e) => setVolunteerProgramme(e.target.value)}
                  required
                  className={inputStyles}
                />

                <textarea
                  placeholder="How would you like to serve?"
                  rows={4}
                  value={volunteerReason}
                  onChange={(e) => setVolunteerReason(e.target.value)}
                  required
                  className={inputStyles}
                />
              </div>

              {volunteerMessage && (
                <div
                  className={`mt-5 rounded-xl px-4 py-3 text-sm font-medium ${
                    volunteerMessage.includes("successfully")
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {volunteerMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={volunteerLoading}
                className="mt-6 w-full rounded-full bg-orange-500 py-3.5 text-sm font-semibold text-white shadow-md shadow-orange-500/20 transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {volunteerLoading
                  ? "Submitting..."
                  : "Submit Volunteer Application"}
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}