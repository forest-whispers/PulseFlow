import axiosInstance from "@/lib/axios"

export const prescriptionApi = {
  getPrescriptions: async (params) => {
    const response = await axiosInstance.get("/prescriptions", { params })
    return response.data
  },
  getPrescriptionDetails: async (id) => {
    const response = await axiosInstance.get(`/prescriptions/${id}`)
    return response.data
  },
  updatePrescription: async (id, data) => {
    const response = await axiosInstance.patch(`/prescriptions/${id}`, data)
    return response.data
  },
  deletePrescription: async (id) => {
    const response = await axiosInstance.delete(`/prescriptions/${id}`)
    return response.data
  },
}
