import { useState } from "react"
import { useLocation, useNavigate, Link } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { ArrowLeft, AlertCircle, FileText, Upload, X, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useCreateMedicalRecord } from "../hooks/useConsultationResources"

const medicalRecordSchema = z.object({
  chiefComplaint: z.string().min(1, "Chief Complaint is required"),
  diagnosis: z.string().optional(),
  treatment: z.string().optional(),
  notes: z.string().optional(),
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

export default function CreateMedicalRecord() {
  const location = useLocation()
  const navigate = useNavigate()
  
  const { appointmentId, patientName, appointmentDate, bookedSlot } = location.state || {}
  const [attachments, setAttachments] = useState([])

  const createMutation = useCreateMedicalRecord(appointmentId, {
    onSuccess: (response) => {
      if (response.data?._id) {
        navigate(`/doctor/medical-records/${response.data._id}`, {
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
    formState: { errors },
  } = useForm({
    resolver: zodResolver(medicalRecordSchema),
    defaultValues: {
      chiefComplaint: "",
      diagnosis: "",
      treatment: "",
      notes: "",
    }
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

  const handleFileChange = (e) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      setAttachments((prev) => {
        const combined = [...prev]
        newFiles.forEach((file) => {
          if (!combined.some((f) => f.name === file.name && f.size === file.size)) {
            combined.push(file)
          }
        })
        return combined
      })
    }
  }

  const removeAttachment = (indexToRemove) => {
    setAttachments((prev) => prev.filter((_, idx) => idx !== indexToRemove))
  }

  const onSubmit = (values) => {
    const formData = new FormData()
    formData.append("appointment", appointmentId)
    formData.append("chiefComplaint", values.chiefComplaint)
    formData.append("diagnosis", values.diagnosis || "")
    formData.append("treatment", values.treatment || "")
    formData.append("notes", values.notes || "")
    attachments.forEach((file) => {
      formData.append("attachments", file)
    })
    
    formData.name = "attachments" // Ensure matching request parameter structure
    
    createMutation.mutate(formData)
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto p-4 sm:p-6">
      {/* Return Link */}
      <Link 
        to={`/doctor/appointments/${appointmentId}`}
        className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Cancel and Return
      </Link>

      <div className="flex flex-col gap-1">
        <h2 className="text-xl sm:text-2xl font-extrabold text-foreground">Create Medical Record</h2>
        <p className="text-xs text-muted-foreground">
          Document patient complaint, diagnosis, treatment, and attach clinical logs.
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
              <FileText className="h-4.5 w-4.5 text-primary" />
              Clinical Information
            </CardTitle>
          </CardHeader>

          <CardContent className="p-6 space-y-6">
            {/* Chief Complaint */}
            <div className="space-y-1.5">
              <label htmlFor="chiefComplaint" className="text-xs font-bold text-foreground uppercase tracking-wider">
                Chief Complaint <span className="text-destructive">*</span>
              </label>
              <textarea
                id="chiefComplaint"
                disabled={createMutation.isPending}
                placeholder="Describe patient's chief complaint and symptoms..."
                className={`w-full min-h-[100px] rounded-xl border px-3.5 py-2.5 text-sm bg-background outline-none transition-all focus:ring-1 focus:ring-primary ${
                  errors.chiefComplaint ? "border-destructive focus:ring-destructive" : "border-input"
                }`}
                {...register("chiefComplaint")}
              />
              {errors.chiefComplaint && (
                <p className="text-xs text-destructive flex items-center gap-1 font-medium">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {errors.chiefComplaint.message}
                </p>
              )}
            </div>

            {/* Diagnosis */}
            <div className="space-y-1.5">
              <label htmlFor="diagnosis" className="text-xs font-bold text-foreground uppercase tracking-wider">
                Diagnosis
              </label>
              <textarea
                id="diagnosis"
                disabled={createMutation.isPending}
                placeholder="Enter medical diagnosis details..."
                className="w-full min-h-[80px] rounded-xl border border-input px-3.5 py-2.5 text-sm bg-background outline-none focus:ring-1 focus:ring-primary"
                {...register("diagnosis")}
              />
            </div>

            {/* Treatment */}
            <div className="space-y-1.5">
              <label htmlFor="treatment" className="text-xs font-bold text-foreground uppercase tracking-wider">
                Treatment Plan
              </label>
              <textarea
                id="treatment"
                disabled={createMutation.isPending}
                placeholder="Detail the prescribed treatment plan, therapy, or action steps..."
                className="w-full min-h-[80px] rounded-xl border border-input px-3.5 py-2.5 text-sm bg-background outline-none focus:ring-1 focus:ring-primary"
                {...register("treatment")}
              />
            </div>

            {/* Notes */}
            <div className="space-y-1.5">
              <label htmlFor="notes" className="text-xs font-bold text-foreground uppercase tracking-wider">
                Clinical Notes / Advice
              </label>
              <textarea
                id="notes"
                disabled={createMutation.isPending}
                placeholder="Enter any general advice, dietary suggestions, or clinical notes..."
                className="w-full min-h-[80px] rounded-xl border border-input px-3.5 py-2.5 text-sm bg-background outline-none focus:ring-1 focus:ring-primary"
                {...register("notes")}
              />
            </div>

            {/* Attachments Section */}
            <div className="space-y-3 pt-4 border-t border-dashed border-border/20">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-bold text-foreground uppercase tracking-wider">Clinical Attachments</span>
                <span className="text-[10px] text-muted-foreground">Upload reports, scan logs, or physical files. Supports multiple documents.</span>
              </div>

              <div className="relative">
                <input
                  type="file"
                  id="attachments"
                  multiple
                  disabled={createMutation.isPending}
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label
                  htmlFor="attachments"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border/40 rounded-xl cursor-pointer hover:bg-muted/10 transition-all bg-card/50"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="h-7 w-7 text-muted-foreground mb-2" />
                    <p className="text-sm font-semibold text-foreground">Click to upload files</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Drag and drop or select local files</p>
                  </div>
                </label>
              </div>

              {/* Selected Attachments list */}
              {attachments.length > 0 && (
                <div className="space-y-2 max-w-xl">
                  <span className="text-[10px] text-muted-foreground uppercase font-bold">Selected Files ({attachments.length})</span>
                  <div className="divide-y border border-border/20 rounded-xl overflow-hidden bg-card">
                    {attachments.map((file, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 text-xs bg-muted/5">
                        <div className="flex items-center gap-2 min-w-0 pr-4">
                          <FileText className="h-4 w-4 text-primary shrink-0" />
                          <span className="font-medium text-foreground truncate">{file.name}</span>
                          <span className="text-[10px] text-muted-foreground shrink-0">
                            ({(file.size / 1024).toFixed(1)} KB)
                          </span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          disabled={createMutation.isPending}
                          onClick={() => removeAttachment(idx)}
                          className="h-7 w-7 text-muted-foreground hover:text-destructive rounded-lg"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
              className="rounded-xl font-bold gap-2 cursor-pointer shadow-xs min-w-[120px]"
            >
              {createMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Record"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
