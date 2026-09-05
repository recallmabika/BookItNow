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
    <header className="border-b border-gray-200/80 bg-white/95 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-xs bg-[#0F5132] flex items-center justify-center text-white transition-transform duration-150 group-hover:scale-105">
            <Compass className="w-4 h-4 stroke-[1.8]" />
          </div>
          <div>
            <span className="font-semibold text-lg tracking-tight text-gray-900 block leading-none">
              BookIt<span className="text-[#15803D]">Now</span>
            </span>
            <span className="text-[9px] tracking-wider uppercase text-gray-400 font-normal">
              Lodging & Stays
            </span>
          </div>
        </Link>

        {/* Navigation / Actions */}
        <div className="flex items-center gap-2.5">
          <Link
            href="/search"
            className="text-xs font-normal text-gray-600 hover:text-[#0F5132] transition-colors px-2.5 py-1.5 rounded-xs hover:bg-gray-50"
          >
            Explore Stays
          </Link>

          {user ? (
            <div className="flex items-center gap-2.5 pl-2">
              <Link
                href="/my-bookings"
                className="flex items-center gap-1.5 text-xs font-normal text-gray-600 hover:text-[#0F5132] px-2.5 py-1.5 rounded-xs hover:bg-gray-50 transition-colors"
              >
                <Calendar className="w-3.5 h-3.5 text-[#0F5132] stroke-[1.8]" />
                <span>My Bookings</span>
              </Link>
              <div className="h-3 w-px bg-gray-200" />
              <div className="flex items-center gap-2 text-xs text-gray-900 pl-1 font-normal">
                <span className="w-7 h-7 rounded-xs bg-[#F0FDF4] text-[#0F5132] flex items-center justify-center font-medium text-[11px] border border-green-200/60">
                  {user.first_name[0]?.toUpperCase()}
                </span>
                <span className="hidden sm:inline font-normal">{user.first_name}</span>
                <button
                  onClick={handleLogout}
                  title="Log out"
                  className="text-gray-400 hover:text-red-600 transition-colors p-1 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5 stroke-[1.8]" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="text-xs font-normal text-gray-600 hover:text-[#0F5132] transition-colors px-2.5 py-1.5 rounded-xs hover:bg-gray-50"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="text-xs font-medium bg-[#0F5132] text-white hover:bg-[#0B3D26] px-3 py-1.5 rounded-xs transition-colors duration-150"
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
