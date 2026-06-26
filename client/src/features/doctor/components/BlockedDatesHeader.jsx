import { Link } from "react-router-dom"
import { ArrowLeft, CalendarDays, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function BlockedDatesHeader({ onAddClick }) {
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
          <span className="text-muted-foreground/30">|</span>
          <Link
            to="/doctor/availability"
            className="text-sm font-medium text-primary hover:underline transition-colors"
          >
            Manage Availability
          </Link>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
          <CalendarDays className="h-8 w-8 text-primary" /> Blocked Dates
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Set calendar dates when you are unavailable. These override your normal weekly schedule.
        </p>
      </div>

      <Button onClick={onAddClick} className="gap-2 cursor-pointer shrink-0 md:self-end">
        <Plus className="h-4 w-4" /> Add Blocked Date
      </Button>
    </div>
  )
}
