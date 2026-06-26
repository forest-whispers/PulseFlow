import { useSearchParams, useNavigate } from "react-router-dom"
import { Calendar, AlertCircle, RefreshCw, Loader2, Plus } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { usePatientAppointments } from "../hooks/usePatientAppointments"
import AppointmentCard from "../components/AppointmentCard"
import AppointmentPagination from "../components/AppointmentPagination"

export default function PatientAppointments() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()

  // Retrieve page state from search params (preserves page on details navigation)
  const page = parseInt(searchParams.get("page") || "1", 10)
  const limit = 10

  const handlePageChange = (newPage) => {
    setSearchParams({ page: newPage.toString() })
  }

  // Fetch appointments with TanStack Query (keepPreviousData maintains existing cards during fetch)
  const { data, isLoading, isError, error, refetch, isFetching } = usePatientAppointments(page, limit)

  const appointments = data?.data?.appointments || []
  const pagination = data?.data?.pagination || { page: 1, limit: 10, total: 0, totalPages: 1 }

  const handleViewDetails = (appointmentId) => {
    navigate(`/patient/appointments/${appointmentId}`)
  }

  // Initial loading state (no cached data yet)
  if (isLoading && !data) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto p-4 sm:p-6 animate-pulse">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <div className="h-7 w-48 bg-muted/60 rounded-md" />
            <div className="h-4 w-64 bg-muted/60 rounded-md" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-56 bg-card border rounded-2xl" />
          ))}
        </div>
      </div>
    )
  }

  // Error state
  if (isError) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-center p-6 space-y-4 max-w-md mx-auto">
        <div className="h-14 w-14 rounded-full bg-destructive/10 text-destructive flex items-center justify-center shadow-2xs">
          <AlertCircle className="h-7 w-7" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-foreground">Failed to Load Appointments</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {error?.response?.data?.message || error?.message || "We encountered an error loading your appointments. Please try again."}
          </p>
        </div>
        <Button onClick={() => refetch()} className="w-full gap-2 rounded-xl cursor-pointer">
          <RefreshCw className="h-4 w-4" /> Reload Appointments
        </Button>
      </div>
    )
  }

  // Empty state (only if loaded and no appointments are returned)
  if (appointments.length === 0) {
    return (
      <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
        <div className="space-y-1.5">
          <h2 className="text-2xl font-extrabold text-foreground tracking-tight">
            Consultation History
          </h2>
          <p className="text-sm text-muted-foreground">
            Manage your consultations, check timings, and view session details.
          </p>
        </div>

        <Card className="border border-dashed p-8 sm:p-12 text-center flex flex-col items-center justify-center space-y-5 bg-card rounded-2xl max-w-2xl mx-auto mt-6">
          <div className="h-14 w-14 rounded-full bg-primary/10 text-primary flex items-center justify-center shadow-2xs">
            <Calendar className="h-7 w-7" />
          </div>
          <div className="space-y-2 max-w-sm">
            <h3 className="text-lg font-bold text-foreground">No Appointments Scheduled</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              You don't have any appointments scheduled yet. Find a specialist to book your first online consultation.
            </p>
          </div>
          <Button
            onClick={() => navigate("/patient/doctors")}
            className="font-bold gap-2 rounded-xl cursor-pointer"
          >
            <Plus className="h-4.5 w-4.5" /> Find Doctors
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div className="space-y-1.5">
          <h2 className="text-2xl font-extrabold text-foreground tracking-tight flex items-center gap-2">
            Consultation History
            {isFetching && (
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground font-normal bg-muted/65 px-2.5 py-1 rounded-md border animate-pulse">
                <Loader2 className="h-3 w-3 animate-spin text-primary" /> Updating...
              </span>
            )}
          </h2>
          <p className="text-sm text-muted-foreground">
            Manage your consultations, check timings, and view session details.
          </p>
        </div>
      </div>

      {/* Appointment Grid List */}
      <div
        className={`grid grid-cols-1 md:grid-cols-2 gap-6 transition-all duration-300 ${
          isFetching ? "opacity-70 pointer-events-none" : "opacity-100"
        }`}
      >
        {appointments.map((appointment) => (
          <AppointmentCard
            key={appointment._id}
            appointment={appointment}
            onViewDetails={handleViewDetails}
          />
        ))}
      </div>

      {/* Appointment Pagination Controls */}
      <AppointmentPagination
        page={pagination.page}
        totalPages={pagination.totalPages}
        total={pagination.total}
        limit={pagination.limit}
        onPageChange={handlePageChange}
      />
    </div>
  )
}
