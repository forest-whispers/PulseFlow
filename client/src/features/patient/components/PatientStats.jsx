import { useNavigate } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { CalendarCheck, CalendarClock, Receipt } from "lucide-react"

export default function PatientStats({ stats = {} }) {
  const navigate = useNavigate()

  const STATS_CONFIG = [
    {
      key: "upcomingAppointments",
      title: "Upcoming Appointments",
      value: stats.upcomingAppointments ?? 0,
      path: "/patient/appointments",
      icon: CalendarCheck,
      colorClass: "bg-blue-500/10 text-blue-500",
    },
    {
      key: "pendingReschedules",
      title: "Pending Reschedules",
      value: stats.pendingReschedules ?? 0,
      path: "/patient/appointments",
      icon: CalendarClock,
      colorClass: "bg-amber-500/10 text-amber-500",
    },
    {
      key: "pendingInvoices",
      title: "Pending Invoices",
      value: stats.pendingInvoices ?? 0,
      path: "/patient/invoices",
      icon: Receipt,
      colorClass: "bg-indigo-500/10 text-indigo-500",
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      {STATS_CONFIG.map((stat) => {
        const Icon = stat.icon
        return (
          <Card
            key={stat.key}
            onClick={() => navigate(stat.path)}
            className="cursor-pointer border shadow-2xs hover:shadow-xs hover:border-primary/20 transition-all duration-300 group"
          >
            <CardContent className="p-5 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  {stat.title}
                </p>
                <p className="text-2xl font-extrabold text-foreground group-hover:text-primary transition-colors">
                  {stat.value}
                </p>
              </div>
              <div className={`h-11 w-11 rounded-lg flex items-center justify-center shrink-0 ${stat.colorClass}`}>
                <Icon className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
