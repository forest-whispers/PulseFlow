import { useState } from "react"
import { Outlet } from "react-router-dom"
import { useTheme } from "../providers/ThemeProvider"
import { Button } from "@/components/ui/button"
import { Sun, Moon, Menu, X, Activity } from "lucide-react"

export default function AuthenticatedLayout() {
  const { theme, setTheme } = useTheme()
  const [sidebarOpen, setSidebarOpen] = useState(false)

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

          <div className="text-xs text-muted-foreground border-t pt-4">
            Authenticated Shell v1.0
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
