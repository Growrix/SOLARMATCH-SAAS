import * as React from "react";
import { cn } from "@/lib/utils";

export interface NeumorphicInputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const NeumorphicInput = React.forwardRef<HTMLInputElement, NeumorphicInputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex w-full rounded-xl px-4 py-3 text-sm transition-all duration-300",
          "dark:bg-background dark:text-white",
          "dark:shadow-neu-inset-sm",
          "placeholder:text-white/60",
          "focus-visible:outline-none",
          "focus-visible:dark:shadow-[inset_6px_6px_12px_var(--neu-shadow-dark),inset_-6px_-6px_12px_var(--neu-shadow-light),0_0_0_2px_rgba(255,255,255,0.3)]",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

NeumorphicInput.displayName = "NeumorphicInput";

export { NeumorphicInput };
