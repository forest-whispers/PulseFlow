import { Link, useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { Button } from "@/components/ui/button"
import { Shield, Users, Calendar, ArrowRight } from "lucide-react"

export default function HeroSection() {
  const navigate = useNavigate()
  const { isAuthenticated, user } = useSelector((state) => state.auth)

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
    <section className="relative overflow-hidden py-16 lg:py-24 bg-linear-to-b from-card to-background">
      {/* Background decorations */}
      <div className="absolute top-1/4 left-10 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute bottom-10 right-10 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column - Content */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold w-fit">
              <Shield className="h-3.5 w-3.5" /> Modern Digital Healthcare
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-foreground">
              Your Health, <br />
              <span className="text-primary bg-linear-to-r from-primary to-blue-500 bg-clip-text text-transparent">
                Managed Digitally
              </span>{" "}
              and Securely.
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
              Find trusted doctors, book instant appointments, and securely manage your medical records online. The all-in-one healthcare platform designed for you.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 pt-2">
              {isAuthenticated ? (
                <Button onClick={handleDashboardRedirect} size="lg" className="gap-2">
                  Continue to Dashboard <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <>
                  <Link to="/register">
                    <Button size="lg" className="gap-2">
                      Get Started Free <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link to="/patient/doctors">
                    <Button variant="outline" size="lg">
                      Browse Doctors
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-muted max-w-md">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1.5 text-foreground font-semibold text-sm">
                  <Users className="h-4 w-4 text-primary" /> Verified Doctors
                </div>
                <span className="text-xs text-muted-foreground">Certified professionals</span>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1.5 text-foreground font-semibold text-sm">
                  <Shield className="h-4 w-4 text-primary" /> Secure Records
                </div>
                <span className="text-xs text-muted-foreground">Encrypted database</span>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1.5 text-foreground font-semibold text-sm">
                  <Calendar className="h-4 w-4 text-primary" /> Easy Booking
                </div>
                <span className="text-xs text-muted-foreground">Instant confirmations</span>
              </div>
            </div>
          </div>

          {/* Right Column - Premium SVG Illustration */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative w-full max-w-[450px] aspect-square rounded-2xl bg-card border shadow-xl p-4 flex items-center justify-center overflow-hidden group hover:shadow-2xl transition-all duration-300">
              
              {/* Dynamic SVG composition representing modern healthcare SaaS */}
              <svg
                viewBox="0 0 500 500"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full text-primary drop-shadow-md"
              >
                {/* Background Grid Accent */}
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeOpacity="0.03" strokeWidth="1" />
                  </pattern>
                  <linearGradient id="gradient-card" x1="0" y1="0" x2="500" y2="500" gradientUnits="userSpaceOnUse">
                    <stop stopColor="currentColor" stopOpacity="0.08" />
                    <stop offset="1" stopColor="currentColor" stopOpacity="0.01" />
                  </linearGradient>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />

                {/* Soft glow circle in the center */}
                <circle cx="250" cy="250" r="140" fill="currentColor" fillOpacity="0.03" className="animate-pulse" />
                <circle cx="250" cy="250" r="90" fill="currentColor" fillOpacity="0.05" />

                {/* Simulated Dashboard Frame */}
                <rect x="70" y="80" width="360" height="280" rx="16" fill="var(--background)" stroke="currentColor" strokeOpacity="0.12" strokeWidth="2" />
                <line x1="70" y1="130" x2="430" y2="130" stroke="currentColor" strokeOpacity="0.12" strokeWidth="2" />
                
                {/* Dashboard Header Circles */}
                <circle cx="100" cy="105" r="6" fill="#ef4444" />
                <circle cx="120" cy="105" r="6" fill="#f59e0b" />
                <circle cx="140" cy="105" r="6" fill="#10b981" />

                {/* Left Sidebar Mockup */}
                <rect x="90" y="150" width="80" height="15" rx="4" fill="currentColor" fillOpacity="0.15" />
                <rect x="90" y="180" width="80" height="15" rx="4" fill="currentColor" fillOpacity="0.08" />
                <rect x="90" y="210" width="80" height="15" rx="4" fill="currentColor" fillOpacity="0.08" />
                <rect x="90" y="240" width="80" height="15" rx="4" fill="currentColor" fillOpacity="0.08" />

                {/* Right Profile / Details Card Mockup (Float In effect) */}
                <g className="transform translate-x-2 translate-y-[-2] hover:translate-y-[-6] hover:translate-x-4 transition-all duration-500 cursor-pointer">
                  <rect x="195" y="150" width="215" height="190" rx="12" fill="var(--card)" stroke="currentColor" strokeOpacity="0.15" strokeWidth="2" className="shadow-md" />
                  
                  {/* Doctor Avatar Placeholder */}
                  <circle cx="240" cy="195" r="24" fill="currentColor" fillOpacity="0.1" />
                  {/* Cross symbol representing health */}
                  <path d="M 234 195 L 246 195 M 240 189 L 240 201" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />

                  {/* Name and specialization info lines */}
                  <rect x="280" y="180" width="100" height="12" rx="3" fill="currentColor" fillOpacity="0.25" />
                  <rect x="280" y="200" width="70" height="8" rx="2" fill="currentColor" fillOpacity="0.12" />

                  {/* Scheduling Mockup (Small calendar grids) */}
                  <rect x="215" y="245" width="40" height="30" rx="6" fill="currentColor" fillOpacity="0.06" />
                  <rect x="215" y="285" width="40" height="30" rx="6" fill="currentColor" fillOpacity="0.06" />
                  <rect x="265" y="245" width="40" height="30" rx="6" fill="currentColor" fillOpacity="0.06" />
                  <rect x="265" y="285" width="40" height="30" rx="6" fill="currentColor" fillOpacity="0.06" />
                  <rect x="315" y="245" width="40" height="30" rx="6" fill="currentColor" fillOpacity="0.06" />
                  <rect x="315" y="285" width="40" height="30" rx="6" fill="currentColor" fillOpacity="0.06" />
                  
                  {/* Selected Slot Highlight */}
                  <rect x="265" y="245" width="40" height="30" rx="6" fill="currentColor" stroke="currentColor" strokeWidth="1.5" />
                  <circle cx="285" cy="260" r="4" fill="currentColor" />
                </g>

                {/* Notification Bubble Mockup (Floats in top right) */}
                <g className="transform hover:scale-105 transition-transform duration-300">
                  <rect x="340" y="40" width="110" height="45" rx="10" fill="var(--card)" stroke="currentColor" strokeOpacity="0.2" strokeWidth="2" />
                  <circle cx="365" cy="62" r="12" fill="#10b981" fillOpacity="0.2" />
                  <path d="M 361 62 L 364 65 L 369 59" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <rect x="385" y="55" width="50" height="6" rx="2" fill="currentColor" fillOpacity="0.2" />
                  <rect x="385" y="65" width="30" height="4" rx="1" fill="currentColor" fillOpacity="0.1" />
                </g>
              </svg>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
