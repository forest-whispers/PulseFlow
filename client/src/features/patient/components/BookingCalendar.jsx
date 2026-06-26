import { useEffect, useRef } from "react"
import { Calendar } from "lucide-react"
import { Label } from "@/components/ui/label"

export default function BookingCalendar({ availableDays = [], selectedDate, onDateSelect }) {
  // Generate next 14 days starting from today
  const generateDates = () => {
    const dates = []
    const today = new Date()
    for (let i = 0; i < 14; i++) {
      const nextDate = new Date(today)
      nextDate.setDate(today.getDate() + i)
      const dayName = nextDate.toLocaleDateString("en-US", { weekday: "long" }).toLowerCase()
      
      const year = nextDate.getFullYear()
      const month = String(nextDate.getMonth() + 1).padStart(2, "0")
      const day = String(nextDate.getDate()).padStart(2, "0")
      const dateStr = `${year}-${month}-${day}`
      
      dates.push({
        dateStr,
        dayName,
        labelDay: nextDate.toLocaleDateString("en-US", { weekday: "short" }),
        labelDate: nextDate.getDate(),
        isAvailable: availableDays.includes(dayName),
      })
    }
    return dates
  }

  const calendarDates = generateDates()
  const scrollRef = useRef(null)

  return (
    <div className="space-y-3">
      <Label className="text-sm font-semibold text-foreground flex items-center gap-2">
        <Calendar className="h-4 w-4 text-primary" /> Step 1: Select Consultation Date
      </Label>
      <p className="text-muted-foreground text-xs leading-relaxed">
        Choose a date from the doctor's active business days below.
      </p>

      {/* Horizontal Scroll Row */}
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto pb-3 pt-1 scrollbar-thin scrollbar-thumb-muted-foreground/10"
      >
        {calendarDates.map((item) => {
          const isSelected = selectedDate === item.dateStr
          const canBook = item.isAvailable

          return (
            <button
              key={item.dateStr}
              type="button"
              disabled={!canBook}
              onClick={() => onDateSelect(item.dateStr)}
              className={`h-20 w-16 sm:h-22 sm:w-18 rounded-xl border flex flex-col items-center justify-center shrink-0 transition-all duration-200 ${
                isSelected
                  ? "bg-primary text-primary-foreground border-primary shadow-xs font-bold scale-102"
                  : canBook
                  ? "bg-card text-foreground border-border hover:bg-muted/50 hover:border-primary/20 cursor-pointer"
                  : "bg-muted/15 text-muted-foreground/50 border-muted-foreground/10 border-dashed cursor-not-allowed opacity-45"
              }`}
            >
              <span className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider ${isSelected ? "text-primary-foreground/90" : "text-muted-foreground"}`}>
                {item.labelDay}
              </span>
              <span className="text-xl sm:text-2xl font-extrabold mt-1">
                {item.labelDate}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
