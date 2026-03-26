import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "secondary" | "outline" | "ghost" | "destructive" | "ghost-destructive";
  size?: "default" | "sm" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
          {
            "bg-primary text-primary-foreground shadow-[0_0_15px_rgba(0,255,255,0.2)] hover:shadow-[0_0_25px_rgba(0,255,255,0.4)] hover:bg-primary/90": variant === "default",
            "bg-secondary text-secondary-foreground shadow hover:bg-secondary/80": variant === "secondary",
            "border border-border bg-background/50 hover:bg-muted hover:text-foreground": variant === "outline",
            "hover:bg-muted hover:text-foreground": variant === "ghost",
            "bg-destructive text-destructive-foreground shadow hover:bg-destructive/90": variant === "destructive",
            "text-destructive hover:bg-destructive/10": variant === "ghost-destructive",
            "h-11 px-6 py-2": size === "default",
            "h-9 rounded-lg px-4": size === "sm",
            "h-14 rounded-2xl px-8 text-base": size === "lg",
            "h-11 w-11": size === "icon",
          },
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
