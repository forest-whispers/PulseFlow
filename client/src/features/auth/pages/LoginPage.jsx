import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { useDispatch } from "react-redux"
import { useNavigate, Link } from "react-router-dom"
import { toast } from "sonner"
import { Eye, EyeOff, Loader2 } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import AuthLayout from "../components/AuthLayout"
import { loginSchema } from "../schemas/authSchemas"
import { authApi } from "../api/authApi"
import { setAuth } from "@/store/authSlice"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const loginMutation = useMutation({
    mutationFn: async (data) => {
      // 1. Call login API
      const loginRes = await authApi.login(data)
      const role = loginRes.data?.role

      if (!role) {
        throw new Error("No role returned from server")
      }

      // 2. Fetch full profile based on returned role
      let profileData = null
      if (role === "patient") {
        const profileRes = await authApi.getPatientProfile()
        profileData = { ...profileRes.data, role }
      } else if (role === "doctor") {
        const profileRes = await authApi.getDoctorProfile()
        profileData = { ...profileRes.data, role }
      } else if (role === "admin") {
        profileData = { name: "Admin User", role }
      } else {
        throw new Error("Unknown user role received")
      }

      return { profile: profileData, role }
    },
    onSuccess: ({ profile, role }) => {
      dispatch(setAuth(profile))
      toast.success("Login successful!")
      
      // Redirect according to the authenticated user's role
      if (role === "patient") {
        navigate("/patient/dashboard", { replace: true })
      } else if (role === "doctor") {
        navigate("/doctor/dashboard", { replace: true })
      } else if (role === "admin") {
        navigate("/admin/dashboard", { replace: true })
      }
    },
    onError: (error) => {
      const errMsg = error.response?.data?.message || error.message || "Login failed"
      toast.error(errMsg)
    },
  })

  const onSubmit = (data) => {
    loginMutation.mutate(data)
  }

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to your HMS account to access your dashboard"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <Label htmlFor="email">Email address</Label>
          <div className="mt-1">
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              {...register("email")}
              className={errors.email ? "border-destructive focus-visible:ring-destructive" : ""}
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="password">Password</Label>
          <div className="mt-1 relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              {...register("password")}
              className={`pr-10 ${errors.password ? "border-destructive focus-visible:ring-destructive" : ""}`}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-xs text-destructive">{errors.password.message}</p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={loginMutation.isPending}>
          {loginMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            "Sign In"
          )}
        </Button>
      </form>

      <div className="mt-6 text-center text-sm">
        <span className="text-muted-foreground">New to HMS?</span>{" "}
        <Link to="/register" className="font-medium text-primary hover:underline">
          Create an account
        </Link>
      </div>
    </AuthLayout>
  )
}
