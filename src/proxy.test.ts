import assert from "node:assert/strict";
import test from "node:test";
import { NextRequest } from "next/server";
import { proxy } from "./proxy";

const origin = "https://example.com";

function request(path: string, acceptLanguage?: string) {
  return new NextRequest(`${origin}${path}`, {
    headers: acceptLanguage === undefined ? {} : { "accept-language": acceptLanguage },
  });
}

test("language redirects respect q priorities, regional variants and the order of ties", () => {
  const cases = [
    ["es-PE,es;q=1,en;q=0.1", "es"],
    ["en-US,en;q=0.9,es;q=0.5", "en"],
    ["fr-FR,es;q=0.8,en;q=0.6", "es"],
    ["en;q=0,es;q=0.5", "es"],
    ["en;q=0.8,es;q=0.8", "en"],
    ["es;q=0.8,en;q=0.8", "es"],
    ["es;q=0,en;q=0.5", "en"],
    ["es;q=0.9,en", "en"],
    ["en;q=0.9,es-PE", "es"],
    ["en-US,es", "en"],
    [" EN-us ; Q = 0.800 , es;q=0.5 ", "en"],
  ];
  for (const [header, locale] of cases) {
    const response = proxy(request("/rooms", header));
    assert.equal(response?.status, 307, header);
    assert.equal(response?.headers.get("location"), `${origin}/${locale}/rooms`, header);
  }
});

test("missing, unsupported or invalid preferences safely use Spanish", () => {
  for (const header of [undefined, "", " ", "fr-FR,de;q=0.9", "*", "en;q=0,es;q=0", "nonsense", "en;q=NaN", "en;q=2", "en;q=-0.1", "en;q=0.8junk", "en;q=0.9999", "en_US", "en;q=", "en;q=0.8;q=1"]) {
    assert.equal(proxy(request("/", header))?.headers.get("location"), `${origin}/es`, header);
  }
  assert.equal(proxy(request("/rooms", "en;q=invalid,es;q=0.5"))?.headers.get("location"), `${origin}/es/rooms`);
  assert.equal(proxy(request("/rooms", "invalid;stuff,en;q=0.7"))?.headers.get("location"), `${origin}/en/rooms`);
});

test("explicit locale URLs pass through even with a preference for the other language", () => {
  for (const path of ["/en", "/en/", "/en/rooms", "/en/room/family?showGallery=true"]) {
    const req = request(path, "es-PE,es;q=1,en;q=0.1");
    assert.equal(proxy(req), undefined);
    assert.equal(req.nextUrl.href, `${origin}${path}`);
  }
  for (const path of ["/es", "/es/", "/es/contact", "/es/room/familiar?showGallery=true"]) {
    const req = request(path, "en-US,en;q=1,es;q=0.1");
    assert.equal(proxy(req), undefined);
    assert.equal(req.nextUrl.href, `${origin}${path}`);
  }
});

test("redirects preserve the original path and query parameters", () => {
  const paths = [
    ["/rooms?campaign=a&campaign=b&showGallery=true", "/en/rooms?campaign=a&campaign=b&showGallery=true"],
    ["/room/familiar?query=hola%20Cusco&return=%2Frooms", "/en/room/familiar?query=hola%20Cusco&return=%2Frooms"],
    ["/about/", "/en/about/"],
    ["/?source=maps", "/en?source=maps"],
  ];
  for (const [path, expected] of paths) {
    const req = request(path, "en-US");
    const original = req.nextUrl.href;
    assert.equal(proxy(req)?.headers.get("location"), `${origin}${expected}`);
    assert.equal(req.nextUrl.href, original, "do not mutate the incoming URL");
  }
});

test("existing admin, API and resource exclusions never acquire a locale prefix", () => {
  for (const path of [
    "/robots.txt", "/sitemap.xml", "/robots.txt?source=test", "/sitemap.xml?source=test",
    "/admin", "/admin/collections/rooms", "/api/rooms", "/api/media/file/photo.jpg",
    "/_next/static/chunk.js", "/_next/image?url=%2Fphoto.jpg&w=640&q=75", "/logo.svg", "/favicon.ico",
  ]) {
    const req = request(path, "en-US");
    assert.equal(proxy(req), undefined, path);
    assert.equal(req.nextUrl.href, `${origin}${path}`);
  }
});
