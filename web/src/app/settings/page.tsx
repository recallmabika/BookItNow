"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Bell, Globe, ArrowLeft, CheckCircle2 } from "lucide-react";
import SearchableDropdown, { DropdownOption } from "@/components/SearchableDropdown";

const CURRENCY_OPTIONS: DropdownOption[] = [
  { value: "USD", label: "USD ($) - United States Dollar", sublabel: "Global default currency" },
  { value: "ZWG", label: "ZWG (ZiG) - Zimbabwe Gold", sublabel: "Zimbabwe local gold-backed unit" },
  { value: "ZAR", label: "ZAR (R) - South African Rand", sublabel: "Southern Africa regional currency" },
  { value: "GBP", label: "GBP (£) - British Pound", sublabel: "United Kingdom" },
  { value: "EUR", label: "EUR (€) - Euro", sublabel: "European Union" },
  { value: "BWP", label: "BWP (P) - Botswana Pula", sublabel: "Botswana" },
];

export default function SettingsPage() {
  const router = useRouter();
  const [savedMsg, setSavedMsg] = useState("");
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);
  const [currency, setCurrency] = useState("USD");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    const raw = localStorage.getItem("bookitnow_user");
    if (!raw) {
      router.push("/login");
    }
  }, [router]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");

    if (newPassword || confirmPassword) {
      if (newPassword.length < 6) {
        setPasswordError("New password must be at least 6 characters long.");
        return;
      }
      if (newPassword !== confirmPassword) {
        setPasswordError("Passwords do not match. Please re-check.");
        return;
      }
    }

    setSavedMsg("Settings saved successfully!");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setTimeout(() => setSavedMsg(""), 3500);
  };

  return (
    <div className="min-h-[calc(100vh-4.5rem)] bg-white py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-[#0F5132] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Explorer</span>
          </Link>
        </div>

        <div className="bg-white rounded-xs border border-gray-200/90 shadow-xs">
          <div className="bg-[#0F5132] h-28 px-6 sm:px-8 relative flex items-end pb-4 rounded-t-xs">
            <div className="text-white">
              <h1 className="text-xl font-semibold tracking-tight">Account Settings</h1>
              <p className="text-xs text-green-100/80 mt-0.5">
                Preferences, notifications, and security options
              </p>
            </div>
          </div>

          <form onSubmit={handleSave} className="p-6 sm:p-8 space-y-6">
            {savedMsg && (
              <div className="p-3 bg-[#E8F5E9] border border-green-200 rounded-xs flex items-center gap-2 text-xs text-[#0F5132]">
                <CheckCircle2 className="w-4 h-4 text-[#0F5132] shrink-0" />
                <span>{savedMsg}</span>
              </div>
            )}

            {/* Notifications */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Bell className="w-4 h-4 text-[#0F5132]" />
                <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wider">
                  Notification Preferences
                </h3>
              </div>
              <div className="space-y-3 pl-6">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={emailAlerts}
                    onChange={(e) => setEmailAlerts(e.target.checked)}
                    className="rounded-xs text-[#0F5132] focus:ring-[#0F5132]"
                  />
                  <span className="text-xs text-gray-700">
                    Receive instant booking updates & confirmation via email
                  </span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={smsAlerts}
                    onChange={(e) => setSmsAlerts(e.target.checked)}
                    className="rounded-xs text-[#0F5132] focus:ring-[#0F5132]"
                  />
                  <span className="text-xs text-gray-700">
                    Receive SMS alerts for reservation check-ins
                  </span>
                </label>
              </div>
            </div>

            <div className="h-px bg-gray-100" />

            {/* Currency & Region */}
            <div className="relative z-20">
              <div className="flex items-center gap-2 mb-3">
                <Globe className="w-4 h-4 text-[#0F5132]" />
                <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wider">
                  Currency & Region
                </h3>
              </div>
              <div className="pl-6 max-w-sm">
                <SearchableDropdown
                  label="Display Currency"
                  options={CURRENCY_OPTIONS}
                  value={currency}
                  onChange={(val) => setCurrency(val)}
                  placeholder="Select display currency"
                  searchPlaceholder="Search currency code or country..."
                />
              </div>
            </div>

            <div className="h-px bg-gray-100 relative z-0" />

            {/* Password */}
            <div className="relative z-0">
              <div className="flex items-center gap-2 mb-3">
                <Lock className="w-4 h-4 text-[#0F5132]" />
                <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wider">
                  Password & Security
                </h3>
              </div>
              <div className="pl-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => {
                      setCurrentPassword(e.target.value);
                      setPasswordError("");
                    }}
                    placeholder="••••••••"
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xs outline-none focus:outline-none focus:ring-0 focus:border-[#0F5132] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      setPasswordError("");
                    }}
                    placeholder="••••••••"
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xs outline-none focus:outline-none focus:ring-0 focus:border-[#0F5132] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setPasswordError("");
                    }}
                    placeholder="••••••••"
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xs outline-none focus:outline-none focus:ring-0 focus:border-[#0F5132] transition-colors"
                  />
                </div>
              </div>
              {passwordError && (
                <p className="text-[11px] text-red-600 mt-2 pl-6">{passwordError}</p>
              )}
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#0F5132] text-white text-xs font-semibold rounded-xs hover:bg-[#0c4027] transition-colors cursor-pointer shadow-xs"
              >
                Save Preferences
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
