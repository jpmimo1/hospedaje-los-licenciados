import dynamic from "next/dynamic";
import { LucideProps, CheckCircle2 } from "lucide-react";
import dynamicIconImports from "lucide-react/dynamicIconImports";

interface DynamicIconProps extends LucideProps {
  name?: string;
}

export function DynamicIcon({ name, ...props }: DynamicIconProps) {
  // Note: Lucide React catalog expects kebab-case strings (e.g., 'wifi', 'coffee', 'air-vent')
  const normalizedName = name?.toLowerCase().trim();

  const isIconValid = normalizedName && normalizedName in dynamicIconImports;

  if (!isIconValid) {
    return <CheckCircle2 {...props} />;
  }

  const IconComponent = dynamic(
    dynamicIconImports[normalizedName as keyof typeof dynamicIconImports],
  );

  // eslint-disable-next-line react-hooks/static-components
  return <IconComponent {...props} />;
}
