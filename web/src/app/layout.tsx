import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import "flatpickr/dist/flatpickr.min.css";
import Navbar from "@/components/Navbar";
import { ThemeProvider } from "@/context/ThemeContext";

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
    <html lang="en" className={jakarta.variable} suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-white dark:bg-[#0B0F19] text-gray-900 dark:text-gray-100 font-sans antialiased selection:bg-[#EFF6FF] selection:text-[#2563EB] transition-colors duration-200">
        <ThemeProvider>
          <Navbar />
          <main className="flex-1 bg-white dark:bg-[#0B0F19] transition-colors duration-200">{children}</main>
          <footer className="bg-[#0A2540] dark:bg-[#061527] text-white py-10 mt-16 border-t border-[#0D3256] transition-colors duration-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-normal">
            <p className="text-slate-300">© 2026 BookItNow Lodging Platform. All rights reserved.</p>
            <div className="flex gap-6 text-slate-300">
              <span className="hover:text-white cursor-pointer transition-colors">Terms & Policies</span>
              <span className="hover:text-white cursor-pointer transition-colors">Privacy Notice</span>
              <span className="hover:text-white cursor-pointer transition-colors">Host Support</span>
            </div>
          </div>
        </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
