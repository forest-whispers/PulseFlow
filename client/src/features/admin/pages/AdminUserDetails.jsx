import { useParams, useNavigate, useLocation } from "react-router-dom"
import {
  ArrowLeft,
  User,
  Mail,
  Calendar,
  Sparkles,
  Stethoscope,
  Clock,
  Heart,
  BadgeAlert,
  Shield,
  Briefcase,
  Activity,
  Phone,
  AlertTriangle,
  RefreshCw,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useUserDetails } from "../hooks/useUsers"

export default function AdminUserDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()

  const { data, isLoading, isError, error, refetch } = useUserDetails(id)

  const handleBackNavigation = () => {
    const fromParams = location.state?.fromParams
    if (fromParams) {
      navigate(`/admin/users?${fromParams}`)
    } else {
      navigate("/admin/users")
    }
  }

  // Loading skeleton state
  if (isLoading) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto p-4 sm:p-6 animate-pulse">
        <div className="h-5 w-40 bg-muted/65 rounded-md" />
        <Card className="border rounded-2xl h-[360px]" />
      </div>
    )
  }

  // Error retry state
  if (isError) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-center p-6 space-y-4 max-w-md mx-auto animate-fade-in">
        <div className="h-14 w-14 rounded-full bg-destructive/10 text-destructive flex items-center justify-center shadow-2xs">
          <AlertTriangle className="h-7 w-7" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-foreground">Failed to Load Profile</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {error?.response?.data?.message || error?.message || "We encountered an issue retrieving the profile records. Please try again."}
          </p>
        </div>
        <div className="flex gap-3 w-full">
          <Button variant="outline" onClick={handleBackNavigation} className="flex-1 rounded-xl cursor-pointer">
            Back to List
          </Button>
          <Button onClick={() => refetch()} className="flex-1 gap-2 rounded-xl cursor-pointer">
            <RefreshCw className="h-4 w-4" /> Try Again
          </Button>
        </div>
      </div>
    )
  }

  const userDetails = data?.data || {}
  const account = userDetails.account || {}
  const profile = userDetails.profile || {}

  const isDoc = account.role === "doctor"

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-4 sm:p-6 animate-fade-in">
      {/* Return Back Button */}
      <Button
        variant="ghost"
        onClick={handleBackNavigation}
        className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-muted-foreground hover:text-primary transition-colors cursor-pointer"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Users list
      </Button>

      {/* Main workspace details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Account Info Profile Panel */}
        <Card className="border border-border/40 shadow-2xs bg-card overflow-hidden rounded-2xl md:col-span-1 h-fit">
          <CardHeader className="p-6 border-b border-border/10 flex flex-col items-center justify-center text-center bg-muted/5 gap-3">
            <div className="h-16 w-16 rounded-full bg-primary/10 text-primary flex items-center justify-center border border-primary/20 shadow-xs">
              {isDoc ? <Stethoscope className="h-8 w-8" /> : <User className="h-8 w-8" />}
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-extrabold text-foreground leading-tight truncate max-w-[200px]">
                {account.name}
              </h3>
              <Badge
                className={
                  isDoc
                    ? "bg-blue-500/10 text-blue-600 border-blue-200/35 font-bold text-[10px] rounded-md shadow-2xs"
                    : "bg-indigo-500/10 text-indigo-600 border-indigo-200/35 font-bold text-[10px] rounded-md shadow-2xs"
                }
              >
                {account.role?.toUpperCase()}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-4.5 text-xs sm:text-sm">
            <div className="flex gap-2.5 items-start">
              <Mail className="h-4.5 w-4.5 text-muted-foreground shrink-0 mt-0.5" />
              <div className="min-w-0">
                <span className="text-[9px] uppercase font-bold text-muted-foreground tracking-wider block">Email Address</span>
                <p className="font-semibold text-foreground select-all truncate mt-0.5">{account.email}</p>
              </div>
            </div>

            <div className="flex gap-2.5 items-start border-t border-dashed border-border/10 pt-4">
              <Calendar className="h-4.5 w-4.5 text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <span className="text-[9px] uppercase font-bold text-muted-foreground tracking-wider block">Age & Gender</span>
                <p className="font-semibold text-foreground mt-0.5">
                  {account.age ? `${account.age} Years old` : "Age: N/A"} • <span className="capitalize">{account.gender || "Gender: N/A"}</span>
                </p>
              </div>
            </div>

            <div className="flex gap-2.5 items-start border-t border-dashed border-border/10 pt-4">
              <Shield className="h-4.5 w-4.5 text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <span className="text-[9px] uppercase font-bold text-muted-foreground tracking-wider block">Account ID Reference</span>
                <p className="font-mono text-[10px] text-muted-foreground select-all mt-0.5 truncate max-w-[170px]">{account._id}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Conditional profile panel details */}
        <Card className="border border-border/40 shadow-2xs bg-card overflow-hidden rounded-2xl md:col-span-2">
          <CardHeader className="p-6 border-b border-border/10 bg-muted/5 flex flex-col gap-1">
            <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
              {isDoc ? "Specialist Profile Details" : "Clinical Medical Details"}
            </span>
            <CardTitle className="text-lg sm:text-xl font-extrabold text-foreground flex items-center gap-2">
              {isDoc ? <Briefcase className="h-5 w-5 text-primary" /> : <Activity className="h-5 w-5 text-primary" />}
              {isDoc ? "Professional Information" : "Medical Information"}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {isDoc ? (
              // Doctor Specific Professional Details
              <div className="space-y-6 text-xs sm:text-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block">Area of Specialization</span>
                    <p className="font-extrabold text-foreground mt-1 truncate">{profile.specialization || "N/A"}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block">Clinical Experience</span>
                    <p className="font-semibold text-foreground mt-1">
                      {profile.experience ? `${profile.experience} Years Active` : "N/A"}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block">Consultation Fee</span>
                    <p className="font-extrabold text-primary text-base mt-1">
                      {profile.consultationFee ? `₹${profile.consultationFee}` : "Free Consultation / N/A"}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-dashed border-border/10">
                  <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block">Clinic Operations Address</span>
                  <p className="font-medium text-foreground leading-relaxed mt-1.5 whitespace-pre-wrap">
                    {profile.clinicAddress || "No operating address registered."}
                  </p>
                </div>

                <div className="pt-4 border-t border-dashed border-border/10">
                  <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block">Professional Biography</span>
                  <p className="text-muted-foreground leading-relaxed mt-1.5 whitespace-pre-wrap">
                    {profile.bio || "No professional summary logged."}
                  </p>
                </div>
              </div>
            ) : (
              // Patient Specific Medical Details
              <div className="space-y-6 text-xs sm:text-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex gap-2.5 items-start">
                    <Heart className="h-4.5 w-4.5 text-rose-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block">Blood Group Type</span>
                      <p className="font-extrabold text-foreground mt-1 text-base uppercase">{profile.bloodGroup || "N/A"}</p>
                    </div>
                  </div>
                  <div className="flex gap-2.5 items-start">
                    <Phone className="h-4.5 w-4.5 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block">Emergency Contact</span>
                      <p className="font-semibold text-foreground mt-1 select-all">{profile.emergencyContact || "N/A"}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-dashed border-border/10 flex gap-2.5 items-start">
                  <BadgeAlert className="h-4.5 w-4.5 text-amber-500 shrink-0 mt-0.5" />
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block">Allergies Registry</span>
                    {profile.allergies && profile.allergies.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {profile.allergies.map((allergy, index) => (
                          <Badge key={index} variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-200/35 font-semibold text-xs px-2.5 py-0.5 rounded-md">
                            {allergy}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground mt-1">No known clinical allergies registered.</p>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-dashed border-border/10 flex gap-2.5 items-start">
                  <Sparkles className="h-4.5 w-4.5 text-blue-500 shrink-0 mt-0.5" />
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block">Chronic Medical History Summary</span>
                    <p className="text-muted-foreground leading-relaxed mt-1.5 whitespace-pre-wrap">
                      {profile.medicalHistory || "No chronical illness records exist."}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
