import { Search, Calendar, CheckCircle2, Home, ArrowDown } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const STEPS = [
  {
    icon: Search,
    title: "Find a Doctor",
    description: "Browse certified health professionals by specialty, clinical experience, reviews, or consultation fees.",
  },
  {
    icon: Calendar,
    title: "Select Date & Time",
    description: "Pick an available slot that works for your schedule from the doctor's live calendar interface.",
  },
  {
    icon: CheckCircle2,
    title: "Confirm Appointment",
    description: "Confirm details securely. Receive instantly generated dashboard summaries and system notifications.",
  },
  {
    icon: Home,
    title: "Visit the Clinic",
    description: "Attend your consultation. Your prescriptions and records will automatically update in your portal afterward.",
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 bg-muted/20 border-t border-b border-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Text */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-20">
          <Badge className="bg-primary/15 text-primary border-transparent font-bold tracking-wider uppercase text-[10px] rounded-full px-3 py-1">
            Frictionless Care
          </Badge>
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground">
            How the Platform Works
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            A frictionless, simple appointment workflow designed to get you the care you need in minutes.
          </p>
        </div>

        {/* Vertical Timeline container (No left border line) */}
        <div className="relative max-w-5xl mx-auto">
          {STEPS.map((step, index) => {
            const Icon = step.icon
            const isEven = index % 2 === 0
            
            return (
              <div key={index} className="relative mb-16 last:mb-0 group">
                {/* Timeline Circle Marker */}
                <div className="absolute top-1.5 -left-[25px] md:left-1/2 md:-translate-x-1/2 h-12 w-12 rounded-full border border-border/60 bg-card text-primary flex items-center justify-center shadow-xs z-10 transition-all duration-300 group-hover:scale-110 group-hover:border-primary/45 group-hover:bg-primary/5">
                  <Icon className="h-5 w-5" />
                </div>

                {/* Downward connecting arrow (replaces the solid line) */}
                {index < STEPS.length - 1 && (
                  <div className="absolute top-14 -left-[25px] md:left-1/2 md:-translate-x-1/2 w-12 h-10 flex items-center justify-center text-primary/30 z-0">
                    <ArrowDown className="h-4.5 w-4.5 animate-bounce" />
                  </div>
                )}

                {/* Content Box (alternating on desktop) */}
                <div
                  className={`w-full md:w-[45%] md:relative pl-8 md:pl-0 ${
                    isEven ? "md:mr-auto md:text-right md:-left-[5%] md:pr-8" : "md:ml-auto md:text-left md:left-[5%] md:pl-8"
                  }`}
                >
                  <div className="p-6 rounded-2xl border border-border/40 bg-card shadow-2xs hover:shadow-xs hover:-translate-y-0.5 hover:border-primary/15 transition-all duration-300">
                    {/* Step Badge */}
                    <Badge className="mb-3 bg-primary/10 hover:bg-primary/10 text-primary border-transparent font-extrabold rounded-full px-2 py-0.5 text-[8.5px] uppercase tracking-wider select-none">
                      Step {index + 1}
                    </Badge>
                    
                    <h3 className="font-bold text-base text-foreground mb-2 group-hover:text-primary transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
