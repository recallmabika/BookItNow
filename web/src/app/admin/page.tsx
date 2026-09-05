"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  fetchManagedProperties,
  fetchManagedBookings,
  updatePropertyStatus
} from "@/lib/api";
import {
  Building2,
  CalendarCheck,
  DollarSign,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  Layers,
  Search,
  ExternalLink,
  ShieldAlert,
  ArrowRight
} from "lucide-react";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [properties, setProperties] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "properties" | "bookings">("overview");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState("");

  useEffect(() => {
    const rawUser = localStorage.getItem("bookitnow_user");
    const token = localStorage.getItem("bookitnow_token");
    if (!rawUser || !token) {
      router.push("/login?redirect=/admin");
      return;
    }

    try {
      const parsedUser = JSON.parse(rawUser);
      setUser(parsedUser);
      if (parsedUser.role !== "admin" && parsedUser.role !== "host") {
        router.push("/");
        return;
      }

      loadData(token);
    } catch (e) {
      router.push("/login");
    }
  }, [router]);

  async function loadData(token: string) {
    setLoading(true);
    try {
      const [propsData, booksData] = await Promise.all([
        fetchManagedProperties(token),
        fetchManagedBookings(token)
      ]);
      setProperties(propsData || []);
      setBookings(booksData || []);
    } catch (err) {
      console.error("Failed to load admin data:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(propertyId: string, newStatus: string) {
    const token = localStorage.getItem("bookitnow_token");
    if (!token) return;

    setActionLoading(propertyId);
    try {
      await updatePropertyStatus(propertyId, newStatus, token);
      setProperties((prev) =>
        prev.map((p) => (p.id === propertyId ? { ...p, status: newStatus } : p))
      );
      setActionSuccess(`Property status successfully updated to ${newStatus}.`);
      setTimeout(() => setActionSuccess(""), 4000);
    } catch (err: any) {
      alert(err.message || "Failed to update property status");
    } finally {
      setActionLoading(null);
    }
  }

  const totalProperties = properties.length;
  const activeProperties = properties.filter((p) => p.status === "active").length;
  const pendingProperties = properties.filter((p) => p.status === "pending_approval").length;
  const totalBookings = bookings.length;
  const totalRevenue = bookings
    .filter((b) => b.status === "confirmed" || b.status === "completed")
    .reduce((acc, b) => acc + (parseFloat(b.total_amount) || 0), 0);

  const filteredProperties = properties.filter((p) => {
    const matchesStatus = statusFilter === "all" || p.status === statusFilter;
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.city.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#090D16] p-4 sm:p-8 flex items-center justify-center">
        <div className="space-y-3 text-center">
          <div className="w-10 h-10 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-gray-500">Loading marketplace admin data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#070B14] text-gray-900 dark:text-gray-100">
      {/* Top Header */}
      <div className="border-b border-gray-200 dark:border-gray-800/80 bg-white dark:bg-[#0B101E] px-4 sm:px-8 py-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300">
                {user?.role === "admin" ? "Super Admin" : "Host Portal"}
              </span>
              <span className="text-xs text-gray-500">Marketplace Management</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Admin & Operations Dashboard</h1>
            <p className="text-xs text-gray-500">Oversee live lodging inventory, host listings, and guest reservations.</p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/host/inventory"
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-semibold rounded-xs shadow-sm flex items-center gap-2 transition-all cursor-pointer"
            >
              <Layers className="w-4 h-4" />
              <span>Inventory Management</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
        {actionSuccess && (
          <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 rounded-xs text-xs font-medium flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>{actionSuccess}</span>
          </div>
        )}

        {/* Quick KPI Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 bg-white dark:bg-[#0B101E] border border-gray-200 dark:border-gray-800 rounded-xs shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Properties</span>
              <Building2 className="w-4 h-4 text-blue-500" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold">{totalProperties}</span>
              <span className="text-[11px] text-emerald-600 font-medium">({activeProperties} Active)</span>
            </div>
            <p className="text-[11px] text-gray-500">{pendingProperties} pending approvals</p>
          </div>

          <div className="p-5 bg-white dark:bg-[#0B101E] border border-gray-200 dark:border-gray-800 rounded-xs shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Total Bookings</span>
              <CalendarCheck className="w-4 h-4 text-indigo-500" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold">{totalBookings}</span>
              <span className="text-[11px] text-blue-600 font-medium">Real Reservations</span>
            </div>
            <p className="text-[11px] text-gray-500">Live guest bookings across all stays</p>
          </div>

          <div className="p-5 bg-white dark:bg-[#0B101E] border border-gray-200 dark:border-gray-800 rounded-xs shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Gross Volume</span>
              <DollarSign className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold">${totalRevenue.toFixed(2)}</span>
              <span className="text-[11px] text-emerald-600 font-medium">USD</span>
            </div>
            <p className="text-[11px] text-gray-500">Confirmed transaction value</p>
          </div>

          <div className="p-5 bg-white dark:bg-[#0B101E] border border-gray-200 dark:border-gray-800 rounded-xs shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Platform Health</span>
              <TrendingUp className="w-4 h-4 text-amber-500" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold">100%</span>
              <span className="text-[11px] text-emerald-600 font-medium">Online</span>
            </div>
            <p className="text-[11px] text-gray-500">PostgreSQL 17 & Redis lock ready</p>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center border-b border-gray-200 dark:border-gray-800 gap-6 text-xs font-semibold">
          <button
            onClick={() => setActiveTab("overview")}
            className={`pb-3 transition-colors cursor-pointer border-b-2 ${
              activeTab === "overview"
                ? "border-blue-600 text-blue-600 dark:text-blue-400"
                : "border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            All Lodgings & Properties ({properties.length})
          </button>
          <button
            onClick={() => setActiveTab("bookings")}
            className={`pb-3 transition-colors cursor-pointer border-b-2 ${
              activeTab === "bookings"
                ? "border-blue-600 text-blue-600 dark:text-blue-400"
                : "border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            System Bookings & E-Vouchers ({bookings.length})
          </button>
        </div>

        {/* Properties Table Section */}
        {activeTab === "overview" && (
          <div className="space-y-4">
            {/* Filter controls */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by lodging name or city..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs rounded-xs border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0B101E] focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] text-gray-500 font-medium">Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 text-xs rounded-xs border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0B101E] focus:outline-none cursor-pointer"
                >
                  <option value="all">All Statuses</option>
                  <option value="active">Active Only</option>
                  <option value="pending_approval">Pending Approval</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto border border-gray-200 dark:border-gray-800 rounded-xs bg-white dark:bg-[#0B101E]">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-800 text-[11px] uppercase tracking-wider text-gray-500 font-semibold">
                  <tr>
                    <th className="px-5 py-3">Property</th>
                    <th className="px-5 py-3">Location</th>
                    <th className="px-5 py-3">Type</th>
                    <th className="px-5 py-3">Rooms</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800/60">
                  {filteredProperties.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-5 py-12 text-center text-gray-500">
                        No properties found matching your criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredProperties.map((prop) => (
                      <tr key={prop.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-900/30 transition-colors">
                        <td className="px-5 py-4 font-medium">
                          <div className="space-y-0.5">
                            <span className="text-sm font-semibold text-gray-900 dark:text-white block">
                              {prop.title}
                            </span>
                            <span className="text-[10px] text-gray-400 font-mono">slug: {prop.slug}</span>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-gray-600 dark:text-gray-300">
                          {prop.city}, {prop.country}
                        </td>
                        <td className="px-5 py-4 capitalize text-gray-600 dark:text-gray-300">
                          {prop.property_type}
                        </td>
                        <td className="px-5 py-4 text-gray-600 dark:text-gray-300">
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {prop.room_types?.length || 0}
                          </span> room types
                        </td>
                        <td className="px-5 py-4">
                          {prop.status === "active" && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              Active
                            </span>
                          )}
                          {prop.status === "pending_approval" && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                              <Clock className="w-3 h-3 text-amber-600" />
                              Pending Approval
                            </span>
                          )}
                          {prop.status === "suspended" && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300">
                              <XCircle className="w-3 h-3 text-red-600" />
                              Suspended
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              href={`/properties/${prop.slug}`}
                              target="_blank"
                              className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors"
                              title="View Guest Page"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Link>

                            <Link
                              href={`/host/inventory?propertyId=${prop.id}`}
                              className="px-2.5 py-1 bg-gray-100 dark:bg-gray-800 hover:bg-blue-600 hover:text-white rounded-xs text-[11px] font-medium transition-colors"
                            >
                              Inventory
                            </Link>

                            {user?.role === "admin" && (
                              <div className="flex items-center gap-1 pl-2 border-l border-gray-200 dark:border-gray-800">
                                {prop.status !== "active" && (
                                  <button
                                    onClick={() => handleStatusChange(prop.id, "active")}
                                    disabled={actionLoading === prop.id}
                                    className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xs text-[10px] font-semibold transition-colors cursor-pointer"
                                  >
                                    Approve
                                  </button>
                                )}
                                {prop.status === "active" && (
                                  <button
                                    onClick={() => handleStatusChange(prop.id, "suspended")}
                                    disabled={actionLoading === prop.id}
                                    className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded-xs text-[10px] font-semibold transition-colors cursor-pointer"
                                  >
                                    Suspend
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Bookings Section */}
        {activeTab === "bookings" && (
          <div className="space-y-4">
            <div className="overflow-x-auto border border-gray-200 dark:border-gray-800 rounded-xs bg-white dark:bg-[#0B101E]">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-800 text-[11px] uppercase tracking-wider text-gray-500 font-semibold">
                  <tr>
                    <th className="px-5 py-3">Reference</th>
                    <th className="px-5 py-3">Stay Dates</th>
                    <th className="px-5 py-3">Rooms & Guests</th>
                    <th className="px-5 py-3">Total Amount</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3">Booked At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800/60">
                  {bookings.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-5 py-12 text-center text-gray-500">
                        No guest bookings recorded in the system yet.
                      </td>
                    </tr>
                  ) : (
                    bookings.map((b) => (
                      <tr key={b.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-900/30 transition-colors">
                        <td className="px-5 py-4 font-mono font-semibold text-blue-600 dark:text-blue-400">
                          {b.booking_reference}
                        </td>
                        <td className="px-5 py-4 text-gray-700 dark:text-gray-300 font-medium">
                          {b.check_in_date} → {b.check_out_date}
                        </td>
                        <td className="px-5 py-4 text-gray-600 dark:text-gray-400">
                          {b.rooms_count} room · {b.adults_count} adults
                        </td>
                        <td className="px-5 py-4 font-semibold text-gray-900 dark:text-white">
                          ${parseFloat(b.total_amount).toFixed(2)} {b.currency}
                        </td>
                        <td className="px-5 py-4">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 uppercase">
                            {b.status}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-gray-500 text-[11px]">
                          {new Date(b.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
