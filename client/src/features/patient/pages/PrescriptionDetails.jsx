import { useState, useEffect } from "react"
import { useParams, useNavigate, useLocation, Link } from "react-router-dom"
import { useSelector } from "react-redux"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  ArrowLeft,
  Calendar,
  User,
  Stethoscope,
  Pill,
  AlertCircle,
  AlertTriangle,
  Trash2,
  Edit,
  Eye,
  Plus,
  Loader2,
  FileText,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  usePrescriptionDetails,
  useUpdatePrescription,
  useDeletePrescription,
} from "../hooks/usePrescriptions"

const prescriptionFormSchema = z.object({
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

export default function PrescriptionDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()

  // Authenticated user check
  const { user } = useSelector((state) => state.auth)
  const currentRole = user?.role || "patient"
  const isDoctor = currentRole === "doctor"

  // Component local states
  const [isEditing, setIsEditing] = useState(location.state?.edit || false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  // Fetch Details
  const {
    data: detailsData,
    isLoading,
    isError,
    error,
    refetch,
  } = usePrescriptionDetails(id)

  const prescription = detailsData?.data || {}
  const doctor = prescription.doctor || {}
  const patient = prescription.patient || {}
  const medicalRecord = prescription.medicalRecord || {}

  // Mutations
  const updateMutation = useUpdatePrescription(id)
  const deleteMutation = useDeletePrescription(id)

  // Form Setup
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(prescriptionFormSchema),
    defaultValues: {
      notes: "",
      medications: [],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: "medications",
  })

  // Synchronize form values when prescription loads
  useEffect(() => {
    if (prescription && Object.keys(prescription).length > 0) {
      reset({
        notes: prescription.notes || "",
        medications: prescription.medications || [],
      })
    }
  }, [prescription, reset])

  const onSubmit = (values) => {
    const payload = {
      notes: values.notes || "",
      medications: values.medications,
    }
    updateMutation.mutate(payload, {
      onSuccess: () => {
        setIsEditing(false)
      },
    })
  }

  const handleDeleteConfirm = () => {
    deleteMutation.mutate(null, {
      onSuccess: () => {
        setShowDeleteConfirm(false)
        const medicalRecordId = location.state?.medicalRecordId || medicalRecord._id || medicalRecord
        const appointmentId = location.state?.appointmentId || prescription.appointment
        
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
    const appointmentId = location.state?.appointmentId || prescription.appointment

    if (medicalRecordId) {
      navigate(`/${currentRole}/medical-records/${medicalRecordId}`, { state: { appointmentId } })
    } else if (appointmentId) {
      navigate(`/${currentRole}/appointments/${appointmentId}`)
    } else {
      navigate(currentRole === "doctor" ? "/doctor/appointments" : "/patient/prescriptions")
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
            {error?.response?.data?.message || error?.message || "We encountered an error loading this prescription. Please try again."}
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
                  Prescription Workspace
                </span>
                <CardTitle className="text-lg sm:text-xl font-extrabold text-foreground flex items-center gap-2">
                  <Pill className="h-5 w-5 text-primary" />
                  Prescription details
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
                  <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Issued Date</span>
                  <p className="font-extrabold text-foreground mt-0.5">{formatDate(prescription.createdAt)}</p>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Prescriber</span>
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
                {/* Prescription Notes & Medications (Left Column) */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Notes */}
                  <div className="space-y-1.5">
                    <span className="text-xs font-bold text-foreground uppercase tracking-wider">Prescription Notes</span>
                    {isEditing ? (
                      <textarea
                        disabled={updateMutation.isPending}
                        className="w-full min-h-[90px] rounded-xl border border-input px-3.5 py-2.5 text-sm bg-background outline-none focus:ring-1 focus:ring-primary"
                        {...register("notes")}
                      />
                    ) : (
                      <p className="text-sm text-muted-foreground leading-relaxed bg-muted/15 p-4 rounded-xl border border-border/5 whitespace-pre-wrap">
                        {prescription.notes || "No special instructions logged."}
                      </p>
                    )}
                  </div>

                  {/* Medications List */}
                  <div className="space-y-4 pt-4 border-t border-dashed border-border/20">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-xs font-bold text-foreground uppercase tracking-wider">Medications *</span>
                        {isEditing && (
                          <span className="text-[10px] text-muted-foreground">Add medicines and their precise administration dosage.</span>
                        )}
                      </div>
                      {isEditing && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          disabled={updateMutation.isPending}
                          onClick={() => append({ medicineName: "", dosage: "", frequency: "", duration: "", instructions: "" })}
                          className="gap-1 rounded-xl font-bold cursor-pointer"
                        >
                          <Plus className="h-3.5 w-3.5" /> Add Medicine
                        </Button>
                      )}
                    </div>

                    {errors.medications?.root && (
                      <p className="text-xs text-destructive flex items-center gap-1 font-medium bg-destructive/5 p-2 rounded-lg border border-destructive/10">
                        <AlertCircle className="h-3.5 w-3.5" />
                        {errors.medications.root.message}
                      </p>
                    )}

                    {/* Medications render */}
                    <div className="space-y-4">
                      {isEditing ? (
                        // Edit Mode List (preserving array sequence order)
                        fields.map((field, index) => (
                          <div key={field.id} className="p-5 border border-border/30 rounded-xl bg-muted/5 relative space-y-4 animate-fade-in">
                            <div className="flex justify-between items-center pb-2 border-b border-border/10">
                              <span className="text-xs font-bold text-foreground uppercase tracking-wider">Medication #{index + 1}</span>
                              {fields.length > 1 && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  disabled={updateMutation.isPending}
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
                                  disabled={updateMutation.isPending}
                                  placeholder="e.g. Paracetamol"
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
                                  disabled={updateMutation.isPending}
                                  placeholder="e.g. 500mg"
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
                                  disabled={updateMutation.isPending}
                                  placeholder="e.g. Twice a day"
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
                                  disabled={updateMutation.isPending}
                                  placeholder="e.g. 5 days"
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
                              <label className="text-[10px] font-bold text-foreground uppercase tracking-wider">Instructions</label>
                              <input
                                  type="text"
                                  disabled={updateMutation.isPending}
                                  placeholder="e.g. Take after meals"
                                  className="w-full h-10 rounded-lg border border-input px-3 text-xs bg-background outline-none focus:ring-1 focus:ring-primary"
                                  {...register(`medications.${index}.instructions`)}
                                />
                            </div>
                          </div>
                        ))
                      ) : (
                        // View Mode List (displaying clean medication rows)
                        (!prescription.medications || prescription.medications.length === 0) ? (
                          <p className="text-xs text-muted-foreground italic">No medicines prescribed.</p>
                        ) : (
                          prescription.medications.map((med, index) => (
                            <div key={index} className="p-4 border border-border/20 rounded-xl bg-muted/5 flex flex-col gap-3">
                              <div className="flex flex-wrap items-center justify-between border-b border-border/5 pb-2">
                                <span className="text-sm font-extrabold text-foreground flex items-center gap-1.5">
                                  <Pill className="h-4 w-4 text-primary shrink-0" />
                                  {med.medicineName}
                                </span>
                                <Badge variant="outline" className="text-[10px] font-bold bg-muted/40 border-border/40">
                                  {med.dosage}
                                </Badge>
                              </div>
                              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                                <div>
                                  <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Frequency</span>
                                  <p className="font-semibold text-foreground mt-0.5">{med.frequency}</p>
                                </div>
                                <div>
                                  <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Duration</span>
                                  <p className="font-semibold text-foreground mt-0.5">{med.duration}</p>
                                </div>
                                <div className="col-span-2 sm:col-span-1">
                                  <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Instructions</span>
                                  <p className="text-muted-foreground mt-0.5">{med.instructions || "None"}</p>
                                </div>
                              </div>
                            </div>
                          ))
                        )
                      )}
                    </div>
                  </div>
                </div>

                {/* Medical Record Context (Right Column) */}
                <div className="space-y-6 border-t lg:border-t-0 lg:border-l border-dashed border-border/20 lg:pl-8">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-bold text-foreground uppercase tracking-wider">Consultation Context</span>
                    <span className="text-[10px] text-muted-foreground">The clinical log associated with this prescription.</span>
                  </div>

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
                          state={{ appointmentId: prescription.appointment }}
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
            </CardContent>

            {/* Form Actions Footer */}
            <CardFooter className="px-6 py-4 bg-muted/20 border-t flex justify-end gap-3 flex-wrap">
              {isEditing ? (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={updateMutation.isPending}
                    onClick={() => {
                      setIsEditing(false)
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
                        Delete Prescription
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsEditing(true)}
                        className="h-10 rounded-xl font-bold gap-2 cursor-pointer bg-background"
                      >
                        <Edit className="h-4 w-4" />
                        Edit Prescription
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
                <CardTitle className="text-lg font-bold text-foreground">Delete Prescription</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6 py-2">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Are you sure you want to delete this prescription? This action is permanent, will remove all prescribed medication administration guidelines, and cannot be undone.
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
