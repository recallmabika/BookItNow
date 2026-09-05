"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchPropertyBySlug, createRealBooking } from "@/lib/api";
import { MapPin, Check, ShieldCheck, Users, ArrowLeft } from "lucide-react";
import Link from "next/link";

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
        <div className="w-7 h-7 border-2 border-[#0F5132] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs text-gray-500">Checking live room availability...</p>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-3">
        <h2 className="text-xl font-serif font-bold text-gray-900">Property Not Found</h2>
        <p className="text-xs text-gray-500">The requested lodging could not be found.</p>
        <Link href="/search" className="inline-block text-xs font-semibold text-[#0F5132] hover:underline">
          ← Back to Search
        </Link>
      </div>
    );
  }

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back link */}
      <div>
        <Link
          href="/search"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-[#0F5132] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Stays</span>
        </Link>
      </div>

      {/* Property Header */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span className="uppercase tracking-wider font-semibold text-[#0F5132] bg-[#E8F5E9] px-2 py-0.5 rounded text-[10px]">
            {property.property_type}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1 text-gray-700">
            <MapPin className="w-3.5 h-3.5 text-[#0F5132]" />
            {property.address_line}, {property.city}, {property.country}
          </span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-serif font-bold text-gray-900">{property.title}</h1>
      </div>

      {/* Main Photo Gallery */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 rounded-2xl overflow-hidden aspect-[21/9] bg-gray-900 border border-gray-200">
        <div
          className="md:col-span-2 bg-cover bg-center min-h-[260px]"
          style={{
            backgroundImage: `url(${property.photos?.[0] || "/placeholder-stay.jpg"})`,
            backgroundColor: "#111827",
          }}
        />
        <div className="hidden md:grid grid-rows-2 gap-3">
          <div
            className="bg-cover bg-center"
            style={{
              backgroundImage: `url(${property.photos?.[1] || property.photos?.[0] || "/placeholder-stay.jpg"})`,
              backgroundColor: "#1F2937",
            }}
          />
          <div
            className="bg-cover bg-center"
            style={{
              backgroundImage: `url(${property.photos?.[2] || property.photos?.[0] || "/placeholder-stay.jpg"})`,
              backgroundColor: "#374151",
            }}
          />
        </div>
      </div>

      {/* Content & Booking Engine Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Details, Rooms, Amenities */}
        <div className="lg:col-span-2 space-y-8">
          {/* Description */}
          <div className="bg-white p-6 rounded-xl border border-gray-200/80 space-y-3 shadow-xs">
            <h2 className="font-semibold text-base text-gray-900">About this property</h2>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed whitespace-pre-line">
              {property.description}
            </p>
          </div>

          {/* Room Selection */}
          <div className="space-y-3">
            <h2 className="font-semibold text-lg text-gray-900">Select Your Room</h2>
            <div className="space-y-3">
              {property.room_types?.map((room: any) => {
                const isSelected = selectedRoom?.id === room.id;
                return (
                  <div
                    key={room.id}
                    onClick={() => setSelectedRoom(room)}
                    className={`p-4 rounded-xl border transition-all duration-150 cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                      isSelected
                        ? "border-[#0F5132] bg-[#E8F5E9]/40 shadow-xs"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${isSelected ? "border-[#0F5132] bg-[#0F5132]" : "border-gray-300"}`}>
                          {isSelected && <Check className="w-2.5 h-2.5 text-white" />}
                        </span>
                        <h3 className="font-semibold text-sm text-gray-900">{room.name}</h3>
                      </div>
                      <p className="text-xs text-gray-500 max-w-md">{room.description}</p>
                      <div className="flex items-center gap-2 text-[11px] text-gray-500 pt-0.5">
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3 text-[#0F5132]" />
                          Up to {room.max_adults} adults
                        </span>
                        <span>•</span>
                        <span>{room.total_rooms} rooms in inventory</span>
                      </div>
                    </div>

                    <div className="text-right sm:self-center shrink-0">
                      <span className="font-mono font-bold text-lg text-gray-900">
                        ${room.base_price_per_night.toFixed(2)}
                      </span>
                      <span className="text-[11px] text-gray-500 block">per night</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Amenities */}
          {property.amenities?.length > 0 && (
            <div className="bg-white p-6 rounded-xl border border-gray-200/80 space-y-3 shadow-xs">
              <h2 className="font-semibold text-base text-gray-900">Amenities & Facilities</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {property.amenities.map((item: string, idx: number) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-gray-700">
                    <div className="w-4 h-4 rounded-full bg-[#E8F5E9] text-[#0F5132] flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5" />
                    </div>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Instant Booking Checkout Card */}
        <div>
          <div className="sticky top-24 bg-white p-5 rounded-xl border border-gray-200/90 shadow-xs space-y-5">
            {bookingSuccess ? (
              <div className="text-center py-6 space-y-3">
                <div className="w-10 h-10 rounded-full bg-[#0F5132] text-white flex items-center justify-center mx-auto shadow-xs">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="font-serif font-bold text-xl text-gray-900">Booking Confirmed</h3>
                <p className="text-xs text-gray-500">
                  Your reservation is confirmed in the host calendar.
                </p>
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-left space-y-1">
                  <div className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">
                    Booking Reference
                  </div>
                  <div className="font-mono font-bold text-lg text-[#0F5132]">
                    {bookingSuccess.booking_reference}
                  </div>
                  <div className="text-xs text-gray-600">
                    Total Paid: ${bookingSuccess.total_amount.toFixed(2)}
                  </div>
                </div>
                <button
                  onClick={() => router.push("/my-bookings")}
                  className="w-full bg-[#0F5132] hover:bg-[#0A3622] text-white py-2.5 rounded-lg font-semibold text-xs transition-all shadow-xs"
                >
                  View My Bookings
                </button>
              </div>
            ) : (
              <form onSubmit={handleBooking} className="space-y-4">
                <div className="flex items-baseline justify-between border-b border-gray-100 pb-3">
                  <div>
                    <span className="font-mono font-bold text-2xl text-gray-900">
                      ${nightlyRate.toFixed(2)}
                    </span>
                    <span className="text-xs text-gray-500"> / night</span>
                  </div>
                  <span className="text-xs font-semibold text-[#0F5132] bg-[#E8F5E9] px-2 py-0.5 rounded">
                    Instant Booking
                  </span>
                </div>

                {/* Dates Selection */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-gray-50 p-2 rounded-lg border border-gray-200/80">
                    <label className="block text-[10px] uppercase font-semibold text-gray-400">Check-in</label>
                    <input
                      type="date"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      required
                      className="w-full bg-transparent text-xs font-medium text-gray-900 focus:outline-none cursor-pointer"
                    />
                  </div>
                  <div className="bg-gray-50 p-2 rounded-lg border border-gray-200/80">
                    <label className="block text-[10px] uppercase font-semibold text-gray-400">Check-out</label>
                    <input
                      type="date"
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      required
                      className="w-full bg-transparent text-xs font-medium text-gray-900 focus:outline-none cursor-pointer"
                    />
                  </div>
                </div>

                {/* Rooms & Guests */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-gray-50 p-2 rounded-lg border border-gray-200/80">
                    <label className="block text-[10px] uppercase font-semibold text-gray-400">Rooms</label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={roomsCount}
                      onChange={(e) => setRoomsCount(parseInt(e.target.value, 10) || 1)}
                      className="w-full bg-transparent text-xs font-medium text-gray-900 focus:outline-none"
                    />
                  </div>
                  <div className="bg-gray-50 p-2 rounded-lg border border-gray-200/80">
                    <label className="block text-[10px] uppercase font-semibold text-gray-400">Guests</label>
                    <input
                      type="number"
                      min="1"
                      max="20"
                      value={guestsCount}
                      onChange={(e) => setGuestsCount(parseInt(e.target.value, 10) || 1)}
                      className="w-full bg-transparent text-xs font-medium text-gray-900 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Payment Option Selection */}
                <div className="space-y-1.5 pt-1">
                  <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                    Payment Method
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      { id: "ecocash", label: "EcoCash" },
                      { id: "paynow", label: "Paynow" },
                      { id: "card", label: "Card" },
                    ].map((method) => (
                      <button
                        type="button"
                        key={method.id}
                        onClick={() => setPaymentMethod(method.id)}
                        className={`py-1.5 px-2 rounded-lg text-xs font-medium border text-center transition-all duration-150 ${
                          paymentMethod === method.id
                            ? "border-[#0F5132] bg-[#0F5132] text-white shadow-xs"
                            : "border-gray-200 bg-gray-50 text-gray-700 hover:bg-white"
                        }`}
                      >
                        {method.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Transparent Breakdown */}
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-200/80 space-y-1.5 text-xs">
                  <div className="flex justify-between text-gray-500">
                    <span>${nightlyRate.toFixed(2)} × {nights} night(s)</span>
                    <span className="font-mono text-gray-800">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span>Taxes & VAT (10%)</span>
                    <span className="font-mono text-gray-800">${taxes.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span>Platform Service Fee (5%)</span>
                    <span className="font-mono text-gray-800">${platformFee.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-1.5 flex justify-between font-bold text-xs text-gray-900">
                    <span>Total</span>
                    <span className="font-mono text-[#0F5132] text-sm">${total.toFixed(2)}</span>
                  </div>
                </div>

                {bookingError && (
                  <div className="p-2.5 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs font-medium">
                    {bookingError}
                  </div>
                )}

                {/* Confirm Button */}
                <button
                  type="submit"
                  disabled={submitting || !selectedRoom}
                  className="w-full bg-[#0F5132] hover:bg-[#0A3622] disabled:opacity-50 text-white py-3 rounded-lg font-semibold text-xs shadow-xs transition-all duration-150"
                >
                  {submitting ? "Securing Reservation..." : "Confirm & Instant Book"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
