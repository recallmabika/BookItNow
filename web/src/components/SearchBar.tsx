"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Calendar as CalendarIcon, Users, ChevronDown } from "lucide-react";
import flatpickr from "flatpickr";

export default function SearchBar() {
  const router = useRouter();
  const [city, setCity] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("2");
  
  const datePickerRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (datePickerRef.current) {
      const fp = flatpickr(datePickerRef.current, {
        mode: "range",
        minDate: "today",
        dateFormat: "Y-m-d",
        altInput: true,
        altFormat: "M j, Y",
        showMonths: 2,
        onChange: (selectedDates) => {
          if (selectedDates.length === 2) {
            const d1 = selectedDates[0].toISOString().split("T")[0];
            const d2 = selectedDates[1].toISOString().split("T")[0];
            setCheckIn(d1);
            setCheckOut(d2);
          } else if (selectedDates.length === 1) {
            const d1 = selectedDates[0].toISOString().split("T")[0];
            setCheckIn(d1);
            setCheckOut("");
          }
        },
      });

      return () => {
        fp.destroy();
      };
    }
  }, []);

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
      className="bg-white p-1.5 rounded-xs border border-gray-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-1.5 items-center max-w-4xl mx-auto shadow-none"
    >
      {/* City / Destination */}
      <div className="flex items-center gap-2 px-3 py-2 bg-gray-50/60 hover:bg-gray-50 rounded-xs border border-transparent focus-within:border-[#0F5132] focus-within:bg-white transition-colors duration-150">
        <MapPin className="w-4 h-4 text-[#0F5132] shrink-0 stroke-[1.5]" />
        <div className="w-full text-left">
          <label className="block text-[10px] font-medium tracking-wide text-gray-400 uppercase">
            Destination
          </label>
          <input
            type="text"
            placeholder="Where to? (e.g. Harare)"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full bg-transparent text-gray-800 text-xs sm:text-sm font-normal focus:outline-none placeholder:text-gray-400"
          />
        </div>
      </div>

      {/* Flatpickr Date Range */}
      <div className="flex items-center gap-2 px-3 py-2 bg-gray-50/60 hover:bg-gray-50 rounded-xs border border-transparent focus-within:border-[#0F5132] focus-within:bg-white transition-colors duration-150">
        <CalendarIcon className="w-4 h-4 text-[#0F5132] shrink-0 stroke-[1.5]" />
        <div className="w-full text-left">
          <label className="block text-[10px] font-medium tracking-wide text-gray-400 uppercase">
            Check-in — Check-out
          </label>
          <input
            ref={datePickerRef}
            type="text"
            placeholder="Select stay dates"
            className="w-full bg-transparent text-gray-800 text-xs sm:text-sm font-normal focus:outline-none cursor-pointer placeholder:text-gray-400"
          />
        </div>
      </div>

      {/* Guests */}
      <div className="flex items-center gap-2 px-3 py-2 bg-gray-50/60 hover:bg-gray-50 rounded-xs border border-transparent focus-within:border-[#0F5132] focus-within:bg-white transition-colors duration-150">
        <Users className="w-4 h-4 text-[#0F5132] shrink-0 stroke-[1.5]" />
        <div className="w-full text-left relative">
          <label className="block text-[10px] font-medium tracking-wide text-gray-400 uppercase">
            Guests
          </label>
          <select
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
            className="w-full bg-transparent text-gray-800 text-xs sm:text-sm font-normal focus:outline-none cursor-pointer appearance-none pr-4"
          >
            <option value="1">1 Guest</option>
            <option value="2">2 Guests</option>
            <option value="3">3 Guests</option>
            <option value="4">4 Guests</option>
            <option value="5">5+ Guests</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-0 bottom-1 pointer-events-none stroke-[1.5]" />
        </div>
      </div>

      {/* Search Button */}
      <button
        type="submit"
        className="w-full h-full min-h-[44px] bg-[#0F5132] hover:bg-[#0B3D26] active:scale-[0.99] text-white font-medium text-xs sm:text-sm rounded-xs flex items-center justify-center gap-2 transition-all duration-150 cursor-pointer"
      >
        <Search className="w-4 h-4 stroke-[1.8]" />
        <span>Search Stays</span>
      </button>
    </form>
  );
}
