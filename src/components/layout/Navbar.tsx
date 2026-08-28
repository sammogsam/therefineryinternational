"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Programs", href: "/programs" },
    { name: "Events", href: "/events" },
    { name: "Support", href: "/support" },
    { name: "Partner", href: "/partner" },
    { name: "Gallery", href: "/gallery" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-slate-950 via-orange-950 to-slate-950 text-white shadow-md backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3 sm:px-8 sm:py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center" onClick={() => setOpen(false)}>
          <Image
            src="/logo.png"
            alt="The Refinery International"
            width={160}
            height={60}
            className="h-12 w-auto object-contain sm:h-14"
            priority
          />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden items-center gap-6 font-medium md:flex lg:gap-7">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm transition-colors ${
                  isActive
                    ? "font-bold text-orange-400"
                    : "text-slate-200 hover:text-orange-300"
                }`}
              >
                {link.name}
              </Link>
            );
          })}

          <Link
            href="/join-team"
            className="rounded-full bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600"
          >
            Join Us
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-label="Toggle navigation menu"
          aria-expanded={open}
          className="rounded-lg p-2 text-white hover:bg-slate-800 md:hidden"
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {open && (
        <div className="border-t border-slate-800 bg-slate-950/95 px-6 py-6 backdrop-blur-lg md:hidden">
          <div className="flex flex-col gap-4 font-medium text-white">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`text-base transition-colors ${
                    isActive ? "font-bold text-orange-400" : "hover:text-orange-300"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
            <Link
              href="/join-team"
              onClick={() => setOpen(false)}
              className="mt-2 w-full rounded-full bg-orange-500 px-6 py-3 text-center font-semibold text-white transition hover:bg-orange-600"
            >
              Join Us
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}