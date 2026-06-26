import { useState } from "react"
import { X, Plus } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function AllergiesInput({ value = [], onChange, disabled }) {
  const [inputValue, setInputValue] = useState("")

  const addAllergy = (e) => {
    e?.preventDefault()
    const trimmed = inputValue.trim()

    // 1. Ignore empty inputs
    if (!trimmed) return

    // 2. Prevent case-insensitive duplicate entries
    const isDuplicate = value.some(
      (item) => item.toLowerCase() === trimmed.toLowerCase()
    )
    if (isDuplicate) {
      setInputValue("")
      return
    }

    // 3. Update list and clear input
    const updated = [...value, trimmed]
    onChange(updated)
    setInputValue("")
  }

  const removeAllergy = (allergyToRemove) => {
    const updated = value.filter((item) => item !== allergyToRemove)
    onChange(updated)
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addAllergy()
    }
  }

  return (
    <div className="space-y-3">
      {/* Allergy Chips Container */}
      <div className="flex flex-wrap gap-2 min-h-8 p-1.5 border border-dashed rounded-lg bg-muted/20">
        {value.length === 0 ? (
          <span className="text-xs text-muted-foreground self-center px-1">
            No allergies added yet.
          </span>
        ) : (
          value.map((allergy, index) => (
            <div
              key={index}
              className="bg-primary/10 text-primary border border-primary/20 hover:border-primary/30 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <span>{allergy}</span>
              <button
                type="button"
                disabled={disabled}
                onClick={() => removeAllergy(allergy)}
                className="hover:bg-primary/20 rounded-full p-0.5 transition-colors disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                title={`Remove ${allergy}`}
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Input controls to add new allergies */}
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="Type allergy (e.g. Penicillin) and press Enter"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          className="flex-1"
        />
        <Button
          type="button"
          variant="outline"
          disabled={disabled || !inputValue.trim()}
          onClick={addAllergy}
          className="gap-1 cursor-pointer"
        >
          <Plus className="h-4 w-4" /> Add
        </Button>
      </div>
    </div>
  )
}
