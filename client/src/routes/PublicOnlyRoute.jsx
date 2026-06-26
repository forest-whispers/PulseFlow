import { useSelector } from "react-redux"
import { Navigate } from "react-router-dom"

export default function PublicOnlyRoute({ children }) {
  const { isAuthenticated, isInitialized, user } = useSelector((state) => state.auth)

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (isAuthenticated) {
    const userRole = user?.role
    if (userRole === "patient") {
      return <Navigate to="/patient/dashboard" replace />
    } else if (userRole === "doctor") {
      return <Navigate to="/doctor/dashboard" replace />
    } else if (userRole === "admin") {
      return <Navigate to="/admin/dashboard" replace />
    }
  }

  return children
}
