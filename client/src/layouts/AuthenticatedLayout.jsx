import { useState } from "react"
import { Outlet, useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { useMutation } from "@tanstack/react-query"
import { useTheme } from "../providers/ThemeProvider"
import { Button } from "@/components/ui/button"
import { Sun, Moon, Menu, X, Activity, LogOut, Loader2 } from "lucide-react"
import { authApi } from "../features/auth/api/authApi"
import { clearAuth } from "../store/authSlice"
import { toast } from "sonner"
import NotificationBell from "../features/notifications/components/NotificationBell"

export default function AuthenticatedLayout() {
  const { theme, setTheme } = useTheme()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      dispatch(clearAuth())
      toast.success("Successfully logged out")
      navigate("/login", { replace: true })
    },
    onError: (error) => {
      // Clear local state anyway to prevent locking the user out
      dispatch(clearAuth())
      const errMsg = error.response?.data?.message || "Session cleared locally"
      toast.error(`Signed out: ${errMsg}`)
      navigate("/login", { replace: true })
    },
  })

  return (
    <div className="min-h-screen flex bg-background text-foreground transition-colors duration-200">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Shell */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 border-r bg-card flex flex-col transform transition-transform duration-300 md:translate-x-0 md:static ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-16 px-6 border-b flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg tracking-tight">HMS Portal</span>
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

        {/* Generic Navigation Placeholder */}
        <div className="flex-1 p-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Navigation Placeholder
            </div>
            <div className="text-sm text-muted-foreground italic border border-dashed rounded p-3">
              Sidebar items will be placed here (patient, doctor, or admin specific).
            </div>
          </div>

          <div className="space-y-4 border-t pt-4">
            <Button
              variant="outline"
              className="w-full justify-start text-destructive hover:bg-destructive/10 hover:text-destructive transition-colors"
              onClick={() => logoutMutation.mutate()}
              disabled={logoutMutation.isPending}
            >
              {logoutMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <LogOut className="mr-2 h-4 w-4" />
              )}
              Logout
            </Button>
            <div className="text-xs text-muted-foreground">
              Authenticated Shell v1.0
            </div>
          </div>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 border-b bg-card px-6 flex items-center justify-between shadow-sm">
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
            <div className="font-medium text-sm text-muted-foreground hidden sm:block">
              Hospital Management System Shell
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              title="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5 text-yellow-500" />
              ) : (
                <Moon className="h-5 w-5 text-primary" />
              )}
            </Button>

            {/* Notification Bell Dropdown */}
            <NotificationBell />

            {/* Profile Placeholder (Generic) */}
            <div className="h-8 w-8 rounded-full bg-primary/10 border flex items-center justify-center text-xs font-medium text-primary">
              U
            </div>
          </div>
        </header>

        {/* Content Viewport */}
        <main className="flex-1 overflow-auto p-6 md:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
