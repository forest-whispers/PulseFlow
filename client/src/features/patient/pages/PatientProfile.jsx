import { useEffect, useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { 
  User, 
  Save, 
  RotateCcw, 
  Loader2, 
  AlertTriangle, 
  Heart, 
  Activity, 
  Phone 
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { usePatientProfile } from "../hooks/usePatientProfile"
import AllergiesInput from "../components/AllergiesInput"

// Form validation schema using Zod
const patientProfileFormSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  age: z.coerce.number({ invalid_type_error: "Age must be a number" }).int().min(0, "Age cannot be negative").max(120, "Age must be less than 120"),
  gender: z.enum(["male", "female", "other"], {
    errorMap: () => ({ message: "Please select Male, Female, or Other" }),
  }),
  bloodGroup: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"], {
    errorMap: () => ({ message: "Please select a valid blood group" }),
  }),
  allergies: z.array(z.string().trim()).default([]),
  medicalHistory: z.string().trim().optional(),
  emergencyContact: z.string().trim().regex(/^\+?[0-9\s\-()]{7,20}$/, "Invalid emergency contact phone number"),
})

export default function PatientProfile() {
  const { data, isLoading, isError, error, refetch, updateProfile, isUpdating } = usePatientProfile()
  const [submitError, setSubmitError] = useState(null)

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { isDirty, errors },
  } = useForm({
    resolver: zodResolver(patientProfileFormSchema),
    defaultValues: {
      name: "",
      age: "",
      gender: "male",
      bloodGroup: "O+",
      allergies: [],
      medicalHistory: "",
      emergencyContact: "",
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
        bloodGroup: data.data.bloodGroup || "O+",
        allergies: data.data.allergies || [],
        medicalHistory: data.data.medicalHistory || "",
        emergencyContact: data.data.emergencyContact || "",
      })
    }
  }, [data, reset])

  const onSubmit = async (formData) => {
    setSubmitError(null)
    try {
      const response = await updateProfile(formData)
      // Reset form state with the returned response data to clear isDirty and sync state
      reset({
        name: response.data.name || "",
        age: response.data.age || "",
        gender: response.data.gender ? response.data.gender.toLowerCase() : "male",
        bloodGroup: response.data.bloodGroup || "O+",
        allergies: response.data.allergies || [],
        medicalHistory: response.data.medicalHistory || "",
        emergencyContact: response.data.emergencyContact || "",
      })
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
    const errMsg = error.response?.data?.message || error.message || "Failed to load patient profile"
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
            <User className="h-8 w-8 text-primary" /> Profile Settings
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Manage your personal profile, medical conditions, emergencies, and history settings.
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
                  {data.data.name ? data.data.name.split(" ").pop()?.charAt(0) || "P" : "P"}
                </div>
                <div>
                  <h3 className="font-bold text-lg text-foreground">
                    {data.data.name || "Patient"}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Blood Group: <span className="font-semibold text-primary">{data.data.bloodGroup || "Not set"}</span>
                  </p>
                </div>
              </div>

              <div className="border-t pt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Age</span>
                  <span className="font-semibold text-foreground">{data.data.age || "Not set"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Emergency Contact</span>
                  <span className="font-semibold text-foreground">{data.data.emergencyContact || "Not set"}</span>
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
                      min="0"
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

              {/* Section 2: Medical Information */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b pb-2 mb-4">
                  <Heart className="h-5 w-5 text-primary" />
                  <h3 className="font-bold text-base text-foreground">Medical Information</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Blood Group Select Input */}
                  <div className="space-y-2">
                    <Label htmlFor="bloodGroup">Blood Group</Label>
                    <Controller
                      name="bloodGroup"
                      control={control}
                      render={({ field }) => (
                        <Select
                          id="bloodGroup"
                          value={field.value}
                          onChange={field.onChange}
                          className={errors.bloodGroup ? "border-destructive focus-visible:ring-destructive" : ""}
                        >
                          <option value="A+">A+</option>
                          <option value="A-">A-</option>
                          <option value="B+">B+</option>
                          <option value="B-">B-</option>
                          <option value="AB+">AB+</option>
                          <option value="AB-">AB-</option>
                          <option value="O+">O+</option>
                          <option value="O-">O-</option>
                        </Select>
                      )}
                    />
                    {errors.bloodGroup && (
                      <p className="text-xs text-destructive">{errors.bloodGroup.message}</p>
                    )}
                  </div>

                  {/* Emergency Contact Input */}
                  <div className="space-y-2">
                    <Label htmlFor="emergencyContact">Emergency Contact</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="emergencyContact"
                        type="tel"
                        name="emergencyContact"
                        placeholder="+91-XXXXXXXXXX"
                        disabled={isUpdating}
                        {...register("emergencyContact")}
                        aria-invalid={!!errors.emergencyContact}
                        className={`pl-9 ${errors.emergencyContact ? "border-destructive focus-visible:ring-destructive/20" : ""}`}
                      />
                    </div>
                    {errors.emergencyContact && (
                      <p className="text-xs text-destructive">{errors.emergencyContact.message}</p>
                    )}
                  </div>
                </div>

                {/* Allergies Chip Input Component */}
                <div className="space-y-2 pt-2">
                  <Label htmlFor="allergies">Allergies</Label>
                  <Controller
                    name="allergies"
                    control={control}
                    render={({ field }) => (
                      <AllergiesInput
                        value={field.value}
                        onChange={field.onChange}
                        disabled={isUpdating}
                      />
                    )}
                  />
                  {errors.allergies && (
                    <p className="text-xs text-destructive">{errors.allergies.message}</p>
                  )}
                </div>

                {/* Medical History Input */}
                <div className="space-y-2 pt-2">
                  <Label htmlFor="medicalHistory">Medical History</Label>
                  <Textarea
                    id="medicalHistory"
                    name="medicalHistory"
                    disabled={isUpdating}
                    {...register("medicalHistory")}
                    aria-invalid={!!errors.medicalHistory}
                    className={`min-h-[120px] resize-y ${errors.medicalHistory ? "border-destructive focus-visible:ring-destructive/20" : ""}`}
                  />
                  {errors.medicalHistory && (
                    <p className="text-xs text-destructive">{errors.medicalHistory.message}</p>
                  )}
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
