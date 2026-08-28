export default function Mandate() {
  return (
    <section className="bg-white py-16 sm:py-20 md:py-24">

      <div className="mx-auto max-w-6xl px-6">


        {/* Heading */}
        <div className="mx-auto max-w-3xl text-center">


          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-500 sm:text-sm">
            Our Mandate
          </p>


          <h2 className="mt-4 text-3xl font-bold text-gray-900 sm:text-4xl md:text-5xl">
            Raising Children as Lights and Arrows
          </h2>


          <p className="mt-5 text-base leading-relaxed text-gray-600 sm:text-lg">

            Through the process of refinement, children are shaped into
            vessels who encounter God, discover their identity in Christ,
            and live with purpose for His Kingdom.

          </p>


        </div>






        {/* Cards */}
        <div className="mt-10 grid gap-6 md:mt-12 md:grid-cols-3">


          {/* Encounter God */}
          <div className="rounded-3xl border border-orange-100 bg-orange-50 p-6 shadow-sm transition hover:-translate-y-2 sm:p-8">


            <div className="text-4xl sm:text-5xl">
              🔥
            </div>


            <h3 className="mt-5 text-xl font-bold text-gray-900 sm:text-2xl">
              Encounter God
            </h3>


            <p className="mt-3 text-base leading-relaxed text-gray-600">

              Creating an environment where children experience God's
              love, presence, and truth personally.

            </p>


          </div>







          {/* Discover Identity */}
          <div className="rounded-3xl border border-orange-100 bg-orange-50 p-6 shadow-sm transition hover:-translate-y-2 sm:p-8">


            <div className="text-4xl sm:text-5xl">
              ✨
            </div>


            <h3 className="mt-5 text-xl font-bold text-gray-900 sm:text-2xl">
              Discover Identity
            </h3>


            <p className="mt-3 text-base leading-relaxed text-gray-600">

              Helping children understand who they are in Christ and
              the unique purpose God has placed within them.

            </p>


          </div>







          {/* Live Purpose */}
          <div className="rounded-3xl border border-orange-100 bg-orange-50 p-6 shadow-sm transition hover:-translate-y-2 sm:p-8">


            <div className="text-4xl sm:text-5xl">
              🎯
            </div>


            <h3 className="mt-5 text-xl font-bold text-gray-900 sm:text-2xl">
              Live Purpose
            </h3>


            <p className="mt-3 text-base leading-relaxed text-gray-600">

              Equipping children to become lights in their generation
              and impact the world around them.

            </p>


          </div>



        </div>


      </div>


    </section>
  );
}