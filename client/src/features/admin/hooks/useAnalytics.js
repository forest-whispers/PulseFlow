import { useQuery } from "@tanstack/react-query"
import { analyticsApi } from "../api/analyticsApi"

export function useAnalytics() {
  return useQuery({
    queryKey: ["adminAnalytics"],
    queryFn: () => analyticsApi.getAnalytics(),
    staleTime: 5 * 60 * 1000, // 5 minutes stale time for dashboard reports
  })
}
