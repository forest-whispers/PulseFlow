import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useSelector, useDispatch } from "react-redux"
import { patientApi } from "../api/patientApi"
import { setAuth } from "@/store/authSlice"
import { toast } from "sonner"

export function usePatientProfile() {
  const queryClient = useQueryClient()
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)

  const query = useQuery({
    queryKey: ["patientProfile"],
    queryFn: patientApi.getProfile,
    staleTime: 5 * 60 * 1000, // 5 minutes stale time
    refetchOnWindowFocus: false,
    enabled: !!user && user.role === "patient",
  })

  const updateMutation = useMutation({
    mutationFn: patientApi.updateProfile,
    onSuccess: (response) => {
      const updatedProfile = response.data

      // Optimistically update the query cache with the returned response
      queryClient.setQueryData(["patientProfile"], {
        success: true,
        data: updatedProfile,
      })

      // Sync only globally displayed user information (name) in Redux auth
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
