import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { patientApi } from "../api/patientApi"
import { toast } from "sonner"

export function useAppointmentDetails(id) {
  return useQuery({
    queryKey: ["appointmentDetails", id],
    queryFn: () => patientApi.getAppointmentDetails(id),
    staleTime: 5000,
    refetchOnWindowFocus: false,
    enabled: !!id,
  })
}

export function useCancelAppointment(appointmentId) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => patientApi.cancelAppointment(appointmentId),
    onSuccess: (data) => {
      // Invalidate details, search history list, and dashboard cache
      queryClient.invalidateQueries({ queryKey: ["appointmentDetails", appointmentId] })
      queryClient.invalidateQueries({ queryKey: ["patientAppointments"] })
      queryClient.invalidateQueries({ queryKey: ["doctorAppointments"] })
      queryClient.invalidateQueries({ queryKey: ["adminAppointments"] })
      queryClient.invalidateQueries({ queryKey: ["patientDashboard"] })
      queryClient.invalidateQueries({ queryKey: ["doctorDashboard"] })
      queryClient.invalidateQueries({ queryKey: ["adminDashboard"] })
      toast.success(data.message || "Appointment cancelled successfully!")
    },
    onError: (error) => {
      const errMsg = error.response?.data?.message || error.message || "Failed to cancel appointment"
      toast.error(errMsg)
    },
  })
}

export function useRescheduleAppointment(appointmentId) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (rescheduleData) => patientApi.rescheduleAppointment(appointmentId, rescheduleData),
    onSuccess: (data) => {
      // Invalidate details, search history list, and dashboard cache
      queryClient.invalidateQueries({ queryKey: ["appointmentDetails", appointmentId] })
      queryClient.invalidateQueries({ queryKey: ["patientAppointments"] })
      queryClient.invalidateQueries({ queryKey: ["doctorAppointments"] })
      queryClient.invalidateQueries({ queryKey: ["adminAppointments"] })
      queryClient.invalidateQueries({ queryKey: ["patientDashboard"] })
      queryClient.invalidateQueries({ queryKey: ["doctorDashboard"] })
      queryClient.invalidateQueries({ queryKey: ["adminDashboard"] })
      toast.success("Appointment rescheduled successfully!")
    },
    onError: (error) => {
      const errMsg = error.response?.data?.message || error.message || "Failed to reschedule appointment"
      toast.error(errMsg)
    },
  })
}

export function useUpdateAppointmentStatus(appointmentId) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (statusData) => patientApi.updateAppointmentStatus(appointmentId, statusData),
    onSuccess: (data) => {
      // Invalidate details, history lists, and dashboard stats for patients, doctors, and admins
      queryClient.invalidateQueries({ queryKey: ["appointmentDetails", appointmentId] })
      queryClient.invalidateQueries({ queryKey: ["patientAppointments"] })
      queryClient.invalidateQueries({ queryKey: ["doctorAppointments"] })
      queryClient.invalidateQueries({ queryKey: ["adminAppointments"] })
      queryClient.invalidateQueries({ queryKey: ["patientDashboard"] })
      queryClient.invalidateQueries({ queryKey: ["doctorDashboard"] })
      queryClient.invalidateQueries({ queryKey: ["adminDashboard"] })
      toast.success(data.message || "Status updated successfully!")
    },
    onError: (error) => {
      const errMsg = error.response?.data?.message || error.message || "Failed to update status"
      toast.error(errMsg)
    },
  })
}
