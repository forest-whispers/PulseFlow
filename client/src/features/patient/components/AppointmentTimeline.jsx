import { Check, X, CalendarCheck, Clock } from "lucide-react"

export default function AppointmentTimeline({ status = "pending" }) {
  // Derive timeline steps configuration based on the status prop
  const getTimelineSteps = () => {
    if (status === "cancelled") {
      return [
        {
          label: "Booked",
          icon: Check,
          className: "bg-emerald-500 text-white border-emerald-500",
          textClass: "text-foreground font-semibold",
        },
        {
          label: "Cancelled",
          icon: X,
          className: "bg-destructive text-destructive-foreground border-destructive",
          textClass: "text-destructive font-bold",
        },
      ]
    }

    if (status === "completed") {
      return [
        {
          label: "Booked",
          icon: Check,
          className: "bg-emerald-500 text-white border-emerald-500",
          textClass: "text-muted-foreground",
        },
        {
          label: "Confirmed",
          icon: Check,
          className: "bg-emerald-500 text-white border-emerald-500",
          textClass: "text-muted-foreground",
        },
        {
          label: "Completed",
          icon: CalendarCheck,
          className: "bg-blue-500 text-white border-blue-500",
          textClass: "text-blue-600 font-bold",
        },
      ]
    }

    if (status === "confirmed") {
      return [
        {
          label: "Booked",
          icon: Check,
          className: "bg-emerald-500 text-white border-emerald-500",
          textClass: "text-muted-foreground",
        },
        {
          label: "Confirmed",
          icon: CalendarCheck,
          className: "bg-emerald-500 text-white border-emerald-500 shadow-xs",
          textClass: "text-emerald-600 font-bold",
        },
        {
          label: "Completed",
          icon: Clock,
          className: "bg-background text-muted-foreground/45 border-border",
          textClass: "text-muted-foreground/50",
        },
      ]
    }

    if (status === "pending_reschedule") {
      return [
        {
          label: "Booked",
          icon: Check,
          className: "bg-emerald-500 text-white border-emerald-500",
          textClass: "text-muted-foreground",
        },
        {
          label: "Reschedule Pending",
          icon: Clock,
          className: "bg-purple-500 text-white border-purple-500 shadow-xs",
          textClass: "text-purple-600 font-bold",
        },
        {
          label: "Confirmed",
          icon: CalendarCheck,
          className: "bg-background text-muted-foreground/45 border-border",
          textClass: "text-muted-foreground/50",
        },
      ]
    }

    // Default "pending" approval state
    return [
      {
        label: "Booked",
        icon: Check,
        className: "bg-emerald-500 text-white border-emerald-500",
        textClass: "text-muted-foreground",
      },
      {
        label: "Pending Approval",
        icon: Clock,
        className: "bg-amber-500 text-white border-amber-500 shadow-xs",
        textClass: "text-amber-600 font-bold",
      },
      {
        label: "Confirmed",
        icon: CalendarCheck,
        className: "bg-background text-muted-foreground/45 border-border",
        textClass: "text-muted-foreground/50",
      },
    ]
  }

  const steps = getTimelineSteps()

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-bold text-foreground">Appointment Progress</h4>
      <div className="relative flex items-center justify-between w-full max-w-xl mx-auto px-4 py-3">
        {/* Connector Line behind steps */}
        <div className="absolute left-8 right-8 top-1/2 -translate-y-1/2 h-[2px] bg-border z-0" />

        {steps.map((step, index) => {
          const Icon = step.icon
          return (
            <div key={index} className="relative z-10 flex flex-col items-center gap-2">
              <div
                className={`h-9 w-9 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${step.className}`}
              >
                <Icon className="h-4.5 w-4.5 shrink-0" />
              </div>
              <span className={`text-[10px] sm:text-xs tracking-wide transition-colors ${step.textClass}`}>
                {step.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
