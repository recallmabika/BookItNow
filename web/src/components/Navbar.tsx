"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import {
  Compass,
  Briefcase,
  User as UserIcon,
  Settings,
  LogOut,
  ChevronDown,
  Camera,
  ShieldCheck
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
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && user) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        const updatedUser = { ...user, avatar: base64String };
        setUser(updatedUser);
        localStorage.setItem("bookitnow_user", JSON.stringify(updatedUser));
      };
      reader.readAsDataURL(file);
    }
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
            <div className="flex items-center gap-2 pl-1">
              {/* Refined My Bookings Link with clean Briefcase travel icon */}
              <Link
                href="/my-bookings"
                className="group flex items-center gap-2 text-xs font-medium text-white hover:bg-white hover:text-[#0F5132] transition-all duration-150 px-3.5 py-3 rounded-xs"
              >
                <Briefcase className="w-3.5 h-3.5 text-green-300 group-hover:text-[#0F5132] stroke-[1.8] transition-colors" />
                <span>My Bookings</span>
              </Link>

              <div className="h-5 w-px bg-white/20 mx-1" />

              {/* Profile Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setDropdownOpen((prev) => !prev)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xs transition-all duration-150 cursor-pointer ${
                    dropdownOpen ? "bg-white text-[#0F5132]" : "text-white hover:bg-white hover:text-[#0F5132]"
                  }`}
                >
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.first_name}
                      className="w-7 h-7 rounded-xs object-cover border border-white/40 shadow-xs"
                    />
                  ) : (
                    <span className="w-7 h-7 rounded-xs bg-white text-[#0F5132] flex items-center justify-center font-semibold text-[11px] shadow-xs border border-green-800/20">
                      {user.first_name[0]?.toUpperCase()}
                    </span>
                  )}
                  <span className="hidden sm:inline text-xs font-medium">
                    {user.first_name}
                  </span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 stroke-[1.8] transition-transform duration-200 ${
                      dropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Animated Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xs border border-gray-200/90 shadow-lg py-2 z-50 animate-fade-in">
                    {/* User Header Info */}
                    <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-3">
                      <div className="relative group/avatar cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                        {user.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.first_name}
                            className="w-10 h-10 rounded-xs object-cover border border-gray-200"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-xs bg-[#E8F5E9] text-[#0F5132] flex items-center justify-center font-bold text-sm border border-green-200">
                            {user.first_name[0]?.toUpperCase()}
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/50 text-white rounded-xs opacity-0 group-hover/avatar:opacity-100 flex items-center justify-center transition-opacity duration-150">
                          <Camera className="w-4 h-4 stroke-[1.8]" />
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-gray-900 truncate">
                          {user.first_name} {user.last_name || ""}
                        </div>
                        <div className="text-[10px] text-gray-500 truncate">{user.email}</div>
                        <span className="inline-flex items-center gap-1 text-[9px] uppercase tracking-wider text-[#0F5132] bg-[#E8F5E9] px-1.5 py-0.2 rounded-xs mt-1 font-medium">
                          <ShieldCheck className="w-2.5 h-2.5 stroke-[2]" />
                          {user.role}
                        </span>
                      </div>
                    </div>

                    {/* Hidden Avatar Upload Input */}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />

                    {/* Change Photo Button */}
                    <div className="px-2 pt-1 pb-1">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-gray-600 hover:text-[#0F5132] hover:bg-gray-50 rounded-xs transition-colors"
                      >
                        <Camera className="w-3.5 h-3.5 text-[#0F5132] stroke-[1.8]" />
                        <span>Upload / Change Photo</span>
                      </button>
                    </div>

                    <div className="h-px bg-gray-100 my-1" />

                    {/* Menu Links */}
                    <div className="px-2 space-y-0.5">
                      <Link
                        href="/profile"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-xs text-gray-700 hover:text-[#0F5132] hover:bg-[#E8F5E9]/50 rounded-xs transition-colors"
                      >
                        <UserIcon className="w-3.5 h-3.5 text-gray-500 stroke-[1.8]" />
                        <span>My Profile</span>
                      </Link>

                      <Link
                        href="/settings"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-xs text-gray-700 hover:text-[#0F5132] hover:bg-[#E8F5E9]/50 rounded-xs transition-colors"
                      >
                        <Settings className="w-3.5 h-3.5 text-gray-500 stroke-[1.8]" />
                        <span>Account Settings</span>
                      </Link>
                    </div>

                    <div className="h-px bg-gray-100 my-1" />

                    {/* Logout Option */}
                    <div className="px-2 pt-0.5">
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-red-600 hover:bg-red-50 rounded-xs transition-colors cursor-pointer"
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
