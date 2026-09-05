"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { fetchProperties, PropertyListItem } from "@/lib/api";
import SearchBar from "@/components/SearchBar";
import { MapPin, ArrowRight, Building2 } from "lucide-react";

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Search Header Bar */}
      <div className="bg-gray-50/70 p-3 rounded-xl border border-gray-200/80">
        <SearchBar />
      </div>

      {/* Results Title & Count */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-gray-900">
            {city ? `Stays in ${city}` : "All Available Stays"}
          </h1>
          <p className="text-xs text-gray-500">
            {checkIn && checkOut ? `${checkIn} to ${checkOut} • ` : ""}
            {guests} {guests === 1 ? "guest" : "guests"}
          </p>
        </div>
        <div className="text-xs font-semibold text-[#0F5132] bg-[#E8F5E9] px-2.5 py-1 rounded-md border border-green-200">
          {loading ? "Searching..." : `${properties.length} active listings found`}
        </div>
      </div>

      {/* Results Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 py-8">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="h-72 rounded-xl bg-gray-100 animate-pulse border border-gray-200/80"
            />
          ))}
        </div>
      ) : properties.length === 0 ? (
        <div className="text-center py-16 bg-gray-50/50 rounded-xl border border-gray-200/80 space-y-3">
          <Building2 className="w-10 h-10 text-gray-400 mx-auto" />
          <h3 className="font-serif font-bold text-lg text-gray-900">No lodgings match your search</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            Try adjusting your dates, location, or guest count. Real properties will show as hosts publish active inventory.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {properties.map((prop) => {
            const lowestPrice = prop.room_types?.length
              ? Math.min(...prop.room_types.map((r) => r.base_price_per_night))
              : null;
            const mainPhoto = prop.photos?.[0] || "/placeholder-stay.jpg";

            return (
              <div
                key={prop.id}
                className="bg-white rounded-xl border border-gray-200/90 overflow-hidden shadow-xs hover:shadow-sm hover:border-[#0F5132]/40 transition-all duration-200 flex flex-col group"
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
                  <span className="absolute top-2.5 left-2.5 bg-white/95 backdrop-blur-xs text-gray-900 text-[10px] font-semibold uppercase px-2 py-0.5 rounded-md tracking-wider shadow-xs">
                    {prop.property_type}
                  </span>
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
                      <MapPin className="w-3.5 h-3.5 text-[#0F5132] shrink-0" />
                      <span>{prop.city}, {prop.country}</span>
                    </div>

                    <h2 className="font-serif font-bold text-base text-gray-900 line-clamp-1 group-hover:text-[#0F5132] transition-colors">
                      {prop.title}
                    </h2>

                    <p className="text-xs text-gray-500 line-clamp-2 mt-1">
                      {prop.description}
                    </p>
                  </div>

                  {/* Amenities Tags */}
                  {prop.amenities?.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {prop.amenities.slice(0, 3).map((amenity, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] font-medium bg-gray-50 px-2 py-0.5 rounded text-gray-600 border border-gray-200"
                        >
                          {amenity}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Price & Action */}
                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                    <div>
                      {lowestPrice !== null ? (
                        <>
                          <span className="text-xs text-gray-500">From </span>
                          <span className="font-mono font-bold text-base text-gray-900">
                            ${lowestPrice.toFixed(2)}
                          </span>
                          <span className="text-[11px] text-gray-500"> / night</span>
                        </>
                      ) : (
                        <span className="text-xs text-gray-500">Rates on request</span>
                      )}
                    </div>

                    <Link
                      href={`/properties/${prop.slug}`}
                      className="inline-flex items-center gap-1 bg-[#0F5132] hover:bg-[#0A3622] text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow-xs transition-all duration-150"
                    >
                      <span>View Rooms</span>
                      <ArrowRight className="w-3 h-3" />
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
