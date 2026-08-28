export default function CTA() {
  return (
    <section className="bg-orange-500 py-24">
      <div className="mx-auto max-w-5xl px-6 text-center">

        <h2 className="text-4xl font-bold text-white md:text-5xl">
          Join The Refinery
        </h2>


        <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-orange-50">
          Be part of a community raising children who encounter God,
          discover their identity in Christ, and walk boldly in purpose.
        </p>


        <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">


          <button className="rounded-full bg-white px-8 py-4 font-semibold text-orange-500 transition hover:bg-orange-50">
            Register Your Child
          </button>


          <button className="rounded-full border border-white px-8 py-4 font-semibold text-white transition hover:bg-white hover:text-orange-500">
            Contact Us
          </button>


        </div>

      </div>
    </section>
  );
}