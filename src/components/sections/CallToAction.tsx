export default function CallToAction() {
  return (
    <section className="relative overflow-hidden bg-orange-500 py-16 text-white sm:py-20 md:py-24">


      {/* Soft glow */}
      <div className="absolute -right-40 -top-40 h-72 w-72 rounded-full bg-white opacity-10 blur-3xl sm:h-96 sm:w-96"></div>


      <div className="absolute -bottom-40 -left-40 h-72 w-72 rounded-full bg-white opacity-10 blur-3xl sm:h-96 sm:w-96"></div>





      <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">


        <h2 className="text-3xl font-bold sm:text-4xl md:text-5xl">

          Join The Mission

        </h2>





        <p className="mx-auto mt-5 max-w-3xl text-base leading-relaxed text-orange-50 sm:text-lg">

          Together, we can raise a generation that knows God,
          walks in purpose, and shines as light in their world.

        </p>





        <div className="mt-8 flex flex-col justify-center gap-4 sm:mt-10 sm:flex-row">


          <a
            href="/join-team"
            className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-orange-500 transition hover:bg-orange-50 sm:px-8 sm:py-4 sm:text-base"
          >

            Join The Team

          </a>






          <a
            href="/contact"
            className="rounded-full border border-white px-6 py-3 text-sm font-semibold text-white transition hover:bg-white hover:text-orange-500 sm:px-8 sm:py-4 sm:text-base"
          >

            Invite Us

          </a>


        </div>


      </div>


    </section>
  );
}