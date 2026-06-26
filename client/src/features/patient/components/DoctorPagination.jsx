import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function DoctorPagination({
  page,
  totalPages,
  total,
  limit,
  onPageChange,
}) {
  if (totalPages <= 1) return null

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  const startRange = (page - 1) * limit + 1
  const endRange = Math.min(page * limit, total)

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t pt-6 mt-6">
      {/* Range Status Label */}
      <div className="text-sm text-muted-foreground">
        Showing <span className="font-medium text-foreground">{startRange}</span> to{" "}
        <span className="font-medium text-foreground">{endRange}</span> of{" "}
        <span className="font-medium text-foreground">{total}</span> doctors
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center gap-1.5">
        {/* Previous Button */}
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className="h-9 w-9 cursor-pointer"
          title="Previous Page"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {/* Numeric Page List */}
        {pages.map((p) => {
          // Render page button or ellipsis if too many pages
          const isActive = p === page
          return (
            <Button
              key={p}
              variant={isActive ? "default" : "outline"}
              onClick={() => onPageChange(p)}
              className={`h-9 w-9 text-xs font-semibold cursor-pointer ${
                isActive ? "font-bold shadow-xs" : ""
              }`}
            >
              {p}
            </Button>
          )
        })}

        {/* Next Button */}
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          className="h-9 w-9 cursor-pointer"
          title="Next Page"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
