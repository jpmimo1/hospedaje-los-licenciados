import type { Room } from "@/payload-types";

export const seoLocales = ["es", "en"] as const;
export type SeoLocale = (typeof seoLocales)[number];
export const publicPagePaths = ["", "/rooms", "/about", "/contact", "/policies"] as const;
type PublicPagePath = (typeof publicPagePaths)[number];

export type RoomTranslation = Pick<Room, "id"> & {
  name?: string | null;
  slug?: string | null;
  updatedAt?: string | null;
};
export type RoomTranslations = Record<SeoLocale, readonly RoomTranslation[]>;
type RoomVersion = { url: string; lastModified?: Date };
type RoomVersions = Partial<Record<SeoLocale, RoomVersion>>;

export function pageAlternates(siteUrl: string, locale: SeoLocale, path: PublicPagePath) {
  const languages = {
    es: `${siteUrl}/es${path}`,
    en: `${siteUrl}/en${path}`,
  };

  return { canonical: languages[locale], languages };
}

export function isValidRoomTranslation(
  room: Pick<RoomTranslation, "name" | "slug">,
): room is { name: string; slug: string } {
  return typeof room.name === "string" && room.name.trim().length > 0 &&
    typeof room.slug === "string" && /^(?!\.{1,2}$)[^\s/\\?#%]+$/u.test(room.slug);
}

export function roomVersionsById(siteUrl: string, rooms: RoomTranslations) {
  const roomsById = new Map<Room["id"], RoomVersions>();
  const seenUrls = new Set<string>();

  for (const locale of seoLocales) {
    for (const room of rooms[locale]) {
      // Match the detail page's requirements without repairing CMS values or
      // treating fallback content as a real translation.
      if (!isValidRoomTranslation(room)) continue;

      const url = `${siteUrl}/${locale}/room/${encodeURIComponent(room.slug)}`;
      const versions = roomsById.get(room.id) ?? {};
      if (versions[locale] || seenUrls.has(url)) continue;

      const updatedAt = room.updatedAt ? new Date(room.updatedAt) : undefined;
      versions[locale] = {
        url,
        ...(updatedAt && Number.isFinite(updatedAt.getTime())
          ? { lastModified: updatedAt }
          : {}),
      };
      roomsById.set(room.id, versions);
      seenUrls.add(url);
    }
  }

  return roomsById;
}

export function roomLanguages(versions: RoomVersions) {
  const languages: Partial<Record<SeoLocale, string>> = {};
  for (const locale of seoLocales) {
    if (versions[locale]) languages[locale] = versions[locale].url;
  }
  return languages;
}
