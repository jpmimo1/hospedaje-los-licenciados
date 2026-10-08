import assert from "node:assert/strict";
import test from "node:test";
import { buildSitemap } from "./build-sitemap";
import {
  pageAlternates,
  publicPagePaths,
  roomLanguages,
  roomVersionsById,
  seoLocales,
  type RoomTranslations,
} from "./seo-urls";

const origin = "https://example.com";

test("public pages use their own absolute canonical and the same language alternatives as the sitemap", () => {
  const sitemap = buildSitemap(origin, { es: [], en: [] });
  for (const path of publicPagePaths) {
    for (const locale of seoLocales) {
      const alternates = pageAlternates(origin, locale, path);
      assert.equal(alternates.canonical, `${origin}/${locale}${path}`);
      assert.equal(alternates.languages[locale], alternates.canonical);
      assert.deepEqual(alternates.languages, {
        es: `${origin}/es${path}`, en: `${origin}/en${path}`,
      });
      assert.deepEqual(sitemap.find(({ url }) => url === alternates.canonical)?.alternates?.languages,
        alternates.languages);
    }
  }
});

test("room alternatives share an ID, include self and are reciprocal despite reordered records", () => {
  const rooms: RoomTranslations = {
    es: [{ id: 1, name: "Doble", slug: "doble" }, { id: 2, name: "Simple", slug: "simple" }],
    en: [{ id: 2, name: "Single", slug: "single" }, { id: 1, name: "Two-Bed Room", slug: "two-bed" }],
  };
  const versions = roomVersionsById(origin, rooms).get(1)!;
  const languages = roomLanguages(versions);
  assert.deepEqual(languages, { es: `${origin}/es/room/doble`, en: `${origin}/en/room/two-bed` });
  for (const locale of seoLocales) {
    assert.equal(versions[locale]?.url, languages[locale]);
  }
  for (const entry of buildSitemap(origin, rooms).filter(({ url }) => Object.values(languages).includes(url))) {
    assert.deepEqual(entry.alternates?.languages, languages);
  }
});

test("missing slugs or localized names never become room alternatives or sitemap entries", () => {
  for (const incomplete of [
    { name: "English room", slug: null },
    { name: "English room", slug: "" },
    { name: null, slug: "english-room" },
    { name: " ", slug: "english-room" },
  ]) {
    const rooms: RoomTranslations = {
      es: [{ id: 1, name: "Habitación", slug: "habitacion" }],
      en: [{ id: 1, ...incomplete }],
    };
    assert.deepEqual(roomLanguages(roomVersionsById(origin, rooms).get(1)!), {
      es: `${origin}/es/room/habitacion`,
    });
    assert.equal(buildSitemap(origin, rooms).filter(({ url }) => url.includes("/room/")).length, 1);
  }
});

test("room URLs stay clean and encode a real slug rather than appending request queries or hashes", () => {
  const rooms: RoomTranslations = {
    es: [
      { id: 1, name: "Familiar", slug: "habitación-familiar" },
      { id: 2, name: "Invalid", slug: "room?showGallery=true" },
      { id: 3, name: "Invalid", slug: "room#photos" },
    ],
    en: [{ id: 1, name: "Family Room", slug: "family-room" }],
  };
  const versions = roomVersionsById(origin, rooms);
  assert.equal(versions.size, 1);
  const languages = roomLanguages(versions.get(1)!);
  assert.equal(languages.es, `${origin}/es/room/habitaci%C3%B3n-familiar`);
  for (const value of Object.values(languages)) {
    const url = new URL(value);
    assert.equal(url.origin, origin);
    assert.equal(url.search, "");
    assert.equal(url.hash, "");
  }
});
