import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { patientApi } from "../api/patientApi"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

export function useDoctorDetails(id) {
  return useQuery({
    queryKey: ["doctorDetails", id],
    queryFn: () => patientApi.getDoctorDetails(id),
    staleTime: 5 * 60 * 1000, // 5 minutes cache staleTime
    refetchOnWindowFocus: false,
    enabled: !!id,
  })
}

export function useAvailableSlots(id, date) {
  return useQuery({
    queryKey: ["doctorSlots", id, date],
    queryFn: () => patientApi.getAvailableSlots(id, date),
    staleTime: 0, // Slots are highly dynamic, keep fresh
    refetchOnWindowFocus: false,
    enabled: !!id && !!date,
  })
}

export function useBookAppointment() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: patientApi.bookAppointment,
    onSuccess: (data) => {
      // Invalidate dashboard stats and appointments logs
      queryClient.invalidateQueries({ queryKey: ["patientDashboard"] })
      queryClient.invalidateQueries({ queryKey: ["patientAppointments"] })
      toast.success(data.message || "Appointment booked successfully!")
      navigate("/patient/appointments", { replace: true })
    },
    onError: (error) => {
      const errMsg = error.response?.data?.message || error.message || "Failed to book appointment"
      toast.error(errMsg)
    },
  })
}
