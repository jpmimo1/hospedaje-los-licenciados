import "server-only";
import { cache } from "react";
import { getPayload } from "payload";
import configPromise from "@payload-config";
import { getLocalizedMediaAlts } from "./get-localized-media-alts";
import { withLocalizedMediaAlt } from "./photo-alt";

// Share the global and its strictly localized hero alt between metadata and
// page rendering. React cache lasts only for the current render request.
export const getSiteContent = cache(async (locale: Locales) => {
  const payload = await getPayload({ config: configPromise });
  const content = await payload.findGlobal({ slug: "site-content", locale });
  if (!content.heroImage || typeof content.heroImage !== "object") return content;

  const alts = await getLocalizedMediaAlts(payload, locale, [content.heroImage]);
  return { ...content, heroImage: withLocalizedMediaAlt(content.heroImage, alts) };
});
