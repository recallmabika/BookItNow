"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Calendar as CalendarIcon, Users, ChevronDown } from "lucide-react";

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
      className="bg-white p-2 rounded-xl shadow-xs hover:shadow-sm transition-all duration-200 border border-gray-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 items-center max-w-5xl mx-auto"
    >
      {/* City / Destination */}
      <div className="flex items-center gap-2.5 px-3 py-2 bg-gray-50/70 hover:bg-gray-50 rounded-lg border border-transparent focus-within:border-[#0F5132] focus-within:bg-white transition-all duration-150">
        <MapPin className="w-4 h-4 text-[#0F5132] shrink-0" />
        <div className="w-full text-left">
          <label className="block text-[10px] font-semibold tracking-wider text-gray-400 uppercase">
            Destination
          </label>
          <input
            type="text"
            placeholder="e.g. Harare, Victoria Falls"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full bg-transparent text-gray-900 font-medium text-xs sm:text-sm focus:outline-none placeholder:text-gray-400"
          />
        </div>
      </div>

      {/* Interactive Clean Dates */}
      <div className="flex items-center gap-2 px-3 py-2 bg-gray-50/70 hover:bg-gray-50 rounded-lg border border-transparent focus-within:border-[#0F5132] focus-within:bg-white transition-all duration-150">
        <CalendarIcon className="w-4 h-4 text-[#0F5132] shrink-0" />
        <div className="w-full grid grid-cols-2 gap-2 text-left">
          <div>
            <label className="block text-[10px] font-semibold tracking-wider text-gray-400 uppercase">
              Check-in
            </label>
            <input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="w-full bg-transparent text-gray-900 font-medium text-xs focus:outline-none cursor-pointer py-0.5"
            />
          </div>
          <div className="border-l border-gray-200 pl-2">
            <label className="block text-[10px] font-semibold tracking-wider text-gray-400 uppercase">
              Check-out
            </label>
            <input
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="w-full bg-transparent text-gray-900 font-medium text-xs focus:outline-none cursor-pointer py-0.5"
            />
          </div>
        </div>
      </div>

      {/* Guests */}
      <div className="flex items-center gap-2.5 px-3 py-2 bg-gray-50/70 hover:bg-gray-50 rounded-lg border border-transparent focus-within:border-[#0F5132] focus-within:bg-white transition-all duration-150">
        <Users className="w-4 h-4 text-[#0F5132] shrink-0" />
        <div className="w-full text-left relative">
          <label className="block text-[10px] font-semibold tracking-wider text-gray-400 uppercase">
            Guests
          </label>
          <select
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
            className="w-full bg-transparent text-gray-900 font-medium text-xs sm:text-sm focus:outline-none cursor-pointer appearance-none pr-5"
          >
            <option value="1">1 Guest</option>
            <option value="2">2 Guests</option>
            <option value="3">3 Guests</option>
            <option value="4">4 Guests</option>
            <option value="5">5+ Guests</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-0 bottom-1 pointer-events-none" />
        </div>
      </div>

      {/* Search Button */}
      <button
        type="submit"
        className="w-full h-full min-h-[46px] bg-[#0F5132] hover:bg-[#0A3622] active:scale-[0.99] text-white font-semibold rounded-lg flex items-center justify-center gap-2 shadow-xs transition-all duration-150 hover:shadow-sm"
      >
        <Search className="w-4 h-4" />
        <span className="text-xs sm:text-sm">Search Stays</span>
      </button>
    </form>
  );
}
