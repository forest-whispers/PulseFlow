import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { medicalRecordApi } from "../api/medicalRecordApi"
import { toast } from "sonner"

export function useMedicalRecordsList(params) {
  return useQuery({
    queryKey: ["medicalRecordsList", params],
    queryFn: () => medicalRecordApi.getMedicalRecords(params),
    staleTime: 5000,
  })
}

export function useMedicalRecordDetails(id) {
  return useQuery({
    queryKey: ["medicalRecordDetails", id],
    queryFn: () => medicalRecordApi.getMedicalRecordDetails(id),
    enabled: !!id,
    staleTime: 5000,
  })
}

export function useUpdateMedicalRecord(id, options = {}) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (formData) => medicalRecordApi.updateMedicalRecord(id, formData),
    onSuccess: (data, variables, context) => {
      toast.success(data.message || "Medical record updated successfully!")
      queryClient.invalidateQueries({ queryKey: ["medicalRecordDetails", id] })
      queryClient.invalidateQueries({ queryKey: ["medicalRecordsList"] })
      queryClient.invalidateQueries({ queryKey: ["appointmentDetails"] })
      if (options.onSuccess) {
        options.onSuccess(data, variables, context)
      }
    },
    onError: (error, variables, context) => {
      const errMsg = error.response?.data?.message || error.message || "Failed to update medical record"
      toast.error(errMsg)
      if (options.onError) {
        options.onError(error, variables, context)
      }
    },
  })
}

export function useDeleteMedicalRecord(id, options = {}) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => medicalRecordApi.deleteMedicalRecord(id),
    onSuccess: (data, variables, context) => {
      toast.success(data.message || "Medical record deleted successfully!")
      queryClient.invalidateQueries({ queryKey: ["medicalRecordsList"] })
      queryClient.invalidateQueries({ queryKey: ["appointmentDetails"] })
      if (options.onSuccess) {
        options.onSuccess(data, variables, context)
      }
    },
    onError: (error, variables, context) => {
      const errMsg = error.response?.data?.message || error.message || "Failed to delete medical record"
      toast.error(errMsg)
      if (options.onError) {
        options.onError(error, variables, context)
      }
    },
  })
}
