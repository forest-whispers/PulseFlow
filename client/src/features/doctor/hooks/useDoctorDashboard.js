import { useQuery } from "@tanstack/react-query"
import { doctorApi } from "../api/doctorApi"

export function useDoctorDashboard() {
  return useQuery({
    queryKey: ["doctorDashboard"],
    queryFn: doctorApi.getDashboardData,
    staleTime: 5 * 60 * 1000, // 5 minutes cache stale time for smoother navigation
    refetchOnWindowFocus: false,
  })
}
