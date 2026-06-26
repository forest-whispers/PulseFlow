import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { doctorApi } from "../api/doctorApi"
import { toast } from "sonner"

export function useDoctorAvailability() {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ["doctorAvailability"],
    queryFn: doctorApi.getAvailability,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
    refetchOnWindowFocus: false,
  })

  const mutation = useMutation({
    mutationFn: doctorApi.updateAvailability,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["doctorAvailability"] })
      toast.success(data.message || "Schedule update successful")
    },
    onError: (error) => {
      const errMsg = error.response?.data?.message || error.message || "Failed to update availability"
      toast.error(errMsg)
    },
  })

  return {
    ...query,
    updateAvailability: mutation.mutateAsync,
    isUpdating: mutation.isPending,
    updateError: mutation.error,
  }
}
