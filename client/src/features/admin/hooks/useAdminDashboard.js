import { useQuery } from "@tanstack/react-query"
import { adminApi } from "../api/adminApi"

export function useAdminDashboard() {
  return useQuery({
    queryKey: ["adminDashboard"],
    queryFn: adminApi.getDashboard,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  })
}
