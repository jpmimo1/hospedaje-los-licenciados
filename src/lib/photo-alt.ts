import type { Media, Room } from "@/payload-types";

// Informative photographs only; decorative images should keep alt="".
export function photoAlt(
  media: Pick<Media, "alt"> | null | undefined,
  locale: Locales,
  subject: string,
  photoNumber?: number,
) {
  const alt = media?.alt?.trim();
  if (alt) return alt;

  if (photoNumber !== undefined) {
    return `${subject} - ${locale === "es" ? "Foto" : "Photo"} ${photoNumber}`;
  }
  return locale === "es" ? `Foto de ${subject}` : `Photo of ${subject}`;
}

export function withLocalizedMediaAlt(
  media: Media,
  alts: ReadonlyMap<Media["id"], string>,
): Media {
  return { ...media, alt: alts.get(media.id) ?? "" };
}

export function withLocalizedRoomCardAlt(
  room: Room,
  alts: ReadonlyMap<Media["id"], string>,
): Room {
  const [first, ...rest] = room.gallery ?? [];
  if (!first || typeof first.image !== "object") return room;

  return {
    ...room,
    gallery: [{ ...first, image: withLocalizedMediaAlt(first.image, alts) }, ...rest],
  };
}
