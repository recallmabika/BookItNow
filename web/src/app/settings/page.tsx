"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Bell, Globe, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function SettingsPage() {
  const router = useRouter();
  const [savedMsg, setSavedMsg] = useState("");
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);
  const [currency, setCurrency] = useState("USD");

  useEffect(() => {
    const raw = localStorage.getItem("bookitnow_user");
    if (!raw) {
      router.push("/login");
    }
  }, [router]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedMsg("Settings saved successfully!");
    setTimeout(() => setSavedMsg(""), 3500);
  };

  return (
    <div className="min-h-[calc(100vh-4.5rem)] bg-[#F8FAF9] py-10 px-4 sm:px-6 lg:px-8">
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

        <div className="bg-white rounded-xs border border-gray-200/90 shadow-xs overflow-hidden">
          <div className="bg-[#0F5132] h-28 px-6 sm:px-8 relative flex items-end pb-4">
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
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Globe className="w-4 h-4 text-[#0F5132]" />
                <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wider">
                  Currency & Region
                </h3>
              </div>
              <div className="pl-6 max-w-xs">
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Display Currency
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xs focus:outline-none focus:border-[#0F5132]"
                >
                  <option value="USD">USD ($) - United States Dollar</option>
                  <option value="ZWG">ZWG (ZiG) - Zimbabwe Gold</option>
                  <option value="ZAR">ZAR (R) - South African Rand</option>
                </select>
              </div>
            </div>

            <div className="h-px bg-gray-100" />

            {/* Password */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Lock className="w-4 h-4 text-[#0F5132]" />
                <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wider">
                  Password & Security
                </h3>
              </div>
              <div className="pl-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    Current Password
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xs focus:outline-none focus:border-[#0F5132]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    New Password
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xs focus:outline-none focus:border-[#0F5132]"
                  />
                </div>
              </div>
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
