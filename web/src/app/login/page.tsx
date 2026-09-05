"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
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
    <div className="w-full max-w-sm bg-white p-7 rounded-xl border border-gray-200/90 shadow-xs space-y-5">
      <div className="text-center space-y-1.5">
        <div className="w-10 h-10 rounded-lg bg-[#0F5132] text-white flex items-center justify-center mx-auto shadow-xs">
          <Compass className="w-5 h-5" />
        </div>
        <h1 className="text-xl font-serif font-bold text-gray-900">Welcome Back</h1>
        <p className="text-xs text-gray-500">Sign in to manage your bookings and saved lodgings</p>
      </div>

      {error && (
        <div className="p-2.5 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3.5">
        <div className="space-y-1">
          <label className="block text-[11px] font-semibold uppercase tracking-wider text-gray-500">
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
          <label className="block text-[11px] font-semibold uppercase tracking-wider text-gray-500">
            Password
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full bg-gray-50 px-3 py-2 rounded-lg border border-gray-200 text-xs sm:text-sm text-gray-900 font-medium focus:outline-none focus:border-[#0F5132] focus:bg-white transition-all"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#0F5132] hover:bg-[#0A3622] disabled:opacity-50 text-white py-2.5 rounded-lg font-semibold text-xs shadow-xs transition-all duration-150"
        >
          {loading ? "Signing In..." : "Sign In"}
        </button>
      </form>

      <p className="text-center text-xs text-gray-500">
        Don't have an account?{" "}
        <Link href="/register" className="font-semibold text-[#0F5132] hover:underline">
          Register as a Guest
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-8">
      <Suspense fallback={<div className="text-xs text-gray-500">Loading sign in...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
