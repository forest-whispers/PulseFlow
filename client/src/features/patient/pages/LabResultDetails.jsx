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
  Beaker,
  AlertCircle,
  AlertTriangle,
  Trash2,
  Edit,
  Download,
  Loader2,
  FileText,
  Upload,
  X,
  CheckCircle2,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  useLabResultDetails,
  useUpdateLabResult,
  useDeleteLabResult,
} from "../hooks/useLabResults"

const labResultFormSchema = z.object({
  testName: z.string().min(1, "Test Name is required"),
  resultSummary: z.string().min(1, "Result Summary is required"),
})

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

export default function LabResultDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()

  // Authenticated user check
  const { user } = useSelector((state) => state.auth)
  const currentRole = user?.role || "patient"
  const isDoctor = currentRole === "doctor"

  // Component local states
  const [isEditing, setIsEditing] = useState(location.state?.edit || false)
  const [newReportFile, setNewReportFile] = useState(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  // Fetch Details
  const {
    data: detailsData,
    isLoading,
    isError,
    error,
    refetch,
  } = useLabResultDetails(id)

  const labResult = detailsData?.data || {}
  const doctor = labResult.doctor || {}
  const patient = labResult.patient || {}
  const medicalRecord = labResult.medicalRecord || {}

  // Mutations
  const updateMutation = useUpdateLabResult(id)
  const deleteMutation = useDeleteLabResult(id)

  // Form Setup
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(labResultFormSchema),
    defaultValues: {
      testName: "",
      resultSummary: "",
    },
  })

  // Synchronize form values when lab result loads
  useEffect(() => {
    if (labResult && Object.keys(labResult).length > 0) {
      reset({
        testName: labResult.testName || "",
        resultSummary: labResult.resultSummary || "",
      })
    }
  }, [labResult, reset])

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setNewReportFile(e.target.files[0])
    }
  }

  const onSubmit = (values) => {
    const formData = new FormData()
    formData.append("testName", values.testName)
    formData.append("resultSummary", values.resultSummary)
    if (newReportFile) {
      formData.append("report", newReportFile)
    }

    updateMutation.mutate(formData, {
      onSuccess: () => {
        setIsEditing(false)
        setNewReportFile(null)
      },
    })
  }

  const handleDeleteConfirm = () => {
    deleteMutation.mutate(null, {
      onSuccess: () => {
        setShowDeleteConfirm(false)
        const medicalRecordId = location.state?.medicalRecordId || medicalRecord._id || medicalRecord
        const appointmentId = location.state?.appointmentId || labResult.appointment

        if (medicalRecordId) {
          navigate(`/doctor/medical-records/${medicalRecordId}`, { state: { appointmentId } })
        } else if (appointmentId) {
          navigate(`/doctor/appointments/${appointmentId}`)
        } else {
          navigate("/doctor/appointments")
        }
      },
    })
  }

  // Handle back navigation depending on role and history context
  const handleBackNavigation = () => {
    const medicalRecordId = location.state?.medicalRecordId || medicalRecord._id || medicalRecord
    const appointmentId = location.state?.appointmentId || labResult.appointment

    if (medicalRecordId) {
      navigate(`/${currentRole}/medical-records/${medicalRecordId}`, { state: { appointmentId } })
    } else if (appointmentId) {
      navigate(`/${currentRole}/appointments/${appointmentId}`)
    } else {
      navigate(
        currentRole === "doctor"
          ? "/doctor/appointments"
          : currentRole === "admin"
          ? "/admin/lab-results"
          : "/patient/lab-results"
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
            {error?.response?.data?.message || error?.message || "We encountered an error loading this lab result. Please try again."}
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

  const existingReportFilename = labResult.report?.originalName || "report.pdf"

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
                  Laboratory Record Workspace
                </span>
                <CardTitle className="text-lg sm:text-xl font-extrabold text-foreground flex items-center gap-2">
                  <Beaker className="h-5 w-5 text-primary" />
                  Lab Result details
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
                  <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Generated Date</span>
                  <p className="font-extrabold text-foreground mt-0.5">{formatDate(labResult.createdAt)}</p>
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
                {/* Clinical Notes & Values (Left Column) */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Test Name */}
                  <div className="space-y-1.5">
                    <span className="text-xs font-bold text-foreground uppercase tracking-wider">Test Name *</span>
                    {isEditing ? (
                      <input
                        type="text"
                        disabled={updateMutation.isPending}
                        className={`w-full h-11 rounded-xl border px-3.5 text-sm bg-background outline-none transition-all focus:ring-1 focus:ring-primary ${
                          errors.testName ? "border-destructive focus:ring-destructive" : "border-input"
                        }`}
                        {...register("testName")}
                      />
                    ) : (
                      <p className="text-sm font-extrabold text-foreground leading-relaxed bg-muted/15 p-4 rounded-xl border border-border/5">
                        {labResult.testName}
                      </p>
                    )}
                    {errors.testName && (
                      <p className="text-xs text-destructive flex items-center gap-1 font-medium mt-0.5">
                        <AlertCircle className="h-3.5 w-3.5" />
                        {errors.testName.message}
                      </p>
                    )}
                  </div>

                  {/* Result Summary */}
                  <div className="space-y-1.5">
                    <span className="text-xs font-bold text-foreground uppercase tracking-wider">Result Summary *</span>
                    {isEditing ? (
                      <textarea
                        disabled={updateMutation.isPending}
                        className={`w-full min-h-[140px] rounded-xl border px-3.5 py-2.5 text-sm bg-background outline-none transition-all focus:ring-1 focus:ring-primary ${
                          errors.resultSummary ? "border-destructive focus:ring-destructive" : "border-input"
                        }`}
                        {...register("resultSummary")}
                      />
                    ) : (
                      <p className="text-sm text-muted-foreground leading-relaxed bg-muted/15 p-4 rounded-xl border border-border/5 whitespace-pre-wrap">
                        {labResult.resultSummary}
                      </p>
                    )}
                    {errors.resultSummary && (
                      <p className="text-xs text-destructive flex items-center gap-1 font-medium mt-0.5">
                        <AlertCircle className="h-3.5 w-3.5" />
                        {errors.resultSummary.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Report Attachment Section (Right Column) */}
                <div className="space-y-6 border-t lg:border-t-0 lg:border-l border-dashed border-border/20 lg:pl-8">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-bold text-foreground uppercase tracking-wider">Lab Report</span>
                    <span className="text-[10px] text-muted-foreground">Original diagnostic outcome document file.</span>
                  </div>

                  {/* Existing Report Link (visible to patient and doctor) */}
                  <div className="space-y-2">
                    <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Currently Stored File</span>
                    {!labResult.report ? (
                      <p className="text-xs text-muted-foreground italic">No document file attached.</p>
                    ) : (
                      <div className="p-3.5 border border-border/20 rounded-xl bg-card flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2 min-w-0 pr-4">
                          <FileText className="h-4 w-4 text-primary shrink-0" />
                          <span 
                            className="font-medium text-foreground truncate select-all"
                            title={existingReportFilename}
                          >
                            {existingReportFilename}
                          </span>
                        </div>
                        <a
                          href={labResult.report.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex h-8 w-8 items-center justify-center text-muted-foreground hover:text-primary hover:bg-muted rounded-lg transition-colors"
                        >
                          <Download className="h-4 w-4" />
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Staged Replacement Document File (Edit Mode Only) */}
                  {isEditing && (
                    <div className="space-y-3 pt-4 border-t border-dashed border-border/20">
                      <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Select Replacement File</span>
                      <div className="relative">
                        <input
                          type="file"
                          id="newReportFile"
                          disabled={updateMutation.isPending}
                          onChange={handleFileChange}
                          className="hidden"
                        />
                        <label
                          htmlFor="newReportFile"
                          className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-border/40 rounded-xl cursor-pointer hover:bg-muted/10 transition-all bg-card/50"
                        >
                          <Upload className="h-5 w-5 text-muted-foreground mb-1" />
                          <span className="text-xs font-semibold text-foreground">Click to upload report</span>
                        </label>
                      </div>

                      {newReportFile && (
                        <div className="p-3 border border-amber-200/40 rounded-xl bg-amber-500/5 flex items-center justify-between text-xs animate-fade-in">
                          <div className="flex items-center gap-2 min-w-0 pr-4">
                            <Upload className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                            <div className="min-w-0">
                              <p className="font-semibold text-foreground truncate">{newReportFile.name}</p>
                              <p className="text-[10px] text-muted-foreground">Will replace the current report on save</p>
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            disabled={updateMutation.isPending}
                            onClick={() => setNewReportFile(null)}
                            className="h-6 w-6 text-muted-foreground hover:text-destructive rounded-lg cursor-pointer"
                          >
                            <X className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Medical Record Context Summary (reusing compact section style) */}
                  <div className="space-y-3 pt-4 border-t border-dashed border-border/20">
                    <span className="text-xs font-bold text-foreground uppercase tracking-wider">Consultation Context</span>
                    <Card className="border border-border/40 shadow-2xs bg-muted/5 rounded-xl overflow-hidden">
                      <CardHeader className="p-4 border-b border-border/10 bg-muted/10">
                        <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Linked Medical Record</span>
                      </CardHeader>
                      <CardContent className="p-4 space-y-4 text-xs sm:text-sm">
                        <div>
                          <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Visit Date</span>
                          <p className="font-bold text-foreground mt-0.5">{formatDate(medicalRecord.visitDate)}</p>
                        </div>
                        <div>
                          <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Chief Complaint</span>
                          <p className="text-muted-foreground text-xs mt-0.5 leading-relaxed line-clamp-3">
                            {medicalRecord.chiefComplaint || "No complaint logged."}
                          </p>
                        </div>
                      </CardContent>
                      <CardFooter className="p-4 pt-0 border-t border-border/10 bg-muted/5 pt-3.5 flex justify-end">
                        {medicalRecord._id && (
                          <Link 
                            to={`/${currentRole}/medical-records/${medicalRecord._id}`} 
                            state={{ appointmentId: labResult.appointment }}
                          >
                            <Button type="button" variant="outline" size="sm" className="gap-1 rounded-lg text-xs cursor-pointer">
                              <FileText className="h-3.5 w-3.5" /> View Medical Record
                            </Button>
                          </Link>
                        )}
                      </CardFooter>
                    </Card>
                  </div>
                </div>
              </div>
            </CardContent>

            {/* Form actions footer */}
            <CardFooter className="px-6 py-4 bg-muted/20 border-t flex justify-end gap-3 flex-wrap">
              {isEditing ? (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={updateMutation.isPending}
                    onClick={() => {
                      setIsEditing(false)
                      setNewReportFile(null)
                      reset()
                    }}
                    className="h-10 rounded-xl font-bold cursor-pointer"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={updateMutation.isPending}
                    className="h-10 px-6 rounded-xl font-bold gap-2 cursor-pointer shadow-xs min-w-[125px]"
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
                  {isDoctor && (
                    <>
                      <Button
                        type="button"
                        variant="destructive"
                        disabled={deleteMutation.isPending}
                        onClick={() => setShowDeleteConfirm(true)}
                        className="h-10 rounded-xl font-bold gap-2 cursor-pointer shadow-xs mr-auto"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete Lab Result
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsEditing(true)}
                        className="h-10 rounded-xl font-bold gap-2 cursor-pointer bg-background"
                      >
                        <Edit className="h-4 w-4" />
                        Edit Lab Result
                      </Button>
                    </>
                  )}
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

      {/* Deletion confirmation modal dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
          <Card className="max-w-md w-full border shadow-lg bg-card overflow-hidden">
            <CardHeader className="p-6 pb-4">
              <div className="flex gap-3 items-center text-destructive">
                <div className="h-10 w-10 rounded-full bg-destructive/10 flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <CardTitle className="text-lg font-bold text-foreground">Delete Lab Result</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6 py-2">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Are you sure you want to delete this lab result? This action is permanent, will remove the uploaded diagnostic scan document, and cannot be undone.
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
