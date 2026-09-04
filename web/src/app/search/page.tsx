"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { fetchProperties, PropertyListItem } from "@/lib/api";
import SearchBar from "@/components/SearchBar";
import { MapPin, Users, Star, ArrowRight, Building2 } from "lucide-react";

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Search Header Bar */}
      <div className="bg-parchment-light p-4 rounded-2xl border border-slate-subtle">
        <SearchBar />
      </div>

      {/* Results Title & Count */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-subtle pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-ink">
            {city ? `Stays in ${city}` : "All Available Stays"}
          </h1>
          <p className="text-xs text-slate-muted">
            {checkIn && checkOut ? `${checkIn} to ${checkOut} • ` : ""}
            {guests} {guests === 1 ? "guest" : "guests"}
          </p>
        </div>
        <div className="text-sm font-semibold text-deep-teal">
          {loading ? "Searching..." : `${properties.length} real listings found`}
        </div>
      </div>

      {/* Results Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-12">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="h-80 rounded-2xl bg-slate-subtle/30 animate-pulse border border-slate-subtle"
            />
          ))}
        </div>
      ) : properties.length === 0 ? (
        <div className="text-center py-20 bg-parchment-light rounded-2xl border border-slate-subtle space-y-4">
          <Building2 className="w-12 h-12 text-slate-muted mx-auto" />
          <h3 className="font-serif font-bold text-xl text-ink">No lodgings match your search</h3>
          <p className="text-xs text-slate-muted max-w-sm mx-auto">
            Try adjusting your dates, location, or guest count. Real properties will show as hosts publish active inventory.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((prop) => {
            const lowestPrice = prop.room_types?.length
              ? Math.min(...prop.room_types.map((r) => r.base_price_per_night))
              : null;
            const mainPhoto = prop.photos?.[0] || "/placeholder-stay.jpg";

            return (
              <div
                key={prop.id}
                className="bg-parchment-light rounded-2xl border border-slate-subtle overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col group"
              >
                {/* Photo Preview */}
                <div className="relative aspect-[16/10] bg-ink/10 overflow-hidden">
                  <div
                    className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                    style={{
                      backgroundImage: `url(${mainPhoto})`,
                      backgroundColor: "#1C1E1B",
                    }}
                  />
                  <span className="absolute top-3 left-3 bg-ink/80 backdrop-blur-sm text-[#EFEAE1] text-[10px] font-semibold uppercase px-2.5 py-1 rounded-md tracking-wider">
                    {prop.property_type}
                  </span>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-muted mb-1.5">
                      <MapPin className="w-3.5 h-3.5 text-deep-teal shrink-0" />
                      <span>{prop.city}, {prop.country}</span>
                    </div>

                    <h2 className="font-serif font-bold text-lg text-ink line-clamp-1 group-hover:text-deep-teal transition-colors">
                      {prop.title}
                    </h2>

                    <p className="text-xs text-slate-muted line-clamp-2 mt-1">
                      {prop.description}
                    </p>
                  </div>

                  {/* Amenities Tags */}
                  {prop.amenities?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {prop.amenities.slice(0, 3).map((amenity, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] font-medium bg-parchment px-2 py-0.5 rounded text-ink/80 border border-slate-subtle/60"
                        >
                          {amenity}
                        </span>
                      ))}
                      {prop.amenities.length > 3 && (
                        <span className="text-[10px] text-slate-muted self-center">
                          +{prop.amenities.length - 3} more
                        </span>
                      )}
                    </div>
                  )}

                  {/* Price & Action */}
                  <div className="pt-3 border-t border-slate-subtle flex items-center justify-between">
                    <div>
                      {lowestPrice !== null ? (
                        <>
                          <span className="text-xs text-slate-muted">From </span>
                          <span className="font-mono font-bold text-lg text-ink">
                            ${lowestPrice.toFixed(2)}
                          </span>
                          <span className="text-xs text-slate-muted"> / night</span>
                        </>
                      ) : (
                        <span className="text-xs text-slate-muted">Rates on request</span>
                      )}
                    </div>

                    <Link
                      href={`/properties/${prop.slug}`}
                      className="inline-flex items-center gap-1 bg-deep-teal hover:bg-deep-teal-hover text-[#EFEAE1] px-3.5 py-2 rounded-lg text-xs font-semibold shadow-sm transition-all"
                    >
                      <span>View Rooms</span>
                      <ArrowRight className="w-3.5 h-3.5" />
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
    <Suspense fallback={<div className="p-8 text-center text-sm text-slate-muted">Loading search parameters...</div>}>
      <SearchResultsContent />
    </Suspense>
  );
}
