import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useSelector, useDispatch } from "react-redux"
import { doctorApi } from "../api/doctorApi"
import { setAuth } from "@/store/authSlice"
import { toast } from "sonner"

export function useDoctorProfile() {
  const queryClient = useQueryClient()
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)

  const query = useQuery({
    queryKey: ["doctorProfile"],
    queryFn: doctorApi.getProfile,
    staleTime: 5 * 60 * 1000, // 5 minutes stale time
    refetchOnWindowFocus: false,
    enabled: !!user && user.role === "doctor",
  })

  const updateMutation = useMutation({
    mutationFn: doctorApi.updateProfile,
    onSuccess: (response) => {
      const updatedProfile = response.data

      // Optimistically update the query cache without making another network request
      queryClient.setQueryData(["doctorProfile"], {
        success: true,
        data: updatedProfile,
      })

      // Sync only the globally displayed fields (like name) in the Redux auth store
      if (user) {
        dispatch(setAuth({
          ...user,
          name: updatedProfile.name,
        }))
      }

      toast.success(response.message || "Profile updated successfully")
    },
    onError: (error) => {
      const errMsg = error.response?.data?.message || error.message || "Failed to update profile"
      toast.error(errMsg)
    },
  })

  return {
    ...query,
    updateProfile: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    updateError: updateMutation.error,
  }
}
