import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { invoiceApi } from "../api/invoiceApi"
import { toast } from "sonner"

export function useInvoicesList(params) {
  return useQuery({
    queryKey: ["invoicesList", params],
    queryFn: () => invoiceApi.getInvoices(params),
    staleTime: 5000,
  })
}

export function useInvoiceDetails(id) {
  return useQuery({
    queryKey: ["invoiceDetails", id],
    queryFn: () => invoiceApi.getInvoiceDetails(id),
    enabled: !!id,
    staleTime: 5000,
  })
}

export function useCreateInvoice(options = {}) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data) => invoiceApi.createInvoice(data),
    onSuccess: (data, variables, context) => {
      toast.success(data.message || "Invoice generated successfully!")
      queryClient.invalidateQueries({ queryKey: ["invoicesList"] })
      queryClient.invalidateQueries({ queryKey: ["appointmentDetails"] })
      queryClient.invalidateQueries({ queryKey: ["medicalRecordDetails"] })
      if (options.onSuccess) {
        options.onSuccess(data, variables, context)
      }
    },
    onError: (error, variables, context) => {
      const errMsg = error.response?.data?.message || error.message || "Failed to create invoice"
      toast.error(errMsg)
      if (options.onError) {
        options.onError(error, variables, context)
      }
    },
  })
}

export function useUpdateInvoice(id, options = {}) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data) => invoiceApi.updateInvoice(id, data),
    onSuccess: (data, variables, context) => {
      toast.success(data.message || "Invoice updated successfully!")
      queryClient.invalidateQueries({ queryKey: ["invoiceDetails", id] })
      queryClient.invalidateQueries({ queryKey: ["invoicesList"] })
      queryClient.invalidateQueries({ queryKey: ["appointmentDetails"] })
      queryClient.invalidateQueries({ queryKey: ["medicalRecordDetails"] })
      if (options.onSuccess) {
        options.onSuccess(data, variables, context)
      }
    },
    onError: (error, variables, context) => {
      const errMsg = error.response?.data?.message || error.message || "Failed to update invoice"
      toast.error(errMsg)
      if (options.onError) {
        options.onError(error, variables, context)
      }
    },
  })
}

export function useDeleteInvoice(id, options = {}) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => invoiceApi.deleteInvoice(id),
    onSuccess: (data, variables, context) => {
      toast.success(data.message || "Invoice deleted successfully!")
      queryClient.invalidateQueries({ queryKey: ["invoicesList"] })
      queryClient.invalidateQueries({ queryKey: ["appointmentDetails"] })
      queryClient.invalidateQueries({ queryKey: ["medicalRecordDetails"] })
      if (options.onSuccess) {
        options.onSuccess(data, variables, context)
      }
    },
    onError: (error, variables, context) => {
      const errMsg = error.response?.data?.message || error.message || "Failed to delete invoice"
      toast.error(errMsg)
      if (options.onError) {
        options.onError(error, variables, context)
      }
    },
  })
}

export function useCreateCheckoutSession(options = {}) {
  return useMutation({
    mutationFn: (invoiceId) => invoiceApi.createCheckoutSession(invoiceId),
    onSuccess: (data, variables, context) => {
      if (options.onSuccess) {
        options.onSuccess(data, variables, context)
      }
    },
    onError: (error, variables, context) => {
      const errMsg = error.response?.data?.message || error.message || "Failed to create checkout session"
      toast.error(errMsg)
      if (options.onError) {
        options.onError(error, variables, context)
      }
    },
  })
}
