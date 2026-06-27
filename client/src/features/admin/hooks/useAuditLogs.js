import { useQuery, keepPreviousData } from "@tanstack/react-query"
import { auditApi } from "../api/auditApi"

export function useAuditLogs(page = 1, limit = 10) {
  return useQuery({
    queryKey: ["adminAuditLogs", { page, limit }],
    queryFn: () => auditApi.getAuditLogs({ page, limit }),
    staleTime: 10000, // 10 seconds stale time
    placeholderData: keepPreviousData,
  })
}
