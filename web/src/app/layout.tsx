import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import "flatpickr/dist/flatpickr.min.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";
import ShellLayout from "@/components/ShellLayout";

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
        <AuthProvider>
          <ThemeProvider>
            <ShellLayout>{children}</ShellLayout>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
