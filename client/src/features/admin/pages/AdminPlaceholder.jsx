import { useNavigate, useLocation } from "react-router-dom"
import { ArrowLeft, Construction } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AdminPlaceholder() {
  const navigate = useNavigate()
  const location = useLocation()

  // Derive descriptive title from current route path
  const path = location.pathname
  const pageName = path.split("/").pop()
  const title = pageName
    ? pageName.charAt(0).toUpperCase() + pageName.slice(1)
    : "Module Workspace"

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6 space-y-6 max-w-md mx-auto animate-fade-in">
      <div className="h-16 w-16 rounded-full bg-primary/10 text-primary flex items-center justify-center shadow-2xs">
        <Construction className="h-8 w-8" />
      </div>
      <div className="space-y-2">
        <h3 className="text-2xl font-black text-foreground">{title} Workspace</h3>
        <p className="text-muted-foreground text-sm leading-relaxed">
          This administrative module is currently under development. Backend support and operational features will be integrated soon.
        </p>
      </div>
      <div className="flex gap-3 w-full">
        <Button variant="outline" onClick={() => navigate("/admin/dashboard")} className="flex-1 rounded-xl cursor-pointer">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
        </Button>
      </div>
    </div>
  )
}
