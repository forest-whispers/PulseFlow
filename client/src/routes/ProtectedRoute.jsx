import { useSelector } from "react-redux"
import { Navigate } from "react-router-dom"

export default function ProtectedRoute({ allowedRoles, children }) {
  const { isAuthenticated, isInitialized, user } = useSelector((state) => state.auth)

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Verifying session...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  const userRole = user?.role

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    // Redirect to their own dashboard
    if (userRole === "patient") {
      return <Navigate to="/patient/dashboard" replace />
    } else if (userRole === "doctor") {
      return <Navigate to="/doctor/dashboard" replace />
    } else if (userRole === "admin") {
      return <Navigate to="/admin/dashboard" replace />
    } else {
      return <Navigate to="/login" replace />
    }
  }

  return children
}
