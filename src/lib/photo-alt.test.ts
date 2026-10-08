import assert from "node:assert/strict";
import test from "node:test";
import type { Media, Room } from "@/payload-types";
import { photoAlt, withLocalizedMediaAlt, withLocalizedRoomCardAlt } from "./photo-alt";

const image = {
  id: 1, alt: "Alt inherited from another locale", url: "/photo.jpg",
  width: 1200, height: 800, focalX: 0, focalY: 40,
  createdAt: "2026-10-08T00:00:00Z", updatedAt: "2026-10-08T00:00:00Z",
} satisfies Media;
const room = {
  id: 1, name: "Habitación familiar", slug: "familiar", price: 80,
  roomSize: 20, bathroomType: "private", bedConfiguration: "1-double",
  gallery: [{ image }, { image: { ...image, id: 2 } }],
  createdAt: image.createdAt, updatedAt: image.updatedAt,
} satisfies Room;

test("uses the supplied localized Media alt and trims blank surroundings", () => {
  assert.equal(photoAlt({ alt: "  Habitación con dos camas.  " }, "es", room.name), "Habitación con dos camas.");
  assert.equal(photoAlt({ alt: "Room with two beds." }, "en", "Family Room", 1), "Room with two beds.");
});

test("missing or blank informative alts use the subject in the requested language without invented details", () => {
  for (const media of [null, undefined, { alt: "" }, { alt: "  " }]) {
    assert.equal(photoAlt(media, "es", room.name), "Foto de Habitación familiar");
    assert.equal(photoAlt(media, "en", "Family Room"), "Photo of Family Room");
    assert.equal(photoAlt(media, "es", room.name, 2), "Habitación familiar - Foto 2");
    assert.equal(photoAlt(media, "en", "Family Room", 2), "Family Room - Photo 2");
  }
});

test("missing locale values replace inherited alts without modifying the original media or image properties", () => {
  const localized = withLocalizedMediaAlt(image, new Map());
  assert.equal(localized.alt, "");
  assert.equal(photoAlt(localized, "en", "Family Room"), "Photo of Family Room");
  assert.equal(image.alt, "Alt inherited from another locale");
  assert.deepEqual({ ...localized, alt: image.alt }, image);
  assert.equal(localized.focalX, 0);
});

test("card covers reuse the exact locale alt while leaving the original room and other photographs intact", () => {
  const localized = withLocalizedRoomCardAlt(room, new Map([[1, "Foto localizada"]]));
  assert.equal((localized.gallery?.[0].image as Media).alt, "Foto localizada");
  assert.equal((room.gallery[0].image as Media).alt, image.alt);
  assert.equal(localized.gallery?.[1], room.gallery[1]);
  assert.equal(localized.name, room.name);
  assert.equal(localized.slug, room.slug);
  const missing = withLocalizedRoomCardAlt(room, new Map());
  assert.equal((missing.gallery?.[0].image as Media).alt, "");
});

test("rooms with no cover or an unpopulated media relationship do not fail", () => {
  const empty = { ...room, gallery: [] };
  const unpopulated = { ...room, gallery: [{ image: 1 }] };
  assert.equal(withLocalizedRoomCardAlt(empty, new Map()), empty);
  assert.equal(withLocalizedRoomCardAlt(unpopulated, new Map()), unpopulated);
});
