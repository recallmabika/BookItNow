"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import {
  Compass,
  User as UserIcon,
  Settings,
  LogOut,
  ChevronDown
} from "lucide-react";

interface UserProfile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  avatar?: string;
}

export default function Navbar() {
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
    <header className="bg-[#0F5132] border-b border-[#0A3622] sticky top-0 z-50 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 group py-2">
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
            className="text-xs font-medium text-white hover:bg-white hover:text-[#0F5132] transition-all duration-150 px-3.5 py-3 rounded-xs"
          >
            Explore Stays
          </Link>

          {user ? (
            <div className="flex items-center gap-2.5 pl-1">
              {/* Clean My Bookings text button without awkward icon */}
              <Link
                href="/my-bookings"
                className="text-xs font-medium text-white hover:bg-white hover:text-[#0F5132] transition-all duration-150 px-3.5 py-3 rounded-xs"
              >
                My Bookings
              </Link>

              <div className="h-5 w-px bg-white/20 mx-1" />

              {/* Profile Trigger - Always crisp white background */}
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setDropdownOpen((prev) => !prev)}
                  className="flex items-center gap-2 px-3 py-2 bg-white text-[#0F5132] rounded-xs shadow-xs border border-white/80 hover:bg-gray-50 active:bg-gray-100 transition-colors duration-150 cursor-pointer"
                >
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.first_name}
                      className="w-6 h-6 rounded-xs object-cover border border-gray-200"
                    />
                  ) : (
                    <span className="w-6 h-6 rounded-xs bg-[#E8F5E9] text-[#0F5132] flex items-center justify-center font-bold text-[11px] border border-green-200">
                      {user.first_name[0]?.toUpperCase()}
                    </span>
                  )}
                  <span className="text-xs font-semibold">
                    {user.first_name}
                  </span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 stroke-[2] transition-transform duration-200 text-[#0F5132] ${
                      dropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Animated Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-60 bg-white rounded-xs border border-gray-200/90 shadow-lg py-2 z-50 animate-fade-in">
                    {/* User Header Info - Pure White with Full Name and Role (No Shield) */}
                    <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-3">
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.first_name}
                          className="w-9 h-9 rounded-xs object-cover border border-gray-200"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-xs bg-[#E8F5E9] text-[#0F5132] flex items-center justify-center font-bold text-sm border border-green-200 shrink-0">
                          {user.first_name[0]?.toUpperCase()}
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-gray-900 truncate">
                          {user.first_name} {user.last_name || ""}
                        </div>
                        <div className="text-[10px] text-gray-500 truncate">{user.email}</div>
                        <span className="inline-block text-[9px] uppercase tracking-wider text-[#0F5132] bg-[#E8F5E9] px-1.5 py-0.5 rounded-xs mt-1 font-medium">
                          {user.role}
                        </span>
                      </div>
                    </div>

                    {/* Menu Links */}
                    <div className="px-2 pt-1 space-y-0.5">
                      <Link
                        href="/profile"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-xs text-gray-700 hover:text-[#0F5132] hover:bg-[#E8F5E9]/50 rounded-xs transition-colors"
                      >
                        <UserIcon className="w-3.5 h-3.5 text-gray-400 stroke-[1.8]" />
                        <span>My Profile</span>
                      </Link>

                      <Link
                        href="/settings"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-xs text-gray-700 hover:text-[#0F5132] hover:bg-[#E8F5E9]/50 rounded-xs transition-colors"
                      >
                        <Settings className="w-3.5 h-3.5 text-gray-400 stroke-[1.8]" />
                        <span>Account Settings</span>
                      </Link>
                    </div>

                    <div className="h-px bg-gray-100 my-1.5" />

                    {/* Logout Option */}
                    <div className="px-2">
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-red-600 hover:bg-red-50 rounded-xs transition-colors cursor-pointer text-left"
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
                className="text-xs font-medium text-white hover:bg-white hover:text-[#0F5132] transition-all duration-150 px-3.5 py-3 rounded-xs"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="text-xs font-medium bg-white text-[#0F5132] hover:bg-green-50 active:bg-green-100 px-4 py-3 rounded-xs transition-all duration-150 shadow-xs"
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
