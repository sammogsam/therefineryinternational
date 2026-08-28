"use client";

import Image from "next/image";
import Link from "next/link";

const departments = [
  "Spiritual Development",
  "Missions & Outreach",
  "Media & Communications",
  "Creative Arts",
  "Worship",
  "Administration",
  "Welfare",
  "Events & Logistics",
  "Counselling",
  "Training & Leadership Development",
];

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-gray-900">

      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <nav className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-gray-950/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

          <Link href="/" className="flex items-center">
            <Image
              src="/logo.png"
              alt="The Refinery International"
              width={75}
              height={75}
              className="h-16 w-auto object-contain"
              priority
            />
          </Link>

          <div className="hidden items-center gap-8 text-sm font-medium text-white md:flex">
            <a href="#vision" className="transition hover:text-orange-400">
              Vision
            </a>

            <a href="#mission" className="transition hover:text-orange-400">
              Mission
            </a>

            <a href="#serve" className="transition hover:text-orange-400">
              Serve
            </a>

            <a
              href="#apply"
              className="rounded-full bg-orange-500 px-6 py-2.5 text-white transition hover:bg-orange-600"
            >
              Join Us
            </a>
          </div>

        </div>
      </nav>


      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="relative overflow-hidden bg-gray-950 pt-36">

        {/* Background glow */}
        <div className="absolute -left-32 top-20 h-96 w-96 rounded-full bg-orange-500/20 blur-3xl" />

        <div className="absolute -right-32 top-40 h-96 w-96 rounded-full bg-amber-400/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 pb-24 pt-16 sm:pb-32 md:pt-20">

          <div className="max-w-4xl">

            <p className="mb-6 text-sm font-semibold uppercase tracking-[0.35em] text-orange-400">
              Serve • Grow • Impact
            </p>

            <h1 className="text-5xl font-bold leading-[1.05] tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl">
              There is a place
              <br />
              <span className="text-orange-500">
                for you to serve.
              </span>
            </h1>

            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-gray-300 sm:text-xl">
              The Refinery International exists to raise and refine
              a generation of children who are strong in the Lord,
              grounded in love, and shaped as arrows in God's hands.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">

              <a
                href="#apply"
                className="rounded-full bg-orange-500 px-8 py-4 text-center font-semibold text-white transition hover:bg-orange-600"
              >
                I Want To Serve
              </a>

              <a
                href="#serve"
                className="rounded-full border border-white/30 px-8 py-4 text-center font-semibold text-white transition hover:bg-white/10"
              >
                Discover Ways To Serve
              </a>

            </div>

          </div>


          {/* Bottom statement */}

          <div className="mt-24 border-t border-white/10 pt-8">

            <p className="max-w-3xl text-sm leading-relaxed text-gray-400 sm:text-base">
              We believe children are not merely the church of tomorrow.
              They are part of God's work today.
            </p>

          </div>

        </div>

      </section>


      {/* =====================================================
          INTRODUCTION
      ===================================================== */}

      <section className="bg-white py-20 sm:py-28">

        <div className="mx-auto max-w-5xl px-6 text-center">

          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-orange-500">
            Why We Serve
          </p>

          <h2 className="mt-5 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            More Than A Programme.
            <br />
            <span className="text-orange-500">
              A Generation.
            </span>
          </h2>

          <p className="mx-auto mt-7 max-w-3xl text-lg leading-8 text-gray-600">
            The Refinery International is committed to reaching,
            raising, refining, and releasing children and teenagers
            into God's purposes for their lives.
          </p>

          <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-gray-600">
            Every camp meeting, outreach, programme, conversation,
            prayer, lesson, and act of service contributes to that
            larger assignment.
          </p>

        </div>

      </section>


      {/* =====================================================
          VISION
      ===================================================== */}

      <section
        id="vision"
        className="bg-orange-50 py-20 sm:py-28"
      >

        <div className="mx-auto max-w-6xl px-6">

          <div className="grid gap-12 md:grid-cols-[0.7fr_1.3fr] md:items-center">

            <div>

              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-orange-500">
                Our Vision
              </p>

              <h2 className="mt-5 text-4xl font-bold text-gray-900 sm:text-5xl">
                Raising a generation
                <span className="text-orange-500"> of light.</span>
              </h2>

            </div>


            <div className="rounded-3xl bg-white p-8 shadow-sm sm:p-12">

              <p className="text-xl leading-9 text-gray-700 sm:text-2xl sm:leading-10">
                “To raise and refine a generation of children
                who are strong in the Lord, grounded in love,
                and shaped as arrows in God's hands, shining
                as light in their world.”
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          MISSION
      ===================================================== */}

      <section
        id="mission"
        className="bg-gray-950 py-20 text-white sm:py-28"
      >

        <div className="mx-auto max-w-6xl px-6">

          <div className="max-w-3xl">

            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-orange-400">
              Our Mission
            </p>

            <h2 className="mt-5 text-4xl font-bold sm:text-5xl">
              What we are committed to doing.
            </h2>

          </div>


          <div className="mt-14 grid gap-6 md:grid-cols-3">

            <div className="rounded-3xl border border-white/10 bg-white/5 p-8">

              <span className="text-5xl font-bold text-orange-500">
                01
              </span>

              <h3 className="mt-8 text-2xl font-bold">
                To reach children with the gospel of Christ
              </h3>

              <p className="mt-4 leading-7 text-gray-400">
                and equip them to live as light in their homes,
                schools, and communities.
              </p>

            </div>


            <div className="rounded-3xl border border-white/10 bg-white/5 p-8">

              <span className="text-5xl font-bold text-orange-500">
                02
              </span>

              <h3 className="mt-8 text-2xl font-bold">
                To teach and disciple children
              </h3>

              <p className="mt-4 leading-7 text-gray-400">
                through engaging, age-appropriate programmes that
                build their faith in God, ground them in love,
                and develop godly character.
              </p>

            </div>


            <div className="rounded-3xl border border-white/10 bg-white/5 p-8">

              <span className="text-5xl font-bold text-orange-500">
                03
              </span>

              <h3 className="mt-8 text-2xl font-bold">
                To nurture and refine children
              </h3>

              <p className="mt-4 leading-7 text-gray-400">
                into spiritually strong, purpose-driven individuals
                who positively influence their generation.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          THE PROCESS
      ===================================================== */}

      <section className="bg-white py-20 sm:py-28">

        <div className="mx-auto max-w-6xl px-6">

          <div className="text-center">

            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-orange-500">
              The Refinery Model
            </p>

            <h2 className="mt-5 text-4xl font-bold text-gray-900 sm:text-5xl">
              Reach. Raise. Refine. Release.
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-gray-600">
              Everything we do is connected to this journey.
            </p>

          </div>


          <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

            {[
              {
                number: "01",
                title: "Reach",
                text: "Create opportunities for children and teenagers to encounter the Gospel.",
              },
              {
                number: "02",
                title: "Raise",
                text: "Build them through teaching, mentorship, prayer, and relationship.",
              },
              {
                number: "03",
                title: "Refine",
                text: "Help them develop character, identity, gifts, and spiritual maturity.",
              },
              {
                number: "04",
                title: "Release",
                text: "Prepare them to shine and fulfil God's purposes in their generation.",
              },
            ].map((item) => (

              <div
                key={item.number}
                className="rounded-3xl bg-orange-50 p-7"
              >

                <span className="text-sm font-bold text-orange-500">
                  {item.number}
                </span>

                <h3 className="mt-5 text-2xl font-bold text-gray-900">
                  {item.title}
                </h3>

                <p className="mt-4 text-sm leading-7 text-gray-600">
                  {item.text}
                </p>

              </div>

            ))}

          </div>

        </div>

      </section>


      {/* =====================================================
          TWO WAYS TO SERVE
      ===================================================== */}

      <section
        id="serve"
        className="bg-orange-50 py-20 sm:py-28"
      >

        <div className="mx-auto max-w-6xl px-6">

          <div className="text-center">

            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-orange-500">
              Two Ways To Serve
            </p>

            <h2 className="mt-5 text-4xl font-bold text-gray-900 sm:text-5xl">
              Find Your Place.
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-gray-600">
              You do not have to serve in the same way as everyone else.
              What matters is finding the place where your calling,
              capacity, and commitment meet.
            </p>

          </div>


          <div className="mt-14 grid gap-8 md:grid-cols-2">

            {/* TEAM */}

            <div className="rounded-3xl bg-gray-950 p-8 text-white sm:p-10">

              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-orange-400">
                Path One
              </p>

              <h3 className="mt-4 text-3xl font-bold">
                Team Member
              </h3>

              <p className="mt-5 leading-8 text-gray-400">
                For those who sense a sustained calling to serve
                within The Refinery International and are ready
                to commit consistently to the work.
              </p>

              <ul className="mt-8 space-y-4 text-sm text-gray-300">

                <li>✓ Ongoing commitment</li>
                <li>✓ Serve within a ministry department</li>
                <li>✓ Regular meetings and development</li>
                <li>✓ Mentorship and accountability</li>
                <li>✓ Opportunity for leadership development</li>

              </ul>

              <a
                href="#apply"
                className="mt-9 inline-flex rounded-full bg-orange-500 px-7 py-3 font-semibold text-white transition hover:bg-orange-600"
              >
                Become A Team Member
              </a>

            </div>


            {/* VOLUNTEER */}

            <div className="rounded-3xl bg-white p-8 shadow-sm sm:p-10">

              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-orange-500">
                Path Two
              </p>

              <h3 className="mt-4 text-3xl font-bold text-gray-900">
                Volunteer
              </h3>

              <p className="mt-5 leading-8 text-gray-600">
                For those who want to contribute their time,
                skills, and gifts to specific outreaches,
                camp meetings, or programmes.
              </p>

              <ul className="mt-8 space-y-4 text-sm text-gray-600">

                <li>✓ Serve for specific programmes or events</li>
                <li>✓ Receive event-specific briefing</li>
                <li>✓ Use your gifts and available time</li>
                <li>✓ No ongoing membership commitment</li>
                <li>✓ Opportunity to transition into the team</li>

              </ul>

              <a
                href="#apply"
                className="mt-9 inline-flex rounded-full bg-orange-500 px-7 py-3 font-semibold text-white transition hover:bg-orange-600"
              >
                Become A Volunteer
              </a>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          AREAS OF SERVICE
      ===================================================== */}

      <section className="bg-white py-20 sm:py-28">

        <div className="mx-auto max-w-6xl px-6">

          <div className="max-w-3xl">

            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-orange-500">
              Where You Can Serve
            </p>

            <h2 className="mt-5 text-4xl font-bold text-gray-900 sm:text-5xl">
              Your gift has a place.
            </h2>

            <p className="mt-5 leading-8 text-gray-600">
              There are different areas through which people
              contribute to the work of The Refinery International.
              You do not need to fit into one particular mould.
            </p>

          </div>


          <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">

            {departments.map((department, index) => (

              <div
                key={department}
                className="flex items-center gap-4 rounded-2xl border border-gray-200 p-5 transition hover:border-orange-300 hover:bg-orange-50"
              >

                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-orange-100 text-xs font-bold text-orange-600">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <span className="font-medium text-gray-800">
                  {department}
                </span>

              </div>

            ))}

          </div>

        </div>

      </section>


      {/* =====================================================
          EXPECTATIONS
      ===================================================== */}

      <section className="bg-gray-950 py-20 text-white sm:py-28">

        <div className="mx-auto max-w-5xl px-6 text-center">

          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-orange-400">
            Before You Apply
          </p>

          <h2 className="mt-5 text-4xl font-bold sm:text-5xl">
            We are looking for people
            <br />
            who are ready to serve.
          </h2>

          <p className="mx-auto mt-7 max-w-3xl text-lg leading-8 text-gray-400">
            Serving with The Refinery International is more than
            filling a position. It is an opportunity to contribute
            to the spiritual, emotional, and practical development
            of a generation.
          </p>


          <div className="mt-12 grid gap-4 text-left sm:grid-cols-2">

            {[
              "A heart for children and teenagers",
              "A willingness to learn and grow",
              "Reliability and commitment",
              "Respect for leadership and teamwork",
              "A teachable and accountable spirit",
              "A desire to use your gifts for God's purposes",
            ].map((item) => (

              <div
                key={item}
                className="rounded-2xl border border-white/10 bg-white/5 p-5 text-gray-300"
              >
                <span className="mr-3 text-orange-500">✓</span>
                {item}
              </div>

            ))}

          </div>

        </div>

      </section>


      {/* =====================================================
          FINAL CTA
      ===================================================== */}

      <section
        id="apply"
        className="relative overflow-hidden bg-orange-500 py-24 text-center text-white sm:py-32"
      >

        <div className="absolute inset-0 bg-gradient-to-br from-orange-500 via-orange-500 to-amber-400" />

        <div className="relative mx-auto max-w-4xl px-6">

          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-orange-100">
            Your Next Step
          </p>

          <h2 className="mt-5 text-4xl font-bold sm:text-5xl md:text-6xl">
            Ready to serve?
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-orange-50">
            Whether you sense a lasting call to The Refinery International
            or simply want to serve at an upcoming outreach or camp meeting,
            there is a place for you.
          </p>


          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">

            <Link
              href="/apply/team"
              className="rounded-full bg-gray-950 px-8 py-4 font-semibold text-white transition hover:bg-gray-800"
            >
              Join The Team
            </Link>

            <Link
              href="/apply/volunteer"
              className="rounded-full border-2 border-white px-8 py-4 font-semibold text-white transition hover:bg-white hover:text-orange-500"
            >
              Volunteer For An Outreach
            </Link>

          </div>

        </div>

      </section>


      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="bg-gray-950 py-10 text-center text-sm text-gray-500">

        <div className="mx-auto max-w-6xl px-6">

          <Image
            src="/logo.png"
            alt="The Refinery International"
            width={70}
            height={70}
            className="mx-auto mb-4 h-14 w-auto object-contain"
          />

          <p>
            © {new Date().getFullYear()} The Refinery International.
            All rights reserved.
          </p>

          <p className="mt-2 text-gray-600">
            Raising. Refining. Releasing a generation.
          </p>

        </div>

      </footer>

    </main>
  );
}