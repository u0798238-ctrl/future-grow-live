import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border-2 border-[#6F9DB5]/40 bg-[#071E2C] px-3 py-2 text-sm text-white shadow-[0_0_10px_rgba(111,157,181,0.1)] ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[#8FA3AF] focus-visible:outline-none focus-visible:border-[#6F9DB5] focus-visible:shadow-[0_0_15px_rgba(111,157,181,0.3)] transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
