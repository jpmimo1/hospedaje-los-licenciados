import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const widths = {
  wide: "container",
  content: "w-full max-w-6xl",
  narrow: "w-full max-w-4xl",
};

type ContainerProps = {
  children: ReactNode;
  width?: keyof typeof widths;
  className?: string;
};

export function Container({
  children,
  width = "wide",
  className,
}: ContainerProps) {
  return (
    <div className={cn("mx-auto px-4", widths[width], className)}>
      {children}
    </div>
  );
}
