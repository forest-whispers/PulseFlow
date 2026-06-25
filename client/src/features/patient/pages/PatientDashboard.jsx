import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"

export default function PatientDashboard() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold tracking-tight mb-2">Patient Dashboard</h1>
      <p className="text-muted-foreground mb-6">
        Welcome to the Patient Portal. This dashboard is currently a placeholder for routing verification.
      </p>
      <div className="flex gap-4">
        <Link to="/">
          <Button variant="outline">Back to Home</Button>
        </Link>
      </div>
    </div>
  )
}
