import axiosInstance from "@/lib/axios"

export const invoiceApi = {
  createInvoice: async (data) => {
    const response = await axiosInstance.post("/invoices", data)
    return response.data
  },
  getInvoices: async (params) => {
    const response = await axiosInstance.get("/invoices", { params })
    return response.data
  },
  getInvoiceDetails: async (id) => {
    const response = await axiosInstance.get(`/invoices/${id}`)
    return response.data
  },
  updateInvoice: async (id, data) => {
    const response = await axiosInstance.patch(`/invoices/${id}`, data)
    return response.data
  },
  deleteInvoice: async (id) => {
    const response = await axiosInstance.delete(`/invoices/${id}`)
    return response.data
  },
  createCheckoutSession: async (invoiceId) => {
    const response = await axiosInstance.post("/payments/create-checkout-session", { invoiceId })
    return response.data
  },
}
