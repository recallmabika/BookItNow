import React from "react";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse rounded bg-gray-200/80 dark:bg-gray-800/90 ${className}`}
    />
  );
}

// Table Skeleton Row matching user reference image
export function SkeletonTableRow() {
  return (
    <div className="flex items-center justify-between py-3.5 px-4 border-b border-gray-100 dark:border-gray-800/80">
      <div className="h-3 w-7/12 rounded bg-gray-200/80 dark:bg-gray-800 animate-pulse" />
      <div className="h-3 w-2/12 rounded bg-gray-200/80 dark:bg-gray-800 animate-pulse" />
    </div>
  );
}

// Full Table Skeleton Loader with multiple rows
export function SkeletonTable({ rows = 8 }: { rows?: number }) {
  return (
    <div className="w-full bg-white dark:bg-[#111827] rounded-xs border border-gray-200/80 dark:border-gray-800 overflow-hidden shadow-xs">
      {Array.from({ length: rows }).map((_, i) => (
        <SkeletonTableRow key={i} />
      ))}
    </div>
  );
}

// Property Card Skeleton for Search & Explorers
export function SkeletonPropertyCard() {
  return (
    <div className="bg-white dark:bg-[#111827] rounded-xs border border-gray-200/80 dark:border-gray-800 overflow-hidden flex flex-col">
      <div className="aspect-[16/10] bg-gray-200/70 dark:bg-gray-800 animate-pulse" />
      <div className="p-3.5 space-y-3">
        <div className="space-y-1.5">
          <div className="h-2.5 w-1/3 bg-gray-200/80 dark:bg-gray-800 rounded animate-pulse" />
          <div className="h-4 w-3/4 bg-gray-200/80 dark:bg-gray-800 rounded animate-pulse" />
          <div className="h-2.5 w-full bg-gray-200/70 dark:bg-gray-800/80 rounded animate-pulse mt-1" />
        </div>
        <div className="flex gap-1.5 pt-1">
          <div className="h-3 w-12 bg-gray-200/60 dark:bg-gray-800 rounded animate-pulse" />
          <div className="h-3 w-12 bg-gray-200/60 dark:bg-gray-800 rounded animate-pulse" />
        </div>
        <div className="pt-2.5 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <div className="h-4 w-20 bg-gray-200/80 dark:bg-gray-800 rounded animate-pulse" />
          <div className="h-6 w-20 bg-gray-200/80 dark:bg-gray-800 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
}

// Detail Page Skeleton
export function SkeletonPropertyDetail() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-pulse">
      <div className="space-y-2">
        <div className="h-3 w-28 bg-gray-200 dark:bg-gray-800 rounded" />
        <div className="h-7 w-2/5 bg-gray-200 dark:bg-gray-800 rounded" />
        <div className="h-3 w-1/4 bg-gray-200 dark:bg-gray-800 rounded" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 aspect-[21/9] w-full">
        <div className="md:col-span-2 bg-gray-200 dark:bg-gray-800 rounded-xs h-full min-h-[300px]" />
        <div className="grid grid-rows-2 gap-3 h-full">
          <div className="bg-gray-200 dark:bg-gray-800 rounded-xs" />
          <div className="bg-gray-200 dark:bg-gray-800 rounded-xs" />
        </div>
      </div>
    </div>
  );
}

// Login Form Skeleton for Auth Pages
export function SkeletonLoginForm() {
  return (
    <div className="w-full max-w-sm bg-transparent p-4 sm:p-6 space-y-5 animate-pulse">
      <div className="text-left space-y-2">
        <div className="h-7 w-44 bg-white/20 rounded-xs" />
        <div className="h-3.5 w-64 bg-white/10 rounded-xs" />
      </div>

      <div className="space-y-4 pt-2">
        <div className="space-y-2">
          <div className="h-3 w-24 bg-white/15 rounded-xs" />
          <div className="h-10 w-full bg-white/10 rounded-xs border border-white/10" />
        </div>

        <div className="space-y-2">
          <div className="h-3 w-20 bg-white/15 rounded-xs" />
          <div className="h-10 w-full bg-white/10 rounded-xs border border-white/10" />
        </div>

        <div className="h-10 w-full bg-blue-600/40 rounded-xs" />

        <div className="relative flex items-center justify-center my-4">
          <div className="border-t border-white/15 w-full" />
          <div className="h-3 w-28 bg-white/10 rounded-xs mx-3 shrink-0" />
          <div className="border-t border-white/15 w-full" />
        </div>

        <div className="h-10 w-full bg-white/10 rounded-xs border border-white/10" />
      </div>

      <div className="h-3.5 w-48 bg-white/15 rounded-xs mx-auto mt-4" />
    </div>
  );
}

// Register Form Skeleton for Auth Pages
export function SkeletonRegisterForm() {
  return (
    <div className="relative z-10 w-full max-w-xl bg-transparent p-4 sm:p-6 space-y-6 animate-pulse">
      <div className="text-left space-y-2">
        <div className="h-7 w-56 bg-white/20 rounded-xs" />
        <div className="h-3.5 w-72 bg-white/10 rounded-xs" />
      </div>

      <div className="space-y-4 pt-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="space-y-2">
            <div className="h-3 w-20 bg-white/15 rounded-xs" />
            <div className="h-10 w-full bg-white/10 rounded-xs border border-white/10" />
          </div>
          <div className="space-y-2">
            <div className="h-3 w-20 bg-white/15 rounded-xs" />
            <div className="h-10 w-full bg-white/10 rounded-xs border border-white/10" />
          </div>
          <div className="space-y-2">
            <div className="h-3 w-24 bg-white/15 rounded-xs" />
            <div className="h-10 w-full bg-white/10 rounded-xs border border-white/10" />
          </div>
          <div className="space-y-2">
            <div className="h-3 w-24 bg-white/15 rounded-xs" />
            <div className="h-10 w-full bg-white/10 rounded-xs border border-white/10" />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <div className="h-3 w-20 bg-white/15 rounded-xs" />
            <div className="h-10 w-full bg-white/10 rounded-xs border border-white/10" />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <div className="h-3 w-24 bg-white/15 rounded-xs" />
            <div className="grid grid-cols-2 gap-3">
              <div className="h-10 bg-white/10 rounded-xs border border-white/10" />
              <div className="h-10 bg-white/10 rounded-xs border border-white/10" />
            </div>
          </div>
        </div>

        <div className="h-10 w-full bg-blue-600/40 rounded-xs" />

        <div className="relative flex items-center justify-center my-4">
          <div className="border-t border-white/15 w-full" />
          <div className="h-3 w-28 bg-white/10 rounded-xs mx-3 shrink-0" />
          <div className="border-t border-white/15 w-full" />
        </div>

        <div className="h-10 w-full bg-white/10 rounded-xs border border-white/10" />
      </div>

      <div className="h-3.5 w-48 bg-white/15 rounded-xs mx-auto mt-4" />
    </div>
  );
}

// Admin Dashboard Skeleton UI
export function SkeletonAdminDashboard() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#070B14] animate-pulse">
      {/* Header Skeleton */}
      <div className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0B101E] px-4 sm:px-8 py-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="h-4 w-32 bg-gray-200 dark:bg-gray-800 rounded" />
            <div className="h-8 w-72 bg-gray-200 dark:bg-gray-800 rounded" />
            <div className="h-3 w-80 bg-gray-200 dark:bg-gray-800 rounded" />
          </div>
          <div className="flex gap-3">
            <div className="h-9 w-32 bg-gray-200 dark:bg-gray-800 rounded" />
            <div className="h-9 w-40 bg-gray-200 dark:bg-gray-800 rounded" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
        {/* 4 Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="p-5 bg-white dark:bg-[#0B101E] border border-gray-200 dark:border-gray-800 rounded-xs space-y-3">
              <div className="flex justify-between">
                <div className="h-3 w-20 bg-gray-200 dark:bg-gray-800 rounded" />
                <div className="h-4 w-4 bg-gray-200 dark:bg-gray-800 rounded" />
              </div>
              <div className="h-8 w-24 bg-gray-200 dark:bg-gray-800 rounded" />
              <div className="h-2.5 w-32 bg-gray-200 dark:bg-gray-800 rounded" />
            </div>
          ))}
        </div>

        {/* Tab Header Skeleton */}
        <div className="flex gap-6 border-b border-gray-200 dark:border-gray-800 pb-3">
          <div className="h-4 w-36 bg-gray-200 dark:bg-gray-800 rounded" />
          <div className="h-4 w-36 bg-gray-200 dark:bg-gray-800 rounded" />
        </div>

        {/* Search / Filter bar skeleton */}
        <div className="flex justify-between gap-4">
          <div className="h-9 w-72 bg-gray-200 dark:bg-gray-800 rounded" />
          <div className="h-9 w-32 bg-gray-200 dark:bg-gray-800 rounded" />
        </div>

        {/* Table Skeleton */}
        <div className="border border-gray-200 dark:border-gray-800 rounded-xs bg-white dark:bg-[#0B101E] overflow-hidden">
          <div className="h-10 bg-gray-100 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800" />
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="p-4 border-b border-gray-100 dark:border-gray-800/60 flex items-center justify-between">
              <div className="space-y-1.5 w-1/3">
                <div className="h-3.5 w-48 bg-gray-200 dark:bg-gray-800 rounded" />
                <div className="h-2 w-28 bg-gray-200 dark:bg-gray-800 rounded" />
              </div>
              <div className="h-3 w-24 bg-gray-200 dark:bg-gray-800 rounded" />
              <div className="h-3 w-20 bg-gray-200 dark:bg-gray-800 rounded" />
              <div className="h-5 w-16 bg-gray-200 dark:bg-gray-800 rounded-full" />
              <div className="h-6 w-24 bg-gray-200 dark:bg-gray-800 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Inventory Manager Skeleton UI
export function SkeletonInventoryManager() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#070B14] animate-pulse">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0B101E] px-4 sm:px-8 py-6">
        <div className="max-w-7xl mx-auto space-y-2">
          <div className="h-3 w-32 bg-gray-200 dark:bg-gray-800 rounded" />
          <div className="h-8 w-64 bg-gray-200 dark:bg-gray-800 rounded" />
          <div className="h-3 w-80 bg-gray-200 dark:bg-gray-800 rounded" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column Skeleton */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white dark:bg-[#0B101E] border border-gray-200 dark:border-gray-800 rounded-xs p-5 space-y-4">
              <div className="h-3 w-28 bg-gray-200 dark:bg-gray-800 rounded" />
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-14 bg-gray-100 dark:bg-gray-800 rounded-xs" />
                ))}
              </div>
            </div>
            <div className="bg-white dark:bg-[#0B101E] border border-gray-200 dark:border-gray-800 rounded-xs p-5 space-y-4">
              <div className="h-3 w-28 bg-gray-200 dark:bg-gray-800 rounded" />
              <div className="space-y-2">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="h-12 bg-gray-100 dark:bg-gray-800 rounded-xs" />
                ))}
              </div>
            </div>
          </div>

          {/* Right Main Form Skeleton */}
          <div className="lg:col-span-8">
            <div className="bg-white dark:bg-[#0B101E] border border-gray-200 dark:border-gray-800 rounded-xs p-6 sm:p-8 space-y-6">
              <div className="space-y-2 border-b border-gray-100 dark:border-gray-800 pb-5">
                <div className="h-3 w-32 bg-gray-200 dark:bg-gray-800 rounded" />
                <div className="h-6 w-48 bg-gray-200 dark:bg-gray-800 rounded" />
                <div className="h-3 w-64 bg-gray-200 dark:bg-gray-800 rounded" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="h-10 bg-gray-100 dark:bg-gray-800 rounded-xs" />
                <div className="h-10 bg-gray-100 dark:bg-gray-800 rounded-xs" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="h-10 bg-gray-100 dark:bg-gray-800 rounded-xs" />
                <div className="h-10 bg-gray-100 dark:bg-gray-800 rounded-xs" />
              </div>
              <div className="h-14 bg-gray-100 dark:bg-gray-800 rounded-xs" />
              <div className="flex justify-end">
                <div className="h-10 w-44 bg-blue-600/30 rounded-xs" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

