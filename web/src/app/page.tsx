import Image from "next/image";
import SearchBar from "@/components/SearchBar";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function HomePage() {
  return (
    <div className="bg-white dark:bg-[#0B0F19] overflow-x-hidden transition-colors">
      {/* Hero Section - Full Screen Viewport Fit */}
      <section className="relative z-30 min-h-[calc(100vh-4.5rem)] flex flex-col justify-center px-4 sm:px-6 lg:px-8 py-10 sm:py-14 overflow-visible">
        {/* Background Resort Pool Image with Rich Overlay */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <Image
            src="/hero-bg.jpg"
            alt="Tropical resort pool at sunset"
            fill
            priority
            className="object-cover object-center"
          />
          {/* Subtle multi-stop gradient for contrast and clarity */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/65 to-black/75 dark:from-black/90 dark:via-[#0B0F19]/75 dark:to-[#0B0F19]/80" />
        </div>

        {/* Hero Content Container */}
        <div className="relative z-10 max-w-7xl mx-auto w-full flex flex-col justify-center gap-8 lg:gap-10 overflow-visible">
          {/* Top Row: Left-aligned Text + Right-aligned Triangle Notched Image */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Content: Text reveals smoothly from right to left */}
            <div className="lg:col-span-7 text-left space-y-4 sm:space-y-5 animate-hero-text">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-medium text-white tracking-tight leading-[1.12] drop-shadow-md">
                Book Authentic Lodging, <br />
                <span className="text-blue-300 font-semibold">With Complete Peace of Mind.</span>
              </h1>
              
              <p className="text-xs sm:text-base text-gray-200 max-w-xl font-normal leading-relaxed drop-shadow-sm">
                Discover vetted hotels, safari lodges, and serene guesthouses. Enjoy instant booking, transparent price breakdowns, and local payments via EcoCash and card.
              </p>
            </div>

            {/* Right Content: Full couple image reveals smoothly from left to right */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end animate-hero-image">
              <div className="relative w-full max-w-lg aspect-[16/10] sm:aspect-[16/9] lg:aspect-[16/10] rounded-xs overflow-hidden shadow-2xl border border-white/20 bg-gray-900 group">
                <Image
                  src="/hero-couple.png"
                  alt="Happy couple booking their stay on phone"
                  fill
                  priority
                  className="object-cover object-center transform group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Bottom Row: Search Widget reveals smoothly from bottom to center */}
          <div className="w-full pt-2 relative z-50 animate-hero-search">
            <SearchBar transparent />
          </div>
        </div>
      </section>

      {/* Value Pillars seamlessly docked against Hero with rich hospitality background */}
      <section className="relative z-10 py-16 sm:py-24 border-y border-white/10 dark:border-gray-800/80 overflow-hidden">
        {/* Background Image & Ambient Overlays */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/pillars-bg.jpg"
            alt="Hospitality interior"
            fill
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gray-950/85 backdrop-blur-[2px]" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/80" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2.5">
            <span className="text-[11px] font-semibold tracking-widest uppercase text-blue-400">Why Book With Us</span>
            <h2 className="text-2xl sm:text-3xl font-medium text-white tracking-tight">Seamless Travel, Zero Uncertainty</h2>
            <p className="text-xs sm:text-sm text-gray-300 font-normal leading-relaxed">Every reservation backed by direct host coordination, verified terms, and local payment gateways.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {/* Instant Confirmation */}
            <div className="group relative p-6 rounded-xs bg-white/[0.07] dark:bg-black/40 backdrop-blur-md border border-white/15 hover:border-blue-400/50 hover:bg-white/[0.12] transition-all duration-300 shadow-xl flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-semibold tracking-wider text-blue-400">01</span>
                  <span className="text-[10px] tracking-widest uppercase font-medium text-gray-400">Real-time</span>
                </div>
                <h3 className="font-medium text-base text-white group-hover:text-blue-200 transition-colors">Instant Confirmation</h3>
                <p className="text-xs text-gray-300 leading-relaxed font-normal">
                  No waiting on host callbacks. Your dates are locked immediately in the property inventory calendar.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-white/10 flex items-center gap-2">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] font-medium text-gray-300">Live Inventory Lock</span>
              </div>
            </div>

            {/* Transparent Pricing */}
            <div className="group relative p-6 rounded-xs bg-white/[0.07] dark:bg-black/40 backdrop-blur-md border border-white/15 hover:border-blue-400/50 hover:bg-white/[0.12] transition-all duration-300 shadow-xl flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-semibold tracking-wider text-emerald-400">02</span>
                  <span className="text-[10px] tracking-widest uppercase font-medium text-gray-400">No Surprises</span>
                </div>
                <h3 className="font-medium text-base text-white group-hover:text-emerald-200 transition-colors">Transparent Pricing</h3>
                <p className="text-xs text-gray-300 leading-relaxed font-normal">
                  Clear room rate, municipal taxes, and service fees breakdown. What you see upfront is exactly what you pay.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-white/10 flex items-center gap-2">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="text-[10px] font-medium text-gray-300">Itemized Breakdown</span>
              </div>
            </div>

            {/* Verified Stays Only */}
            <div className="group relative p-6 rounded-xs bg-white/[0.07] dark:bg-black/40 backdrop-blur-md border border-white/15 hover:border-blue-400/50 hover:bg-white/[0.12] transition-all duration-300 shadow-xl flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-semibold tracking-wider text-indigo-400">03</span>
                  <span className="text-[10px] tracking-widest uppercase font-medium text-gray-400">Authentic</span>
                </div>
                <h3 className="font-medium text-base text-white group-hover:text-indigo-200 transition-colors">Verified Stays Only</h3>
                <p className="text-xs text-gray-300 leading-relaxed font-normal">
                  Zero fake reviews or unvetted hosts. Only guests with completed check-outs can submit reviews and ratings.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-white/10 flex items-center gap-2">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-400" />
                <span className="text-[10px] font-medium text-gray-300">100% Guest-Validated</span>
              </div>
            </div>

            {/* Instant E-Voucher */}
            <div className="group relative p-6 rounded-xs bg-white/[0.07] dark:bg-black/40 backdrop-blur-md border border-white/15 hover:border-blue-400/50 hover:bg-white/[0.12] transition-all duration-300 shadow-xl flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-semibold tracking-wider text-amber-400">04</span>
                  <span className="text-[10px] tracking-widest uppercase font-medium text-gray-400">Mobile-Ready</span>
                </div>
                <h3 className="font-medium text-base text-white group-hover:text-amber-200 transition-colors">Instant E-Voucher</h3>
                <p className="text-xs text-gray-300 leading-relaxed font-normal">
                  Receive a digital confirmation voucher with a check-in QR code immediately via SMS and your account dashboard.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-white/10 flex items-center gap-2">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span className="text-[10px] font-medium text-gray-300">Fast Front-Desk Scan</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl font-medium text-gray-900 dark:text-white">Popular Destinations</h2>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 font-normal">Browse active lodgings across regional travel hubs</p>
          </div>
          <Link href="/search" className="text-xs font-normal text-[#2563EB] dark:text-blue-400 hover:underline flex items-center gap-1">
            <span>View All Stays</span>
            <ArrowUpRight className="w-3 h-3 stroke-[1.8]" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/search?city=Harare"
            className="group relative rounded-xs overflow-hidden aspect-[16/10] bg-gray-900 flex flex-col justify-end p-4 border border-gray-200 dark:border-gray-800 shadow-sm"
          >
            <Image
              src="/destination-harare.jpg"
              alt="Stays in Harare"
              fill
              className="object-cover object-center transform group-hover:scale-105 transition-transform duration-500 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/10 z-10" />
            <div className="relative z-20 text-white">
              <span className="text-[10px] tracking-wider uppercase font-medium text-blue-300">Capital Hub</span>
              <h3 className="text-base font-medium">Harare</h3>
              <p className="text-[11px] text-gray-300 font-normal">Boutique hotels & executive suites</p>
            </div>
          </Link>

          <Link
            href="/search?city=Victoria+Falls"
            className="group relative rounded-xs overflow-hidden aspect-[16/10] bg-gray-900 flex flex-col justify-end p-4 border border-gray-200 dark:border-gray-800 shadow-sm"
          >
            <Image
              src="/destination-vicfalls.jpg"
              alt="Stays in Victoria Falls"
              fill
              className="object-cover object-center transform group-hover:scale-105 transition-transform duration-500 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/10 z-10" />
            <div className="relative z-20 text-white">
              <span className="text-[10px] tracking-wider uppercase font-medium text-blue-300">Natural Wonder</span>
              <h3 className="text-base font-medium">Victoria Falls</h3>
              <p className="text-[11px] text-gray-300 font-normal">Safari lodges & riverfront retreats</p>
            </div>
          </Link>

          <Link
            href="/search?city=Bulawayo"
            className="group relative rounded-xs overflow-hidden aspect-[16/10] bg-gray-900 flex flex-col justify-end p-4 border border-gray-200 dark:border-gray-800 shadow-sm"
          >
            <Image
              src="/destination-bulawayo.jpg"
              alt="Stays in Bulawayo"
              fill
              className="object-cover object-center transform group-hover:scale-105 transition-transform duration-500 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/10 z-10" />
            <div className="relative z-20 text-white">
              <span className="text-[10px] tracking-wider uppercase font-medium text-blue-300">Heritage City</span>
              <h3 className="text-base font-medium">Bulawayo</h3>
              <p className="text-[11px] text-gray-300 font-normal">Colonial charm & tranquil gardens</p>
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}
