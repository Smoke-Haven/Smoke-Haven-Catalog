import * as React from "react"
import { cn } from "@/lib/utils"
import { ChevronDown } from "lucide-react"

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div className="relative w-full">
        <select
          ref={ref}
          className={cn(
            "appearance-none flex h-12 w-full items-center justify-between rounded-xl border border-border bg-background/50 px-4 py-2 text-sm shadow-sm backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50 text-foreground",
            className
          )}
          {...props}
        >
          {children}
        </select>
        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white pointer-events-none" />
      </div>
    )
  }
)
Select.displayName = "Select"

export { Select }
