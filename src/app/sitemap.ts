import type { MetadataRoute } from "next";
import { buildSitemap } from "@/lib/build-sitemap";
import { getPublicRoomTranslations } from "@/lib/get-public-room-translations";
import { SITE_URL } from "@/lib/site-url";

// This project does not enable Cache Components. Generate fresh CMS URLs on
// every request instead of caching the metadata route at build time.
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return buildSitemap(SITE_URL, await getPublicRoomTranslations());
}
