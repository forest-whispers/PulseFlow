import { useParams, useNavigate, useLocation } from "react-router-dom"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  ArrowLeft,
  Calendar,
  User,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Loader2,
  AlertTriangle,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select } from "@/components/ui/select"
import { useCreateInvoice } from "../../patient/hooks/useInvoices"
import { useSelector } from "react-redux"

const createInvoiceFormSchema = z.object({
  amount: z.coerce.number().positive("Amount must be a positive number"),
  description: z.string().trim().max(1000, "Description cannot exceed 1000 characters").optional(),
  paymentMethod: z.enum(["stripe", "cash"], {
    required_error: "Please select a payment method",
  }),
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

export default function CreateInvoice() {
  const location = useLocation()
  const navigate = useNavigate()

  const { user: currentUser } = useSelector((state) => state.auth)
  const currentRole = currentUser?.role || "doctor"

  const { appointmentId, patientName, appointmentDate, bookedSlot, status } = location.state || {}

  const createMutation = useCreateInvoice()

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createInvoiceFormSchema),
    defaultValues: {
      amount: "",
      description: "",
      paymentMethod: "stripe",
    },
  })

  const onSubmit = (values) => {
    const payload = {
      appointment: appointmentId,
      amount: values.amount,
      description: values.description || "",
      paymentMethod: values.paymentMethod,
    }

    createMutation.mutate(payload, {
      onSuccess: (response) => {
        if (response.data?._id) {
          navigate(`/${currentRole}/invoices/${response.data._id}`, {
            state: { appointmentId },
          })
        } else {
          navigate(`/${currentRole}/appointments/${appointmentId}`)
        }
      },
    })
  }

  // Check if we have the required context
  if (!appointmentId || !patientName) {
    const backPath = currentRole === "admin" ? "/admin/appointments" : "/doctor/appointments"
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-center p-6 space-y-4 max-w-md mx-auto animate-fade-in">
        <div className="h-14 w-14 rounded-full bg-destructive/10 text-destructive flex items-center justify-center shadow-2xs">
          <AlertCircle className="h-7 w-7" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-foreground">Missing Appointment Context</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Invoice generation forms must be launched directly from the Appointment details Consultation Summary.
          </p>
        </div>
        <Button onClick={() => navigate(backPath)} className="w-full rounded-xl cursor-pointer">
          Go to Appointments
        </Button>
      </div>
    )
  }

  // Enforce that invoices can only be generated for COMPLETED appointments
  if (status !== "completed") {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-center p-6 space-y-4 max-w-md mx-auto animate-fade-in">
        <div className="h-14 w-14 rounded-full bg-amber-500/10 text-amber-600 flex items-center justify-center shadow-2xs">
          <AlertTriangle className="h-7 w-7" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-foreground">Completed Appointment Required</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Invoices can only be generated for appointments that are marked as completed.
          </p>
        </div>
        <Button 
          variant="outline"
          onClick={() => navigate(`/${currentRole}/appointments/${appointmentId}`)} 
          className="w-full rounded-xl cursor-pointer"
        >
          Return to Appointment Details
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto p-4 sm:p-6">
      {/* Return Navigation */}
      <Button
        variant="ghost"
        onClick={() => navigate(`/${currentRole}/appointments/${appointmentId}`)}
        className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-muted-foreground hover:text-primary transition-colors cursor-pointer"
      >
        <ArrowLeft className="h-4 w-4" /> Cancel and Return
      </Button>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card className="border border-border/40 shadow-2xs bg-card overflow-hidden rounded-2xl">
          <CardHeader className="p-6 border-b border-border/10 bg-muted/5 flex flex-col gap-1.5">
            <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
              Billing Administration
            </span>
            <CardTitle className="text-lg sm:text-xl font-extrabold text-foreground flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Generate Invoice
            </CardTitle>
          </CardHeader>

          <CardContent className="p-6 space-y-6">
            {/* Read-Only Appointment Summary Panel */}
            <div className="p-5 border border-border/40 rounded-xl bg-muted/10 text-xs sm:text-sm space-y-3">
              <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                Appointment Information (Read-Only)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase font-bold">Patient Name</span>
                  <p className="font-extrabold text-foreground mt-0.5">{patientName}</p>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase font-bold">Date & Time</span>
                  <p className="font-semibold text-foreground mt-0.5 flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                    {formatDate(appointmentDate)} at {formatTime12Hour(bookedSlot)}
                  </p>
                </div>
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              {/* Amount */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground uppercase tracking-wider">Amount (₹) *</label>
                <input
                  type="number"
                  step="any"
                  placeholder="e.g. 500"
                  disabled={createMutation.isPending}
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

              {/* Payment Method */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground uppercase tracking-wider">Payment Method *</label>
                <Controller
                  control={control}
                  name="paymentMethod"
                  render={({ field }) => (
                    <Select
                      id="paymentMethod"
                      value={field.value}
                      onChange={field.onChange}
                      className="w-full"
                    >
                      <option value="stripe">Stripe (Online Card)</option>
                      <option value="cash">Cash (Over the counter)</option>
                    </Select>
                  )}
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground uppercase tracking-wider">Description</label>
                <textarea
                  placeholder="e.g. General Consultation Fee, Diagnostic consultation"
                  disabled={createMutation.isPending}
                  className={`w-full min-h-[100px] rounded-xl border px-3.5 py-2.5 text-sm bg-background outline-none transition-all focus:ring-1 focus:ring-primary ${
                    errors.description ? "border-destructive focus:ring-destructive" : "border-input"
                  }`}
                  {...register("description")}
                />
                {errors.description && (
                  <p className="text-xs text-destructive flex items-center gap-1 font-medium mt-0.5">
                    <AlertCircle className="h-3.5 w-3.5" />
                    {errors.description.message}
                  </p>
                )}
              </div>
            </div>
          </CardContent>

          {/* Form Actions */}
          <CardFooter className="px-6 py-4 bg-muted/20 border-t flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              disabled={createMutation.isPending}
              onClick={() => navigate(`/${currentRole}/appointments/${appointmentId}`)}
              className="h-10 rounded-xl font-bold cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createMutation.isPending}
              className="h-10 px-6 rounded-xl font-bold gap-2 cursor-pointer shadow-xs min-w-[130px]"
            >
              {createMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate Invoice"
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}
