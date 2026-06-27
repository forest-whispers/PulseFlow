import { useNavigate } from "react-router-dom"
import {
  ArrowLeft,
  Calendar,
  FileText,
  Pill,
  Beaker,
  Receipt,
  User,
  Activity,
  Clock,
  Stethoscope,
  IndianRupee,
  AlertCircle,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  TrendingUp as GrowthIcon,
  Briefcase,
  Users,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useAnalytics } from "../hooks/useAnalytics"
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts"

// Format Date for chart axes (e.g., "2026-07-06" to "Jul 06")
function formatChartDate(dateStr) {
  if (!dateStr) return ""
  try {
    const date = new Date(dateStr)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  } catch {
    return dateStr
  }
}

// Chart color configurations
const STATUS_COLORS = {
  pending: "#F59E0B", // amber
  confirmed: "#3B82F6", // blue
  completed: "#10B981", // emerald
  cancelled: "#EF4444", // rose
  pendingReschedule: "#8B5CF6", // violet
}

const PAYMENT_COLORS = {
  stripe: "#6366F1", // indigo
  cash: "#0D9488", // teal
}

const INVOICE_COLORS = {
  paid: "#10B981", // emerald
  pending: "#F59E0B", // amber
}

// Custom Tooltip component for Recharts
function CustomTooltip({ active, payload, label, valuePrefix = "", valueSuffix = "" }) {
  if (active && payload && payload.length) {
    return (
      <div className="p-3 bg-card border rounded-xl shadow-md text-xs space-y-1">
        <p className="font-bold text-muted-foreground">{formatChartDate(label)}</p>
        {payload.map((item, idx) => (
          <p key={idx} className="font-extrabold text-foreground">
            {item.name}: {valuePrefix}
            {item.value.toLocaleString("en-US")}
            {valueSuffix}
          </p>
        ))}
      </div>
    )
  }
  return null
}

export default function AdminAnalytics() {
  const navigate = useNavigate()
  const { data, isLoading, isError, error, refetch } = useAnalytics()

  const analyticsResponse = data?.data || {}
  const kpis = analyticsResponse.kpis || {}
  const appointmentStatusDistribution = analyticsResponse.appointmentStatusDistribution || {}
  const appointmentsTrend = analyticsResponse.appointmentsTrend || []
  const revenueTrend = analyticsResponse.revenueTrend || []
  const doctorWorkload = analyticsResponse.doctorWorkload || []
  const topSpecializations = analyticsResponse.topSpecializations || []
  const paymentMethods = analyticsResponse.paymentMethods || []
  const invoiceStatus = analyticsResponse.invoiceStatus || []
  const averageRevenuePerDoctor = analyticsResponse.averageRevenuePerDoctor || 0
  const recentGrowth = analyticsResponse.recentGrowth || {}

  // Format Status Distribution Data for Pie Chart
  const statusPieData = Object.entries(appointmentStatusDistribution).map(([key, value]) => ({
    name: key.replace(/([A-Z])/g, " $1").trim(),
    value,
    color: STATUS_COLORS[key] || "#94A3B8",
  })).filter(item => item.value > 0)

  // Format Payment Methods Data for Pie Chart
  const paymentPieData = paymentMethods.map((item) => ({
    name: item._id,
    value: item.count,
    color: PAYMENT_COLORS[item._id] || "#94A3B8",
  })).filter(item => item.value > 0)

  // Format Invoice Status Data for Pie Chart
  const invoicePieData = invoiceStatus.map((item) => ({
    name: item._id,
    value: item.count,
    color: INVOICE_COLORS[item._id] || "#94A3B8",
  })).filter(item => item.value > 0)

  // Format Doctor Workload Data (sorted descending)
  const sortedWorkload = [...doctorWorkload].sort((a, b) => b.appointments - a.appointments)

  // Format Top Specializations (sorted descending)
  const sortedSpecializations = [...topSpecializations].sort((a, b) => b.appointments - a.appointments)

  // Loading skeleton state
  if (isLoading) {
    return (
      <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 animate-pulse">
        <div className="h-6 w-32 bg-muted/65 rounded-md" />
        <div className="h-8 w-60 bg-muted/60 rounded-md mt-2" />
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 pt-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="border h-24 rounded-2xl bg-muted/20" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="border h-48 rounded-2xl bg-muted/20" />
          ))}
        </div>
      </div>
    )
  }

  // Error retry state
  if (isError) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-center p-6 space-y-4 max-w-md mx-auto animate-fade-in">
        <div className="h-14 w-14 rounded-full bg-destructive/10 text-destructive flex items-center justify-center shadow-2xs">
          <AlertCircle className="h-7 w-7" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-foreground">Failed to Load Analytics</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {error?.response?.data?.message || error?.message || "We encountered an issue retrieving the hospital operational reports. Please try again."}
          </p>
        </div>
        <Button onClick={() => refetch()} className="w-full gap-2 rounded-xl cursor-pointer">
          <RefreshCw className="h-4 w-4" /> Try Again
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 animate-fade-in">
      {/* Return Back Button */}
      <Button
        variant="ghost"
        onClick={() => navigate("/admin/dashboard")}
        className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-muted-foreground hover:text-primary transition-colors cursor-pointer"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Dashboard
      </Button>

      <div className="flex flex-col gap-1">
        <h2 className="text-xl sm:text-2xl font-extrabold text-foreground flex items-center gap-2">
          <Activity className="h-6 w-6 text-primary shrink-0" />
          Hospital Performance Analytics
        </h2>
        <p className="text-xs text-muted-foreground">
          Monitor operational growth, appointment completions, consult demographics, and billing stats.
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        {[
          {
            label: "Total Revenue",
            value: `₹${kpis.totalRevenue?.toLocaleString("en-IN")}`,
            icon: IndianRupee,
            color: "text-emerald-500 bg-emerald-500/10",
          },
          {
            label: "Total Bookings",
            value: kpis.totalAppointments,
            icon: Calendar,
            color: "text-blue-500 bg-blue-500/10",
          },
          {
            label: "Completion Rate",
            value: `${kpis.completionRate}%`,
            icon: Activity,
            color: "text-indigo-500 bg-indigo-500/10",
          },
          {
            label: "Avg Consult Fee",
            value: `₹${kpis.averageConsultationFee}`,
            icon: Receipt,
            color: "text-amber-500 bg-amber-500/10",
          },
          {
            label: "Active Doctors",
            value: kpis.activeDoctors,
            icon: Stethoscope,
            color: "text-sky-500 bg-sky-500/10",
          },
          {
            label: "Registered Patients",
            value: kpis.registeredPatients,
            icon: Users,
            color: "text-violet-500 bg-violet-500/10",
          },
        ].map((item, idx) => {
          const Icon = item.icon
          return (
            <Card key={idx} className="border border-border/40 shadow-2xs bg-card rounded-2xl overflow-hidden">
              <CardContent className="p-4 sm:p-5 flex flex-col justify-between gap-3 h-full">
                <div className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 border border-border/5 ${item.color}`}>
                  <Icon className="h-4.5 w-4.5" />
                </div>
                <div className="space-y-0.5">
                  <span className="text-[9px] sm:text-[10px] text-muted-foreground uppercase font-bold tracking-wider block">
                    {item.label}
                  </span>
                  <p className="text-base sm:text-lg font-black text-foreground mt-0.5 truncate select-all leading-tight">
                    {item.value}
                  </p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Growth Summary Row & Average Revenue Doctor card */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Appointments Growth", val: recentGrowth.appointments },
          { label: "Revenue Growth", val: recentGrowth.revenue },
          { label: "Patient Registrations", val: recentGrowth.patients },
        ].map((growth, idx) => {
          const isPos = growth.val >= 0
          const Icon = isPos ? TrendingUp : TrendingDown
          return (
            <Card key={idx} className="border border-border/40 shadow-2xs bg-card rounded-2xl overflow-hidden md:col-span-1">
              <CardContent className="p-4.5 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block">
                    {growth.label}
                  </span>
                  <p className={`text-base font-extrabold mt-1 flex items-center gap-1 leading-none ${isPos ? "text-emerald-500" : "text-rose-500"}`}>
                    <Icon className="h-4 w-4 shrink-0" />
                    {isPos ? "+" : ""}{growth.val}%
                  </p>
                </div>
                <div className={`h-8 w-8 rounded-lg flex items-center justify-center border shrink-0 ${isPos ? "bg-emerald-500/5 text-emerald-500 border-emerald-500/10" : "bg-rose-500/5 text-rose-500 border-rose-500/10"}`}>
                  <Icon className="h-4 w-4" />
                </div>
              </CardContent>
            </Card>
          )
        })}

        {/* Highlight Card: Average Revenue per Doctor */}
        <Card className="border border-border/40 shadow-2xs bg-card rounded-2xl overflow-hidden md:col-span-1 border-primary/20 bg-primary/5">
          <CardContent className="p-4.5 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <span className="text-[10px] text-primary uppercase font-bold tracking-wider block">
                Avg Revenue / Doctor
              </span>
              <p className="text-base font-black text-foreground mt-1 leading-none">
                ₹{averageRevenuePerDoctor.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
              </p>
            </div>
            <div className="h-8 w-8 rounded-lg flex items-center justify-center bg-primary/10 border border-primary/20 text-primary shrink-0">
              <Briefcase className="h-4 w-4" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Row 1: Line trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Appointments Trend */}
        <Card className="border border-border/40 shadow-2xs bg-card rounded-2xl overflow-hidden">
          <CardHeader className="p-5 pb-3 border-b border-border/10 bg-muted/5">
            <CardTitle className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
              <Calendar className="h-4.5 w-4.5 text-primary" />
              Appointments Booking Trend
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={appointmentsTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                <XAxis dataKey="_id" tickFormatter={formatChartDate} tick={{ fontSize: 10 }} stroke="#94A3B8" />
                <YAxis tick={{ fontSize: 10 }} stroke="#94A3B8" allowDecimals={false} />
                <Tooltip content={<CustomTooltip valueSuffix=" Bookings" />} />
                <Line type="monotone" dataKey="appointments" name="Bookings" stroke="#6366F1" strokeWidth={2.5} activeDot={{ r: 6 }} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Revenue Trend */}
        <Card className="border border-border/40 shadow-2xs bg-card rounded-2xl overflow-hidden">
          <CardHeader className="p-5 pb-3 border-b border-border/10 bg-muted/5">
            <CardTitle className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
              <IndianRupee className="h-4.5 w-4.5 text-primary" />
              Revenue Growth Trend
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueTrend} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                <XAxis dataKey="_id" tickFormatter={formatChartDate} tick={{ fontSize: 10 }} stroke="#94A3B8" />
                <YAxis tick={{ fontSize: 10 }} stroke="#94A3B8" />
                <Tooltip content={<CustomTooltip valuePrefix="₹" />} />
                <Line type="monotone" dataKey="revenue" name="Revenue" stroke="#10B981" strokeWidth={2.5} activeDot={{ r: 6 }} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Row 2: Doughnuts / Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Appointment Status */}
        <Card className="border border-border/40 shadow-2xs bg-card rounded-2xl overflow-hidden flex flex-col justify-between">
          <CardHeader className="p-5 pb-3 border-b border-border/10 bg-muted/5">
            <CardTitle className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
              <Activity className="h-4.5 w-4.5 text-primary" />
              Appointment Status
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 flex flex-col items-center justify-center flex-1 min-h-[250px]">
            {statusPieData.length === 0 ? (
              <p className="text-xs text-muted-foreground italic">No data logged.</p>
            ) : (
              <>
                <div className="h-[160px] w-[160px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={statusPieData} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={3} dataKey="value">
                        {statusPieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-wrap justify-center gap-2 mt-4 text-[10px]">
                  {statusPieData.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-1 bg-muted/30 px-2 py-0.5 rounded border">
                      <span className="h-1.5 w-1.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                      <span className="font-semibold">{item.name} ({item.value})</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Payment Methods */}
        <Card className="border border-border/40 shadow-2xs bg-card rounded-2xl overflow-hidden flex flex-col justify-between">
          <CardHeader className="p-5 pb-3 border-b border-border/10 bg-muted/5">
            <CardTitle className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
              <Receipt className="h-4.5 w-4.5 text-primary" />
              Payment Methods
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 flex flex-col items-center justify-center flex-1 min-h-[250px]">
            {paymentPieData.length === 0 ? (
              <p className="text-xs text-muted-foreground italic">No data logged.</p>
            ) : (
              <>
                <div className="h-[160px] w-[160px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={paymentPieData} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={3} dataKey="value">
                        {paymentPieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-wrap justify-center gap-2 mt-4 text-[10px]">
                  {paymentPieData.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-1 bg-muted/30 px-2 py-0.5 rounded border">
                      <span className="h-1.5 w-1.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                      <span className="font-semibold uppercase">{item.name} ({item.value})</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Invoice Status */}
        <Card className="border border-border/40 shadow-2xs bg-card rounded-2xl overflow-hidden flex flex-col justify-between">
          <CardHeader className="p-5 pb-3 border-b border-border/10 bg-muted/5">
            <CardTitle className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
              <Receipt className="h-4.5 w-4.5 text-primary" />
              Invoice Paid Status
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 flex flex-col items-center justify-center flex-1 min-h-[250px]">
            {invoicePieData.length === 0 ? (
              <p className="text-xs text-muted-foreground italic">No data logged.</p>
            ) : (
              <>
                <div className="h-[160px] w-[160px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={invoicePieData} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={3} dataKey="value">
                        {invoicePieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-wrap justify-center gap-2 mt-4 text-[10px]">
                  {invoicePieData.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-1 bg-muted/30 px-2 py-0.5 rounded border">
                      <span className="h-1.5 w-1.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                      <span className="font-semibold capitalize">{item.name} ({item.value})</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Row 3: Doctor Workload & Top Specializations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Doctor Workload */}
        <Card className="border border-border/40 shadow-2xs bg-card rounded-2xl overflow-hidden">
          <CardHeader className="p-5 pb-3 border-b border-border/10 bg-muted/5">
            <CardTitle className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
              <Stethoscope className="h-4.5 w-4.5 text-primary" />
              Doctor Workload (Consultations Handled)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 min-h-[260px] flex flex-col justify-center">
            {sortedWorkload.length === 0 ? (
              <p className="text-xs text-muted-foreground italic text-center">No doctor workloads logged.</p>
            ) : (
              <div className="space-y-4">
                {sortedWorkload.map((doc, idx) => (
                  <div key={idx} className="space-y-1.5 text-xs">
                    <div className="flex justify-between items-center font-semibold">
                      <span>{doc.doctorName}</span>
                      <span className="text-primary font-extrabold">{doc.appointments} Bookings</span>
                    </div>
                    {/* Visual Progress Bar */}
                    <div className="h-2 w-full rounded-full bg-muted/40 overflow-hidden border border-border/5">
                      <div
                        className="h-full rounded-full bg-indigo-500 transition-all duration-500"
                        style={{
                          width: `${
                            (doc.appointments / Math.max(...sortedWorkload.map(d => d.appointments), 1)) * 100
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Specializations */}
        <Card className="border border-border/40 shadow-2xs bg-card rounded-2xl overflow-hidden">
          <CardHeader className="p-5 pb-3 border-b border-border/10 bg-muted/5">
            <CardTitle className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
              <Activity className="h-4.5 w-4.5 text-primary" />
              Top Specializations
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 min-h-[260px] flex flex-col justify-center">
            {sortedSpecializations.length === 0 ? (
              <p className="text-xs text-muted-foreground italic text-center">No specialization data logged.</p>
            ) : (
              <div className="space-y-4">
                {sortedSpecializations.map((spec, idx) => (
                  <div key={idx} className="space-y-1.5 text-xs">
                    <div className="flex justify-between items-center font-semibold">
                      <span>{spec._id}</span>
                      <span className="text-primary font-extrabold">{spec.appointments} Consultations</span>
                    </div>
                    {/* Visual Progress Bar */}
                    <div className="h-2 w-full rounded-full bg-muted/40 overflow-hidden border border-border/5">
                      <div
                        className="h-full rounded-full bg-violet-500 transition-all duration-500"
                        style={{
                          width: `${
                            (spec.appointments / Math.max(...sortedSpecializations.map(s => s.appointments), 1)) * 100
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
