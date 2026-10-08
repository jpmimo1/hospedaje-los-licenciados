import type { Metadata } from "next";
import type { Room } from "@/payload-types";
import { bathroomTypes } from "@/data/bathroomTypes";

type RoomMetadataSource = Pick<
  Room,
  "name" | "shortDescription" | "capacity" | "bathroomType"
>;

export function buildRoomMetadata(
  room: RoomMetadataSource,
  locale: Locales,
): Metadata {
  const name = room.name.trim();
  const shortDescription = room.shortDescription?.trim();
  const bathroom = bathroomTypes[room.bathroomType]?.labels[locale].toLowerCase();
  const hasCapacity =
    room.capacity != null && Number.isInteger(room.capacity) && room.capacity > 0;
  const details: string[] = [];

  if (hasCapacity) {
    const guests = locale === "es"
      ? room.capacity === 1 ? "huésped" : "huéspedes"
      : room.capacity === 1 ? "guest" : "guests";
    details.push(locale === "es"
      ? `para hasta ${room.capacity} ${guests}`
      : `for up to ${room.capacity} ${guests}`);
  }

  if (bathroom) {
    details.push(locale === "es" ? `con ${bathroom}` : `with a ${bathroom}`);
  }

  const location = locale === "es"
    ? `${name} en Los Licenciados, San Sebastián, Cusco`
    : `${name} at Los Licenciados in San Sebastián, Cusco`;
  const description = shortDescription || `${[location, ...details].join(", ")}.`;

  return { title: `${name} | Los Licenciados`, description };
}
