import { useQuery } from "@tanstack/react-query"
import { patientApi } from "../api/patientApi"

export function usePatientDashboard() {
  return useQuery({
    queryKey: ["patientDashboard"],
    queryFn: patientApi.getDashboardData,
    staleTime: 5 * 60 * 1000, // 5 minutes cache stale time
    refetchOnWindowFocus: false,
  })
}
