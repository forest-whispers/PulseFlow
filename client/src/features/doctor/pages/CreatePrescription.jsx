import { useLocation, useNavigate, Link } from "react-router-dom"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { ArrowLeft, AlertCircle, Pill, Plus, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useCreatePrescription } from "../hooks/useConsultationResources"

const prescriptionSchema = z.object({
  notes: z.string().optional(),
  medications: z.array(
    z.object({
      medicineName: z.string().min(1, "Medicine Name is required"),
      dosage: z.string().min(1, "Dosage is required"),
      frequency: z.string().min(1, "Frequency is required"),
      duration: z.string().min(1, "Duration is required"),
      instructions: z.string().optional(),
    })
  ).min(1, "At least one medication is required"),
})

function formatTime12Hour(timeStr) {
  if (!timeStr) return "N/A"
  if (timeStr.includes("AM") || timeStr.includes("PM")) return timeStr

  const [hourStr, minStr] = timeStr.split(":")
  const hour = parseInt(hourStr, 10)
  if (isNaN(hour)) return timeStr
  const ampm = hour >= 12 ? "PM" : "AM"
  const hour12 = hour % 12 || 12
  const paddedHour = String(hour12).padStart(2, "0")
  return `${paddedHour}:${minStr} ${ampm}`
}

function formatDate(dateStr) {
  if (!dateStr) return "N/A"
  try {
    const date = new Date(dateStr)
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  } catch {
    return dateStr
  }
}

export default function CreatePrescription() {
  const location = useLocation()
  const navigate = useNavigate()
  
  const { appointmentId, patientName, appointmentDate, bookedSlot } = location.state || {}

  const createMutation = useCreatePrescription(appointmentId, {
    onSuccess: (response) => {
      if (response.data?._id) {
        navigate(`/doctor/prescriptions/${response.data._id}`, {
          state: { appointmentId }
        })
      } else {
        navigate(`/doctor/appointments/${appointmentId}`)
      }
    }
  })

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(prescriptionSchema),
    defaultValues: {
      notes: "",
      medications: [
        { medicineName: "", dosage: "", frequency: "", duration: "", instructions: "" }
      ]
    }
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: "medications",
  })

  // Handle direct url load error state
  if (!appointmentId) {
    return (
      <div className="space-y-6 max-w-2xl mx-auto p-4 sm:p-6 text-center animate-fade-in">
        <Card className="border border-destructive/20 shadow-xs bg-card p-8 rounded-2xl">
          <div className="h-12 w-12 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-bold text-foreground mb-2">Missing Appointment Context</h3>
          <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
            This creation workflow must be initiated from the Appointment Details workspace. Directly refreshing or accessing this URL is not permitted.
          </p>
          <Button onClick={() => navigate("/doctor/appointments")} className="rounded-xl font-bold cursor-pointer">
            Back to Appointments
          </Button>
        </Card>
      </div>
    )
  }

  const onSubmit = (values) => {
    const payload = {
      appointment: appointmentId,
      notes: values.notes || "",
      medications: values.medications,
    }
    createMutation.mutate(payload)
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-4 sm:p-6">
      {/* Return Link */}
      <Link 
        to={`/doctor/appointments/${appointmentId}`}
        className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Cancel and Return
      </Link>

      <div className="flex flex-col gap-1">
        <h2 className="text-xl sm:text-2xl font-extrabold text-foreground">Create Prescription</h2>
        <p className="text-xs text-muted-foreground">
          Design clinical prescriptions and add detailed medication logs for this consultation.
        </p>
      </div>

      {/* Shared Appointment Summary Card */}
      <Card className="border border-border/40 shadow-2xs bg-muted/20 rounded-2xl overflow-hidden">
        <CardContent className="p-5 flex flex-wrap gap-x-12 gap-y-4 text-xs sm:text-sm">
          <div>
            <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Patient Name</span>
            <p className="font-extrabold text-foreground mt-0.5">{patientName}</p>
          </div>
          <div>
            <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Appointment Date</span>
            <p className="font-semibold text-foreground mt-0.5">{formatDate(appointmentDate)}</p>
          </div>
          <div>
            <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Time Slot</span>
            <p className="font-semibold text-foreground mt-0.5">{formatTime12Hour(bookedSlot)}</p>
          </div>
        </CardContent>
      </Card>

      {/* Main Creation Form Card */}
      <Card className="border border-border/40 shadow-2xs bg-card rounded-2xl overflow-hidden">
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardHeader className="p-6 border-b border-border/10">
            <CardTitle className="text-sm font-bold flex items-center gap-2 text-foreground">
              <Pill className="h-4.5 w-4.5 text-primary" />
              Prescription details
            </CardTitle>
          </CardHeader>

          <CardContent className="p-6 space-y-6">
            {/* Notes */}
            <div className="space-y-1.5">
              <label htmlFor="notes" className="text-xs font-bold text-foreground uppercase tracking-wider">
                Clinical Prescription Notes
              </label>
              <textarea
                id="notes"
                disabled={createMutation.isPending}
                placeholder="Enter general instructions, dietary rules, or comments for the patient..."
                className="w-full min-h-[85px] rounded-xl border border-input px-3.5 py-2.5 text-sm bg-background outline-none focus:ring-1 focus:ring-primary"
                {...register("notes")}
              />
            </div>

            {/* Medications Header & Field Array */}
            <div className="space-y-4 pt-4 border-t border-dashed border-border/20">
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs font-bold text-foreground uppercase tracking-wider">Medications *</span>
                  <span className="text-[10px] text-muted-foreground">Add medicines and their precise administration dosage.</span>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={createMutation.isPending}
                  onClick={() => append({ medicineName: "", dosage: "", frequency: "", duration: "", instructions: "" })}
                  className="gap-1 rounded-xl font-bold cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" /> Add Medicine
                </Button>
              </div>

              {errors.medications?.root && (
                <p className="text-xs text-destructive flex items-center gap-1 font-medium bg-destructive/5 p-2 rounded-lg border border-destructive/10">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {errors.medications.root.message}
                </p>
              )}

              {/* Dynamic Medications List */}
              <div className="space-y-4">
                {fields.map((field, index) => (
                  <div key={field.id} className="p-5 border border-border/30 rounded-xl bg-muted/5 relative space-y-4 animate-fade-in">
                    <div className="flex justify-between items-center pb-2 border-b border-border/10">
                      <span className="text-xs font-bold text-foreground uppercase tracking-wider">Medication #{index + 1}</span>
                      {fields.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          disabled={createMutation.isPending}
                          onClick={() => remove(index)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10 h-7 rounded-lg text-xs cursor-pointer"
                        >
                          Remove Row
                        </Button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                      {/* Medicine Name */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-foreground uppercase tracking-wider">Medicine Name *</label>
                        <input
                          type="text"
                          disabled={createMutation.isPending}
                          placeholder="e.g. Ibuprofen"
                          className={`w-full h-10 rounded-lg border px-3 text-xs bg-background outline-none transition-all focus:ring-1 focus:ring-primary ${
                            errors.medications?.[index]?.medicineName ? "border-destructive focus:ring-destructive" : "border-input"
                          }`}
                          {...register(`medications.${index}.medicineName`)}
                        />
                        {errors.medications?.[index]?.medicineName && (
                          <span className="text-[10px] text-destructive font-medium flex items-center gap-0.5 mt-0.5">
                            {errors.medications[index].medicineName.message}
                          </span>
                        )}
                      </div>

                      {/* Dosage */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-foreground uppercase tracking-wider">Dosage *</label>
                        <input
                          type="text"
                          disabled={createMutation.isPending}
                          placeholder="e.g. 400mg"
                          className={`w-full h-10 rounded-lg border px-3 text-xs bg-background outline-none transition-all focus:ring-1 focus:ring-primary ${
                            errors.medications?.[index]?.dosage ? "border-destructive focus:ring-destructive" : "border-input"
                          }`}
                          {...register(`medications.${index}.dosage`)}
                        />
                        {errors.medications?.[index]?.dosage && (
                          <span className="text-[10px] text-destructive font-medium flex items-center gap-0.5 mt-0.5">
                            {errors.medications[index].dosage.message}
                          </span>
                        )}
                      </div>

                      {/* Frequency */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-foreground uppercase tracking-wider">Frequency *</label>
                        <input
                          type="text"
                          disabled={createMutation.isPending}
                          placeholder="e.g. Once daily"
                          className={`w-full h-10 rounded-lg border px-3 text-xs bg-background outline-none transition-all focus:ring-1 focus:ring-primary ${
                            errors.medications?.[index]?.frequency ? "border-destructive focus:ring-destructive" : "border-input"
                          }`}
                          {...register(`medications.${index}.frequency`)}
                        />
                        {errors.medications?.[index]?.frequency && (
                          <span className="text-[10px] text-destructive font-medium flex items-center gap-0.5 mt-0.5">
                            {errors.medications[index].frequency.message}
                          </span>
                        )}
                      </div>

                      {/* Duration */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-foreground uppercase tracking-wider">Duration *</label>
                        <input
                          type="text"
                          disabled={createMutation.isPending}
                          placeholder="e.g. 7 days"
                          className={`w-full h-10 rounded-lg border px-3 text-xs bg-background outline-none transition-all focus:ring-1 focus:ring-primary ${
                            errors.medications?.[index]?.duration ? "border-destructive focus:ring-destructive" : "border-input"
                          }`}
                          {...register(`medications.${index}.duration`)}
                        />
                        {errors.medications?.[index]?.duration && (
                          <span className="text-[10px] text-destructive font-medium flex items-center gap-0.5 mt-0.5">
                            {errors.medications[index].duration.message}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Instructions */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-foreground uppercase tracking-wider">Instructions / Guidelines</label>
                      <input
                        type="text"
                        disabled={createMutation.isPending}
                        placeholder="e.g. Take with warm water before meals"
                        className="w-full h-10 rounded-lg border border-input px-3 text-xs bg-background outline-none focus:ring-1 focus:ring-primary"
                        {...register(`medications.${index}.instructions`)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>

          {/* Action Footer */}
          <CardFooter className="p-6 border-t border-border/10 bg-muted/10 flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              disabled={createMutation.isPending}
              onClick={() => navigate(`/doctor/appointments/${appointmentId}`)}
              className="rounded-xl font-bold cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createMutation.isPending}
              className="rounded-xl font-bold gap-2 cursor-pointer shadow-xs min-w-[125px]"
            >
              {createMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Prescription"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
