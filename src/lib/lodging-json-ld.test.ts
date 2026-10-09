import assert from "node:assert/strict";
import test from "node:test";
import type { Media } from "@/payload-types";
import { buildLodgingJsonLd, type LodgingJsonLdInput } from "./lodging-json-ld";
import { formatPeruvianPhone } from "./format-phone";

const siteUrl = "https://example.com";
const media = (url?: string | null): Media => ({
  id: 1, alt: "Photo", url, createdAt: "2026-10-08T00:00:00Z", updatedAt: "2026-10-08T00:00:00Z",
});
const input: LodgingJsonLdInput = {
  siteUrl, locale: "es", siteContent: { heroImage: media("/api/media/file/hero.jpg?prefix=media") },
  contactSettings: { phone: "51946639138", address: "Dirección del CMS, Cusco", latitude: -13.532, longitude: -71.967,
    checkInTime: "14:00 hrs", checkOutTime: "10:00 hrs" },
};

test("uses only the supplied business data and the localized canonical with one stable identity", () => {
  const original = structuredClone(input);
  const es = buildLodgingJsonLd(input);
  const en = buildLodgingJsonLd({ ...input, locale: "en", contactSettings: { ...input.contactSettings, address: "CMS address, Cusco" } });
  assert.deepEqual(es, {
    "@context": "https://schema.org", "@type": "LodgingBusiness", "@id": `${siteUrl}/#lodging`,
    name: "Hospedaje Los Licenciados", url: `${siteUrl}/es`, telephone: "+51946639138",
    address: input.contactSettings.address, geo: { "@type": "GeoCoordinates", latitude: -13.532, longitude: -71.967 },
    image: `${siteUrl}/api/media/file/hero.jpg?prefix=media`, checkinTime: "14:00:00", checkoutTime: "10:00:00",
  });
  assert.equal(en["@id"], es["@id"]);
  assert.equal(en.url, `${siteUrl}/en`);
  assert.equal(en.address, "CMS address, Cusco");
  assert.deepEqual(input, original);
});

test("international telephone normalization leaves the existing display formatter unchanged", () => {
  for (const phone of ["51946639138", "+51 946 639 138", "946639138", "+51 (946) 639-138"]) {
    assert.equal(buildLodgingJsonLd({ ...input, contactSettings: { phone } }).telephone, "+51946639138");
    assert.equal(formatPeruvianPhone(phone), "+51 946 639 138");
  }
  assert.equal(buildLodgingJsonLd({ ...input, contactSettings: { phone: "+1 (212) 555-0100" } }).telephone, "+12125550100");
  for (const phone of ["", " ", "12345", "123456789012345", "++51946639138", "+51946639138 ext 2", "+051946639138", "+1234567890123456"]) {
    assert.equal(buildLodgingJsonLd({ ...input, contactSettings: { phone } }).telephone, undefined);
  }
});

test("geo requires two finite numbers in range and never coerces absent values to zero", () => {
  for (const geo of [
    {}, { latitude: -13.5 }, { longitude: -71.9 }, { latitude: null, longitude: null },
    { latitude: "-13.5", longitude: "-71.9" }, { latitude: NaN, longitude: -71.9 },
    { latitude: -13.5, longitude: Infinity }, { latitude: 90.001, longitude: 0 },
    { latitude: -90.001, longitude: 0 }, { latitude: 0, longitude: 180.001 }, { latitude: 0, longitude: -180.001 },
  ]) {
    assert.equal(buildLodgingJsonLd({ ...input, contactSettings: geo as LodgingJsonLdInput["contactSettings"] }).geo, undefined);
  }
  for (const geo of [{ latitude: 0, longitude: 0 }, { latitude: 90, longitude: 180 }, { latitude: -90, longitude: -180 }]) {
    assert.deepEqual(buildLodgingJsonLd({ ...input, contactSettings: geo }).geo, { "@type": "GeoCoordinates", ...geo });
  }
});

test("image uses a populated relationship and a valid HTTP(S) URL, without inventing a URL from text", () => {
  for (const heroImage of [undefined, 1, media(), media(null), media(""), media(" "), media("not a URL"),
    media("javascript:alert(1)"), media("data:image/png;base64,AAAA"), media("ftp://example.com/photo.jpg"),
    media("https://"), media("https://bad host/photo.jpg"), media("?photo=1"), media("#photo")]) {
    assert.equal(buildLodgingJsonLd({ ...input, siteContent: { heroImage } }).image, undefined);
  }
  for (const [url, expected] of [
    ["/api/media/file/hero.jpg", `${siteUrl}/api/media/file/hero.jpg`],
    ["https://cdn.example.com/photo.jpg", "https://cdn.example.com/photo.jpg"],
    ["//cdn.example.com/photo.jpg", "https://cdn.example.com/photo.jpg"],
  ]) {
    assert.equal(buildLodgingJsonLd({ ...input, siteContent: { heroImage: media(url) } }).image, expected);
  }
});

test("recognized times normalize to HH:mm:ss, while impossible or ambiguous times are omitted", () => {
  for (const [time, expected] of [["14:00 hrs", "14:00:00"], ["9:05", "09:05:00"], ["00:00:00", "00:00:00"],
    ["23:59:59", "23:59:59"], [" 10:30:45 HRS ", "10:30:45"]]) {
    const result = buildLodgingJsonLd({ ...input, contactSettings: { checkInTime: time, checkOutTime: time } });
    assert.equal(result.checkinTime, expected);
    assert.equal(result.checkoutTime, expected);
  }
  for (const time of ["", " ", "24:00", "-1:00", "12:60", "12:00:60", "12:30:99", "9:5", "2 pm", "14:00-16:00", "desde las 14:00", "14:00:00Z"]) {
    const result = buildLodgingJsonLd({ ...input, contactSettings: { checkInTime: time, checkOutTime: time } });
    assert.equal(result.checkinTime, undefined, time);
    assert.equal(result.checkoutTime, undefined, time);
  }
});

test("empty optional fields remain absent and never introduce postal address components or other claims", () => {
  const result = buildLodgingJsonLd({ siteUrl, locale: "en", siteContent: {}, contactSettings: { address: " " } });
  assert.deepEqual(Object.keys(result), ["@context", "@type", "@id", "name", "url"]);
  assert.equal(result.address, undefined);
});

const structuredAddress = {
  streetAddress: "Calle de prueba 123",
  addressLocality: "San Sebastián",
  addressRegion: "Cusco",
  addressCountry: "PE",
};

test("complete structured addresses normalize spaces and country code without changing CMS data", () => {
  const contactSettings = {
    address: "Dirección visible del CMS",
    structuredAddress: {
      streetAddress: "  Calle\t de prueba   123 ",
      addressLocality: " San   Sebastián ",
      addressRegion: " Cusco\n",
      addressCountry: " pe ",
    },
  };
  const original = structuredClone(contactSettings);
  assert.deepEqual(buildLodgingJsonLd({ ...input, contactSettings }).address, {
    "@type": "PostalAddress", ...structuredAddress,
  });
  assert.deepEqual(contactSettings, original);
});

test("postal codes remain text with leading zeros, and empty optional codes are omitted", () => {
  for (const postalCode of ["08000", " 08000 "]) {
    assert.deepEqual(buildLodgingJsonLd({ ...input, contactSettings: {
      structuredAddress: { ...structuredAddress, postalCode },
    } }).address, { "@type": "PostalAddress", ...structuredAddress, postalCode: "08000" });
  }
  for (const postalCode of [undefined, null, "", "   "]) {
    assert.deepEqual(buildLodgingJsonLd({ ...input, contactSettings: {
      structuredAddress: { ...structuredAddress, postalCode },
    } }).address, { "@type": "PostalAddress", ...structuredAddress });
  }
});

test("incomplete structured addresses keep the text fallback without inferring missing components", () => {
  const address = "  Dirección localizada, San Sebastián, Cusco, PE  ";
  for (const key of Object.keys(structuredAddress) as (keyof typeof structuredAddress)[]) {
    for (const value of [undefined, null, "", " \t "]) {
      const partial = { ...structuredAddress, [key]: value };
      assert.equal(buildLodgingJsonLd({ ...input, contactSettings: {
        address, structuredAddress: partial,
      } }).address, address.trim(), `${key}: ${value}`);
      assert.equal(buildLodgingJsonLd({ ...input, contactSettings: {
        structuredAddress: partial,
      } }).address, undefined);
    }
  }
  for (const partial of [undefined, null, {}]) {
    // Exercise a null group at runtime even though generated types omit it.
    const contactSettings = { address, structuredAddress: partial } as unknown as LodgingJsonLdInput["contactSettings"];
    assert.equal(buildLodgingJsonLd({ ...input, contactSettings }).address, address.trim());
  }
});

test("invalid country formats and non-text address components use the existing text fallback", () => {
  for (const addressCountry of ["Perú", "P", "PER", "P1", "P E", "🇵🇪"]) {
    assert.equal(buildLodgingJsonLd({ ...input, contactSettings: {
      ...input.contactSettings, structuredAddress: { ...structuredAddress, addressCountry },
    } }).address, input.contactSettings.address);
  }
  for (const key of Object.keys(structuredAddress) as (keyof typeof structuredAddress)[]) {
    const contactSettings = {
      ...input.contactSettings, structuredAddress: { ...structuredAddress, [key]: 123 },
    } as unknown as LodgingJsonLdInput["contactSettings"];
    assert.equal(buildLodgingJsonLd({ ...input, contactSettings }).address, input.contactSettings.address);
  }
});
