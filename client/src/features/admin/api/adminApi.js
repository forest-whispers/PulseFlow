import axiosInstance from "@/lib/axios"

export const adminApi = {
  getDashboard: async () => {
    const response = await axiosInstance.get("/dashboard/admin")
    return response.data
  },
  getAppointments: async (page = 1, limit = 10) => {
    const response = await axiosInstance.get("/appointments", { params: { page, limit } })
    return response.data
  },
}
