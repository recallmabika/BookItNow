"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Calendar as CalendarIcon, Users } from "lucide-react";
import flatpickr from "flatpickr";

export default function SearchBar() {
  const router = useRouter();
  const [city, setCity] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("2");
  const [guestsOpen, setGuestsOpen] = useState(false);
  
  const checkInRef = useRef<HTMLInputElement | null>(null);
  const checkOutRef = useRef<HTMLInputElement | null>(null);
  const guestsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (guestsRef.current && !guestsRef.current.contains(e.target as Node)) {
        setGuestsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fpInInstance = useRef<any>(null);
  const fpOutInstance = useRef<any>(null);

  useEffect(() => {
    if (checkInRef.current) {
      fpInInstance.current = flatpickr(checkInRef.current, {
        minDate: "today",
        dateFormat: "M j, Y",
        allowInput: false,
        disableMobile: "true",
        onChange: (selectedDates) => {
          if (selectedDates.length > 0) {
            const dStr = selectedDates[0].toISOString().split("T")[0];
            setCheckIn(dStr);
            if (fpOutInstance.current) {
              fpOutInstance.current.set("minDate", selectedDates[0]);
            }
          } else {
            setCheckIn("");
          }
        },
      });
    }

    if (checkOutRef.current) {
      fpOutInstance.current = flatpickr(checkOutRef.current, {
        minDate: "today",
        dateFormat: "M j, Y",
        allowInput: false,
        disableMobile: "true",
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
      fpInInstance.current?.destroy();
      fpOutInstance.current?.destroy();
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
      <div 
        onClick={() => fpInInstance.current?.open()}
        className="flex-1 flex items-center gap-3.5 px-5 py-3.5 hover:bg-gray-50/70 focus-within:bg-gray-50/90 transition-colors cursor-pointer"
      >
        <CalendarIcon className="w-5 h-5 text-[#0F5132] shrink-0 stroke-[1.5]" />
        <div className="w-full text-left">
          <label className="block text-[11px] font-semibold tracking-wider text-gray-500 uppercase mb-0.5 pointer-events-none">
            Check-In
          </label>
          <input
            ref={checkInRef}
            type="text"
            placeholder="Add dates"
            readOnly
            className="w-full bg-transparent text-gray-900 text-sm font-medium outline-none focus:outline-none cursor-pointer placeholder:text-gray-400 placeholder:font-normal"
          />
        </div>
      </div>

      {/* Check-out Date */}
      <div 
        onClick={() => fpOutInstance.current?.open()}
        className="flex-1 flex items-center gap-3.5 px-5 py-3.5 hover:bg-gray-50/70 focus-within:bg-gray-50/90 transition-colors cursor-pointer"
      >
        <CalendarIcon className="w-5 h-5 text-[#0F5132] shrink-0 stroke-[1.5]" />
        <div className="w-full text-left">
          <label className="block text-[11px] font-semibold tracking-wider text-gray-500 uppercase mb-0.5 pointer-events-none">
            Check-Out
          </label>
          <input
            ref={checkOutRef}
            type="text"
            placeholder="Add dates"
            readOnly
            className="w-full bg-transparent text-gray-900 text-sm font-medium outline-none focus:outline-none cursor-pointer placeholder:text-gray-400 placeholder:font-normal"
          />
        </div>
      </div>

      {/* Guests */}
      <div
        ref={guestsRef}
        className="w-full md:w-52 relative flex items-center gap-3.5 px-5 py-3.5 hover:bg-gray-50/70 focus-within:bg-gray-50/90 transition-colors cursor-pointer"
        onClick={() => setGuestsOpen((prev) => !prev)}
      >
        <Users className="w-5 h-5 text-[#0F5132] shrink-0 stroke-[1.5]" />
        <div className="w-full text-left select-none">
          <label className="block text-[11px] font-semibold tracking-wider text-gray-500 uppercase mb-0.5 pointer-events-none">
            Guests
          </label>
          <div className="text-gray-900 text-sm font-medium">
            {guests === "1" ? "1 Guest" : guests === "5" ? "5+ Guests" : `${guests} Guests`}
          </div>
        </div>

        {/* Custom Dropdown Menu matching user reference image */}
        {guestsOpen && (
          <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-xs shadow-xl z-[9999] py-1 divide-y divide-gray-50 animate-fade-in">
            {[
              { val: "1", label: "1 Guest" },
              { val: "2", label: "2 Guests" },
              { val: "3", label: "3 Guests" },
              { val: "4", label: "4 Guests" },
              { val: "5", label: "5+ Guests" },
            ].map((item) => (
              <div
                key={item.val}
                onClick={(e) => {
                  e.stopPropagation();
                  setGuests(item.val);
                  setGuestsOpen(false);
                }}
                className={`px-4 py-2.5 text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
                  guests === item.val
                    ? "bg-[#E8F5E9] text-[#0F5132]"
                    : "text-gray-800 hover:bg-gray-50"
                }`}
              >
                {item.label}
              </div>
            ))}
          </div>
        )}
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
