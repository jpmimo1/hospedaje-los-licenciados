import "server-only";
import { cache } from "react";
import { getPayload, type Where } from "payload";
import configPromise from "@payload-config";
import type { Room } from "@/payload-types";
import { seoLocales } from "@/lib/seo-urls";

// Omit the ID for the sitemap, or use the current room's ID for its metadata.
// React cache only deduplicates calls within the current render request.
export const getPublicRoomTranslations = cache(async (id?: Room["id"]) => {
  const payload = await getPayload({ config: configPromise });
  const versions = payload.collections.rooms.config.versions;
  const filters: Where[] = [];

  if (id !== undefined) filters.push({ id: { equals: id } });
  // Rooms currently has no drafts; do not query a nonexistent field.
  if (versions && versions.drafts) filters.push({ _status: { equals: "published" } });

  const [es, en] = await Promise.all(
    seoLocales.map((locale) =>
      payload.find({
        collection: "rooms",
        locale,
        fallbackLocale: false,
        overrideAccess: false,
        pagination: false,
        depth: 0,
        draft: false,
        where: filters.length ? { and: filters } : undefined,
        select: { name: true, slug: true, updatedAt: true },
        sort: "id",
      }),
    ),
  );

  return { es: es.docs, en: en.docs };
});
