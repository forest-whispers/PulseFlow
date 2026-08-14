import { Search, FilterX, ArrowUpDown, ChevronDown } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select } from "@/components/ui/select"

const SPECIALIZATIONS = [
  "Cardiology",
  "Dermatology",
  "Pediatrics",
  "Orthopedics",
  "Neurology",
  "General Medicine",
  "Gynecology",
  "Psychiatry",
]

export default function DoctorFilters({
  filters,
  onFilterChange,
  onClear,
  localSearch,
  setLocalSearch,
}) {
  const handleSpecializationChange = (e) => {
    onFilterChange("specialization", e.target.value)
  }

  const handleMinFeeChange = (e) => {
    const val = e.target.value === "" ? "" : Number(e.target.value)
    onFilterChange("minFee", val)
  }

  const handleMaxFeeChange = (e) => {
    const val = e.target.value === "" ? "" : Number(e.target.value)
    onFilterChange("maxFee", val)
  }

  const handleSortByChange = (e) => {
    onFilterChange("sortBy", e.target.value || "")
  }

  const toggleSortOrder = () => {
    const newOrder = filters.order === "asc" ? "desc" : "asc"
    onFilterChange("order", newOrder)
  }

  return (
    <div className="bg-card border rounded-xl p-5 shadow-2xs space-y-4 animate-fade-in">
      {/* Top Search Bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search doctors by name..."
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          className="pl-10 h-11 w-full bg-background"
        />
      </div>

      {/* Filters Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end pt-1">
        {/* Specialization Filter */}
        <div className="space-y-1.5 col-span-1">
          <Label htmlFor="specialization" className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            Specialization
          </Label>
          <Select
            id="specialization"
            value={filters.specialization || ""}
            onChange={handleSpecializationChange}
            className="w-full"
          >
            <option value="">All Specializations</option>
            {SPECIALIZATIONS.map((spec) => (
              <option key={spec} value={spec}>
                {spec}
              </option>
            ))}
          </Select>
        </div>

        {/* Min Fee Filter */}
        <div className="space-y-1.5 col-span-1">
          <Label htmlFor="minFee" className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            Min Fee (₹)
          </Label>
          <Input
            id="minFee"
            type="number"
            min="0"
            placeholder="Min"
            value={filters.minFee ?? ""}
            onChange={handleMinFeeChange}
            className="h-10 bg-background"
          />
        </div>

        {/* Max Fee Filter */}
        <div className="space-y-1.5 col-span-1">
          <Label htmlFor="maxFee" className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            Max Fee (₹)
          </Label>
          <Input
            id="maxFee"
            type="number"
            min="0"
            placeholder="Max"
            value={filters.maxFee ?? ""}
            onChange={handleMaxFeeChange}
            className="h-10 bg-background"
          />
        </div>

        {/* Sort By Option */}
        <div className="space-y-1.5 col-span-1">
          <Label htmlFor="sortBy" className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            Sort By
          </Label>
          <div className="flex gap-2">
            <Select
              id="sortBy"
              value={filters.sortBy || ""}
              onChange={handleSortByChange}
              className="flex-1"
            >
              <option value="">Default Sort</option>
              <option value="consultationFee">Fee</option>
              <option value="experience">Experience</option>
            </Select>
            {filters.sortBy && (
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={toggleSortOrder}
                className="h-10 w-10 cursor-pointer shrink-0"
                title={`Sort ${filters.order === "asc" ? "ascending" : "descending"}`}
              >
                <ArrowUpDown className={`h-4 w-4 transition-transform duration-200 ${filters.order === "desc" ? "rotate-180" : ""}`} />
              </Button>
            )}
          </div>
        </div>

        {/* Clear Filters Button */}
        <Button
          type="button"
          variant="outline"
          onClick={onClear}
          disabled={
            !localSearch &&
            !filters.specialization &&
            !filters.minFee &&
            !filters.maxFee &&
            !filters.sortBy
          }
          className="h-10 w-full gap-2 cursor-pointer font-medium"
        >
          <FilterX className="h-4 w-4" /> Clear Filters
        </Button>
      </div>
    </div>
  )
}
