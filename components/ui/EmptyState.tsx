import React from "react";
import { Cpu } from "lucide-react";
import { Button } from "./Button";
import { cn } from "@/lib/utils";

export function EmptyState({
  title = "No Data Found",
  description = "There are currently no items matching your request.",
  actionLabel,
  onAction,
  icon: Icon = Cpu,
  className,
}: {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ElementType;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-primary/20 bg-card/40 my-6",
        className
      )}
    >
      <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-primary mb-4 shadow-glow">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-bold text-white mb-1">{title}</h3>
      <p className="text-sm text-secondary-foreground max-w-sm mb-6">{description}</p>
      {actionLabel && onAction && (
        <Button variant="outline" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
