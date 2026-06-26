import { useQuery } from "@tanstack/react-query"
import { patientApi } from "../api/patientApi"

export function useDoctorSearch(params) {
  return useQuery({
    queryKey: ["doctorSearch", params],
    queryFn: () => patientApi.searchDoctors(params),
    staleTime: 1 * 60 * 1000, // 1 minute cache staleTime for search directory results
    refetchOnWindowFocus: false,
  })
}
