"use client";

import { usePathname } from "next/navigation";
import { Globe } from "lucide-react";

type TLocale = "es" | "en";

export interface IRoomSlugs {
  id: number | string;
  slug: Partial<Record<TLocale, string | null>>;
}

interface ILanguageSwitcherProps {
  roomSlugs: IRoomSlugs[];
}

export function LanguageSwitcher({
  roomSlugs,
}: ILanguageSwitcherProps) {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const currentLocale = segments[0];

  if (currentLocale !== "es" && currentLocale !== "en") {
    return null;
  }

  const targetLocale: TLocale =
    currentLocale === "es" ? "en" : "es";

  const targetSegments = [...segments];
  targetSegments[0] = targetLocale;

  let targetHref = `/${targetSegments.join("/")}`;

  const isRoomDetail =
    segments[1] === "room" && segments.length === 3;

  if (isRoomDetail) {
    const currentSlug = decodeURIComponent(segments[2]);

    const currentRoom = roomSlugs.find(
      (room) => room.slug[currentLocale] === currentSlug,
    );

    const targetSlug = currentRoom?.slug[targetLocale];

    targetHref = targetSlug
      ? `/${targetLocale}/room/${encodeURIComponent(targetSlug)}`
      : `/${targetLocale}`;
  }

  return (
    <a
      href={targetHref}
      hrefLang={targetLocale}
      lang={targetLocale}
      className="flex items-center gap-1 px-2 py-1.5 rounded-full bg-muted/50 hover:bg-muted transition-colors border border-border"
      aria-label={
        targetLocale === "en"
          ? "Switch to English"
          : "Cambiar a español"
      }
    >
      <Globe
        aria-hidden="true"
        className="w-4 h-4 text-foreground opacity-70"
      />

      <span className="text-sm font-semibold text-foreground leading-none mb-px">
        {targetLocale}
      </span>
    </a>
  );
}