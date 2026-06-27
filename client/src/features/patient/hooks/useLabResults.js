import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { labResultApi } from "../api/labResultApi"
import { toast } from "sonner"

export function useLabResultsList(params) {
  return useQuery({
    queryKey: ["labResultsList", params],
    queryFn: () => labResultApi.getLabResults(params),
    staleTime: 5000,
  })
}

export function useLabResultDetails(id) {
  return useQuery({
    queryKey: ["labResultDetails", id],
    queryFn: () => labResultApi.getLabResultDetails(id),
    enabled: !!id,
    staleTime: 5000,
  })
}

export function useUpdateLabResult(id, options = {}) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (formData) => labResultApi.updateLabResult(id, formData),
    onSuccess: (data, variables, context) => {
      toast.success(data.message || "Lab result updated successfully!")
      queryClient.invalidateQueries({ queryKey: ["labResultDetails", id] })
      queryClient.invalidateQueries({ queryKey: ["labResultsList"] })
      queryClient.invalidateQueries({ queryKey: ["medicalRecordDetails"] })
      queryClient.invalidateQueries({ queryKey: ["appointmentDetails"] })
      if (options.onSuccess) {
        options.onSuccess(data, variables, context)
      }
    },
    onError: (error, variables, context) => {
      const errMsg = error.response?.data?.message || error.message || "Failed to update lab result"
      toast.error(errMsg)
      if (options.onError) {
        options.onError(error, variables, context)
      }
    },
  })
}

export function useDeleteLabResult(id, options = {}) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => labResultApi.deleteLabResult(id),
    onSuccess: (data, variables, context) => {
      toast.success(data.message || "Lab result deleted successfully!")
      queryClient.invalidateQueries({ queryKey: ["labResultsList"] })
      queryClient.invalidateQueries({ queryKey: ["medicalRecordDetails"] })
      queryClient.invalidateQueries({ queryKey: ["appointmentDetails"] })
      if (options.onSuccess) {
        options.onSuccess(data, variables, context)
      }
    },
    onError: (error, variables, context) => {
      const errMsg = error.response?.data?.message || error.message || "Failed to delete lab result"
      toast.error(errMsg)
      if (options.onError) {
        options.onError(error, variables, context)
      }
    },
  })
}
