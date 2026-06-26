import { useQuery, keepPreviousData } from "@tanstack/react-query"
import { patientApi } from "../../patient/api/patientApi"

export function useDoctorAppointments(page, limit = 10) {
  return useQuery({
    queryKey: ["doctorAppointments", page, limit],
    queryFn: () => patientApi.getAppointments({ page, limit }),
    placeholderData: keepPreviousData,
    staleTime: 10 * 1000,
    refetchOnWindowFocus: false,
  })
}
