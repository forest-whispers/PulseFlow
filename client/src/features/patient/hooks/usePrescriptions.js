import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { prescriptionApi } from "../api/prescriptionApi"
import { toast } from "sonner"

export function usePrescriptionsList(params) {
  return useQuery({
    queryKey: ["prescriptionsList", params],
    queryFn: () => prescriptionApi.getPrescriptions(params),
    staleTime: 5000,
  })
}

export function usePrescriptionDetails(id) {
  return useQuery({
    queryKey: ["prescriptionDetails", id],
    queryFn: () => prescriptionApi.getPrescriptionDetails(id),
    enabled: !!id,
    staleTime: 5000,
  })
}

export function useUpdatePrescription(id, options = {}) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data) => prescriptionApi.updatePrescription(id, data),
    onSuccess: (data, variables, context) => {
      toast.success(data.message || "Prescription updated successfully!")
      queryClient.invalidateQueries({ queryKey: ["prescriptionDetails", id] })
      queryClient.invalidateQueries({ queryKey: ["prescriptionsList"] })
      queryClient.invalidateQueries({ queryKey: ["medicalRecordDetails"] })
      queryClient.invalidateQueries({ queryKey: ["appointmentDetails"] })
      if (options.onSuccess) {
        options.onSuccess(data, variables, context)
      }
    },
    onError: (error, variables, context) => {
      const errMsg = error.response?.data?.message || error.message || "Failed to update prescription"
      toast.error(errMsg)
      if (options.onError) {
        options.onError(error, variables, context)
      }
    },
  })
}

export function useDeletePrescription(id, options = {}) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => prescriptionApi.deletePrescription(id),
    onSuccess: (data, variables, context) => {
      toast.success(data.message || "Prescription deleted successfully!")
      queryClient.invalidateQueries({ queryKey: ["prescriptionsList"] })
      queryClient.invalidateQueries({ queryKey: ["medicalRecordDetails"] })
      queryClient.invalidateQueries({ queryKey: ["appointmentDetails"] })
      if (options.onSuccess) {
        options.onSuccess(data, variables, context)
      }
    },
    onError: (error, variables, context) => {
      const errMsg = error.response?.data?.message || error.message || "Failed to delete prescription"
      toast.error(errMsg)
      if (options.onError) {
        options.onError(error, variables, context)
      }
    },
  })
}
