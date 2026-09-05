"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Compass } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.detail || "Authentication failed");
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

      router.push(redirectUrl);
      setTimeout(() => {
        window.location.reload();
      }, 100);
    } catch (err: any) {
      setError(err.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm bg-white dark:bg-[#111827] p-8 rounded-xs border border-gray-200 dark:border-gray-800 shadow-xl space-y-5">
      <div className="text-center space-y-1.5">
        <div className="w-10 h-10 rounded-xs bg-[#EFF6FF] dark:bg-blue-950/60 text-[#2563EB] dark:text-blue-400 flex items-center justify-center mx-auto border border-blue-200 dark:border-blue-900/50 shadow-xs">
          <Compass className="w-5 h-5 stroke-[2]" />
        </div>
        <h1 className="text-xl font-medium tracking-tight text-gray-900 dark:text-white">Welcome Back</h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 font-normal">Sign in to manage your bookings and saved lodgings</p>
      </div>

      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-300 rounded-xs text-xs font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="block text-[10px] font-medium uppercase tracking-wider text-gray-600 dark:text-gray-400">
            Email Address
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full bg-gray-50 dark:bg-gray-800/60 px-3.5 py-2.5 rounded-xs border border-gray-200 dark:border-gray-700 text-xs sm:text-sm text-gray-900 dark:text-white font-normal placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-all"
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="block text-[10px] font-medium uppercase tracking-wider text-gray-600 dark:text-gray-400">
              Password
            </label>
          </div>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full bg-gray-50 dark:bg-gray-800/60 px-3.5 py-2.5 rounded-xs border border-gray-200 dark:border-gray-700 text-xs sm:text-sm text-gray-900 dark:text-white font-normal placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-all"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] active:scale-[0.99] disabled:opacity-50 text-white py-2.5 rounded-xs font-semibold text-xs tracking-wide shadow-sm transition-all duration-150 cursor-pointer"
        >
          {loading ? "Signing In..." : "Sign In"}
        </button>
      </form>

      <p className="text-center text-xs text-gray-500 dark:text-gray-400">
        Don't have an account?{" "}
        <Link href="/register" className="font-semibold text-[#2563EB] dark:text-blue-400 hover:underline">
          Register as a Guest
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
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

      <div className="relative z-10 w-full flex items-center justify-center">
        <Suspense fallback={<div className="text-xs text-white">Loading sign in...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
