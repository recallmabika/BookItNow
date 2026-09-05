"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { fetchProperties, PropertyListItem } from "@/lib/api";
import SearchBar from "@/components/SearchBar";
import { MapPin, ArrowRight } from "lucide-react";

function SearchResultsContent() {
  const searchParams = useSearchParams();
  const city = searchParams.get("city") || "";
  const checkIn = searchParams.get("check_in") || "";
  const checkOut = searchParams.get("check_out") || "";
  const guests = parseInt(searchParams.get("guests") || "1", 10);

  const [properties, setProperties] = useState<PropertyListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const data = await fetchProperties({
        city: city || undefined,
        check_in: checkIn || undefined,
        check_out: checkOut || undefined,
        guests: guests || 1,
      });
      setProperties(data);
      setLoading(false);
    }
    loadData();
  }, [city, checkIn, checkOut, guests]);

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 overflow-x-hidden">
      {/* Search Header Bar */}
      <SearchBar />

      {/* Results Title & Count */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-200/60 dark:border-gray-800 pb-3">
        <div>
          <h1 className="text-xl font-medium text-gray-900 dark:text-white">
            {city ? `Stays in ${city}` : "All Available Stays"}
          </h1>
          <p className="text-[11px] text-gray-500 dark:text-gray-400 font-normal">
            {checkIn && checkOut ? `${checkIn} to ${checkOut} • ` : ""}
            {guests} {guests === 1 ? "guest" : "guests"}
          </p>
        </div>
        <div className="text-[11px] font-normal text-[#2563EB] dark:text-blue-400 bg-[#EFF6FF] dark:bg-blue-950/40 px-2.5 py-1 rounded-xs border border-blue-200/60 dark:border-blue-900/50">
          {loading ? "Searching..." : `${properties.length} active listings found`}
        </div>
      </div>

      {/* Results Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-6">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="h-64 rounded-xs bg-gray-100/70 dark:bg-gray-900 animate-pulse border border-gray-200/60 dark:border-gray-800"
            />
          ))}
        </div>
      ) : properties.length === 0 ? (
        <div className="text-center py-12 px-4 bg-white dark:bg-[#111827] rounded-xs border border-gray-200/80 dark:border-gray-800 shadow-xs flex flex-col items-center justify-center transition-colors">
          <div className="relative w-64 h-64 sm:w-80 sm:h-80 mb-6">
            <Image
              src="/empty-search.png"
              alt="No lodgings match your search"
              fill
              className="object-contain"
              priority
            />
          </div>
          <h3 className="font-semibold text-lg sm:text-xl text-gray-900 dark:text-white mb-2">
            No lodgings match your search
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto font-normal leading-relaxed">
            We couldn't find any stays matching your exact dates or location. Try adjusting your search criteria or clearing filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {properties.map((prop) => {
            const lowestPrice = prop.room_types?.length
              ? Math.min(...prop.room_types.map((r) => r.base_price_per_night))
              : null;
            const mainPhoto = prop.photos?.[0] || "/placeholder-stay.jpg";

            return (
              <div
                key={prop.id}
                className="bg-white dark:bg-[#111827] rounded-xs border border-gray-200/80 dark:border-gray-800 overflow-hidden hover:border-[#2563EB]/50 dark:hover:border-blue-500/50 transition-colors duration-150 flex flex-col group"
              >
                {/* Photo Preview */}
                <div className="relative aspect-[16/10] bg-gray-900 overflow-hidden">
                  <div
                    className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                    style={{
                      backgroundImage: `url(${mainPhoto})`,
                      backgroundColor: "#111827",
                    }}
                  />
                  <span className="absolute top-2 left-2 bg-white/95 dark:bg-gray-900/95 text-gray-900 dark:text-white text-[9px] font-medium uppercase px-1.5 py-0.5 rounded-xs tracking-wider border border-gray-200/60 dark:border-gray-700">
                    {prop.property_type}
                  </span>
                </div>

                {/* Content */}
                <div className="p-3.5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center gap-1 text-[11px] text-gray-500 dark:text-gray-400 mb-1">
                      <MapPin className="w-3 h-3 text-[#2563EB] dark:text-blue-400 shrink-0 stroke-[1.6]" />
                      <span>{prop.city}, {prop.country}</span>
                    </div>

                    <h2 className="font-medium text-sm text-gray-900 dark:text-white line-clamp-1 group-hover:text-[#2563EB] dark:group-hover:text-blue-400 transition-colors">
                      {prop.title}
                    </h2>

                    <p className="text-[11px] text-gray-500 dark:text-gray-400 line-clamp-2 mt-1 font-normal leading-relaxed">
                      {prop.description}
                    </p>
                  </div>

                  {/* Amenities Tags */}
                  {prop.amenities?.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {prop.amenities.slice(0, 3).map((amenity, idx) => (
                        <span
                          key={idx}
                          className="text-[9px] font-normal bg-gray-50 dark:bg-gray-800 px-1.5 py-0.5 rounded-xs text-gray-600 dark:text-gray-300 border border-gray-200/60 dark:border-gray-700"
                        >
                          {amenity}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Price & Action */}
                  <div className="pt-2.5 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                    <div>
                      {lowestPrice !== null ? (
                        <>
                          <span className="text-[11px] text-gray-400">From </span>
                          <span className="font-mono font-medium text-sm text-gray-900 dark:text-white">
                            ${lowestPrice.toFixed(2)}
                          </span>
                          <span className="text-[10px] text-gray-400"> / night</span>
                        </>
                      ) : (
                        <span className="text-[11px] text-gray-400 font-normal">Rates on request</span>
                      )}
                    </div>

                    <Link
                      href={`/properties/${prop.slug}`}
                      className="inline-flex items-center gap-1 bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-2.5 py-1 rounded-xs text-[11px] font-normal transition-colors"
                    >
                      <span>View Rooms</span>
                      <ArrowRight className="w-3 h-3 stroke-[1.8]" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-gray-500">Loading search parameters...</div>}>
      <SearchResultsContent />
    </Suspense>
  );
}
