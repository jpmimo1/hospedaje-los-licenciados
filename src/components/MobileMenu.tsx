"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronRight, Sun, Moon } from "lucide-react";
import { LocalLink } from "./LocaleLink";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useTheme } from "next-themes";

export function MobileMenu({ t }: { t: Record<string, string> }) {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();

  const [prevPathname, setPrevPathname] = useState(pathname);

  // ✨ 2. EL PATRÓN MODERNO: En lugar de useEffect, verificamos durante el renderizado
  if (pathname !== prevPathname) {
    setPrevPathname(pathname); // Actualizamos el tracker
    setIsOpen(false); // Cerramos el menú
  }
  // 2. MAGIA UX: Bloquea el scroll de la página cuando el menú está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset"; // Limpieza de seguridad
    };
  }, [isOpen]);

  const closeMenu = () => setIsOpen(false);

  return (
    <div className="flex md:hidden items-center gap-2 sm:gap-4">
      <LanguageSwitcher />

      {/* Botón Hamburguesa (z-50 relativo para que quede por encima del overlay) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-foreground hover:text-primary transition-colors focus:outline-none relative z-50"
        aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* OVERLAY (Fondo oscuro para cerrar al hacer clic fuera) */}
      {/* top-[75px] asume que tu header mide exactamente eso (h-18.75). Si no, usa top-full */}
      {isOpen && (
        <div
          className="fixed inset-0 top-18.75 bg-black/60 backdrop-blur-sm z-40 animate-in fade-in duration-300"
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}

      {/* PANEL DESPLEGABLE */}
      <div
        className={`absolute top-full left-0 w-full bg-card border-b border-border shadow-xl transition-all duration-300 origin-top flex flex-col z-50 ${
          isOpen
            ? "opacity-100 visible translate-y-0"
            : "opacity-0 invisible -translate-y-4 pointer-events-none"
        }`}
      >
        <nav className="flex flex-col px-6 py-8 gap-6 font-medium text-foreground">
          <LocalLink
            href="/"
            onClick={closeMenu}
            className="flex justify-between items-center hover:text-primary transition-colors text-lg"
          >
            {t.home}
            <ChevronRight className="w-4 h-4 text-muted-foreground opacity-50" />
          </LocalLink>
          <LocalLink
            href="/#rooms"
            onClick={closeMenu}
            className="flex justify-between items-center hover:text-primary transition-colors text-lg"
          >
            {t.rooms}
            <ChevronRight className="w-4 h-4 text-muted-foreground opacity-50" />
          </LocalLink>
          <LocalLink
            href="/about"
            onClick={closeMenu}
            className="flex justify-between items-center hover:text-primary transition-colors text-lg"
          >
            {t.about}
            <ChevronRight className="w-4 h-4 text-muted-foreground opacity-50" />
          </LocalLink>
          <LocalLink
            href="/contact"
            onClick={closeMenu}
            className="flex justify-between items-center hover:text-primary transition-colors text-lg"
          >
            {t.contact}
            <ChevronRight className="w-4 h-4 text-muted-foreground opacity-50" />
          </LocalLink>

          <div className="h-px w-full bg-border my-0.5"></div>

          {/* Selector de Apariencia */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="flex items-center justify-between w-full hover:text-primary transition-colors focus:outline-none group"
          >
            <span className="font-medium text-foreground text-lg transition-colors group-hover:text-primary">
              {t.theme}
            </span>

            {/* Reemplazamos el componente <ThemeToggle /> por un indicador visual simple */}
            <div className="rounded-lg group-hover:text-primary transition-colors">
              <Sun className="w-5 h-5 hidden dark:block" />
              <Moon className="w-5 h-5 block dark:hidden" />
            </div>
          </button>
        </nav>
      </div>
    </div>
  );
}
