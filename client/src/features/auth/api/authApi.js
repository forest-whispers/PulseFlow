import axiosInstance from "@/lib/axios"

export const authApi = {
  register: async (userData) => {
    const response = await axiosInstance.post("/users/register", userData)
    return response.data
  },

  login: async (credentials) => {
    const response = await axiosInstance.post("/users/login", credentials)
    return response.data
  },

  logout: async () => {
    const response = await axiosInstance.get("/users/logout")
    return response.data
  },

  getPatientProfile: async () => {
    const response = await axiosInstance.get("/patients/me")
    return response.data
  },

  getDoctorProfile: async () => {
    const response = await axiosInstance.get("/doctor-profile/me")
    return response.data
  },
}
