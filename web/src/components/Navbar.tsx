"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Compass, Calendar, LogOut } from "lucide-react";

export default function Navbar() {
  const [user, setUser] = useState<{ email: string; first_name: string; role: string } | null>(null);

  useEffect(() => {
    const checkUser = () => {
      const saved = localStorage.getItem("bookitnow_user");
      if (saved) {
        try {
          setUser(JSON.parse(saved));
        } catch (e) {
          // ignore
        }
      } else {
        setUser(null);
      }
    };
    checkUser();
    window.addEventListener("storage", checkUser);
    return () => window.removeEventListener("storage", checkUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("bookitnow_token");
    localStorage.removeItem("bookitnow_user");
    setUser(null);
    window.location.reload();
  };

  return (
    <header className="bg-[#0F5132] border-b border-[#0A3622] sticky top-0 z-50 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xs bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors duration-150 border border-white/20">
            <Compass className="w-4 h-4 stroke-[1.8]" />
          </div>
          <div>
            <span className="font-semibold text-lg tracking-tight text-white block leading-none">
              BookIt<span className="text-green-300">Now</span>
            </span>
            <span className="text-[9px] tracking-wider uppercase text-green-100/70 font-normal">
              Lodging & Stays
            </span>
          </div>
        </Link>

        {/* Navigation / Actions */}
        <div className="flex items-center gap-2">
          <Link
            href="/search"
            className="text-xs font-normal text-white/90 hover:text-white hover:bg-white/10 active:bg-white/15 transition-all duration-150 px-3 py-1.5 rounded-xs"
          >
            Explore Stays
          </Link>

          {user ? (
            <div className="flex items-center gap-2 pl-1">
              <Link
                href="/my-bookings"
                className="flex items-center gap-1.5 text-xs font-normal text-white/90 hover:text-white hover:bg-white/10 active:bg-white/15 transition-all duration-150 px-3 py-1.5 rounded-xs"
              >
                <Calendar className="w-3.5 h-3.5 text-green-300 stroke-[1.8]" />
                <span>My Bookings</span>
              </Link>
              
              <div className="h-3.5 w-px bg-white/20 mx-1" />
              
              <div className="flex items-center gap-2 pl-1">
                <span className="w-7 h-7 rounded-xs bg-white text-[#0F5132] flex items-center justify-center font-semibold text-[11px] shadow-xs">
                  {user.first_name[0]?.toUpperCase()}
                </span>
                <span className="hidden sm:inline text-xs font-normal text-white">{user.first_name}</span>
                <button
                  onClick={handleLogout}
                  title="Log out"
                  className="text-white/70 hover:text-white hover:bg-white/10 p-1.5 rounded-xs transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5 stroke-[1.8]" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <Link
                href="/login"
                className="text-xs font-normal text-white/90 hover:text-white hover:bg-white/10 transition-all duration-150 px-3 py-1.5 rounded-xs"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="text-xs font-medium bg-white text-[#0F5132] hover:bg-green-50 active:bg-green-100 px-3 py-1.5 rounded-xs transition-all duration-150 shadow-xs"
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
