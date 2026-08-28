export default function Programs() {
  return (
    <section className="bg-orange-50 py-16 sm:py-20 md:py-24">

      <div className="mx-auto max-w-6xl px-6">


        {/* Heading */}
        <div className="mx-auto max-w-3xl text-center">


          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-500 sm:text-sm">
            Our Programs
          </p>


          <h2 className="mt-4 text-3xl font-bold text-gray-900 sm:text-4xl md:text-5xl">

            Creating Experiences Where Children Encounter God

          </h2>


          <p className="mt-5 text-base leading-relaxed text-gray-600 sm:text-lg">

            Through intentional programs and activities, children are
            encouraged to encounter God, grow in His Word, discover their
            gifts, and build meaningful relationships that shape their lives.

          </p>


        </div>







        {/* Program Cards */}
        <div className="mt-10 grid gap-6 md:mt-12 md:grid-cols-2">





          {/* Bible Experiences */}
          <div className="rounded-3xl bg-white p-6 shadow-sm transition hover:-translate-y-2 sm:p-8">


            <div className="text-4xl">
              📖
            </div>


            <h3 className="mt-5 text-xl font-bold text-gray-900 sm:text-2xl">

              Bible Experiences

            </h3>


            <p className="mt-3 text-base leading-relaxed text-gray-600">

              Helping children encounter the truth of God's Word through
              engaging teachings, interactive activities, and practical
              lessons that build faith and character.

            </p>


          </div>






          {/* Creative Expression */}
          <div className="rounded-3xl bg-white p-6 shadow-sm transition hover:-translate-y-2 sm:p-8">


            <div className="text-4xl">
              🎨
            </div>


            <h3 className="mt-5 text-xl font-bold text-gray-900 sm:text-2xl">

              Creative Expression

            </h3>


            <p className="mt-3 text-base leading-relaxed text-gray-600">

              Providing opportunities for children to discover, develop,
              and express their God-given gifts and creativity.

            </p>


          </div>







          {/* Community & Fellowship */}
          <div className="rounded-3xl bg-white p-6 shadow-sm transition hover:-translate-y-2 sm:p-8">


            <div className="text-4xl">
              🤝
            </div>


            <h3 className="mt-5 text-xl font-bold text-gray-900 sm:text-2xl">

              Community & Fellowship

            </h3>


            <p className="mt-3 text-base leading-relaxed text-gray-600">

              Creating a loving and welcoming environment where children
              build friendships, experience belonging, and grow together.

            </p>


          </div>







          {/* Growth & Leadership */}
          <div className="rounded-3xl bg-white p-6 shadow-sm transition hover:-translate-y-2 sm:p-8">


            <div className="text-4xl">
              🌱
            </div>


            <h3 className="mt-5 text-xl font-bold text-gray-900 sm:text-2xl">

              Growth & Leadership

            </h3>


            <p className="mt-3 text-base leading-relaxed text-gray-600">

              Equipping children to become confident, responsible, and
              purpose-driven lights who influence their generation for God.

            </p>


          </div>



        </div>


      </div>


    </section>
  );
}