import { X, AlertTriangle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function DeleteConfirmationDialog({ isOpen, onClose, onConfirm, isLoading, dateString }) {
  if (!isOpen) return null

  // Format YYYY-MM-DD safely
  const formatBlockedDate = (dateStr) => {
    if (!dateStr) return ""
    try {
      const [year, month, day] = dateStr.split("-").map(Number)
      const date = new Date(year, month - 1, day)
      return date.toLocaleDateString(undefined, {
        weekday: "short",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    } catch (e) {
      return dateStr
    }
  }

  // Backdrop overlay click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in"
    >
      <div className="bg-card border rounded-xl shadow-xl w-full max-w-md overflow-hidden flex flex-col animate-scale-up">
        {/* Header */}
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" /> Confirm Deletion
          </h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Are you sure you want to remove the availability exception for:
          </p>
          <div className="p-4 bg-muted/50 rounded-lg border border-border text-center font-bold text-base text-foreground">
            {formatBlockedDate(dateString)}
          </div>
          <p className="text-xs text-destructive font-medium leading-relaxed">
            ⚠️ This will restore your normal availability settings for this date and allow new appointments to be booked.
          </p>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 border-t pt-4 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={onConfirm}
              disabled={isLoading}
              className="cursor-pointer px-5"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-1.5" /> Deleting...
                </>
              ) : (
                "Delete Exception"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
