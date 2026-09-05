"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import {
  fetchManagedProperties,
  updateRoomAvailability
} from "@/lib/api";
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
  ShieldAlert
} from "lucide-react";

function InventoryContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedPropId = searchParams.get("propertyId");

  const [properties, setProperties] = useState<any[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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
      if (parsedUser.role !== "host" && parsedUser.role !== "admin") {
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#070B14] flex items-center justify-center p-6">
        <div className="space-y-3 text-center">
          <div className="w-10 h-10 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-gray-500">Loading live inventory and rates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#070B14] text-gray-900 dark:text-gray-100">
      {/* Top Header */}
      <div className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0B101E] px-4 sm:px-8 py-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Link
                href="/admin"
                className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1 font-medium"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Admin Dashboard</span>
              </Link>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Live Inventory & Rates Manager</h1>
            <p className="text-xs text-gray-500">
              Directly lock dates, set seasonal rates, or update available room quotas in the central ledger.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
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
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Sidebar: Property & Room Selector */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white dark:bg-[#0B101E] border border-gray-200 dark:border-gray-800 rounded-xs p-5 space-y-4">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 block">
                  Select Property
                </span>

                <div className="space-y-2">
                  {properties.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => handleSelectProperty(p)}
                      className={`w-full text-left p-3 rounded-xs border text-xs transition-all cursor-pointer ${
                        selectedProperty?.id === p.id
                          ? "border-blue-600 bg-blue-50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200 font-semibold"
                          : "border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 bg-transparent text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="truncate">{p.title}</span>
                        <ChevronRight className="w-3.5 h-3.5 shrink-0 opacity-60" />
                      </div>
                      <span className="text-[10px] text-gray-500 font-normal block mt-1">
                        {p.city} · {p.room_types?.length || 0} room categories
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {selectedProperty && (
                <div className="bg-white dark:bg-[#0B101E] border border-gray-200 dark:border-gray-800 rounded-xs p-5 space-y-4">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 block">
                    Room Category ({selectedProperty.room_types?.length || 0})
                  </span>

                  <div className="space-y-2">
                    {selectedProperty.room_types?.length === 0 ? (
                      <p className="text-xs text-gray-500">No rooms listed under this lodging yet.</p>
                    ) : (
                      selectedProperty.room_types.map((room: any) => (
                        <button
                          key={room.id}
                          onClick={() => handleSelectRoom(room)}
                          className={`w-full text-left p-3 rounded-xs border text-xs transition-all cursor-pointer ${
                            selectedRoom?.id === room.id
                              ? "border-blue-600 bg-blue-50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200 font-semibold"
                              : "border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 bg-transparent text-gray-700 dark:text-gray-300"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span>{room.name}</span>
                            <span className="font-mono text-emerald-600 dark:text-emerald-400">
                              ${room.base_price_per_night}
                            </span>
                          </div>
                          <span className="text-[10px] text-gray-500 font-normal block mt-1">
                            Physical Capacity: {room.total_rooms} rooms
                          </span>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Right Main Column: Bulk Availability & Override Form */}
            <div className="lg:col-span-8">
              {selectedRoom ? (
                <div className="bg-white dark:bg-[#0B101E] border border-gray-200 dark:border-gray-800 rounded-xs p-6 sm:p-8 space-y-6">
                  <div className="border-b border-gray-100 dark:border-gray-800 pb-5 space-y-1">
                    <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                      Target Room Category
                    </span>
                    <h2 className="text-xl font-bold">{selectedRoom.name}</h2>
                    <p className="text-xs text-gray-500">
                      Lodging: <span className="font-semibold text-gray-700 dark:text-gray-300">{selectedProperty?.title}</span> · Base Price: <span className="font-semibold text-emerald-600">${selectedRoom.base_price_per_night} USD</span>
                    </p>
                  </div>

                  {statusMessage && (
                    <div
                      className={`p-3.5 rounded-xs text-xs font-medium flex items-center gap-2 border ${
                        statusMessage.type === "success"
                          ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300"
                          : "bg-red-500/10 border-red-500/30 text-red-700 dark:text-red-300"
                      }`}
                    >
                      {statusMessage.type === "success" ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                      )}
                      <span>{statusMessage.text}</span>
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
                          className="w-full px-3.5 py-2.5 text-xs rounded-xs border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 focus:outline-none focus:border-blue-500"
                          required
                        />
                        <span className="text-[10px] text-gray-400">
                          Max available physical rooms: {selectedRoom.total_rooms}
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
                          className="w-full px-3.5 py-2.5 text-xs rounded-xs border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 focus:outline-none focus:border-blue-500"
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
                  <p className="text-xs text-gray-500">Select a room category on the left to manage inventory.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function InventoryManagementPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 dark:bg-[#070B14] flex items-center justify-center p-6">
          <div className="w-10 h-10 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <InventoryContent />
    </Suspense>
  );
}
