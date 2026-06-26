import { Link } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, Calendar, ArrowRight, User } from "lucide-react"

export default function DashboardAppointments({ appointments = [] }) {
  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return <Badge variant="warning" className="capitalize">Pending</Badge>
      case "confirmed":
        return <Badge variant="success" className="capitalize bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-500">Confirmed</Badge>
      case "completed":
        return <Badge variant="secondary" className="capitalize bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-500">Completed</Badge>
      case "cancelled":
        return <Badge variant="destructive" className="capitalize">Cancelled</Badge>
      default:
        return <Badge variant="outline" className="capitalize">{status}</Badge>
    }
  }

  if (appointments.length === 0) {
    return (
      <Card className="border border-dashed p-8 md:p-12 text-center bg-card shadow-xs mb-8">
        <CardContent className="flex flex-col items-center justify-center space-y-4">
          <div className="h-12 w-12 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
            <Clock className="h-6 w-6" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-foreground">All Clear for Today!</h3>
            <p className="text-muted-foreground text-sm max-w-sm">
              You have no appointments scheduled for today. Enjoy your free schedule or catch up on other workflows.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4 mb-8">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-foreground">Today's Appointments</h2>
        <span className="text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-full font-medium">
          {appointments.length} scheduled
        </span>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {appointments.map((appointment) => (
          <Card key={appointment._id} className="shadow-xs hover:shadow-md transition-shadow border overflow-hidden">
            <CardContent className="p-5 flex flex-col justify-between h-full gap-4">
              
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground leading-snug">
                      {appointment.patient?.name || "Anonymous"}
                    </h3>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                      <Calendar className="h-3 w-3" /> {appointment.appointmentDate}
                    </p>
                  </div>
                </div>
                {getStatusBadge(appointment.status)}
              </div>

              {/* Reason description */}
              <div className="text-sm border-t border-muted pt-3 space-y-1">
                <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider block">
                  Reason for Visit
                </span>
                <p className="text-foreground/90 italic">
                  {appointment.reason ? `"${appointment.reason}"` : "No reason provided"}
                </p>
              </div>

              {/* Time prominently displayed in bottom section */}
              <div className="flex items-center justify-between border-t border-muted pt-3 mt-1">
                <div className="flex items-center gap-1.5 text-primary font-bold text-lg">
                  <Clock className="h-4.5 w-4.5 text-primary animate-pulse" />
                  <span>{appointment.bookedSlot}</span>
                </div>
                
                <Link to={`/doctor/appointments/${appointment._id}`}>
                  <Button size="sm" variant="ghost" className="text-primary hover:text-primary hover:bg-primary/10 gap-1.5">
                    View Appointment <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>

            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
