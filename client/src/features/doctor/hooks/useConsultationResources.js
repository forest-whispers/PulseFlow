import { useMutation, useQueryClient } from "@tanstack/react-query"
import { doctorApi } from "../api/doctorApi"
import { toast } from "sonner"

export function useCreateMedicalRecord(appointmentId, options = {}) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (formData) => doctorApi.createMedicalRecord(formData),
    onSuccess: (data, variables, context) => {
      toast.success(data.message || "Medical record created successfully!")
      queryClient.invalidateQueries({ queryKey: ["appointmentDetails", appointmentId] })
      if (options.onSuccess) {
        options.onSuccess(data, variables, context)
      }
    },
    onError: (error, variables, context) => {
      const errMsg = error.response?.data?.message || error.message || "Failed to create medical record"
      toast.error(errMsg)
      if (options.onError) {
        options.onError(error, variables, context)
      }
    },
  })
}

export function useCreatePrescription(appointmentId, options = {}) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data) => doctorApi.createPrescription(data),
    onSuccess: (data, variables, context) => {
      toast.success(data.message || "Prescription created successfully!")
      queryClient.invalidateQueries({ queryKey: ["appointmentDetails", appointmentId] })
      if (options.onSuccess) {
        options.onSuccess(data, variables, context)
      }
    },
    onError: (error, variables, context) => {
      const errMsg = error.response?.data?.message || error.message || "Failed to create prescription"
      toast.error(errMsg)
      if (options.onError) {
        options.onError(error, variables, context)
      }
    },
  })
}

export function useCreateLabResult(appointmentId, options = {}) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (formData) => doctorApi.createLabResult(formData),
    onSuccess: (data, variables, context) => {
      toast.success(data.message || "Lab result created successfully!")
      queryClient.invalidateQueries({ queryKey: ["appointmentDetails", appointmentId] })
      if (options.onSuccess) {
        options.onSuccess(data, variables, context)
      }
    },
    onError: (error, variables, context) => {
      const errMsg = error.response?.data?.message || error.message || "Failed to create lab result"
      toast.error(errMsg)
      if (options.onError) {
        options.onError(error, variables, context)
      }
    },
  })
}
