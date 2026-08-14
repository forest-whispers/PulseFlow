import { useState, useEffect } from "react"
import { Outlet, useNavigate, Link, useLocation } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useTheme } from "../providers/ThemeProvider"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  Calendar,
  FileText,
  Pill,
  Beaker,
  Receipt,
  Bell,
  User,
  Settings,
  Clock,
  LogOut,
  Loader2,
  Menu,
  X,
  TrendingUp,
  Users,
  History,
  SettingsIcon
} from "lucide-react"
import { authApi } from "../features/auth/api/authApi"
import { clearAuth } from "../store/authSlice"
import { toast } from "sonner"
import NotificationBell from "../features/notifications/components/NotificationBell"
import Logo from "@/components/ui/Logo"

// Centralized navigation configurations by Role
const NAV_CONFIG = {
  patient: {
    main: [
      { label: "Dashboard", path: "/patient/dashboard", icon: LayoutDashboard },
      { label: "Appointments", path: "/patient/appointments", icon: Calendar },
      { label: "Medical Records", path: "/patient/medical-records", icon: FileText },
      { label: "Prescriptions", path: "/patient/prescriptions", icon: Pill },
      { label: "Lab Results", path: "/patient/lab-results", icon: Beaker },
      { label: "Invoices", path: "/patient/invoices", icon: Receipt },
      { label: "Notifications", path: "/patient/notifications", icon: Bell },
    ],
    bottom: [
      { label: "Profile", path: "/patient/profile", icon: User },
      { label: "Settings", path: "/patient/settings", icon: Settings },
    ],
  },
  doctor: {
    main: [
      { label: "Dashboard", path: "/doctor/dashboard", icon: LayoutDashboard },
      { label: "Appointments", path: "/doctor/appointments", icon: Calendar },
      { label: "Notifications", path: "/doctor/notifications", icon: Bell },
    ],
    bottom: [
      { label: "Profile", path: "/doctor/profile", icon: User },
      { label: "Availability", path: "/doctor/availability", icon: Clock },
      { label: "Settings", path: "/doctor/settings", icon: Settings },
    ],
  },
  admin: {
    main: [
      { label: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
      { label: "Appointments", path: "/admin/appointments", icon: Calendar },
      { label: "Analytics", path: "/admin/analytics", icon: TrendingUp },
      { label: "Invoices", path: "/admin/invoices", icon: Receipt },
      { label: "Users", path: "/admin/users", icon: Users },
      { label: "Audit Logs", path: "/admin/audit-logs", icon: History },
    ],
    bottom: [
      { label: "Settings", path: "/admin/settings", icon: Settings },
    ],
  },
}

export default function AuthenticatedLayout() {
  const { theme, setTheme } = useTheme()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const [dropdownOpen, setDropdownOpen] = useState(false)

  // Close dropdown on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setDropdownOpen(false)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest("#user-profile-menu")) {
        setDropdownOpen(false)
      }
    }
    if (dropdownOpen) {
      window.addEventListener("click", handleClickOutside)
    }
    return () => window.removeEventListener("click", handleClickOutside)
  }, [dropdownOpen])

  // Close dropdown on navigation
  useEffect(() => {
    setDropdownOpen(false)
  }, [location.pathname])

  const { user } = useSelector((state) => state.auth)
  const currentRole = user?.role || "patient"
  const userName = user?.name || "User"
  const userInitials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "U"

  const config = NAV_CONFIG[currentRole] || NAV_CONFIG.patient
  const queryClient = useQueryClient()

  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      queryClient.clear() // Invalidate and clear all query caches!
      dispatch(clearAuth())
      toast.success("Successfully logged out")
      navigate("/login", { replace: true })
    },
    onError: (error) => {
      // Clear local state and cache anyway to prevent locking the user out
      queryClient.clear()
      dispatch(clearAuth())
      const errMsg = error.response?.data?.message || "Session cleared locally"
      toast.error(`Signed out: ${errMsg}`)
      navigate("/login", { replace: true })
    },
  })

  // Dynamic active navigation class checking
  const linkClass = (itemPath) => {
    const isActive =
      location.pathname === itemPath ||
      (itemPath !== "/" && location.pathname.startsWith(itemPath + "/"))
    return `flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 ${
      isActive
        ? "bg-primary text-primary-foreground shadow-sm scale-[1.02]"
        : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
    }`
  }

  return (
    <div className="h-screen w-screen flex overflow-hidden bg-background text-foreground transition-colors duration-200">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Shell */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 h-full border-r bg-card flex flex-col transform transition-transform duration-300 md:translate-x-0 md:relative shrink-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-16 px-6 border-b flex items-center justify-between shrink-0">
          <div className="flex items-center">
            <Logo className="h-9 w-auto" />
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Sidebar Nav content - non-scrolling except navigation lists */}
        <div className="flex-1 flex flex-col justify-between overflow-hidden">
          {/* Main Navigation (scrolls if list exceeds height) */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-1.5 scrollbar-thin">
            {config.main.map((item, idx) => {
              const ItemIcon = item.icon
              return (
                <Link
                  key={idx}
                  to={item.path}
                  className={linkClass(item.path)}
                  onClick={() => setSidebarOpen(false)}
                >
                  <ItemIcon className="h-4.5 w-4.5 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>

          {/* Bottom fixed actions (Settings, Logout, etc. - locked at bottom) */}
          <div className="p-4 border-t border-border/10 bg-muted/5 space-y-2 shrink-0">
            {config.bottom.map((item, idx) => {
              const ItemIcon = item.icon
              return (
                <Link
                  key={idx}
                  to={item.path}
                  className={linkClass(item.path)}
                  onClick={() => setSidebarOpen(false)}
                >
                  <ItemIcon className="h-4.5 w-4.5 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              )
            })}

            <Button
              variant="outline"
              className="w-full justify-start text-xs font-bold text-destructive hover:bg-destructive/10 hover:text-destructive border-border/15 rounded-xl transition-all duration-300 cursor-pointer h-9"
              onClick={() => logoutMutation.mutate()}
              disabled={logoutMutation.isPending}
            >
              {logoutMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin shrink-0" />
              ) : (
                <LogOut className="mr-2 h-4 w-4 shrink-0" />
              )}
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Container (non-scrolling viewport wrapper) */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Header (shrink-0 stays fixed) */}
        <header className="h-16 border-b bg-card px-6 flex items-center justify-between shadow-sm shrink-0">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              title="Toggle sidebar"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="font-bold text-sm text-foreground">
              {currentRole === "admin"
                ? "Hospital Administration"
                : currentRole === "doctor"
                ? "HMS Consultant Portal"
                : "HMS Patient Portal"}
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Notification Bell Dropdown */}
            <NotificationBell />

            {/* User Profile Avatar Dropdown */}
            <div id="user-profile-menu" className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="h-8 w-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-xs font-extrabold text-primary shadow-2xs select-none hover:bg-primary/25 hover:border-primary/30 transition-all duration-300 cursor-pointer"
                title={userName}
              >
                {userInitials}
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2.5 w-52 bg-card border rounded-2xl shadow-lg py-2 z-50 animate-fade-in">
                  {/* Dropdown Header */}
                  <div className="px-4 py-2 flex items-center gap-3 border-b pb-2.5 mb-1.5">
                    <div className="h-8 w-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-xs font-black text-primary select-none">
                      {userInitials}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-black text-foreground truncate">
                        {currentRole === "admin" ? "Administrator" : userName}
                      </h4>
                      <span className="text-[9px] font-bold text-muted-foreground uppercase mt-0.5 block tracking-wider">
                        {currentRole}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="px-1.5 space-y-1">
                    <Link
                      to={`/${currentRole}/settings`}
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-200"
                    >
                      <SettingsIcon className="h-4 w-4 shrink-0" />
                      <span>Settings</span>
                    </Link>
                    <button
                      onClick={() => {
                        setDropdownOpen(false)
                        logoutMutation.mutate()
                      }}
                      disabled={logoutMutation.isPending}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-destructive hover:bg-destructive/10 transition-all duration-200 cursor-pointer text-left"
                    >
                      {logoutMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin shrink-0" />
                      ) : (
                        <LogOut className="h-4 w-4 shrink-0" />
                      )}
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content Viewport - ONLY THIS SCROLLS */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 bg-background">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}