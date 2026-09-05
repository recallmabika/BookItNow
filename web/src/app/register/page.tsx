"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Compass } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please verify your password.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/api/v1/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          password: password,
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          phone_number: phoneNumber.trim() || null,
          role: "guest",
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.detail || "Registration failed");
      }

      const data = await res.json();
      localStorage.setItem("bookitnow_token", data.access_token);
      localStorage.setItem(
        "bookitnow_user",
        JSON.stringify({
          id: data.user_id,
          email: data.email,
          first_name: data.first_name,
          last_name: data.last_name,
          role: data.role,
        })
      );

      router.push("/");
      setTimeout(() => {
        window.location.reload();
      }, 100);
    } catch (err: any) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-4.5rem)] flex items-center justify-center px-4 py-12 overflow-hidden">
      {/* Background Image with Dark Vignette Scrim */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Image
          src="/vicfalls-pillars.jpg"
          alt="Victoria Falls scenic landscape"
          fill
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gray-950/80 backdrop-blur-[3px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/50 to-black/80" />
      </div>

      {/* Registration Card - Wider 2-Column Grid to reduce vertical height */}
      <div className="relative z-10 w-full max-w-xl bg-white/95 dark:bg-[#111827]/95 backdrop-blur-md p-7 sm:p-9 rounded-xs border border-white/20 dark:border-gray-800 shadow-2xl space-y-6">
        <div className="text-center space-y-1">
          <div className="w-10 h-10 rounded-xs bg-[#EFF6FF] dark:bg-blue-950/60 text-[#2563EB] dark:text-blue-400 flex items-center justify-center mx-auto border border-blue-200 dark:border-blue-900/50 shadow-xs mb-2">
            <Compass className="w-5 h-5 stroke-[2]" />
          </div>
          <h1 className="text-2xl font-medium tracking-tight text-gray-900 dark:text-white">Create Guest Account</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-normal">Instant bookings, transparent pricing, and digital check-in e-vouchers</p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-300 rounded-xs text-xs font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {/* First Name */}
            <div className="space-y-1">
              <label className="block text-[10px] font-medium uppercase tracking-wider text-gray-600 dark:text-gray-400">
                First Name
              </label>
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Tatenda"
                className="w-full bg-gray-50 dark:bg-gray-800/70 px-3.5 py-2.5 rounded-xs border border-gray-200 dark:border-gray-700 text-xs sm:text-sm text-gray-900 dark:text-white font-normal placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-all"
              />
            </div>

            {/* Last Name */}
            <div className="space-y-1">
              <label className="block text-[10px] font-medium uppercase tracking-wider text-gray-600 dark:text-gray-400">
                Last Name
              </label>
              <input
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Moyo"
                className="w-full bg-gray-50 dark:bg-gray-800/70 px-3.5 py-2.5 rounded-xs border border-gray-200 dark:border-gray-700 text-xs sm:text-sm text-gray-900 dark:text-white font-normal placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-all"
              />
            </div>

            {/* Email Address */}
            <div className="space-y-1">
              <label className="block text-[10px] font-medium uppercase tracking-wider text-gray-600 dark:text-gray-400">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-gray-50 dark:bg-gray-800/70 px-3.5 py-2.5 rounded-xs border border-gray-200 dark:border-gray-700 text-xs sm:text-sm text-gray-900 dark:text-white font-normal placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-all"
              />
            </div>

            {/* Phone Number */}
            <div className="space-y-1">
              <label className="block text-[10px] font-medium uppercase tracking-wider text-gray-600 dark:text-gray-400">
                Phone (Optional)
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+263 77 123 4567"
                className="w-full bg-gray-50 dark:bg-gray-800/70 px-3.5 py-2.5 rounded-xs border border-gray-200 dark:border-gray-700 text-xs sm:text-sm text-gray-900 dark:text-white font-normal placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-all"
              />
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="block text-[10px] font-medium uppercase tracking-wider text-gray-600 dark:text-gray-400">
                Password (Min. 6 chars)
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-gray-50 dark:bg-gray-800/70 px-3.5 py-2.5 rounded-xs border border-gray-200 dark:border-gray-700 text-xs sm:text-sm text-gray-900 dark:text-white font-normal placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-all"
              />
            </div>

            {/* Confirm Password */}
            <div className="space-y-1">
              <label className="block text-[10px] font-medium uppercase tracking-wider text-gray-600 dark:text-gray-400">
                Confirm Password
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-gray-50 dark:bg-gray-800/70 px-3.5 py-2.5 rounded-xs border border-gray-200 dark:border-gray-700 text-xs sm:text-sm text-gray-900 dark:text-white font-normal placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-[#2563EB] hover:bg-[#1D4ED8] active:scale-[0.99] disabled:opacity-50 text-white py-3 rounded-xs font-semibold text-xs tracking-wide shadow-sm transition-all duration-150 cursor-pointer"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="text-center text-xs text-gray-500 dark:text-gray-400">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-[#2563EB] dark:text-blue-400 hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
