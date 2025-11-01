import * as React from "react";
import { cn } from "@/lib/utils";

interface NeumorphicCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'flat' | 'pressed' | 'floating';
  hover?: boolean;
}

export const NeumorphicCard = React.forwardRef<HTMLDivElement, NeumorphicCardProps>(
  ({ variant = 'flat', hover = true, className, children, ...props }, ref) => {
    const variantClasses = {
      flat: 'dark:shadow-neu-outset',
      pressed: 'dark:shadow-neu-inset',
      floating: 'dark:shadow-[10px_10px_20px_var(--neu-shadow-dark),-10px_-10px_20px_var(--neu-shadow-light)]',
    };

    return (
      <div
        ref={ref}
        className={cn(
          "dark:bg-background rounded-2xl p-8 transition-all duration-300",
          variantClasses[variant],
          hover && variant !== 'pressed' && "hover:dark:shadow-[8px_8px_16px_var(--neu-shadow-dark),-8px_-8px_16px_var(--neu-shadow-light)] hover:-translate-y-1",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

NeumorphicCard.displayName = "NeumorphicCard";

// Icon Container for neumorphic design
interface NeumorphicIconContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
}

export const NeumorphicIconContainer = React.forwardRef<HTMLDivElement, NeumorphicIconContainerProps>(
  ({ size = 'md', className, children, ...props }, ref) => {
    const sizeClasses = {
      sm: 'w-12 h-12',
      md: 'w-20 h-20',
      lg: 'w-24 h-24',
    };

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-full dark:bg-background dark:shadow-neu-inset flex items-center justify-center",
          "transition-all duration-300",
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

NeumorphicIconContainer.displayName = "NeumorphicIconContainer";
