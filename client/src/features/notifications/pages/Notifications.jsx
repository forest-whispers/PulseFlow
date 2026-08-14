import { useSearchParams } from "react-router-dom"
import { 
  Bell, 
  CheckCheck, 
  Loader2, 
  AlertCircle, 
  Inbox, 
  MailOpen, 
  Check, 
  RotateCcw 
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  useNotificationsList, 
  useMarkNotificationRead, 
  useMarkAllNotificationsRead 
} from "../hooks/useNotifications"
import AppointmentPagination from "../../patient/components/AppointmentPagination"

// Helper to format timestamps relative to current time
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

// Group current page notifications by Today, Yesterday, and Earlier
function groupPageNotifications(notifications) {
  const today = []
  const yesterday = []
  const earlier = []

  const now = new Date()
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
  const startOfYesterday = startOfToday - 24 * 60 * 60 * 1000

  notifications.forEach((item) => {
    const time = new Date(item.createdAt).getTime()
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

export default function Notifications() {
  const [searchParams, setSearchParams] = useSearchParams()
  const page = parseInt(searchParams.get("page") || "1", 10)
  const limit = 10

  // 1. Fetch paginated notification list
  const { data, isLoading, isError, error, refetch, isFetching } = useNotificationsList(page, limit)
  
  // 2. Mark single read mutation
  const markReadMutation = useMarkNotificationRead()
  
  // 3. Mark all read mutation
  const markAllReadMutation = useMarkAllNotificationsRead()

  const notificationsResponse = data?.data || {}
  const notifications = notificationsResponse.notifications || []
  const pagination = notificationsResponse.pagination || { page: 1, limit: 10, total: 0, totalPages: 1 }

  // Check if there are any unread notifications on the active page
  const hasUnreadNotifications = notifications.some((n) => !n.isRead)

  const handlePageChange = (newPage) => {
    setSearchParams({ page: newPage.toString() })
  }

  const handleMarkRead = async (id) => {
    try {
      await markReadMutation.mutateAsync(id)
    } catch (err) {
      // Errors toasted inside hook
    }
  }

  const handleMarkAllRead = async () => {
    try {
      await markAllReadMutation.mutateAsync()
    } catch (err) {
      // Errors toasted inside hook
    }
  }

  // Loading skeleton layout
  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        {/* Header Skeleton */}
        <div className="flex justify-between items-center border-b pb-6 mb-8">
          <div className="space-y-2">
            <div className="h-8 w-48 bg-muted rounded-md" />
            <div className="h-4 w-80 bg-muted rounded-md" />
          </div>
          <div className="h-10 w-36 bg-muted rounded-md" />
        </div>

        {/* Content list Skeleton */}
        <div className="space-y-8">
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
    const errMsg = error.response?.data?.message || error.message || "Failed to load notifications"
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6 space-y-6 animate-fade-in">
        <div className="h-16 w-16 rounded-full bg-destructive/10 text-destructive flex items-center justify-center">
          <AlertCircle className="h-8 w-8 animate-bounce" />
        </div>
        <div className="space-y-2 max-w-md">
          <h2 className="text-2xl font-bold text-foreground">Notification Load Failed</h2>
          <p className="text-muted-foreground text-sm">{errMsg}</p>
        </div>
        <Button onClick={() => refetch()} className="gap-2 cursor-pointer">
          <RotateCcw className="h-4 w-4" /> Retry Loading
        </Button>
      </div>
    )
  }

  // Group notifications into Today, Yesterday, Earlier
  const grouped = groupPageNotifications(notifications)

  // Render Section Helper
  const renderNotificationSection = (title, items) => {
    if (items.length === 0) return null

    return (
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider pl-1">
          {title} ({items.length})
        </h3>
        <div className="space-y-3">
          {items.map((notification) => (
            <Card 
              key={notification._id}
              className={`transition-all duration-300 border hover:shadow-xs hover:border-primary/30 ${
                notification.isRead 
                  ? "bg-card opacity-85 hover:bg-primary/5" 
                  : "bg-primary/5 border-primary/20 hover:bg-primary/10 shadow-2xs"
              }`}
            >
              <CardContent className="p-4 sm:p-5 flex items-start justify-between gap-4">
                <div className="flex gap-3 min-w-0">
                  {/* Status dot or icon */}
                  <div className="pt-1 shrink-0">
                    {notification.isRead ? (
                      <MailOpen className="h-4 w-4 text-muted-foreground/75" />
                    ) : (
                      <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                      </span>
                    )}
                  </div>
                  <div className="space-y-1 min-w-0">
                    <h4 className={`text-sm font-bold leading-none ${!notification.isRead ? "text-primary" : "text-foreground"}`}>
                      {notification.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed pt-1">
                      {notification.message}
                    </p>
                    <span className="text-[10px] text-muted-foreground/80 block pt-1">
                      {getRelativeTime(notification.createdAt)}
                    </span>
                  </div>
                </div>

                {/* Mark read button */}
                {!notification.isRead && (
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={markReadMutation.isPending}
                    onClick={() => handleMarkRead(notification._id)}
                    className="shrink-0 text-xs font-semibold text-primary hover:bg-primary/10 gap-1.5 cursor-pointer h-8"
                    title="Mark this alert as read"
                  >
                    {markReadMutation.isPending && markReadMutation.variables === notification._id ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Check className="h-3.5 w-3.5" />
                    )}
                    <span className="hidden sm:inline">Mark Read</span>
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Settings Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-6 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            <Bell className="h-8 w-8 text-primary" /> Notification Center
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Stay up to date with your schedules, bookings, results, and account activities.
          </p>
        </div>

        {/* Mark All As Read */}
        {notifications.length > 0 && (
          <Button
            variant="outline"
            disabled={markAllReadMutation.isPending || !hasUnreadNotifications}
            onClick={handleMarkAllRead}
            className="gap-2 cursor-pointer self-start sm:self-center"
          >
            {markAllReadMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <CheckCheck className="h-4 w-4" />
            )}
            Mark All as Read
          </Button>
        )}
      </div>

      {/* Main Alerts List Area */}
      <div className={`space-y-8 transition-all duration-300 ${isFetching ? "opacity-75 pointer-events-none" : "opacity-100"}`}>
        {notifications.length === 0 ? (
          /* Empty State */
          <Card className="border border-dashed p-12 text-center bg-card shadow-2xs">
            <CardContent className="flex flex-col items-center justify-center p-0 space-y-4 max-w-sm mx-auto">
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                <Inbox className="h-8 w-8 opacity-65" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-lg text-foreground">Inbox is clean</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  You don't have any alert messages in your inbox. Check back later for updates.
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={() => refetch()} className="cursor-pointer">
                Refresh Inbox
              </Button>
            </CardContent>
          </Card>
        ) : (
          /* Render grouped alerts list */
          <div className="space-y-8 animate-fade-in">
            {renderNotificationSection("Today", grouped.today)}
            {renderNotificationSection("Yesterday", grouped.yesterday)}
            {renderNotificationSection("Earlier", grouped.earlier)}
          </div>
        )}
      </div>

      {/* Pagination component */}
      <AppointmentPagination
        page={pagination.page}
        totalPages={pagination.totalPages}
        total={pagination.total}
        limit={pagination.limit}
        onPageChange={handlePageChange}
        label="notifications"
      />
    </div>
  )
}
