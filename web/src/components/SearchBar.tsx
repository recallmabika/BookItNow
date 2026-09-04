"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Calendar as CalendarIcon, Users } from "lucide-react";

export default function SearchBar() {
  const router = useRouter();
  const [city, setCity] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("2");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = new URLSearchParams();
    if (city.trim()) query.append("city", city.trim());
    if (checkIn) query.append("check_in", checkIn);
    if (checkOut) query.append("check_out", checkOut);
    if (guests) query.append("guests", guests);
    router.push(`/search?${query.toString()}`);
  };

  return (
    <form
      onSubmit={handleSearch}
      className="bg-[#F8F5F0] p-3 sm:p-4 rounded-2xl shadow-xl border border-slate-subtle grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-center max-w-5xl mx-auto"
    >
      {/* City / Destination */}
      <div className="flex items-center gap-3 px-3 py-2 bg-parchment/60 rounded-xl border border-transparent focus-within:border-deep-teal transition-all">
        <MapPin className="w-5 h-5 text-deep-teal shrink-0" />
        <div className="w-full">
          <label className="block text-[11px] font-semibold tracking-wider text-slate-muted uppercase">
            Destination
          </label>
          <input
            type="text"
            placeholder="e.g. Harare, Victoria Falls"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full bg-transparent text-ink font-medium text-sm focus:outline-none placeholder:text-slate-muted/60"
          />
        </div>
      </div>

      {/* Dates: Check-in / Check-out */}
      <div className="flex items-center gap-3 px-3 py-2 bg-parchment/60 rounded-xl border border-transparent focus-within:border-deep-teal transition-all">
        <CalendarIcon className="w-5 h-5 text-deep-teal shrink-0" />
        <div className="w-full grid grid-cols-2 gap-1">
          <div>
            <label className="block text-[11px] font-semibold tracking-wider text-slate-muted uppercase">
              Check-in
            </label>
            <input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="w-full bg-transparent text-ink font-medium text-xs focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold tracking-wider text-slate-muted uppercase">
              Check-out
            </label>
            <input
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="w-full bg-transparent text-ink font-medium text-xs focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Guests */}
      <div className="flex items-center gap-3 px-3 py-2 bg-parchment/60 rounded-xl border border-transparent focus-within:border-deep-teal transition-all">
        <Users className="w-5 h-5 text-deep-teal shrink-0" />
        <div className="w-full">
          <label className="block text-[11px] font-semibold tracking-wider text-slate-muted uppercase">
            Guests
          </label>
          <select
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
            className="w-full bg-transparent text-ink font-medium text-sm focus:outline-none"
          >
            <option value="1">1 Guest</option>
            <option value="2">2 Guests</option>
            <option value="3">3 Guests</option>
            <option value="4">4 Guests</option>
            <option value="5">5+ Guests</option>
          </select>
        </div>
      </div>

      {/* Search Button */}
      <button
        type="submit"
        className="w-full h-full min-h-[52px] bg-deep-teal hover:bg-deep-teal-hover text-[#EFEAE1] font-semibold rounded-xl flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
      >
        <Search className="w-5 h-5" />
        <span>Search Stays</span>
      </button>
    </form>
  );
}
