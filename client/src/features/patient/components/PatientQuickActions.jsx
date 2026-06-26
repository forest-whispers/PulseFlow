import { useNavigate } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { 
  Stethoscope, 
  CalendarCheck, 
  FileText, 
  Pill, 
  Beaker, 
  Receipt, 
  Bell, 
  User 
} from "lucide-react"

const QUICK_ACTIONS = [
  {
    title: "Find Doctors",
    description: "Search specialist doctors, verify consultation hours, and book slots.",
    path: "/patient/doctors",
    icon: Stethoscope,
    colorClass: "bg-blue-500/10 text-blue-500",
  },
  {
    title: "Appointments",
    description: "View scheduled consultation logs, status trackers, and histories.",
    path: "/patient/appointments",
    icon: CalendarCheck,
    colorClass: "bg-emerald-500/10 text-emerald-500",
  },
  {
    title: "Medical Records",
    description: "Access medical histories, doctor summaries, and visit archives.",
    path: "/patient/medical-records",
    icon: FileText,
    colorClass: "bg-indigo-500/10 text-indigo-500",
  },
  {
    title: "Prescriptions",
    description: "Review current medications, scripts, and pharmacy logs.",
    path: "/patient/prescriptions",
    icon: Pill,
    colorClass: "bg-violet-500/10 text-violet-500",
  },
  {
    title: "Lab Results",
    description: "Browse diagnostics findings, lab reports, and vitals details.",
    path: "/patient/lab-results",
    icon: Beaker,
    colorClass: "bg-cyan-500/10 text-cyan-500",
  },
  {
    title: "Invoices",
    description: "Track consultation receipts, stripes payments, and pay bills.",
    path: "/patient/invoices",
    icon: Receipt,
    colorClass: "bg-amber-500/10 text-amber-500",
  },
  {
    title: "Notifications",
    description: "Browse account alerts, clinic reminders, and notifications inbox.",
    path: "/patient/notifications",
    icon: Bell,
    colorClass: "bg-teal-500/10 text-teal-500",
  },
  {
    title: "Profile",
    description: "Edit age, gender, contact details, and account security.",
    path: "/patient/profile",
    icon: User,
    colorClass: "bg-fuchsia-500/10 text-fuchsia-500",
  },
]

export default function PatientQuickActions() {
  const navigate = useNavigate()

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-foreground">Healthcare Workflows</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {QUICK_ACTIONS.map((action, index) => {
          const Icon = action.icon
          return (
            <Card
              key={index}
              onClick={() => navigate(action.path)}
              className="group border shadow-2xs hover:shadow-xs hover:border-primary/20 transition-all duration-300 cursor-pointer flex flex-col justify-between"
            >
              <CardContent className="p-5 flex flex-col justify-between h-full gap-4">
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
