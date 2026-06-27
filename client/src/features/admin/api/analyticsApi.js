import axiosInstance from "@/lib/axios"

export const analyticsApi = {
  getAnalytics: async () => {
    const response = await axiosInstance.get("/analytics")
    return response.data
  },
}
