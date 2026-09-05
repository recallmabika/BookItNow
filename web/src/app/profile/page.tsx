"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Camera, User, Mail, Phone, ShieldCheck, CheckCircle2, ArrowLeft } from "lucide-react";
import { SkeletonTable } from "@/components/Skeleton";

interface UserProfile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number?: string;
  role: string;
  avatar?: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [avatar, setAvatar] = useState<string | undefined>(undefined);
  const [savedMsg, setSavedMsg] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem("bookitnow_user");
    if (!raw) {
      router.push("/login");
      return;
    }
    try {
      const parsed = JSON.parse(raw);
      setUser(parsed);
      setFirstName(parsed.first_name || "");
      setLastName(parsed.last_name || "");
      setPhoneNumber(parsed.phone_number || "");
      setAvatar(parsed.avatar);
    } catch {
      router.push("/login");
    }
  }, [router]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setAvatar(base64);
        if (user) {
          const updated = { ...user, avatar: base64 };
          setUser(updated);
          localStorage.setItem("bookitnow_user", JSON.stringify(updated));
          window.dispatchEvent(new Event("storage"));
          setSavedMsg("Profile photo updated successfully!");
          setTimeout(() => setSavedMsg(""), 3500);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const updated = {
      ...user,
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      phone_number: phoneNumber.trim(),
      avatar: avatar,
    };
    setUser(updated);
    localStorage.setItem("bookitnow_user", JSON.stringify(updated));
    window.dispatchEvent(new Event("storage"));
    setSavedMsg("Profile details saved successfully!");
    setTimeout(() => setSavedMsg(""), 3500);
  };

  if (!user) {
    return (
      <div className="min-h-[calc(100vh-4.5rem)] bg-white dark:bg-[#0B0F19] py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="h-4 w-28 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
          <SkeletonTable rows={6} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4.5rem)] bg-white dark:bg-[#0B0F19] py-10 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-3xl mx-auto">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-[#2563EB] dark:hover:text-blue-400 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Explorer</span>
          </Link>
        </div>

        {/* Profile Card */}
        <div className="bg-white dark:bg-[#111827] rounded-xs border border-gray-200/90 dark:border-gray-800 shadow-xs overflow-hidden transition-colors">
          {/* Header Banner */}
          <div className="bg-[#2563EB] h-32 px-6 sm:px-8 relative flex items-end pb-4">
            <div className="text-white">
              <h1 className="text-xl font-semibold tracking-tight">Personal Profile</h1>
              <p className="text-xs text-blue-100/80 mt-0.5">
                Manage your account credentials and personal information
              </p>
            </div>
          </div>

          <div className="px-6 sm:px-8 pb-8 pt-6">
            {savedMsg && (
              <div className="mb-6 p-3 bg-[#EFF6FF] border border-blue-200 rounded-xs flex items-center gap-2 text-xs text-[#2563EB]">
                <CheckCircle2 className="w-4 h-4 text-[#2563EB] shrink-0" />
                <span>{savedMsg}</span>
              </div>
            )}

            {/* Profile Avatar & Upload Section */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pb-8 border-b border-gray-100 dark:border-gray-800">
              <div className="relative group">
                {avatar ? (
                  <img
                    src={avatar}
                    alt={user.first_name}
                    className="w-24 h-24 rounded-xs object-cover border-2 border-gray-200 dark:border-gray-700 shadow-xs"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-xs bg-[#EFF6FF] dark:bg-blue-950/40 text-[#2563EB] dark:text-blue-400 flex items-center justify-center font-bold text-3xl border border-blue-200 dark:border-blue-900/50">
                    {user.first_name[0]?.toUpperCase()}
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 bg-black/40 text-white rounded-xs opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-1 transition-opacity cursor-pointer"
                  title="Click to upload a new profile photo"
                >
                  <Camera className="w-5 h-5 stroke-[2]" />
                  <span className="text-[10px] font-medium">Change Photo</span>
                </button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />

              <div className="flex-1 text-center sm:text-left">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                    {user.first_name} {user.last_name || ""}
                  </h2>
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    • {user.role === "guest" || user.role === "GUEST" ? "Guest Account" : `${user.role.charAt(0).toUpperCase() + user.role.slice(1).toLowerCase()} Account`}
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{user.email}</p>

                <div className="mt-4 flex flex-wrap gap-2 justify-center sm:justify-start">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#2563EB] text-white text-xs font-medium rounded-xs hover:bg-[#1D4ED8] transition-colors cursor-pointer"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Upload New Photo</span>
                  </button>
                  {avatar && (
                    <button
                      type="button"
                      onClick={() => {
                        setAvatar(undefined);
                        if (user) {
                          const updated = { ...user, avatar: undefined };
                          setUser(updated);
                          localStorage.setItem("bookitnow_user", JSON.stringify(updated));
                          window.dispatchEvent(new Event("storage"));
                          setSavedMsg("Profile photo removed.");
                          setTimeout(() => setSavedMsg(""), 3500);
                        }
                      }}
                      className="px-3 py-2 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 text-xs font-medium rounded-xs hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-2">
                  JPG, PNG, or WEBP up to 2MB. Square format recommended.
                </p>
              </div>
            </div>

            {/* Profile Form Details */}
            <form onSubmit={handleSaveProfile} className="pt-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    First Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-gray-400 dark:text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs border border-gray-300 dark:border-gray-700 rounded-xs bg-white dark:bg-gray-900/60 text-gray-900 dark:text-white outline-none focus:outline-none focus:ring-0 focus:border-[#2563EB] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Last Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-gray-400 dark:text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs border border-gray-300 dark:border-gray-700 rounded-xs bg-white dark:bg-gray-900/60 text-gray-900 dark:text-white outline-none focus:outline-none focus:ring-0 focus:border-[#2563EB] transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-gray-400 dark:text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      disabled
                      value={user.email}
                      className="w-full pl-9 pr-3 py-2 text-xs border border-gray-200 dark:border-gray-800 rounded-xs bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 cursor-not-allowed outline-none focus:outline-none focus:ring-0"
                    />
                  </div>
                  <span className="text-[10px] text-gray-400 dark:text-gray-500 mt-1 block">
                    Contact support to update verified email.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-gray-400 dark:text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      placeholder="+263 77 123 4567"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs border border-gray-300 dark:border-gray-700 rounded-xs bg-white dark:bg-gray-900/60 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 outline-none focus:outline-none focus:border-[#2563EB] transition-colors focus:ring-0"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#2563EB] text-white text-xs font-semibold rounded-xs hover:bg-[#1D4ED8] active:bg-[#1E40AF] transition-colors cursor-pointer shadow-xs"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
