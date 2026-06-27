import { useSearchParams, useNavigate, Link } from "react-router-dom"
import {
  Calendar,
  FileText,
  Pill,
  Beaker,
  Receipt,
  User,
  Activity,
  Clock,
  Loader2,
  AlertCircle,
  ArrowLeft,
  RefreshCw,
  History,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useAuditLogs } from "../hooks/useAuditLogs"
import AppointmentPagination from "../../patient/components/AppointmentPagination"

// Relative time calculator
function getRelativeTime(dateString) {
  try {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / (60 * 1000))
    const diffHours = Math.floor(diffMs / (60 * 60 * 1000))
    const diffDays = Math.floor(diffMs / (24 * 60 * 60 * 1000))

    if (diffMins < 1) return "Just now"
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays === 1) return "Yesterday"
    return `${diffDays}d ago`
  } catch (err) {
    return ""
  }
}

// Group logs by Today, Yesterday, and Earlier
function groupLogs(logs) {
  const today = []
  const yesterday = []
  const earlier = []

  const now = new Date()
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
  const startOfYesterday = startOfToday - 24 * 60 * 60 * 1000

  logs.forEach((item) => {
    const time = new Date(item.timestamp).getTime()
    if (time >= startOfToday) {
      today.push(item)
    } else if (time >= startOfYesterday) {
      yesterday.push(item)
    } else {
      earlier.push(item)
    }
  })

  return { today, yesterday, earlier }
}

// Resolve Lucide icons & color styling by Entity Type
function getActivityStyle(entityType) {
  switch (entityType) {
    case "appointment":
      return { Icon: Calendar, color: "text-emerald-500 bg-emerald-500/10 border-emerald-200/20" }
    case "medical_record":
      return { Icon: FileText, color: "text-indigo-500 bg-indigo-500/10 border-indigo-200/20" }
    case "prescription":
      return { Icon: Pill, color: "text-violet-500 bg-violet-500/10 border-violet-200/20" }
    case "lab_result":
      return { Icon: Beaker, color: "text-cyan-500 bg-cyan-500/10 border-cyan-200/20" }
    case "invoice":
      return { Icon: Receipt, color: "text-amber-500 bg-amber-500/10 border-amber-200/20" }
    case "user":
    case "account":
      return { Icon: User, color: "text-blue-500 bg-blue-500/10 border-blue-200/20" }
    default:
      return { Icon: Activity, color: "text-primary bg-primary/10 border-primary/20" }
  }
}

// Resolve detail pages links dynamically
function getEntityPath(entityType, entityId) {
  if (!entityType || !entityId) return null
  switch (entityType) {
    case "medical_record":
      return `/admin/medical-records/${entityId}`
    case "prescription":
      return `/admin/prescriptions/${entityId}`
    case "lab_result":
      return `/admin/lab-results/${entityId}`
    case "invoice":
      return `/admin/invoices/${entityId}`
    case "appointment":
      return `/admin/appointments/${entityId}`
    default:
      return null
  }
}

export default function AdminAuditLogs() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const page = parseInt(searchParams.get("page") || "1", 10)
  const limit = 10

  const { data, isLoading, isError, error, refetch } = useAuditLogs(page, limit)

  const logsResponse = data?.data || {}
  const auditLogs = logsResponse.auditLogs || []
  const pagination = logsResponse.pagination || { page: 1, limit: 10, total: 0, totalPages: 1 }

  const handlePageChange = (newPage) => {
    setSearchParams({ page: newPage.toString() })
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // Loading skeleton layouts
  if (isLoading) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto p-4 sm:p-6 animate-pulse">
        <div className="flex flex-col gap-1.5 pb-6 border-b">
          <div className="h-7 w-48 bg-muted/65 rounded-md" />
          <div className="h-4 w-72 bg-muted/50 rounded-md" />
        </div>

        <div className="space-y-8 pt-4">
          {Array.from({ length: 2 }).map((_, secIndex) => (
            <div key={secIndex} className="space-y-4">
              <div className="h-5 w-24 bg-muted rounded-md" />
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-20 bg-muted rounded-xl border" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Error boundary state
  if (isError) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-center p-6 space-y-4 max-w-md mx-auto animate-fade-in">
        <div className="h-14 w-14 rounded-full bg-destructive/10 text-destructive flex items-center justify-center shadow-2xs">
          <AlertCircle className="h-7 w-7" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-foreground">Failed to Load Logs</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {error?.response?.data?.message || error?.message || "We encountered an issue retrieving the activity audit trail. Please try again."}
          </p>
        </div>
        <Button onClick={() => refetch()} className="w-full gap-2 rounded-xl cursor-pointer">
          <RefreshCw className="h-4 w-4" /> Try Again
        </Button>
      </div>
    )
  }

  const grouped = groupLogs(auditLogs)

  // Render Log Timeline items loop
  const renderLogSection = (title, items) => {
    if (items.length === 0) return null

    return (
      <div className="space-y-3.5">
        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider pl-1">
          {title} ({items.length})
        </h3>
        <div className="space-y-3">
          {items.map((log) => {
            const { Icon, color } = getActivityStyle(log.entityType)
            const entityPath = getEntityPath(log.entityType, log.entityId)

            const cardContent = (
              <CardContent className="p-4 sm:p-5 flex items-start gap-4">
                {/* Activity Icon wrapper */}
                <div className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 border ${color}`}>
                  <Icon className="h-4.5 w-4.5" />
                </div>

                <div className="space-y-1.5 min-w-0 flex-1">
                  {/* Log description */}
                  <p className="text-sm font-bold text-foreground leading-relaxed group-hover:text-primary transition-colors">
                    {log.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    {/* Actor Details */}
                    <span className="font-semibold text-muted-foreground">
                      Actor: {log.actor?.name}
                    </span>
                    <Badge variant="outline" className="font-bold text-[9px] px-1.5 py-0 rounded bg-muted/40 uppercase">
                      {log.actor?.role}
                    </Badge>
                    {log.entityType && (
                      <>
                        <span className="text-muted-foreground/60">•</span>
                        <Badge variant="secondary" className="font-semibold text-[9px] px-1.5 py-0 rounded capitalize">
                          {log.entityType.replace(/_/g, " ")}
                        </Badge>
                      </>
                    )}
                  </div>

                  {/* Timestamps */}
                  <div className="flex flex-wrap gap-2 items-center text-[10px] text-muted-foreground pt-1.5 border-t border-border/5 mt-1">
                    <span className="font-medium">
                      {getRelativeTime(log.timestamp)}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3 shrink-0" />
                      {new Date(log.timestamp).toLocaleString("en-US", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </span>
                    {entityPath && (
                      <>
                        <span>•</span>
                        <span className="font-bold text-primary group-hover:underline">
                          Inspect Resource
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            )

            if (entityPath) {
              return (
                <Link
                  key={log._id}
                  to={entityPath}
                  className="block group cursor-pointer"
                >
                  <Card className="border border-border/40 shadow-2xs bg-card hover:bg-muted/5 hover:border-primary/20 hover:shadow-xs transition-all duration-300 rounded-2xl overflow-hidden">
                    {cardContent}
                  </Card>
                </Link>
              )
            }

            return (
              <Card 
                key={log._id}
                className="border border-border/40 shadow-2xs bg-card rounded-2xl overflow-hidden"
              >
                {cardContent}
              </Card>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-4 sm:p-6 animate-fade-in">
      {/* Return Back Dashboard */}
      <Button
        variant="ghost"
        onClick={() => navigate("/admin/dashboard")}
        className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-muted-foreground hover:text-primary transition-colors cursor-pointer mb-2"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Dashboard
      </Button>

      <div className="flex flex-col gap-1">
        <h2 className="text-xl sm:text-2xl font-extrabold text-foreground flex items-center gap-2">
          <History className="h-6 w-6 text-primary shrink-0" />
          Hospital Activity Audit Logs
        </h2>
        <p className="text-xs text-muted-foreground">
          Browse and review paginated, read-only audit log records of operations executed across the system.
        </p>
      </div>

      {auditLogs.length === 0 ? (
        // Empty State
        <Card className="border border-dashed border-border/40 shadow-2xs bg-card p-12 text-center rounded-2xl">
          <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
            <History className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold text-foreground mb-1.5">No Audit Logs</h3>
          <p className="text-xs text-muted-foreground max-w-xs mx-auto leading-relaxed">
            There are no recorded system operations or activity logs registered in the database.
          </p>
        </Card>
      ) : (
        // Grouped Timeline List
        <div className="space-y-8 pt-2">
          {renderLogSection("Today", grouped.today)}
          {renderLogSection("Yesterday", grouped.yesterday)}
          {renderLogSection("Earlier", grouped.earlier)}

          <AppointmentPagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            total={pagination.total}
            limit={limit}
            onPageChange={handlePageChange}
            label="activities"
          />
        </div>
      )}
    </div>
  )
}
