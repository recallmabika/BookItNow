"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Calendar, QrCode, CheckCircle2, ArrowRight } from "lucide-react";
import { SkeletonTable } from "@/components/Skeleton";

export default function MyBookingsPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("bookitnow_token");
    if (!token) {
      router.push("/login?redirect=/my-bookings");
      return;
    }

    async function load() {
      try {
        const res = await fetch("http://localhost:8000/api/v1/bookings/my-bookings", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          setBookings(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [router]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">My Bookings</h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          Review your upcoming stays, digital e-vouchers, and past reservations
        </p>
      </div>

      {loading ? (
        <div className="space-y-4">
          <SkeletonTable rows={7} />
        </div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-[#111827] rounded-xs border border-gray-200/80 dark:border-gray-800 space-y-4 shadow-xs transition-colors">
          <div className="w-12 h-12 rounded-full bg-[#EFF6FF] dark:bg-blue-950/40 text-[#2563EB] dark:text-blue-400 flex items-center justify-center mx-auto">
            <Calendar className="w-6 h-6 stroke-[1.8]" />
          </div>
          <div>
            <h3 className="font-semibold text-lg text-gray-900 dark:text-white">No bookings yet</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm mx-auto mt-1 leading-relaxed">
              You haven't made any reservations yet. Browse active lodgings and book instantly.
            </p>
          </div>
          <Link
            href="/search"
            className="inline-flex items-center gap-1.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-5 py-2.5 rounded-xs text-xs font-medium shadow-xs transition-all duration-150 cursor-pointer"
          >
            <span>Explore Stays</span>
            <ArrowRight className="w-3.5 h-3.5 stroke-[2]" />
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {bookings.map((b) => (
            <div
              key={b.id}
              className="bg-white dark:bg-[#111827] p-4 sm:p-5 rounded-xs border border-gray-200 dark:border-gray-800 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-colors"
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-xs bg-gray-50 dark:bg-gray-800 px-2.5 py-0.5 rounded border border-gray-200 dark:border-gray-700 text-[#2563EB] dark:text-blue-400">
                    {b.booking_reference}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#2563EB] dark:text-blue-400 bg-[#EFF6FF] dark:bg-blue-950/50 px-2 py-0.5 rounded-full capitalize">
                    <CheckCircle2 className="w-3 h-3" />
                    {b.status}
                  </span>
                </div>

                <div className="text-xs font-medium text-gray-900 dark:text-white">
                  {b.rooms_count} room(s) • {b.adults_count} adult(s)
                </div>

                <div className="flex items-center gap-2 text-[11px] text-gray-500 dark:text-gray-400">
                  <Calendar className="w-3.5 h-3.5 text-[#2563EB] dark:text-blue-400" />
                  <span>Check-in: <strong>{b.check_in_date}</strong></span>
                  <span>•</span>
                  <span>Check-out: <strong>{b.check_out_date}</strong></span>
                </div>
              </div>

              {/* Price & E-Voucher */}
              <div className="flex items-center gap-4 self-end md:self-center">
                <div className="text-right">
                  <div className="text-[9px] uppercase font-semibold text-gray-400">Total Paid</div>
                  <div className="font-mono font-bold text-base text-gray-900 dark:text-white">
                    ${b.total_amount.toFixed(2)}
                  </div>
                  <div className="text-[10px] text-gray-400">{b.currency}</div>
                </div>

                <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-xs border border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center text-center">
                  <QrCode className="w-6 h-6 text-gray-900 dark:text-white" />
                  <span className="text-[8px] uppercase font-mono font-semibold text-gray-400 dark:text-gray-400 mt-0.5">
                    E-Voucher
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
