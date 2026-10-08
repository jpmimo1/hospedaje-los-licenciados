import type { MetadataRoute } from "next";
import type { Room } from "@/payload-types";

export const sitemapLocales = ["es", "en"] as const;
type SitemapLocale = (typeof sitemapLocales)[number];
type SitemapRoom = Pick<Room, "id" | "slug"> & {
  updatedAt?: string | null;
};
type RoomVersion = { url: string; lastModified?: Date };

const pagePaths = ["", "/rooms", "/about", "/contact", "/policies"] as const;

export function buildSitemap(
  siteUrl: string,
  rooms: Record<SitemapLocale, readonly SitemapRoom[]>,
): MetadataRoute.Sitemap {
  // These pages combine CMS and interface content; there is no single reliable
  // timestamp for all changes, so omit lastModified rather than invent a date.
  const entries: MetadataRoute.Sitemap = pagePaths.flatMap((path) => {
    const languages = {
      es: `${siteUrl}/es${path}`,
      en: `${siteUrl}/en${path}`,
    };

    return sitemapLocales.map((locale) => ({
      url: languages[locale],
      alternates: { languages },
    }));
  });

  const roomsById = new Map<Room["id"], Partial<Record<SitemapLocale, RoomVersion>>>();
  const seenUrls = new Set(entries.map(({ url }) => url));

  for (const locale of sitemapLocales) {
    for (const room of rooms[locale]) {
      // A slug must be one real path segment, with no query, hash or encoding
      // that could point to a different route. Do not repair CMS values here.
      if (typeof room.slug !== "string" || !/^(?!\.{1,2}$)[^\s/\\?#%]+$/u.test(room.slug)) {
        continue;
      }

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

  for (const versions of roomsById.values()) {
    const languages: Partial<Record<SitemapLocale, string>> = {};
    for (const locale of sitemapLocales) {
      if (versions[locale]) languages[locale] = versions[locale].url;
    }

    for (const locale of sitemapLocales) {
      const version = versions[locale];
      if (version) entries.push({ ...version, alternates: { languages } });
    }
  }

  return entries;
}
