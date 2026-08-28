import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Refinery International",
  description:
    "Where we experience the DIVINE, and are indeed Refined.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}