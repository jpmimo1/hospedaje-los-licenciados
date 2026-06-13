"use client";

import { usePathname } from "next/navigation";
import { Globe } from "lucide-react";

export function LanguageSwitcher() {
  const pathname = usePathname();

  const currentLocale = pathname.split("/")[1];

  // If no valid locale is present in the route structure, prevent rendering to avoid broken paths
  if (currentLocale !== "es" && currentLocale !== "en") return null;

  const targetLocale = currentLocale === "es" ? "en" : "es";

  const toggleLanguage = () => {
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
