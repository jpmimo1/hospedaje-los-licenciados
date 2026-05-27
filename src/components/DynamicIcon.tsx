import dynamic from "next/dynamic";
import { LucideProps, CheckCircle2 } from "lucide-react";
import dynamicIconImports from "lucide-react/dynamicIconImports";

interface DynamicIconProps extends LucideProps {
  name?: string;
}

export function DynamicIcon({ name, ...props }: DynamicIconProps) {
  // 1. Normalizamos el texto (por si en Payload lo escribes con mayúsculas o espacios)
  // Nota: Lucide usa formato kebab-case (ej: 'wifi', 'coffee', 'air-vent')
  const normalizedName = name?.toLowerCase().trim();

  // 2. Verificamos si el nombre existe en el catálogo de Lucide
  const isIconValid = normalizedName && normalizedName in dynamicIconImports;

  // 3. Si no existe o viene vacío, retornamos el Fallback
  if (!isIconValid) {
    return <CheckCircle2 {...props} />;
  }

  // 4. Importamos el ícono mágicamente sin inflar el peso de la app
  const IconComponent = dynamic(
    dynamicIconImports[normalizedName as keyof typeof dynamicIconImports],
  );

  // eslint-disable-next-line react-hooks/static-components
  return <IconComponent {...props} />;
}
