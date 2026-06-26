import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { FileText, Loader2, Clipboard } from "lucide-react"

export default function BookingDetailsForm({ onSubmit, isLoading = false }) {
  const [reason, setReason] = useState("")
  const [notes, setNotes] = useState("")
  const [error, setError] = useState("")

  const handleReasonChange = (e) => {
    const val = e.target.value
    setReason(val)
    if (val.trim().length > 0 && val.trim().length < 5) {
      setError("Reason must be at least 5 characters long.")
    } else {
      setError("")
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!reason.trim()) {
      setError("Reason for visit is required.")
      return
    }
    if (reason.trim().length < 5) {
      setError("Reason must be at least 5 characters long.")
      return
    }
    setError("")
    onSubmit({ reason: reason.trim(), notes: notes.trim() })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 pt-4 border-t border-dashed">
      <div className="space-y-4">
        <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <FileText className="h-4 w-4 text-primary" /> Step 3: Enter Appointment Details
        </h4>

        {/* Reason for Visit Field */}
        <div className="space-y-2">
          <Label htmlFor="reason" className="text-xs font-bold text-foreground">
            Reason for Visit <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="reason"
            placeholder="Briefly describe the reason for your visit (e.g., Routine checkup, Follow-up consultation)..."
            value={reason}
            onChange={handleReasonChange}
            disabled={isLoading}
            className={`min-h-[80px] text-sm resize-none rounded-xl focus-visible:ring-1 focus-visible:ring-primary ${
              error ? "border-destructive focus-visible:ring-destructive" : "border-border"
            }`}
          />
          {error && <p className="text-destructive text-xs font-medium">{error}</p>}
        </div>

        {/* Notes (Optional) Field */}
        <div className="space-y-2">
          <Label htmlFor="notes" className="text-xs font-bold text-foreground flex items-center gap-1.5">
            <Clipboard className="h-3.5 w-3.5 text-muted-foreground" /> Additional Notes (Optional)
          </Label>
          <Textarea
            id="notes"
            placeholder="Provide any additional details or background information that might be helpful..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            disabled={isLoading}
            className="min-h-[80px] text-sm resize-none rounded-xl focus-visible:ring-1 focus-visible:ring-primary border-border"
          />
        </div>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isLoading || !reason.trim() || reason.trim().length < 5}
        className="w-full h-11 rounded-xl font-bold tracking-wide transition-all duration-200 cursor-pointer text-sm shadow-xs"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4.5 w-4.5 animate-spin" />
            Booking Appointment...
          </>
        ) : (
          "Confirm Appointment"
        )}
      </Button>
    </form>
  )
}
