import axiosInstance from "@/lib/axios"

export const medicalRecordApi = {
  getMedicalRecords: async (params) => {
    const response = await axiosInstance.get("/medical-records", { params })
    return response.data
  },
  getMedicalRecordDetails: async (id) => {
    const response = await axiosInstance.get(`/medical-records/${id}`)
    return response.data
  },
  updateMedicalRecord: async (id, formData) => {
    const response = await axiosInstance.patch(`/medical-records/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    return response.data
  },
  deleteMedicalRecord: async (id) => {
    const response = await axiosInstance.delete(`/medical-records/${id}`)
    return response.data
  },
}
