import { useState } from "react"
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { useTheme } from "../providers/ThemeProvider"
import { Button } from "@/components/ui/button"
import { Sun, Moon, Menu, X } from "lucide-react"
import Logo from "@/components/ui/Logo"

export default function PublicLayout() {
  const { theme, setTheme } = useTheme()
  const { isAuthenticated, user } = useSelector((state) => state.auth)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const isLandingPage = location.pathname === "/"

  const handleDashboardRedirect = () => {
    const role = user?.role
    if (role === "patient") {
      navigate("/patient/dashboard")
    } else if (role === "doctor") {
      navigate("/doctor/dashboard")
    } else if (role === "admin") {
      navigate("/admin/dashboard")
    } else {
      navigate("/login")
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-200">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-card/90 backdrop-blur-md py-3 px-4 md:px-6 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center hover:opacity-90 transition-opacity">
            <Logo className="h-9 w-auto" />
          </Link>

          {/* Desktop Navigation Links - Only displayed on Landing Page */}
          {isLandingPage && (
            <nav className="hidden md:flex items-center gap-5 text-sm font-medium text-muted-foreground">
              <a href="#features" className="hover:text-primary transition-colors">
                Features
              </a>
              <a href="#how-it-works" className="hover:text-primary transition-colors">
                How It Works
              </a>
              <a href="#testimonials" className="hover:text-primary transition-colors">
                Testimonials
              </a>
            </nav>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Desktop Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            {isAuthenticated ? (
              <Button onClick={handleDashboardRedirect} size="sm">
                Continue to Dashboard
              </Button>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">Register</Button>
                </Link>
              </>
            )}
          </div>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            title="Toggle theme"
            className="h-9 w-9"
          >
            {theme === "dark" ? (
              <Sun className="h-4.5 w-4.5 text-yellow-500" />
            ) : (
              <Moon className="h-4.5 w-4.5 text-primary" />
            )}
          </Button>

          {/* Mobile Menu Toggle Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden h-9 w-9"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            title="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-16 bg-card border-b shadow-md z-40 p-4 transition-all animate-in slide-in-from-top duration-200">
          <nav className="flex flex-col gap-4 text-sm font-medium">
            {isLandingPage && (
              <>
                <a
                  href="#features"
                  className="px-2 py-1.5 hover:bg-accent rounded-md transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Features
                </a>
                <a
                  href="#how-it-works"
                  className="px-2 py-1.5 hover:bg-accent rounded-md transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  How It Works
                </a>
                <a
                  href="#testimonials"
                  className="px-2 py-1.5 hover:bg-accent rounded-md transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Testimonials
                </a>
              </>
            )}
            <div className="border-t pt-3 flex flex-col gap-2">
              {isAuthenticated ? (
                <Button
                  className="w-full"
                  onClick={() => {
                    setMobileMenuOpen(false)
                    handleDashboardRedirect()
                  }}
                >
                  Continue to Dashboard
                </Button>
              ) : (
                <>
                  <Link to="/login" className="w-full" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full">
                      Login
                    </Button>
                  </Link>
                  <Link to="/register" className="w-full" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full">Register</Button>
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}