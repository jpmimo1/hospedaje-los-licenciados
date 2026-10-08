import "server-only";
import type { Payload } from "payload";
import type { Media } from "@/payload-types";

// Read alt independently so disabling media fallback does not change the
// existing fallback behavior of commercial copy or other CMS fields.
export async function getLocalizedMediaAlts(
  payload: Payload,
  locale: Locales,
  images: readonly (number | Media | null | undefined)[],
) {
  const ids = [...new Set(images.flatMap((image) => {
    if (image == null) return [];
    return [typeof image === "object" ? image.id : image];
  }))];

  if (!ids.length) return new Map<Media["id"], string>();

  const { docs } = await payload.find({
    collection: "media",
    locale,
    fallbackLocale: false,
    overrideAccess: false,
    pagination: false,
    depth: 0,
    where: { id: { in: ids } },
    select: { alt: true },
  });

  return new Map(docs.map((media) => [media.id, media.alt?.trim() || ""]));
}
