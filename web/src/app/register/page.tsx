"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm bg-white p-7 rounded-xl border border-gray-200/90 shadow-xs space-y-5">
        <div className="text-center space-y-1.5">
          <div className="w-10 h-10 rounded-lg bg-[#0F5132] text-white flex items-center justify-center mx-auto shadow-xs">
            <Compass className="w-5 h-5" />
          </div>
          <h1 className="text-xl font-serif font-bold text-gray-900">Create Guest Account</h1>
          <p className="text-xs text-gray-500">Instant bookings and digital check-in e-vouchers</p>
        </div>

        {error && (
          <div className="p-2.5 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="block text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                First Name
              </label>
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Tatenda"
                className="w-full bg-gray-50 px-3 py-2 rounded-lg border border-gray-200 text-xs sm:text-sm text-gray-900 font-medium focus:outline-none focus:border-[#0F5132] focus:bg-white transition-all"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                Last Name
              </label>
              <input
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Moyo"
                className="w-full bg-gray-50 px-3 py-2 rounded-lg border border-gray-200 text-xs sm:text-sm text-gray-900 font-medium focus:outline-none focus:border-[#0F5132] focus:bg-white transition-all"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-[10px] font-semibold uppercase tracking-wider text-gray-500">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full bg-gray-50 px-3 py-2 rounded-lg border border-gray-200 text-xs sm:text-sm text-gray-900 font-medium focus:outline-none focus:border-[#0F5132] focus:bg-white transition-all"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-[10px] font-semibold uppercase tracking-wider text-gray-500">
              Phone (Optional)
            </label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="+263 77 123 4567"
              className="w-full bg-gray-50 px-3 py-2 rounded-lg border border-gray-200 text-xs sm:text-sm text-gray-900 font-medium focus:outline-none focus:border-[#0F5132] focus:bg-white transition-all"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-[10px] font-semibold uppercase tracking-wider text-gray-500">
              Password (Min. 6 chars)
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-gray-50 px-3 py-2 rounded-lg border border-gray-200 text-xs sm:text-sm text-gray-900 font-medium focus:outline-none focus:border-[#0F5132] focus:bg-white transition-all"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-[10px] font-semibold uppercase tracking-wider text-gray-500">
              Confirm Password
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-gray-50 px-3 py-2 rounded-lg border border-gray-200 text-xs sm:text-sm text-gray-900 font-medium focus:outline-none focus:border-[#0F5132] focus:bg-white transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0F5132] hover:bg-[#0A3622] disabled:opacity-50 text-white py-2.5 rounded-lg font-semibold text-xs shadow-xs transition-all duration-150"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="text-center text-xs text-gray-500">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-[#0F5132] hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
