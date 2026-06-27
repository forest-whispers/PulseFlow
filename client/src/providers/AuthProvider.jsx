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

        if (savedRole === "admin") {
          dispatch(setAuth({ name: "Admin User", role: "admin" }))
          return
        }

        if (savedRole === "patient") {
          try {
            const profileRes = await authApi.getPatientProfile()
            dispatch(setAuth({ ...profileRes.data, role: "patient" }))
            return
          } catch (error) {
            const status = error.response?.status
            const errMsg = error.response?.data?.message
            if (status === 401 || errMsg === "Login required to access this resource") {
              dispatch(clearAuth())
              return
            }
          }
        }

        if (savedRole === "doctor") {
          try {
            const profileRes = await authApi.getDoctorProfile()
            dispatch(setAuth({ ...profileRes.data, role: "doctor" }))
            return
          } catch (error) {
            const status = error.response?.status
            const errMsg = error.response?.data?.message
            if (status === 401 || errMsg === "Login required to access this resource") {
              dispatch(clearAuth())
              return
            }
          }
        }

        let isLoginRequired = false

        // 1. Try to fetch patient profile
        try {
          const profileRes = await authApi.getPatientProfile()
          dispatch(setAuth({ ...profileRes.data, role: "patient" }))
          return
        } catch (error) {
          const status = error.response?.status
          const errMsg = error.response?.data?.message
          if (status === 401 || errMsg === "Login required to access this resource") {
            isLoginRequired = true
          }
        }

        // 2. Try to fetch doctor profile if authenticated (neither expired cookie nor missing session)
        if (!isLoginRequired) {
          try {
            const profileRes = await authApi.getDoctorProfile()
            dispatch(setAuth({ ...profileRes.data, role: "doctor" }))
            return
          } catch (error) {
            const status = error.response?.status
            const errMsg = error.response?.data?.message
            if (status === 401 || errMsg === "Login required to access this resource") {
              isLoginRequired = true
            } else if (status === 403 || errMsg === "Access denied") {
              // Both patient and doctor profiles returned 403 Forbidden / Access denied, meaning logged in as admin
              dispatch(setAuth({ name: "Admin User", role: "admin" }))
              return
            }
          }
        }

        dispatch(clearAuth())
      } catch (err) {
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
