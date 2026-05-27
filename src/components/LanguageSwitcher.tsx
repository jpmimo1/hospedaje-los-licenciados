"use client";

import { usePathname } from "next/navigation";
import { Globe } from "lucide-react";

export function LanguageSwitcher() {
  const pathname = usePathname(); // Ej: detecta "/es/habitaciones"

  // Extraemos el idioma actual de la URL (siempre es el primer bloque)
  const currentLocale = pathname.split("/")[1];

  // Si no hay idioma válido en la ruta (por si acaso), evitamos renderizar el botón aún
  if (currentLocale !== "es" && currentLocale !== "en") return null;

  // Definimos cuál es el idioma al que vamos a cambiar
  const targetLocale = currentLocale === "es" ? "en" : "es";

  const toggleLanguage = () => {
    // Reemplazamos exactamente el idioma en la URL actual y navegamos
    // Ej: "/es/habitaciones" -> "/en/habitaciones"
    const newPath = pathname.replace(`/${currentLocale}`, `/${targetLocale}`);
    window.location.href = newPath;
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-1 px-2 py-1.5 rounded-full bg-muted/50 hover:bg-muted transition-colors border border-border"
      aria-label="Cambiar idioma"
    >
      <Globe className="w-4 h-4 text-foreground opacity-70" />
      <span className="text-sm font-semibold text-foreground leading-none mb-px">
        {currentLocale}
      </span>
    </button>
  );
}
