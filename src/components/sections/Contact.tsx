export default function Contact() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-6xl px-6">

        <div className="text-center">

          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-orange-500">
            Contact Us
          </p>

          <h2 className="mt-4 text-4xl font-bold text-gray-900 md:text-5xl">
            Let's Connect
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
            We would love to hear from you and welcome you into
            The Refinery International community.
          </p>

        </div>


        <div className="mt-16 grid gap-8 md:grid-cols-3">


          <div className="rounded-3xl bg-orange-50 p-8 text-center">

            <div className="text-3xl">
              📍
            </div>

            <h3 className="mt-4 text-xl font-bold text-gray-900">
              Location
            </h3>

            <p className="mt-2 text-gray-600">
              Your ministry location here
            </p>

          </div>



          <div className="rounded-3xl bg-orange-50 p-8 text-center">

            <div className="text-3xl">
              📞
            </div>

            <h3 className="mt-4 text-xl font-bold text-gray-900">
              Contact
            </h3>

            <p className="mt-2 text-gray-600">
              +234 XXX XXX XXXX
            </p>

          </div>



          <div className="rounded-3xl bg-orange-50 p-8 text-center">

            <div className="text-3xl">
              ✉️
            </div>

            <h3 className="mt-4 text-xl font-bold text-gray-900">
              Email
            </h3>

            <p className="mt-2 text-gray-600">
              info@example.com
            </p>

          </div>


        </div>


      </div>
    </section>
  );
}