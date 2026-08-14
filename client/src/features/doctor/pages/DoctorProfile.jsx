import { useEffect, useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { 
  UserCog, 
  Save, 
  RotateCcw, 
  Loader2, 
  AlertTriangle, 
  Briefcase, 
  Stethoscope, 
  User, 
  MapPin, 
  FileText 
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useDoctorProfile } from "../hooks/useDoctorProfile"

// Form validation schema using Zod
const doctorProfileFormSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  age: z.coerce.number({ invalid_type_error: "Age must be a number" }).int().min(18, "Age must be at least 18").max(120, "Age must be less than 120"),
  gender: z.enum(["male", "female", "other"], {
    errorMap: () => ({ message: "Please select Male, Female, or Other" }),
  }),
  specialization: z.string().trim().min(3, "Specialization must be at least 3 characters"),
  experience: z.coerce.number({ invalid_type_error: "Experience must be a number" }).min(0, "Experience cannot be negative"),
  consultationFee: z.coerce.number({ invalid_type_error: "Consultation fee must be a number" }).min(0, "Fee cannot be negative"),
  clinicAddress: z.string().trim().min(5, "Clinic address must be at least 5 characters"),
  bio: z.string().trim().min(10, "Bio must be at least 10 characters"),
})

export default function DoctorProfile() {
  const { data, isLoading, isError, error, refetch, updateProfile, isUpdating } = useDoctorProfile()
  const [submitError, setSubmitError] = useState(null)

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { isDirty, errors },
  } = useForm({
    resolver: zodResolver(doctorProfileFormSchema),
    defaultValues: {
      name: "",
      age: "",
      gender: "male",
      specialization: "",
      experience: 0,
      consultationFee: 0,
      clinicAddress: "",
      bio: "",
    },
    mode: "onChange",
  })

  // Synchronize form default values when profile data is loaded or changes
  useEffect(() => {
    if (data?.data) {
      reset({
        name: data.data.name || "",
        age: data.data.age || "",
        gender: data.data.gender ? data.data.gender.toLowerCase() : "male",
        specialization: data.data.specialization || "",
        experience: data.data.experience ?? 0,
        consultationFee: data.data.consultationFee ?? 0,
        clinicAddress: data.data.clinicAddress || "",
        bio: data.data.bio || "",
      })
    }
  }, [data, reset])

  const onSubmit = async (formData) => {
    setSubmitError(null)
    try {
      await updateProfile(formData)
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || "Failed to update profile information"
      setSubmitError(errMsg)
    }
  }

  const handleReset = () => {
    setSubmitError(null)
    reset()
  }

  // Loading skeleton state
  if (isLoading) {
    return (
      <div className="space-y-8 animate-pulse">
        {/* Header Skeleton */}
        <div className="border-b pb-6 mb-8">
          <div className="h-4 w-32 bg-muted rounded-md mb-3" />
          <div className="h-8 w-64 bg-muted rounded-md mb-2" />
          <div className="h-4 w-96 bg-muted rounded-md" />
        </div>

        {/* Settings Workspace Grid Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 bg-card border rounded-xl p-6 h-48 space-y-4">
            <div className="h-6 w-32 bg-muted rounded-md" />
            <div className="h-12 w-full bg-muted rounded-md" />
          </div>
          <div className="lg:col-span-2 bg-card border rounded-xl p-6 space-y-6">
            <div className="h-6 w-48 bg-muted rounded-md" />
            <div className="grid grid-cols-2 gap-4">
              <div className="h-16 bg-muted rounded-md" />
              <div className="h-16 bg-muted rounded-md" />
            </div>
            <div className="h-24 bg-muted rounded-md" />
          </div>
        </div>
      </div>
    )
  }

  // Error boundary state
  if (isError) {
    const errMsg = error.response?.data?.message || error.message || "Failed to load doctor profile"
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6 space-y-6 animate-fade-in">
        <div className="h-16 w-16 rounded-full bg-destructive/10 text-destructive flex items-center justify-center animate-bounce">
          <AlertTriangle className="h-8 w-8" />
        </div>
        <div className="space-y-2 max-w-md">
          <h2 className="text-2xl font-bold text-foreground">Profile Load Failed</h2>
          <p className="text-muted-foreground text-sm">{errMsg}</p>
        </div>
        <Button onClick={() => refetch()} className="gap-2 cursor-pointer">
          <RotateCcw className="h-4 w-4" /> Retry Loading
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Settings Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b pb-6 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            <UserCog className="h-8 w-8 text-primary" /> Profile Settings
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Manage your personal details, credentials, bio, and clinic contact settings.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Unsaved changes alert */}
        {isDirty && (
          <div className="flex items-center gap-3 p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30 rounded-xl text-amber-800 dark:text-amber-300 animate-fade-in text-sm font-medium">
            <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-500" />
            <div className="flex-1">
              You have unsaved changes in your profile. Click "Save Changes" to apply.
            </div>
          </div>
        )}

        {/* Backend submission error alert */}
        {submitError && (
          <div className="flex items-center gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive animate-fade-in text-sm font-medium">
            <AlertTriangle className="h-5 w-5 shrink-0" />
            <div className="flex-1">
              {submitError}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Summary Card */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-card border rounded-xl p-6 shadow-xs space-y-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="h-24 w-24 rounded-full bg-primary/10 border flex items-center justify-center text-3xl font-bold text-primary">
                  {data.data.name ? data.data.name.split(" ").pop()?.charAt(0) || "D" : "D"}
                </div>
                <div>
                  <h3 className="font-bold text-lg text-foreground">
                    {data.data.name || "Doctor"}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {data.data.specialization || "Specialization not set"}
                  </p>
                </div>
              </div>

              <div className="border-t pt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Consultation Fee</span>
                  <span className="font-semibold text-foreground">₹{data.data.consultationFee ?? 0}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Experience</span>
                  <span className="font-semibold text-foreground">{data.data.experience ?? 0} Years</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Main Profile Fields Form */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-card border rounded-xl p-6 shadow-xs space-y-8">
              
              {/* Section 1: Personal Information */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b pb-2 mb-4">
                  <User className="h-5 w-5 text-primary" />
                  <h3 className="font-bold text-base text-foreground">Personal Details</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Name Input */}
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      type="text"
                      name="name"
                      disabled={isUpdating}
                      {...register("name")}
                      aria-invalid={!!errors.name}
                      className={errors.name ? "border-destructive focus-visible:ring-destructive/20" : ""}
                    />
                    {errors.name && (
                      <p className="text-xs text-destructive">{errors.name.message}</p>
                    )}
                  </div>

                  {/* Age Input */}
                  <div className="space-y-2">
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      type="number"
                      name="age"
                      min="18"
                      max="120"
                      disabled={isUpdating}
                      {...register("age")}
                      aria-invalid={!!errors.age}
                      className={errors.age ? "border-destructive focus-visible:ring-destructive/20" : ""}
                    />
                    {errors.age && (
                      <p className="text-xs text-destructive">{errors.age.message}</p>
                    )}
                  </div>

                  {/* Gender Select Input */}
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Controller
                      name="gender"
                      control={control}
                      render={({ field }) => (
                        <Select
                          id="gender"
                          value={field.value}
                          onChange={field.onChange}
                          className={errors.gender ? "border-destructive focus-visible:ring-destructive" : ""}
                        >
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </Select>
                      )}
                    />
                    {errors.gender && (
                      <p className="text-xs text-destructive">{errors.gender.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Section 2: Professional Information */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b pb-2 mb-4">
                  <Stethoscope className="h-5 w-5 text-primary" />
                  <h3 className="font-bold text-base text-foreground">Professional Info</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Specialization Input */}
                  <div className="space-y-2">
                    <Label htmlFor="specialization">Specialization</Label>
                    <Input
                      id="specialization"
                      type="text"
                      name="specialization"
                      disabled={isUpdating}
                      {...register("specialization")}
                      aria-invalid={!!errors.specialization}
                      className={errors.specialization ? "border-destructive focus-visible:ring-destructive/20" : ""}
                    />
                    {errors.specialization && (
                      <p className="text-xs text-destructive">{errors.specialization.message}</p>
                    )}
                  </div>

                  {/* Experience Input */}
                  <div className="space-y-2">
                    <Label htmlFor="experience">Years of Experience</Label>
                    <Input
                      id="experience"
                      type="number"
                      name="experience"
                      min="0"
                      disabled={isUpdating}
                      {...register("experience")}
                      aria-invalid={!!errors.experience}
                      className={errors.experience ? "border-destructive focus-visible:ring-destructive/20" : ""}
                    />
                    {errors.experience && (
                      <p className="text-xs text-destructive">{errors.experience.message}</p>
                    )}
                  </div>

                  {/* Consultation Fee Input */}
                  <div className="space-y-2">
                    <Label htmlFor="consultationFee">Consultation Fee (₹)</Label>
                    <Input
                      id="consultationFee"
                      type="number"
                      name="consultationFee"
                      min="0"
                      disabled={isUpdating}
                      {...register("consultationFee")}
                      aria-invalid={!!errors.consultationFee}
                      className={errors.consultationFee ? "border-destructive focus-visible:ring-destructive/20" : ""}
                    />
                    {errors.consultationFee && (
                      <p className="text-xs text-destructive">{errors.consultationFee.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Section 3: Contact & Background Details */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b pb-2 mb-4">
                  <MapPin className="h-5 w-5 text-primary" />
                  <h3 className="font-bold text-base text-foreground">Clinic & Background Details</h3>
                </div>

                <div className="space-y-4">
                  {/* Clinic Address Input */}
                  <div className="space-y-2">
                    <Label htmlFor="clinicAddress">Clinic Address</Label>
                    <Input
                      id="clinicAddress"
                      type="text"
                      name="clinicAddress"
                      disabled={isUpdating}
                      {...register("clinicAddress")}
                      aria-invalid={!!errors.clinicAddress}
                      className={errors.clinicAddress ? "border-destructive focus-visible:ring-destructive/20" : ""}
                    />
                    {errors.clinicAddress && (
                      <p className="text-xs text-destructive">{errors.clinicAddress.message}</p>
                    )}
                  </div>

                  {/* Bio Input */}
                  <div className="space-y-2">
                    <Label htmlFor="bio">Professional Bio</Label>
                    <Textarea
                      id="bio"
                      name="bio"
                      rows={4}
                      disabled={isUpdating}
                      {...register("bio")}
                      aria-invalid={!!errors.bio}
                      className={errors.bio ? "border-destructive focus-visible:ring-destructive/20" : ""}
                    />
                    {errors.bio && (
                      <p className="text-xs text-destructive">{errors.bio.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons Row */}
              <div className="flex justify-end gap-3 border-t pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleReset}
                  disabled={!isDirty || isUpdating}
                  className="gap-2 cursor-pointer"
                >
                  <RotateCcw className="h-4 w-4" /> Reset
                </Button>
                <Button
                  type="submit"
                  disabled={!isDirty || isUpdating}
                  className="gap-2 cursor-pointer min-w-[140px]"
                >
                  {isUpdating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" /> Save Changes
                    </>
                  )}
                </Button>
              </div>

            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
