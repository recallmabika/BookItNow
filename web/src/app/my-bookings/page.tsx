"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Calendar, QrCode, CheckCircle2, Building, ArrowRight } from "lucide-react";

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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-serif font-bold text-ink">My Bookings</h1>
        <p className="text-xs text-slate-muted mt-1">
          Review your upcoming stays, digital e-vouchers, and past reservations
        </p>
      </div>

      {loading ? (
        <div className="py-12 text-center text-xs text-slate-muted">Loading your reservations...</div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-20 bg-parchment-light rounded-3xl border border-slate-subtle space-y-4">
          <Calendar className="w-12 h-12 text-slate-muted mx-auto" />
          <h3 className="font-serif font-bold text-xl text-ink">No bookings yet</h3>
          <p className="text-xs text-slate-muted max-w-sm mx-auto">
            You haven't made any reservations yet. Browse active lodgings and book instantly.
          </p>
          <Link
            href="/search"
            className="inline-flex items-center gap-2 bg-deep-teal hover:bg-deep-teal-hover text-[#EFEAE1] px-5 py-2.5 rounded-xl text-xs font-semibold shadow transition-all"
          >
            <span>Explore Stays</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => (
            <div
              key={b.id}
              className="bg-parchment-light p-6 rounded-2xl border border-slate-subtle shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-sm bg-parchment px-3 py-1 rounded-md border border-slate-subtle text-deep-teal">
                    {b.booking_reference}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-deep-teal bg-deep-teal/10 px-2.5 py-0.5 rounded-full capitalize">
                    <CheckCircle2 className="w-3 h-3" />
                    {b.status}
                  </span>
                </div>

                <div className="text-sm font-medium text-ink">
                  {b.rooms_count} room(s) • {b.adults_count} adult(s)
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-muted">
                  <Calendar className="w-3.5 h-3.5 text-deep-teal" />
                  <span>Check-in: <strong>{b.check_in_date}</strong></span>
                  <span>•</span>
                  <span>Check-out: <strong>{b.check_out_date}</strong></span>
                </div>
              </div>

              {/* Price & E-Voucher */}
              <div className="flex items-center gap-6 self-end md:self-center">
                <div className="text-right">
                  <div className="text-[10px] uppercase font-semibold text-slate-muted">Total Paid</div>
                  <div className="font-mono font-bold text-xl text-ink">
                    ${b.total_amount.toFixed(2)}
                  </div>
                  <div className="text-[10px] text-slate-muted">{b.currency}</div>
                </div>

                <div className="p-3 bg-parchment rounded-xl border border-slate-subtle flex flex-col items-center justify-center text-center">
                  <QrCode className="w-8 h-8 text-ink" />
                  <span className="text-[9px] uppercase font-mono font-semibold text-slate-muted mt-1">
                    Check-in QR
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
