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
  Receipt,
  AlertCircle,
  AlertTriangle,
  Trash2,
  Edit,
  Eye,
  Loader2,
  FileText,
  CreditCard,
  CheckCircle2,
  Clock,
  IndianRupee,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  useInvoiceDetails,
  useUpdateInvoice,
  useDeleteInvoice,
  useCreateCheckoutSession,
} from "../hooks/useInvoices"

const editInvoiceSchema = z.object({
  amount: z.coerce.number().positive("Amount must be a positive number"),
  description: z.string().trim().max(1000, "Description cannot exceed 1000 characters").optional(),
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

export default function InvoiceDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()

  // Authenticated user check
  const { user } = useSelector((state) => state.auth)
  const currentRole = user?.role || "patient"
  const isDoctor = currentRole === "doctor"
  const isAdmin = currentRole === "admin"
  const isStaff = isDoctor || isAdmin
  const isPatient = currentRole === "patient"

  // Component local states
  const [isEditing, setIsEditing] = useState(location.state?.edit || false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  // Fetch details
  const {
    data: detailsData,
    isLoading,
    isError,
    error,
    refetch,
  } = useInvoiceDetails(id)

  const invoice = detailsData?.data || {}
  const doctor = invoice.doctor || {}
  const patient = invoice.patient || {}
  const appointment = invoice.appointment || {}

  const isPending = invoice.status === "pending"
  const isPaid = invoice.status === "paid"

  // Mutations
  const updateMutation = useUpdateInvoice(id)
  const deleteMutation = useDeleteInvoice(id)
  const checkoutMutation = useCreateCheckoutSession()

  // Form setup
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(editInvoiceSchema),
    defaultValues: {
      amount: "",
      description: "",
    },
  })

  // Synchronize form values when invoice loads
  useEffect(() => {
    if (invoice && Object.keys(invoice).length > 0) {
      reset({
        amount: invoice.amount || "",
        description: invoice.description || "",
      })
    }
  }, [invoice, reset])

  const onSubmit = (values) => {
    const payload = {
      amount: values.amount,
      description: values.description || "",
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
        const appointmentId = location.state?.appointmentId || appointment._id || appointment
        if (appointmentId) {
          navigate(`/${currentRole}/appointments/${appointmentId}`)
        } else {
          navigate(
            currentRole === "doctor"
              ? "/doctor/appointments"
              : currentRole === "admin"
              ? "/admin/invoices"
              : "/patient/invoices"
          )
        }
      },
    })
  }

  const handlePayNow = () => {
    checkoutMutation.mutate(id, {
      onSuccess: (response) => {
        if (response.data?.checkoutUrl) {
          // Immediate browser redirect with no intermediate states
          window.location.href = response.data.checkoutUrl
        }
      },
    })
  }

  const handleBackNavigation = () => {
    const appointmentId = location.state?.appointmentId || appointment._id || appointment
    if (appointmentId) {
      navigate(`/${currentRole}/appointments/${appointmentId}`)
    } else {
      navigate(
        currentRole === "doctor"
          ? "/doctor/appointments"
          : currentRole === "admin"
          ? "/admin/invoices"
          : "/patient/invoices"
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
          <h3 className="text-xl font-bold text-foreground">Failed to Load Statement</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {error?.response?.data?.message || error?.message || "We encountered an error loading this statement. Please try again."}
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
      {/* Return Navigation */}
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
                  Billing statement
                </span>
                <CardTitle className="text-lg sm:text-xl font-extrabold text-foreground flex items-center gap-2">
                  <Receipt className="h-5 w-5 text-primary" />
                  Invoice Details
                </CardTitle>
              </div>
              {isEditing && (
                <Badge className="bg-amber-500/10 text-amber-600 border-amber-200/35 font-bold text-xs rounded-md">
                  Edit Mode
                </Badge>
              )}
            </CardHeader>

            <CardContent className="p-6 space-y-8">
              {/* Financial Header Block (highly prominent at the top) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 p-6 border border-primary/20 rounded-2xl bg-primary/5 text-xs sm:text-sm shadow-2xs">
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase font-extrabold tracking-wider">Amount Due</span>
                  <p className="text-2xl font-black text-primary flex items-center mt-1">
                    <IndianRupee className="h-5 w-5 shrink-0" />
                    {invoice.amount}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase font-extrabold tracking-wider">Payment Status</span>
                  <div className="mt-2.5">
                    <Badge
                      className={
                        isPaid
                          ? "bg-emerald-500/15 text-emerald-700 border-emerald-300/40 font-extrabold text-xs rounded-lg py-1 px-3 shadow-2xs"
                          : "bg-amber-500/15 text-amber-700 border-amber-300/40 font-extrabold text-xs rounded-lg py-1 px-3 shadow-2xs"
                      }
                    >
                      {invoice.status?.toUpperCase()}
                    </Badge>
                  </div>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase font-extrabold tracking-wider">Billing Type</span>
                  <p className="font-bold text-foreground text-sm uppercase mt-2.5">{invoice.paymentMethod || "stripe"}</p>
                </div>
                {isPaid && invoice.paidAt && (
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase font-extrabold tracking-wider">Settled At</span>
                    <p className="font-semibold text-foreground text-xs mt-2.5">{formatDate(invoice.paidAt)}</p>
                  </div>
                )}
              </div>

              {/* Core Information Section Columns */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Description & Timestamps (Left column) */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Amount (Form Input in Edit Mode) */}
                  {isEditing && (
                    <div className="space-y-1.5">
                      <span className="text-xs font-bold text-foreground uppercase tracking-wider">Amount (₹) *</span>
                      <input
                        type="number"
                        step="any"
                        disabled={updateMutation.isPending}
                        className={`w-full h-11 rounded-xl border px-3.5 text-sm bg-background outline-none transition-all focus:ring-1 focus:ring-primary ${
                          errors.amount ? "border-destructive focus:ring-destructive" : "border-input"
                        }`}
                        {...register("amount")}
                      />
                      {errors.amount && (
                        <p className="text-xs text-destructive flex items-center gap-1 font-medium mt-0.5">
                          <AlertCircle className="h-3.5 w-3.5" />
                          {errors.amount.message}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Description */}
                  <div className="space-y-1.5">
                    <span className="text-xs font-bold text-foreground uppercase tracking-wider">Billing Description</span>
                    {isEditing ? (
                      <textarea
                        disabled={updateMutation.isPending}
                        className={`w-full min-h-[120px] rounded-xl border px-3.5 py-2.5 text-sm bg-background outline-none transition-all focus:ring-1 focus:ring-primary ${
                          errors.description ? "border-destructive focus:ring-destructive" : "border-input"
                        }`}
                        {...register("description")}
                      />
                    ) : (
                      <p className="text-sm text-muted-foreground leading-relaxed bg-muted/15 p-4 rounded-xl border border-border/5 whitespace-pre-wrap">
                        {invoice.description || "No description logged."}
                      </p>
                    )}
                    {errors.description && (
                      <p className="text-xs text-destructive flex items-center gap-1 font-medium mt-0.5">
                        <AlertCircle className="h-3.5 w-3.5" />
                        {errors.description.message}
                      </p>
                    )}
                  </div>

                  {/* Timestamps */}
                  <div className="grid grid-cols-2 gap-4 text-[10px] text-muted-foreground border-t border-dashed border-border/20 pt-4">
                    <div>
                      <span className="font-bold uppercase tracking-wider">Statement Date</span>
                      <p className="mt-0.5">{formatDate(invoice.createdAt)}</p>
                    </div>
                    <div>
                      <span className="font-bold uppercase tracking-wider">Modified Date</span>
                      <p className="mt-0.5">{formatDate(invoice.updatedAt)}</p>
                    </div>
                  </div>
                </div>

                {/* Read-Only Appointment Context & Metadata (Right Column) */}
                <div className="space-y-6 border-t lg:border-t-0 lg:border-l border-dashed border-border/20 lg:pl-8">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-bold text-foreground uppercase tracking-wider">Billing Details</span>
                    <span className="text-[10px] text-muted-foreground">Contextual consultant and appointment records.</span>
                  </div>

                  {/* Consultant & Patient */}
                  <div className="space-y-3.5 p-4 border border-border/20 rounded-xl bg-card text-xs">
                    <div>
                      <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Consultant</span>
                      <p className="font-bold text-foreground mt-0.5">
                        {doctor.name?.startsWith("Dr.") ? doctor.name : `Dr. ${doctor.name}`}
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Patient</span>
                      <p className="font-bold text-foreground mt-0.5">{patient.name}</p>
                    </div>
                  </div>

                  {/* Read-Only Appointment Summary context */}
                  <div className="space-y-3">
                    <Card className="border border-border/40 shadow-2xs bg-muted/5 rounded-xl overflow-hidden">
                      <CardHeader className="p-4 border-b border-border/10 bg-muted/10">
                        <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Associated Appointment</span>
                      </CardHeader>
                      <CardContent className="p-4 space-y-4 text-xs sm:text-sm">
                        <div>
                          <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Visit Date</span>
                          <p className="font-bold text-foreground mt-0.5">{formatDate(appointment.appointmentDate)}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Booked Slot</span>
                            <p className="font-semibold text-foreground mt-0.5">{formatTime12Hour(appointment.bookedSlot)}</p>
                          </div>
                          <div>
                            <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Status</span>
                            <p className="font-bold text-emerald-600 mt-0.5 uppercase">{appointment.status || "completed"}</p>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="p-4 pt-0 border-t border-border/10 bg-muted/5 pt-3.5 flex justify-end">
                        {appointment._id && (
                          <Link 
                            to={`/${currentRole}/appointments/${appointment._id}`} 
                          >
                            <Button type="button" variant="outline" size="sm" className="gap-1 rounded-lg text-xs cursor-pointer">
                              <Eye className="h-3.5 w-3.5" /> View Appointment
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
                  {/* Doctor Editing Actions */}
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
                  {/* Staff actions in view mode (only if pending) */}
                  {isStaff && isPending && (
                    <>
                      <Button
                        type="button"
                        variant="destructive"
                        disabled={deleteMutation.isPending}
                        onClick={() => setShowDeleteConfirm(true)}
                        className="h-10 rounded-xl font-bold gap-2 cursor-pointer shadow-xs mr-auto"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete Invoice
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsEditing(true)}
                        className="h-10 rounded-xl font-bold gap-2 cursor-pointer bg-background"
                      >
                        <Edit className="h-4 w-4" />
                        Edit Invoice
                      </Button>
                    </>
                  )}

                  {/* Patient actions (Pay Now button if pending & stripe) */}
                  {isPatient && isPending && invoice.paymentMethod === "stripe" && (
                    <Button
                      type="button"
                      disabled={checkoutMutation.isPending}
                      onClick={handlePayNow}
                      className="h-10 px-6 rounded-xl font-extrabold gap-2 cursor-pointer shadow-xs bg-primary text-primary-foreground min-w-[130px]"
                    >
                      {checkoutMutation.isPending ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Redirecting to Stripe...
                        </>
                      ) : (
                        <>
                          <CreditCard className="h-4 w-4" />
                          Pay Now
                        </>
                      )}
                    </Button>
                  )}

                  {/* Patient Paid success badge state */}
                  {isPatient && isPaid && (
                    <Badge className="bg-emerald-500/10 text-emerald-700 border-emerald-200/40 py-1.5 px-4 font-bold rounded-xl text-xs gap-1.5 mr-auto">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Paid Statement
                    </Badge>
                  )}

                  <Button
                    type="button"
                    variant={isStaff && isPending ? "ghost" : "default"}
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
                <CardTitle className="text-lg font-bold text-foreground">Delete Statement</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6 py-2">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Are you sure you want to delete this pending invoice statement? This action is permanent and cannot be undone.
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
