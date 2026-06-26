import { Label } from "@/components/ui/label"
import { Clock, AlertCircle, Ban } from "lucide-react"

function formatTime12Hour(timeStr) {
  const [hourStr, minStr] = timeStr.split(":")
  const hour = parseInt(hourStr, 10)
  const ampm = hour >= 12 ? "PM" : "AM"
  const hour12 = hour % 12 || 12
  const paddedHour = String(hour12).padStart(2, "0")
  return `${paddedHour}:${minStr} ${ampm}`
}

export default function SlotPicker({
  slots = [],
  isBookable = true,
  blockedReason = "",
  selectedSlot,
  onSlotSelect,
  isLoading = false,
}) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Label className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Clock className="h-4 w-4 text-primary" /> Step 2: Choose Available Slot
        </Label>
        <div className="grid grid-cols-3 gap-3">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-11 bg-muted/60 border border-muted/80 rounded-xl animate-pulse"
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <Label className="text-sm font-semibold text-foreground flex items-center gap-2">
        <Clock className="h-4 w-4 text-primary" /> Step 2: Choose Available Slot
      </Label>

      {!isBookable ? (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive rounded-xl p-4 flex gap-3 items-start shadow-2xs">
          <Ban className="h-5 w-5 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h5 className="font-bold text-sm">Booking Unavailable</h5>
            <p className="text-xs text-destructive/90 leading-relaxed">
              {blockedReason || "The doctor is currently not accepting appointments on this date."}
            </p>
          </div>
        </div>
      ) : slots.length === 0 ? (
        <div className="bg-amber-500/10 border border-amber-500/20 text-amber-600 rounded-xl p-4 flex gap-3 items-start shadow-2xs">
          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h5 className="font-bold text-sm">No Slots Available</h5>
            <p className="text-xs text-amber-600/90 leading-relaxed">
              All consultation slots for this date have been booked or the slots are past. Please choose a different date.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-3">
          {slots.map((slot) => {
            const isSelected = selectedSlot === slot
            return (
              <button
                key={slot}
                type="button"
                onClick={() => onSlotSelect(slot)}
                className={`h-11 rounded-xl border flex items-center justify-center font-semibold text-xs sm:text-sm tracking-wide transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? "bg-primary text-primary-foreground border-primary shadow-xs font-bold scale-102"
                    : "bg-card text-foreground border-border hover:bg-muted/50 hover:border-primary/20"
                }`}
              >
                {formatTime12Hour(slot)}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
