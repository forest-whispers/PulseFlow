import { useState, useEffect } from "react"
import { useDoctorSearch } from "../hooks/useDoctorSearch"
import DoctorFilters from "../components/DoctorFilters"
import DoctorCard from "../components/DoctorCard"
import DoctorPagination from "../components/DoctorPagination"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { AlertTriangle, RotateCcw, Stethoscope, ArrowLeft, SearchX } from "lucide-react"

export default function DoctorSearch() {
  // Filters State
  const [filters, setFilters] = useState({
    specialization: "",
    minFee: "",
    maxFee: "",
    sortBy: "",
    order: "asc",
    page: 1,
  })

  // Search Input States (Direct vs. Debounced)
  const [localSearch, setLocalSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")

  // Debounce effect: update debouncedSearch 500ms after user stops typing
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(localSearch)
      // Reset to first page on search query change
      setFilters((prev) => ({ ...prev, page: 1 }))
    }, 500)

    return () => clearTimeout(handler)
  }, [localSearch])

  // Map state to query parameters
  const queryParams = {
    search: debouncedSearch || undefined,
    specialization: filters.specialization || undefined,
    minFee: filters.minFee || undefined,
    maxFee: filters.maxFee || undefined,
    sortBy: filters.sortBy || undefined,
    order: filters.sortBy ? filters.order : undefined,
    page: filters.page,
    limit: 6, // 6 items per page fits a 3-column card grid beautifully
  }

  const { data, isLoading, isError, error, refetch } = useDoctorSearch(queryParams)

  const handleFilterChange = (key, value) => {
    setFilters((prev) => {
      const nextFilters = { ...prev, [key]: value }
      // Reset to page 1 on filter modifications (except page changes)
      if (key !== "page") {
        nextFilters.page = 1
      }
      return nextFilters
    })
  }

  const handleClearFilters = () => {
    setFilters({
      specialization: "",
      minFee: "",
      maxFee: "",
      sortBy: "",
      order: "asc",
      page: 1,
    })
    setLocalSearch("")
    setDebouncedSearch("")
  }

  const handleRetry = () => {
    refetch()
  }

  const doctorList = data?.data?.doctors || []
  const pagination = data?.data?.pagination || { page: 1, limit: 6, total: 0, totalPages: 0 }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Directory Header */}
      <div className="flex flex-col border-b pb-6 mb-2">
        <div className="flex items-center gap-2 mb-2">
          <Link
            to="/patient/dashboard"
            className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Dashboard
          </Link>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
          <Stethoscope className="h-8 w-8 text-primary" /> Find a Specialist
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Browse expert medical consultants, review specializations, consultation fees, and schedule visits.
        </p>
      </div>

      {/* Filter / Search Panel */}
      <DoctorFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onClear={handleClearFilters}
        localSearch={localSearch}
        setLocalSearch={setLocalSearch}
      />

      {/* Results Viewport */}
      {isLoading ? (
        /* Loading Skeleton Grid */
        <div className="space-y-6">
          <div className="h-6 w-32 bg-muted rounded-md animate-pulse" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-64 bg-muted border rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
      ) : isError ? (
        /* Error reload state */
        <div className="min-h-[40vh] flex flex-col items-center justify-center text-center p-6 space-y-6">
          <div className="h-14 w-14 rounded-full bg-destructive/10 text-destructive flex items-center justify-center">
            <AlertTriangle className="h-7 w-7" />
          </div>
          <div className="space-y-2 max-w-sm">
            <h3 className="font-bold text-lg text-foreground">Directory Search Failed</h3>
            <p className="text-muted-foreground text-xs">
              {error.response?.data?.message || error.message || "Failed to load directory schedule."} Please verify network settings and try again.
            </p>
          </div>
          <Button onClick={handleRetry} className="gap-2 cursor-pointer">
            <RotateCcw className="h-4 w-4" /> Retry Search
          </Button>
        </div>
      ) : doctorList.length === 0 ? (
        /* Empty matching results state */
        <div className="min-h-[40vh] flex flex-col items-center justify-center text-center p-6 space-y-4 max-w-md mx-auto border border-dashed rounded-xl mt-6 bg-card">
          <div className="h-14 w-14 rounded-full bg-muted text-muted-foreground flex items-center justify-center">
            <SearchX className="h-7 w-7" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-lg text-foreground">No Doctors Match</h3>
            <p className="text-muted-foreground text-xs leading-relaxed">
              We couldn't find any specialist matching your parameters. Try broadening your keywords, adjusting fee ranges, or clearing specializations.
            </p>
          </div>
          <Button onClick={handleClearFilters} variant="outline" className="cursor-pointer font-medium mt-2">
            Clear Search & Filters
          </Button>
        </div>
      ) : (
        /* Grid display with Pagination */
        <div className="space-y-6">
          <div className="text-sm font-semibold text-muted-foreground">
            Search Results ({pagination.total} Specialists Found)
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {doctorList.map((doc) => (
              <DoctorCard key={doc._id} doctor={doc} />
            ))}
          </div>

          <DoctorPagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            total={pagination.total}
            limit={pagination.limit}
            onPageChange={(p) => handleFilterChange("page", p)}
          />
        </div>
      )}
    </div>
  )
}
