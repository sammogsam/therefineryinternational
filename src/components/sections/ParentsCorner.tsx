export default function ParentsCorner() {
  return (
    <section className="bg-orange-50 py-24">
      <div className="mx-auto max-w-6xl px-6">

        <div className="grid items-center gap-12 md:grid-cols-2">

          <div className="flex h-[420px] items-center justify-center rounded-3xl bg-white shadow-sm">
            <p className="text-center text-orange-500">
              Parent & Child Image
              <br />
              Placeholder
            </p>
          </div>


          <div>

            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-orange-500">
              Parent's Corner
            </p>


            <h2 className="mt-4 text-4xl font-bold text-gray-900 md:text-5xl">
              Partnering With Parents
              <br />
              To Raise Lights And Arrows
            </h2>


            <p className="mt-6 text-lg leading-relaxed text-gray-600">
              At The Refinery International, we believe children flourish
              when the ministry and the home work together. We partner with
              parents to nurture children spiritually, emotionally, and
              personally.
            </p>


            <div className="mt-8 space-y-5">


              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  🤝 Partnership
                </h3>

                <p className="text-gray-600">
                  Working together with parents to support every child's growth.
                </p>
              </div>


              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  🛡️ Safe Environment
                </h3>

                <p className="text-gray-600">
                  Creating a loving and secure space where children can thrive.
                </p>
              </div>


              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  🌱 Spiritual Growth
                </h3>

                <p className="text-gray-600">
                  Helping children build a genuine relationship with God.
                </p>
              </div>


            </div>


          </div>

        </div>

      </div>
    </section>
  );
}