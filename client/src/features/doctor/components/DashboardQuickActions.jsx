import { useNavigate } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { 
  CalendarRange, 
  CalendarX, 
  CalendarCheck, 
  FileSpreadsheet, 
  Pill, 
  Beaker, 
  CreditCard, 
  Bell, 
  UserCog 
} from "lucide-react"

// Config array allowing quick actions to be added/modified easily without layout changes
const QUICK_ACTIONS = [
  {
    title: "Manage Availability",
    description: "Set up and update your consulting slots and weekly schedule.",
    path: "/doctor/availability",
    icon: CalendarRange,
    colorClass: "bg-blue-500/10 text-blue-500",
  },
  {
    title: "Blocked Dates",
    description: "Manage clinical exception dates, holidays, and leaves.",
    path: "/doctor/blocked-dates",
    icon: CalendarX,
    colorClass: "bg-rose-500/10 text-rose-500",
  },
  {
    title: "Appointments",
    description: "View entire booking logs, history, and status trackers.",
    path: "/doctor/appointments",
    icon: CalendarCheck,
    colorClass: "bg-emerald-500/10 text-emerald-500",
  },
  {
    title: "Medical Records",
    description: "Browse diagnoses, patient histories, and clinical visit files.",
    path: "/doctor/medical-records",
    icon: FileSpreadsheet,
    colorClass: "bg-indigo-500/10 text-indigo-500",
  },
  {
    title: "Prescriptions",
    description: "Author and review medical scripts and dosage logs.",
    path: "/doctor/prescriptions",
    icon: Pill,
    colorClass: "bg-violet-500/10 text-violet-500",
  },
  {
    title: "Lab Results",
    description: "Review test findings, diagnostics, and reports.",
    path: "/doctor/lab-results",
    icon: Beaker,
    colorClass: "bg-cyan-500/10 text-cyan-500",
  },
  {
    title: "Invoices",
    description: "Track consultations payments, stripes receipts, and bills.",
    path: "/doctor/invoices",
    icon: CreditCard,
    colorClass: "bg-amber-500/10 text-amber-500",
  },
  {
    title: "Notifications",
    description: "Check inbox messages, warnings, and system alerts.",
    path: "/doctor/notifications",
    icon: Bell,
    colorClass: "bg-teal-500/10 text-teal-500",
  },
  {
    title: "Profile",
    description: "Edit bio, experience, clinic address, and avatar.",
    path: "/doctor/profile",
    icon: UserCog,
    colorClass: "bg-fuchsia-500/10 text-fuchsia-500",
  },
]

export default function DashboardQuickActions() {
  const navigate = useNavigate()

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-foreground">Quick Workflows</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {QUICK_ACTIONS.map((action, index) => {
          const Icon = action.icon
          return (
            <Card
              key={index}
              onClick={() => navigate(action.path)}
              className="group border shadow-xs hover:shadow-md hover:border-primary/20 transition-all duration-300 cursor-pointer flex flex-col justify-between"
            >
              <CardContent className="p-5 flex items-start gap-4">
                <div className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 border border-transparent group-hover:border-primary/10 transition-colors ${action.colorClass}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">
                    {action.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {action.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
