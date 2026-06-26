import { useDoctorDashboard } from "../hooks/useDoctorDashboard"
import DashboardHeader from "../components/DashboardHeader"
import DashboardStats from "../components/DashboardStats"
import DashboardAppointments from "../components/DashboardAppointments"
import DashboardQuickActions from "../components/DashboardQuickActions"
import { Button } from "@/components/ui/button"
import { AlertTriangle, RotateCcw } from "lucide-react"

export default function DoctorDashboard() {
  const { data, isLoading, isError, error, refetch } = useDoctorDashboard()

  // Loading State with Skeletons
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

        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-20 bg-muted rounded-xl border" />
          ))}
        </div>

        {/* Today's Appointments Skeleton */}
        <div className="space-y-4 mb-8">
          <div className="h-6 w-48 bg-muted rounded-md" />
          <div className="grid md:grid-cols-2 gap-4">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="h-44 bg-muted rounded-xl border" />
            ))}
          </div>
        </div>

        {/* Quick Workflows Skeleton */}
        <div className="space-y-4">
          <div className="h-6 w-40 bg-muted rounded-md" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="h-24 bg-muted rounded-xl border" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Error State with Retry option
  if (isError) {
    const errMsg = error.response?.data?.message || error.message || "Failed to load dashboard data"
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6 space-y-6">
        <div className="h-16 w-16 rounded-full bg-destructive/10 text-destructive flex items-center justify-center">
          <AlertTriangle className="h-8 w-8" />
        </div>
        <div className="space-y-2 max-w-md">
          <h2 className="text-2xl font-bold text-foreground">Dashboard Load Failed</h2>
          <p className="text-muted-foreground text-sm">
            {errMsg}. Please verify your connection or refresh the page.
          </p>
        </div>
        <Button onClick={() => refetch()} className="gap-2">
          <RotateCcw className="h-4 w-4" /> Retry Loading
        </Button>
      </div>
    )
  }

  const dashboardData = data?.data || {}

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <DashboardHeader />

      {/* KPI Stats Grid */}
      <DashboardStats stats={dashboardData.stats} />

      {/* Today's Appointments Section */}
      <DashboardAppointments appointments={dashboardData.todayAppointments} />

      {/* Quick Action Navigation Workflows */}
      <DashboardQuickActions />
    </div>
  )
}
