import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Refinery International",
  description:
    "Join The Refinery International as a team member or volunteer and serve in our outreaches, camp meetings, and programmes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}