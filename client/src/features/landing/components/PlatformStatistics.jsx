import { CheckCircle2, UserCheck, Stethoscope, HeartHandshake } from "lucide-react"

// Decoupled stats config to easily plug into backend API data in the future
const STATS = [
  {
    icon: UserCheck,
    value: "500+",
    label: "Verified Doctors",
    description: "Across multiple departments",
  },
  {
    icon: CheckCircle2,
    value: "10,000+",
    label: "Appointments Completed",
    description: "Successful consults conducted",
  },
  {
    icon: Stethoscope,
    value: "25+",
    label: "Medical Specialties",
    description: "Expert fields supported",
  },
  {
    icon: HeartHandshake,
    value: "99.4%",
    label: "Patient Satisfaction",
    description: "Highly rated experiences",
  },
]

export default function PlatformStatistics() {
  return (
    <section className="py-16 bg-primary text-primary-foreground relative overflow-hidden">
      {/* Decorative background shape */}
      <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-white/5 -mr-10 -mt-10" />
      <div className="absolute bottom-0 left-0 h-40 w-40 rounded-full bg-white/5 -ml-10 -mb-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Text */}
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-12">
          <h2 className="text-2xl font-bold uppercase tracking-widest text-primary-foreground/80">
            Platform Status
          </h2>
          <p className="text-3xl font-extrabold sm:text-4xl">
            Trusted by Patients and Doctors Nationwide
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {STATS.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div
                key={index}
                className="flex flex-col items-center text-center p-6 bg-white/10 rounded-xl backdrop-blur-xs border border-white/10 transition-transform duration-300 hover:scale-105"
              >
                <div className="h-12 w-12 rounded-full bg-white/15 flex items-center justify-center mb-4">
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2">
                  {stat.value}
                </div>
                <div className="font-bold text-sm mb-1">{stat.label}</div>
                <div className="text-xs text-white/75">{stat.description}</div>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}