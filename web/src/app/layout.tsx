import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import "flatpickr/dist/flatpickr.min.css";
import Navbar from "@/components/Navbar";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-jakarta",
  display: "swap",
});

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
    <html lang="en" className={jakarta.variable}>
      <body className="min-h-screen flex flex-col bg-white text-gray-900 font-sans antialiased selection:bg-[#E8F5E9] selection:text-[#0F5132]">
        <Navbar />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-gray-200/70 bg-gray-50/50 py-8 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500 font-normal">
            <p>© 2026 BookItNow Lodging Platform. All rights reserved.</p>
            <div className="flex gap-6">
              <span className="hover:text-[#0F5132] cursor-pointer transition-colors">Terms & Policies</span>
              <span className="hover:text-[#0F5132] cursor-pointer transition-colors">Privacy Notice</span>
              <span className="hover:text-[#0F5132] cursor-pointer transition-colors">Host Support</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
