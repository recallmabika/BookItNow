"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ShellLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // For executive back-office consoles (/admin and /host/inventory),
  // they provide their own dedicated full-height sidebar and top bars.
  const isDashboardRoute =
    pathname?.startsWith("/admin") || pathname?.startsWith("/host/inventory");

  if (isDashboardRoute) {
    return (
      <main className="flex-1 min-h-screen bg-white dark:bg-[#070B14] transition-colors duration-200">
        {children}
      </main>
    );
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-white dark:bg-[#0B0F19] transition-colors duration-200">
        {children}
      </main>
      <Footer />
    </>
  );
}
