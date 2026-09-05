"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import {
  Compass,
  User as UserIcon,
  Settings,
  LogOut,
  ChevronDown,
  Sun,
  Moon,
  Laptop,
  CalendarCheck
} from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

interface UserProfile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  avatar?: string;
}

export default function Navbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

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

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("bookitnow_token");
    localStorage.removeItem("bookitnow_user");
    setUser(null);
    setDropdownOpen(false);
    window.location.reload();
  };

  return (
    <header className="bg-[#2563EB] border-b border-[#1D4ED8] sticky top-0 z-50 shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between gap-2">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2 group py-1.5 shrink-0">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xs bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors duration-150 border border-white/20">
            <Compass className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[1.8]" />
          </div>
          <div>
            <span className="font-semibold text-base sm:text-lg tracking-tight text-white block leading-none">
              BookIt<span className="text-blue-200">Now</span>
            </span>
            <span className="hidden sm:block text-[9px] tracking-wider uppercase text-blue-100/80 font-normal">
              Lodging & Stays
            </span>
          </div>
        </Link>

        {/* Navigation / Actions */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          <Link
            href="/search"
            className={`text-xs font-medium transition-all duration-150 px-2.5 sm:px-3.5 py-2 sm:py-3 rounded-xs outline-none focus-visible:ring-2 focus-visible:ring-white/80 active:scale-[0.98] active:bg-white active:text-[#2563EB] ${
              pathname.startsWith("/search")
                ? "bg-white text-[#2563EB] font-semibold shadow-xs"
                : "text-white hover:bg-white hover:text-[#2563EB] focus-visible:bg-white focus-visible:text-[#2563EB]"
            }`}
          >
            Explore Stays
          </Link>

          {user ? (
            <div className="flex items-center gap-1 sm:gap-2.5 pl-0.5 sm:pl-1">
              {/* Clean My Bookings text button */}
              <Link
                href="/my-bookings"
                className={`hidden md:inline-flex text-xs font-medium transition-all duration-150 px-3.5 py-3 rounded-xs outline-none focus-visible:ring-2 focus-visible:ring-white/80 active:scale-[0.98] active:bg-white active:text-[#2563EB] ${
                  pathname.startsWith("/my-bookings")
                    ? "bg-white text-[#2563EB] font-semibold shadow-xs"
                    : "text-white hover:bg-white hover:text-[#2563EB] focus-visible:bg-white focus-visible:text-[#2563EB]"
                }`}
              >
                My Bookings
              </Link>

              <div className="hidden md:block h-5 w-px bg-white/20 mx-0.5 sm:mx-1" />

              {/* Profile Trigger - Full height left avatar, centered name, clean hover */}
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setDropdownOpen((prev) => !prev)}
                  className="flex items-center h-8 sm:h-10 pl-0 pr-2 sm:pr-3.5 bg-white text-[#2563EB] rounded-xs shadow-xs border border-white/80 hover:bg-blue-50/50 hover:border-white active:scale-[0.98] transition-all duration-150 cursor-pointer overflow-hidden group"
                >
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.first_name}
                      className="h-full aspect-square object-cover border-r border-gray-200 shrink-0"
                    />
                  ) : (
                    <span className="h-full aspect-square bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center font-bold text-xs border-r border-blue-200 shrink-0 group-hover:bg-[#DBEAFE] transition-colors">
                      {user.first_name[0]?.toUpperCase()}
                    </span>
                  )}
                  <span className="text-xs font-semibold px-1.5 sm:px-3 max-w-[5rem] sm:max-w-none truncate">
                    {user.first_name}
                  </span>
                  <ChevronDown
                    className={`w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[2] transition-transform duration-200 text-[#2563EB] shrink-0 ${
                      dropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Animated Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-[#111827] rounded-xs border border-gray-200/90 dark:border-gray-800 shadow-xl py-0 z-50 animate-fade-in overflow-hidden">
                    {/* User Header Info - Avatar fills entire left, top, bottom with clean hover */}
                    <div className="flex items-stretch border-b border-gray-100 dark:border-gray-800 bg-gray-50/40 dark:bg-gray-800/40 hover:bg-blue-50/30 dark:hover:bg-gray-800/70 transition-colors">
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.first_name}
                          className="w-16 min-h-[4.5rem] object-cover border-r border-gray-200 dark:border-gray-700 shrink-0"
                        />
                      ) : (
                        <div className="w-16 min-h-[4.5rem] bg-[#EFF6FF] dark:bg-blue-950/40 text-[#2563EB] dark:text-blue-400 flex items-center justify-center font-bold text-lg border-r border-blue-200 dark:border-blue-900/50 shrink-0">
                          {user.first_name[0]?.toUpperCase()}
                        </div>
                      )}

                      <div className="flex-1 min-w-0 p-3 flex flex-col justify-center">
                        <div className="text-xs font-semibold text-gray-900 dark:text-white truncate">
                          {user.first_name} {user.last_name || ""}
                        </div>
                        <div className="text-[10px] text-gray-500 dark:text-gray-400 truncate">{user.email}</div>
                        <span className="inline-block text-[10px] text-gray-400 dark:text-gray-500 font-medium mt-0.5">
                          {user.role === "guest" || user.role === "GUEST" ? "Guest Account" : `${user.role.charAt(0).toUpperCase() + user.role.slice(1).toLowerCase()} Account`}
                        </span>
                      </div>
                    </div>

                    {/* Menu Links */}
                    <div className="p-2 space-y-0.5">
                      <Link
                        href="/my-bookings"
                        onClick={() => setDropdownOpen(false)}
                        className={`md:hidden flex items-center gap-2.5 px-3 py-2 text-xs rounded-xs transition-colors active:bg-[#EFF6FF] dark:active:bg-blue-950/50 ${
                          pathname === "/my-bookings"
                            ? "bg-[#EFF6FF] dark:bg-blue-950/50 text-[#2563EB] dark:text-blue-400 font-semibold"
                            : "text-gray-700 dark:text-gray-200 hover:text-[#2563EB] dark:hover:text-blue-400 hover:bg-[#EFF6FF]/50 dark:hover:bg-gray-800"
                        }`}
                      >
                        <CalendarCheck className={`w-3.5 h-3.5 stroke-[1.8] ${pathname === "/my-bookings" ? "text-[#2563EB] dark:text-blue-400" : "text-gray-400"}`} />
                        <span>My Bookings</span>
                      </Link>

                      <Link
                        href="/profile"
                        onClick={() => setDropdownOpen(false)}
                        className={`flex items-center gap-2.5 px-3 py-2 text-xs rounded-xs transition-colors active:bg-[#EFF6FF] dark:active:bg-blue-950/50 ${
                          pathname === "/profile"
                            ? "bg-[#EFF6FF] dark:bg-blue-950/50 text-[#2563EB] dark:text-blue-400 font-semibold"
                            : "text-gray-700 dark:text-gray-200 hover:text-[#2563EB] dark:hover:text-blue-400 hover:bg-[#EFF6FF]/50 dark:hover:bg-gray-800"
                        }`}
                      >
                        <UserIcon className={`w-3.5 h-3.5 stroke-[1.8] ${pathname === "/profile" ? "text-[#2563EB] dark:text-blue-400" : "text-gray-400"}`} />
                        <span>My Profile</span>
                      </Link>

                      <Link
                        href="/settings"
                        onClick={() => setDropdownOpen(false)}
                        className={`flex items-center gap-2.5 px-3 py-2 text-xs rounded-xs transition-colors active:bg-[#EFF6FF] dark:active:bg-blue-950/50 ${
                          pathname === "/settings"
                            ? "bg-[#EFF6FF] dark:bg-blue-950/50 text-[#2563EB] dark:text-blue-400 font-semibold"
                            : "text-gray-700 dark:text-gray-200 hover:text-[#2563EB] dark:hover:text-blue-400 hover:bg-[#EFF6FF]/50 dark:hover:bg-gray-800"
                        }`}
                      >
                        <Settings className={`w-3.5 h-3.5 stroke-[1.8] ${pathname === "/settings" ? "text-[#2563EB] dark:text-blue-400" : "text-gray-400"}`} />
                        <span>Account Settings</span>
                      </Link>
                    </div>

                    {/* Theme Selector: Light, Dark, System */}
                    <div className="px-3 py-2 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
                      <div className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1.5">
                        Appearance
                      </div>
                      <div className="grid grid-cols-3 gap-1 bg-gray-200/70 dark:bg-gray-800 p-0.5 rounded-xs">
                        <button
                          type="button"
                          onClick={() => setTheme("light")}
                          className={`flex items-center justify-center gap-1 py-1 text-[11px] font-medium rounded-xs transition-colors cursor-pointer ${
                            theme === "light"
                              ? "bg-white dark:bg-gray-700 text-[#2563EB] dark:text-white shadow-xs font-semibold"
                              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                          }`}
                          title="Light mode"
                        >
                          <Sun className="w-3 h-3 stroke-[2]" />
                          <span>Light</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setTheme("dark")}
                          className={`flex items-center justify-center gap-1 py-1 text-[11px] font-medium rounded-xs transition-colors cursor-pointer ${
                            theme === "dark"
                              ? "bg-white dark:bg-gray-700 text-[#2563EB] dark:text-white shadow-xs font-semibold"
                              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                          }`}
                          title="Dark mode"
                        >
                          <Moon className="w-3 h-3 stroke-[2]" />
                          <span>Dark</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setTheme("system")}
                          className={`flex items-center justify-center gap-1 py-1 text-[11px] font-medium rounded-xs transition-colors cursor-pointer ${
                            theme === "system"
                              ? "bg-white dark:bg-gray-700 text-[#2563EB] dark:text-white shadow-xs font-semibold"
                              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                          }`}
                          title="System preferences"
                        >
                          <Laptop className="w-3 h-3 stroke-[2]" />
                          <span>System</span>
                        </button>
                      </div>
                    </div>

                    <div className="h-px bg-gray-100 dark:border-gray-800" />

                    {/* Logout Option */}
                    <div className="p-2">
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xs transition-colors cursor-pointer text-left font-medium"
                      >
                        <LogOut className="w-3.5 h-3.5 stroke-[1.8]" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="text-xs font-medium text-white hover:bg-white hover:text-[#2563EB] focus-visible:bg-white focus-visible:text-[#2563EB] focus-visible:ring-2 focus-visible:ring-white/80 transition-all duration-150 px-3.5 py-3 rounded-xs outline-none"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="text-xs font-medium bg-white text-[#2563EB] hover:bg-blue-50 active:bg-blue-100 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#2563EB] px-4 py-3 rounded-xs transition-all duration-150 shadow-xs outline-none"
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
