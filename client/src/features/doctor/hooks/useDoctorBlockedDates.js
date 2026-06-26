import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { doctorApi } from "../api/doctorApi"
import { toast } from "sonner"

export function useDoctorBlockedDates() {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ["doctorBlockedDates"],
    queryFn: async () => {
      try {
        const response = await doctorApi.getBlockedDates()
        return response
      } catch (error) {
        // Intercept 404 "No blocked dates" error and resolve with a standard empty structure
        if (error.response?.status === 404) {
          return {
            success: true,
            data: {
              blockedDates: [],
            },
          }
        }
        throw error
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes cache staleTime for smoother navigation
    refetchOnWindowFocus: false,
  })

  const addMutation = useMutation({
    mutationFn: doctorApi.addBlockedDate,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["doctorBlockedDates"] })
      toast.success(data.message || "Blocked date added successfully")
    },
    onError: (error) => {
      const errMsg = error.response?.data?.message || error.message || "Failed to add blocked date"
      toast.error(errMsg)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: doctorApi.deleteBlockedDate,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["doctorBlockedDates"] })
      toast.success(data.message || "Blocked date deleted successfully")
    },
    onError: (error) => {
      const errMsg = error.response?.data?.message || error.message || "Failed to delete blocked date"
      toast.error(errMsg)
    },
  })

  return {
    ...query,
    addBlockedDate: addMutation.mutateAsync,
    isAdding: addMutation.isPending,
    addError: addMutation.error,
    deleteBlockedDate: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
    deleteError: deleteMutation.error,
  }
}
