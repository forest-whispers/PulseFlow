import axiosInstance from "@/lib/axios"

export const adminApi = {
  getDashboard: async () => {
    const response = await axiosInstance.get("/dashboard/admin")
    return response.data
  },
}
