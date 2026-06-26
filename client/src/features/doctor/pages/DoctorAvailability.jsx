import { useDoctorAvailability } from "../hooks/useDoctorAvailability"
import AvailabilityHeader from "../components/AvailabilityHeader"
import AvailabilityForm from "../components/AvailabilityForm"
import { Button } from "@/components/ui/button"
import { AlertTriangle, RotateCcw } from "lucide-react"

export default function DoctorAvailability() {
  const { data, isLoading, isError, error, refetch, updateAvailability, isUpdating } = useDoctorAvailability()

  // Loading state with customized skeleton screen
  if (isLoading) {
    return (
      <div className="space-y-8 animate-pulse">
        {/* Header Skeleton */}
        <div className="border-b pb-6 mb-8">
          <div className="h-4 w-32 bg-muted rounded-md mb-3" />
          <div className="h-8 w-64 bg-muted rounded-md mb-2" />
          <div className="h-4 w-96 bg-muted rounded-md" />
        </div>

        {/* Form Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Status Switch Card Skeleton */}
          <div className="lg:col-span-1 bg-card border rounded-xl p-6 h-56 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="h-6 w-36 bg-muted rounded-md" />
              <div className="h-16 w-full bg-muted rounded-md" />
            </div>
            <div className="h-8 w-full bg-muted rounded-md" />
          </div>

          {/* Configuration Panel Card Skeleton */}
          <div className="lg:col-span-2 bg-card border rounded-xl p-6 space-y-6">
            {/* Weekdays Row */}
            <div className="space-y-3">
              <div className="h-5 w-44 bg-muted rounded-md" />
              <div className="h-3 w-64 bg-muted rounded-md" />
              <div className="flex gap-2">
                {Array.from({ length: 7 }).map((_, i) => (
                  <div key={i} className="h-11 w-14 bg-muted rounded-lg" />
                ))}
              </div>
            </div>

            {/* Timings row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t pt-6">
              <div className="space-y-2">
                <div className="h-5 w-32 bg-muted rounded-md" />
                <div className="h-10 w-full bg-muted rounded-md" />
              </div>
              <div className="space-y-2">
                <div className="h-5 w-32 bg-muted rounded-md" />
                <div className="h-10 w-full bg-muted rounded-md" />
              </div>
            </div>

            {/* Duration row */}
            <div className="space-y-2 border-t pt-6">
              <div className="h-5 w-40 bg-muted rounded-md" />
              <div className="h-3 w-72 bg-muted rounded-md" />
              <div className="h-10 w-full bg-muted rounded-md" />
            </div>
          </div>
        </div>

        {/* Buttons Row */}
        <div className="flex justify-end gap-3 border-t pt-6">
          <div className="h-10 w-24 bg-muted rounded-md" />
          <div className="h-10 w-36 bg-muted rounded-md" />
        </div>
      </div>
    )
  }

  // Error boundary state with Retry
  if (isError) {
    const errMsg = error.response?.data?.message || error.message || "Failed to load schedule data"
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6 space-y-6 animate-fade-in">
        <div className="h-16 w-16 rounded-full bg-destructive/10 text-destructive flex items-center justify-center">
          <AlertTriangle className="h-8 w-8" />
        </div>
        <div className="space-y-2 max-w-md">
          <h2 className="text-2xl font-bold text-foreground">Schedule Load Failed</h2>
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

  const initialAvailability = data?.data || {}

  const handleFormSubmit = async (formData) => {
    try {
      await updateAvailability(formData)
    } catch (e) {
      // Error notifications are already caught and toasted in the useDoctorAvailability hook
    }
  }

  return (
    <div className="space-y-6">
      {/* Availability Header */}
      <AvailabilityHeader />

      {/* Main Settings Form */}
      <AvailabilityForm
        initialData={initialAvailability}
        onSubmit={handleFormSubmit}
        isLoading={isUpdating}
      />
    </div>
  )
}
