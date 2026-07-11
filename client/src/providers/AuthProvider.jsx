import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { authApi } from "../features/auth/api/authApi"
import { setAuth, clearAuth } from "../store/authSlice"

export function AuthProvider({ children }) {
  const dispatch = useDispatch()
  const { isInitialized } = useSelector((state) => state.auth)

  useEffect(() => {
    async function initializeAuth() {
      try {
        const savedRole = localStorage.getItem("userRole")

        if (!savedRole) {
          dispatch(clearAuth())
          return
        }

        const handleAuthFailure = () => {
          localStorage.removeItem("userRole")
          dispatch(clearAuth())
        }

        if (savedRole === "admin") {
          try {
            const profileRes = await authApi.getAdminProfile()
            dispatch(setAuth({ ...profileRes.data, name: "@admin", role: "admin" }))
            return
          } catch (error) {
            handleAuthFailure()
            return
          }
        }

        if (savedRole === "patient") {
          try {
            const profileRes = await authApi.getPatientProfile()
            dispatch(setAuth({ ...profileRes.data, role: "patient" }))
            return
          } catch (error) {
            handleAuthFailure()
            return
          }
        }

        if (savedRole === "doctor") {
          try {
            const profileRes = await authApi.getDoctorProfile()
            dispatch(setAuth({ ...profileRes.data, role: "doctor" }))
            return
          } catch (error) {
            handleAuthFailure()
            return
          }
        }

        handleAuthFailure()
      } catch (err) {
        localStorage.removeItem("userRole")
        dispatch(clearAuth())
      }
    }

    initializeAuth()
  }, [dispatch])

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Initializing session...</p>
        </div>
      </div>
    )
  }

  return children
}