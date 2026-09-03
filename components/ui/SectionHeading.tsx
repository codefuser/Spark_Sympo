import React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "./Badge";

export function SectionHeading({
  badge,
  title,
  description,
  align = "center",
  className,
}: {
  badge?: string;
  title: string;
  description?: string;
  align?: "left" | "center" | "right";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "space-y-3 mb-12",
        align === "center" && "text-center mx-auto max-w-3xl",
        align === "left" && "text-left",
        align === "right" && "text-right ml-auto max-w-3xl",
        className
      )}
    >
      {badge && (
        <Badge variant="primary" size="md">
          {badge}
        </Badge>
      )}
      <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white uppercase">
        {title.split(" ").map((word, i) =>
          i === title.split(" ").length - 1 ? (
            <span key={i} className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-cyan to-cyan-glow">
              {" " + word}
            </span>
          ) : (
            (i > 0 ? " " : "") + word
          )
        )}
      </h2>
      <div
        className={cn(
          "h-1 w-20 bg-gradient-to-r from-primary to-cyan rounded-full my-2",
          align === "center" && "mx-auto",
          align === "right" && "ml-auto"
        )}
      />
      {description && (
        <p className="text-secondary-foreground text-base leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}
