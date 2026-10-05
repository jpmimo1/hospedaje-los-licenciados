"use client"

import { type LucideProps, CheckCircle2 } from "lucide-react";
import {
  DynamicIcon as LucideDynamicIcon,
  iconNames
} from "lucide-react/dynamic";
import type { ComponentProps } from "react"

type TIconName = ComponentProps<typeof LucideDynamicIcon>["name"];

interface IDynamicIconProps extends LucideProps {
  name?: string | undefined;
}

const validIconNames = new Set<string>(iconNames);

function isIconName(name: string): name is TIconName {
  return validIconNames.has(name);
}

export function DynamicIcon({
  name,
  ...props
}: IDynamicIconProps) {
  const normalizedName = name?.trim().toLowerCase() ?? "";
  const resolvedName = normalizedName;

  if (!isIconName(resolvedName)) {
    return <CheckCircle2 {...props} />;
  }

  return (
    <LucideDynamicIcon
      key={resolvedName}
      name={resolvedName}
      {...props}
    />
  );
}