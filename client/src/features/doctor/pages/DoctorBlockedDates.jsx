import { useState } from "react"
import { useDoctorBlockedDates } from "../hooks/useDoctorBlockedDates"
import BlockedDatesHeader from "../components/BlockedDatesHeader"
import BlockedDatesList from "../components/BlockedDatesList"
import BlockedDateDialog from "../components/BlockedDateDialog"
import DeleteConfirmationDialog from "../components/DeleteConfirmationDialog"
import { Button } from "@/components/ui/button"
import { AlertCircle, AlertTriangle, RotateCcw } from "lucide-react"

export default function DoctorBlockedDates() {
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    addBlockedDate,
    isAdding,
    deleteBlockedDate,
    isDeleting,
  } = useDoctorBlockedDates()

  // Modal open/close and context states
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedDateToDelete, setSelectedDateToDelete] = useState("")
  const [serverError, setServerError] = useState("")

  // Skeleton screen loading state
  if (isLoading) {
    return (
      <div className="space-y-8 animate-pulse">
        {/* Info Banner Skeleton */}
        <div className="h-16 bg-muted rounded-xl border" />

        {/* Header Skeleton */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b pb-6 mb-8">
          <div className="space-y-2">
            <div className="h-4 w-32 bg-muted rounded-md mb-2" />
            <div className="h-8 w-64 bg-muted rounded-md mb-1" />
            <div className="h-4 w-96 bg-muted rounded-md" />
          </div>
          <div className="h-10 w-44 bg-muted rounded-md shrink-0 md:self-end" />
        </div>

        {/* List items Skeletons */}
        <div className="space-y-4">
          <div className="h-6 w-48 bg-muted rounded-md" />
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-20 bg-muted border rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  // Error Reload State
  if (isError) {
    const errMsg = error.response?.data?.message || error.message || "Failed to load exceptions data"
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6 space-y-6 animate-fade-in">
        <div className="h-16 w-16 rounded-full bg-destructive/10 text-destructive flex items-center justify-center">
          <AlertTriangle className="h-8 w-8" />
        </div>
        <div className="space-y-2 max-w-md">
          <h2 className="text-2xl font-bold text-foreground">Exceptions Load Failed</h2>
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

  const blockedDatesArray = data?.data?.blockedDates || []

  // Add submission handler
  const handleAddSubmit = async (formData) => {
    setServerError("")
    try {
      await addBlockedDate(formData)
      setIsAddOpen(false)
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || "Failed to add exception"
      setServerError(errMsg)
    }
  }

  // Delete click trigger
  const handleDeleteClick = (dateStr) => {
    setSelectedDateToDelete(dateStr)
    setIsDeleteOpen(true)
  }

  // Delete submission handler
  const handleDeleteConfirm = async () => {
    try {
      await deleteBlockedDate(selectedDateToDelete)
      setIsDeleteOpen(false)
      setSelectedDateToDelete("")
    } catch (err) {
      // Caught and toast feedback handled inside hook
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Information Banner */}
      <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/30 rounded-xl text-blue-800 dark:text-blue-300 text-sm leading-relaxed font-medium">
        <AlertCircle className="h-5 w-5 shrink-0 text-blue-600 dark:text-blue-500 mt-0.5" />
        <div>
          <strong>Schedule Override:</strong> Setting blocked dates overrides your normal weekly availability settings. Any bookings requested on blocked dates will be rejected, and patients holding existing appointments on these dates will receive notifications to reschedule.
        </div>
      </div>

      {/* Header and Controls */}
      <BlockedDatesHeader onAddClick={() => setIsAddOpen(true)} />

      {/* Blocked Dates List */}
      <BlockedDatesList
        blockedDates={blockedDatesArray}
        onDeleteClick={handleDeleteClick}
        onAddClick={() => setIsAddOpen(true)}
      />

      {/* Add Dialog Modal */}
      <BlockedDateDialog
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSubmit={handleAddSubmit}
        isLoading={isAdding}
        serverError={serverError}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false)
          setSelectedDateToDelete("")
        }}
        onConfirm={handleDeleteConfirm}
        isLoading={isDeleting}
        dateString={selectedDateToDelete}
      />
    </div>
  )
}
