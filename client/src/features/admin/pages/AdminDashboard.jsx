import { useAdminDashboard } from "../hooks/useAdminDashboard"
import { Link, useNavigate } from "react-router-dom"
import {
  Calendar,
  User,
  Users,
  Stethoscope,
  Clock,
  CheckCircle2,
  RefreshCw,
  Receipt,
  IndianRupee,
  Activity,
  AlertTriangle,
  ArrowRight,
  ChevronRight,
  TrendingUp,
  Bell,
  Heart,
  BarChart3,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

function formatDate(dateStr) {
  if (!dateStr) return "N/A"
  try {
    const date = new Date(dateStr)
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  } catch {
    return dateStr
  }
}

function formatRelativeTime(dateStr) {
  if (!dateStr) return "N/A"
  try {
    const date = new Date(dateStr)
    const diffMs = Date.now() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    if (diffMins < 1) return "Just now"
    if (diffMins < 60) return `${diffMins}m ago`
    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours}h ago`
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  } catch {
    return dateStr
  }
}

export default function AdminDashboard() {
  const navigate = useNavigate()
  const { data, isLoading, isError, error, refetch } = useAdminDashboard()

  // Loading skeleton state
  if (isLoading) {
    return (
      <div className="space-y-8 max-w-7xl mx-auto p-4 sm:p-6 animate-pulse">
        <div className="flex flex-col gap-2 border-b pb-6">
          <div className="h-8 w-60 bg-muted/65 rounded-md" />
          <div className="h-4 w-96 bg-muted/50 rounded-md" />
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {Array.from({ length: 8 }).map((_, idx) => (
            <div key={idx} className="h-24 bg-muted/50 rounded-2xl border" />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="h-6 w-48 bg-muted/60 rounded-md" />
            <div className="h-44 bg-muted/55 rounded-2xl border" />
          </div>
          <div className="space-y-4">
            <div className="h-6 w-40 bg-muted/60 rounded-md" />
            <div className="h-44 bg-muted/55 rounded-2xl border" />
          </div>
        </div>
      </div>
    )
  }

  // Error retry display
  if (isError) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6 space-y-6 max-w-md mx-auto animate-fade-in">
        <div className="h-16 w-16 rounded-full bg-destructive/10 text-destructive flex items-center justify-center shadow-2xs">
          <AlertTriangle className="h-8 w-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">Dashboard Load Failed</h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {error?.response?.data?.message || error?.message || "We encountered an issue retrieving the administrator statistics data. Please try again."}
          </p>
        </div>
        <Button onClick={() => refetch()} className="w-full gap-2 rounded-xl cursor-pointer">
          <RefreshCw className="h-4 w-4 animate-spin" /> Retry Loading
        </Button>
      </div>
    )
  }

  const dashboardData = data?.data || {}
  const stats = {
    doctors: dashboardData.users?.doctors ?? 0,
    patients: dashboardData.users?.patients ?? 0,
    today: dashboardData.appointments?.today ?? 0,
    pending: dashboardData.appointments?.pending ?? 0,
    completed: dashboardData.appointments?.completed ?? 0,
    pendingReschedule: dashboardData.appointments?.pending_reschedule ?? 0,
    pendingInvoices: dashboardData.invoices?.pendingInvoices ?? 0,
    revenue: dashboardData.revenue ?? 0,
  }

  const upcomingAppointments = dashboardData.upcomingAppointments || []
  const recentActivity = dashboardData.recentActivity || []

  const formattedDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  // Quick Action Navigation Card details
  const quickActions = [
    { title: "Doctors", route: "/admin/doctors", icon: Stethoscope, color: "text-blue-500 bg-blue-500/10" },
    { title: "Patients", route: "/admin/patients", icon: Heart, color: "text-rose-500 bg-rose-500/10" },
    { title: "Users", route: "/admin/users", icon: Users, color: "text-amber-500 bg-amber-500/10" },
    { title: "Appointments", route: "/admin/appointments", icon: Calendar, color: "text-emerald-500 bg-emerald-500/10" },
    { title: "Notifications", route: "/admin/notifications", icon: Bell, color: "text-indigo-500 bg-indigo-500/10" },
    { title: "Analytics", route: "/admin/analytics", icon: BarChart3, color: "text-violet-500 bg-violet-500/10" },
  ]

  // KPI metadata list mapping
  const kpiItems = [
    { label: "Total Doctors", value: stats.doctors, icon: Stethoscope, color: "text-blue-500" },
    { label: "Total Patients", value: stats.patients, icon: Users, color: "text-indigo-500" },
    { label: "Today's Appointments", value: stats.today, icon: Calendar, color: "text-emerald-500" },
    { label: "Pending Appointments", value: stats.pending, icon: Clock, color: "text-amber-500" },
    { label: "Completed Appointments", value: stats.completed, icon: CheckCircle2, color: "text-sky-500" },
    { label: "Pending Reschedules", value: stats.pendingReschedule, icon: RefreshCw, color: "text-violet-500" },
    { label: "Pending Invoices", value: stats.pendingInvoices, icon: Receipt, color: "text-rose-500" },
    { label: "Total Revenue", value: `₹${stats.revenue}`, icon: IndianRupee, color: "text-teal-500" },
  ]

  return (
    <div className="space-y-8 max-w-7xl mx-auto p-4 sm:p-6 animate-fade-in">
      {/* Header Dashboard Welcome */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-border/40 pb-6 mb-4 bg-muted/5 p-4 rounded-2xl">
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-black text-foreground">Welcome back, Administrator</h2>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Monitor hospital operations, analyze financial revenue logs, and review pending consultations.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-primary bg-primary/10 border border-primary/20 px-4 py-2 rounded-xl shadow-xs self-start md:self-auto">
          <Calendar className="h-4 w-4" />
          {formattedDate}
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {kpiItems.map((item, idx) => {
          const Icon = item.icon
          return (
            <Card key={idx} className="border border-border/40 shadow-2xs bg-card hover:shadow-xs hover:border-primary/15 transition-all duration-300 rounded-2xl overflow-hidden">
              <CardContent className="p-5 flex items-center justify-between gap-4">
                <div className="space-y-1.5 min-w-0">
                  <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block truncate">
                    {item.label}
                  </span>
                  <p className="text-xl sm:text-2xl font-black text-foreground truncate select-all leading-tight">
                    {item.value}
                  </p>
                </div>
                <div className={`h-11 w-11 rounded-xl bg-muted/5 flex items-center justify-center shrink-0 border border-border/10`}>
                  <Icon className={`h-5.5 w-5.5 ${item.color}`} />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Details Lists & Activity Logs columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upcoming appointments list */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between border-b border-border/15 pb-2">
            <h3 className="text-sm font-extrabold text-foreground uppercase tracking-wider flex items-center gap-2">
              <Calendar className="h-4.5 w-4.5 text-primary" />
              Upcoming consultations
            </h3>
            <Badge variant="secondary" className="font-bold text-[10px]">
              {upcomingAppointments.length} Booked
            </Badge>
          </div>

          {upcomingAppointments.length === 0 ? (
            <Card className="border border-dashed border-border/40 shadow-2xs bg-card p-12 text-center rounded-2xl">
              <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-3">
                <Calendar className="h-5 w-5" />
              </div>
              <h4 className="text-xs font-bold text-foreground mb-1">No Upcoming Appointments</h4>
              <p className="text-[11px] text-muted-foreground max-w-xs mx-auto">
                No upcoming doctor consultations are registered in the queue yet.
              </p>
            </Card>
          ) : (
            <div className="space-y-4">
              {upcomingAppointments.map((apt) => {
                const isConfirmed = apt.status === "confirmed"
                return (
                  <Card
                    key={apt._id}
                    onClick={() => navigate(`/admin/appointments/${apt._id}`)}
                    className="border border-border/40 shadow-2xs bg-card hover:shadow-xs hover:border-primary/20 transition-all duration-300 cursor-pointer overflow-hidden rounded-2xl"
                  >
                    <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="space-y-2.5 flex-1 min-w-0">
                        {/* Status badge */}
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge
                            className={
                              isConfirmed
                                ? "bg-emerald-500/10 text-emerald-600 border-emerald-200/35 font-bold text-[10px] rounded-md shadow-2xs"
                                : "bg-amber-500/10 text-amber-600 border-amber-200/35 font-bold text-[10px] rounded-md shadow-2xs"
                            }
                          >
                            {apt.status.toUpperCase()}
                          </Badge>
                          <span className="text-[10px] text-muted-foreground font-medium">
                            {formatDate(apt.appointmentDate)}
                          </span>
                        </div>

                        {/* Details */}
                        <div className="grid grid-cols-2 gap-4 text-xs">
                          <div>
                            <span className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider">Patient</span>
                            <p className="font-extrabold text-foreground mt-0.5 truncate">{apt.patient?.name}</p>
                          </div>
                          <div>
                            <span className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider">Consultant</span>
                            <p className="font-extrabold text-foreground mt-0.5 truncate">
                              {apt.doctor?.name?.startsWith("Dr.") ? apt.doctor.name : `Dr. ${apt.doctor?.name}`}
                            </p>
                          </div>
                        </div>

                        {/* Slot details */}
                        <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                          <Clock className="h-3.5 w-3.5" />
                          <span>Slot: {apt.bookedSlot}</span>
                        </div>
                      </div>

                      <div className="hidden sm:flex h-8 w-8 rounded-lg border bg-muted/5 items-center justify-center shrink-0 hover:bg-primary/5 transition-colors">
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </div>

        {/* Sidebar Activity & Quick actions */}
        <div className="space-y-8">
          {/* Quick Actions Grid */}
          <div className="space-y-4">
            <h3 className="text-sm font-extrabold text-foreground uppercase tracking-wider flex items-center gap-2 border-b border-border/15 pb-2">
              <TrendingUp className="h-4.5 w-4.5 text-primary" />
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {quickActions.map((action, idx) => {
                const ActionIcon = action.icon
                return (
                  <Link
                    key={idx}
                    to={action.route}
                    className="border border-border/30 hover:border-primary/20 hover:shadow-2xs p-4 rounded-xl bg-card hover:bg-muted/5 transition-all duration-300 flex flex-col gap-2.5 items-start group"
                  >
                    <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 border border-border/5 ${action.color}`}>
                      <ActionIcon className="h-4 w-4" />
                    </div>
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">
                        {action.title}
                      </span>
                      <ArrowRight className="h-3 w-3 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Recent activities logs */}
          <div className="space-y-4">
            <h3 className="text-sm font-extrabold text-foreground uppercase tracking-wider flex items-center gap-2 border-b border-border/15 pb-2">
              <Activity className="h-4.5 w-4.5 text-primary" />
              Recent Operations Logs
            </h3>

            {recentActivity.length === 0 ? (
              <p className="text-xs text-muted-foreground italic bg-muted/15 p-4 rounded-xl border border-border/5 text-center leading-relaxed">
                No Recent Activity
              </p>
            ) : (
              <div className="space-y-3.5">
                {recentActivity.map((activity, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3.5 border border-border/20 rounded-xl bg-muted/5 text-xs relative overflow-hidden">
                    <div className="h-2 w-2 rounded-full bg-primary mt-1.5 shrink-0" />
                    <div className="space-y-1 min-w-0 flex-1">
                      <p className="font-semibold text-foreground leading-relaxed">
                        {activity.desc}
                      </p>
                      <span className="text-[10px] text-muted-foreground block">
                        {formatRelativeTime(activity.timestamp)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
