import axiosInstance from "@/lib/axios"

export const doctorApi = {
  getDashboardData: async () => {
    const response = await axiosInstance.get("/dashboard/doctor")
    return response.data
  },
  getAvailability: async () => {
    const response = await axiosInstance.get("/doctor-availability/me")
    return response.data
  },
  updateAvailability: async (data) => {
    const response = await axiosInstance.patch("/doctor-availability", data)
    return response.data
  },
  getBlockedDates: async () => {
    const response = await axiosInstance.get("/availability-exceptions/me")
    return response.data
  },
  addBlockedDate: async (data) => {
    const response = await axiosInstance.post("/availability-exceptions", data)
    return response.data
  },
  deleteBlockedDate: async (blockedDate) => {
    const response = await axiosInstance.delete(`/availability-exceptions/${blockedDate}`)
    return response.data
  },
  getProfile: async () => {
    const response = await axiosInstance.get("/doctor-profile/me")
    return response.data
  },
  updateProfile: async (data) => {
    const response = await axiosInstance.patch("/doctor-profile/me", data)
    return response.data
  },
  createMedicalRecord: async (formData) => {
    const response = await axiosInstance.post("/medical-records", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    return response.data
  },
  createPrescription: async (data) => {
    const response = await axiosInstance.post("/prescriptions", data)
    return response.data
  },
  createLabResult: async (formData) => {
    const response = await axiosInstance.post("/lab-results", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    return response.data
  },
}
