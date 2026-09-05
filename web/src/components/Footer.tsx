"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, Check, ArrowRight } from "lucide-react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }

    setStatus("loading");
    // Instantaneous clean feedback state
    setTimeout(() => {
      setStatus("success");
      setMessage("Thank you for subscribing! Exclusive stay discounts and travel guides will be sent to your inbox.");
      setEmail("");
    }, 600);
  };

  return (
    <footer className="relative bg-[#0D76BD] text-white pt-14 pb-10 border-t border-white/15 overflow-hidden">
      {/* Africa Dotted Map Background - Highly Visible */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Image
          src="/africa-dotted-map.png"
          alt="Africa continent dotted map"
          fill
          priority
          className="object-cover object-center"
        />
        {/* Very subtle scrim to keep the dotted map prominent and vibrant */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/30" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Newsletter Subscription Row - Translucent Frosted Glass without Border */}
        <div className="rounded-xs p-6 sm:p-8 bg-black/25 dark:bg-black/35 backdrop-blur-md border-0 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="space-y-1.5 max-w-lg">
            <span className="text-blue-200 text-xs font-semibold uppercase tracking-wider block">
              Travel Insider & Exclusive Perks
            </span>
            <h3 className="text-xl sm:text-2xl font-medium text-white tracking-tight">
              Stay ahead with curated travel deals & new lodgings
            </h3>
            <p className="text-xs sm:text-sm text-blue-50 font-normal leading-relaxed">
              Get notified of newly vetted boutique hotels, secret weekend getaways, and seasonal discounts in Zimbabwe. No spam, ever.
            </p>
          </div>

          <div className="w-full lg:flex-1 lg:max-w-xl">
            {status === "success" ? (
              <div className="flex items-center gap-3 p-3.5 rounded-xs bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-medium">
                <Check className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>{message}</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="flex flex-col sm:flex-row items-stretch gap-2.5">
                  <div className="relative flex-1">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-200" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (status === "error") setStatus("idle");
                      }}
                      placeholder="Enter your email address"
                      className="w-full pl-10 pr-4 py-3.5 text-xs sm:text-sm bg-black/25 hover:bg-black/30 focus:bg-black/35 border border-white/20 focus:border-white/50 rounded-xs text-white placeholder:text-blue-100/75 outline-none focus:outline-none focus:ring-0 transition-colors"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="px-7 py-3.5 bg-[#0052CC] hover:bg-[#0041A3] active:scale-95 text-white text-xs sm:text-sm font-semibold rounded-xs flex items-center justify-center gap-2 transition-all duration-150 cursor-pointer whitespace-nowrap shadow-sm"
                  >
                    <span>{status === "loading" ? "Subscribing..." : "Subscribe"}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                {status === "error" && (
                  <p className="text-[11px] text-rose-300 font-normal pl-1">{message}</p>
                )}
                <p className="text-[11px] text-blue-100 font-normal pl-1">
                  Your email is securely stored. Unsubscribe at any time.
                </p>
              </form>
            )}
          </div>
        </div>

        {/* Quick Links & Brand Navigation */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 pt-4 border-t border-white/15 text-xs">
          <div className="space-y-3">
            <h4 className="font-semibold text-white tracking-wider uppercase text-[11px]">Destinations</h4>
            <ul className="space-y-2 text-blue-100 font-normal">
              <li><Link href="/search?city=Harare" className="hover:text-white transition-colors">Harare Lodgings</Link></li>
              <li><Link href="/search?city=Victoria+Falls" className="hover:text-white transition-colors">Victoria Falls Lodges</Link></li>
              <li><Link href="/search?city=Bulawayo" className="hover:text-white transition-colors">Bulawayo Guesthouses</Link></li>
              <li><Link href="/search" className="hover:text-white transition-colors">All Regional Stays</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-white tracking-wider uppercase text-[11px]">Guest Services</h4>
            <ul className="space-y-2 text-blue-100 font-normal">
              <li><Link href="/my-bookings" className="hover:text-white transition-colors">My Bookings</Link></li>
              <li><Link href="/search" className="hover:text-white transition-colors">Instant E-Vouchers</Link></li>
              <li><Link href="/profile" className="hover:text-white transition-colors">Account Profile</Link></li>
              <li><Link href="/settings" className="hover:text-white transition-colors">Guest Preferences</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-white tracking-wider uppercase text-[11px]">For Hosts & Lodges</h4>
            <ul className="space-y-2 text-blue-100 font-normal">
              <li><span className="text-blue-200">List Your Property</span></li>
              <li><span className="text-blue-200">Host Dashboard</span></li>
              <li><span className="text-blue-200">Inventory Management</span></li>
              <li><span className="text-blue-200">Host Guidelines</span></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-white tracking-wider uppercase text-[11px]">Trust & Legal</h4>
            <ul className="space-y-2 text-blue-100 font-normal">
              <li><span className="hover:text-white cursor-pointer transition-colors">Terms of Service</span></li>
              <li><span className="hover:text-white cursor-pointer transition-colors">Privacy Notice</span></li>
              <li><span className="hover:text-white cursor-pointer transition-colors">Cancellation Policies</span></li>
              <li><span className="hover:text-white cursor-pointer transition-colors">Local Support & Helpdesk</span></li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright Row */}
        <div className="pt-8 border-t border-white/15 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-normal">
          <p className="text-blue-200">© 2026 BookItNow Lodging Platform. All rights reserved.</p>
          <div className="flex gap-6 text-blue-200">
            <span className="hover:text-white cursor-pointer transition-colors">Terms & Policies</span>
            <span className="hover:text-white cursor-pointer transition-colors">Privacy Notice</span>
            <span className="hover:text-white cursor-pointer transition-colors">Host Support</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
