import axiosInstance from "@/lib/axios"

export const patientApi = {
  getDashboardData: async () => {
    const response = await axiosInstance.get("/dashboard/patient")
    return response.data
  },
  searchDoctors: async (params) => {
    const response = await axiosInstance.get("/doctors", { params })
    return response.data
  },
  getDoctorDetails: async (id) => {
    const response = await axiosInstance.get(`/doctors/${id}`)
    return response.data
  },
  getAvailableSlots: async (id, date) => {
    const response = await axiosInstance.get(`/doctors/${id}/available-slots`, { params: { date } })
    return response.data
  },
  bookAppointment: async (bookingData) => {
    const response = await axiosInstance.post("/appointments", bookingData)
    return response.data
  },
  getAppointments: async (params) => {
    const response = await axiosInstance.get("/appointments", { params })
    return response.data
  },
  getAppointmentDetails: async (id) => {
    const response = await axiosInstance.get(`/appointments/${id}`)
    return response.data
  },
  cancelAppointment: async (id) => {
    const response = await axiosInstance.patch(`/appointments/${id}/cancel`)
    return response.data
  },
  rescheduleAppointment: async (id, rescheduleData) => {
    const response = await axiosInstance.patch(`/appointments/${id}/reschedule`, rescheduleData)
    return response.data
  },
  updateAppointmentStatus: async (id, statusData) => {
    const response = await axiosInstance.patch(`/appointments/${id}/status`, statusData)
    return response.data
  },
  getProfile: async () => {
    const response = await axiosInstance.get("/patients/me")
    return response.data
  },
  updateProfile: async (data) => {
    const response = await axiosInstance.patch("/patients/me", data)
    return response.data
  },
}
