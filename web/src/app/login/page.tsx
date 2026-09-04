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
    } catch (err: any) {
      setError(err.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-parchment-light p-8 rounded-3xl border border-slate-subtle shadow-lg space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-xl bg-deep-teal text-[#EFEAE1] flex items-center justify-center mx-auto shadow-sm">
          <Compass className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-serif font-bold text-ink">Welcome Back</h1>
        <p className="text-xs text-slate-muted">Sign in to manage your bookings and saved lodgings</p>
      </div>

      {error && (
        <div className="p-3 bg-alert-red/10 border border-alert-red/20 text-alert-red rounded-xl text-xs font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-muted">
            Email Address
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full bg-parchment px-4 py-2.5 rounded-xl border border-slate-subtle text-sm text-ink font-medium focus:outline-none focus:border-deep-teal"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-muted">
            Password
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full bg-parchment px-4 py-2.5 rounded-xl border border-slate-subtle text-sm text-ink font-medium focus:outline-none focus:border-deep-teal"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-deep-teal hover:bg-deep-teal-hover disabled:opacity-50 text-[#EFEAE1] py-3 rounded-xl font-semibold text-sm shadow-md hover:shadow-lg transition-all"
        >
          {loading ? "Signing In..." : "Sign In"}
        </button>
      </form>

      <p className="text-center text-xs text-slate-muted">
        Don't have an account?{" "}
        <Link href="/register" className="font-semibold text-deep-teal hover:underline">
          Register as a Guest
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <Suspense fallback={<div className="text-xs text-slate-muted">Loading sign in...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
