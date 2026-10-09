import assert from "node:assert/strict";
import test from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import { LodgingJsonLd } from "./LodgingJsonLd";

test("server markup contains a single parseable lodging script with one identity across ES/EN", () => {
  for (const locale of ["es", "en"] as const) {
    const address = locale === "es" ? "Dirección del CMS" : "CMS address";
    const html = renderToStaticMarkup(<LodgingJsonLd siteUrl="https://example.com" locale={locale}
      siteContent={{}} contactSettings={{ address }} />);
    const scripts = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
    assert.equal(scripts.length, 1);
    const data = JSON.parse(scripts[0][1]);
    assert.equal(data["@context"], "https://schema.org");
    assert.equal(data["@type"], "LodgingBusiness");
    assert.equal(data["@id"], "https://example.com/#lodging");
    assert.equal(data.url, `https://example.com/${locale}`);
    assert.equal(data.address, address);
  }
});

test("escaping less-than preserves CMS text while preventing a closing script or injected markup", () => {
  const address = 'Dirección </script><script>alert("x")</script> < & >';
  const html = renderToStaticMarkup(<LodgingJsonLd siteUrl="https://example.com" locale="es"
    siteContent={{}} contactSettings={{ address }} />);
  assert.equal((html.match(/<script\b/g) ?? []).length, 1);
  assert.equal((html.match(/<\/script>/g) ?? []).length, 1);
  const content = /<script[^>]*>([\s\S]*?)<\/script>/.exec(html)![1];
  assert.equal(content.includes("<"), false);
  assert.ok(content.includes("\\u003c/script>"));
  assert.equal(JSON.parse(content).address, address);
});
