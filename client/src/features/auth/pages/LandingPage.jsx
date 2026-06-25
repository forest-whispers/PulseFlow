import { Link } from "react-router-dom"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"

export default function LandingPage() {
  const triggerToast = () => {
    toast.success("Welcome to Hospital Management System!")
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
      <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">
        Hospital Management System
      </h1>
      <p className="text-xl text-muted-foreground max-w-[600px] mb-8">
        Welcome to the patient, doctor, and administrator portals. This is the foundation setup.
      </p>
      <div className="flex gap-4 mb-8">
        <Link to="/login">
          <Button variant="default">Go to Login</Button>
        </Link>
        <Link to="/register">
          <Button variant="outline">Go to Register</Button>
        </Link>
        <Button variant="secondary" onClick={triggerToast}>
          Test Toast
        </Button>
      </div>
      <div className="flex flex-col gap-2 mt-4 text-sm text-muted-foreground border border-dashed rounded-lg p-4">
        <span className="font-semibold text-foreground">Verified Dashboard Routes:</span>
        <Link to="/patient/dashboard" className="underline hover:text-primary">
          /patient/dashboard
        </Link>
        <Link to="/doctor/dashboard" className="underline hover:text-primary">
          /doctor/dashboard
        </Link>
        <Link to="/admin/dashboard" className="underline hover:text-primary">
          /admin/dashboard
        </Link>
      </div>
    </div>
  )
}
