import type { MetadataRoute } from "next";
import { getPayload } from "payload";
import configPromise from "@payload-config";
import { buildSitemap, sitemapLocales } from "@/lib/build-sitemap";
import { SITE_URL } from "@/lib/site-url";

// This project does not enable Cache Components. Generate fresh CMS URLs on
// every request instead of caching the metadata route at build time.
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayload({ config: configPromise });
  const versions = payload.collections.rooms.config.versions;
  const hasDrafts = Boolean(versions && versions.drafts);

  const [es, en] = await Promise.all(
    sitemapLocales.map((locale) =>
      payload.find({
        collection: "rooms",
        locale,
        fallbackLocale: false,
        overrideAccess: false,
        pagination: false,
        depth: 0,
        draft: false,
        // Rooms currently has no drafts. If enabled, exclude unpublished
        // records without querying a nonexistent _status field today.
        where: hasDrafts ? { _status: { equals: "published" } } : undefined,
        select: { slug: true, updatedAt: true },
        sort: "id",
      }),
    ),
  );

  return buildSitemap(SITE_URL, { es: es.docs, en: en.docs });
}
