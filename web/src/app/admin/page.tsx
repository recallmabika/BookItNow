"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  fetchManagedProperties,
  fetchManagedBookings,
  updatePropertyStatus,
  createProperty,
  deleteProperty,
  addRoomType,
  fetchAllUsers,
  adminCreateUser,
  toggleUserStatus
} from "@/lib/api";
import { SkeletonAdminDashboard } from "@/components/Skeleton";
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
  Plus,
  Trash2,
  BedDouble,
  Users,
  UserCheck,
  UserX,
  UserPlus,
  KeyRound,
  ShieldCheck,
  Sparkles,
  RefreshCw,
  LogOut,
  X,
  LayoutDashboard,
  Calendar,
  Settings,
  ShieldAlert,
  ChevronRight,
  Sliders,
  Menu
} from "lucide-react";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [properties, setProperties] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<"overview" | "properties" | "bookings" | "users">("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Filters & Search
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState("all");

  // Notifications
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState("");
  const [actionError, setActionError] = useState("");

  // Create User Modal States
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [createUserSubmitting, setCreateUserSubmitting] = useState(false);
  const [createUserError, setCreateUserError] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");
  const [newUserFirstName, setNewUserFirstName] = useState("");
  const [newUserLastName, setNewUserLastName] = useState("");
  const [newUserPhone, setNewUserPhone] = useState("");
  const [newUserRole, setNewUserRole] = useState("staff");

  // Create Property Modal States
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createSubmitting, setCreateSubmitting] = useState(false);
  const [createError, setCreateError] = useState("");
  const [newPropTitle, setNewPropTitle] = useState("");
  const [newPropDesc, setNewPropDesc] = useState("");
  const [newPropType, setNewPropType] = useState("lodge");
  const [newPropCity, setNewPropCity] = useState("Harare");
  const [newPropAddress, setNewPropAddress] = useState("");

  // Add Room Type Modal States
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [targetProperty, setTargetProperty] = useState<any>(null);
  const [roomSubmitting, setRoomSubmitting] = useState(false);
  const [roomError, setRoomError] = useState("");
  const [roomName, setRoomName] = useState("");
  const [roomDesc, setRoomDesc] = useState("");
  const [roomAdults, setRoomAdults] = useState(2);
  const [roomChildren, setRoomChildren] = useState(0);
  const [roomTotalCount, setRoomTotalCount] = useState(5);
  const [roomBasePrice, setRoomBasePrice] = useState(150);
  const [roomCurrency, setRoomCurrency] = useState("USD");

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
      if (parsedUser.role !== "admin" && parsedUser.role !== "host" && parsedUser.role !== "staff") {
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
    setActionError("");
    try {
      const [propsData, booksData, usersData] = await Promise.all([
        fetchManagedProperties(token),
        fetchManagedBookings(token),
        fetchAllUsers(token).catch(() => [])
      ]);
      setProperties(propsData || []);
      setBookings(booksData || []);
      setUsersList(usersData || []);
    } catch (err: any) {
      console.error("Failed to load admin data:", err);
      setActionError(err.message || "Failed to load management data from server.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateUserSubmit(e: React.FormEvent) {
    e.preventDefault();
    setCreateUserError("");
    const token = localStorage.getItem("bookitnow_token");
    if (!token) {
      setCreateUserError("Authentication expired. Please log in again.");
      return;
    }

    if (!newUserEmail.trim() || !newUserPassword.trim()) {
      setCreateUserError("Email and temporary password are required.");
      return;
    }

    setCreateUserSubmitting(true);
    try {
      const res = await adminCreateUser(
        {
          email: newUserEmail.trim(),
          password: newUserPassword,
          first_name: newUserFirstName.trim() || "Staff",
          last_name: newUserLastName.trim() || "Member",
          phone_number: newUserPhone.trim() || undefined,
          role: newUserRole
        },
        token
      );
      setActionSuccess(res.message || `Account for ${newUserEmail} created!`);
      setShowCreateUserModal(false);
      setNewUserEmail("");
      setNewUserPassword("");
      setNewUserFirstName("");
      setNewUserLastName("");
      setNewUserPhone("");
      setNewUserRole("staff");
      await loadData(token);
    } catch (err: any) {
      setCreateUserError(err.message || "Failed to provision user account.");
    } finally {
      setCreateUserSubmitting(false);
    }
  }

  async function handleToggleUserStatus(targetUserId: string, email: string) {
    const token = localStorage.getItem("bookitnow_token");
    if (!token) return;

    setActionLoading(targetUserId);
    setActionError("");
    try {
      const updated = await toggleUserStatus(targetUserId, token);
      setUsersList((prev) =>
        prev.map((u) => (u.id === targetUserId ? { ...u, is_active: updated.is_active } : u))
      );
      setActionSuccess(
        `User ${email} ${updated.is_active ? "reactivated" : "suspended"} successfully.`
      );
      setTimeout(() => setActionSuccess(""), 4000);
    } catch (err: any) {
      setActionError(err.message || "Failed to update user account status");
      setTimeout(() => setActionError(""), 6000);
    } finally {
      setActionLoading(null);
    }
  }

  async function handleStatusChange(propertyId: string, newStatus: string) {
    const token = localStorage.getItem("bookitnow_token");
    if (!token) return;

    setActionLoading(propertyId);
    setActionError("");
    try {
      await updatePropertyStatus(propertyId, newStatus, token);
      setProperties((prev) =>
        prev.map((p) => (p.id === propertyId ? { ...p, status: newStatus } : p))
      );
      setActionSuccess(`Property status successfully updated to ${newStatus}.`);
      setTimeout(() => setActionSuccess(""), 4000);
    } catch (err: any) {
      setActionError(err.message || "Failed to update property status");
      setTimeout(() => setActionError(""), 6000);
    } finally {
      setActionLoading(null);
    }
  }

  async function handleDeleteProperty(propertyId: string, title: string) {
    if (!confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) {
      return;
    }
    const token = localStorage.getItem("bookitnow_token");
    if (!token) return;

    setActionLoading(propertyId);
    setActionError("");
    try {
      await deleteProperty(propertyId, token);
      setProperties((prev) => prev.filter((p) => p.id !== propertyId));
      setActionSuccess(`Property "${title}" deleted successfully.`);
      setTimeout(() => setActionSuccess(""), 4000);
    } catch (err: any) {
      setActionError(err.message || "Failed to delete property.");
      setTimeout(() => setActionError(""), 6000);
    } finally {
      setActionLoading(null);
    }
  }

  async function handleCreatePropertySubmit(e: React.FormEvent) {
    e.preventDefault();
    setCreateError("");
    const token = localStorage.getItem("bookitnow_token");
    if (!token) {
      setCreateError("Authentication session expired. Please sign in again.");
      return;
    }

    if (!newPropTitle.trim()) {
      setCreateError("Please enter a property title.");
      return;
    }

    setCreateSubmitting(true);
    try {
      const slug = newPropTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

      const created = await createProperty(
        {
          title: newPropTitle.trim(),
          slug: slug || `stay-${Date.now()}`,
          description: newPropDesc.trim() || "A premier lodging stay in Zimbabwe.",
          property_type: newPropType,
          address_line: newPropAddress.trim() || "Main Street",
          city: newPropCity.trim() || "Harare",
          country: "Zimbabwe",
          amenities: ["WiFi", "Pool", "Air Conditioning", "Free Parking"],
          photos: ["/hero-bg.jpg"]
        },
        token
      );

      setActionSuccess(`Property "${created.title}" successfully added!`);
      setShowCreateModal(false);
      setNewPropTitle("");
      setNewPropDesc("");
      setNewPropCity("Harare");
      setNewPropAddress("");
      setCreateError("");
      await loadData(token);
    } catch (err: any) {
      setCreateError(err.message || "Failed to create property. Please try again.");
    } finally {
      setCreateSubmitting(false);
    }
  }

  function openAddRoomModal(property: any) {
    setTargetProperty(property);
    setRoomName("");
    setRoomDesc("");
    setRoomAdults(2);
    setRoomChildren(0);
    setRoomTotalCount(5);
    setRoomBasePrice(150);
    setRoomError("");
    setShowRoomModal(true);
  }

  async function handleAddRoomSubmit(e: React.FormEvent) {
    e.preventDefault();
    setRoomError("");
    const token = localStorage.getItem("bookitnow_token");
    if (!token || !targetProperty) {
      setRoomError("Authentication expired or no property chosen.");
      return;
    }

    if (!roomName.trim()) {
      setRoomError("Room name is required.");
      return;
    }

    setRoomSubmitting(true);
    try {
      await addRoomType(
        targetProperty.id,
        {
          name: roomName.trim(),
          description: roomDesc.trim() || "Spacious safari room with ensuite bath and views.",
          max_adults: roomAdults,
          max_children: roomChildren,
          total_rooms: roomTotalCount,
          base_price_per_night: roomBasePrice,
          currency: roomCurrency,
          amenities: ["Ensuite Bathroom", "Balcony", "Air Conditioning", "Safe"],
          photos: ["/hero-bg.jpg"]
        },
        token
      );

      setActionSuccess(`Room type "${roomName.trim()}" added to ${targetProperty.title}!`);
      setShowRoomModal(false);
      setRoomName("");
      setRoomDesc("");
      await loadData(token);
    } catch (err: any) {
      setRoomError(err.message || "Failed to create room type.");
    } finally {
      setRoomSubmitting(false);
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

  const filteredUsers = usersList.filter((u) => {
    const matchesRole = userRoleFilter === "all" || u.role === userRoleFilter;
    const matchesSearch =
      u.email.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
      `${u.first_name} ${u.last_name}`.toLowerCase().includes(userSearchQuery.toLowerCase());
    return matchesRole && matchesSearch;
  });

  if (loading) {
    return <SkeletonAdminDashboard />;
  }

  return (
    <div className="min-h-screen flex bg-[#F8FAFC] dark:bg-[#070B14] text-gray-900 dark:text-gray-100">
      {/* ============================================================ */}
      {/* PROFESSIONAL EXECUTIVE SIDEBAR (SIGNATURE BOOKITNOW BLUE)    */}
      {/* ============================================================ */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-30 w-64 bg-[#0F294A] border-r border-[#1E3E66] text-white flex flex-col justify-between transition-transform duration-200 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Workspace & Portal Header with real BookItNow Logo */}
          <div className="p-4 border-b border-[#1E3E66] bg-[#0A1F38] flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0 shadow-md ring-1 ring-white/30 bg-white/10">
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
                <span className="text-[10px] font-semibold text-blue-300 uppercase tracking-wider block">
                  Admin Console
                </span>
              </div>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1.5 text-blue-200 hover:text-white rounded-xs"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="p-3 space-y-1 flex-1 overflow-y-auto">
            <div className="px-3 pt-2 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-blue-300/80">
              Operations & Inventory
            </div>

            <button
              onClick={() => {
                setActiveTab("overview");
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xs text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "overview"
                  ? "bg-[#2563EB] text-white shadow-md ring-1 ring-white/20"
                  : "text-blue-100/80 hover:text-white hover:bg-white/10"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard Overview</span>
              </div>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                  activeTab === "overview" ? "bg-white/25 text-white" : "bg-[#1E3E66] text-blue-200"
                }`}
              >
                {totalProperties}
              </span>
            </button>

            <button
              onClick={() => {
                setActiveTab("properties");
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xs text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "properties"
                  ? "bg-[#2563EB] text-white shadow-md ring-1 ring-white/20"
                  : "text-blue-100/80 hover:text-white hover:bg-white/10"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Building2 className="w-4 h-4" />
                <span>Lodging Inventory</span>
              </div>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                  activeTab === "properties" ? "bg-white/25 text-white" : "bg-[#1E3E66] text-blue-200"
                }`}
              >
                {properties.length}
              </span>
            </button>

            <Link
              href="/host/inventory"
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xs text-xs font-semibold text-blue-100/80 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <Layers className="w-4 h-4 text-cyan-300" />
                <span>Live Rates & Quotas</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-blue-300" />
            </Link>

            <button
              onClick={() => {
                setActiveTab("bookings");
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xs text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "bookings"
                  ? "bg-[#2563EB] text-white shadow-md ring-1 ring-white/20"
                  : "text-blue-100/80 hover:text-white hover:bg-white/10"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <CalendarCheck className="w-4 h-4" />
                <span>Guest Bookings</span>
              </div>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                  activeTab === "bookings" ? "bg-white/25 text-white" : "bg-[#1E3E66] text-blue-200"
                }`}
              >
                {bookings.length}
              </span>
            </button>

            <div className="px-3 pt-5 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-blue-300/80">
              Access & Security
            </div>

            <button
              onClick={() => {
                setActiveTab("users");
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xs text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "users"
                  ? "bg-[#2563EB] text-white shadow-md ring-1 ring-white/20"
                  : "text-blue-100/80 hover:text-white hover:bg-white/10"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Users className="w-4 h-4" />
                <span>Staff & User Accounts</span>
              </div>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                  activeTab === "users" ? "bg-white/25 text-white" : "bg-[#1E3E66] text-blue-200"
                }`}
              >
                {usersList.length}
              </span>
            </button>

            <div className="px-3 pt-5 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-blue-300/80">
              Direct Actions
            </div>

            <button
              onClick={() => {
                setCreateError("");
                setShowCreateModal(true);
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-semibold text-emerald-300 hover:bg-emerald-900/30 rounded-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Lodging</span>
            </button>

            <button
              onClick={() => {
                setCreateUserError("");
                setShowCreateUserModal(true);
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-semibold text-cyan-300 hover:bg-cyan-900/30 rounded-xs transition-colors cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Provision Staff User</span>
            </button>
          </nav>

          {/* User Profile Pill & System Status */}
          <div className="p-4 border-t border-[#1E3E66] bg-[#0A1F38] space-y-2.5 pb-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-500 text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-xs ring-1 ring-white/30">
                {user?.first_name ? user.first_name[0].toUpperCase() : "A"}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold text-white truncate block">
                    {user?.first_name} {user?.last_name}
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" title="Online"></span>
                </div>
                <span className="text-[10px] text-blue-200/70 block truncate">{user?.email}</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-blue-200/70 pt-2 border-t border-[#1E3E66]">
              <span className="font-mono text-[10px] uppercase">
                Role: <span className="text-cyan-300 font-bold">{user?.role}</span>
              </span>
              <button
                onClick={() => {
                  localStorage.removeItem("bookitnow_token");
                  localStorage.removeItem("bookitnow_user");
                  router.push("/login");
                }}
                className="text-blue-300 hover:text-red-300 transition-colors flex items-center gap-1 cursor-pointer text-xs font-medium"
                title="Sign out"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Exit</span>
              </button>
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
      {/* MAIN OPERATIONS WORKSPACE                                    */}
      {/* ============================================================ */}
      <main className="flex-1 lg:pl-64 flex flex-col min-w-0">
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
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300">
                    {user?.role === "admin" ? "Super Admin" : "Inventory Portal"}
                  </span>
                  <span className="text-xs text-gray-500 hidden sm:inline">· Real-time Central Ledger</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                  {activeTab === "overview" && "Executive Operations Overview"}
                  {activeTab === "properties" && "Lodgings & Stay Catalog"}
                  {activeTab === "bookings" && "Live Guest Reservations & Vouchers"}
                  {activeTab === "users" && "User Accounts & Staff Permissions"}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => {
                  const token = localStorage.getItem("bookitnow_token");
                  if (token) loadData(token);
                }}
                className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xs transition-colors cursor-pointer border border-gray-200 dark:border-gray-700"
                title="Refresh live ledger"
              >
                <RefreshCw className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  setCreateUserError("");
                  setShowCreateUserModal(true);
                }}
                className="hidden sm:inline-flex px-3 py-2 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 text-xs font-semibold rounded-xs shadow-xs items-center gap-1.5 transition-all cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5 text-blue-500" />
                <span>+ User / Staff</span>
              </button>

              <button
                onClick={() => {
                  setCreateError("");
                  setShowCreateModal(true);
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-semibold rounded-xs shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>+ Add Lodging</span>
              </button>
            </div>
          </div>
        </header>

        {/* Workspace Body */}
        <div className="p-4 sm:p-8 space-y-6 max-w-7xl w-full mx-auto">
          {/* Feedback Alerts */}
          {actionSuccess && (
            <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 rounded-xs text-xs font-medium flex items-center justify-between gap-2 animate-in fade-in duration-150">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{actionSuccess}</span>
              </div>
              <button onClick={() => setActionSuccess("")} className="text-emerald-500 hover:text-emerald-700 p-0.5 cursor-pointer">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {actionError && (
            <div className="p-3.5 bg-red-500/10 border border-red-500/30 text-red-700 dark:text-red-300 rounded-xs text-xs font-medium flex items-center justify-between gap-2 animate-in fade-in duration-150">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
                <span>{actionError}</span>
              </div>
              <button onClick={() => setActionError("")} className="text-red-500 hover:text-red-700 p-0.5 cursor-pointer">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 bg-white dark:bg-[#0B101E] border border-gray-200 dark:border-gray-800 rounded-xs shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Properties</span>
                <Building2 className="w-4 h-4 text-blue-500" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold">{totalProperties}</span>
                <span className="text-[11px] text-emerald-600 font-semibold">({activeProperties} Active)</span>
              </div>
              <p className="text-[11px] text-gray-500">{pendingProperties} pending verification</p>
            </div>

            <div className="p-5 bg-white dark:bg-[#0B101E] border border-gray-200 dark:border-gray-800 rounded-xs shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Total Bookings</span>
                <CalendarCheck className="w-4 h-4 text-indigo-500" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold">{totalBookings}</span>
                <span className="text-[11px] text-blue-600 font-semibold">Real Ledger</span>
              </div>
              <p className="text-[11px] text-gray-500">Recorded across all properties</p>
            </div>

            <div className="p-5 bg-white dark:bg-[#0B101E] border border-gray-200 dark:border-gray-800 rounded-xs shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Gross Volume</span>
                <DollarSign className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold">${totalRevenue.toFixed(2)}</span>
                <span className="text-[11px] text-emerald-600 font-semibold">USD</span>
              </div>
              <p className="text-[11px] text-gray-500">Confirmed transaction value</p>
            </div>

            <div className="p-5 bg-white dark:bg-[#0B101E] border border-gray-200 dark:border-gray-800 rounded-xs shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Platform Health</span>
                <TrendingUp className="w-4 h-4 text-amber-500" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold">100%</span>
                <span className="text-[11px] text-emerald-600 font-semibold">Online</span>
              </div>
              <p className="text-[11px] text-gray-500">PostgreSQL 17 & Redis lock ready</p>
            </div>
          </div>

          {/* ======================================================== */}
          {/* TAB 1 & 2: OVERVIEW & PROPERTIES CATALOG                  */}
          {/* ======================================================== */}
          {(activeTab === "overview" || activeTab === "properties") && (
            <div className="space-y-4">
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
                    <option value="suspended">Suspended Only</option>
                  </select>
                </div>
              </div>

              {/* Lodging Listings Table */}
              <div className="overflow-x-auto border border-gray-200 dark:border-gray-800 rounded-xs bg-white dark:bg-[#0B101E]">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-800 text-[11px] uppercase tracking-wider text-gray-500 font-semibold">
                    <tr>
                      <th className="px-5 py-3">Property</th>
                      <th className="px-5 py-3">Location</th>
                      <th className="px-5 py-3">Type</th>
                      <th className="px-5 py-3">Rooms & Suites</th>
                      <th className="px-5 py-3">Status</th>
                      <th className="px-5 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800/60">
                    {filteredProperties.length > 0 &&
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
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-gray-900 dark:text-white">
                                {prop.room_types?.length || 0}
                              </span>
                              <span className="text-xs">rooms</span>
                              <button
                                onClick={() => openAddRoomModal(prop)}
                                className="px-2 py-0.5 text-[10px] font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-300 hover:bg-blue-600 hover:text-white rounded-xs border border-blue-200 dark:border-blue-800/60 transition-colors flex items-center gap-1 cursor-pointer"
                                title="Add Room Type"
                              >
                                <Plus className="w-2.5 h-2.5" />
                                <span>Add Room</span>
                              </button>
                            </div>
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
                              <button
                                onClick={() => openAddRoomModal(prop)}
                                className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-xs text-[11px] font-semibold transition-colors flex items-center gap-1 cursor-pointer shadow-2xs"
                                title="Configure room suites and pricing"
                              >
                                <BedDouble className="w-3 h-3" />
                                <span>+ Room</span>
                              </button>

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
                                Rates
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
                                      className="px-2 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-xs text-[10px] font-semibold transition-colors cursor-pointer"
                                    >
                                      Suspend
                                    </button>
                                  )}

                                  <button
                                    onClick={() => handleDeleteProperty(prop.id, prop.title)}
                                    disabled={actionLoading === prop.id}
                                    className="p-1 text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
                                    title="Delete Property"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>

                {filteredProperties.length === 0 && (
                  <div className="py-12 px-6 text-center space-y-4">
                    <div className="relative w-52 h-52 mx-auto">
                      <Image
                        src="/empty-state-working.png"
                        alt="No properties found illustration"
                        fill
                        priority
                        className="object-contain"
                      />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                        No Lodgings or Properties Found
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
                        There are no lodgings currently recorded matching your filters. Add a new listing to start managing inventory.
                      </p>
                    </div>
                    <button
                      onClick={() => setShowCreateModal(true)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xs transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Create Property</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 3: BOOKINGS & E-VOUCHERS                              */}
          {/* ======================================================== */}
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

          {/* ======================================================== */}
          {/* TAB 4: USERS & STAFF MANAGEMENT                           */}
          {/* ======================================================== */}
          {activeTab === "users" && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3 flex-1 max-w-lg">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search user by name or email..."
                      value={userSearchQuery}
                      onChange={(e) => setUserSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 text-xs rounded-xs border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0B101E] focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <select
                    value={userRoleFilter}
                    onChange={(e) => setUserRoleFilter(e.target.value)}
                    className="px-3 py-2 text-xs rounded-xs border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0B101E] focus:outline-none cursor-pointer"
                  >
                    <option value="all">All Roles</option>
                    <option value="staff">Staff / Managers</option>
                    <option value="host">Hosts / Owners</option>
                    <option value="admin">Administrators</option>
                    <option value="guest">Guests</option>
                  </select>
                </div>

                <button
                  onClick={() => {
                    setCreateUserError("");
                    setShowCreateUserModal(true);
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-semibold rounded-xs shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Create Staff / Manager Account</span>
                </button>
              </div>

              <div className="overflow-x-auto border border-gray-200 dark:border-gray-800 rounded-xs bg-white dark:bg-[#0B101E]">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-800 text-[11px] uppercase tracking-wider text-gray-500 font-semibold">
                    <tr>
                      <th className="px-5 py-3">User & Contact</th>
                      <th className="px-5 py-3">Role</th>
                      <th className="px-5 py-3">Status</th>
                      <th className="px-5 py-3">Verified</th>
                      <th className="px-5 py-3">Registered</th>
                      <th className="px-5 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800/60">
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-5 py-10 text-center text-gray-500">
                          No users found matching your search.
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((u) => (
                        <tr key={u.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-900/30 transition-colors">
                          <td className="px-5 py-4 font-medium">
                            <div className="space-y-0.5">
                              <span className="text-sm font-semibold text-gray-900 dark:text-white block">
                                {u.first_name} {u.last_name}
                              </span>
                              <span className="text-xs text-gray-500 block">{u.email}</span>
                              {u.phone_number && (
                                <span className="text-[10px] text-gray-400 font-mono block">
                                  {u.phone_number}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                                u.role === "admin"
                                  ? "bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300"
                                  : u.role === "staff"
                                  ? "bg-cyan-100 text-cyan-800 dark:bg-cyan-950/60 dark:text-cyan-300"
                                  : u.role === "host"
                                  ? "bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300"
                                  : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                              }`}
                            >
                              {u.role}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            {u.is_active ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                                <UserCheck className="w-3.5 h-3.5" />
                                Active
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-red-600 dark:text-red-400">
                                <UserX className="w-3.5 h-3.5" />
                                Suspended
                              </span>
                            )}
                          </td>
                          <td className="px-5 py-4 text-gray-500">
                            {u.is_verified ? (
                              <span className="text-emerald-600 font-medium">Yes</span>
                            ) : (
                              <span className="text-gray-400">No</span>
                            )}
                          </td>
                          <td className="px-5 py-4 text-gray-500 text-[11px]">
                            {new Date(u.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-5 py-4 text-right">
                            {user?.id !== u.id && (
                              <button
                                onClick={() => handleToggleUserStatus(u.id, u.email)}
                                disabled={actionLoading === u.id}
                                className={`px-2.5 py-1 rounded-xs text-[11px] font-semibold transition-colors cursor-pointer ${
                                  u.is_active
                                    ? "bg-red-50 text-red-600 hover:bg-red-600 hover:text-white border border-red-200 dark:border-red-900/60"
                                    : "bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white border border-emerald-200 dark:border-emerald-900/60"
                                }`}
                              >
                                {u.is_active ? "Deactivate" : "Activate"}
                              </button>
                            )}
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
      </main>

      {/* ============================================================ */}
      {/* MODALS                                                       */}
      {/* ============================================================ */}

      {/* Create Property Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg bg-white dark:bg-[#0B101E] border border-gray-200 dark:border-gray-800 rounded-xs shadow-2xl overflow-hidden space-y-5 p-6 sm:p-8">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Add New Lodging</h3>
                <p className="text-xs text-gray-500">Create a real property listing in the central database.</p>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-xs transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePropertySubmit} className="space-y-4">
              {createError && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-700 dark:text-red-300 rounded-xs text-xs font-medium flex items-center justify-between gap-2 animate-in fade-in duration-150">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
                    <span>{createError}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCreateError("")}
                    className="text-red-500 hover:text-red-700 p-0.5 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                  Property Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Victoria Falls Safari Lodge"
                  value={newPropTitle}
                  onChange={(e) => setNewPropTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xs border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                    Property Type *
                  </label>
                  <select
                    value={newPropType}
                    onChange={(e) => setNewPropType(e.target.value)}
                    className="w-full px-3 py-2.5 text-xs rounded-xs border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 focus:outline-none cursor-pointer"
                  >
                    <option value="lodge">Safari Lodge</option>
                    <option value="hotel">Hotel</option>
                    <option value="guesthouse">Guesthouse</option>
                    <option value="apartment">Serviced Apartment</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Victoria Falls, Harare, Bulawayo"
                    value={newPropCity}
                    onChange={(e) => setNewPropCity(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xs border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                  Physical Street Address *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Stand 471, Squire Cummings Road"
                  value={newPropAddress}
                  onChange={(e) => setNewPropAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xs border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe amenities, view, breakfast options, and guest hospitality..."
                  value={newPropDesc}
                  onChange={(e) => setNewPropDesc(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xs border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="pt-3 flex justify-end gap-3 border-t border-gray-100 dark:border-gray-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2.5 text-xs font-semibold rounded-xs border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createSubmitting}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-semibold rounded-xs transition-all shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{createSubmitting ? "Creating..." : "Save Property"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Room Type Modal */}
      {showRoomModal && targetProperty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg bg-white dark:bg-[#0B101E] border border-gray-200 dark:border-gray-800 rounded-xs shadow-2xl overflow-hidden space-y-5 p-6 sm:p-8">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300">
                    {targetProperty.title}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mt-1">Add Room Type / Suite</h3>
                <p className="text-xs text-gray-500">Configure guest room capacity, pricing, and available inventory.</p>
              </div>
              <button
                onClick={() => setShowRoomModal(false)}
                className="p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-xs transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddRoomSubmit} className="space-y-4">
              {roomError && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-700 dark:text-red-300 rounded-xs text-xs font-medium flex items-center justify-between gap-2 animate-in fade-in duration-150">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
                    <span>{roomError}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setRoomError("")}
                    className="text-red-500 hover:text-red-700 p-0.5 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                  Room / Suite Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Deluxe Safari Suite, Waterhole Facing Chalet, Executive King"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xs border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                    Base Price Per Night *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs text-gray-400 font-semibold">$</span>
                    <input
                      type="number"
                      min="1"
                      step="0.01"
                      required
                      value={roomBasePrice}
                      onChange={(e) => setRoomBasePrice(parseFloat(e.target.value) || 0)}
                      className="w-full pl-7 pr-3 py-2.5 text-xs rounded-xs border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 focus:outline-none focus:border-blue-500 font-semibold"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                    Total Room Units *
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={roomTotalCount}
                    onChange={(e) => setRoomTotalCount(parseInt(e.target.value) || 1)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xs border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                    Max Adults *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    required
                    value={roomAdults}
                    onChange={(e) => setRoomAdults(parseInt(e.target.value) || 1)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xs border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                    Max Children
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={roomChildren}
                    onChange={(e) => setRoomChildren(parseInt(e.target.value) || 0)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xs border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                  Description & Features
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. King-size canopy bed, private deck overlooking the Zambezi, rainfall shower..."
                  value={roomDesc}
                  onChange={(e) => setRoomDesc(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xs border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="pt-3 flex justify-end gap-3 border-t border-gray-100 dark:border-gray-800">
                <button
                  type="button"
                  onClick={() => setShowRoomModal(false)}
                  className="px-4 py-2.5 text-xs font-semibold rounded-xs border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={roomSubmitting}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-semibold rounded-xs transition-all shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <BedDouble className="w-3.5 h-3.5" />
                  <span>{roomSubmitting ? "Adding Room..." : "Save Room Type"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Staff / Manager Account Modal */}
      {showCreateUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg bg-white dark:bg-[#0B101E] border border-gray-200 dark:border-gray-800 rounded-xs shadow-2xl overflow-hidden space-y-5 p-6 sm:p-8">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Create Staff / Manager Account</h3>
                <p className="text-xs text-gray-500">Provision credentials for inventory managers, front desk staff, or hosts.</p>
              </div>
              <button
                onClick={() => setShowCreateUserModal(false)}
                className="p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-xs transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUserSubmit} className="space-y-4">
              {createUserError && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-700 dark:text-red-300 rounded-xs text-xs font-medium flex items-center justify-between gap-2 animate-in fade-in duration-150">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
                    <span>{createUserError}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCreateUserError("")}
                    className="text-red-500 hover:text-red-700 p-0.5 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                    First Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tendai"
                    value={newUserFirstName}
                    onChange={(e) => setNewUserFirstName(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xs border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Moyo"
                    value={newUserLastName}
                    onChange={(e) => setNewUserLastName(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xs border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="manager@vicfalls-lodges.co.zw"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xs border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                    Temporary Password *
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Min 6 characters"
                    value={newUserPassword}
                    onChange={(e) => setNewUserPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xs border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                    Assigned Role *
                  </label>
                  <select
                    value={newUserRole}
                    onChange={(e) => setNewUserRole(e.target.value)}
                    className="w-full px-3 py-2.5 text-xs rounded-xs border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 focus:outline-none cursor-pointer"
                  >
                    <option value="staff">Staff / Inventory Manager</option>
                    <option value="host">Host / Lodging Owner</option>
                    <option value="admin">System Administrator</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                  Contact Phone Number (Optional)
                </label>
                <input
                  type="text"
                  placeholder="+263 77 123 4567"
                  value={newUserPhone}
                  onChange={(e) => setNewUserPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xs border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="pt-3 flex justify-end gap-3 border-t border-gray-100 dark:border-gray-800">
                <button
                  type="button"
                  onClick={() => setShowCreateUserModal(false)}
                  className="px-4 py-2.5 text-xs font-semibold rounded-xs border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createUserSubmitting}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-semibold rounded-xs transition-all shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>{createUserSubmitting ? "Provisioning..." : "Create Account"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
