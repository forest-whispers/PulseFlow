import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Award, IndianRupee, MapPin, Stethoscope, Clock, FileText, CalendarDays } from "lucide-react"

const WEEKDAYS = [
  { id: "monday", label: "Mon" },
  { id: "tuesday", label: "Tue" },
  { id: "wednesday", label: "Wed" },
  { id: "thursday", label: "Thu" },
  { id: "friday", label: "Fri" },
  { id: "saturday", label: "Sat" },
  { id: "sunday", label: "Sun" },
]

export default function DoctorProfileCard({ doctor = {}, availability = {} }) {
  const name = doctor.user?.name || "Medical Specialist"
  const specialization = doctor.specialization || "General Medicine"
  const experience = doctor.experience || 0
  const fee = doctor.consultationFee || 0
  const address = doctor.clinicAddress || "Clinic Address Unavailable"
  const bio = doctor.bio || "No professional biography provided yet."
  const imageUrl = doctor.profilePicture?.url
  const availableDays = availability.availableDays || []
  const slotDuration = availability.slotDuration || 30

  const getInitials = (nameStr) => {
    return nameStr
      .replace(/^Dr\.\s+/i, "")
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase()
  }

  return (
    <Card className="border shadow-2xs bg-card overflow-hidden">
      <CardContent className="p-6 sm:p-8 space-y-6">
        {/* Profile Card Header */}
        <div className="flex flex-col sm:flex-row gap-5 items-start">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={name}
              className="h-20 w-20 sm:h-24 sm:w-24 rounded-2xl object-cover shrink-0 border bg-muted shadow-2xs"
            />
          ) : (
            <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-2xl bg-primary/10 border border-primary/5 text-primary font-bold text-2xl flex items-center justify-center shrink-0 tracking-wider shadow-2xs">
              {getInitials(name)}
            </div>
          )}

          <div className="space-y-2 min-w-0">
            <Badge className="bg-primary/5 hover:bg-primary/10 text-primary border-primary/10 px-3 py-0.5 rounded-md font-medium text-xs">
              {specialization}
            </Badge>
            <h2 className="text-xl sm:text-2xl font-extrabold text-foreground leading-tight">
              {name.startsWith("Dr.") ? name : `Dr. ${name}`}
            </h2>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5 shrink-0">
                <Award className="h-4 w-4 text-primary/70" />
                <span className="text-foreground/80 font-medium">{experience} Years Experience</span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <IndianRupee className="h-4 w-4 text-primary/70" />
                <span className="text-foreground/80 font-semibold">₹{fee} Consultation</span>
              </div>
            </div>
          </div>
        </div>

        {/* Address and Bio Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-dashed">
          {/* Professional Bio */}
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" /> Professional Bio
            </h4>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed pr-2">
              {bio}
            </p>
          </div>

          {/* Location details */}
          <div className="space-y-4">
            <div className="space-y-2">
              <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" /> Consultation Address
              </h4>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {address}
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/30 p-2.5 rounded-lg border w-fit">
              <Clock className="h-3.5 w-3.5 text-primary shrink-0" />
              <span>Consultation slot intervals: <span className="font-semibold text-foreground">{slotDuration} mins</span></span>
            </div>
          </div>
        </div>

        {/* Availability Calendar Days Summary */}
        <div className="pt-6 border-t border-dashed space-y-3">
          <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-primary" /> Doctor's Business Days
          </h4>
          <div className="flex flex-wrap gap-2">
            {WEEKDAYS.map((day) => {
              const isAvailable = availableDays.includes(day.id)
              return (
                <div
                  key={day.id}
                  className={`h-9 px-3 rounded-lg text-xs font-semibold uppercase tracking-wider border flex items-center justify-center transition-all ${
                    isAvailable
                      ? "bg-emerald-500/10 text-emerald-600 border-emerald-200/35 font-bold"
                      : "bg-background text-muted-foreground border-border opacity-50"
                  }`}
                >
                  {day.label}
                </div>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
