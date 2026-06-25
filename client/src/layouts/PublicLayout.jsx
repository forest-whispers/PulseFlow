import { Outlet, Link } from "react-router-dom"
import { useTheme } from "../providers/ThemeProvider"
import { Button } from "@/components/ui/button"
import { Sun, Moon, Activity } from "lucide-react"

export default function PublicLayout() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-200">
      {/* Header */}
      <header className="border-b bg-card py-4 px-6 flex items-center justify-between shadow-sm">
        <Link to="/" className="flex items-center gap-2 hover:opacity-90">
          <Activity className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg tracking-tight">HMS Portal</span>
        </Link>
        <div className="flex items-center gap-4">
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
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t bg-card py-4 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Hospital Management System. All rights reserved.
      </footer>
    </div>
  )
}
