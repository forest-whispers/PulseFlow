import axiosInstance from "@/lib/axios"

export const userApi = {
  getUsers: async (params) => {
    const response = await axiosInstance.get("/users", { params })
    return response.data
  },
  getUserDetails: async (id) => {
    const response = await axiosInstance.get(`/users/${id}`)
    return response.data
  },
}
