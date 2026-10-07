import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { presentationSpacing } from "@/lib/presentation-spacing";

type SectionHeadingProps = {
  title: ReactNode;
  description?: string;
  align?: "center" | "left";
};

export function SectionHeading({
  title,
  description,
  align = "center",
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        presentationSpacing.sectionHeading,
        align === "center" ? "text-center" : "text-left",
      )}
    >
      <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground leading-tight">
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "text-muted-foreground leading-relaxed max-w-4xl mt-4",
            align === "center" && "mx-auto",
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
