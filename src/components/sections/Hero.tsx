export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gray-950">
      {/* Divine glow / refining fire atmosphere */}
      <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-orange-500 opacity-30 blur-3xl md:h-96 md:w-96"></div>
      <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-orange-400 opacity-20 blur-3xl md:h-96 md:w-96"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-950/40 to-gray-950"></div>

      <div className="relative z-10 mx-auto max-w-5xl px-6 py-24 text-center sm:py-32 md:py-40">
        <p className="mb-5 text-xs font-semibold uppercase tracking-[0.3em] text-orange-400 sm:text-sm">
          A Place Where Children Encounter God
        </p>

        <h1 className="text-4xl font-bold leading-tight text-white sm:text-5xl md:text-7xl">
          Where We Experience
          <br />
          the <span className="text-orange-400">DIVINE</span>,
          <br />
          and are indeed <span className="text-orange-400">Refined</span>.
        </h1>

        <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-gray-300 sm:text-lg">
          The Refinery International is a children's ministry committed to
          raising children as lights and arrows — helping them encounter God,
          discover their identity in Christ, and grow into their purpose.
        </p>

        {/* 4 Distinct Aesthetic Buttons */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          
          {/* 1. Explore (Solid Fire Glow) */}
          <a
            href="/explore"
            className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-orange-500/25 transition duration-300 hover:scale-105 hover:from-orange-600 hover:to-amber-600 sm:text-base"
          >
            Explore The Refinery
          </a>

          {/* 2. Upcoming Events (Warm Amber Outline) */}
          <a
            href="/events"
            className="group inline-flex items-center justify-center rounded-full border border-orange-400/80 bg-orange-950/30 px-7 py-3.5 text-sm font-semibold text-orange-300 backdrop-blur-md transition duration-300 hover:border-orange-300 hover:bg-orange-500/20 hover:text-white sm:text-base"
          >
            Upcoming Events
          </a>

          {/* 3. Support Us (Heart/Seed Frosted Glass) */}
          <a
            href="/support"
            className="group inline-flex items-center justify-center rounded-full border border-slate-700 bg-slate-900/80 px-7 py-3.5 text-sm font-semibold text-slate-200 backdrop-blur-md transition duration-300 hover:border-amber-400 hover:bg-slate-800 hover:text-amber-300 sm:text-base"
          >
            Support Us
          </a>

          {/* 4. Partner With Us (Crisp Clean Pearl Pill) */}
          <a
            href="/partner"
            className="group inline-flex items-center justify-center rounded-full bg-white px-7 py-3.5 text-sm font-bold text-slate-950 shadow-md transition duration-300 hover:scale-105 hover:bg-orange-100 hover:text-orange-900 sm:text-base"
          >
            Partner With Us
          </a>

        </div>
      </div>
    </section>
  );
}