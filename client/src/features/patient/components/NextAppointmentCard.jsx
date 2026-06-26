import { useNavigate } from "react-router-dom"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CalendarRange, ArrowRight, UserPlus, Clock, Calendar } from "lucide-react"

export default function NextAppointmentCard({ appointment }) {
  const navigate = useNavigate()

  // Safely format date avoiding timezone shifting
  const formatDate = (dateStr) => {
    if (!dateStr) return ""
    try {
      const [year, month, day] = dateStr.split("-").map(Number)
      const date = new Date(year, month - 1, day)
      return date.toLocaleDateString(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    } catch (e) {
      return dateStr
    }
  }

  // Get status color mappings
  const getStatusBadge = (status) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-200/25 px-2.5 py-0.5 font-semibold text-xs rounded-full uppercase">Confirmed</Badge>
      case "pending":
        return <Badge className="bg-amber-500/10 text-amber-600 border-amber-200/25 px-2.5 py-0.5 font-semibold text-xs rounded-full uppercase">Pending</Badge>
      case "cancelled":
        return <Badge className="bg-rose-500/10 text-rose-600 border-rose-200/25 px-2.5 py-0.5 font-semibold text-xs rounded-full uppercase">Cancelled</Badge>
      default:
        return <Badge className="bg-blue-500/10 text-blue-600 border-blue-200/25 px-2.5 py-0.5 font-semibold text-xs rounded-full uppercase">{status}</Badge>
    }
  }

  // Empty state rendering
  if (!appointment) {
    return (
      <Card className="border shadow-2xs hover:shadow-xs transition-shadow duration-200 h-full flex flex-col justify-between p-6 min-h-[260px]">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <CalendarRange className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-foreground">Next Consultation</h3>
              <p className="text-muted-foreground text-xs">No upcoming sessions</p>
            </div>
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Configure calendar events or search our specialist registry to schedule your next appointment.
          </p>
        </div>
        <Button
          onClick={() => navigate("/patient/doctors")}
          className="w-full gap-2 cursor-pointer mt-4"
        >
          <UserPlus className="h-4 w-4" /> Find Doctors
        </Button>
      </Card>
    )
  }

  const doctorName = appointment.doctor?.name ? `Dr. ${appointment.doctor.name}` : "Medical Specialist"

  return (
    <Card className="border shadow-2xs hover:shadow-xs transition-shadow duration-200 h-full flex flex-col justify-between p-6 min-h-[260px]">
      <div className="space-y-5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0 border border-blue-500/10">
              <CalendarRange className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-foreground">Next Consultation</h3>
              <p className="text-muted-foreground text-xs">Scheduled appointment details</p>
            </div>
          </div>
          {getStatusBadge(appointment.status)}
        </div>

        {/* Date and Time Highlight (Noticeably Prominent) */}
        <div className="space-y-3 pt-1">
          <div className="flex items-center gap-3 text-foreground">
            <Calendar className="h-5 w-5 text-primary shrink-0" />
            <span className="text-lg font-bold tracking-tight">
              {formatDate(appointment.appointmentDate)}
            </span>
          </div>
          <div className="flex items-center gap-3 text-muted-foreground">
            <Clock className="h-5 w-5 text-primary shrink-0" />
            <span className="text-base font-semibold tracking-tight text-foreground/80">
              {appointment.bookedSlot}
            </span>
          </div>
          <div className="text-xs text-muted-foreground pt-1">
            Provider: <span className="font-semibold text-foreground/80">{doctorName}</span>
          </div>
        </div>
      </div>

      <Button
        onClick={() => navigate(`/patient/appointments/${appointment._id}`)}
        variant="outline"
        className="w-full gap-2 cursor-pointer mt-6"
      >
        View Appointment <ArrowRight className="h-4 w-4" />
      </Button>
    </Card>
  )
}
