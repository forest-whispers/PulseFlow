import { useState, useEffect } from "react"
import { useParams, useNavigate, useLocation, Link } from "react-router-dom"
import { useSelector } from "react-redux"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  ArrowLeft,
  Calendar,
  User,
  Stethoscope,
  FileText,
  AlertCircle,
  AlertTriangle,
  Trash2,
  Edit,
  Pill,
  Beaker,
  Receipt,
  Eye,
  Download,
  Loader2,
  Upload,
  X,
  CheckCircle2,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  useMedicalRecordDetails,
  useUpdateMedicalRecord,
  useDeleteMedicalRecord,
} from "../hooks/useMedicalRecords"

const editRecordSchema = z.object({
  chiefComplaint: z.string().min(5, "Chief Complaint must be at least 5 characters"),
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

// Presentational Resource Card (visually identical to AppointmentDetails.jsx)
function RelatedResourceCard({ title, icon: Icon, exists, emptyMessage, summaryContent, actions }) {
  return (
    <Card className="border border-border/40 shadow-2xs bg-card hover:shadow-xs transition-all duration-300 flex flex-col justify-between h-full min-h-[160px] overflow-hidden rounded-2xl">
      <CardHeader className="p-5 pb-3 border-b border-border/10 flex flex-row items-center justify-between gap-2 bg-muted/5">
        <CardTitle className="text-xs font-bold flex items-center gap-2 text-foreground uppercase tracking-wider">
          <Icon className="h-4.5 w-4.5 text-primary" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-5 flex-1 flex flex-col justify-center">
        {exists ? (
          summaryContent
        ) : (
          <p className="text-xs text-muted-foreground italic leading-relaxed">
            {emptyMessage}
          </p>
        )}
      </CardContent>
      {actions && (
        <CardFooter className="p-5 pt-3 pb-4 flex justify-end gap-2 border-t border-border/10 bg-muted/10">
          {actions}
        </CardFooter>
      )}
    </Card>
  )
}

export default function MedicalRecordDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()

  // Authenticated user check
  const { user } = useSelector((state) => state.auth)
  const currentRole = user?.role || "patient"
  const isDoctor = currentRole === "doctor"

  // Component local states
  const [isEditing, setIsEditing] = useState(location.state?.edit || false)
  const [newAttachments, setNewAttachments] = useState([])
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  // Fetch details
  const {
    data: detailsData,
    isLoading,
    isError,
    error,
    refetch,
  } = useMedicalRecordDetails(id)

  const record = detailsData?.data?.medicalRecord || {}
  const doctor = record.doctor || {}
  const patient = record.patient || {}
  const related = detailsData?.data?.related || {}

  // Mutations
  const updateMutation = useUpdateMedicalRecord(id)
  const deleteMutation = useDeleteMedicalRecord(id)

  // Form setup
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(editRecordSchema),
    defaultValues: {
      chiefComplaint: "",
      diagnosis: "",
      treatment: "",
      notes: "",
    },
  })

  // Synchronize form values when record loads
  useEffect(() => {
    if (record && Object.keys(record).length > 0) {
      reset({
        chiefComplaint: record.chiefComplaint || "",
        diagnosis: record.diagnosis || "",
        treatment: record.treatment || "",
        notes: record.notes || "",
      })
    }
  }, [record, reset])

  const handleFileChange = (e) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      setNewAttachments((prev) => {
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

  const removeStagedAttachment = (indexToRemove) => {
    setNewAttachments((prev) => prev.filter((_, idx) => idx !== indexToRemove))
  }

  const onSubmit = (values) => {
    const formData = new FormData()
    formData.append("chiefComplaint", values.chiefComplaint)
    formData.append("diagnosis", values.diagnosis || "")
    formData.append("treatment", values.treatment || "")
    formData.append("notes", values.notes || "")
    newAttachments.forEach((file) => {
      formData.append("attachments", file)
    })
    
    formData.name = "attachments" // Ensure matching request parameter structure
    
    updateMutation.mutate(formData, {
      onSuccess: () => {
        setIsEditing(false)
        setNewAttachments([])
      },
    })
  }

  const handleDeleteConfirm = () => {
    deleteMutation.mutate(null, {
      onSuccess: () => {
        setShowDeleteConfirm(false)
        const appointmentId = location.state?.appointmentId || record.appointment?._id || record.appointment
        if (appointmentId) {
          navigate(`/doctor/appointments/${appointmentId}`)
        } else {
          navigate("/doctor/appointments")
        }
      },
    })
  }

  // Derive back button route depending on user role and context
  const handleBackNavigation = () => {
    const appointmentId = location.state?.appointmentId || record.appointment?._id || record.appointment
    if (appointmentId) {
      navigate(`/${currentRole}/appointments/${appointmentId}`)
    } else {
      navigate(
        currentRole === "doctor"
          ? "/doctor/appointments"
          : currentRole === "admin"
          ? "/admin/medical-records"
          : "/patient/medical-records"
      )
    }
  }

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto p-4 sm:p-6 animate-pulse">
        <div className="h-5 w-40 bg-muted/65 rounded-md" />
        <Card className="border rounded-2xl h-[400px]" />
      </div>
    )
  }

  // Error retry display
  if (isError) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-center p-6 space-y-4 max-w-md mx-auto animate-fade-in">
        <div className="h-14 w-14 rounded-full bg-destructive/10 text-destructive flex items-center justify-center shadow-2xs">
          <AlertCircle className="h-7 w-7" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-foreground">Failed to Load Details</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {error?.response?.data?.message || error?.message || "We encountered an error loading this medical record. Please try again."}
          </p>
        </div>
        <div className="flex gap-3 w-full">
          <Button variant="outline" onClick={handleBackNavigation} className="flex-1 rounded-xl cursor-pointer">
            Return
          </Button>
          <Button onClick={() => refetch()} className="flex-1 gap-2 rounded-xl cursor-pointer">
            <RefreshCw className="h-4 w-4" /> Try Again
          </Button>
        </div>
      </div>
    )
  }

  // Configure Related Resources list dynamically using same pattern
  const relatedPrescriptionExists = !!related?.prescription
  const relatedLabResultExists = !!related?.labResult
  const relatedInvoiceExists = !!related?.invoice

  const relatedItems = [
    {
      id: "prescription",
      title: "Prescription Link",
      icon: Pill,
      exists: relatedPrescriptionExists,
      emptyMessage: "No prescription has been issued yet.",
      summaryContent: relatedPrescriptionExists && (
        <div>
          <span className="text-[10px] text-muted-foreground uppercase font-bold">Issued Date</span>
          <p className="font-semibold text-foreground">{formatDate(related.prescription.issuedAt)}</p>
        </div>
      ),
      actions: relatedPrescriptionExists && (
        <Link to={`/${currentRole}/prescriptions/${related.prescription._id}`} state={{ appointmentId: record.appointment?._id || record.appointment }}>
          <Button variant="outline" size="sm" className="gap-1 cursor-pointer">
            <Eye className="h-3.5 w-3.5" /> View
          </Button>
        </Link>
      ),
    },
    {
      id: "labResult",
      title: "Lab Outcomes Link",
      icon: Beaker,
      exists: relatedLabResultExists,
      emptyMessage: "No lab reports registered.",
      summaryContent: relatedLabResultExists && (
        <div className="space-y-1.5">
          <div>
            <span className="text-[10px] text-muted-foreground uppercase font-bold">Test Name</span>
            <p className="font-semibold text-foreground truncate">{related.labResult.testName}</p>
          </div>
          <div>
            <span className="text-[10px] text-muted-foreground uppercase font-bold">Result Summary</span>
            <p className="text-muted-foreground text-xs line-clamp-2">{related.labResult.resultSummary}</p>
          </div>
        </div>
      ),
      actions: relatedLabResultExists && (
        <Link to={`/${currentRole}/lab-results/${related.labResult._id}`} state={{ appointmentId: record.appointment?._id || record.appointment }}>
          <Button variant="outline" size="sm" className="gap-1 cursor-pointer">
            <Eye className="h-3.5 w-3.5" /> View
          </Button>
        </Link>
      ),
    },
    {
      id: "invoice",
      title: "Invoice Link",
      icon: Receipt,
      exists: relatedInvoiceExists,
      emptyMessage: "No invoice generated.",
      summaryContent: relatedInvoiceExists && (
        <div className="space-y-1.5">
          <div>
            <span className="text-[10px] text-muted-foreground uppercase font-bold">Amount</span>
            <p className="font-semibold text-foreground">₹{related.invoice.amount}</p>
          </div>
          <div>
            <span className="text-[10px] text-muted-foreground uppercase font-bold">Status</span>
            <div className="mt-1">
              <Badge
                className={
                  related.invoice.status === "paid"
                    ? "bg-emerald-500/10 text-emerald-600 border-emerald-200/35 font-bold text-[10px]"
                    : "bg-amber-500/10 text-amber-600 border-amber-200/35 font-bold text-[10px]"
                }
              >
                {related.invoice.status.toUpperCase()}
              </Badge>
            </div>
          </div>
        </div>
      ),
      actions: relatedInvoiceExists && (
        <Link to={`/${currentRole}/invoices/${related.invoice._id}`} state={{ appointmentId: record.appointment?._id || record.appointment }}>
          <Button variant="outline" size="sm" className="gap-1 cursor-pointer">
            <Eye className="h-3.5 w-3.5" /> View
          </Button>
        </Link>
      ),
    },
  ]

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-4 sm:p-6">
      {/* Return Navigation button */}
      <Button
        variant="ghost"
        onClick={handleBackNavigation}
        className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-muted-foreground hover:text-primary transition-colors cursor-pointer"
      >
        <ArrowLeft className="h-4 w-4" /> Return to Workspace
      </Button>

      <div className="grid grid-cols-1 gap-6">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Card className="border border-border/40 shadow-2xs bg-card overflow-hidden rounded-2xl">
            <CardHeader className="p-6 border-b border-border/10 flex flex-row flex-wrap items-center justify-between gap-4 bg-muted/5">
              <div className="space-y-1">
                <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                  Clinical Record Workspace
                </span>
                <CardTitle className="text-lg sm:text-xl font-extrabold text-foreground flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Medical Record details
                </CardTitle>
              </div>
              {isEditing && (
                <Badge className="bg-amber-500/10 text-amber-600 border-amber-200/35 font-bold text-xs rounded-md">
                  Edit Mode
                </Badge>
              )}
            </CardHeader>

            <CardContent className="p-6 space-y-8">
              {/* Header Summary Metadata Block */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 p-5 border border-border/40 rounded-xl bg-muted/10 text-xs sm:text-sm">
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Visit Date</span>
                  <p className="font-extrabold text-foreground mt-0.5">{formatDate(record.visitDate)}</p>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Consultant</span>
                  <p className="font-extrabold text-foreground mt-0.5">
                    {doctor.name?.startsWith("Dr.") ? doctor.name : `Dr. ${doctor.name}`}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Patient</span>
                  <p className="font-extrabold text-foreground mt-0.5">{patient.name}</p>
                </div>
              </div>

              {/* Main Fields Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Clinical Notes (Left Column) */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Chief Complaint */}
                  <div className="space-y-1.5">
                    <span className="text-xs font-bold text-foreground uppercase tracking-wider">Chief Complaint</span>
                    {isEditing ? (
                      <textarea
                        disabled={updateMutation.isPending}
                        className={`w-full min-h-[90px] rounded-xl border px-3.5 py-2.5 text-sm bg-background outline-none transition-all focus:ring-1 focus:ring-primary ${
                          errors.chiefComplaint ? "border-destructive focus:ring-destructive" : "border-input"
                        }`}
                        {...register("chiefComplaint")}
                      />
                    ) : (
                      <p className="text-sm font-semibold text-foreground leading-relaxed bg-muted/15 p-4 rounded-xl border border-border/5">
                        {record.chiefComplaint}
                      </p>
                    )}
                    {errors.chiefComplaint && (
                      <p className="text-xs text-destructive flex items-center gap-1 font-medium mt-0.5">
                        <AlertCircle className="h-3.5 w-3.5" />
                        {errors.chiefComplaint.message}
                      </p>
                    )}
                  </div>

                  {/* Diagnosis */}
                  <div className="space-y-1.5">
                    <span className="text-xs font-bold text-foreground uppercase tracking-wider">Diagnosis</span>
                    {isEditing ? (
                      <textarea
                        disabled={updateMutation.isPending}
                        className="w-full min-h-[90px] rounded-xl border border-input px-3.5 py-2.5 text-sm bg-background outline-none focus:ring-1 focus:ring-primary"
                        {...register("diagnosis")}
                      />
                    ) : (
                      <p className="text-sm text-muted-foreground leading-relaxed bg-muted/15 p-4 rounded-xl border border-border/5 whitespace-pre-wrap">
                        {record.diagnosis || "No diagnosis logged."}
                      </p>
                    )}
                  </div>

                  {/* Treatment */}
                  <div className="space-y-1.5">
                    <span className="text-xs font-bold text-foreground uppercase tracking-wider">Treatment Plan</span>
                    {isEditing ? (
                      <textarea
                        disabled={updateMutation.isPending}
                        className="w-full min-h-[90px] rounded-xl border border-input px-3.5 py-2.5 text-sm bg-background outline-none focus:ring-1 focus:ring-primary"
                        {...register("treatment")}
                      />
                    ) : (
                      <p className="text-sm text-muted-foreground leading-relaxed bg-muted/15 p-4 rounded-xl border border-border/5 whitespace-pre-wrap">
                        {record.treatment || "No treatment plan logged."}
                      </p>
                    )}
                  </div>

                  {/* Notes */}
                  <div className="space-y-1.5">
                    <span className="text-xs font-bold text-foreground uppercase tracking-wider">Advice Notes</span>
                    {isEditing ? (
                      <textarea
                        disabled={updateMutation.isPending}
                        className="w-full min-h-[90px] rounded-xl border border-input px-3.5 py-2.5 text-sm bg-background outline-none focus:ring-1 focus:ring-primary"
                        {...register("notes")}
                      />
                    ) : (
                      <p className="text-sm text-muted-foreground leading-relaxed bg-muted/15 p-4 rounded-xl border border-border/5 whitespace-pre-wrap">
                        {record.notes || "No special instructions logged."}
                      </p>
                    )}
                  </div>
                </div>

                {/* Attachments Section (Right Column) */}
                <div className="space-y-6 border-t lg:border-t-0 lg:border-l border-dashed border-border/20 lg:pl-8">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-bold text-foreground uppercase tracking-wider">Attachments</span>
                    <span className="text-[10px] text-muted-foreground">Original diagnostic scan uploads or clinical reports.</span>
                  </div>

                  {/* Existing Attachments list (always visible) */}
                  <div className="space-y-2">
                    <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Existing Documents</span>
                    {(!record.attachments || record.attachments.length === 0) ? (
                      <p className="text-xs text-muted-foreground italic">No documents attached.</p>
                    ) : (
                      <div className="divide-y border border-border/20 rounded-xl overflow-hidden bg-card">
                        {record.attachments.map((file, idx) => (
                          <div key={idx} className="flex items-center justify-between p-3.5 text-xs bg-muted/5">
                            <div className="flex items-center gap-2 min-w-0 pr-4">
                              <FileText className="h-4 w-4 text-primary shrink-0" />
                              <span className="font-medium text-foreground truncate" title={file.originalName}>
                                {file.originalName}
                              </span>
                            </div>
                            <a
                              href={file.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex h-8 w-8 items-center justify-center text-muted-foreground hover:text-primary hover:bg-muted rounded-lg transition-colors"
                            >
                              <Download className="h-4 w-4" />
                            </a>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Staged New Attachments (Edit mode only) */}
                  {isEditing && (
                    <div className="space-y-3 pt-4 border-t border-dashed border-border/20">
                      <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Add New Files</span>
                      <div className="relative">
                        <input
                          type="file"
                          id="newAttachments"
                          multiple
                          disabled={updateMutation.isPending}
                          onChange={handleFileChange}
                          className="hidden"
                        />
                        <label
                          htmlFor="newAttachments"
                          className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-border/40 rounded-xl cursor-pointer hover:bg-muted/10 transition-all bg-card/50"
                        >
                          <Upload className="h-5 w-5 text-muted-foreground mb-1" />
                          <span className="text-xs font-semibold text-foreground">Click to upload files</span>
                        </label>
                      </div>

                      {newAttachments.length > 0 && (
                        <div className="divide-y border border-border/20 rounded-xl overflow-hidden bg-card">
                          {newAttachments.map((file, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 text-xs bg-muted/5">
                              <div className="flex items-center gap-2 min-w-0 pr-4">
                                <Upload className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                                <span className="font-semibold text-foreground truncate">{file.name}</span>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                disabled={updateMutation.isPending}
                                onClick={() => removeStagedAttachment(idx)}
                                className="h-6 w-6 text-muted-foreground hover:text-destructive rounded-lg cursor-pointer"
                              >
                                <X className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>

            {/* Form actions footer (changes layout based on permissions) */}
            <CardFooter className="px-6 py-4 bg-muted/20 border-t flex justify-end gap-3 flex-wrap">
              {isEditing ? (
                <>
                  {/* Cancel Editing */}
                  <Button
                    type="button"
                    variant="outline"
                    disabled={updateMutation.isPending}
                    onClick={() => {
                      setIsEditing(false)
                      setNewAttachments([])
                      reset()
                    }}
                    className="h-10 rounded-xl font-bold cursor-pointer"
                  >
                    Cancel
                  </Button>
                  {/* Save Changes */}
                  <Button
                    type="submit"
                    disabled={updateMutation.isPending}
                    className="h-10 px-6 rounded-xl font-bold gap-2 cursor-pointer shadow-xs min-w-[120px]"
                  >
                    {updateMutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </>
              ) : (
                <>
                  {/* Doctor actions view mode */}
                  {isDoctor && (
                    <>
                      {/* Delete record trigger */}
                      <Button
                        type="button"
                        variant="destructive"
                        disabled={deleteMutation.isPending}
                        onClick={() => setShowDeleteConfirm(true)}
                        className="h-10 rounded-xl font-bold gap-2 cursor-pointer shadow-xs mr-auto"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete Record
                      </Button>
                      {/* Edit record toggle */}
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsEditing(true)}
                        className="h-10 rounded-xl font-bold gap-2 cursor-pointer bg-background"
                      >
                        <Edit className="h-4 w-4" />
                        Edit Record
                      </Button>
                    </>
                  )}
                  {/* Return fallback */}
                  <Button
                    type="button"
                    variant={isDoctor ? "ghost" : "default"}
                    onClick={handleBackNavigation}
                    className="h-10 rounded-xl font-bold cursor-pointer"
                  >
                    Close View
                  </Button>
                </>
              )}
            </CardFooter>
          </Card>
        </form>
      </div>

      {/* Related Resources Grid Layout (Visually consistent with AppointmentDetails Consultation grid) */}
      <div className="space-y-4 pt-4">
        <div className="flex flex-col gap-1">
          <h3 className="text-base font-extrabold text-foreground uppercase tracking-wider">Related Healthcare Links</h3>
          <p className="text-xs text-muted-foreground">
            Quickly navigate to linked prescriptions, laboratory records, and billing sheets.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {relatedItems.map((item) => (
            <RelatedResourceCard
              key={item.id}
              title={item.title}
              icon={item.icon}
              exists={item.exists}
              emptyMessage={item.emptyMessage}
              summaryContent={item.summaryContent}
              actions={item.actions}
            />
          ))}
        </div>
      </div>

      {/* Deletion confirmation modal dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
          <Card className="max-w-md w-full border shadow-lg bg-card overflow-hidden">
            <CardHeader className="p-6 pb-4">
              <div className="flex gap-3 items-center text-destructive">
                <div className="h-10 w-10 rounded-full bg-destructive/10 flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <CardTitle className="text-lg font-bold text-foreground">Delete Medical Record</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6 py-2">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Are you sure you want to delete this medical record? This action is permanent, will remove all attached logs, and cannot be undone.
              </p>
            </CardContent>
            <CardFooter className="p-6 pt-4 flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleteMutation.isPending}
                className="h-10 rounded-xl font-bold cursor-pointer"
              >
                No, Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteConfirm}
                disabled={deleteMutation.isPending}
                className="h-10 rounded-xl font-bold gap-2 cursor-pointer shadow-xs"
              >
                {deleteMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Yes, Delete"
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  )
}
