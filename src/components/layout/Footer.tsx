export default function Footer() {
  return (
    <footer className="border-t border-gray-800 bg-black text-white">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-3">

          {/* Ministry Identity */}
          <div>
            <a href="/" className="inline-flex items-center">
              <img
                src="/logo.png"
                alt="The Refinery International"
                className="h-24 w-auto object-contain"
              />
            </a>
            <p className="mt-5 max-w-sm text-gray-400">
              Raising children as lights and arrows — helping them
              encounter God, discover their identity in Christ,
              and grow into their purpose.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <div className="mt-4 flex flex-col gap-3 text-gray-400">
              <a href="/" className="transition hover:text-orange-400">Home</a>
              <a href="/about" className="transition hover:text-orange-400">About Us</a>
              <a href="/programs" className="transition hover:text-orange-400">Programs</a>
              <a href="/events" className="transition hover:text-orange-400">Events</a>
              <a href="/support" className="transition hover:text-orange-400">Support</a>
              <a href="/partner" className="transition hover:text-orange-400">Partner With Us</a>
              <a href="/join-team" className="transition hover:text-orange-400">Join Us</a>
              <a href="/socials" className="transition hover:text-orange-400">Socials</a>
              <a href="/contact" className="transition hover:text-orange-400">Contact</a>
            </div>
          </div>

          {/* Social Links (4 Channels) */}
          <div>
            <h3 className="text-lg font-semibold">Follow The Refinery International</h3>
            <p className="mt-4 text-gray-400">
              Stay connected with what God is doing through
              The Refinery International's programmes,
              outreaches, and stories.
            </p>

            <div className="mt-6 flex flex-wrap gap-3.5">
              <a
                href="https://instagram.com/therefineryintl"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500 text-xs font-semibold text-white transition hover:bg-orange-600"
              >
                IG
              </a>

              <a
                href="https://chat.whatsapp.com/your-group-invite"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500 text-xs font-semibold text-white transition hover:bg-orange-600"
              >
                WA
              </a>

              <a
                href="https://tiktok.com/@therefineryintl"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500 text-xs font-semibold text-white transition hover:bg-orange-600"
              >
                TT
              </a>

              <a
                href="https://facebook.com/therefineryintl"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500 text-xs font-semibold text-white transition hover:bg-orange-600"
              >
                FB
              </a>
            </div>
          </div>

        </div>

        {/* Copyright */}
        <div className="mt-12 border-t border-gray-800 pt-8 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} The Refinery International. All rights reserved.
        </div>
      </div>
    </footer>
  );
}