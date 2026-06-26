import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { X, Calendar, FileText, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

const blockedDateSchema = z.object({
  blockedDate: z.string().min(1, "Please select a date to block."),
  reason: z.string().trim().min(1, "Please provide a reason for blocking this date."),
})

export default function BlockedDateDialog({ isOpen, onClose, onSubmit, isLoading, serverError }) {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(blockedDateSchema),
    defaultValues: {
      blockedDate: "",
      reason: "",
    },
  })

  // Reset form inputs when dialog is closed/opened
  useEffect(() => {
    if (isOpen) {
      reset({
        blockedDate: "",
        reason: "",
      })
    }
  }, [isOpen, reset])

  // Map server-side validation error to fields if available
  useEffect(() => {
    if (serverError) {
      if (serverError.toLowerCase().includes("date")) {
        setError("blockedDate", { type: "server", message: serverError })
      } else if (serverError.toLowerCase().includes("reason")) {
        setError("reason", { type: "server", message: serverError })
      }
    }
  }, [serverError, setError])

  if (!isOpen) return null

  // Close only if clicking the exact backdrop overlay
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
        {/* Dialog Header */}
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" /> Block a Date
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

        {/* Dialog Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          {/* Date Picker Input */}
          <div className="space-y-2">
            <Label htmlFor="blockedDate" className="text-sm font-semibold flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" /> Select Date
            </Label>
            <Input
              id="blockedDate"
              type="date"
              name="blockedDate"
              {...register("blockedDate")}
              className="w-full cursor-pointer h-10"
            />
            {errors.blockedDate && (
              <p className="text-xs text-destructive font-medium animate-shake">
                {errors.blockedDate.message}
              </p>
            )}
          </div>

          {/* Reason Input */}
          <div className="space-y-2">
            <Label htmlFor="reason" className="text-sm font-semibold flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" /> Reason for Absence
            </Label>
            <textarea
              id="reason"
              name="reason"
              {...register("reason")}
              placeholder="e.g. Attending conference, Personal leave, Vacation..."
              rows={3}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
            />
            {errors.reason && (
              <p className="text-xs text-destructive font-medium animate-shake">
                {errors.reason.message}
              </p>
            )}
          </div>

          {/* Form Actions Footer */}
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
              type="submit"
              disabled={isLoading}
              className="cursor-pointer px-5"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-1.5" /> Adding...
                </>
              ) : (
                "Add Blocked Date"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
