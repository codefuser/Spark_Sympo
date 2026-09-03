import React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, leftIcon, rightIcon, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-mono font-medium text-secondary-foreground tracking-wider uppercase"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3 text-secondary-foreground pointer-events-none">
              {leftIcon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            className={cn(
              "w-full rounded-xl bg-slate-900/80 border border-slate-700/80 px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-200 disabled:opacity-50",
              leftIcon && "pl-10",
              rightIcon && "pr-10",
              error && "border-rose-500/80 focus:border-rose-500 focus:ring-rose-500/20",
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 text-secondary-foreground pointer-events-none">
              {rightIcon}
            </div>
          )}
        </div>
        {error && <p className="text-xs text-destructive font-mono">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
