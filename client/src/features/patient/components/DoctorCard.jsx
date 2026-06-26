import { useNavigate } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Award, IndianRupee, MapPin, Stethoscope, ArrowRight } from "lucide-react"

export default function DoctorCard({ doctor }) {
  const navigate = useNavigate()

  const doctorId = doctor.user?._id || doctor._id
  const name = doctor.user?.name || "Medical Specialist"
  const specialization = doctor.specialization || "General Medicine"
  const experience = doctor.experience || 0
  const fee = doctor.consultationFee || 0
  const address = doctor.clinicAddress || "Clinic Address Unavailable"
  const imageUrl = doctor.profilePicture?.url

  // Parse initials for the placeholder avatar
  const getInitials = (nameStr) => {
    return nameStr
      .replace(/^Dr\.\s+/i, "") // strip "Dr." prefix
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase()
  }

  return (
    <Card className="group border shadow-2xs hover:shadow-md hover:border-primary/20 transition-all duration-300 flex flex-col justify-between overflow-hidden bg-card">
      <CardContent className="p-5 flex flex-col h-full gap-5">
        {/* Header: Photo and Name */}
        <div className="flex gap-4 items-start">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={name}
              className="h-16 w-16 rounded-xl object-cover shrink-0 border bg-muted"
            />
          ) : (
            <div className="h-16 w-16 rounded-xl bg-primary/10 border border-primary/5 text-primary font-bold text-xl flex items-center justify-center shrink-0 tracking-wider">
              {getInitials(name)}
            </div>
          )}
          
          <div className="space-y-1.5 min-w-0">
            <Badge className="bg-primary/5 hover:bg-primary/10 text-primary border-primary/10 px-2 py-0.5 rounded-md font-medium text-xs">
              {specialization}
            </Badge>
            <h3 className="font-extrabold text-base text-foreground leading-snug group-hover:text-primary transition-colors truncate">
              {name.startsWith("Dr.") ? name : `Dr. ${name}`}
            </h3>
          </div>
        </div>

        {/* Details Metrics */}
        <div className="space-y-2.5 text-sm pt-1 flex-1">
          {/* Experience */}
          <div className="flex items-center gap-2.5 text-muted-foreground">
            <Award className="h-4.5 w-4.5 text-primary/70 shrink-0" />
            <span className="text-foreground/80 font-medium">{experience} Years Experience</span>
          </div>

          {/* Consultation Fee */}
          <div className="flex items-center gap-2.5 text-muted-foreground">
            <IndianRupee className="h-4.5 w-4.5 text-primary/70 shrink-0" />
            <span className="text-foreground/80 font-semibold">₹{fee} Consultation Fee</span>
          </div>

          {/* Clinic Address */}
          <div className="flex items-start gap-2.5 text-muted-foreground pt-1.5 border-t border-dashed">
            <MapPin className="h-4.5 w-4.5 text-primary/70 shrink-0 mt-0.5" />
            <span className="text-xs text-muted-foreground leading-relaxed truncate-2-lines">
              {address}
            </span>
          </div>
        </div>

        {/* Action Button */}
        <Button
          onClick={() => navigate(`/patient/doctors/${doctorId}`)}
          className="w-full gap-2 cursor-pointer mt-2"
        >
          View Profile <ArrowRight className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  )
}
