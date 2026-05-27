"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
// Importamos el componente Button de Shadcn
import { Button } from "@/components/ui/button";
import { useIsClient } from "@/hooks/useIsClient";


export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const isClient = useIsClient();

  if (!isClient) {
    // Retornamos un div del tamaño estándar de los botones de Shadcn para evitar saltos visuales (h-10 w-10)
    return <div className="w-10 h-10"></div>;
  }

  return (
    // USAMOS EL COMPONENTE BUTTON DE SHADCN
    <Button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      variant="ghost"
      size="icon-lg"
      className="rounded-full"
      aria-label="Alternar tema"
    >
      {theme === "dark" ? (
        <Sun className="h-[1.2rem] w-[1.2rem]" />
      ) : (
        <Moon className="h-[1.2rem] w-[1.2rem]" />
      )}
    </Button>
  );
}
