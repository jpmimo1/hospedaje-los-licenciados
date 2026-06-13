"use client";

import { CalendarCheck, ArrowRight } from "lucide-react";
import { LocalLink } from "./LocaleLink";
import { useEffect } from "react";

type Translation = {
  label: string;
  unit: string;
  btn: string;
  value?: string;
};

// Encapsulated dictionary within the component file to keep mobile UI strings self-contained
const dictionary: Record<
  Locales,
  Record<"home" | "room" | "general", Translation>
> = {
  es: {
    home: { label: "Desde", unit: "/ noche", btn: "Ver Habitaciones" },
    room: { label: "Precio", unit: "/ noche", btn: "Reservar" },
    general: {
      label: "Los Licenciados",
      value: "Tu refugio",
      unit: "en Cusco",
      btn: "Reserva Directa",
    },
  },
  en: {
    home: { label: "From", unit: "/ night", btn: "View Rooms" },
    room: { label: "Price", unit: "/ night", btn: "Book Now" },
    general: {
      label: "Los Licenciados",
      value: "Your refuge",
      unit: "in Cusco",
      btn: "Book Direct",
    },
  },
};

interface MobileBottomBarProps {
  locale: Locales;
  variant: "home" | "room" | "general";
  href: string;
  dynamicPrice?: string;
}

export function MobileBottomBar({
  locale,
  variant,
  href,
  dynamicPrice,
}: MobileBottomBarProps) {
  const t = dictionary[locale][variant] || dictionary.es[variant];
  const displayValue = variant === "general" ? t.value : dynamicPrice;
  const isAnchor = href.startsWith("#");

  const handleScroll = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const targetId = href.replace("#", "");
    const elem = document.getElementById(targetId);
    if (elem) elem.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    // Inject identification class into body to allow global layout adjustment
    document.body.classList.add("has-mobile-bar");

    // Clean up the body class when transitioning to a view without the bar
    return () => {
      document.body.classList.remove("has-mobile-bar");
    };
  }, []);

  return (
    <div className="fixed bottom-0 left-0 w-full bg-card/95 backdrop-blur-md border-t border-border px-5 h-19 flex items-center justify-between shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.1)] z-40 md:hidden animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className="flex flex-col">
        <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mb-0.5">
          {t.label}
        </span>
        <div className="flex items-baseline gap-1">
          <span className="text-xl font-bold text-foreground">
            {displayValue}
          </span>
          <span className="text-xs text-muted-foreground font-medium">
            {t.unit}
          </span>
        </div>
      </div>

      <div className="w-auto">
        {isAnchor ? (
          <button
            onClick={handleScroll}
            className="bg-primary-500 hover:bg-primary-600 text-primary-foreground px-5 py-3 rounded-xl font-medium text-sm flex items-center gap-2 shadow-md shadow-primary/10 transition-all active:scale-95 cursor-pointer"
          >
            {t.btn}
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : href.startsWith("http") ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-primary-500 hover:bg-primary-600 text-primary-foreground px-5 py-3 rounded-xl font-medium text-sm flex items-center gap-2 shadow-md shadow-primary/10 transition-all active:scale-95"
          >
            <CalendarCheck className="w-4 h-4" />
            {t.btn}
          </a>
        ) : (
          <LocalLink
            href={href}
            className="bg-primary-500 hover:bg-primary-600 text-primary-foreground px-5 py-3 rounded-xl font-medium text-sm flex items-center gap-2 shadow-md shadow-primary/10 transition-all active:scale-95"
          >
            {t.btn}
            <ArrowRight className="w-4 h-4" />
          </LocalLink>
        )}
      </div>
    </div>
  );
}
