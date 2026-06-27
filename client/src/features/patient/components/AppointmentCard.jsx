import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Stethoscope, ArrowRight, Clipboard, User } from "lucide-react"

// Configuration-driven status badge styles and labels
const STATUS_CONFIG = {
  pending: {
    label: "Pending",
    className: "bg-amber-500/10 text-amber-600 border-amber-200/35 hover:bg-amber-500/10 font-bold",
  },
  confirmed: {
    label: "Confirmed",
    className: "bg-emerald-500/10 text-emerald-600 border-emerald-200/35 hover:bg-emerald-500/10 font-bold",
  },
  completed: {
    label: "Completed",
    className: "bg-blue-500/10 text-blue-600 border-blue-200/35 hover:bg-blue-500/10 font-bold",
  },
  pending_reschedule: {
    label: "Reschedule Pending",
    className: "bg-purple-500/10 text-purple-600 border-purple-200/35 hover:bg-purple-500/10 font-bold",
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/10 font-bold",
  },
}

function formatTime12Hour(timeStr) {
  if (!timeStr) return "N/A"
  // If time slot contains a range (e.g. "10:30 AM - 11:00 AM"), return it directly
  if (timeStr.includes("AM") || timeStr.includes("PM")) return timeStr

  const [hourStr, minStr] = timeStr.split(":")
  const hour = parseInt(hourStr, 10)
  if (isNaN(hour)) return timeStr
  const ampm = hour >= 12 ? "PM" : "AM"
  const hour12 = hour % 12 || 12
  const paddedHour = String(hour12).padStart(2, "0")
  return `${paddedHour}:${minStr} ${ampm}`
}

function formatDate(dateStr) {
  if (!dateStr) return "N/A"
  try {
    const date = new Date(dateStr)
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  } catch {
    return dateStr
  }
}

export default function AppointmentCard({ appointment = {}, onViewDetails, primaryPerson = "doctor" }) {
  const isPatient = primaryPerson === "patient"
  const isAdmin = primaryPerson === "admin"
  
  const rawName = isPatient
    ? (appointment.patient?.name || "Consultation Patient")
    : (appointment.doctor?.name || "Medical Specialist")

  const displayName = isPatient
    ? rawName
    : (rawName.startsWith("Dr.") ? rawName : `Dr. ${rawName}`)

  const roleLabel = isPatient ? "Patient Name" : "Healthcare Provider"
  const IconComponent = isAdmin ? Clipboard : (isPatient ? User : Stethoscope)

  const dateLabel = formatDate(appointment.appointmentDate)
  const slotLabel = formatTime12Hour(appointment.bookedSlot)
  const status = appointment.status || "pending"
  const reason = appointment.reason || "No reason specified."

  const statusConfig = STATUS_CONFIG[status] || {
    label: status.replace("_", " ").toUpperCase(),
    className: "bg-muted text-muted-foreground border-border hover:bg-muted font-bold",
  }

  const handleCardClick = (e) => {
    // If clicking on buttons, don't trigger the card navigation double-trigger
    if (e.target.closest("button")) return
    onViewDetails(appointment._id)
  }

  return (
    <Card
      onClick={handleCardClick}
      className="group border shadow-2xs hover:shadow-md hover:border-primary/20 transition-all duration-300 flex flex-col justify-between overflow-hidden bg-card cursor-pointer"
    >
      <CardContent className="p-5 flex flex-col h-full gap-4">
        {/* Header: Status and Doctor */}
        <div className="flex justify-between items-start gap-3">
          <div className="flex gap-3 items-center min-w-0">
            <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <IconComponent className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              {isAdmin ? (
                <div className="space-y-0.5">
                  <h3 className="font-extrabold text-sm text-foreground truncate">
                    Patient: {appointment.patient?.name || "N/A"}
                  </h3>
                  <p className="text-[10px] text-muted-foreground font-bold truncate">
                    Doctor: {appointment.doctor?.name?.startsWith("Dr.") ? appointment.doctor.name : `Dr. ${appointment.doctor?.name || "N/A"}`}
                  </p>
                </div>
              ) : (
                <>
                  <h3 className="font-extrabold text-base text-foreground leading-snug group-hover:text-primary transition-colors truncate">
                    {displayName}
                  </h3>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
                    {roleLabel}
                  </p>
                </>
              )}
            </div>
          </div>
          <Badge className={`shrink-0 text-xs px-2.5 py-0.5 rounded-md border transition-all ${statusConfig.className}`}>
            {statusConfig.label}
          </Badge>
        </div>

        {/* Schedule Info */}
        <div className="grid grid-cols-2 gap-3 py-1 border-t border-dashed">
          <div className="space-y-1">
            <span className="text-[10px] text-muted-foreground uppercase font-bold flex items-center gap-1">
              <Calendar className="h-3 w-3 text-primary/70" /> Date
            </span>
            <p className="text-xs sm:text-sm font-semibold text-foreground">
              {dateLabel}
            </p>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] text-muted-foreground uppercase font-bold flex items-center gap-1">
              <Clock className="h-3 w-3 text-primary/70" /> Time Slot
            </span>
            <p className="text-xs sm:text-sm font-semibold text-foreground">
              {slotLabel}
            </p>
          </div>
        </div>

        {/* Reason for Visit */}
        <div className="space-y-1 pt-1.5 border-t border-dashed flex-1">
          <span className="text-[10px] text-muted-foreground uppercase font-bold flex items-center gap-1">
            <Clipboard className="h-3 w-3 text-primary/70" /> Reason
          </span>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-2">
            {reason}
          </p>
        </div>
      </CardContent>

      <CardFooter className="px-5 py-3.5 bg-muted/20 border-t flex justify-end">
        <Button
          onClick={() => onViewDetails(appointment._id)}
          variant="outline"
          size="sm"
          className="text-xs font-bold gap-1.5 h-8 rounded-lg cursor-pointer hover:bg-primary hover:text-primary-foreground hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all duration-300"
        >
          View Details
          <ArrowRight className="h-3.5 w-3.5" />
        </Button>
      </CardFooter>
    </Card>
  )
}
