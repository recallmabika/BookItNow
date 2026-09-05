import SearchBar from "@/components/SearchBar";
import Link from "next/link";
import { ShieldCheck, Zap, Wallet, QrCode, ArrowUpRight } from "lucide-react";

export default function HomePage() {
  return (
    <div className="space-y-16 sm:space-y-20 bg-white">
      {/* Hero Section */}
      <section className="relative pt-12 sm:pt-16 pb-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-xs bg-[#EFF6FF] text-[#2563EB] text-[11px] font-normal tracking-wide border border-blue-200/60">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] animate-pulse" />
            Verified Lodgings & Regional Travel
          </div>
          
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-medium text-gray-900 tracking-tight leading-[1.2]">
            Book Authentic Lodging, <br className="hidden sm:inline" />
            <span className="text-[#2563EB] font-semibold">With Complete Peace of Mind.</span>
          </h1>
          
          <p className="text-xs sm:text-sm text-gray-500 max-w-lg mx-auto font-normal leading-relaxed">
            Discover vetted hotels, safari lodges, and serene guesthouses. Enjoy instant booking, transparent price breakdowns, and local payments via EcoCash and card.
          </p>
        </div>

        {/* Live Search Widget */}
        <div className="mt-8">
          <SearchBar />
        </div>
      </section>

      {/* Value Pillars */}
      <section className="bg-gray-50/50 py-12 border-y border-gray-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xs bg-white border border-gray-200/80 space-y-1.5 hover:border-[#2563EB]/40 transition-colors duration-150">
              <div className="w-8 h-8 rounded-xs bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center">
                <Zap className="w-4 h-4 stroke-[1.6]" />
              </div>
              <h3 className="font-medium text-sm text-gray-900">Instant Confirmation</h3>
              <p className="text-[11px] text-gray-500 leading-relaxed font-normal">
                No waiting on host callbacks. Your dates are locked immediately in the inventory calendar.
              </p>
            </div>

            <div className="p-4 rounded-xs bg-white border border-gray-200/80 space-y-1.5 hover:border-[#2563EB]/40 transition-colors duration-150">
              <div className="w-8 h-8 rounded-xs bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center">
                <Wallet className="w-4 h-4 stroke-[1.6]" />
              </div>
              <h3 className="font-medium text-sm text-gray-900">Transparent Pricing</h3>
              <p className="text-[11px] text-gray-500 leading-relaxed font-normal">
                Clear room rate, taxes, and fees breakdown. What you see is exactly what you pay.
              </p>
            </div>

            <div className="p-4 rounded-xs bg-white border border-gray-200/80 space-y-1.5 hover:border-[#2563EB]/40 transition-colors duration-150">
              <div className="w-8 h-8 rounded-xs bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center">
                <ShieldCheck className="w-4 h-4 stroke-[1.6]" />
              </div>
              <h3 className="font-medium text-sm text-gray-900">Verified Stays Only</h3>
              <p className="text-[11px] text-gray-500 leading-relaxed font-normal">
                Zero fake reviews. Only guests with checked-out completed stays can write reviews.
              </p>
            </div>

            <div className="p-4 rounded-xs bg-white border border-gray-200/80 space-y-1.5 hover:border-[#2563EB]/40 transition-colors duration-150">
              <div className="w-8 h-8 rounded-xs bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center">
                <QrCode className="w-4 h-4 stroke-[1.6]" />
              </div>
              <h3 className="font-medium text-sm text-gray-900">Instant E-Voucher</h3>
              <p className="text-[11px] text-gray-500 leading-relaxed font-normal">
                Receive an immediate digital voucher with a check-in QR code sent right to your device.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl font-medium text-gray-900">Popular Destinations</h2>
            <p className="text-[11px] text-gray-500 font-normal">Browse active lodgings across regional travel hubs</p>
          </div>
          <Link href="/search" className="text-xs font-normal text-[#2563EB] hover:underline flex items-center gap-1">
            <span>View All Stays</span>
            <ArrowUpRight className="w-3 h-3 stroke-[1.8]" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/search?city=Harare"
            className="group relative rounded-xs overflow-hidden aspect-[16/10] bg-gray-900 flex flex-col justify-end p-4 border border-gray-200"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent z-10" />
            <div className="relative z-20 text-white">
              <span className="text-[10px] tracking-wider uppercase font-medium text-blue-300">Capital Hub</span>
              <h3 className="text-base font-medium">Harare</h3>
              <p className="text-[11px] text-gray-300 font-normal">Boutique hotels & executive suites</p>
            </div>
          </Link>

          <Link
            href="/search?city=Victoria+Falls"
            className="group relative rounded-xs overflow-hidden aspect-[16/10] bg-gray-900 flex flex-col justify-end p-4 border border-gray-200"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent z-10" />
            <div className="relative z-20 text-white">
              <span className="text-[10px] tracking-wider uppercase font-medium text-blue-300">Natural Wonder</span>
              <h3 className="text-base font-medium">Victoria Falls</h3>
              <p className="text-[11px] text-gray-300 font-normal">Safari lodges & riverfront retreats</p>
            </div>
          </Link>

          <Link
            href="/search?city=Bulawayo"
            className="group relative rounded-xs overflow-hidden aspect-[16/10] bg-gray-900 flex flex-col justify-end p-4 border border-gray-200"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent z-10" />
            <div className="relative z-20 text-white">
              <span className="text-[10px] tracking-wider uppercase font-medium text-blue-300">Heritage City</span>
              <h3 className="text-base font-medium">Bulawayo</h3>
              <p className="text-[11px] text-gray-300 font-normal">Historic guesthouses & nature retreats</p>
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}
