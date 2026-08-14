import { useState, useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { useQuery } from "@tanstack/react-query"
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Stethoscope,
  FileText,
  AlertCircle,
  RefreshCw,
  Trash2,
  CalendarRange,
  Loader2,
  Info,
  CheckCircle2,
  AlertTriangle,
  Sliders,
  Pill,
  Beaker,
  Receipt,
  Plus,
  Eye,
  Edit,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select } from "@/components/ui/select"
import { patientApi } from "../api/patientApi"
import {
  useAppointmentDetails,
  useCancelAppointment,
  useRescheduleAppointment,
  useUpdateAppointmentStatus,
} from "../hooks/useAppointmentDetails"
import BookingCalendar from "../components/BookingCalendar"
import SlotPicker from "../components/SlotPicker"
import AppointmentTimeline from "../components/AppointmentTimeline"

// Configuration-driven status badge styles and labels
const STATUS_CONFIG = {
  pending: {
    label: "Pending Approval",
    className: "bg-amber-500/10 text-amber-600 border-amber-200/35 font-bold",
  },
  confirmed: {
    label: "Confirmed",
    className: "bg-emerald-500/10 text-emerald-600 border-emerald-200/35 font-bold",
  },
  completed: {
    label: "Completed",
    className: "bg-blue-500/10 text-blue-600 border-blue-200/35 font-bold",
  },
  pending_reschedule: {
    label: "Reschedule Pending",
    className: "bg-purple-500/10 text-purple-600 border-purple-200/35 font-bold",
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-destructive/10 text-destructive border-destructive/20 font-bold",
  },
}

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

function formatDateTime(dateTimeStr) {
  if (!dateTimeStr) return "N/A"
  try {
    const date = new Date(dateTimeStr)
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  } catch {
    return dateTimeStr
  }
}

function ConsultationCard({ title, icon: Icon, exists, emptyMessage, summaryContent, actions }) {
  return (
    <Card className="border border-border/40 shadow-2xs bg-card hover:shadow-xs transition-all duration-300 flex flex-col justify-between h-full min-h-[170px] overflow-hidden rounded-2xl">
      <CardHeader className="p-5 pb-3 border-b border-border/10 flex flex-row items-center justify-between gap-2 bg-muted/5">
        <CardTitle className="text-sm font-bold flex items-center gap-2 text-foreground">
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

export default function AppointmentDetails() {
  const { id } = useParams()
  const navigate = useNavigate()

  // Get active logged-in user role from Redux
  const { user: currentUser } = useSelector((state) => state.auth)
  const currentRole = currentUser?.role || "patient"

  // Local interaction states
  const [isRescheduling, setIsRescheduling] = useState(false)
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedSlot, setSelectedSlot] = useState("")
  const [showCancelConfirm, setShowCancelConfirm] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState("")

  // Fetch appointment details
  const {
    data: detailsData,
    isLoading: isDetailsLoading,
    isError: isDetailsError,
    error: detailsError,
    refetch: refetchDetails,
  } = useAppointmentDetails(id)

  const appointmentData = detailsData?.data || {}
  const appointment = appointmentData.appointment || {}
  const related = appointmentData.related || {}
  const doctor = appointment.doctor || {}
  const doctorId = doctor._id
  const patient = appointment.patient || {}
  const status = appointment.status || "pending"

  // Sync selected status state from details whenever details refetch or reload
  useEffect(() => {
    if (appointment?.status) {
      setSelectedStatus(appointment.status)
    }
  }, [appointment?.status])

  // Fetch doctor details (working days) dynamically only when rescheduling is active
  const { data: doctorDetailsData, isLoading: isDoctorLoading } = useQuery({
    queryKey: ["doctorDetails", doctorId],
    queryFn: () => patientApi.getDoctorDetails(doctorId),
    enabled: isRescheduling && !!doctorId,
    staleTime: 5 * 60 * 1000,
  })
  const doctorProfile = doctorDetailsData?.data?.doctor || {}
  const availability = doctorDetailsData?.data?.availability || {}
  const availableDays = availability.availableDays || []

  // Fetch slots dynamically only when rescheduling and date is chosen
  const { data: slotsData, isLoading: isSlotsLoading } = useQuery({
    queryKey: ["doctorSlots", doctorId, selectedDate],
    queryFn: () => patientApi.getAvailableSlots(doctorId, selectedDate),
    enabled: isRescheduling && !!doctorId && !!selectedDate,
    staleTime: 0,
  })
  const isBookable = slotsData?.data?.isBookable ?? true
  const blockedReason = slotsData?.data?.reason || ""
  const slots = slotsData?.data?.availableSlots || []

  // Mutations
  const cancelMutation = useCancelAppointment(id)
  const rescheduleMutation = useRescheduleAppointment(id)
  const updateStatusMutation = useUpdateAppointmentStatus(id)

  const handleDateSelect = (dateStr) => {
    setSelectedDate(dateStr)
    setSelectedSlot("") // Clear selected slot on date change to prevent stale picks
  }

  const handleCancelClick = () => {
    setShowCancelConfirm(true)
  }

  const handleConfirmCancel = () => {
    cancelMutation.mutate(null, {
      onSuccess: () => {
        setShowCancelConfirm(false)
      },
    })
  }

  const handleConfirmReschedule = () => {
    if (!selectedDate || !selectedSlot) return
    rescheduleMutation.mutate(
      {
        appointmentDate: selectedDate,
        bookedSlot: selectedSlot,
      },
      {
        onSuccess: () => {
          setIsRescheduling(false)
          setSelectedDate("")
          setSelectedSlot("")
        },
      }
    )
  }

  const handleSaveStatus = () => {
    updateStatusMutation.mutate({ status: selectedStatus })
  }

  // Derive back button route depending on user role
  const backRoute =
    currentRole === "doctor"
      ? "/doctor/appointments"
      : currentRole === "admin"
      ? "/admin/appointments"
      : "/patient/appointments"

  // Loading skeleton
  if (isDetailsLoading) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto p-4 sm:p-6 animate-pulse">
        <div className="h-5 w-40 bg-muted/65 rounded-md" />
        <Card className="border rounded-2xl h-[400px]" />
      </div>
    )
  }

  // Error retry display
  if (isDetailsError) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-center p-6 space-y-4 max-w-md mx-auto animate-fade-in">
        <div className="h-14 w-14 rounded-full bg-destructive/10 text-destructive flex items-center justify-center shadow-2xs">
          <AlertCircle className="h-7 w-7" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-foreground">Failed to Load Details</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {detailsError?.response?.data?.message || detailsError?.message || "We encountered an error loading the appointment information. Please try again."}
          </p>
        </div>
        <div className="flex gap-3 w-full">
          <Link to={backRoute} className="flex-1">
            <Button variant="outline" className="w-full rounded-xl cursor-pointer">
              Back to History
            </Button>
          </Link>
          <Button onClick={() => refetchDetails()} className="flex-1 gap-2 rounded-xl cursor-pointer">
            <RefreshCw className="h-4 w-4" /> Try Again
          </Button>
        </div>
      </div>
    )
  }

  const statusConfig = STATUS_CONFIG[status] || {
    label: status.replace("_", " ").toUpperCase(),
    className: "bg-muted text-muted-foreground border-border hover:bg-muted font-bold",
  }

  const canAction = status !== "completed" && status !== "cancelled"

  const medicalRecordExists = !!related?.medicalRecord
  const prescriptionExists = !!related?.prescription
  const labResultExists = !!related?.labResult
  const invoiceExists = !!related?.invoice

  const consultationItems = [
    {
      id: "medicalRecord",
      title: "Medical Record",
      icon: FileText,
      exists: medicalRecordExists,
      emptyMessage: currentRole === "doctor"
        ? "No medical record created for this consultation."
        : "No medical record has been created yet.",
      summaryContent: medicalRecordExists && (
        <div>
          <span className="text-[10px] text-muted-foreground uppercase font-bold">Visit Date</span>
          <p className="font-semibold text-foreground">{formatDate(related.medicalRecord.visitDate)}</p>
        </div>
      ),
      actions: (() => {
        const actions = []
        if (medicalRecordExists) {
          actions.push(
            <Link
              key="view"
              to={`/${currentRole}/medical-records/${related.medicalRecord._id}`}
            >
              <Button variant="outline" size="sm" className="gap-1 cursor-pointer">
                <Eye className="h-3.5 w-3.5" /> View
              </Button>
            </Link>
          )
          if (currentRole === "doctor") {
            actions.push(
              <Link
                key="edit"
                to={`/doctor/medical-records/${related.medicalRecord._id}`}
                state={{ edit: true, appointmentId: id }}
              >
                <Button variant="ghost" size="sm" className="gap-1 cursor-pointer">
                  <Edit className="h-3.5 w-3.5" /> Edit
                </Button>
              </Link>
            )
          }
        } else if (currentRole === "doctor") {
          actions.push(
            <Link
              key="create"
              to="/doctor/medical-records/create"
              state={{
                appointmentId: id,
                patientName: patient.name,
                appointmentDate: appointment.appointmentDate,
                bookedSlot: appointment.bookedSlot,
              }}
            >
              <Button size="sm" className="gap-1 cursor-pointer">
                <Plus className="h-3.5 w-3.5" /> Create Medical Record
              </Button>
            </Link>
          )
        }
        return actions.length > 0 ? actions : null
      })(),
    },
    {
      id: "prescription",
      title: "Prescription",
      icon: Pill,
      exists: prescriptionExists,
      emptyMessage: currentRole === "doctor"
        ? "No prescription created for this consultation."
        : "No prescription has been issued yet.",
      summaryContent: prescriptionExists && (
        <div>
          <span className="text-[10px] text-muted-foreground uppercase font-bold">Issued Date</span>
          <p className="font-semibold text-foreground">{formatDate(related.prescription.issuedAt)}</p>
        </div>
      ),
      actions: (() => {
        const actions = []
        if (prescriptionExists) {
          actions.push(
            <Link
              key="view"
              to={`/${currentRole}/prescriptions/${related.prescription._id}`}
            >
              <Button variant="outline" size="sm" className="gap-1 cursor-pointer">
                <Eye className="h-3.5 w-3.5" /> View
              </Button>
            </Link>
          )
          if (currentRole === "doctor") {
            actions.push(
              <Link
                key="edit"
                to={`/doctor/prescriptions/${related.prescription._id}`}
                state={{ edit: true, appointmentId: id }}
              >
                <Button variant="ghost" size="sm" className="gap-1 cursor-pointer">
                  <Edit className="h-3.5 w-3.5" /> Edit
                </Button>
              </Link>
            )
          }
        } else if (currentRole === "doctor") {
          actions.push(
            <Link
              key="create"
              to="/doctor/prescriptions/create"
              state={{
                appointmentId: id,
                patientName: patient.name,
                appointmentDate: appointment.appointmentDate,
                bookedSlot: appointment.bookedSlot,
              }}
            >
              <Button size="sm" className="gap-1 cursor-pointer">
                <Plus className="h-3.5 w-3.5" /> Create Prescription
              </Button>
            </Link>
          )
        }
        return actions.length > 0 ? actions : null
      })(),
    },
    {
      id: "labResult",
      title: "Lab Result",
      icon: Beaker,
      exists: labResultExists,
      emptyMessage: currentRole === "doctor"
        ? "No lab results requested for this consultation."
        : "No lab results have been requested.",
      summaryContent: labResultExists && (
        <div className="space-y-1.5">
          <div>
            <span className="text-[10px] text-muted-foreground uppercase font-bold">Test Name</span>
            <p className="font-semibold text-foreground">{related.labResult.testName}</p>
          </div>
          <div>
            <span className="text-[10px] text-muted-foreground uppercase font-bold">Result Summary</span>
            <p className="text-muted-foreground">{related.labResult.resultSummary}</p>
          </div>
        </div>
      ),
      actions: (() => {
        const actions = []
        if (labResultExists) {
          actions.push(
            <Link
              key="view"
              to={`/${currentRole}/lab-results/${related.labResult._id}`}
            >
              <Button variant="outline" size="sm" className="gap-1 cursor-pointer">
                <Eye className="h-3.5 w-3.5" /> View
              </Button>
            </Link>
          )
          if (currentRole === "doctor") {
            actions.push(
              <Link
                key="edit"
                to={`/doctor/lab-results/${related.labResult._id}`}
                state={{ edit: true, appointmentId: id }}
              >
                <Button variant="ghost" size="sm" className="gap-1 cursor-pointer">
                  <Edit className="h-3.5 w-3.5" /> Edit
                </Button>
              </Link>
            )
          }
        } else if (currentRole === "doctor") {
          actions.push(
            <Link
              key="create"
              to="/doctor/lab-results/create"
              state={{
                appointmentId: id,
                patientName: patient.name,
                appointmentDate: appointment.appointmentDate,
                bookedSlot: appointment.bookedSlot,
              }}
            >
              <Button size="sm" className="gap-1 cursor-pointer">
                <Plus className="h-3.5 w-3.5" /> Add Lab Result
              </Button>
            </Link>
          )
        }
        return actions.length > 0 ? actions : null
      })(),
    },
    {
      id: "invoice",
      title: "Invoice",
      icon: Receipt,
      exists: invoiceExists,
      emptyMessage: "No invoice has been generated.",
      summaryContent: invoiceExists && (
        <div className="space-y-1.5">
          <div>
            <span className="text-[10px] text-muted-foreground uppercase font-bold">Amount</span>
            <p className="font-semibold text-foreground">₹{related.invoice.amount}</p>
          </div>
          <div>
            <span className="text-[10px] text-muted-foreground uppercase font-bold">Payment Status</span>
            <div className="mt-1">
              <Badge
                className={
                  related.invoice.status === "paid"
                    ? "bg-emerald-500/10 text-emerald-600 border-emerald-200/35 font-bold"
                    : "bg-amber-500/10 text-amber-600 border-amber-200/35 font-bold"
                }
              >
                {related.invoice.status.toUpperCase()}
              </Badge>
            </div>
          </div>
        </div>
      ),
      actions: (() => {
        const actions = []
        if (invoiceExists) {
          actions.push(
            <Link
              key="view"
              to={`/${currentRole}/invoices/${related.invoice._id}`}
            >
              <Button variant="outline" size="sm" className="gap-1 cursor-pointer">
                <Eye className="h-3.5 w-3.5" /> View
              </Button>
            </Link>
          )
        } else if ((currentRole === "doctor" || currentRole === "admin") && status === "completed") {
          actions.push(
            <Link
              key="create"
              to={`/${currentRole}/invoices/create`}
              state={{
                appointmentId: id,
                patientName: patient.name,
                appointmentDate: appointment.appointmentDate,
                bookedSlot: appointment.bookedSlot,
                status: appointment.status,
              }}
            >
              <Button size="sm" className="gap-1 cursor-pointer">
                <Plus className="h-3.5 w-3.5" /> Create Invoice
              </Button>
            </Link>
          )
        }
        return actions.length > 0 ? actions : null
      })(),
    },
  ]

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-4 sm:p-6">
      {/* Role-based Back Link */}
      <Link to={backRoute} className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to Appointments
      </Link>

      <div className="grid grid-cols-1 gap-6">
        {/* Core Card Workspace */}
        <Card className="border shadow-2xs bg-card overflow-hidden">
          <CardHeader className="p-6 border-b flex flex-row flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                Appointment Reference Workspace
              </span>
              <CardTitle className="text-lg sm:text-xl font-extrabold text-foreground flex items-center gap-2">
                Consultation details
              </CardTitle>
            </div>
            <Badge className={`text-xs px-3 py-1 rounded-md border transition-all ${statusConfig.className}`}>
              {statusConfig.label}
            </Badge>
          </CardHeader>
          <CardContent className="p-6 space-y-8">
            {/* Status Timeline */}
            <AppointmentTimeline status={status} />

            {/* Appointment Status Management (Doctors & Admins only) */}
            {(currentRole === "doctor" || currentRole === "admin") && (
              <div className="pt-6 border-t border-dashed space-y-4">
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <Sliders className="h-4 w-4 text-primary" /> Status Management
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Update the appointment status to reflect consultation progress.
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-end gap-4 max-w-xl">
                  {/* Current Status Selector */}
                  <div className="space-y-1.5 flex-1">
                    <span className="text-[10px] text-muted-foreground uppercase font-bold">
                      Current Status: <span className="text-foreground font-semibold uppercase">{status}</span>
                    </span>
                    <Select
                      id="status"
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="w-full"
                    >
                      <option value="pending">Pending Approval</option>
                      <option value="pending_reschedule">Reschedule Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </Select>
                  </div>

                  {/* Save Status Button */}
                  <Button
                    onClick={handleSaveStatus}
                    disabled={selectedStatus === status || updateStatusMutation.isPending}
                    className="h-10 px-6 rounded-xl font-bold gap-2 cursor-pointer shadow-xs shrink-0"
                  >
                    {updateStatusMutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Status"
                    )}
                  </Button>
                </div>
              </div>
            )}

            {/* Information Grid */}
            <div className="pt-6 border-t border-dashed space-y-6">
              <h4 className="text-sm font-bold text-foreground">Appointment Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 text-sm">
                {/* Doctor Details */}
                <div className="flex gap-3 items-start">
                  <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Stethoscope className="h-4.5 w-4.5" />
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-muted-foreground uppercase font-bold">Doctor Name</span>
                    <p className="font-extrabold text-foreground">
                      {doctor.name?.startsWith("Dr.") ? doctor.name : `Dr. ${doctor.name}`}
                    </p>
                  </div>
                </div>

                {/* Patient Details */}
                <div className="flex gap-3 items-start">
                  <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <User className="h-4.5 w-4.5" />
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-muted-foreground uppercase font-bold">Patient Name</span>
                    <p className="font-extrabold text-foreground">{patient.name}</p>
                  </div>
                </div>

                {/* Date */}
                <div className="flex gap-3 items-start">
                  <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Calendar className="h-4.5 w-4.5" />
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-muted-foreground uppercase font-bold">Schedule Date</span>
                    <p className="font-semibold text-foreground">{formatDate(appointment.appointmentDate)}</p>
                  </div>
                </div>

                {/* Time Slot */}
                <div className="flex gap-3 items-start">
                  <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Clock className="h-4.5 w-4.5" />
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-muted-foreground uppercase font-bold">Schedule Time Slot</span>
                    <p className="font-semibold text-foreground">{formatTime12Hour(appointment.bookedSlot)}</p>
                  </div>
                </div>

                {/* Reason */}
                <div className="flex gap-3 items-start md:col-span-2">
                  <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <FileText className="h-4.5 w-4.5" />
                  </div>
                  <div className="space-y-0.5 min-w-0 flex-1">
                    <span className="text-[10px] text-muted-foreground uppercase font-bold">Reason for Visit</span>
                    <p className="text-muted-foreground leading-relaxed pr-4 whitespace-pre-wrap">{appointment.reason}</p>
                  </div>
                </div>

                {/* Notes */}
                <div className="flex gap-3 items-start md:col-span-2">
                  <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Info className="h-4.5 w-4.5" />
                  </div>
                  <div className="space-y-0.5 min-w-0 flex-1">
                    <span className="text-[10px] text-muted-foreground uppercase font-bold">Additional Notes</span>
                    <p className="text-muted-foreground leading-relaxed pr-4 whitespace-pre-wrap">
                      {appointment.notes || "No special instructions or comments provided."}
                    </p>
                  </div>
                </div>

                {/* Reminder Status */}
                <div className="flex gap-3 items-start">
                  <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <CheckCircle2 className="h-4.5 w-4.5" />
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-muted-foreground uppercase font-bold">Reminder Status</span>
                    <p className="font-semibold text-foreground">
                      {appointment.reminderSent ? "Sent successfully" : "Pending delivery"}
                    </p>
                  </div>
                </div>

                {/* Timestamps */}
                <div className="flex gap-3 items-start md:col-span-2 py-2 border-t border-dashed mt-4">
                  <div className="text-xs text-muted-foreground flex flex-wrap gap-x-6 gap-y-1">
                    <span>Created: <span className="text-foreground/80 font-medium">{formatDateTime(appointment.createdAt)}</span></span>
                    <span>Last Updated: <span className="text-foreground/80 font-medium">{formatDateTime(appointment.updatedAt)}</span></span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>

          {/* Action Row Panel */}
          {canAction && (
            <CardFooter className="px-6 py-4 bg-muted/20 border-t flex justify-end gap-3 flex-wrap">
              {/* Cancel Action */}
              <Button
                onClick={handleCancelClick}
                disabled={cancelMutation.isPending}
                variant="destructive"
                className="h-10 rounded-xl font-bold gap-2 cursor-pointer shadow-xs"
              >
                {cancelMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Cancelling...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4" />
                    Cancel Appointment
                  </>
                )}
              </Button>

              {/* Reschedule Toggle */}
              <Button
                onClick={() => setIsRescheduling(!isRescheduling)}
                variant="outline"
                className="h-10 rounded-xl font-bold gap-2 cursor-pointer bg-background"
              >
                <CalendarRange className="h-4 w-4" />
                {isRescheduling ? "Close Reschedule Panel" : "Reschedule Appointment"}
              </Button>
            </CardFooter>
          )}
        </Card>

        {/* Collapsible Reschedule Panel (expanded only when requested) */}
        {isRescheduling && canAction && (
          <Card className="border shadow-2xs bg-card animate-fade-in">
            <CardHeader className="p-6 border-b">
              <CardTitle className="text-base font-extrabold text-foreground flex items-center gap-2">
                <CalendarRange className="h-4.5 w-4.5 text-primary" />
                Reschedule Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* Step 1: Calendar */}
              {isDoctorLoading ? (
                <div className="h-32 bg-muted/40 animate-pulse rounded-xl" />
              ) : (
                <BookingCalendar
                  availableDays={availableDays}
                  selectedDate={selectedDate}
                  onDateSelect={handleDateSelect}
                />
              )}

              {/* Step 2: Slot Picker (fetched and visible only after a date is selected) */}
              {selectedDate && (
                <div className="pt-6 border-t border-dashed">
                  <SlotPicker
                    slots={slots}
                    isBookable={isBookable}
                    blockedReason={blockedReason}
                    selectedSlot={selectedSlot}
                    onSlotSelect={setSelectedSlot}
                    isLoading={isSlotsLoading}
                  />
                </div>
              )}
            </CardContent>

            {/* Confirm Reschedule footer action */}
            {selectedDate && selectedSlot && isBookable && (
              <CardFooter className="px-6 py-4 bg-muted/20 border-t flex justify-end">
                <Button
                  onClick={handleConfirmReschedule}
                  disabled={rescheduleMutation.isPending}
                  className="w-full sm:w-auto h-10 rounded-xl font-bold gap-2 cursor-pointer"
                >
                  {rescheduleMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Rescheduling...
                    </>
                  ) : (
                    "Confirm Reschedule"
                  )}
                </Button>
              </CardFooter>
            )}
          </Card>
        )}

        {/* Consultation Summary Workspace extension */}
        <div className="space-y-4 pt-4">
          <div className="flex flex-col gap-1">
            <h3 className="text-lg font-extrabold text-foreground">Consultation Summary</h3>
            <p className="text-xs text-muted-foreground">
              Manage clinical records, prescriptions, lab tests, and billing invoices.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {consultationItems.map((item) => (
              <ConsultationCard
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
      </div>

      {/* Cancellation confirmation modal dialog overlay */}
      {showCancelConfirm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
          <Card className="max-w-md w-full border shadow-lg bg-card overflow-hidden">
            <CardHeader className="p-6 pb-4">
              <div className="flex gap-3 items-center text-destructive">
                <div className="h-10 w-10 rounded-full bg-destructive/10 flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <CardTitle className="text-lg font-bold text-foreground">Cancel Consultation</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6 py-2">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Are you sure you want to cancel your consultation with{" "}
                <span className="font-extrabold text-foreground">
                  {doctor.name?.startsWith("Dr.") ? doctor.name : `Dr. ${doctor.name}`}
                </span>{" "}
                on <span className="font-semibold text-foreground">{formatDate(appointment.appointmentDate)}</span>? This action is permanent and cannot be undone.
              </p>
            </CardContent>
            <CardFooter className="p-6 pt-4 flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => setShowCancelConfirm(false)}
                disabled={cancelMutation.isPending}
                className="h-10 rounded-xl font-bold cursor-pointer"
              >
                No, Keep it
              </Button>
              <Button
                variant="destructive"
                onClick={handleConfirmCancel}
                disabled={cancelMutation.isPending}
                className="h-10 rounded-xl font-bold gap-2 cursor-pointer shadow-xs"
              >
                {cancelMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Cancelling...
                  </>
                ) : (
                  "Yes, Cancel"
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  )
}
