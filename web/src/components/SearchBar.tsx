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
        altInputClass: "w-full bg-transparent text-gray-800 text-xs sm:text-sm font-normal outline-none focus:outline-none cursor-pointer placeholder:text-gray-400",
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
      className="bg-white rounded-xs border border-gray-300 max-w-5xl w-full mx-auto flex flex-col md:flex-row items-stretch divide-y md:divide-y-0 md:divide-x divide-gray-200 shadow-xs"
    >
      {/* City / Destination */}
      <div className="flex-[1.4] flex items-center gap-3.5 px-5 py-3.5 hover:bg-gray-50/70 focus-within:bg-gray-50/90 transition-colors">
        <MapPin className="w-5 h-5 text-[#0F5132] shrink-0 stroke-[1.5]" />
        <div className="w-full text-left">
          <label className="block text-[11px] font-semibold tracking-wider text-gray-500 uppercase mb-0.5">
            Destination
          </label>
          <input
            type="text"
            placeholder="Where are you going? (e.g. Harare, Victoria Falls)"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full bg-transparent text-gray-900 text-sm font-medium outline-none focus:outline-none placeholder:text-gray-400 placeholder:font-normal"
          />
        </div>
      </div>

      {/* Flatpickr Date Range */}
      <div className="flex-[1.3] flex items-center gap-3.5 px-5 py-3.5 hover:bg-gray-50/70 focus-within:bg-gray-50/90 transition-colors">
        <CalendarIcon className="w-5 h-5 text-[#0F5132] shrink-0 stroke-[1.5]" />
        <div className="w-full text-left">
          <label className="block text-[11px] font-semibold tracking-wider text-gray-500 uppercase mb-0.5">
            Check-in — Check-out
          </label>
          <input
            ref={datePickerRef}
            type="text"
            placeholder="Select stay dates"
            className="w-full bg-transparent text-gray-900 text-sm font-medium outline-none focus:outline-none cursor-pointer placeholder:text-gray-400 placeholder:font-normal"
          />
        </div>
      </div>

      {/* Guests */}
      <div className="w-full md:w-56 flex items-center gap-3.5 px-5 py-3.5 hover:bg-gray-50/70 focus-within:bg-gray-50/90 transition-colors">
        <Users className="w-5 h-5 text-[#0F5132] shrink-0 stroke-[1.5]" />
        <div className="w-full text-left relative">
          <label className="block text-[11px] font-semibold tracking-wider text-gray-500 uppercase mb-0.5">
            Guests
          </label>
          <select
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
            className="w-full bg-transparent text-gray-900 text-sm font-medium outline-none focus:outline-none cursor-pointer appearance-none pr-5"
          >
            <option value="1">1 Guest</option>
            <option value="2">2 Guests</option>
            <option value="3">3 Guests</option>
            <option value="4">4 Guests</option>
            <option value="5">5+ Guests</option>
          </select>
          <ChevronDown className="w-4 h-4 text-gray-400 absolute right-0 bottom-1 pointer-events-none stroke-[1.5]" />
        </div>
      </div>

      {/* Search Button */}
      <div className="p-2 flex items-center justify-center">
        <button
          type="submit"
          className="w-full md:w-auto px-8 py-3.5 bg-[#0F5132] hover:bg-[#0B3D26] active:scale-[0.98] text-white font-semibold text-sm rounded-xs flex items-center justify-center gap-2.5 transition-all duration-150 cursor-pointer whitespace-nowrap shadow-xs"
        >
          <Search className="w-4 h-4 stroke-[2]" />
          <span>Search Stays</span>
        </button>
      </div>
    </form>
  );
}
