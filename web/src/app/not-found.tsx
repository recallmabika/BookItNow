import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-4.5rem)] flex items-center justify-center bg-white dark:bg-[#0B0F19] px-4 py-16 transition-colors">
      <div className="max-w-md w-full text-center space-y-6">
        {/* 404 Illustration */}
        <div className="relative w-64 h-64 mx-auto flex items-center justify-center">
          <Image
            src="/404.png"
            alt="Page not found"
            width={280}
            height={280}
            priority
            unoptimized
            className="object-contain w-auto h-auto max-w-full max-h-full"
          />
        </div>

        {/* Message */}
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">
            Page Not Found
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto leading-relaxed">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-2 flex justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold rounded-xs transition-colors shadow-xs"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
