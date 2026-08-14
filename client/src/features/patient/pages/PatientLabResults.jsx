import { useState } from "react"
import { Link } from "react-router-dom"
import { Calendar, User, Beaker, Stethoscope, RefreshCw, AlertCircle, Eye, FileText, Download } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useLabResultsList } from "../hooks/useLabResults"
import AppointmentPagination from "../components/AppointmentPagination"

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

export default function PatientLabResults() {
  const [page, setPage] = useState(1)
  const limit = 10

  const {
    data: listData,
    isLoading,
    isError,
    error,
    refetch,
  } = useLabResultsList({ page, limit })

  const labResults = listData?.data?.labResults || []
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
          <h3 className="text-xl font-bold text-foreground">Failed to Load Lab Results</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {error?.response?.data?.message || error?.message || "We encountered an issue retrieving your lab report history. Please try again."}
          </p>
        </div>
        <Button onClick={() => refetch()} className="w-full gap-2 rounded-xl cursor-pointer">
          <RefreshCw className="h-4 w-4" /> Try Again
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-4 sm:p-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl sm:text-2xl font-extrabold text-foreground">Laboratory Outcomes</h2>
        <p className="text-xs text-muted-foreground">
          View all laboratory diagnosis reports and diagnostic files issued by your doctor.
        </p>
      </div>

      {labResults.length === 0 ? (
        // Empty State
        <Card className="border border-dashed border-border/40 shadow-2xs bg-card p-12 text-center rounded-2xl animate-fade-in">
          <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
            <Beaker className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold text-foreground mb-1.5">No Lab Results</h3>
          <p className="text-xs text-muted-foreground max-w-xs mx-auto leading-relaxed">
            You do not have any clinical lab outcomes or diagnostic files registered yet.
          </p>
        </Card>
      ) : (
        // Grid Listing
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {labResults.map((result) => {
              const filename = result.report?.originalName || "report.pdf"
              
              return (
                <Card 
                  key={result._id} 
                  className="border border-border/40 shadow-2xs bg-card hover:shadow-xs hover:border-primary/20 transition-all duration-300 flex flex-col justify-between overflow-hidden rounded-2xl"
                >
                  <CardHeader className="p-5 pb-3 border-b border-border/10 flex flex-row items-center justify-between gap-4 bg-muted/5">
                    <CardTitle className="text-sm font-bold flex items-center gap-2 text-foreground">
                      <Calendar className="h-4.5 w-4.5 text-primary" />
                      {formatDate(result.createdAt)}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="p-5 space-y-4 flex-1">
                    {/* Test Name & Result Summary */}
                    <div className="space-y-0.5">
                      <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Test Name</span>
                      <p className="text-sm font-extrabold text-foreground leading-snug">
                        {result.testName}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-1">
                      <div className="space-y-0.5">
                        <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Result Summary</span>
                        <p className="text-xs font-semibold text-muted-foreground line-clamp-2 leading-relaxed">
                          {result.resultSummary || "N/A"}
                        </p>
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Consultant</span>
                        <p className="text-xs font-bold text-foreground truncate mt-0.5">
                          {result.doctor?.name?.startsWith("Dr.") ? result.doctor.name : `Dr. ${result.doctor?.name}`}
                        </p>
                      </div>
                    </div>

                    {/* Report file link (concise truncation with tooltip) */}
                    {result.report && (
                      <div className="p-3 border border-border/20 rounded-xl bg-muted/5 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2 min-w-0">
                          <FileText className="h-4 w-4 text-primary shrink-0" />
                          <span 
                            className="text-xs font-medium text-foreground truncate select-all" 
                            title={filename}
                          >
                            {filename}
                          </span>
                        </div>
                        <a
                          href={result.report.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-primary transition-colors shrink-0"
                        >
                          <Download className="h-4 w-4" />
                        </a>
                      </div>
                    )}
                  </CardContent>

                  <CardFooter className="p-5 pt-3 pb-4 border-t border-border/10 bg-muted/10 flex justify-end">
                    <Link to={window.location.pathname.startsWith("/doctor") ? `/doctor/lab-results/${result._id}` : `/patient/lab-results/${result._id}`}>
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
            label="lab results"
          />
        </div>
      )}
    </div>
  )
}
