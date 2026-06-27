import axiosInstance from "@/lib/axios"

export const labResultApi = {
  getLabResults: async (params) => {
    const response = await axiosInstance.get("/lab-results", { params })
    return response.data
  },
  getLabResultDetails: async (id) => {
    const response = await axiosInstance.get(`/lab-results/${id}`)
    return response.data
  },
  updateLabResult: async (id, formData) => {
    const response = await axiosInstance.patch(`/lab-results/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    return response.data
  },
  deleteLabResult: async (id) => {
    const response = await axiosInstance.delete(`/lab-results/${id}`)
    return response.data
  },
}
