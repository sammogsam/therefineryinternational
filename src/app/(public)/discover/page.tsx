export default function Discover() {
  return (
    <main>


      {/* Hero */}
      <section className="bg-orange-500 py-16 text-center text-white sm:py-20 md:py-24">

        <div className="mx-auto max-w-5xl px-6">


          <h1 className="text-4xl font-bold sm:text-5xl md:text-6xl">
            Explore The Refinery
          </h1>


          <p className="mx-auto mt-5 max-w-3xl text-base leading-relaxed text-orange-50 sm:text-lg">

            Discover the heart, vision, and mission behind a ministry
            committed to raising children as lights and arrows.

          </p>


        </div>

      </section>







      {/* Welcome */}
      <section className="bg-white py-16 sm:py-20 md:py-24">

        <div className="mx-auto max-w-5xl px-6 text-center">


          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-500 sm:text-sm">
            Welcome To The Refinery
          </p>


          <h2 className="mt-4 text-3xl font-bold text-gray-900 sm:text-4xl">

            Where Children Encounter God

          </h2>


          <p className="mt-5 text-base leading-relaxed text-gray-600 sm:text-lg">

            The Refinery International is a children's ministry committed
            to reaching children with the gospel of Jesus Christ,
            helping them discover their identity in Christ, and equipping
            them to shine as lights in their generation.

          </p>


        </div>

      </section>








      {/* Heart */}
      <section className="bg-orange-50 py-16 sm:py-20 md:py-24">

        <div className="mx-auto max-w-6xl px-6">


          <div className="text-center">


            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">

              Our Heart For Children

            </h2>


            <p className="mx-auto mt-5 max-w-3xl text-base leading-relaxed text-gray-600 sm:text-lg">

              We believe every child is precious to God and carries a
              unique expression of His purpose. Our desire is to create
              environments where children are loved, discipled, and
              equipped to become all God has called them to be.

            </p>


          </div>







          <div className="mt-10 grid gap-6 md:grid-cols-3">


            {[
              [
                "❤️",
                "Loved",
                "Every child is seen, valued, and welcomed."
              ],
              [
                "📖",
                "Rooted",
                "Children are grounded in God's Word and truth."
              ],
              [
                "🔥",
                "Refined",
                "Children are shaped into vessels for God's purpose."
              ]
            ].map((item) => (

              <div
                key={item[1]}
                className="rounded-3xl bg-white p-6 shadow-sm sm:p-8"
              >

                <div className="text-4xl">
                  {item[0]}
                </div>


                <h3 className="mt-5 text-xl font-bold text-gray-900">
                  {item[1]}
                </h3>


                <p className="mt-3 text-gray-600">
                  {item[2]}
                </p>


              </div>

            ))}


          </div>


        </div>

      </section>








      {/* Mandate */}
      <section className="bg-white py-16 sm:py-20 md:py-24">


        <div className="mx-auto max-w-5xl px-6 text-center">


          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">

            Raising Children As Lights And Arrows

          </h2>


          <p className="mt-5 text-base leading-relaxed text-gray-600 sm:text-lg">

            Through the process of refinement, children are shaped into
            vessels who encounter God, discover their identity in Christ,
            and live with purpose for His Kingdom.

          </p>


        </div>


      </section>








      {/* Action */}
      <section className="bg-orange-500 py-16 text-center text-white sm:py-20">


        <div className="mx-auto max-w-4xl px-6">


          <h2 className="text-3xl font-bold sm:text-4xl">

            Be Part Of The Mission

          </h2>


          <p className="mt-5 text-orange-50">

            Join us in raising a generation that knows God and shines
            as light in their world.

          </p>



          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">


            <a
              href="/join-team"
              className="rounded-full bg-white px-8 py-4 font-semibold text-orange-500 transition hover:bg-orange-50"
            >
              Join The Team
            </a>



            <a
              href="/contact"
              className="rounded-full border border-white px-8 py-4 font-semibold text-white transition hover:bg-white hover:text-orange-500"
            >
              Connect With Us
            </a>


          </div>


        </div>


      </section>


    </main>
  );
}