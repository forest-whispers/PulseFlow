import { useQuery, keepPreviousData } from "@tanstack/react-query"
import { adminApi } from "../api/adminApi"

export function useAdminAppointments(page = 1, limit = 10) {
  return useQuery({
    queryKey: ["adminAppointments", { page, limit }],
    queryFn: () => adminApi.getAppointments(page, limit),
    staleTime: 10000, // 10 seconds
    placeholderData: keepPreviousData,
  })
}
