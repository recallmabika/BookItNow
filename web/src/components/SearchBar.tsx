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
  
  const checkInRef = useRef<HTMLInputElement | null>(null);
  const checkOutRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    let fpIn: any = null;
    let fpOut: any = null;

    if (checkInRef.current) {
      fpIn = flatpickr(checkInRef.current, {
        minDate: "today",
        dateFormat: "Y-m-d",
        altInput: true,
        altFormat: "M j, Y",
        altInputClass: "w-full bg-transparent text-gray-900 text-sm font-medium outline-none focus:outline-none cursor-pointer placeholder:text-gray-400 placeholder:font-normal",
        onChange: (selectedDates) => {
          if (selectedDates.length > 0) {
            const dStr = selectedDates[0].toISOString().split("T")[0];
            setCheckIn(dStr);
            if (fpOut) {
              fpOut.set("minDate", selectedDates[0]);
            }
          } else {
            setCheckIn("");
          }
        },
      });
    }

    if (checkOutRef.current) {
      fpOut = flatpickr(checkOutRef.current, {
        minDate: "today",
        dateFormat: "Y-m-d",
        altInput: true,
        altFormat: "M j, Y",
        altInputClass: "w-full bg-transparent text-gray-900 text-sm font-medium outline-none focus:outline-none cursor-pointer placeholder:text-gray-400 placeholder:font-normal",
        onChange: (selectedDates) => {
          if (selectedDates.length > 0) {
            const dStr = selectedDates[0].toISOString().split("T")[0];
            setCheckOut(dStr);
          } else {
            setCheckOut("");
          }
        },
      });
    }

    return () => {
      fpIn?.destroy();
      fpOut?.destroy();
    };
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
      className="bg-white rounded-xs border border-gray-300 max-w-6xl w-full mx-auto flex flex-col md:flex-row items-stretch divide-y md:divide-y-0 md:divide-x divide-gray-200 shadow-xs"
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
            placeholder="Where to? (e.g. Harare)"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full bg-transparent text-gray-900 text-sm font-medium outline-none focus:outline-none placeholder:text-gray-400 placeholder:font-normal"
          />
        </div>
      </div>

      {/* Check-in Date */}
      <div className="flex-1 flex items-center gap-3.5 px-5 py-3.5 hover:bg-gray-50/70 focus-within:bg-gray-50/90 transition-colors">
        <CalendarIcon className="w-5 h-5 text-[#0F5132] shrink-0 stroke-[1.5]" />
        <div className="w-full text-left">
          <label className="block text-[11px] font-semibold tracking-wider text-gray-500 uppercase mb-0.5">
            Check-In
          </label>
          <input
            ref={checkInRef}
            type="text"
            placeholder="Add dates"
            className="w-full bg-transparent text-gray-900 text-sm font-medium outline-none focus:outline-none cursor-pointer placeholder:text-gray-400 placeholder:font-normal"
          />
        </div>
      </div>

      {/* Check-out Date */}
      <div className="flex-1 flex items-center gap-3.5 px-5 py-3.5 hover:bg-gray-50/70 focus-within:bg-gray-50/90 transition-colors">
        <CalendarIcon className="w-5 h-5 text-[#0F5132] shrink-0 stroke-[1.5]" />
        <div className="w-full text-left">
          <label className="block text-[11px] font-semibold tracking-wider text-gray-500 uppercase mb-0.5">
            Check-Out
          </label>
          <input
            ref={checkOutRef}
            type="text"
            placeholder="Add dates"
            className="w-full bg-transparent text-gray-900 text-sm font-medium outline-none focus:outline-none cursor-pointer placeholder:text-gray-400 placeholder:font-normal"
          />
        </div>
      </div>

      {/* Guests */}
      <div className="w-full md:w-52 flex items-center gap-3.5 px-5 py-3.5 hover:bg-gray-50/70 focus-within:bg-gray-50/90 transition-colors">
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
          className="w-full md:w-auto px-7 py-3.5 bg-[#0F5132] hover:bg-[#0B3D26] active:scale-[0.98] text-white font-semibold text-sm rounded-xs flex items-center justify-center gap-2.5 transition-all duration-150 cursor-pointer whitespace-nowrap shadow-xs"
        >
          <Search className="w-4 h-4 stroke-[2]" />
          <span>Search Stays</span>
        </button>
      </div>
    </form>
  );
}
