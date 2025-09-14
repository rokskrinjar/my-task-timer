import * as React from "react"
import { cn } from "@/lib/utils"

interface PillToggleProps {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  disabled?: boolean
  className?: string
}

const PillToggle = React.forwardRef<HTMLInputElement, PillToggleProps>(
  ({ checked, onCheckedChange, disabled = false, className }, ref) => {
    return (
      <label 
        className={cn(
          "inline-flex cursor-pointer items-center",
          disabled && "cursor-not-allowed opacity-50",
          className
        )}
      >
        <input
          ref={ref}
          type="checkbox"
          checked={checked}
          onChange={(e) => onCheckedChange(e.target.checked)}
          disabled={disabled}
          className="sr-only"
        />
        <div 
          className={cn(
            "relative h-6 w-11 rounded-full transition-colors duration-200",
            "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
            checked 
              ? "bg-primary" 
              : "bg-input"
          )}
        >
          <div 
            className={cn(
              "absolute top-0.5 h-5 w-5 rounded-full bg-background shadow-lg transition-transform duration-200",
              checked ? "translate-x-5" : "translate-x-0.5"
            )}
          />
        </div>
      </label>
    )
  }
)

PillToggle.displayName = "PillToggle"

export { PillToggle }