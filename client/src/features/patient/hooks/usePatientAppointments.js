import { useQuery, keepPreviousData } from "@tanstack/react-query"
import { patientApi } from "../api/patientApi"

export function usePatientAppointments(page, limit = 10) {
  return useQuery({
    queryKey: ["patientAppointments", page, limit],
    queryFn: () => patientApi.getAppointments({ page, limit }),
    placeholderData: keepPreviousData,
    staleTime: 10 * 1000, // Keep cached data fresh but avoid excessive refetching
    refetchOnWindowFocus: false,
  })
}
