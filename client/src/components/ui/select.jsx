import React, { useState, useEffect, useRef } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"

export function Select({ children, value, onChange, id, name, className, placeholder }) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Filter and parse children options
  const options = React.Children.toArray(children)
    .filter(child => child && child.type === "option")
    .map(child => ({
      value: child.props.value,
      label: child.props.children,
      disabled: child.props.disabled,
    }))

  const selectedOption = options.find(opt => String(opt.value) === String(value)) || options[0]

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  const handleSelect = (val) => {
    setIsOpen(false)
    if (onChange) {
      onChange({
        target: {
          id: id,
          name: name,
          value: val,
        }
      })
    }
  }

  return (
    <div className={cn("relative w-full", className)} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-9 w-full rounded-xl border border-border bg-card px-3.5 py-1.5 text-xs font-bold text-foreground items-center justify-between shadow-2xs transition-all duration-200 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/40 cursor-pointer"
      >
        <span>{selectedOption ? selectedOption.label : placeholder || "Select option"}</span>
        {isOpen ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
        )}
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-1.5 w-full bg-card border border-border/40 rounded-2xl shadow-lg py-1.5 z-50 animate-fade-in max-h-60 overflow-y-auto">
          {options.map((opt, idx) => {
            const isSelected = String(opt.value) === String(value)
            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelect(opt.value)}
                className={cn(
                  "text-left px-3.5 py-2.5 text-xs font-bold transition-all duration-150 cursor-pointer rounded-xl mx-1 flex items-center justify-between w-[calc(100%-8px)]",
                  isSelected
                    ? "bg-primary/15 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-primary/5"
                )}
              >
                <span>{opt.label}</span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Select