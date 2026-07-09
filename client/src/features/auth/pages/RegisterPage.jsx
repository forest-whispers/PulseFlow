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
import { registerSchema } from "../schemas/authSchemas"
import { authApi } from "../api/authApi"
import { setAuth } from "@/store/authSlice"

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      age: "",
      gender: "male",
      role: "patient",
    },
  })

  // Watch selected role to style the segmented control
  const selectedRole = watch("role")

  const registerMutation = useMutation({
    mutationFn: async (data) => {
      // 1. Call register API
      const registerRes = await authApi.register(data)
      const role = registerRes.data?.role

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
      toast.success("Account created successfully!")
      
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
      const errMsg = error.response?.data?.message || error.message || "Registration failed"
      toast.error(errMsg)
    },
  })

  const onSubmit = (data) => {
    registerMutation.mutate(data)
  }

  return (
    <AuthLayout
      title="Create Account"
      subtitle="Register a new account to get started with PulseFlow"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Role Selector Segmented Control */}
        <div>
          <Label>Select Your Role</Label>
          <div className="mt-2 grid grid-cols-3 gap-2 bg-muted p-1 rounded-md">
            {["patient", "doctor", "admin"].map((role) => (
              <button
                key={role}
                type="button"
                className={`py-1.5 text-xs font-semibold rounded-sm capitalize transition-all ${
                  selectedRole === role
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => setValue("role", role)}
              >
                {role}
              </button>
            ))}
          </div>
          <input type="hidden" {...register("role")} value={selectedRole} />
          {errors.role && (
            <p className="mt-1 text-xs text-destructive">{errors.role.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="name">Full Name</Label>
          <div className="mt-1">
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              {...register("name")}
              className={errors.name ? "border-destructive focus-visible:ring-destructive" : ""}
            />
          </div>
          {errors.name && (
            <p className="mt-1 text-xs text-destructive">{errors.name.message}</p>
          )}
        </div>

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

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="age">Age</Label>
            <div className="mt-1">
              <Input
                id="age"
                type="number"
                placeholder="25"
                {...register("age")}
                className={errors.age ? "border-destructive focus-visible:ring-destructive" : ""}
              />
            </div>
            {errors.age && (
              <p className="mt-1 text-xs text-destructive">{errors.age.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="gender">Gender</Label>
            <div className="mt-1">
              <select
                id="gender"
                {...register("gender")}
                className={`flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${
                  errors.gender ? "border-destructive focus-visible:ring-destructive" : ""
                }`}
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            {errors.gender && (
              <p className="mt-1 text-xs text-destructive">{errors.gender.message}</p>
            )}
          </div>
        </div>

        <Button type="submit" className="w-full mt-4" disabled={registerMutation.isPending}>
          {registerMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating account...
            </>
          ) : (
            "Register"
          )}
        </Button>
      </form>

      <div className="mt-6 text-center text-sm">
        <span className="text-muted-foreground">Already have an account?</span>{" "}
        <Link to="/login" className="font-medium text-primary hover:underline">
          Sign in
        </Link>
      </div>
    </AuthLayout>
  )
}
