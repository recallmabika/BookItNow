"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Calendar as CalendarIcon, Users, Loader2 } from "lucide-react";
import flatpickr from "flatpickr";

export default function SearchBar() {
  const router = useRouter();
  const [city, setCity] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("2");
  const [guestsOpen, setGuestsOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  
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
        disableMobile: true,
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
        disableMobile: true,
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
    setIsSearching(true);
    const query = new URLSearchParams();
    if (city.trim()) query.append("city", city.trim());
    if (checkIn) query.append("check_in", checkIn);
    if (checkOut) query.append("check_out", checkOut);
    if (guests) query.append("guests", guests);
    
    // Smooth animation feedback before navigation
    setTimeout(() => {
      router.push(`/search?${query.toString()}`);
      setTimeout(() => setIsSearching(false), 800);
    }, 250);
  };

  return (
    <form
      onSubmit={handleSearch}
      className="bg-white dark:bg-[#111827] rounded-xs border border-gray-300 dark:border-gray-800 max-w-6xl w-full mx-auto flex flex-col md:flex-row items-stretch divide-y md:divide-y-0 md:divide-x divide-gray-200 dark:divide-gray-800 shadow-xs transition-colors"
    >
      {/* City / Destination */}
      <div className="flex-1 flex flex-col justify-center px-5 py-3.5 hover:bg-gray-50/70 dark:hover:bg-gray-800/60 focus-within:bg-gray-50/90 dark:focus-within:bg-gray-800/80 transition-colors">
        <div className="flex items-center gap-1.5 mb-1 text-gray-500 dark:text-gray-400">
          <MapPin className="w-3.5 h-3.5 text-[#2563EB] dark:text-blue-400 shrink-0 stroke-[2]" />
          <label className="text-[11px] font-semibold tracking-wider uppercase">
            Destination
          </label>
        </div>
        <input
          type="text"
          placeholder="Where to? (e.g. Harare)"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="w-full bg-transparent text-gray-900 dark:text-white text-sm font-medium outline-none focus:outline-none placeholder:text-gray-400 dark:placeholder:text-gray-500 placeholder:font-normal"
        />
      </div>

      {/* Check-in Date */}
      <div 
        onClick={() => fpInInstance.current?.open()}
        className="flex-1 flex flex-col justify-center px-5 py-3.5 hover:bg-gray-50/70 dark:hover:bg-gray-800/60 focus-within:bg-gray-50/90 dark:focus-within:bg-gray-800/80 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-1.5 mb-1 text-gray-500 dark:text-gray-400 pointer-events-none">
          <CalendarIcon className="w-3.5 h-3.5 text-[#2563EB] dark:text-blue-400 shrink-0 stroke-[2]" />
          <label className="text-[11px] font-semibold tracking-wider uppercase">
            Check-In
          </label>
        </div>
        <input
          ref={checkInRef}
          type="text"
          placeholder="Add dates"
          readOnly
          className="w-full bg-transparent text-gray-900 dark:text-white text-sm font-medium outline-none focus:outline-none cursor-pointer placeholder:text-gray-400 dark:placeholder:text-gray-500 placeholder:font-normal"
        />
      </div>

      {/* Check-out Date */}
      <div 
        onClick={() => fpOutInstance.current?.open()}
        className="flex-1 flex flex-col justify-center px-5 py-3.5 hover:bg-gray-50/70 dark:hover:bg-gray-800/60 focus-within:bg-gray-50/90 dark:focus-within:bg-gray-800/80 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-1.5 mb-1 text-gray-500 dark:text-gray-400 pointer-events-none">
          <CalendarIcon className="w-3.5 h-3.5 text-[#2563EB] dark:text-blue-400 shrink-0 stroke-[2]" />
          <label className="text-[11px] font-semibold tracking-wider uppercase">
            Check-Out
          </label>
        </div>
        <input
          ref={checkOutRef}
          type="text"
          placeholder="Add dates"
          readOnly
          className="w-full bg-transparent text-gray-900 dark:text-white text-sm font-medium outline-none focus:outline-none cursor-pointer placeholder:text-gray-400 dark:placeholder:text-gray-500 placeholder:font-normal"
        />
      </div>

      {/* Guests */}
      <div
        ref={guestsRef}
        className="flex-1 relative flex flex-col justify-center px-5 py-3.5 hover:bg-gray-50/70 dark:hover:bg-gray-800/60 focus-within:bg-gray-50/90 dark:focus-within:bg-gray-800/80 transition-colors cursor-pointer select-none"
        onClick={() => setGuestsOpen((prev) => !prev)}
      >
        <div className="flex items-center gap-1.5 mb-1 text-gray-500 dark:text-gray-400 pointer-events-none">
          <Users className="w-3.5 h-3.5 text-[#2563EB] dark:text-blue-400 shrink-0 stroke-[2]" />
          <label className="text-[11px] font-semibold tracking-wider uppercase">
            Guests
          </label>
        </div>
        <div className="text-gray-900 dark:text-white text-sm font-medium truncate">
          {guests === "1" ? "1 Guest" : guests === "5" ? "5+ Guests" : `${guests} Guests`}
        </div>

        {/* Custom Dropdown Menu matching user reference image */}
        {guestsOpen && (
          <div className="absolute left-0 right-0 top-full mt-1 bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-xs shadow-xl z-[9999] py-1 divide-y divide-gray-50 dark:divide-gray-800 animate-fade-in">
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
                    ? "bg-[#EFF6FF] dark:bg-blue-950/50 text-[#2563EB] dark:text-blue-400"
                    : "text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
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
          disabled={isSearching}
          className={`w-full md:w-auto px-7 py-3.5 bg-[#2563EB] hover:bg-[#1D4ED8] active:scale-95 text-white font-semibold text-sm rounded-xs flex items-center justify-center gap-2.5 transition-all duration-200 cursor-pointer whitespace-nowrap shadow-xs group ${
            isSearching ? "opacity-90 scale-[0.98] ring-2 ring-[#2563EB]/30 ring-offset-1" : ""
          }`}
        >
          {isSearching ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              <span className="animate-pulse">Searching...</span>
            </>
          ) : (
            <>
              <Search className="w-4 h-4 stroke-[2.2] group-hover:scale-110 group-active:scale-90 transition-transform duration-150" />
              <span>Search Stays</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
