"use client";

import { CalendarCheck, ArrowRight } from "lucide-react";
import { LocalLink } from "./LocaleLink";
import { useEffect } from "react";
import { cn } from "@/lib/utils";

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
    room: { label: "Precio", unit: "Por habitación y noche", btn: "Consultar disponibilidad" },
    general: {
      label: "Los Licenciados",
      value: "Tu refugio",
      unit: "en Cusco",
      btn: "Reserva Directa",
    },
  },
  en: {
    home: { label: "From", unit: "/ night", btn: "View Rooms" },
    room: { label: "Price", unit: "Per room, per night", btn: "Check availability" },
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
  const isRoom = variant === "room";

  const handleScroll = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const targetId = href.replace("#", "");
    const elem = document.getElementById(targetId);
    if (elem) elem.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    // Inject identification class into body to allow global layout adjustment
    document.body.classList.add("has-mobile-bar");
    if (isRoom) document.body.classList.add("has-mobile-room-bar");

    // Clean up the body class when transitioning to a view without the bar
    return () => {
      document.body.classList.remove("has-mobile-bar");
      if (isRoom) document.body.classList.remove("has-mobile-room-bar");
    };
  }, [isRoom]);

  return (
    <div className={cn(
      "fixed bottom-0 left-0 w-full bg-card/95 backdrop-blur-md border-t border-border shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.1)] z-40 animate-in fade-in slide-in-from-bottom-5 duration-300",
      isRoom
        ? "px-4 py-3 min-h-19 grid grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] gap-3 items-center lg:hidden"
        : "px-5 h-19 flex items-center justify-between md:hidden",
    )}>
      <div className="flex flex-col min-w-0">
        <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mb-0.5">
          {t.label}
        </span>
        <div className={isRoom ? "flex flex-col gap-1" : "flex items-baseline gap-1"}>
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
            className={cn(
              "bg-primary-500 hover:bg-primary-600 text-primary-foreground py-3 rounded-xl font-medium text-sm flex items-center gap-2 shadow-md shadow-primary/10 transition-all active:scale-95",
              isRoom ? "w-full px-3 justify-center text-center" : "px-5",
            )}
          >
            <CalendarCheck className="w-4 h-4 shrink-0" />
            <span className={isRoom ? "min-w-0 break-words" : undefined}>{t.btn}</span>
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
