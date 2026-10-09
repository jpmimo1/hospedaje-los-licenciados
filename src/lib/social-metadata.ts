import type { Metadata } from "next";
import type { Media, Room } from "@/payload-types";
import type { SeoLocale } from "./seo-urls";

type MediaSource = Pick<Media, "url" | "alt" | "width" | "height" | "mimeType">;
export type ShareImage = { url: string; alt?: string; width?: number; height?: number };

// Use the original Media URL and its dimensions, never a resized thumbnail.
export function shareImage(media: MediaSource | number | null | undefined, siteUrl: string): ShareImage | undefined {
  if (!media || typeof media !== "object") return;
  if (media.mimeType && !media.mimeType.startsWith("image/")) return;
  const source = media.url?.trim();
  if (!source || (!source.startsWith("/") && !/^https?:\/\//i.test(source))) return;
  try {
    const url = new URL(source, siteUrl);
    if (!["http:", "https:"].includes(url.protocol) || url.username || url.password) return;
    const image: ShareImage = { url: url.href };
    const alt = media.alt?.trim();
    if (alt) image.alt = alt;
    for (const dimension of ["width", "height"] as const) {
      const value = media[dimension];
      if (typeof value === "number" && Number.isInteger(value) && value > 0) image[dimension] = value;
    }
    return image;
  } catch {
    return;
  }
}

export function roomShareImage(room: Pick<Room, "gallery">, siteUrl: string) {
  for (const photo of room.gallery ?? []) {
    const image = shareImage(photo.image, siteUrl);
    if (image) return image;
  }
}

type SocialMetadataInput = {
  title: string;
  description: string;
  canonical: string;
  languages: Partial<Record<SeoLocale, string>>;
  locale: SeoLocale;
  image?: ShareImage;
};

export function buildSocialMetadata({
  title, description, canonical, languages, locale, image,
}: SocialMetadataInput) {
  const otherLocale = locale === "es" ? "en" : "es";
  const ogLocales = { es: "es_PE", en: "en_US" };
  return {
    openGraph: {
      type: "website",
      siteName: "Hospedaje Los Licenciados",
      title: { absolute: title },
      description,
      url: canonical,
      locale: ogLocales[locale],
      alternateLocale: languages[otherLocale] ? [ogLocales[otherLocale]] : [],
      images: image ? [image] : [],
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title: { absolute: title },
      description,
      images: image ? [{ url: image.url, ...(image.alt ? { alt: image.alt } : {}) }] : [],
    },
  } satisfies Pick<Metadata, "openGraph" | "twitter">;
}
