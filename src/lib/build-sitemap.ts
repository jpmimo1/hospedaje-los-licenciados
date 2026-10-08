import type { MetadataRoute } from "next";
import {
  pageAlternates,
  publicPagePaths,
  roomLanguages,
  roomVersionsById,
  seoLocales,
  type RoomTranslations,
} from "./seo-urls";

export { seoLocales as sitemapLocales } from "./seo-urls";

export function buildSitemap(
  siteUrl: string,
  rooms: RoomTranslations,
): MetadataRoute.Sitemap {
  // These pages combine CMS and interface content; there is no single reliable
  // timestamp for all changes, so omit lastModified rather than invent a date.
  const entries: MetadataRoute.Sitemap = publicPagePaths.flatMap((path) =>
    seoLocales.map((locale) => {
      const { canonical, languages } = pageAlternates(siteUrl, locale, path);
      return { url: canonical, alternates: { languages } };
    }),
  );

  for (const versions of roomVersionsById(siteUrl, rooms).values()) {
    const languages = roomLanguages(versions);
    for (const locale of seoLocales) {
      const version = versions[locale];
      if (version) entries.push({ ...version, alternates: { languages } });
    }
  }

  return entries;
}
