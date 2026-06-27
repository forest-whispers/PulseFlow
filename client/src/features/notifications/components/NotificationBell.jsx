import { useState, useEffect, useRef } from "react"
import { useSelector } from "react-redux"
import { useNavigate, useLocation } from "react-router-dom"
import { Bell, Loader2, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { 
  useNotificationsList, 
  useNotificationsUnreadCount, 
  useMarkNotificationRead 
} from "../hooks/useNotifications"

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

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useSelector((state) => state.auth)

  // 1. Fetch unread count independently (displayed on the badge)
  const { data: countResponse } = useNotificationsUnreadCount()
  const unreadCount = countResponse?.data?.count || 0

  // 2. Fetch first 3 preview notifications ONLY when the dropdown is open
  const { data: listResponse, isLoading: isListLoading } = useNotificationsList(1, 3, {
    enabled: isOpen,
  })
  const notifications = listResponse?.data?.notifications || []

  // 3. Mark single notification read mutation
  const markReadMutation = useMarkNotificationRead()

  // Define route mapping for "View All" button based on role
  const viewAllPath =
    user?.role === "doctor"
      ? "/doctor/notifications"
      : user?.role === "admin"
      ? "/admin/notifications"
      : "/patient/notifications"

  const handleNotificationClick = async (notification) => {
    if (!notification.isRead) {
      try {
        // Wait for mark as read mutation to complete successfully before navigating
        await markReadMutation.mutateAsync(notification._id)
      } catch (err) {
        // Error toast is already handled in the hook, navigate anyway as fallback
      }
    }
    setIsOpen(false)
    navigate(viewAllPath)
  }

  // Close dropdown on click outside or Escape key press
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      document.addEventListener("keydown", handleKeyDown)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen])

  // Close dropdown immediately when user navigates
  useEffect(() => {
    setIsOpen(false)
  }, [location.pathname])

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-label="View notifications"
        className="relative hover:bg-muted/60 transition-colors cursor-pointer h-9 w-9"
      >
        <Bell className="h-5 w-5 text-muted-foreground" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground animate-pulse shadow-xs">
            {unreadCount}
          </span>
        )}
      </Button>

      {/* Anchored Dropdown Popover */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 rounded-xl border bg-card text-card-foreground shadow-lg z-50 overflow-hidden animate-fade-in origin-top-right">
          {/* Header */}
          <div className="px-4 py-3 border-b flex items-center justify-between bg-muted/20">
            <span className="font-bold text-sm">Recent Alerts</span>
            {unreadCount > 0 && (
              <span className="text-[11px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                {unreadCount} Unread
              </span>
            )}
          </div>

          {/* List Area */}
          <div className="max-h-[300px] overflow-y-auto divide-y">
            {isListLoading ? (
              /* Lightweight Preview Loading Skeletons */
              <div className="p-4 space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="space-y-2 animate-pulse">
                    <div className="h-3 w-1/2 bg-muted rounded-md" />
                    <div className="h-2 w-5/6 bg-muted rounded-md" />
                    <div className="h-2 w-1/3 bg-muted rounded-md" />
                  </div>
                ))}
              </div>
            ) : notifications.length === 0 ? (
              /* Friendly Empty State */
              <div className="flex flex-col items-center justify-center p-6 text-center space-y-2 text-muted-foreground">
                <Info className="h-8 w-8 opacity-45 text-muted-foreground" />
                <p className="text-sm font-semibold">No notifications</p>
                <p className="text-xs">We'll alert you when something happens.</p>
              </div>
            ) : (
              /* List Item Rendering */
              notifications.map((notification) => (
                <div
                  key={notification._id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`p-4 transition-colors duration-200 cursor-pointer flex gap-3 text-left ${
                    notification.isRead 
                      ? "bg-card hover:bg-muted/40" 
                      : "bg-primary/5 hover:bg-primary/10"
                  }`}
                >
                  {/* Unread marker dot */}
                  {!notification.isRead && (
                    <div className="h-2 w-2 rounded-full bg-primary mt-1.5 shrink-0" />
                  )}
                  <div className="space-y-1 flex-1 min-w-0">
                    <p className={`text-xs font-semibold text-foreground truncate ${!notification.isRead ? "font-bold text-primary" : ""}`}>
                      {notification.title}
                    </p>
                    <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                      {notification.message}
                    </p>
                    <span className="text-[9px] text-muted-foreground/80 block">
                      {getRelativeTime(notification.createdAt)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer View All Button */}
          <div className="border-t">
            <button
              onClick={() => {
                setIsOpen(false)
                navigate(viewAllPath)
              }}
              className="w-full text-center py-2.5 text-xs font-semibold text-primary hover:bg-muted/50 hover:text-primary/90 transition-colors border-none bg-transparent cursor-pointer"
            >
              View All Notifications
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
