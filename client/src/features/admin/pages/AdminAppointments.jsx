import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Calendar, RefreshCw, AlertCircle, FileText, Pill, Beaker, Receipt } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAdminAppointments } from "../hooks/useAdminAppointments"
import AppointmentCard from "../../patient/components/AppointmentCard"
import AppointmentPagination from "../../patient/components/AppointmentPagination"

export default function AdminAppointments() {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const limit = 10

  const {
    data: listData,
    isLoading,
    isError,
    error,
    refetch,
  } = useAdminAppointments(page, limit)

  const appointments = listData?.data?.appointments || []
  const pagination = listData?.data?.pagination || { page: 1, totalPages: 1, total: 0 }

  const handlePageChange = (newPage) => {
    setPage(newPage)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleViewDetails = (id) => {
    navigate(`/admin/appointments/${id}`)
  }

  const kpiCards = [
    {
      title: "Medical Records",
      description: "Access patient clinical logs & visit files.",
      path: "/admin/medical-records",
      icon: FileText,
      color: "bg-indigo-500/10 text-indigo-500",
    },
    {
      title: "Prescriptions",
      description: "Review current medications & prescriptions.",
      path: "/admin/prescriptions",
      icon: Pill,
      color: "bg-violet-500/10 text-violet-500",
    },
    {
      title: "Lab Results",
      description: "Inspect clinical diagnosis & laboratory reports.",
      path: "/admin/lab-results",
      icon: Beaker,
      color: "bg-cyan-500/10 text-cyan-500",
    },
    {
      title: "Invoices",
      description: "Track billing records & payment ledgers.",
      path: "/admin/invoices",
      icon: Receipt,
      color: "bg-amber-500/10 text-amber-500",
    },
  ]

  // Loading skeleton state
  if (isLoading) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto p-4 sm:p-6">
        <div className="flex flex-col gap-1.5 animate-pulse">
          <div className="h-7 w-48 bg-muted/65 rounded-md" />
          <div className="h-4 w-72 bg-muted/50 rounded-md" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, idx) => (
            <Card key={idx} className="border rounded-2xl h-[260px] animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  // Error retry state
  if (isError) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-center p-6 space-y-4 max-w-md mx-auto animate-fade-in">
        <div className="h-14 w-14 rounded-full bg-destructive/10 text-destructive flex items-center justify-center shadow-2xs">
          <AlertCircle className="h-7 w-7" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-foreground">Failed to Load Appointments</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {error?.response?.data?.message || error?.message || "We encountered an issue retrieving the hospital appointment records. Please try again."}
          </p>
        </div>
        <Button onClick={() => refetch()} className="w-full gap-2 rounded-xl cursor-pointer">
          <RefreshCw className="h-4 w-4" /> Try Again
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-4 sm:p-6 animate-fade-in">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl sm:text-2xl font-extrabold text-foreground">Consultation Schedules</h2>
        <p className="text-xs text-muted-foreground">
          Review and manage all patient doctor appointments across the hospital.
        </p>
      </div>

      {/* Clinical Workflow Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((card, index) => {
          const Icon = card.icon
          return (
            <Card
              key={index}
              onClick={() => navigate(card.path)}
              className="group border shadow-2xs hover:shadow-xs hover:border-primary/20 transition-all duration-300 cursor-pointer flex flex-col justify-between"
            >
              <CardContent className="p-5 flex flex-col justify-between h-full gap-4">
                <div className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 border border-transparent group-hover:border-primary/10 transition-colors ${card.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {card.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {appointments.length === 0 ? (
        // Empty State
        <Card className="border border-dashed border-border/40 shadow-2xs bg-card p-12 text-center rounded-2xl">
          <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
            <Calendar className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold text-foreground mb-1.5">No Appointments Found</h3>
          <p className="text-xs text-muted-foreground max-w-xs mx-auto leading-relaxed">
            There are no doctor appointments registered in the database yet.
          </p>
        </Card>
      ) : (
        // Grid Listing
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {appointments.map((appointment) => (
              <AppointmentCard
                key={appointment._id}
                appointment={appointment}
                onViewDetails={handleViewDetails}
                primaryPerson="admin"
              />
            ))}
          </div>

          {/* Reusable Pagination */}
          <AppointmentPagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            total={pagination.total}
            limit={limit}
            onPageChange={handlePageChange}
            label="appointments"
          />
        </div>
      )}
    </div>
  )
}
