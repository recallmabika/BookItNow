import SearchBar from "@/components/SearchBar";
import Link from "next/link";
import { ShieldCheck, Zap, Wallet, QrCode } from "lucide-react";

export default function HomePage() {
  return (
    <div className="space-y-16 sm:space-y-24">
      {/* Hero Section */}
      <section className="relative pt-12 sm:pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-deep-teal/10 text-deep-teal text-xs font-semibold tracking-wide">
            <span className="w-2 h-2 rounded-full bg-deep-teal animate-pulse" />
            Verified Lodgings & Regional Travel
          </div>
          
          <h1 className="text-4xl sm:text-6xl font-serif font-bold text-ink tracking-tight leading-[1.1]">
            Book Authentic Lodging, <br className="hidden sm:inline" />
            <span className="text-deep-teal">With Complete Peace of Mind.</span>
          </h1>
          
          <p className="text-base sm:text-lg text-slate-muted max-w-2xl mx-auto">
            Discover vetted hotels, safari lodges, and serene guesthouses. Enjoy instant booking, transparent price breakdowns, and local payments via EcoCash and card.
          </p>
        </div>

        {/* Live Search Widget */}
        <div className="mt-10 sm:mt-12">
          <SearchBar />
        </div>
      </section>

      {/* Value Pillars (per README specifications) */}
      <section className="bg-parchment-light py-16 border-y border-slate-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-deep-teal/10 text-deep-teal flex items-center justify-center">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-lg text-ink">Instant Confirmation</h3>
              <p className="text-xs text-slate-muted leading-relaxed">
                No waiting on host callbacks. Your dates are locked immediately in the inventory calendar.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-ochre/15 text-ochre flex items-center justify-center">
                <Wallet className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-lg text-ink">Transparent Pricing</h3>
              <p className="text-xs text-slate-muted leading-relaxed">
                Clear room rate, taxes, and fees breakdown. What you see is exactly what you pay.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-deep-teal/10 text-deep-teal flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-lg text-ink">Verified Stays Only</h3>
              <p className="text-xs text-slate-muted leading-relaxed">
                Zero fake reviews. Only guests with checked-out completed stays can write reviews.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-ochre/15 text-ochre flex items-center justify-center">
                <QrCode className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-lg text-ink">Instant E-Voucher</h3>
              <p className="text-xs text-slate-muted leading-relaxed">
                Receive an immediate digital voucher with a check-in QR code sent right to your device.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Cities Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-ink">Popular Destinations</h2>
            <p className="text-sm text-slate-muted">Browse active lodgings across regional travel hubs</p>
          </div>
          <Link href="/search" className="text-sm font-semibold text-deep-teal hover:underline">
            View All Stays →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Link
            href="/search?city=Harare"
            className="group relative rounded-2xl overflow-hidden aspect-[4/3] bg-ink/10 flex flex-col justify-end p-6 border border-slate-subtle hover:shadow-lg transition-all"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/30 to-transparent z-10" />
            <div className="relative z-20 text-[#EFEAE1]">
              <span className="text-xs tracking-wider uppercase font-semibold text-ochre">Capital Hub</span>
              <h3 className="text-2xl font-serif font-bold">Harare</h3>
              <p className="text-xs text-slate-light mt-1">Boutique hotels & executive suites</p>
            </div>
          </Link>

          <Link
            href="/search?city=Victoria+Falls"
            className="group relative rounded-2xl overflow-hidden aspect-[4/3] bg-ink/10 flex flex-col justify-end p-6 border border-slate-subtle hover:shadow-lg transition-all"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/30 to-transparent z-10" />
            <div className="relative z-20 text-[#EFEAE1]">
              <span className="text-xs tracking-wider uppercase font-semibold text-ochre">Adventure & Wonders</span>
              <h3 className="text-2xl font-serif font-bold">Victoria Falls</h3>
              <p className="text-xs text-slate-light mt-1">Safari lodges & riverfront retreats</p>
            </div>
          </Link>

          <Link
            href="/search?city=Bulawayo"
            className="group relative rounded-2xl overflow-hidden aspect-[4/3] bg-ink/10 flex flex-col justify-end p-6 border border-slate-subtle hover:shadow-lg transition-all"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/30 to-transparent z-10" />
            <div className="relative z-20 text-[#EFEAE1]">
              <span className="text-xs tracking-wider uppercase font-semibold text-ochre">Heritage & Culture</span>
              <h3 className="text-2xl font-serif font-bold">Bulawayo</h3>
              <p className="text-xs text-slate-light mt-1">Historic guesthouses & nature camps</p>
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}
