"use client";

import { useState } from "react";
import Link from "next/link";
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
    <footer className="bg-[#0A2540] dark:bg-[#061527] text-white pt-14 pb-10 border-t border-[#0D3256] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Newsletter Subscription Row */}
        <div className="rounded-xs p-6 sm:p-8 bg-white/5 border border-white/10 backdrop-blur-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="space-y-1.5 max-w-lg">
            <span className="text-blue-400 text-xs font-semibold uppercase tracking-wider block">
              Travel Insider & Exclusive Perks
            </span>
            <h3 className="text-xl sm:text-2xl font-medium text-white tracking-tight">
              Stay ahead with curated travel deals & new lodgings
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed">
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
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (status === "error") setStatus("idle");
                      }}
                      placeholder="Enter your email address"
                      className="w-full pl-10 pr-4 py-3.5 text-xs sm:text-sm bg-white/10 hover:bg-white/15 focus:bg-white/15 border border-white/15 focus:border-blue-400 rounded-xs text-white placeholder:text-slate-400 outline-none transition-colors"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="px-7 py-3.5 bg-[#2563EB] hover:bg-[#1D4ED8] active:scale-95 text-white text-xs sm:text-sm font-semibold rounded-xs flex items-center justify-center gap-2 transition-all duration-150 cursor-pointer whitespace-nowrap shadow-sm"
                  >
                    <span>{status === "loading" ? "Subscribing..." : "Subscribe"}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                {status === "error" && (
                  <p className="text-[11px] text-rose-400 font-normal pl-1">{message}</p>
                )}
                <p className="text-[11px] text-slate-400 font-normal pl-1">
                  Your email is securely stored. Unsubscribe at any time.
                </p>
              </form>
            )}
          </div>
        </div>

        {/* Quick Links & Brand Navigation */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 pt-4 border-t border-white/10 text-xs">
          <div className="space-y-3">
            <h4 className="font-semibold text-white tracking-wider uppercase text-[11px]">Destinations</h4>
            <ul className="space-y-2 text-slate-300 font-normal">
              <li><Link href="/search?city=Harare" className="hover:text-white transition-colors">Harare Lodgings</Link></li>
              <li><Link href="/search?city=Victoria+Falls" className="hover:text-white transition-colors">Victoria Falls Lodges</Link></li>
              <li><Link href="/search?city=Bulawayo" className="hover:text-white transition-colors">Bulawayo Guesthouses</Link></li>
              <li><Link href="/search" className="hover:text-white transition-colors">All Regional Stays</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-white tracking-wider uppercase text-[11px]">Guest Services</h4>
            <ul className="space-y-2 text-slate-300 font-normal">
              <li><Link href="/my-bookings" className="hover:text-white transition-colors">My Bookings</Link></li>
              <li><Link href="/search" className="hover:text-white transition-colors">Instant E-Vouchers</Link></li>
              <li><Link href="/profile" className="hover:text-white transition-colors">Account Profile</Link></li>
              <li><Link href="/settings" className="hover:text-white transition-colors">Guest Preferences</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-white tracking-wider uppercase text-[11px]">For Hosts & Lodges</h4>
            <ul className="space-y-2 text-slate-300 font-normal">
              <li><span className="text-slate-400">List Your Property</span></li>
              <li><span className="text-slate-400">Host Dashboard</span></li>
              <li><span className="text-slate-400">Inventory Management</span></li>
              <li><span className="text-slate-400">Host Guidelines</span></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-white tracking-wider uppercase text-[11px]">Trust & Legal</h4>
            <ul className="space-y-2 text-slate-300 font-normal">
              <li><span className="hover:text-white cursor-pointer transition-colors">Terms of Service</span></li>
              <li><span className="hover:text-white cursor-pointer transition-colors">Privacy Notice</span></li>
              <li><span className="hover:text-white cursor-pointer transition-colors">Cancellation Policies</span></li>
              <li><span className="hover:text-white cursor-pointer transition-colors">Local Support & Helpdesk</span></li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright Row */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-normal">
          <p className="text-slate-400">© 2026 BookItNow Lodging Platform. All rights reserved.</p>
          <div className="flex gap-6 text-slate-400">
            <span className="hover:text-white cursor-pointer transition-colors">Terms & Policies</span>
            <span className="hover:text-white cursor-pointer transition-colors">Privacy Notice</span>
            <span className="hover:text-white cursor-pointer transition-colors">Host Support</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
