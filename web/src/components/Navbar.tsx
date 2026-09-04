"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Compass, User, Calendar, LogOut, Building } from "lucide-react";

export default function Navbar() {
  const [user, setUser] = useState<{ email: string; first_name: string; role: string } | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("bookitnow_user");
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch (e) {
        // ignore
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("bookitnow_token");
    localStorage.removeItem("bookitnow_user");
    setUser(null);
    window.location.reload();
  };

  return (
    <header className="border-b border-slate-subtle bg-[#F8F5F0]/90 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-lg bg-deep-teal flex items-center justify-center text-[#EFEAE1] shadow-sm transition-transform group-hover:scale-105">
            <Compass className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <span className="font-bold text-2xl tracking-tight text-ink font-serif block leading-none">
              BookIt<span className="text-ochre">Now</span>
            </span>
            <span className="text-[10px] tracking-wider uppercase text-slate-muted font-medium">
              Lodging & Stays
            </span>
          </div>
        </Link>

        {/* Navigation / Actions */}
        <div className="flex items-center gap-4">
          <Link
            href="/search"
            className="text-sm font-medium text-ink hover:text-deep-teal transition-colors px-3 py-2"
          >
            Explore Stays
          </Link>

          {user ? (
            <div className="flex items-center gap-3">
              <Link
                href="/my-bookings"
                className="flex items-center gap-1.5 text-sm font-medium text-ink hover:text-deep-teal px-3 py-2 rounded-md hover:bg-parchment transition-colors"
              >
                <Calendar className="w-4 h-4 text-slate-muted" />
                <span>My Bookings</span>
              </Link>
              <div className="h-4 w-px bg-slate-subtle" />
              <div className="flex items-center gap-2 text-sm text-ink font-medium pl-1">
                <span className="w-8 h-8 rounded-full bg-deep-teal/10 text-deep-teal flex items-center justify-center font-bold text-xs">
                  {user.first_name[0]?.toUpperCase()}
                </span>
                <span className="hidden sm:inline">{user.first_name}</span>
                <button
                  onClick={handleLogout}
                  title="Log out"
                  className="text-slate-muted hover:text-alert-red transition-colors p-1"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="text-sm font-medium text-ink hover:text-deep-teal transition-colors px-3 py-2"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="text-sm font-medium bg-deep-teal text-[#EFEAE1] hover:bg-deep-teal-hover px-4 py-2.5 rounded-lg shadow-sm transition-all hover:shadow"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
