import { Search, Calendar, FileText, Pill, BarChart, Bell } from "lucide-react"

const HIGHLIGHTS = [
  {
    icon: Search,
    title: "Find Doctors",
    description: "Search specialized doctors by name, gender, department, availability, or clinic location with transparent profiles.",
  },
  {
    icon: Calendar,
    title: "Book Appointments",
    description: "Secure your consultation slot instantly. Get real-time reminders, slots selection, and seamless rescheduling features.",
  },
  {
    icon: FileText,
    title: "Medical Records",
    description: "Access your clinical history, diagnoses, and doctor visit documents in one secure place, accessible anywhere.",
  },
  {
    icon: Pill,
    title: "Digital Prescriptions",
    description: "View prescription histories and details written by your doctors. Easily share with local pharmacies.",
  },
  {
    icon: BarChart,
    title: "Lab Results",
    description: "Receive diagnostic test reports and lab updates directly inside your profile as soon as they are processed.",
  },
  {
    icon: Bell,
    title: "Smart Notifications",
    description: "Stay updated with system warnings, upcoming appointment reminders, fee updates, and status messages.",
  },
]

export default function PlatformHighlights() {
  return (
    <section id="features" className="py-16 bg-background border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Text */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Everything You Need to Manage Your Health
          </h2>
          <p className="text-lg text-muted-foreground">
            A comprehensive, patient-centered digital health infrastructure connecting doctors, profiles, and appointments seamlessly.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {HIGHLIGHTS.map((item, index) => {
            const Icon = item.icon
            return (
              <div
                key={index}
                className="group p-6 rounded-xl border bg-card shadow-xs hover:shadow-md hover:border-primary/20 transition-all duration-300 flex flex-col gap-4"
              >
                <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}