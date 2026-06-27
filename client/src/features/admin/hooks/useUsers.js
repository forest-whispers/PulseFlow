import { useQuery, keepPreviousData } from "@tanstack/react-query"
import { userApi } from "../api/userApi"

export function useUsers(page = 1, limit = 10, role = "") {
  const params = { page, limit }
  if (role && role !== "all") {
    params.role = role
  }

  return useQuery({
    queryKey: ["adminUsers", { page, limit, role }],
    queryFn: () => userApi.getUsers(params),
    staleTime: 15000, // 15 seconds stale time for users list
    placeholderData: keepPreviousData,
  })
}

export function useUserDetails(id) {
  return useQuery({
    queryKey: ["adminUserDetails", id],
    queryFn: () => userApi.getUserDetails(id),
    staleTime: 5 * 60 * 1000, // 5 minutes cache stale time
    enabled: !!id,
  })
}
