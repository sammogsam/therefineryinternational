export default function HeartForChildren() {
  return (
    <section className="bg-white py-16 sm:py-20 md:py-24">

      <div className="mx-auto max-w-6xl px-6">


        {/* Heading */}
        <div className="mx-auto max-w-3xl text-center">


          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-500 sm:text-sm">
            Our Heart For Children
          </p>


          <h2 className="mt-4 text-3xl font-bold text-gray-900 sm:text-4xl md:text-5xl">

            Every Child Matters To God

          </h2>


          <p className="mt-5 text-base leading-relaxed text-gray-600 sm:text-lg">

            Every child is precious in the sight of God and carries a
            unique purpose within His plan. At The Refinery International,
            we believe children are not just the future — they are part of
            God's kingdom today.

          </p>


          <p className="mt-4 text-base leading-relaxed text-gray-600 sm:text-lg">

            We are committed to creating spaces where children are loved,
            discipled, and equipped with the truth of God's Word, so they
            can grow with confidence and shine as lights in their world.

          </p>


        </div>







        {/* Cards */}
        <div className="mt-10 grid gap-6 md:mt-12 md:grid-cols-3">



          {/* Seen & Loved */}
          <div className="rounded-3xl border border-orange-100 bg-orange-50 p-6 shadow-sm transition hover:-translate-y-2 sm:p-8">


            <div className="text-4xl">
              ❤️
            </div>


            <h3 className="mt-5 text-xl font-bold text-gray-900 sm:text-2xl">

              Seen & Loved

            </h3>


            <p className="mt-3 text-base leading-relaxed text-gray-600">

              Every child deserves to experience the love of God and know
              that they are valued, accepted, and cared for.

            </p>


          </div>







          {/* Discipled In Truth */}
          <div className="rounded-3xl border border-orange-100 bg-orange-50 p-6 shadow-sm transition hover:-translate-y-2 sm:p-8">


            <div className="text-4xl">
              📖
            </div>


            <h3 className="mt-5 text-xl font-bold text-gray-900 sm:text-2xl">

              Discipled In Truth

            </h3>


            <p className="mt-3 text-base leading-relaxed text-gray-600">

              Children are guided to know God's Word, build their faith,
              and develop a strong foundation in Christ.

            </p>


          </div>








          {/* Refined For Purpose */}
          <div className="rounded-3xl border border-orange-100 bg-orange-50 p-6 shadow-sm transition hover:-translate-y-2 sm:p-8">


            <div className="text-4xl">
              🔥
            </div>


            <h3 className="mt-5 text-xl font-bold text-gray-900 sm:text-2xl">

              Refined For Purpose

            </h3>


            <p className="mt-3 text-base leading-relaxed text-gray-600">

              Children are equipped to discover their gifts, walk in
              purpose, and become arrows in God's hands.

            </p>


          </div>



        </div>


      </div>


    </section>
  );
}