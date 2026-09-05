"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import {
  fetchManagedProperties,
  updateRoomAvailability
} from "@/lib/api";
import { SkeletonInventoryManager } from "@/components/Skeleton";
import {
  Layers,
  Calendar,
  DollarSign,
  Lock,
  Unlock,
  CheckCircle2,
  AlertCircle,
  Building2,
  ArrowLeft,
  ChevronRight,
  ShieldCheck,
  BedDouble,
  Search,
  Sparkles,
  RefreshCw,
  Sliders,
  Check,
  X,
  Menu,
  LayoutDashboard,
  Users
} from "lucide-react";

function InventoryContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedPropId = searchParams.get("propertyId");

  const [properties, setProperties] = useState<any[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [searchPropertyQuery, setSearchPropertyQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Form state for updating availability
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [availableCount, setAvailableCount] = useState<number>(5);
  const [priceOverride, setPriceOverride] = useState<string>("");
  const [isBlocked, setIsBlocked] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    const rawUser = localStorage.getItem("bookitnow_user");
    const token = localStorage.getItem("bookitnow_token");
    if (!rawUser || !token) {
      router.push("/login?redirect=/host/inventory");
      return;
    }

    try {
      const parsedUser = JSON.parse(rawUser);
      setUser(parsedUser);
      if (parsedUser.role !== "host" && parsedUser.role !== "admin" && parsedUser.role !== "staff") {
        router.push("/");
        return;
      }
      loadProperties(token);
    } catch (e) {
      router.push("/login");
    }
  }, [router]);

  useEffect(() => {
    // Default start & end dates: next 14 days
    const today = new Date();
    const d1 = new Date(today);
    d1.setDate(today.getDate() + 1);
    const d2 = new Date(today);
    d2.setDate(today.getDate() + 7);

    setStartDate(d1.toISOString().split("T")[0]);
    setEndDate(d2.toISOString().split("T")[0]);
  }, []);

  async function loadProperties(token: string) {
    setLoading(true);
    try {
      const data = await fetchManagedProperties(token);
      setProperties(data || []);

      if (data && data.length > 0) {
        let initialProp = data[0];
        if (requestedPropId) {
          const match = data.find((p: any) => p.id === requestedPropId);
          if (match) initialProp = match;
        }
        setSelectedProperty(initialProp);

        if (initialProp.room_types?.length > 0) {
          setSelectedRoom(initialProp.room_types[0]);
          setAvailableCount(initialProp.room_types[0].total_rooms || 1);
        }
      }
    } catch (err) {
      console.error("Failed to load managed properties:", err);
    } finally {
      setLoading(false);
    }
  }

  function handleSelectProperty(prop: any) {
    setSelectedProperty(prop);
    if (prop.room_types?.length > 0) {
      setSelectedRoom(prop.room_types[0]);
      setAvailableCount(prop.room_types[0].total_rooms || 1);
    } else {
      setSelectedRoom(null);
    }
  }

  function handleSelectRoom(room: any) {
    setSelectedRoom(room);
    setAvailableCount(room.total_rooms || 1);
    setPriceOverride("");
    setIsBlocked(false);
    setStatusMessage(null);
  }

  async function handleAvailabilitySubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedRoom) return;
    const token = localStorage.getItem("bookitnow_token");
    if (!token) return;

    if (!startDate || !endDate) {
      setStatusMessage({ type: "error", text: "Please choose valid start and end dates." });
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      setStatusMessage({ type: "error", text: "End date must be on or after start date." });
      return;
    }

    setSubmitting(true);
    setStatusMessage(null);

    try {
      await updateRoomAvailability(
        selectedRoom.id,
        {
          start_date: startDate,
          end_date: endDate,
          available_count: availableCount,
          price_override: priceOverride ? parseFloat(priceOverride) : undefined,
          is_blocked: isBlocked
        },
        token
      );

      setStatusMessage({
        type: "success",
        text: `Successfully synchronized availability and pricing for "${selectedRoom.name}".`
      });
    } catch (err: any) {
      setStatusMessage({
        type: "error",
        text: err.message || "Failed to update room availability."
      });
    } finally {
      setSubmitting(false);
    }
  }

  const filteredProperties = properties.filter((p) =>
    p.title.toLowerCase().includes(searchPropertyQuery.toLowerCase()) ||
    p.city.toLowerCase().includes(searchPropertyQuery.toLowerCase())
  );

  if (loading) {
    return <SkeletonInventoryManager />;
  }

  return (
    <div className="min-h-screen flex bg-[#F8FAFC] dark:bg-[#070B14] text-gray-900 dark:text-gray-100">
      {/* ============================================================ */}
      {/* INVENTORY MANAGER SIDEBAR                                    */}
      {/* ============================================================ */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-30 w-72 bg-[#0B101E] border-r border-gray-800 flex flex-col justify-between transition-transform duration-200 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header with real BookItNow logo */}
          <div className="p-4 border-b border-gray-800 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0 shadow-md ring-1 ring-white/20 bg-white/5">
                <Image
                  src="/logo.png"
                  alt="BookItNow Logo"
                  fill
                  sizes="40px"
                  className="object-contain"
                  priority
                />
              </div>
              <div className="min-w-0">
                <span className="text-sm font-bold text-white tracking-tight block">
                  BookItNow
                </span>
                <span className="text-[10px] font-semibold text-cyan-400 uppercase tracking-wider block">
                  Inventory Console
                </span>
              </div>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1.5 text-gray-400 hover:text-white rounded-xs"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Nav Links */}
          <div className="p-3 border-b border-gray-800/80 space-y-1">
            <Link
              href="/admin"
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xs text-xs font-semibold text-gray-400 hover:text-white hover:bg-gray-900/60 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 text-blue-400" />
              <span>Back to Central Admin</span>
            </Link>
          </div>

          {/* Properties List in Sidebar */}
          <div className="p-3 flex-1 overflow-y-auto space-y-3">
            <div className="px-2 pt-1 flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                Select Property ({filteredProperties.length})
              </span>
            </div>

            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search stay..."
                value={searchPropertyQuery}
                onChange={(e) => setSearchPropertyQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xs border border-gray-800 bg-[#070B14] text-gray-200 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="space-y-1.5">
              {filteredProperties.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    handleSelectProperty(p);
                    setSidebarOpen(false);
                  }}
                  className={`w-full text-left p-3 rounded-xs border text-xs transition-all cursor-pointer ${
                    selectedProperty?.id === p.id
                      ? "border-cyan-500 bg-cyan-950/40 text-cyan-200 font-semibold shadow-xs"
                      : "border-gray-800/80 hover:border-gray-700 bg-gray-900/40 text-gray-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="truncate">{p.title}</span>
                    <ChevronRight className="w-3.5 h-3.5 shrink-0 opacity-60" />
                  </div>
                  <span className="text-[10px] text-gray-400 font-normal block mt-0.5">
                    {p.city} · {p.room_types?.length || 0} categories
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* User status */}
          <div className="p-4 border-t border-gray-800 bg-[#070B14]">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-cyan-600 text-white font-bold flex items-center justify-center text-xs">
                {user?.first_name ? user.first_name[0].toUpperCase() : "M"}
              </div>
              <div className="min-w-0">
                <span className="text-xs font-semibold text-white block truncate">
                  {user?.first_name} {user?.last_name}
                </span>
                <span className="text-[10px] text-gray-400 block font-mono">Role: {user?.role}</span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Backdrop for mobile */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/60 lg:hidden backdrop-blur-xs"
        />
      )}

      {/* ============================================================ */}
      {/* MAIN INVENTORY & PRICING WORKSPACE                           */}
      {/* ============================================================ */}
      <main className="flex-1 lg:pl-72 flex flex-col min-w-0">
        {/* Top Control Bar */}
        <header className="sticky top-0 z-20 bg-white/95 dark:bg-[#0B101E]/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 px-4 sm:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xs"
              >
                <Menu className="w-5 h-5" />
              </button>

              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-cyan-100 text-cyan-800 dark:bg-cyan-900/40 dark:text-cyan-300">
                    Live Rates Engine
                  </span>
                  <span className="text-xs text-gray-500 hidden sm:inline">· Availability & Quota Override</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                  {selectedProperty ? selectedProperty.title : "Live Inventory & Rates Manager"}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/admin"
                className="px-3 py-1.5 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-xs font-semibold rounded-xs transition-colors flex items-center gap-1.5"
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-blue-500" />
                <span className="hidden sm:inline">Admin Overview</span>
              </Link>
            </div>
          </div>
        </header>

        {/* Workspace Body */}
        <div className="p-4 sm:p-8 max-w-7xl w-full mx-auto space-y-6">
          {properties.length === 0 ? (
            <div className="p-10 sm:p-14 text-center bg-white dark:bg-[#0B101E] border border-gray-200 dark:border-gray-800 rounded-xs space-y-4 max-w-2xl mx-auto shadow-xs">
              <div className="relative w-64 h-64 sm:w-72 sm:h-72 mx-auto">
                <Image
                  src="/empty-state-working.png"
                  alt="No managed properties found illustration"
                  fill
                  priority
                  className="object-contain"
                />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">
                  No Managed Properties Found
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 max-w-md mx-auto leading-relaxed">
                  You do not have any properties assigned to manage or approve yet. Add your first lodging listing to start setting seasonal rates and inventory quotas.
                </p>
              </div>
              <div className="pt-2 flex justify-center gap-3">
                <Link
                  href="/admin"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xs transition-colors shadow-xs"
                >
                  Go to Admin Dashboard
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Room Categories Selector */}
              <div className="lg:col-span-4 space-y-4">
                <div className="bg-white dark:bg-[#0B101E] border border-gray-200 dark:border-gray-800 rounded-xs p-5 space-y-4 shadow-xs">
                  <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 block">
                      Room Types & Suites ({selectedProperty?.room_types?.length || 0})
                    </span>
                    <span className="text-xs text-gray-500 font-mono">
                      {selectedProperty?.city}
                    </span>
                  </div>

                  <div className="space-y-2">
                    {selectedProperty?.room_types?.length === 0 ? (
                      <div className="p-4 text-center border border-dashed border-gray-300 dark:border-gray-700 rounded-xs space-y-2">
                        <p className="text-xs text-gray-500">No rooms listed under this property yet.</p>
                        <Link
                          href="/admin"
                          className="inline-block px-3 py-1.5 bg-blue-600 text-white text-[11px] font-semibold rounded-xs"
                        >
                          + Add Room in Admin
                        </Link>
                      </div>
                    ) : (
                      selectedProperty?.room_types?.map((room: any) => (
                        <button
                          key={room.id}
                          onClick={() => handleSelectRoom(room)}
                          className={`w-full text-left p-3.5 rounded-xs border text-xs transition-all cursor-pointer ${
                            selectedRoom?.id === room.id
                              ? "border-blue-600 bg-blue-50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200 font-semibold shadow-xs"
                              : "border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 bg-white dark:bg-[#0B101E] text-gray-700 dark:text-gray-300"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-sm">{room.name}</span>
                            <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                              ${room.base_price_per_night}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-[11px] text-gray-500 mt-1.5">
                            <span>Capacity: {room.total_rooms} units</span>
                            <span>{room.max_adults} Adults · {room.max_children} Children</span>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                </div>

                {/* Quick Info Box */}
                <div className="bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/40 rounded-xs p-4 text-xs space-y-2 text-blue-900 dark:text-blue-200">
                  <div className="flex items-center gap-1.5 font-bold">
                    <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                    <span>Instant Central Sync</span>
                  </div>
                  <p className="text-[11px] text-blue-800/80 dark:text-blue-300/80 leading-relaxed">
                    Updates to quotas or price overrides instantly reflect across all guest search results and booking checkout flows without delay.
                  </p>
                </div>
              </div>

              {/* Main Column: Availability & Price Override Form */}
              <div className="lg:col-span-8">
                {selectedRoom ? (
                  <div className="bg-white dark:bg-[#0B101E] border border-gray-200 dark:border-gray-800 rounded-xs p-6 sm:p-8 space-y-6 shadow-xs">
                    <div className="border-b border-gray-100 dark:border-gray-800 pb-5 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 uppercase">
                          Target Suite
                        </span>
                        <span className="text-xs text-gray-400 font-mono">ID: {selectedRoom.id.slice(0, 8)}...</span>
                      </div>
                      <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{selectedRoom.name}</h2>
                      <p className="text-xs text-gray-500">
                        Lodging: <span className="font-semibold text-gray-700 dark:text-gray-300">{selectedProperty?.title}</span> · Base Price: <span className="font-bold text-emerald-600">${selectedRoom.base_price_per_night} USD</span>
                      </p>
                    </div>

                    {statusMessage && (
                      <div
                        className={`p-3.5 rounded-xs text-xs font-medium flex items-center justify-between gap-2 border animate-in fade-in duration-150 ${
                          statusMessage.type === "success"
                            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300"
                            : "bg-red-500/10 border-red-500/30 text-red-700 dark:text-red-300"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {statusMessage.type === "success" ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                          ) : (
                            <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                          )}
                          <span>{statusMessage.text}</span>
                        </div>
                        <button onClick={() => setStatusMessage(null)} className="p-0.5 text-gray-400 hover:text-gray-600">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                    <form onSubmit={handleAvailabilitySubmit} className="space-y-6">
                      {/* Dates Selection */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="block text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                            Start Date *
                          </label>
                          <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full px-3.5 py-2.5 text-xs rounded-xs border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 focus:outline-none focus:border-blue-500"
                            required
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="block text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                            End Date *
                          </label>
                          <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full px-3.5 py-2.5 text-xs rounded-xs border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 focus:outline-none focus:border-blue-500"
                            required
                          />
                        </div>
                      </div>

                      {/* Inventory Count & Price Override */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="block text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                            Available Rooms Quota
                          </label>
                          <input
                            type="number"
                            min={0}
                            max={selectedRoom.total_rooms || 50}
                            value={availableCount}
                            onChange={(e) => setAvailableCount(parseInt(e.target.value) || 0)}
                            className="w-full px-3.5 py-2.5 text-xs rounded-xs border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 focus:outline-none focus:border-blue-500 font-semibold"
                            required
                          />
                          <span className="text-[10px] text-gray-400">
                            Max physical rooms in inventory: {selectedRoom.total_rooms}
                          </span>
                        </div>

                        <div className="space-y-1.5">
                          <label className="block text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                            Price Override per Night ($ USD)
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            placeholder={`Default: $${selectedRoom.base_price_per_night}`}
                            value={priceOverride}
                            onChange={(e) => setPriceOverride(e.target.value)}
                            className="w-full px-3.5 py-2.5 text-xs rounded-xs border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 focus:outline-none focus:border-blue-500 font-semibold"
                          />
                          <span className="text-[10px] text-gray-400">
                            Leave blank to keep standard base price
                          </span>
                        </div>
                      </div>

                      {/* Maintenance / Blocked Toggle */}
                      <div className="p-4 rounded-xs border border-gray-200 dark:border-gray-800 bg-gray-50/40 dark:bg-gray-900/30 flex items-center justify-between">
                        <div className="space-y-0.5">
                          <span className="text-xs font-semibold text-gray-900 dark:text-white flex items-center gap-1.5">
                            {isBlocked ? <Lock className="w-3.5 h-3.5 text-red-500" /> : <Unlock className="w-3.5 h-3.5 text-emerald-500" />}
                            Block Selected Dates
                          </span>
                          <p className="text-[11px] text-gray-500">
                            Prevents all guest bookings across this date range (e.g., renovations or private buyouts).
                          </p>
                        </div>

                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isBlocked}
                            onChange={(e) => setIsBlocked(e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-red-600"></div>
                        </label>
                      </div>

                      <div className="pt-2 flex justify-end">
                        <button
                          type="submit"
                          disabled={submitting}
                          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-semibold rounded-xs shadow-sm flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                        >
                          <Calendar className="w-4 h-4" />
                          <span>{submitting ? "Synchronizing..." : "Update Availability & Rates"}</span>
                        </button>
                      </div>
                    </form>
                  </div>
                ) : (
                  <div className="p-12 text-center bg-white dark:bg-[#0B101E] border border-gray-200 dark:border-gray-800 rounded-xs space-y-2">
                    <p className="text-xs text-gray-500">Select a room category to manage inventory.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default function InventoryManagementPage() {
  return (
    <Suspense fallback={<SkeletonInventoryManager />}>
      <InventoryContent />
    </Suspense>
  );
}
