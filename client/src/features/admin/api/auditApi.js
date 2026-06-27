import axiosInstance from "@/lib/axios"

export const auditApi = {
  getAuditLogs: async (params) => {
    const response = await axiosInstance.get("/audit-logs", { params })
    return response.data
  },
}
