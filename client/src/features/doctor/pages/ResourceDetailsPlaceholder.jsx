import { useParams, useNavigate, useLocation } from "react-router-dom"
import { useSelector } from "react-redux"
import { ArrowLeft, FileText, Pill, Beaker, Receipt } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function ResourceDetailsPlaceholder() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  
  // Determine role
  const { user } = useSelector((state) => state.auth)
  const currentRole = user?.role || "patient"

  // Determine type based on current path
  const path = location.pathname
  let type = "Consultation Resource"
  let Icon = FileText

  if (path.includes("medical-records")) {
    type = "Medical Record"
    Icon = FileText
  } else if (path.includes("prescriptions")) {
    type = "Prescription"
    Icon = Pill
  } else if (path.includes("lab-results")) {
    type = "Lab Result"
    Icon = Beaker
  } else if (path.includes("invoices")) {
    type = "Invoice"
    Icon = Receipt
  }

  // Handle go back
  const handleGoBack = () => {
    // If we have an appointmentId in state, go to the appointment details page
    if (location.state?.appointmentId) {
      navigate(`/${currentRole}/appointments/${location.state.appointmentId}`)
    } else {
      // Otherwise, go back in history or dashboard
      navigate(-1)
    }
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto p-4 sm:p-6">
      <Button 
        variant="ghost" 
        onClick={handleGoBack}
        className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-muted-foreground hover:text-primary transition-colors cursor-pointer"
      >
        <ArrowLeft className="h-4 w-4" /> Return to Appointment Workspace
      </Button>

      <Card className="border border-border/40 shadow-xs bg-card overflow-hidden rounded-2xl">
        <CardHeader className="p-6 border-b border-border/10 flex flex-row items-center gap-3 bg-muted/5">
          <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            <Icon className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
              {type} Workspace
            </span>
            <CardTitle className="text-lg font-extrabold text-foreground">
              {type} Details
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="space-y-1.5">
            <span className="text-[10px] text-muted-foreground uppercase font-bold">Resource Reference ID</span>
            <p className="text-sm font-mono text-foreground font-semibold bg-muted/30 p-2.5 rounded-lg border border-border/10 select-all">
              {id}
            </p>
          </div>
          <div className="pt-4 border-t border-dashed border-border/20 space-y-2">
            <h4 className="text-sm font-bold text-foreground">Transition Workspace</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              This is a transition placeholder for the {type}. Full visual viewer and print options will be integrated in subsequent releases.
            </p>
          </div>
        </CardContent>
        <CardFooter className="p-6 pt-3 border-t border-border/10 bg-muted/10 flex justify-end">
          <Button onClick={handleGoBack} className="rounded-xl font-bold cursor-pointer">
            Back to Workspace
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
