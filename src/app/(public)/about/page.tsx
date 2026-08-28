export default function About() {
  return (
    <main className="bg-white">
      {/* Hero */}
      <section className="bg-orange-500 py-16 text-center text-white sm:py-20 md:py-24">
        <div className="mx-auto max-w-5xl px-6">
          <h1 className="text-4xl font-bold sm:text-5xl md:text-6xl">
            About The Refinery
          </h1>
          <p className="mx-auto mt-5 max-w-3xl text-base leading-relaxed text-orange-50 sm:mt-6 sm:text-lg">
            Raising and refining a generation of children who encounter God,
            discover purpose, and shine as lights in their world.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="bg-white py-16 sm:py-20 md:py-24">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="text-3xl font-bold text-gray-950 sm:text-4xl">
            Our Story
          </h2>
          <div className="mt-6 space-y-5 text-base leading-relaxed text-gray-700 sm:text-lg">
            <p>
              The Refinery International was established in 2025 by{" "}
              <strong className="font-semibold text-gray-900">
                Samuel Damilola Mogaji
              </strong>
              , in response to a divine mandate to take the gospel of Jesus Christ and its
              power to children and teenagers across the earth.
            </p>
            <p>
              We are a faith-based outreach initiative committed to reaching
              young people at the most formative stages of their lives with
              the truth, purpose, and direction found in God.
            </p>
            <p>
              Our desire is that no child will perish, but that every child
              will encounter God, grow in His Word, discover purpose, and
              shine as a light while influencing others around them.
            </p>
          </div>
        </div>
      </section>

      {/* Biblical Foundation */}
      <section className="bg-orange-50/70 py-16 text-center sm:py-20 md:py-24">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="text-3xl font-bold text-gray-950 sm:text-4xl">
            Our Biblical Foundation
          </h2>
          <p className="mx-auto mt-6 max-w-3xl text-xl font-medium italic leading-relaxed text-gray-800 sm:text-2xl">
            &ldquo;Suffer the little children to come unto me, and forbid them
            not: for of such is the kingdom of God.&rdquo;
          </p>
          <p className="mt-4 font-bold text-orange-600 tracking-wide">
            Mark 10:14 (KJV)
          </p>
        </div>
      </section>

      {/* Vision */}
      <section className="bg-white py-16 sm:py-20 md:py-24">
        <div className="mx-auto max-w-5xl px-6">
          <div className="rounded-3xl border border-gray-100 bg-gradient-to-br from-orange-500/5 via-white to-orange-500/10 p-8 sm:p-12 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-widest text-orange-600">
              Where We Are Headed
            </span>
            <h2 className="mt-2 text-3xl font-bold text-gray-950 sm:text-4xl">
              Our Vision
            </h2>
            <p className="mt-5 text-lg leading-relaxed font-medium text-gray-800 sm:text-xl">
              To raise and refine a generation of children who are strong in
              the Lord, grounded in love, and shaped as arrows in God&apos;s hands,
              shining as light in their world.
            </p>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="bg-orange-50/60 py-16 sm:py-20 md:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-orange-600">
              Our Calling & Purpose
            </span>
            <h2 className="mt-2 text-3xl font-bold text-gray-950 sm:text-4xl">
              Our Mission
            </h2>
          </div>

          <div className="mt-10 grid gap-6 md:mt-12 md:grid-cols-3">
            {[
              {
                step: "01",
                tag: "Reach",
                description:
                  "To reach children with the gospel of Christ and equip them to live as light in their homes, schools, and communities.",
              },
              {
                step: "02",
                tag: "Teach",
                description:
                  "To teach and disciple children through engaging, age-appropriate programmes that build their faith in God, ground them in love, and develop godly character.",
              },
              {
                step: "03",
                tag: "Nurture",
                description:
                  "To nurture and refine children into spiritually strong, purpose-driven individuals who positively influence their generation.",
              },
            ].map((mission) => (
              <div
                key={mission.tag}
                className="group relative flex flex-col justify-between rounded-3xl border border-gray-200/80 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-orange-300 hover:shadow-xl sm:p-8"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="inline-block rounded-xl bg-orange-100 px-3.5 py-1.5 text-sm font-bold text-orange-700">
                      {mission.tag}
                    </span>
                    <span className="text-xs font-black tracking-widest text-gray-300 group-hover:text-orange-400 transition-colors">
                      {mission.step}
                    </span>
                  </div>

                  <h3 className="mt-5 text-2xl font-bold text-gray-950">
                    {mission.tag}
                  </h3>

                  <p className="mt-3 text-base leading-relaxed text-gray-700">
                    {mission.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-white py-16 sm:py-20 md:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-orange-600">
              Guiding Principles
            </span>
            <h2 className="mt-2 text-3xl font-bold text-gray-950 sm:text-4xl">
              Our Core Values
            </h2>
          </div>

          <div className="mt-10 grid gap-6 md:mt-12 md:grid-cols-4">
            {[
              ["❤️", "Love", "Building lives on a foundation of genuine love."],
              ["📖", "Truth", "Teaching sound and life-transforming biblical principles."],
              ["🎯", "Purpose", "Helping children discover their purpose and live intentionally."],
              ["⭐", "Excellence", "Delivering impactful and well-structured programmes."],
            ].map((value) => (
              <div
                key={value[1]}
                className="flex flex-col items-center rounded-3xl border border-gray-200/70 bg-orange-50/50 p-6 text-center transition-all duration-300 hover:bg-orange-50 hover:shadow-md sm:p-8"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm">
                  {value[0]}
                </div>

                <h3 className="mt-5 text-xl font-bold text-gray-950">
                  {value[1]}
                </h3>

                <p className="mt-2.5 text-sm leading-relaxed text-gray-600">
                  {value[2]}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}