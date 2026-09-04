import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "BookItNow — Lodging & Stays Marketplace",
  description: "Find verified hotels, lodges, and guesthouses with instant booking, transparent pricing, and zero hidden fees.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-parchment text-ink antialiased">
        <Navbar />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-slate-subtle bg-parchment-light py-10 mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-muted">
            <p>© 2026 BookItNow Lodging Platform. All rights reserved.</p>
            <div className="flex gap-6">
              <span className="hover:text-deep-teal cursor-pointer">Terms & Policies</span>
              <span className="hover:text-deep-teal cursor-pointer">Privacy Notice</span>
              <span className="hover:text-deep-teal cursor-pointer">Host Support</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
