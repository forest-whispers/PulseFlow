import { Search, Calendar, CheckCircle2, Home } from "lucide-react"

const STEPS = [
  {
    icon: Search,
    title: "1. Find a Doctor",
    description: "Browse certified health professionals by specialty, clinical experience, reviews, or consultation fees.",
  },
  {
    icon: Calendar,
    title: "2. Select Date & Time",
    description: "Pick an available slot that works for your schedule from the doctor's live calendar interface.",
  },
  {
    icon: CheckCircle2,
    title: "3. Confirm Appointment",
    description: "Confirm details securely. Receive instantly generated dashboard summaries and system notifications.",
  },
  {
    icon: Home,
    title: "4. Visit the Clinic",
    description: "Attend your consultation. Your prescriptions and records will automatically update in your portal afterward.",
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-16 bg-muted/30 border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Text */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            How the Platform Works
          </h2>
          <p className="text-lg text-muted-foreground">
            A frictionless, simple appointment workflow designed to get you the care you need in minutes.
          </p>
        </div>

        {/* Timeline Container */}
        <div className="relative border-l border-primary/20 ml-4 md:ml-0 md:left-1/2 md:-translate-x-1/2 max-w-5xl">
          {STEPS.map((step, index) => {
            const Icon = step.icon
            const isEven = index % 2 === 0
            
            return (
              <div key={index} className="relative mb-12 last:mb-0">
                {/* Timeline Circle Marker */}
                <div className="absolute top-1.5 -left-[25px] md:left-1/2 md:-translate-x-1/2 h-12 w-12 rounded-full border bg-card text-primary flex items-center justify-center shadow-sm z-10 transition-transform duration-300 hover:scale-110">
                  <Icon className="h-5 w-5" />
                </div>

                {/* Content Box */}
                <div
                  className={`w-full md:w-[45%] md:relative pl-8 md:pl-0 ${
                    isEven ? "md:mr-auto md:text-right md:-left-[5%] md:pr-8" : "md:ml-auto md:text-left md:left-[5%] md:pl-8"
                  }`}
                >
                  <div className="p-6 rounded-xl border bg-card shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                    <h3 className="font-bold text-lg text-foreground mb-2">
                      {step.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
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
