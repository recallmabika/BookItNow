"use client";

import { useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { SkeletonRegisterForm } from "@/components/Skeleton";

function RegisterForm() {
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError("");
    setSuccessMessage("");
    const errors: Record<string, string> = {};

    if (!firstName.trim()) {
      errors.firstName = "Please enter your first name.";
    }
    if (!lastName.trim()) {
      errors.lastName = "Please enter your last name.";
    }
    if (!email.trim()) {
      errors.email = "Please enter your email address.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = "Please enter a valid email address.";
    }
    if (!password) {
      errors.password = "Please enter a password.";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters.";
    }
    if (!confirmPassword) {
      errors.confirmPassword = "Please confirm your password.";
    } else if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match.";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setGeneralError("Please complete all required fields correctly.");
      return;
    }

    setFieldErrors({});
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/api/v1/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          email: email.trim(),
          password,
          phone: phoneNumber.trim() || undefined,
          role: "GUEST",
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.detail || "Registration failed. Please check your details.");
      }

      setSuccessMessage("Account created successfully! Signing you in...");

      const loginRes = await fetch("http://localhost:8000/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      if (loginRes.ok) {
        const loginData = await loginRes.json();
        localStorage.setItem("bookitnow_token", loginData.access_token);
        localStorage.setItem(
          "bookitnow_user",
          JSON.stringify({
            id: loginData.user_id,
            email: loginData.email,
            first_name: loginData.first_name,
            last_name: loginData.last_name,
            role: loginData.role,
          })
        );
        router.push("/");
        setTimeout(() => {
          window.location.reload();
        }, 100);
      } else {
        router.push("/login?registered=true");
      }
    } catch (err: any) {
      setGeneralError(err.message || "Something went wrong during registration.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative z-10 w-full max-w-xl bg-transparent p-4 sm:p-6 space-y-6 text-left">
      <div className="text-left space-y-1">
        <h1 className="text-2xl font-medium tracking-tight text-white">Create Guest Account</h1>
        <p className="text-xs text-gray-300 font-normal">Instant bookings, transparent pricing, and digital check-in e-vouchers</p>
      </div>

      {/* Danger Error Banner */}
      {generalError && (
        <div className="p-3 bg-red-500/20 border border-red-500/40 text-red-200 rounded-xs text-xs font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
          <span>{generalError}</span>
        </div>
      )}

      {/* Success Banner */}
      {successMessage && (
        <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 rounded-xs text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>{successMessage}</span>
        </div>
      )}

      <form noValidate onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {/* First Name */}
          <div className="space-y-1">
            <label className="block text-[10px] font-medium uppercase tracking-wider text-gray-300">
              First Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => {
                setFirstName(e.target.value);
                if (fieldErrors.firstName) setFieldErrors((prev) => ({ ...prev, firstName: "" }));
              }}
              placeholder="Tatenda"
              className={`w-full bg-white/10 hover:bg-white/15 focus:bg-white/15 px-3.5 py-2.5 rounded-xs border ${
                fieldErrors.firstName
                  ? "border-red-400/80 bg-red-500/10 focus:border-red-400"
                  : "border-white/20 focus:border-white/50"
              } text-xs sm:text-sm text-white font-normal placeholder:text-gray-400 outline-none focus:outline-none focus:ring-0 transition-colors`}
            />
            {fieldErrors.firstName && (
              <p className="text-[11px] text-red-400 font-medium flex items-center gap-1 mt-1">
                <AlertCircle className="w-3 h-3 shrink-0" />
                <span>{fieldErrors.firstName}</span>
              </p>
            )}
          </div>

          {/* Last Name */}
          <div className="space-y-1">
            <label className="block text-[10px] font-medium uppercase tracking-wider text-gray-300">
              Last Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => {
                setLastName(e.target.value);
                if (fieldErrors.lastName) setFieldErrors((prev) => ({ ...prev, lastName: "" }));
              }}
              placeholder="Moyo"
              className={`w-full bg-white/10 hover:bg-white/15 focus:bg-white/15 px-3.5 py-2.5 rounded-xs border ${
                fieldErrors.lastName
                  ? "border-red-400/80 bg-red-500/10 focus:border-red-400"
                  : "border-white/20 focus:border-white/50"
              } text-xs sm:text-sm text-white font-normal placeholder:text-gray-400 outline-none focus:outline-none focus:ring-0 transition-colors`}
            />
            {fieldErrors.lastName && (
              <p className="text-[11px] text-red-400 font-medium flex items-center gap-1 mt-1">
                <AlertCircle className="w-3 h-3 shrink-0" />
                <span>{fieldErrors.lastName}</span>
              </p>
            )}
          </div>

          {/* Email Address */}
          <div className="space-y-1">
            <label className="block text-[10px] font-medium uppercase tracking-wider text-gray-300">
              Email Address <span className="text-red-400">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: "" }));
              }}
              placeholder="you@example.com"
              className={`w-full bg-white/10 hover:bg-white/15 focus:bg-white/15 px-3.5 py-2.5 rounded-xs border ${
                fieldErrors.email
                  ? "border-red-400/80 bg-red-500/10 focus:border-red-400"
                  : "border-white/20 focus:border-white/50"
              } text-xs sm:text-sm text-white font-normal placeholder:text-gray-400 outline-none focus:outline-none focus:ring-0 transition-colors`}
            />
            {fieldErrors.email && (
              <p className="text-[11px] text-red-400 font-medium flex items-center gap-1 mt-1">
                <AlertCircle className="w-3 h-3 shrink-0" />
                <span>{fieldErrors.email}</span>
              </p>
            )}
          </div>

          {/* Phone Number */}
          <div className="space-y-1">
            <label className="block text-[10px] font-medium uppercase tracking-wider text-gray-300">
              Phone (Optional)
            </label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="+263 77 123 4567"
              className="w-full bg-white/10 hover:bg-white/15 focus:bg-white/15 px-3.5 py-2.5 rounded-xs border border-white/20 focus:border-white/50 text-xs sm:text-sm text-white font-normal placeholder:text-gray-400 outline-none focus:outline-none focus:ring-0 transition-colors"
            />
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="block text-[10px] font-medium uppercase tracking-wider text-gray-300">
              Password (Min. 6 chars) <span className="text-red-400">*</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (fieldErrors.password) setFieldErrors((prev) => ({ ...prev, password: "" }));
              }}
              placeholder="••••••••"
              className={`w-full bg-white/10 hover:bg-white/15 focus:bg-white/15 px-3.5 py-2.5 rounded-xs border ${
                fieldErrors.password
                  ? "border-red-400/80 bg-red-500/10 focus:border-red-400"
                  : "border-white/20 focus:border-white/50"
              } text-xs sm:text-sm text-white font-normal placeholder:text-gray-400 outline-none focus:outline-none focus:ring-0 transition-colors`}
            />
            {fieldErrors.password && (
              <p className="text-[11px] text-red-400 font-medium flex items-center gap-1 mt-1">
                <AlertCircle className="w-3 h-3 shrink-0" />
                <span>{fieldErrors.password}</span>
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-1">
            <label className="block text-[10px] font-medium uppercase tracking-wider text-gray-300">
              Confirm Password <span className="text-red-400">*</span>
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (fieldErrors.confirmPassword) setFieldErrors((prev) => ({ ...prev, confirmPassword: "" }));
              }}
              placeholder="••••••••"
              className={`w-full bg-white/10 hover:bg-white/15 focus:bg-white/15 px-3.5 py-2.5 rounded-xs border ${
                fieldErrors.confirmPassword
                  ? "border-red-400/80 bg-red-500/10 focus:border-red-400"
                  : "border-white/20 focus:border-white/50"
              } text-xs sm:text-sm text-white font-normal placeholder:text-gray-400 outline-none focus:outline-none focus:ring-0 transition-colors`}
            />
            {fieldErrors.confirmPassword && (
              <p className="text-[11px] text-red-400 font-medium flex items-center gap-1 mt-1">
                <AlertCircle className="w-3 h-3 shrink-0" />
                <span>{fieldErrors.confirmPassword}</span>
              </p>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 bg-[#2563EB] hover:bg-[#1D4ED8] active:scale-[0.99] disabled:opacity-50 text-white py-3 rounded-xs font-semibold text-xs tracking-wide shadow-sm transition-all duration-150 cursor-pointer"
        >
          {loading ? "Creating Account..." : "Create Account"}
        </button>

        <div className="relative flex items-center justify-center my-3">
          <div className="border-t border-white/15 w-full" />
          <span className="bg-transparent px-3 text-[11px] uppercase tracking-wider text-gray-400 font-medium shrink-0">
            or register with
          </span>
          <div className="border-t border-white/15 w-full" />
        </div>

        {/* Google Sign Up Button */}
        <button
          type="button"
          onClick={() => {
            alert("Google Sign Up: Connect your Google Cloud Client ID to enable 1-tap registration.");
          }}
          className="w-full py-2.5 px-4 rounded-xs border border-white/20 bg-white/10 hover:bg-white/15 text-white font-medium text-xs flex items-center justify-center gap-2.5 shadow-xs transition-colors cursor-pointer"
        >
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
            />
          </svg>
          <span>Sign Up with Google</span>
        </button>
      </form>

      <p className="text-left text-xs text-gray-300 pt-1">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-blue-400 hover:underline">
          Sign In
        </Link>
      </p>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <div className="relative min-h-[calc(100vh-4.5rem)] flex items-center justify-center px-4 py-12 overflow-hidden bg-gray-900">
      {/* Background Image with subtle gradient scrim matching Why Book With Us */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Image
          src="/vicfalls-pillars.jpg"
          alt="Victoria Falls scenic landscape"
          fill
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/75" />
      </div>

      <div className="relative z-10 w-full flex items-center justify-center">
        <Suspense fallback={<SkeletonRegisterForm />}>
          <RegisterForm />
        </Suspense>
      </div>
    </div>
  );
}
