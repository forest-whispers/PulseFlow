import { useNavigate } from "react-router-dom"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Receipt, CreditCard, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react"

export default function PendingInvoiceCard({ invoice }) {
  const navigate = useNavigate()

  // Success state: No pending invoices (Reassuring success appearance)
  if (!invoice) {
    return (
      <Card className="border-emerald-200/60 dark:border-emerald-900/25 bg-emerald-500/[0.01] shadow-2xs hover:shadow-xs transition-shadow duration-200 h-full flex flex-col justify-between p-6 min-h-[260px]">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-500/10">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-foreground">Billing Status</h3>
              <p className="text-emerald-600 dark:text-emerald-500 text-xs font-semibold uppercase tracking-wider">Account Clear</p>
            </div>
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed">
            All your invoices have been paid. There are no outstanding consultation fees or lab bills pending checkout.
          </p>
        </div>
        <Button
          onClick={() => navigate("/patient/invoices")}
          variant="outline"
          className="w-full gap-2 cursor-pointer mt-4 border-emerald-200/50 hover:bg-emerald-500/5 hover:text-emerald-600 text-foreground"
        >
          View Billing History
        </Button>
      </Card>
    )
  }

  return (
    <Card className="border-amber-200/80 dark:border-amber-900/35 bg-amber-500/[0.015] shadow-2xs hover:shadow-xs transition-shadow duration-200 h-full flex flex-col justify-between p-6 min-h-[260px]">
      <div className="space-y-5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0 border border-amber-500/20">
              <Receipt className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-foreground">Pending Payment</h3>
              <p className="text-amber-600 dark:text-amber-500 text-xs font-semibold uppercase tracking-wider">Requires Attention</p>
            </div>
          </div>
          <Badge className="bg-amber-500/15 text-amber-700 border-amber-300/25 px-2.5 py-0.5 font-semibold text-xs rounded-full uppercase">
            Pending
          </Badge>
        </div>

        {/* Emphasized Details */}
        <div className="space-y-3 pt-1">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-foreground tracking-tight">
              ₹{invoice.amount}
            </span>
            <span className="text-xs text-muted-foreground font-semibold">outstanding balance</span>
          </div>
          <div className="flex items-start gap-2 text-sm text-foreground/80 leading-relaxed min-h-[40px]">
            <AlertCircle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
            <span className="truncate-2-lines">
              {invoice.description || "Consultation Fee"}
            </span>
          </div>
        </div>
      </div>

      <Button
        onClick={() => navigate(`/patient/invoices/${invoice._id}`)}
        className="w-full gap-2 cursor-pointer mt-6 bg-amber-500 hover:bg-amber-600 text-white border-none"
      >
        <CreditCard className="h-4 w-4" /> Pay Invoice <ArrowRight className="h-4 w-4" />
      </Button>
    </Card>
  )
}
