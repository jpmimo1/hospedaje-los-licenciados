import type { ContactSetting, SiteContent } from "@/payload-types";
import { formatPeruvianPhone } from "./format-phone";
import { pageAlternates } from "./seo-urls";

export type LodgingJsonLdInput = {
  siteUrl: string;
  locale: Locales;
  siteContent: Partial<Pick<SiteContent, "heroImage">>;
  contactSettings: Partial<Pick<ContactSetting,
    "phone" | "address" | "structuredAddress" | "latitude" | "longitude" | "checkInTime" | "checkOutTime"
  >>;
};

type PostalAddressData = {
  "@type": "PostalAddress";
  streetAddress: string;
  addressLocality: string;
  addressRegion: string;
  addressCountry: string;
  postalCode?: string;
};

type LodgingData = {
  "@context": "https://schema.org";
  "@type": "LodgingBusiness";
  "@id": string;
  name: string;
  url: string;
  telephone?: string;
  address?: string | PostalAddressData;
  geo?: { "@type": "GeoCoordinates"; latitude: number; longitude: number };
  image?: string;
  checkinTime?: string;
  checkoutTime?: string;
};

function normalizeAddressText(value: unknown) {
  return typeof value === "string" ? value.trim().replace(/\s+/g, " ") : "";
}

function postalAddress(value: ContactSetting["structuredAddress"]): PostalAddressData | undefined {
  if (!value || typeof value !== "object") return;
  const streetAddress = normalizeAddressText(value.streetAddress);
  const addressLocality = normalizeAddressText(value.addressLocality);
  const addressRegion = normalizeAddressText(value.addressRegion);
  const addressCountry = normalizeAddressText(value.addressCountry).toUpperCase();
  // Address components remain free text; the country must be a two-letter code.
  if (!streetAddress || !addressLocality || !addressRegion || !/^[A-Z]{2}$/.test(addressCountry)) return;
  const address: PostalAddressData = {
    "@type": "PostalAddress", streetAddress, addressLocality, addressRegion, addressCountry,
  };
  const postalCode = normalizeAddressText(value.postalCode);
  if (postalCode) address.postalCode = postalCode;
  return address;
}

function internationalPhone(value: unknown) {
  if (typeof value !== "string" || !/^\+?[\d\s()-]+$/.test(value.trim())) return;
  const phone = formatPeruvianPhone(value).replace(/[\s()-]/g, "");
  return /^\+[1-9]\d{6,14}$/.test(phone) ? phone : undefined;
}

function normalizeTime(value: unknown) {
  if (typeof value !== "string") return;
  // Recognize H:mm or HH:mm, optional seconds, and the existing "hrs" suffix.
  const match = /^(\d{1,2}):(\d{2})(?::(\d{2}))?(?:\s+hrs)?$/i.exec(value.trim());
  if (!match) return;
  const hour = Number(match[1]);
  const minute = Number(match[2]);
  const second = Number(match[3] ?? "0");
  if (hour > 23 || minute > 59 || second > 59) return;
  return [hour, minute, second].map((part) => String(part).padStart(2, "0")).join(":");
}

function absoluteImageUrl(value: unknown, siteUrl: string) {
  if (typeof value !== "string") return;
  const source = value.trim();
  // Payload serves root-relative or absolute HTTP(S) URLs. Do not turn
  // arbitrary text, a query alone or a fragment alone into an image URL.
  if (!source.startsWith("/") && !/^https?:\/\//i.test(source)) return;
  try {
    const url = new URL(source, siteUrl);
    if (!["http:", "https:"].includes(url.protocol) || url.username || url.password) return;
    return url.href;
  } catch {
    return;
  }
}

export function buildLodgingJsonLd({
  siteUrl, locale, siteContent, contactSettings,
}: LodgingJsonLdInput): LodgingData {
  const data: LodgingData = {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    "@id": `${siteUrl}/#lodging`,
    name: "Hospedaje Los Licenciados",
    url: pageAlternates(siteUrl, locale, "").canonical,
  };

  const telephone = internationalPhone(contactSettings.phone);
  if (telephone) data.telephone = telephone;
  const address = typeof contactSettings.address === "string" ? contactSettings.address.trim() : "";
  const structuredAddress = postalAddress(contactSettings.structuredAddress);
  if (structuredAddress) data.address = structuredAddress;
  else if (address) data.address = address;

  const { latitude, longitude } = contactSettings;
  if (typeof latitude === "number" && Number.isFinite(latitude) && latitude >= -90 && latitude <= 90 &&
      typeof longitude === "number" && Number.isFinite(longitude) && longitude >= -180 && longitude <= 180) {
    data.geo = { "@type": "GeoCoordinates", latitude, longitude };
  }

  const heroImage = siteContent.heroImage;
  if (heroImage && typeof heroImage === "object") {
    const image = absoluteImageUrl(heroImage.url, siteUrl);
    if (image) data.image = image;
  }

  const checkinTime = normalizeTime(contactSettings.checkInTime);
  if (checkinTime) data.checkinTime = checkinTime;
  const checkoutTime = normalizeTime(contactSettings.checkOutTime);
  if (checkoutTime) data.checkoutTime = checkoutTime;
  return data;
}
