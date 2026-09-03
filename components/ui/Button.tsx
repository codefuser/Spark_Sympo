import React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "cyan" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      children,
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      type = "button",
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed select-none rounded-lg";

    const variants = {
      primary:
        "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-medium shadow-md shadow-cyan-950/50 border border-cyan-400/30 active:scale-[0.98]",
      cyan:
        "bg-cyan-600 hover:bg-cyan-500 text-white font-medium shadow-sm border border-cyan-400/30 active:scale-[0.98]",
      outline:
        "border border-slate-700/80 bg-slate-800/40 text-cyan-400 hover:bg-slate-800 hover:text-cyan-300 hover:border-slate-600 active:scale-[0.98]",
      ghost:
        "text-slate-400 hover:text-slate-100 hover:bg-slate-800/60 active:scale-[0.98]",
      danger:
        "bg-rose-600 text-white hover:bg-rose-500 border border-rose-500/50 active:scale-[0.98]",
    };

    const sizes = {
      sm: "px-3 py-1.5 text-xs gap-1.5",
      md: "px-4 py-2 text-sm gap-2",
      lg: "px-6 py-3 text-base gap-2.5",
    };

    return (
      <button
        ref={ref}
        type={type}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin text-current" />
        ) : (
          leftIcon
        )}
        <span>{children}</span>
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = "Button";
