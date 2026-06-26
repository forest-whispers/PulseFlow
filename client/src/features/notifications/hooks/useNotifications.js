import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { notificationApi } from "../api/notificationApi"
import { toast } from "sonner"

export function useNotificationsList(page = 1, limit = 10, options = {}) {
  return useQuery({
    queryKey: ["notificationsList", page, limit],
    queryFn: () => notificationApi.getNotifications({ page, limit }),
    staleTime: 10 * 1000, // 10 seconds cache stale time
    refetchOnWindowFocus: false,
    ...options,
  })
}

export function useNotificationsUnreadCount() {
  return useQuery({
    queryKey: ["unreadCount"],
    queryFn: notificationApi.getUnreadCount,
    staleTime: 30 * 1000, // 30 seconds cache stale time
    refetchOnWindowFocus: false,
  })
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: notificationApi.markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["unreadCount"] })
      queryClient.invalidateQueries({ queryKey: ["notificationsList"] })
    },
    onError: (error) => {
      const errMsg = error.response?.data?.message || error.message || "Failed to mark notification as read"
      toast.error(errMsg)
    },
  })
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: notificationApi.markAllAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["unreadCount"] })
      queryClient.invalidateQueries({ queryKey: ["notificationsList"] })
      toast.success("All notifications marked as read")
    },
    onError: (error) => {
      const errMsg = error.response?.data?.message || error.message || "Failed to mark all notifications as read"
      toast.error(errMsg)
    },
  })
}
