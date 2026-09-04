"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchPropertyBySlug, createRealBooking } from "@/lib/api";
import { MapPin, Check, ShieldCheck, Calendar, Users, QrCode, CreditCard, Sparkles } from "lucide-react";

export default function PropertyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [roomsCount, setRoomsCount] = useState(1);
  const [guestsCount, setGuestsCount] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("ecocash");
  const [bookingSuccess, setBookingSuccess] = useState<any>(null);
  const [bookingError, setBookingError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function load() {
      if (!slug) return;
      setLoading(true);
      const data = await fetchPropertyBySlug(slug);
      setProperty(data);
      if (data?.room_types?.length > 0) {
        setSelectedRoom(data.room_types[0]);
      }
      setLoading(false);
    }
    load();
  }, [slug]);

  // Set default dates (tomorrow to day after tomorrow)
  useEffect(() => {
    const today = new Date();
    const d1 = new Date(today);
    d1.setDate(today.getDate() + 1);
    const d2 = new Date(today);
    d2.setDate(today.getDate() + 3);
    setCheckIn(d1.toISOString().split("T")[0]);
    setCheckOut(d2.toISOString().split("T")[0]);
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-8 h-8 border-2 border-deep-teal border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs text-slate-muted">Loading live property availability...</p>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-serif font-bold text-ink">Property Not Found</h2>
        <p className="text-xs text-slate-muted">The requested lodging could not be retrieved from the database.</p>
      </div>
    );
  }

  // Calculate pricing breakdown
  const nights = checkIn && checkOut
    ? Math.max(1, Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 3600 * 24)))
    : 1;
  const nightlyRate = selectedRoom ? selectedRoom.base_price_per_night : 0;
  const subtotal = nightlyRate * nights * roomsCount;
  const taxes = Number((subtotal * 0.10).toFixed(2));
  const platformFee = Number((subtotal * 0.05).toFixed(2));
  const total = Number((subtotal + taxes + platformFee).toFixed(2));

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookingError("");
    setSubmitting(true);

    const token = localStorage.getItem("bookitnow_token");
    if (!token) {
      // Prompt user to login or register
      router.push(`/login?redirect=/properties/${slug}`);
      return;
    }

    try {
      const idempotencyKey = `idemp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      const result = await createRealBooking({
        room_type_id: selectedRoom.id,
        rate_plan_id: selectedRoom.rate_plans?.[0]?.id,
        check_in_date: checkIn,
        check_out_date: checkOut,
        rooms_count: roomsCount,
        adults_count: guestsCount,
        children_count: 0,
        payment_method: paymentMethod,
        idempotency_key: idempotencyKey,
        token: token,
      });

      setBookingSuccess(result);
    } catch (err: any) {
      setBookingError(err.message || "Failed to complete reservation");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Property Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs text-slate-muted">
          <span className="uppercase tracking-wider font-semibold text-ochre">{property.property_type}</span>
          <span>•</span>
          <span className="flex items-center gap-1 text-ink">
            <MapPin className="w-3.5 h-3.5 text-deep-teal" />
            {property.address_line}, {property.city}, {property.country}
          </span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-serif font-bold text-ink">{property.title}</h1>
      </div>

      {/* Main Photo Gallery */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 rounded-3xl overflow-hidden aspect-[21/9] bg-ink/10 border border-slate-subtle">
        <div
          className="md:col-span-2 bg-cover bg-center min-h-[300px]"
          style={{
            backgroundImage: `url(${property.photos?.[0] || "/placeholder-stay.jpg"})`,
            backgroundColor: "#1C1E1B",
          }}
        />
        <div className="hidden md:grid grid-rows-2 gap-4">
          <div
            className="bg-cover bg-center"
            style={{
              backgroundImage: `url(${property.photos?.[1] || property.photos?.[0] || "/placeholder-stay.jpg"})`,
              backgroundColor: "#2C2E2B",
            }}
          />
          <div
            className="bg-cover bg-center"
            style={{
              backgroundImage: `url(${property.photos?.[2] || property.photos?.[0] || "/placeholder-stay.jpg"})`,
              backgroundColor: "#3C3E3B",
            }}
          />
        </div>
      </div>

      {/* Content & Booking Engine Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left: Details, Rooms, Amenities, Policies */}
        <div className="lg:col-span-2 space-y-10">
          {/* Description */}
          <div className="bg-parchment-light p-6 sm:p-8 rounded-3xl border border-slate-subtle space-y-4">
            <h2 className="font-serif font-bold text-xl text-ink">About this property</h2>
            <p className="text-sm text-slate-muted leading-relaxed whitespace-pre-line">
              {property.description}
            </p>
          </div>

          {/* Room Selection */}
          <div className="space-y-4">
            <h2 className="font-serif font-bold text-2xl text-ink">Select Your Room</h2>
            <div className="space-y-4">
              {property.room_types?.map((room: any) => {
                const isSelected = selectedRoom?.id === room.id;
                return (
                  <div
                    key={room.id}
                    onClick={() => setSelectedRoom(room)}
                    className={`p-6 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                      isSelected
                        ? "border-deep-teal bg-deep-teal/5 shadow-sm"
                        : "border-slate-subtle bg-parchment-light hover:border-deep-teal/50"
                    }`}
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className={`w-4 h-4 rounded-full border flex items-center justify-center ${isSelected ? "border-deep-teal bg-deep-teal" : "border-slate-subtle"}`}>
                          {isSelected && <Check className="w-3 h-3 text-[#EFEAE1]" />}
                        </span>
                        <h3 className="font-serif font-bold text-lg text-ink">{room.name}</h3>
                      </div>
                      <p className="text-xs text-slate-muted max-w-md">{room.description}</p>
                      <div className="flex items-center gap-3 text-xs text-slate-muted pt-1">
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5 text-deep-teal" />
                          Up to {room.max_adults} adults
                        </span>
                        <span>•</span>
                        <span>{room.total_rooms} total rooms</span>
                      </div>
                    </div>

                    <div className="text-right sm:self-center shrink-0">
                      <span className="font-mono font-bold text-xl text-ink">
                        ${room.base_price_per_night.toFixed(2)}
                      </span>
                      <span className="text-xs text-slate-muted block">per night</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Amenities */}
          {property.amenities?.length > 0 && (
            <div className="bg-parchment-light p-6 sm:p-8 rounded-3xl border border-slate-subtle space-y-4">
              <h2 className="font-serif font-bold text-xl text-ink">Amenities & Facilities</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {property.amenities.map((item: string, idx: number) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-ink font-medium">
                    <div className="w-5 h-5 rounded-full bg-deep-teal/10 text-deep-teal flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3" />
                    </div>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Check-in / Cancellation Policies */}
          <div className="bg-parchment-light p-6 sm:p-8 rounded-3xl border border-slate-subtle space-y-4 text-xs text-slate-muted">
            <h2 className="font-serif font-bold text-xl text-ink">House Rules & Policies</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="font-semibold text-ink block">Check-in / Check-out</span>
                Check-in from {property.check_in_time} • Check-out until {property.check_out_time}
              </div>
              <div>
                <span className="font-semibold text-ink block">Cancellation Policy</span>
                <span className="capitalize">{property.cancellation_policy}</span> cancellation
              </div>
            </div>
          </div>
        </div>

        {/* Right: Instant Booking Checkout Card */}
        <div>
          <div className="sticky top-28 bg-parchment-light p-6 sm:p-8 rounded-3xl border border-slate-subtle shadow-lg space-y-6">
            {bookingSuccess ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-12 h-12 rounded-full bg-deep-teal text-[#EFEAE1] flex items-center justify-center mx-auto shadow-md">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="font-serif font-bold text-2xl text-ink">Booking Confirmed!</h3>
                <p className="text-xs text-slate-muted">
                  Your reservation is locked in the host calendar.
                </p>
                <div className="bg-parchment p-4 rounded-xl border border-slate-subtle text-left space-y-2">
                  <div className="text-[11px] text-slate-muted uppercase tracking-wider font-semibold">
                    Booking Reference
                  </div>
                  <div className="font-mono font-bold text-xl text-deep-teal">
                    {bookingSuccess.booking_reference}
                  </div>
                  <div className="text-xs text-slate-muted">
                    Total Paid: ${bookingSuccess.total_amount.toFixed(2)}
                  </div>
                </div>
                <button
                  onClick={() => router.push("/my-bookings")}
                  className="w-full bg-deep-teal hover:bg-deep-teal-hover text-[#EFEAE1] py-3 rounded-xl font-semibold text-xs transition-all shadow"
                >
                  View in My Bookings
                </button>
              </div>
            ) : (
              <form onSubmit={handleBooking} className="space-y-5">
                <div className="flex items-baseline justify-between border-b border-slate-subtle pb-4">
                  <div>
                    <span className="font-mono font-bold text-2xl text-ink">
                      ${nightlyRate.toFixed(2)}
                    </span>
                    <span className="text-xs text-slate-muted"> / night</span>
                  </div>
                  <span className="text-xs font-semibold text-deep-teal">
                    Instant Booking
                  </span>
                </div>

                {/* Dates Selection */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-parchment p-2.5 rounded-xl border border-slate-subtle">
                    <label className="block text-[10px] uppercase font-semibold text-slate-muted">Check-in</label>
                    <input
                      type="date"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      required
                      className="w-full bg-transparent text-xs font-medium text-ink focus:outline-none"
                    />
                  </div>
                  <div className="bg-parchment p-2.5 rounded-xl border border-slate-subtle">
                    <label className="block text-[10px] uppercase font-semibold text-slate-muted">Check-out</label>
                    <input
                      type="date"
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      required
                      className="w-full bg-transparent text-xs font-medium text-ink focus:outline-none"
                    />
                  </div>
                </div>

                {/* Rooms & Guests */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-parchment p-2.5 rounded-xl border border-slate-subtle">
                    <label className="block text-[10px] uppercase font-semibold text-slate-muted">Rooms</label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={roomsCount}
                      onChange={(e) => setRoomsCount(parseInt(e.target.value, 10) || 1)}
                      className="w-full bg-transparent text-xs font-medium text-ink focus:outline-none"
                    />
                  </div>
                  <div className="bg-parchment p-2.5 rounded-xl border border-slate-subtle">
                    <label className="block text-[10px] uppercase font-semibold text-slate-muted">Guests</label>
                    <input
                      type="number"
                      min="1"
                      max="20"
                      value={guestsCount}
                      onChange={(e) => setGuestsCount(parseInt(e.target.value, 10) || 1)}
                      className="w-full bg-transparent text-xs font-medium text-ink focus:outline-none"
                    />
                  </div>
                </div>

                {/* Payment Option Selection */}
                <div className="space-y-2 pt-2">
                  <label className="block text-[11px] font-semibold text-ink uppercase tracking-wider">
                    Payment Method
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "ecocash", label: "EcoCash" },
                      { id: "paynow", label: "Paynow" },
                      { id: "card", label: "Card" },
                    ].map((method) => (
                      <button
                        type="button"
                        key={method.id}
                        onClick={() => setPaymentMethod(method.id)}
                        className={`py-2 px-2 rounded-xl text-xs font-medium border text-center transition-all ${
                          paymentMethod === method.id
                            ? "border-deep-teal bg-deep-teal text-[#EFEAE1]"
                            : "border-slate-subtle bg-parchment text-ink hover:border-deep-teal/50"
                        }`}
                      >
                        {method.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Transparent Breakdown (per README) */}
                <div className="bg-parchment/70 p-4 rounded-xl border border-slate-subtle space-y-2 text-xs">
                  <div className="flex justify-between text-slate-muted">
                    <span>${nightlyRate.toFixed(2)} × {nights} night(s) × {roomsCount} room(s)</span>
                    <span className="font-mono text-ink">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-muted">
                    <span>Taxes & VAT (10%)</span>
                    <span className="font-mono text-ink">${taxes.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-muted">
                    <span>Platform Service Fee (5%)</span>
                    <span className="font-mono text-ink">${platformFee.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-slate-subtle pt-2 flex justify-between font-bold text-sm text-ink">
                    <span>Total (No hidden fees)</span>
                    <span className="font-mono text-deep-teal">${total.toFixed(2)}</span>
                  </div>
                </div>

                {bookingError && (
                  <div className="p-3 bg-alert-red/10 border border-alert-red/20 text-alert-red rounded-xl text-xs font-medium">
                    {bookingError}
                  </div>
                )}

                {/* Confirm Button */}
                <button
                  type="submit"
                  disabled={submitting || !selectedRoom}
                  className="w-full bg-deep-teal hover:bg-deep-teal-hover disabled:opacity-50 text-[#EFEAE1] py-3.5 rounded-xl font-semibold text-sm shadow-md hover:shadow-lg transition-all"
                >
                  {submitting ? "Securing Reservation..." : "Confirm & Instant Book"}
                </button>

                <p className="text-[11px] text-center text-slate-muted">
                  Instant lock in real calendar • No cancellation fees up to 48 hours before check-in
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
