import type { Metadata } from "next";
import type { Media, Room } from "@/payload-types";
import type { SeoLocale } from "./seo-urls";

type ImageFile = Pick<Media, "url" | "width" | "height" | "mimeType">;
type MediaSource = ImageFile & Pick<Media, "alt" | "sizes">;
export type ShareImage = { url: string; alt?: string; width?: number; height?: number; type?: string };

function imageFromFile(file: ImageFile | null | undefined, siteUrl: string, alt?: string): ShareImage | undefined {
  if (!file) return;
  const mimeType = file.mimeType?.trim();
  if (mimeType && !mimeType.startsWith("image/")) return;
  const source = file.url?.trim();
  if (!source || (!source.startsWith("/") && !/^https?:\/\//i.test(source))) return;
  try {
    const url = new URL(source, siteUrl);
    if (!["http:", "https:"].includes(url.protocol) || url.username || url.password) return;
    const image: ShareImage = { url: url.href };
    if (alt) image.alt = alt;
    if (mimeType) image.type = mimeType;
    for (const dimension of ["width", "height"] as const) {
      const value = file[dimension];
      if (typeof value === "number" && Number.isInteger(value) && value > 0) image[dimension] = value;
    }
    return image;
  } catch {
    return;
  }
}

export function shareImage(media: MediaSource | number | null | undefined, siteUrl: string): ShareImage | undefined {
  if (!media || typeof media !== "object") return;
  const alt = media.alt?.trim();
  // Keep the selected file's URL, dimensions and MIME together. Missing social
  // metadata must never be filled with dimensions or MIME from the original.
  return imageFromFile(media.sizes?.social, siteUrl, alt) ?? imageFromFile(media, siteUrl, alt);
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
      images: image ? [image] : [],
    },
  } satisfies Pick<Metadata, "openGraph" | "twitter">;
}
