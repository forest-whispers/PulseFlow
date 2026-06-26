import { CalendarX, Trash2, CalendarDays } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function BlockedDatesList({ blockedDates = [], onDeleteClick, onAddClick }) {
  // Sort blocked dates in ascending chronological order
  const sortedDates = [...blockedDates].sort((a, b) => {
    return new Date(a.blockedDate) - new Date(b.blockedDate)
  })

  // Format YYYY-MM-DD safely without timezone shifts
  const formatBlockedDate = (dateStr) => {
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

  // Renders Empty State
  if (sortedDates.length === 0) {
    return (
      <div className="bg-card border border-dashed rounded-xl p-12 text-center flex flex-col items-center justify-center space-y-4 shadow-2xs max-w-lg mx-auto mt-6">
        <div className="h-16 w-16 rounded-full bg-primary/10 text-primary flex items-center justify-center">
          <CalendarDays className="h-8 w-8" />
        </div>
        <div className="space-y-1">
          <h3 className="font-bold text-lg text-foreground">No Blocked Dates</h3>
          <p className="text-muted-foreground text-sm max-w-sm">
            You do not have any calendar exception dates scheduled. You are open for all appointments matching your weekly availability.
          </p>
        </div>
        <Button onClick={onAddClick} className="cursor-pointer font-medium mt-2">
          Block a Date
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
        Blocked Calendar Dates ({sortedDates.length})
      </h3>
      <div className="grid grid-cols-1 gap-4">
        {sortedDates.map((item, index) => (
          <Card
            key={index}
            className="border shadow-2xs hover:shadow-xs transition-all duration-200"
          >
            <CardContent className="p-4 sm:p-5 flex items-center justify-between gap-4">
              <div className="flex items-start sm:items-center gap-4 min-w-0 flex-1">
                {/* Date Badge */}
                <div className="h-12 w-12 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive flex flex-col items-center justify-center shrink-0">
                  <CalendarX className="h-5 w-5" />
                </div>
                
                {/* Date & Reason Info */}
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="text-sm sm:text-base font-bold text-foreground truncate">
                    {formatBlockedDate(item.blockedDate)}
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground leading-relaxed break-words">
                    <span className="font-semibold text-foreground/75 mr-1">Reason:</span>
                    {item.reason || "No reason provided"}
                  </div>
                </div>
              </div>

              {/* Delete Action Trigger */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDeleteClick(item.blockedDate)}
                className="h-9 w-9 text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer shrink-0"
                title={`Delete exception for ${item.blockedDate}`}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
