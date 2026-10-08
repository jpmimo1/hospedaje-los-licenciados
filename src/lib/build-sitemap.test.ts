import assert from "node:assert/strict";
import test from "node:test";
import { buildSitemap } from "./build-sitemap";

const origin = "https://example.com";
const updatedAt = "2026-09-20T12:30:00.000Z";

test("includes the ten public pages with reciprocal language alternatives and no invented dates", () => {
  const entries = buildSitemap(origin, { es: [], en: [] });
  const paths = ["", "/rooms", "/about", "/contact", "/policies"];
  assert.equal(entries.length, 10);
  for (const path of paths) {
    const languages = { es: `${origin}/es${path}`, en: `${origin}/en${path}` };
    for (const url of Object.values(languages)) {
      const entry = entries.find((item) => item.url === url);
      assert.deepEqual(entry?.alternates?.languages, languages);
      assert.equal(entry?.lastModified, undefined);
    }
  }
});

test("pairs localized slugs by ID rather than position or a matching slug", () => {
  const entries = buildSitemap(origin, {
    es: [{ name: "Localized room", id: 1, slug: "doble", updatedAt }, { name: "Localized room", id: 2, slug: "simple", updatedAt }],
    en: [{ name: "Localized room", id: 2, slug: "single", updatedAt }, { name: "Localized room", id: 1, slug: "two-bed", updatedAt }],
  });
  const languages = { es: `${origin}/es/room/doble`, en: `${origin}/en/room/two-bed` };
  for (const url of Object.values(languages)) {
    assert.deepEqual(entries.find((item) => item.url === url)?.alternates?.languages, languages);
  }
  assert.equal(entries.length, 14);
  assert.equal((entries[10].lastModified as Date).toISOString(), updatedAt);
});

test("keeps a room with one translation without inventing a counterpart or timestamp", () => {
  const entries = buildSitemap(origin, {
    es: [{ name: "Localized room", id: 1, slug: "solo-es", updatedAt: "invalid" }],
    en: [{ name: "Localized room", id: 1, slug: "" }, { name: "Localized room", id: 2, slug: "only-en" }],
  });
  assert.equal(entries.length, 12);
  assert.deepEqual(entries[10].alternates?.languages, { es: `${origin}/es/room/solo-es` });
  assert.deepEqual(entries[11].alternates?.languages, { en: `${origin}/en/room/only-en` });
  assert.equal(entries[10].lastModified, undefined);
  assert.equal(entries[11].lastModified, undefined);
});

test("excludes unsafe slugs and duplicate IDs or URLs, and encodes real unicode slugs", () => {
  const invalid = ["", " ", ".", "..", "a/b", "a\\b", "a?gallery=true", "a#photo", "a%2Fb", "a b"];
  const entries = buildSitemap(origin, {
    es: [
      ...invalid.map((slug, id) => ({ name: "Localized room", id, slug })),
      { name: "Localized room", id: 20, slug: "habitación-familiar" },
      { name: "Localized room", id: 20, slug: "another-slug" },
      { name: "Localized room", id: 21, slug: "habitación-familiar" },
    ],
    en: [{ name: "Localized room", id: 20, slug: "family-room" }, { name: "Localized room", id: 21, slug: "other-room" }],
  });
  assert.equal(entries.length, 13);
  assert.equal(new Set(entries.map(({ url }) => url)).size, entries.length);
  const entry = entries.find(({ url }) => url.endsWith("habitaci%C3%B3n-familiar"));
  assert.equal(entry?.alternates?.languages?.en, `${origin}/en/room/family-room`);
  assert.deepEqual(entries.find(({ url }) => url.endsWith("other-room"))?.alternates?.languages, {
    en: `${origin}/en/room/other-room`,
  });
  for (const item of entries) {
    const url = new URL(item.url);
    assert.equal(url.origin, origin);
    assert.equal(url.search, "");
    assert.equal(url.hash, "");
    assert.equal(item.priority, undefined);
    assert.equal(item.changeFrequency, undefined);
  }
});
