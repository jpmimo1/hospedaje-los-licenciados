// Accept a language range and an optional HTTP quality value (0–1, up to
// three decimal places). Ignore malformed entries instead of guessing a q.
const languagePreference = /^\s*([a-z]{1,8}(?:-[a-z0-9]{1,8})*|\*)\s*(?:;\s*q\s*=\s*(0(?:\.\d{0,3})?|1(?:\.0{0,3})?)\s*)?$/i;

export function negotiateLocale(
  acceptLanguage: string | null,
  supportedLocales: readonly string[],
  defaultLocale: string,
) {
  let selected = defaultLocale;
  let highestQuality = 0;

  for (const preference of (acceptLanguage ?? "").split(",")) {
    const match = languagePreference.exec(preference);
    if (!match) continue;

    const quality = match[2] === undefined ? 1 : Number(match[2]);
    if (quality === 0 || quality <= highestQuality) continue;

    const language = match[1].split("-")[0].toLowerCase();
    const locale = supportedLocales.find((candidate) => candidate === language);
    if (!locale) continue;

    selected = locale;
    highestQuality = quality;
  }

  return selected;
}
