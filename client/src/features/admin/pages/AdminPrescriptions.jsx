import { useState } from "react"
import { Link } from "react-router-dom"
import { Calendar, User, Pill, Stethoscope, RefreshCw, AlertCircle, Eye } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { usePrescriptionsList } from "../../patient/hooks/usePrescriptions"
import AppointmentPagination from "../../patient/components/AppointmentPagination"

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

export default function AdminPrescriptions() {
  const [page, setPage] = useState(1)
  const limit = 10

  const {
    data: listData,
    isLoading,
    isError,
    error,
    refetch,
  } = usePrescriptionsList({ page, limit })

  const prescriptions = listData?.data?.prescriptions || []
  const pagination = listData?.data?.pagination || { page: 1, totalPages: 1, total: 0 }

  const handlePageChange = (newPage) => {
    setPage(newPage)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // Loading skeleton state
  if (isLoading) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto p-4 sm:p-6">
        <div className="flex flex-col gap-1.5 animate-pulse">
          <div className="h-7 w-48 bg-muted/65 rounded-md" />
          <div className="h-4 w-72 bg-muted/50 rounded-md" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, idx) => (
            <Card key={idx} className="border rounded-2xl h-[240px] animate-pulse" />
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
          <h3 className="text-xl font-bold text-foreground">Failed to Load Prescriptions</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {error?.response?.data?.message || error?.message || "We encountered an issue retrieving the hospital prescription registry. Please try again."}
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
        <h2 className="text-xl sm:text-2xl font-extrabold text-foreground">Prescription Logs Ledger</h2>
        <p className="text-xs text-muted-foreground">
          Monitor and review hospital prescriptions, medications list, and consultation advice.
        </p>
      </div>

      {prescriptions.length === 0 ? (
        // Empty State
        <Card className="border border-dashed border-border/40 shadow-2xs bg-card p-12 text-center rounded-2xl animate-fade-in">
          <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
            <Pill className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold text-foreground mb-1.5">No Prescriptions</h3>
          <p className="text-xs text-muted-foreground max-w-xs mx-auto leading-relaxed">
            There are no prescriptions registered in the database yet.
          </p>
        </Card>
      ) : (
        // Grid Listing
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {prescriptions.map((prescription) => {
              const meds = prescription.medications || []
              const medCount = meds.length
              
              // Compact medications preview list (first 1 or 2 names + count indicator)
              const previewMeds = meds.slice(0, 2)
              const remainingCount = medCount - previewMeds.length

              return (
                <Card 
                  key={prescription._id} 
                  className="border border-border/40 shadow-2xs bg-card hover:shadow-xs hover:border-primary/20 transition-all duration-300 flex flex-col justify-between overflow-hidden rounded-2xl"
                >
                  <CardHeader className="p-5 pb-3 border-b border-border/10 flex flex-row items-center justify-between gap-4 bg-muted/5">
                    <CardTitle className="text-sm font-bold flex items-center gap-2 text-foreground">
                      <Calendar className="h-4.5 w-4.5 text-primary" />
                      {formatDate(prescription.createdAt)}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="p-5 space-y-4 flex-1">
                    {/* Patient & Doctor Info */}
                    <div className="grid grid-cols-2 gap-4 text-xs sm:text-sm">
                      <div className="flex gap-2.5 items-start">
                        <div className="h-7 w-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                          <User className="h-3.5 w-3.5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block">Patient</span>
                          <p className="font-extrabold text-foreground mt-0.5 truncate">{prescription.patient?.name || "N/A"}</p>
                        </div>
                      </div>
                      <div className="flex gap-2.5 items-start">
                        <div className="h-7 w-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                          <Stethoscope className="h-3.5 w-3.5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block">Prescriber</span>
                          <p className="font-extrabold text-foreground mt-0.5 truncate">
                            {prescription.doctor?.name?.startsWith("Dr.") ? prescription.doctor.name : `Dr. ${prescription.doctor?.name || "N/A"}`}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Associated Chief Complaint Summary */}
                    {prescription.medicalRecord?.chiefComplaint && (
                      <div className="space-y-0.5 text-xs sm:text-sm">
                        <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block">Chief Complaint</span>
                        <p className="text-foreground font-semibold line-clamp-1 mt-0.5 leading-relaxed truncate">
                          {prescription.medicalRecord.chiefComplaint}
                        </p>
                      </div>
                    )}

                    {/* Medications Preview */}
                    <div className="space-y-2 pt-2 border-t border-border/5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Prescribed Medicines</span>
                        <Badge variant="secondary" className="text-[10px] font-bold py-0.5 px-2">
                          {medCount} {medCount === 1 ? "Item" : "Items"}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-1.5 pt-0.5">
                        {previewMeds.map((med, idx) => (
                          <Badge key={idx} variant="outline" className="text-[10px] font-medium bg-muted/20 border-border/30">
                            {med.medicineName}
                          </Badge>
                        ))}
                        {remainingCount > 0 && (
                          <Badge variant="outline" className="text-[10px] font-extrabold bg-primary/5 text-primary border-primary/20">
                            +{remainingCount} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="p-5 pt-3 pb-4 border-t border-border/10 bg-muted/10 flex justify-end">
                    <Link to={`/admin/prescriptions/${prescription._id}`}>
                      <Button size="sm" className="gap-1.5 rounded-xl font-bold cursor-pointer">
                        <Eye className="h-3.5 w-3.5" /> View Details
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              )
            })}
          </div>

          <AppointmentPagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            total={pagination.total}
            limit={limit}
            onPageChange={handlePageChange}
            label="prescriptions"
          />
        </div>
      )}
    </div>
  )
}
