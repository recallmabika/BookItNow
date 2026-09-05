import SearchBar from "@/components/SearchBar";
import Link from "next/link";
import { ShieldCheck, Zap, Wallet, QrCode, ArrowUpRight } from "lucide-react";

export default function HomePage() {
  return (
    <div className="space-y-16 sm:space-y-20 bg-white">
      {/* Hero Section */}
      <section className="relative pt-12 sm:pt-18 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="max-w-3xl mx-auto space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8F5E9] text-[#0F5132] text-xs font-semibold tracking-wide border border-green-200">
            <span className="w-2 h-2 rounded-full bg-[#198754] animate-pulse" />
            Verified Lodgings & Regional Travel
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-gray-900 tracking-tight leading-[1.15]">
            Book Authentic Lodging, <br className="hidden sm:inline" />
            <span className="text-[#0F5132]">With Complete Peace of Mind.</span>
          </h1>
          
          <p className="text-sm sm:text-base text-gray-600 max-w-xl mx-auto font-normal leading-relaxed">
            Discover vetted hotels, safari lodges, and serene guesthouses. Enjoy instant booking, transparent price breakdowns, and local payments via EcoCash and card.
          </p>
        </div>

        {/* Live Search Widget */}
        <div className="mt-8 sm:mt-10">
          <SearchBar />
        </div>
      </section>

      {/* Value Pillars */}
      <section className="bg-gray-50/70 py-14 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-4 rounded-xl bg-white border border-gray-200/70 space-y-2 hover:border-[#0F5132]/30 transition-all duration-200 shadow-xs">
              <div className="w-10 h-10 rounded-lg bg-[#E8F5E9] text-[#0F5132] flex items-center justify-center">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-base text-gray-900">Instant Confirmation</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                No waiting on host callbacks. Your dates are locked immediately in the inventory calendar.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white border border-gray-200/70 space-y-2 hover:border-[#0F5132]/30 transition-all duration-200 shadow-xs">
              <div className="w-10 h-10 rounded-lg bg-[#E8F5E9] text-[#0F5132] flex items-center justify-center">
                <Wallet className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-base text-gray-900">Transparent Pricing</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Clear room rate, taxes, and fees breakdown. What you see is exactly what you pay.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white border border-gray-200/70 space-y-2 hover:border-[#0F5132]/30 transition-all duration-200 shadow-xs">
              <div className="w-10 h-10 rounded-lg bg-[#E8F5E9] text-[#0F5132] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-base text-gray-900">Verified Stays Only</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Zero fake reviews. Only guests with checked-out completed stays can write reviews.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white border border-gray-200/70 space-y-2 hover:border-[#0F5132]/30 transition-all duration-200 shadow-xs">
              <div className="w-10 h-10 rounded-lg bg-[#E8F5E9] text-[#0F5132] flex items-center justify-center">
                <QrCode className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-base text-gray-900">Instant E-Voucher</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Receive an immediate digital voucher with a check-in QR code sent right to your device.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Cities Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-serif font-bold text-gray-900">Popular Destinations</h2>
            <p className="text-xs text-gray-500">Browse active lodgings across regional travel hubs</p>
          </div>
          <Link href="/search" className="text-xs font-semibold text-[#0F5132] hover:underline flex items-center gap-1">
            <span>View All Stays</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <Link
            href="/search?city=Harare"
            className="group relative rounded-xl overflow-hidden aspect-[4/3] bg-gray-900 flex flex-col justify-end p-5 border border-gray-200 hover:shadow-sm transition-all duration-200"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent z-10" />
            <div className="relative z-20 text-white">
              <span className="text-[11px] tracking-wider uppercase font-semibold text-green-400">Capital Hub</span>
              <h3 className="text-xl font-serif font-bold">Harare</h3>
              <p className="text-xs text-gray-300 mt-0.5">Boutique hotels & executive suites</p>
            </div>
          </Link>

          <Link
            href="/search?city=Victoria+Falls"
            className="group relative rounded-xl overflow-hidden aspect-[4/3] bg-gray-900 flex flex-col justify-end p-5 border border-gray-200 hover:shadow-sm transition-all duration-200"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent z-10" />
            <div className="relative z-20 text-white">
              <span className="text-[11px] tracking-wider uppercase font-semibold text-green-400">Natural Wonder</span>
              <h3 className="text-xl font-serif font-bold">Victoria Falls</h3>
              <p className="text-xs text-gray-300 mt-0.5">Safari lodges & riverfront retreats</p>
            </div>
          </Link>

          <Link
            href="/search?city=Bulawayo"
            className="group relative rounded-xl overflow-hidden aspect-[4/3] bg-gray-900 flex flex-col justify-end p-5 border border-gray-200 hover:shadow-sm transition-all duration-200"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent z-10" />
            <div className="relative z-20 text-white">
              <span className="text-[11px] tracking-wider uppercase font-semibold text-green-400">Heritage City</span>
              <h3 className="text-xl font-serif font-bold">Bulawayo</h3>
              <p className="text-xs text-gray-300 mt-0.5">Historic guesthouses & nature retreats</p>
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}
