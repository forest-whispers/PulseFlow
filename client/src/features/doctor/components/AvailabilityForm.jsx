import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Calendar, Clock, Settings, Save, RotateCcw, Loader2, AlertTriangle, Check } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

// Define client-side validation schema with time refinement
const availabilityFormSchema = z.object({
  availableDays: z.array(z.string()).min(1, "Please select at least one available day."),
  startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid start time format"),
  endTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid end time format"),
  slotDuration: z.coerce.number().min(5, "Slot duration must be at least 5 minutes"),
  isActive: z.boolean(),
}).refine((data) => {
  const [startH, startM] = data.startTime.split(":").map(Number)
  const [endH, endM] = data.endTime.split(":").map(Number)
  const startMinutes = startH * 60 + startM
  const endMinutes = endH * 60 + endM
  return endMinutes > startMinutes
}, {
  message: "End time must be later than start time",
  path: ["endTime"],
})

const DAYS_OF_WEEK = [
  { id: "monday", label: "Mon", fullName: "Monday" },
  { id: "tuesday", label: "Tue", fullName: "Tuesday" },
  { id: "wednesday", label: "Wed", fullName: "Wednesday" },
  { id: "thursday", label: "Thu", fullName: "Thursday" },
  { id: "friday", label: "Fri", fullName: "Friday" },
  { id: "saturday", label: "Sat", fullName: "Saturday" },
  { id: "sunday", label: "Sun", fullName: "Sunday" },
]

export default function AvailabilityForm({ initialData, onSubmit, isLoading }) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { isDirty, errors, isValid },
  } = useForm({
    resolver: zodResolver(availabilityFormSchema),
    defaultValues: {
      availableDays: initialData.availableDays || [],
      startTime: initialData.startTime || "09:00",
      endTime: initialData.endTime || "17:00",
      slotDuration: initialData.slotDuration || 30,
      isActive: initialData.isActive ?? false,
    },
    mode: "onChange",
  })

  // Keep form values in sync if initialData changes (e.g. after a successful mutation/refetch)
  useEffect(() => {
    reset({
      availableDays: initialData.availableDays || [],
      startTime: initialData.startTime || "09:00",
      endTime: initialData.endTime || "17:00",
      slotDuration: initialData.slotDuration || 30,
      isActive: initialData.isActive ?? false,
    })
  }, [initialData, reset])

  const watchedDays = watch("availableDays") || []
  const watchedIsActive = watch("isActive")

  const toggleDay = (dayId) => {
    const newDays = watchedDays.includes(dayId)
      ? watchedDays.filter((d) => d !== dayId)
      : [...watchedDays, dayId]
    setValue("availableDays", newDays, { shouldDirty: true, shouldValidate: true })
  }

  const handleReset = () => {
    reset()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Unsaved Changes Banner */}
      {isDirty && (
        <div className="flex items-center gap-3 p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30 rounded-xl text-amber-800 dark:text-amber-300 animate-fade-in text-sm font-medium">
          <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-500" />
          <div className="flex-1">
            You have unsaved schedule changes. Click "Save Changes" below to apply.
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Status Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-card border rounded-xl p-6 shadow-xs flex flex-col justify-between h-full min-h-[220px]">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Settings className="h-5 w-5 text-primary" />
                <h3 className="font-bold text-lg text-foreground">Booking Status</h3>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                Enable this status to allow patients to discover and book appointments with you. If disabled, you will be hidden from searches.
              </p>
            </div>
            
            <div className="flex items-center justify-between border-t pt-4">
              <span className="text-sm font-semibold text-foreground">
                {watchedIsActive ? "Accepting Appointments" : "Booking Paused"}
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={watchedIsActive}
                  onChange={(e) => setValue("isActive", e.target.checked, { shouldDirty: true })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-muted after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Configuration Panel */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card border rounded-xl p-6 shadow-xs space-y-6">
            {/* Weekday Selector */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" /> Available Working Days
              </Label>
              <p className="text-muted-foreground text-xs">
                Select the weekdays you are open for bookings.
              </p>
              
              <div className="flex flex-wrap gap-2 pt-1">
                {DAYS_OF_WEEK.map((day) => {
                  const isSelected = watchedDays.includes(day.id)
                  return (
                    <button
                      key={day.id}
                      type="button"
                      onClick={() => toggleDay(day.id)}
                      className={`h-11 px-4 rounded-lg text-xs font-semibold tracking-wider uppercase border transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                        isSelected
                          ? "bg-primary text-primary-foreground border-primary shadow-xs font-bold"
                          : "bg-background text-muted-foreground border-border hover:bg-muted/50 hover:text-foreground"
                      }`}
                    >
                      {isSelected && <Check className="h-3 w-3" />}
                      {day.label}
                    </button>
                  )
                })}
              </div>
              {errors.availableDays && (
                <p className="text-xs text-destructive font-medium animate-shake">
                  {errors.availableDays.message}
                </p>
              )}
            </div>

            {/* Shift Timings Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t pt-6">
              <div className="space-y-2">
                <Label htmlFor="startTime" className="text-sm font-semibold flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" /> Shift Start Time
                </Label>
                <Input
                  id="startTime"
                  type="time"
                  name="startTime"
                  {...register("startTime")}
                  className="h-10"
                />
                {errors.startTime && (
                  <p className="text-xs text-destructive font-medium">{errors.startTime.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="endTime" className="text-sm font-semibold flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" /> Shift End Time
                </Label>
                <Input
                  id="endTime"
                  type="time"
                  name="endTime"
                  {...register("endTime")}
                  className="h-10"
                />
                {errors.endTime && (
                  <p className="text-xs text-destructive font-medium">{errors.endTime.message}</p>
                )}
              </div>
            </div>

            {/* Session Duration Selector */}
            <div className="space-y-2 border-t pt-6">
              <Label htmlFor="slotDuration" className="text-sm font-semibold flex items-center gap-2">
                <Settings className="h-4 w-4 text-primary" /> Appointment Slot Duration
              </Label>
              <p className="text-muted-foreground text-xs">
                Select the duration allocated for each patient appointment.
              </p>
              <select
                id="slotDuration"
                name="slotDuration"
                {...register("slotDuration", { valueAsNumber: true })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1 cursor-pointer"
              >
                <option value={15}>15 Minutes</option>
                <option value={20}>20 Minutes</option>
                <option value={30}>30 Minutes</option>
                <option value={45}>45 Minutes</option>
                <option value={60}>60 Minutes</option>
              </select>
              {errors.slotDuration && (
                <p className="text-xs text-destructive font-medium">{errors.slotDuration.message}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Form Submission Actions Row */}
      <div className="flex items-center justify-end gap-3 border-t pt-6 mt-6">
        <Button
          type="button"
          variant="outline"
          onClick={handleReset}
          disabled={!isDirty || isLoading}
          className="gap-2 cursor-pointer"
        >
          <RotateCcw className="h-4 w-4" /> Reset
        </Button>
        
        <Button
          type="submit"
          disabled={!isDirty || !isValid || isLoading}
          className="gap-2 px-6 cursor-pointer"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Saving Changes...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" /> Save Changes
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
