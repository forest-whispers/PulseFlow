import { Link } from "react-router-dom"
import { ArrowLeft, CalendarClock } from "lucide-react"

export default function AvailabilityHeader() {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b pb-6 mb-8">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Link
            to="/doctor/dashboard"
            className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Dashboard
          </Link>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
          <CalendarClock className="h-8 w-8 text-primary" /> Availability Settings
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Configure your weekly working schedule, appointment slot durations, and active booking status.
        </p>
      </div>
    </div>
  )
}
