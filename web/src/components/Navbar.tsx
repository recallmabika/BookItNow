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
    <header className="border-b border-gray-200/80 bg-white/95 backdrop-blur-md sticky top-0 z-50 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-lg bg-[#0F5132] flex items-center justify-center text-white shadow-xs transition-transform duration-200 group-hover:scale-105">
            <Compass className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <span className="font-bold text-xl tracking-tight text-gray-900 block leading-tight">
              BookIt<span className="text-[#198754]">Now</span>
            </span>
            <span className="text-[10px] tracking-wider uppercase text-gray-500 font-medium">
              Lodging & Stays
            </span>
          </div>
        </Link>

        {/* Navigation / Actions */}
        <div className="flex items-center gap-3">
          <Link
            href="/search"
            className="text-sm font-medium text-gray-700 hover:text-[#0F5132] transition-colors px-3 py-2 rounded-lg hover:bg-gray-50"
          >
            Explore Stays
          </Link>

          {user ? (
            <div className="flex items-center gap-3 pl-2">
              <Link
                href="/my-bookings"
                className="flex items-center gap-1.5 text-sm font-medium text-gray-700 hover:text-[#0F5132] px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Calendar className="w-4 h-4 text-[#0F5132]" />
                <span>My Bookings</span>
              </Link>
              <div className="h-4 w-px bg-gray-200" />
              <div className="flex items-center gap-2 text-sm text-gray-900 font-medium pl-1">
                <span className="w-8 h-8 rounded-lg bg-[#E8F5E9] text-[#0F5132] flex items-center justify-center font-bold text-xs border border-green-200">
                  {user.first_name[0]?.toUpperCase()}
                </span>
                <span className="hidden sm:inline text-xs font-semibold">{user.first_name}</span>
                <button
                  onClick={handleLogout}
                  title="Log out"
                  className="text-gray-400 hover:text-red-600 transition-colors p-1"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <Link
                href="/login"
                className="text-sm font-medium text-gray-700 hover:text-[#0F5132] transition-colors px-3 py-2 rounded-lg hover:bg-gray-50"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="text-sm font-medium bg-[#0F5132] text-white hover:bg-[#0A3622] px-4 py-2 rounded-lg shadow-xs transition-all duration-150 hover:shadow-sm"
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
