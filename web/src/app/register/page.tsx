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
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/api/v1/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          first_name: firstName,
          last_name: lastName,
          phone_number: phoneNumber || null,
          role: "guest",
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.detail || "Registration failed");
      }

      const data = await res.json();
      localStorage.setItem("bookitnow_token", data.access_token);
      localStorage.setItem("bookitnow_user", JSON.stringify({
        id: data.user_id,
        email: data.email,
        first_name: data.first_name,
        last_name: data.last_name,
        role: data.role,
      }));

      router.push("/");
    } catch (err: any) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-parchment-light p-8 rounded-3xl border border-slate-subtle shadow-lg space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-deep-teal text-[#EFEAE1] flex items-center justify-center mx-auto shadow-sm">
            <Compass className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-serif font-bold text-ink">Create Guest Account</h1>
          <p className="text-xs text-slate-muted">Instant bookings, digital e-vouchers, and verified reviews</p>
        </div>

        {error && (
          <div className="p-3 bg-alert-red/10 border border-alert-red/20 text-alert-red rounded-xl text-xs font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-muted">
                First Name
              </label>
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="John"
                className="w-full bg-parchment px-3.5 py-2.5 rounded-xl border border-slate-subtle text-sm text-ink font-medium focus:outline-none focus:border-deep-teal"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-muted">
                Last Name
              </label>
              <input
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Doe"
                className="w-full bg-parchment px-3.5 py-2.5 rounded-xl border border-slate-subtle text-sm text-ink font-medium focus:outline-none focus:border-deep-teal"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-muted">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full bg-parchment px-3.5 py-2.5 rounded-xl border border-slate-subtle text-sm text-ink font-medium focus:outline-none focus:border-deep-teal"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-muted">
              Phone Number (Optional)
            </label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="+263 77 123 4567"
              className="w-full bg-parchment px-3.5 py-2.5 rounded-xl border border-slate-subtle text-sm text-ink font-medium focus:outline-none focus:border-deep-teal"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-muted">
              Password (Min. 6 characters)
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-parchment px-3.5 py-2.5 rounded-xl border border-slate-subtle text-sm text-ink font-medium focus:outline-none focus:border-deep-teal"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-deep-teal hover:bg-deep-teal-hover disabled:opacity-50 text-[#EFEAE1] py-3 rounded-xl font-semibold text-sm shadow-md hover:shadow-lg transition-all"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="text-center text-xs text-slate-muted">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-deep-teal hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
