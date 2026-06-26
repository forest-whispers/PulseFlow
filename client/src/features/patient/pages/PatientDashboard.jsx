import { useSelector } from "react-redux"
import { usePatientDashboard } from "../hooks/usePatientDashboard"
import PatientHeader from "../components/PatientHeader"
import PatientStats from "../components/PatientStats"
import NextAppointmentCard from "../components/NextAppointmentCard"
import PendingInvoiceCard from "../components/PendingInvoiceCard"
import PatientQuickActions from "../components/PatientQuickActions"
import { Button } from "@/components/ui/button"
import { AlertTriangle, RotateCcw } from "lucide-react"

export default function PatientDashboard() {
  const { user } = useSelector((state) => state.auth)
  const { data, isLoading, isError, error, refetch } = usePatientDashboard()

  const formattedDate = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  // Loading state with visual skeletons
  if (isLoading) {
    return (
      <div className="space-y-8 animate-pulse">
        {/* Header Skeleton */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b pb-6 mb-8">
          <div className="space-y-2">
            <div className="h-8 w-64 bg-muted rounded-md" />
            <div className="h-4 w-96 bg-muted rounded-md" />
          </div>
          <div className="h-10 w-44 bg-muted rounded-md" />
        </div>

        {/* Stats Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-20 bg-muted rounded-xl border" />
          ))}
        </div>

        {/* Emphasized twin cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="h-[260px] bg-muted rounded-xl border" />
          ))}
        </div>

        {/* Quick actions Skeleton */}
        <div className="space-y-4">
          <div className="h-6 w-40 bg-muted rounded-md" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-28 bg-muted rounded-xl border" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Error boundary state
  if (isError) {
    const errMsg = error.response?.data?.message || error.message || "Failed to load dashboard data"
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6 space-y-6 animate-fade-in">
        <div className="h-16 w-16 rounded-full bg-destructive/10 text-destructive flex items-center justify-center">
          <AlertTriangle className="h-8 w-8" />
        </div>
        <div className="space-y-2 max-w-md">
          <h2 className="text-2xl font-bold text-foreground">Dashboard Load Failed</h2>
          <p className="text-muted-foreground text-sm">
            {errMsg}. Please verify your connection or refresh the page.
          </p>
        </div>
        <Button onClick={() => refetch()} className="gap-2 cursor-pointer">
          <RotateCcw className="h-4 w-4" /> Retry Loading
        </Button>
      </div>
    )
  }

  const dashboardData = data?.data || {}

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Patient Welcome Header */}
      <PatientHeader patientName={user?.name} formattedDate={formattedDate} />

      {/* Summary KPI stats */}
      <PatientStats stats={dashboardData.stats} />

      {/* Twin Actionable Items (Noticeably larger than KPIs) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Next Appointment Card */}
        <NextAppointmentCard appointment={dashboardData.nextAppointment} />

        {/* Oldest Pending Invoice Card */}
        <PendingInvoiceCard invoice={dashboardData.pendingInvoice} />
      </div>

      {/* Configuration-driven Quick Workflows */}
      <PatientQuickActions />
    </div>
  )
}
