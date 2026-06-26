import { Card, CardContent } from "@/components/ui/card"
import { CalendarDays, Clock, CheckCircle2, ClipboardCheck, XCircle } from "lucide-react"

export default function DashboardStats({ stats = {} }) {
  const cards = [
    {
      title: "Total Appointments",
      value: stats.total ?? 0,
      icon: CalendarDays,
      colorClass: "text-primary bg-primary/10 border-primary/20",
    },
    {
      title: "Pending",
      value: stats.pending ?? 0,
      icon: Clock,
      colorClass: "text-amber-600 bg-amber-500/10 border-amber-500/20 dark:text-amber-500",
    },
    {
      title: "Confirmed",
      value: stats.confirmed ?? 0,
      icon: CheckCircle2,
      colorClass: "text-emerald-600 bg-emerald-500/10 border-emerald-500/20 dark:text-emerald-500",
    },
    {
      title: "Completed",
      value: stats.completed ?? 0,
      icon: ClipboardCheck,
      colorClass: "text-blue-600 bg-blue-500/10 border-blue-500/20 dark:text-blue-500",
    },
    {
      title: "Cancelled",
      value: stats.cancelled ?? 0,
      icon: XCircle,
      colorClass: "text-rose-600 bg-rose-500/10 border-rose-500/20 dark:text-rose-500",
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
      {cards.map((card, index) => {
        const Icon = card.icon
        return (
          <Card key={index} className="shadow-xs hover:shadow-md transition-shadow border">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="space-y-1.5">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {card.title}
                </p>
                <p className="text-2xl font-extrabold tracking-tight text-foreground">
                  {card.value}
                </p>
              </div>
              <div className={`h-10 w-10 rounded-lg flex items-center justify-center border ${card.colorClass}`}>
                <Icon className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
