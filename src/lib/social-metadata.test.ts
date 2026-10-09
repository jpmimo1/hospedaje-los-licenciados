import assert from "node:assert/strict";
import test from "node:test";
import { resolveOpenGraph, resolveTwitter } from "next/dist/lib/metadata/resolvers/resolve-opengraph";
import type { Media } from "@/payload-types";
import { buildSocialMetadata, roomShareImage, shareImage } from "./social-metadata";
import { pageAlternates, publicPagePaths, roomLanguages, roomVersionsById, seoLocales } from "./seo-urls";
import { buildRoomMetadata } from "./room-metadata";

const siteUrl = "https://example.com";
const media = (url?: string | null, props: Partial<Media> = {}): Media => ({
  id: 1, alt: "Foto del CMS", createdAt: "2026-10-08", updatedAt: "2026-10-08",
  url, mimeType: "image/jpeg", width: 1600, height: 1200, ...props,
});

test("share images use absolute HTTP(S) original URLs, localized alt and actual dimensions", () => {
  assert.deepEqual(shareImage(media("/api/media/file/hero.jpg?prefix=h-media", {
    alt: " Photo from CMS ", thumbnailURL: "/thumbnail.jpg",
  }), siteUrl), {
    url: `${siteUrl}/api/media/file/hero.jpg?prefix=h-media`, alt: "Photo from CMS", width: 1600, height: 1200, type: "image/jpeg",
  });
  for (const [source, expected] of [
    ["https://cdn.example.com/hero.jpg", "https://cdn.example.com/hero.jpg"],
    ["//cdn.example.com/hero.jpg", "https://cdn.example.com/hero.jpg"],
    [" /hero.jpg ", `${siteUrl}/hero.jpg`],
  ]) assert.equal(shareImage(media(source), siteUrl)?.url, expected);
});

test("empty, unpopulated, invalid URLs and known non-image media are omitted", () => {
  for (const photo of [undefined, null, 4, media(), media(""), media(" "), media("not-a-url"),
    media("javascript:alert(1)"), media("data:image/png;base64,AAA"), media("ftp://example.com/photo.jpg"),
    media("https://"), media("https://bad host/photo.jpg"), media("?photo=1"), media("#photo"),
    media("https://user:password@example.com/photo.jpg"), media("/document.pdf", { mimeType: "application/pdf" })]) {
    assert.equal(shareImage(photo, siteUrl), undefined);
  }
});

test("missing alt or dimensions stay omitted instead of inventing values", () => {
  for (const value of [undefined, null, 0, -1, NaN, Infinity, 1.5]) {
    assert.deepEqual(shareImage(media("/hero.jpg", { alt: " ", width: value, height: value }), siteUrl), {
      url: `${siteUrl}/hero.jpg`, type: "image/jpeg",
    });
  }
  assert.deepEqual(shareImage(media("/hero.jpg", { width: 800, height: null }), siteUrl), {
    url: `${siteUrl}/hero.jpg`, alt: "Foto del CMS", width: 800, type: "image/jpeg",
  });
});

test("a valid social variant uses its own URL, dimensions and MIME while retaining the localized alt", () => {
  const source = media("/original.png", {
    mimeType: "image/png", width: 2400, height: 1800,
    sizes: { social: { url: "/social.jpg", width: 1200, height: 900, mimeType: "image/jpeg" } },
  });
  const original = structuredClone(source);
  assert.deepEqual(shareImage(source, siteUrl), {
    url: `${siteUrl}/social.jpg`, alt: "Foto del CMS", width: 1200, height: 900, type: "image/jpeg",
  });
  assert.deepEqual(source, original);
  assert.equal(shareImage({ ...source, url: null }, siteUrl)?.url, `${siteUrl}/social.jpg`);
  assert.equal(shareImage({ ...source, sizes: { social: {
    ...source.sizes?.social, url: "https://cdn.example.com/social.jpg",
  } } }, siteUrl)?.url, "https://cdn.example.com/social.jpg");
});

test("missing or invalid social URLs retain the original file and its metadata", () => {
  const source = media("/original.png", { mimeType: "image/png", width: 2400, height: 1800 });
  const expected = shareImage(source, siteUrl);
  for (const url of [undefined, null, "", " ", "not-a-url", "javascript:alert(1)", "https://", "https://bad host/social.jpg",
    "https://user:password@example.com/social.jpg", "data:image/jpeg;base64,AAA", "?image=social", "#social"]) {
    assert.deepEqual(shareImage({ ...source, sizes: { social: {
      url, width: 1200, height: 900, mimeType: "image/jpeg",
    } } }, siteUrl), expected);
  }
  assert.deepEqual(shareImage({ ...source, sizes: { social: {
    url: "/document.pdf", mimeType: "application/pdf",
  } } }, siteUrl), expected);
});

test("incomplete social dimensions or MIME never inherit original file metadata", () => {
  const source = media("/original.png", { mimeType: "image/png", width: 2400, height: 1800 });
  for (const missing of [{}, { width: null, height: null, mimeType: null }, { width: 0, height: -1, mimeType: "" }]) {
    assert.deepEqual(shareImage({ ...source, sizes: { social: { url: "/social.jpg", ...missing } } }, siteUrl), {
      url: `${siteUrl}/social.jpg`, alt: "Foto del CMS",
    });
  }
});

test("Open Graph and Twitter resolve the chosen file metadata in ES/EN with and without a social variant", async () => {
  const context = { trailingSlash: false, isStaticMetadataRouteFile: false };
  for (const locale of seoLocales) {
    for (const hasSocial of [false, true]) {
      const alt = locale === "es" ? "Foto del CMS" : "CMS photo";
      const source = media("/original.png", {
        alt, mimeType: "image/png", width: 2400, height: 1800,
        ...(hasSocial ? { sizes: { social: { url: "/social.jpg", width: 1200, height: 900, mimeType: "image/jpeg" } } } : {}),
      });
      const expected = hasSocial
        ? { url: `${siteUrl}/social.jpg`, alt, width: 1200, height: 900, type: "image/jpeg" }
        : { url: `${siteUrl}/original.png`, alt, width: 2400, height: 1800, type: "image/png" };
      const social = buildSocialMetadata({
        title: "Title", description: "Description", ...pageAlternates(siteUrl, locale, ""),
        locale, image: shareImage(source, siteUrl),
      });
      const og = await resolveOpenGraph(social.openGraph, new URL(siteUrl), Promise.resolve(`/${locale}`), context, null);
      const twitter = resolveTwitter(social.twitter, new URL(siteUrl), context, null);
      for (const image of [og?.images?.[0], twitter?.images?.[0]]) {
        assert.ok(image && typeof image === "object" && "url" in image);
        assert.deepEqual({ ...image, url: image.url.toString() }, expected);
      }
    }
  }
});

test("room images use the first valid gallery photo and fall back only when none exist", () => {
  const general = shareImage(media("/hero.jpg"), siteUrl);
  const room = { gallery: [
    { image: 9 }, { image: media("javascript:invalid") },
    { image: media("/first-room.jpg", { alt: "Room photo" }) }, { image: media("/second-room.jpg") },
  ] };
  assert.equal(roomShareImage(room, siteUrl)?.url, `${siteUrl}/first-room.jpg`);
  assert.equal(roomShareImage(room, siteUrl)?.alt, "Room photo");
  for (const gallery of [undefined, null, [], [{ image: 9 }], [{ image: media("/document.pdf", { mimeType: "application/pdf" }) }]]) {
    assert.equal(roomShareImage({ gallery }, siteUrl), undefined);
    assert.deepEqual(roomShareImage({ gallery }, siteUrl) ?? general, general);
  }
});

test("social variants do not change which room photograph is selected", () => {
  const first = media("/first-room.png", { mimeType: "image/png" });
  const second = media("/second-room.png", {
    sizes: { social: { url: "/second-room-social.jpg", mimeType: "image/jpeg" } },
  });
  assert.equal(roomShareImage({ gallery: [{ image: first }, { image: second }] }, siteUrl)?.url, `${siteUrl}/first-room.png`);
  const firstWithSocial = { ...first, sizes: { social: { url: "/first-room-social.jpg", mimeType: "image/jpeg" } } };
  assert.equal(roomShareImage({ gallery: [{ image: firstWithSocial }, { image: second }] }, siteUrl)?.url, `${siteUrl}/first-room-social.jpg`);
});

test("every public page shares its own localized texts, clean canonical and reciprocal locale", async () => {
  const context = { trailingSlash: false, isStaticMetadataRouteFile: false };
  for (const path of publicPagePaths) {
    for (const locale of seoLocales) {
      const title = locale === "es" ? "Título de página | Los Licenciados" : "Page title | Los Licenciados";
      const description = locale === "es" ? "Descripción localizada." : "Localized description.";
      const alternates = pageAlternates(siteUrl, locale, path);
      const image = shareImage(media("/hero.jpg", { alt: locale === "es" ? "Foto del CMS" : "CMS photo" }), siteUrl);
      const social = buildSocialMetadata({ title, description, ...alternates, locale, image });
      // Resolve using the installed Next.js version, including a parent title
      // template, to catch accidental duplication of the business name.
      const og = await resolveOpenGraph(social.openGraph, new URL(siteUrl), Promise.resolve(`/${locale}${path}`), context, "%s | Los Licenciados");
      const twitter = resolveTwitter(social.twitter, new URL(siteUrl), context, "%s | Los Licenciados");
      assert.equal(og?.title.absolute, title);
      assert.equal(twitter?.title.absolute, title);
      assert.equal(og?.description, description);
      assert.equal(twitter?.description, description);
      assert.equal(og?.url, alternates.canonical);
      assert.equal(og?.siteName, "Hospedaje Los Licenciados");
      assert.ok(og && "type" in og);
      assert.equal(og.type, "website");
      assert.equal(og?.locale, locale === "es" ? "es_PE" : "en_US");
      assert.deepEqual(og?.alternateLocale, [locale === "es" ? "en_US" : "es_PE"]);
      assert.equal(twitter?.card, "summary_large_image");
      const ogImage = og?.images?.[0];
      assert.ok(ogImage && typeof ogImage === "object" && "url" in ogImage);
      assert.equal(ogImage.url.toString(), image?.url);
      assert.equal(twitter?.images?.[0].url.toString(), image?.url);
      assert.equal(twitter?.images?.[0].alt, image?.alt);
      assert.equal(twitter?.site, null);
      assert.equal(twitter?.creator, null);
    }
  }
});

test("room metadata keeps its own image, slug and texts without declaring an absent translation", async () => {
  const room = { id: 1, name: "Individual", slug: "individual", capacity: 1, bathroomType: "private" as const };
  const versions = roomVersionsById(siteUrl, { es: [room], en: [] }).get(room.id)!;
  const social = buildSocialMetadata({
    ...buildRoomMetadata(room, "es"), canonical: versions.es!.url, languages: roomLanguages(versions),
    locale: "es", image: shareImage(media("/room.jpg"), siteUrl),
  });
  const og = await resolveOpenGraph(social.openGraph, new URL(siteUrl), Promise.resolve("/es/room/individual?showGallery=true"),
    { trailingSlash: false, isStaticMetadataRouteFile: false }, null);
  assert.equal(og?.url, `${siteUrl}/es/room/individual`);
  assert.equal(og?.title.absolute, "Individual | Los Licenciados");
  assert.deepEqual(og?.alternateLocale, []);
  const ogImage = og?.images?.[0];
  assert.ok(ogImage && typeof ogImage === "object" && "url" in ogImage);
  assert.equal(ogImage.url.toString(), `${siteUrl}/room.jpg`);
});

test("no valid image selects summary and produces no social image links", () => {
  const social = buildSocialMetadata({
    title: "Our rooms", description: "Description", locale: "en",
    ...pageAlternates(siteUrl, "en", "/rooms"),
  });
  assert.equal(social.twitter?.card, "summary");
  assert.deepEqual(social.openGraph?.images, []);
  assert.deepEqual(social.twitter?.images, []);
});
